import { ValidationPipe } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CreateUserInput } from "../user/inputs/create-user.input";
import { AuthPayloadType } from "./auth-payload.type";
import { AuthService } from "./auth.service";
import { LoginInput } from "./inputs/login.input";
import { RefreshAccessTokenInput } from "./inputs/refresh-access-token.input";
import { SocialNetworkLogInInput } from "./inputs/social-network-login.input";
import { ValidateEmailConfirmationInput } from "./inputs/validate-email-confirmation.input";
import { RefreshTokenPayload } from "./types/refresh-token.type";

@Resolver("Auth")
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayloadType, { description: "Login as user" })
  async login(@Args("loginInput") loginInput: LoginInput) {
    return this.authService.login(loginInput, false);
  }

  @Mutation(() => AuthPayloadType, { description: "Login as admin" })
  async loginAdmin(@Args("loginInput") loginInput: LoginInput) {
    return this.authService.login(loginInput, true);
  }

  @Mutation(() => RefreshTokenPayload, {
    description: "Get new access token",
  })
  async refreshAccessToken(
    @Args("refreshAccessTokenInput")
    refreshAccessTokenInput: RefreshAccessTokenInput,
  ): Promise<RefreshTokenPayload> {
    const { user } = await this.authService.resolveRefreshToken(
      refreshAccessTokenInput.refreshToken,
    );

    const newToken: string = await this.authService.createAccessTokenFromRefreshToken(
      user,
    );

    return { accessToken: newToken };
  }

  @Mutation(() => AuthPayloadType, { description: "Create a user" })
  async signup(
    @Args("signUpInput", ValidationPipe) createUserInput: CreateUserInput,
  ) {
    return this.authService.signUp(createUserInput);
  }

  @Mutation(() => Boolean, { description: "Re send email confirmation" })
  async reSendEmailConfirmation(@Args("email") email: string) {
    return this.authService.reSendEmailConfirmation(email);
  }

  @Mutation(() => Boolean, { description: "Validate email confirmation" })
  async validateEmailConfirmation(
    @Args("validateEmailConfirmationInput", ValidationPipe)
    validateEmailConfirmationInput: ValidateEmailConfirmationInput,
  ) {
    return this.authService.validateEmailConfirmation(
      validateEmailConfirmationInput,
    );
  }

  @Mutation(() => AuthPayloadType, {
    description: "Login with Facebook account",
  })
  async loginWithFacebook(
    @Args("facebookLogInInput") facebookLogInInput: SocialNetworkLogInInput,
  ) {
    return this.authService.loginWithFacebook(facebookLogInInput);
  }

  @Mutation(() => AuthPayloadType, {
    description: "Login with Google account",
  })
  async loginWithGoogle(
    @Args("googleLogInInput") googleLogInInput: SocialNetworkLogInInput,
  ) {
    return this.authService.loginWithGoogle(googleLogInInput);
  }

  @Mutation(() => AuthPayloadType, {
    description: "Login with LinkedIn account",
  })
  async loginWithLinkedIn(
    @Args("linkedinLogInInput") linkedinLogInInput: SocialNetworkLogInInput,
  ) {
    return this.authService.loginWithLinkedIn(linkedinLogInInput);
  }
}
