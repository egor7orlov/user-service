import { UserEntity } from "../../db/entities/user.entity";
import { Repository } from "typeorm";
import { dbDataSource } from "../../db/datasource";
import { NotFound } from "http-errors";

class UserService {
  private static instance: UserService;

  private constructor(
    private readonly userRepo: Repository<UserEntity>
  ) {}

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService(
        dbDataSource.getRepository(UserEntity)
      );
    }

    return UserService.instance;
  }

  async getUserByEmailOrFail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFound("User not found");
    }

    return user;
  }
}

export const userServiceInstance = UserService.getInstance();
