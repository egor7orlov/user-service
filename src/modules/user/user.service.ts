import { UserEntity } from "../../db/entities/user.entity";
import { Repository } from "typeorm";
import { NotFound } from "http-errors";

export class UserService {
  constructor(private readonly userRepo: Repository<UserEntity>) {}

  async getUserByEmailOrFail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFound("User not found");
    }

    return user;
  }

  async getManyUsersWithTotal({ page = 0, limit = 10 }: { page?: number; limit?: number }) {
    const [users, total] = await this.userRepo.findAndCount({
      skip: page * limit,
      take: limit,
    });

    return { users, total };
  }
}
