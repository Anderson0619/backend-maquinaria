import { HttpService } from "@nestjs/axios";
import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { SendEmailDto } from "@nodrize/nodrize/dist/dto/send-email.dto";
import {
  ApolloError,
  AuthenticationError,
  UserInputError,
} from "apollo-server-express";
import * as bcrypt from "bcryptjs";
import { TokenExpiredError } from "jsonwebtoken";
import { I18nRequestScopeService } from "nestjs-i18n";
import { lastValueFrom } from "rxjs";
import { CommonService } from "src/common/common.service";
import { EmailTemplateEnum } from "src/helpers/email-templates";
import DocumentModel from "src/helpers/types/document-model.type";
import { RoleService } from "src/role/role.service";
import { User } from "src/user/schemas/user.schema";
import { VendorService } from "src/vendor/vendor.service";
import { v4 as uuid } from "uuid";
import { UserNetworkTypeEnum } from "../user/enums/user-network-type.enum";
import { CreateUserInput } from "../user/inputs/create-user.input";
import { UserService } from "../user/user.service";
import { AuthPayloadType } from "./auth-payload.type";
import { LoginInput } from "./inputs/login.input";
import { SocialNetworkLogInInput } from "./inputs/social-network-login.input";
import { ValidateEmailConfirmationInput } from "./inputs/validate-email-confirmation.input";
import {
  RefreshToken,
  RefreshTokenDocument,
} from "./schemas/refresh-token.schema";
import { JwtPayloadType } from "./types/jwt-payload.type";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: DocumentModel<
      RefreshTokenDocument,
      RefreshToken
    >,
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly httpService: HttpService,
    private readonly i18n: I18nRequestScopeService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly vendorService: VendorService,
  ) {}

  async validate({ id }): Promise<User> {
    const user = await this.userService.getUserById(id);

    if (!user) {
      try {
        throw new UserInputError(
          await this.i18n.t("errors.USER_NOT_AUTHORIZED"),
        );
      } catch (error) {
        throw new UserInputError("AUTHENTICATION_ERROR");
      }
    }

    return user;
  }

  async login(
    loginInput: LoginInput,
    admin: boolean,
  ): Promise<AuthPayloadType> {
    const { email, password } = loginInput;

    const user = await this.userService.getUserByEmail(email.toLowerCase());

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UserInputError(await this.i18n.t("errors.BAD_LOGIN"));

    const payload: JwtPayloadType = {
      id: user.id,
    };

    const refreshToken = await this.generateRefreshToken(
      user.id,
      this.configService.get("JWT_REFRESH_TOKEN_TIME"),
    );

    const authPayload: AuthPayloadType = {
      accessToken: await this.jwt.signAsync(payload, {
        expiresIn: this.configService.get<string>("JWT_EXPIRATION_TIME"),
      }),
      refreshToken,
    };

    const userRoles = await this.roleService.getRolesByIds(
      user.roles.find(x => x.vendor === user.selectedVendor)?.role || [],
    );

    const atLeastAdminOnce = userRoles.some(role => role.name === "ADMIN");

    if (admin && !atLeastAdminOnce)
      throw new UserInputError(
        await this.i18n.translate("errors.USER_NOT_AUTHORIZED"),
      );

    return authPayload;
  }

  async signUp(
    createUserInput: CreateUserInput,
    lang = "en",
  ): Promise<AuthPayloadType> {
    const storeduser = await this.userService.getUserByEmail(
      createUserInput.email,
    );

    const vendors = await this.vendorService.getAll();

    if (storeduser) {
      throw new UserInputError(
        await this.i18n.translate("errors.EMAIL_ALREADY_EXISTS", {
          args: { email: createUserInput.email },
        }),
      );
    }

    // * if this is the first user we need to make it root admin
    const user = await this.userService.create({
      ...createUserInput,
      root: !vendors.length,
    });

    if (!vendors.length) {
      // * we create the first vendor
      await this.vendorService.create(
        {
          name: "Default Vendor",
          description: "Default Vendor",
        },
        user,
      );
    }

    const sendEmailDto: SendEmailDto = {
      to: [
        {
          email: createUserInput.email,
          name: createUserInput.name,
        },
      ],
      from: "Nodrize <hello@nodrize.com>",
      subject: await this.i18n.translate("messages.WELCOME_EMAIL_SUBJECT"),
      dynamicTemplateData: {
        user_name: createUserInput.name,
        url: this.configService.get<string>("GENERAL_SITE_HOST"),
        text_footer: await this.i18n.t("messages.EMAIL_TEXT_FOOTER", {
          args: {
            year: new Date().getFullYear(),
          },
        }),
        es: lang === "es",
      },
      templateId: EmailTemplateEnum.WELCOME_EMAIL_TEMPLATE,
      sendMultiple: false,
    };

    this.commonService.sendEmail(sendEmailDto);

    return this.generateAuthJwtPayload(user);
  }

  async reSendEmailConfirmation(email: string): Promise<boolean> {
    return this.userService.updateRandom4digits(email);
  }

  async validateEmailConfirmation({
    random4digits,
    email,
  }: ValidateEmailConfirmationInput): Promise<boolean> {
    return this.userService.validateRandom4digits(email, random4digits);
  }

  async generateRefreshToken(userId: string, expiresIn: number) {
    const payload = { sub: userId };
    const token = await this.createRefreshToken(userId, expiresIn);

    return this.jwtService.signAsync(
      {
        ...payload,
        jwtId: token.id,
      },
      { expiresIn },
    );
  }

  async createRefreshToken(userId: string, ttl: number) {
    let parsedTtl = ttl;

    // * check if ttl is string
    if (typeof ttl === "string") {
      parsedTtl = await this.commonService.getDurationInSeconds(ttl);
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + parsedTtl);

    const newRefreshToken = new this.refreshTokenModel({
      id: uuid(),
      user: userId,
      expires: expiration,
      revoked: false,
      deleted: false,
    });

    return newRefreshToken.save();
  }

  async resolveRefreshToken(encoded: string) {
    try {
      const payload = await this.jwtService.verify(encoded);

      if (!payload.sub || !payload.jwtId) {
        throw new AuthenticationError(
          await this.i18n.translate("errors.REFRESH_TOKEN_MALFORMED"),
        );
      }

      const token = await this.refreshTokenModel.findOne({
        id: payload.jwtId,
      });

      if (!token) {
        throw new AuthenticationError(
          await this.i18n.translate("errors.INVALID_REFRESH_TOKEN"),
        );
      }

      if (token.revoked) {
        throw new AuthenticationError(
          await this.i18n.translate("errors.REFRESH_TOKEN_REVOKED"),
        );
      }

      const user = await this.userService.getUserById(payload.sub);

      if (!user) {
        throw new AuthenticationError(
          await this.i18n.translate("errors.REFRESH_TOKEN_MALFORMED"),
        );
      }

      return { user, token };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new ApolloError(
          await this.i18n.translate("errors.REFRESH_TOKEN_EXPIRED"),
          "REFRESH_TOKEN_EXPIRED",
        );
      } else {
        throw new ApolloError(
          await this.i18n.translate("errors.REFRESH_TOKEN_MALFORMED"),
          "REFRESH_TOKEN_MALFORMED",
        );
      }
    }
  }

  async loginWithFacebook({
    accessToken,
  }: SocialNetworkLogInInput): Promise<AuthPayloadType> {
    const facebookResponse = await lastValueFrom(
      this.httpService.get(
        `${this.configService.get<string>(
          "SOCIAL_FACEBOOK_GRAPH_URL",
        )}${accessToken}&fields=email,name,last_name,middle_name,first_name`,
      ),
    );

    const {
      data: { name, email, last_name, phone, first_name },
      status,
    } = facebookResponse;

    if (status !== HttpStatus.OK)
      throw new UserInputError(
        await this.i18n.translate("errors.SOCIAL_CNN_ERR", {
          args: { provider: UserNetworkTypeEnum.FACEBOOK },
        }),
      );

    if (!email)
      throw new UserInputError(
        await this.i18n.translate("errors.SOCIAL_PERMISSION_PROBLEMS", {
          args: { provider: UserNetworkTypeEnum.FACEBOOK },
        }),
      );

    const user: User = await this.createOrRetrieveUser(
      first_name ? first_name : name,
      email,
      phone,
      last_name,
      UserNetworkTypeEnum.FACEBOOK,
    );

    return this.generateAuthJwtPayload(user);
  }

  async loginWithGoogle({
    accessToken,
  }: SocialNetworkLogInInput): Promise<AuthPayloadType> {
    const googleResponse = await lastValueFrom(
      this.httpService.get(
        `${this.configService.get<string>(
          "SOCIAL_GOOGLE_AUTH_URL",
        )}${accessToken}`,
      ),
    );

    const {
      data: { name, email, family_name, phone },
      status,
    } = googleResponse;

    if (status !== HttpStatus.OK)
      throw new UserInputError(
        await this.i18n.translate("errors.SOCIAL_CNN_ERR", {
          args: { provider: UserNetworkTypeEnum.GOOGLE },
        }),
      );

    if (!email)
      throw new UserInputError(
        await this.i18n.translate("errors.SOCIAL_PERMISSION_PROBLEMS", {
          args: { provider: UserNetworkTypeEnum.GOOGLE },
        }),
      );

    const user: User = await this.createOrRetrieveUser(
      name,
      email.toLowerCase(),
      phone,
      family_name,
      UserNetworkTypeEnum.GOOGLE,
    );

    return this.generateAuthJwtPayload(user);
  }

  async loginWithLinkedIn({
    accessToken,
  }: SocialNetworkLogInInput): Promise<AuthPayloadType> {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const redirect_uri = this.configService.get<string>(
      "SOCIAL_LINKEDIN_REDIRECT_URI",
    );

    const client_secret = this.configService.get<string>(
      "SOCIAL_LINKEDIN_CLIENT_SECRET",
    );

    const client_id = this.configService.get<string>(
      "SOCIAL_LINKEDIN_CLIENT_ID",
    );

    const data = new URLSearchParams({
      grant_type: "authorization_code",
      code: accessToken,
      redirect_uri,
      client_id,
      client_secret,
    });

    try {
      const linkd = await lastValueFrom(
        this.httpService.post(
          this.configService.get<string>("SOCIAL_LINKEDIN_AUTH_URL"),
          data,
          { headers },
        ),
      );

      const headersMe = {
        Authorization: `Bearer ${linkd.data.access_token}`,
      };

      const linkedinResponse = await lastValueFrom(
        this.httpService.get(
          `${this.configService.get<string>("SOCIAL_LINKEDIN_ME_API")}/me`,
          {
            headers: headersMe,
          },
        ),
      );

      if (linkedinResponse.status !== HttpStatus.OK)
        throw new UserInputError(
          await this.i18n.translate("errors.SOCIAL_CNN_ERR", {
            args: { provider: UserNetworkTypeEnum.LINKEDIN },
          }),
        );

      const linkedinClientForEmail = await lastValueFrom(
        this.httpService.get(
          `${this.configService.get<string>(
            "SOCIAL_LINKEDIN_ME_API",
          )}/emailAddress?q=members&projection=(elements*(handle~))`,
          { headers: headersMe },
        ),
      );

      const {
        data: { localizedLastName, localizedFirstName },
      } = linkedinResponse;

      const email =
        linkedinClientForEmail.data.elements[0]["handle~"].emailAddress;

      const user = await this.createOrRetrieveUser(
        localizedFirstName,
        email.toLowerCase(),
        null,
        localizedLastName,
        UserNetworkTypeEnum.LINKEDIN,
      );

      return this.generateAuthJwtPayload(user);
    } catch (e) {
      throw new UserInputError(
        await this.i18n.translate("errors.SOCIAL_CNN_ERR", {
          args: { provider: UserNetworkTypeEnum.LINKEDIN },
        }),
      );
    }
  }

  async createAccessTokenFromRefreshToken(user: User): Promise<string> {
    const token = await this.generateAccessToken(user);

    return token;
  }

  async generateAccessToken(
    user: Pick<User, "id" | "selectedVendor" | "roles">,
  ) {
    const userRoles = await this.roleService.getRolesByIds(
      user.roles.find(x => x.vendor === user.selectedVendor)?.role || [],
    );

    const payload = {
      id: user.id?.toString(),
      role: userRoles,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>("JWT_EXPIRATION_TIME"),
    });
  }

  private async generateAuthJwtPayload(user: User): Promise<AuthPayloadType> {
    const payload: JwtPayloadType = {
      id: user.id,
    };

    const refreshToken = await this.generateRefreshToken(
      user.id,
      this.configService.get<number>("JWT_REFRESH_TOKEN_TIME"),
    );

    const authPayload: AuthPayloadType = {
      accessToken: this.jwt.sign(payload),
      refreshToken,
    };

    return authPayload;
  }

  private async createOrRetrieveUser(
    name: string,
    email: string,
    phone: string,
    lastname: string,
    networkType: UserNetworkTypeEnum,
  ): Promise<User> {
    const storedUser = await this.userService.getUserByEmail(
      email.trim().toLocaleLowerCase(),
    );

    if (storedUser) return storedUser;

    const createUserInput: CreateUserInput = {
      name,
      email,
      phone,
      lastname,
      roles: [],
      active: true,
      networkType,
    };

    return await this.userService.create(createUserInput);
  }
}
