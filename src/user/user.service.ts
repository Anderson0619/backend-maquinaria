import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendEmailDto } from "@nodrize/nodrize/dist/dto/send-email.dto";
import { UploadDto } from "@nodrize/nodrize/dist/dto/upload.dto";
import { UserInputError } from "apollo-server-express";
import * as bcrypt from "bcryptjs";
import { I18nRequestScopeService } from "nestjs-i18n";
import { DEFAULT_ROUTES } from "src/customization/menu/contants";
import { EmailTemplateEnum } from "src/helpers/email-templates";
import { RoutePathEnum } from "src/role/enums/route-path.enum";
import { Role } from "src/role/role.schema";
import { RoleService } from "src/role/role.service";
import { VendorService } from "src/vendor/vendor.service";
import { v4 as uuid } from "uuid";
import { CommonService } from "../common/common.service";
import { UserNetworkTypeEnum } from "./enums/user-network-type.enum";
import { ChangePasswordRequestInput } from "./inputs/change-password-request.input";
import { ChangePasswordInput } from "./inputs/change-password.input";
import { CreateUserInput } from "./inputs/create-user.input";
import { UpdateProfileInput } from "./inputs/update-profile.input";
import { UpdateUserSelectedVendorInput } from "./inputs/update-user-seleceted-vendor.input";
import { UpdateUserInput } from "./inputs/update-user.input";
import { User } from "./schemas/user.schema";
import { UserVendorListType } from "./types/user-vendor-list.type";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commonService: CommonService,
    private readonly i18n: I18nRequestScopeService,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly vendorService: VendorService,
  ) {}

  async create({
    name,
    email,
    vendor,
    networkType,
    roles,
    password,
    active,
    lastname,
    root = false,
  }: CreateUserInput): Promise<User> {
    const storedUser: User = await this.getUserByEmail(email);

    if (storedUser)
      throw new UserInputError(
        await this.i18n.translate("errors.USER_ALREADY_EXISTS", {
          args: { email },
        }),
      );

    const createdUser = await this.userRepository.create({
      id: uuid(),
      name,
      email,
      roles: roles ? [{ roles, vendor }] : [],
      active,
      profileImage:
        this.configService.get<string>("GENERAL_DEFAULT_AVATAR") || "",
      selectedVendor: vendor || "",
      networkType: networkType || UserNetworkTypeEnum.WEB,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: await bcrypt.hash(password, 11),
      lastname,
      root,
    });

    return createdUser.save();
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async getUsersByIds(ids: string[]): Promise<User[]> {
    return this.userRepository.find({ where: { id: { $in: ids } } });
  }

  async passwordReset(
    passwordRecovery: ChangePasswordRequestInput,
  ): Promise<User> {
    const { email } = passwordRecovery;
    const storedUser = await this.userRepository.findOne({ email });

    if (!storedUser)
      throw new UserInputError(
        await this.i18n.translate("errors.USER_EMAIL_NOT_REGISTERED", {
          args: { email },
        }),
      );

    const recoveryPasswordToken = uuid();

    const sendEmailDto: SendEmailDto = {
      to: [{ email: storedUser.email, name: storedUser.name }],
      from: "no-reply@nodrize.com",
      subject: await this.i18n.translate("errors.CHANGE_PASSWORD_SUBJECT"),
      dynamicTemplateData: {
        username: storedUser.name,
        url: `${this.configService.get<string>(
          "GENERAL_SITE_HOST",
        )}/recover?tkn=${recoveryPasswordToken}&userId=${storedUser.id}`,
      },
      templateId: this.configService.get<string>("RESET_PASSWORD_TEMPLATE"),
      sendMultiple: false,
    };

    this.commonService.sendEmail(sendEmailDto);

    return this.userRepository.findOneAndUpdate(
      { id: storedUser.id },
      {
        recoveryPasswordToken,
      },
    );
  }

  async doPasswordReset({
    userId,
    passwordRecoveryToken,
    password,
  }: ChangePasswordInput): Promise<User> {
    const storedUser = await this.getUserById(userId);

    if (
      !storedUser ||
      storedUser.recoveryPasswordToken !== passwordRecoveryToken
    )
      throw new UserInputError(await this.i18n.translate("errors.BAD_LOGIN"));

    const hashedPassword = await bcrypt.hash(password, 11);

    const sendEmailDto: SendEmailDto = {
      to: [{ email: storedUser.email, name: storedUser.name }],
      from: "no-reply@nodrize.com",
      subject: await this.i18n.translate(
        "errors.CHANGE_PASSWORD_SUCCESS_SUBJECT",
      ),
      dynamicTemplateData: {
        username: storedUser.name,
      },
      templateId: EmailTemplateEnum.SUCCESS_RESET_PASSWORD_TEMPLATE,
      sendMultiple: false,
    };

    this.commonService.sendEmail(sendEmailDto);

    return this.userRepository.findOneAndUpdate(
      { id: storedUser.id },
      {
        recoveryPasswordToken: null,
        password: hashedPassword,
      },
    );
  }

  async updateUserRole(id: string, roles: string[]): Promise<User> {
    const storedUser = await this.getUserById(id);

    if (!storedUser)
      throw new UserInputError(
        await this.i18n.translate("errors.USER_NOT_EXISTS"),
      );

    return this.userRepository.findOneAndUpdate(
      { id: storedUser.id },
      {
        roles: {
          $addToSet: {
            roles,
          },
        },
      },
    );
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const storedUser = await this.getUserById(updateUserInput.id);

    if (!storedUser)
      throw new UserInputError(
        await this.i18n.translate("errors.USER_NOT_EXISTS"),
      );

    return this.userRepository.findOneAndUpdate(
      { id: storedUser.id },
      {
        name: updateUserInput.name,
        lastmane: updateUserInput.lastname,
        email: updateUserInput.email,
      },
    );
  }

  async updateProfile(
    updateProfileInput: UpdateProfileInput,
    { id }: User,
  ): Promise<User> {
    const { profileImage } = updateProfileInput;

    if (profileImage) {
      const matches = profileImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (matches && matches[0].includes("base64")) {
        const uploadDto: UploadDto = {
          data: profileImage,
          filename: `${uuid()}.${matches[1].split("/")[1]}`,
          path: `${id}/avatar`,
        };

        updateProfileInput.profileImage = await this.commonService.upload(
          uploadDto,
        );
      }
    }

    return this.userRepository.findOneAndUpdate(
      { id },
      { ...updateProfileInput },
    );
  }

  async updateRandom4digits(email: string): Promise<boolean> {
    const storedUser = await this.getUserByEmail(email);
    const random4digits = Math.floor(1000 + Math.random() * 9000);
    storedUser.random4digits = random4digits;
    const updatedUser = await this.userRepository.findOneAndUpdate(
      {
        id: storedUser.id,
      },
      {
        random4digits: random4digits,
      },
    );

    return !!updatedUser;
  }

  async validateRandom4digits(
    email: string,
    random4digits: number,
  ): Promise<boolean> {
    const storedUser = await this.getUserByEmail(email);

    if (storedUser.random4digits !== random4digits) return false;

    // * we active the user if random4 digits are valid
    storedUser.active = true;

    await this.userRepository.findOneAndUpdate(
      { id: storedUser.id },
      { active: true },
    );

    return true;
  }

  async updateUserSelectedVendor(
    { vendor }: UpdateUserSelectedVendorInput,
    user: User,
  ): Promise<User> {
    return this.userRepository.findOneAndUpdate(
      { id: user.id },
      { selectedVendor: vendor },
    );
  }

  async getUserVendorRoles(user: User): Promise<Role[]> {
    if (user.root) {
      return [await this.roleService.getRoleByName("ADMIN")];
    }

    return this.roleService.getRolesByIds(
      user.roles.find(x => x.vendor === user.selectedVendor)?.role || [],
    );
  }

  async getUserRoutes(user: User): Promise<RoutePathEnum[]> {
    if (user.root) {
      return Object.values(RoutePathEnum);
    }

    let acummulatedRoutes: RoutePathEnum[] = [...DEFAULT_ROUTES];

    if (!user.selectedVendor) return acummulatedRoutes;

    // * get all roles of the user
    const userRoles = await this.getUserVendorRoles(user);

    userRoles.forEach(role => {
      acummulatedRoutes = [...acummulatedRoutes, ...role.routes];
    });

    return acummulatedRoutes;
  }

  async getUserVendors(user: User): Promise<UserVendorListType[]> {
    const vendorList: UserVendorListType[] = [];

    if (user.root) {
      const storedVendors = await this.vendorService.getAll();

      const permissions = storedVendors.map(vendor => {
        vendorList.push({
          id: vendor.id,
          name: vendor.name,
        });
      });

      await Promise.all(permissions);

      return storedVendors;
    }

    return vendorList;
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find({
      deleted: false,
    });
  }
}
