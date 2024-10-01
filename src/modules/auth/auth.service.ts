import { UserEntity } from "../../db/entities/user.entity";
import { Repository } from "typeorm";
import { Conflict, NotFound, Unauthorized } from "http-errors";
import bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { dbDataSource } from "../../db/datasource";

class AuthService {
  private static instance: AuthService;

  private constructor(private readonly userRepo: Repository<UserEntity>) {}

  public static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(
        dbDataSource.getRepository(UserEntity),
      );
    }

    return AuthService.instance;
  }

  async register({ email, password }: { email: string; password: string }) {
    const existingUser = await this.userRepo.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Conflict("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: passwordHash });

    await this.userRepo.save(user);

    const tokens = this.signTokens({ email, id: user.id });

    return {
      id: user.id,
      email: user.email,
      ...tokens,
    };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFound("User does not exist");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Unauthorized();
    }

    const tokens = this.signTokens({ email, id: user.id });

    return {
      id: user.id,
      email: user.email,
      ...tokens,
    };
  }

  verifyToken(token: string) {
    try {
      return verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new Unauthorized("Invalid token");
    }
  }

  private signTokens({ email, id }: { email: string; id: string }) {
    return {
      accessToken: sign({ email, id }, process.env.JWT_SECRET!, {
        expiresIn: "30m",
      }),
    };
  }
}

export const authServiceInstance = AuthService.getInstance();
