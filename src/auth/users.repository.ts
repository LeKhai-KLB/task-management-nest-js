import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthCredentials } from "./dto/auth-credentitials.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(authCredentitials: AuthCredentials): Promise<void> {
    const { username, password } = authCredentitials;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.repository.create({
      username,
      password: hashPassword,
    });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === "23505")
        throw new ConflictException("user name already exists");
      else throw new InternalServerErrorException();
    }
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  getInstance(): Repository<User> {
    return this.repository;
  }
}
