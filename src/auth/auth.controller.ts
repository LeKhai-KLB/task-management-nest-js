import { Body, Controller, Post, UseGuards, Req } from "@nestjs/common";
import { AuthCredentials } from "./dto/auth-credentitials.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(@Body() authCredentitials: AuthCredentials): Promise<void> {
    return this.authService.signUp(authCredentitials);
  }

  @Post("/signin")
  signIn(
    @Body() authCredentitials: AuthCredentials,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentitials);
  }

  @Post("/test")
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
