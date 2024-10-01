import { UserEntity } from "../db/entities/user.entity";
import { Repository } from "typeorm";
import { dbDataSource } from "../db/datasource";

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

  async getUserByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
    });
  }
}

export const userServiceInstance = UserService.getInstance();
