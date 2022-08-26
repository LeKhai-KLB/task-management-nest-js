import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthCredentials } from "./dto/auth-credentitials.dto";
import { UsersRepository } from "./users.repository";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./dto/jwt-payload.interface";
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentitials: AuthCredentials): Promise<void> {
    return this.usersRepository.createUser(authCredentitials);
  }

  async signIn(
    authCredentitials: AuthCredentials,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentitials;
    const user = await this.usersRepository
      .getInstance()
      .findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException("Please check your login credentitials");
    }
  }
}
