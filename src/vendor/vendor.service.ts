import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UploadDto } from "@nodrize/nodrize/dist/dto/upload.dto";
import { UserInputError } from "apollo-server-express";
import * as bcrypt from "bcryptjs";
import { I18nRequestScopeService } from "nestjs-i18n";
import { CommonService } from "src/common/common.service";
import { RoleService } from "src/role/role.service";
import { User } from "src/user/schemas/user.schema";
import { UserRepository } from "src/user/user.repository";
import { v4 as uuid } from "uuid";
import { VendorStatusEnum } from "./enum/vendor-status.enum";
import { CreateVendorUserInput } from "./inputs/create-vendor-user.input";
import { CreateVendorInput } from "./inputs/create-vendor.input";
import { DeleteVendorUserInput } from "./inputs/delete-vendor-user.input";
import { UpdateVendorUserInput } from "./inputs/update-vendor-user.input";
import { UpdateVendorInput } from "./inputs/update-vendor.input";
import { VendorBanner } from "./types/vendor-banner.type";
import { VendorRepository } from "./vendor.repository";
import { Vendor } from "./vendor.schema";

const sharp = require("sharp");

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name)
    private readonly vendorRepository: VendorRepository,
    private readonly userRepository: UserRepository,
    private readonly commonService: CommonService,
    private readonly i18n: I18nRequestScopeService,
    private readonly roleService: RoleService,
  ) {}

  async create(
    createVendorInput: CreateVendorInput,
    user: User,
  ): Promise<Vendor> {
    // * check if vendor with same name already exists
    const storedVendor: Vendor = await this.vendorRepository.findOne({
      name: createVendorInput.name,
    });

    if (storedVendor)
      throw new UserInputError(
        await this.i18n.translate("errors.VENDOR_ALREADY_EXISTS"),
      );

    const vendor = await this.vendorRepository.create({
      id: uuid(),
      slug: this.commonService.generateSlug(createVendorInput.name, "-", true),
      createdAt: new Date(),
      status: VendorStatusEnum.ACTIVE,
      ...createVendorInput,
    });

    // * search for role named as ADMIN
    let adminRole = await this.roleService.getRoleByName("ADMIN");

    if (!adminRole) {
      adminRole = await this.roleService.createRoleWithVendor(
        {
          id: uuid(),
          name: "ADMIN",
          routes: [],
          editable: false,
          deletable: false,
        },
        vendor.id,
      );
    }

    // * we add the vendor to the user as a selectedVendor and
    // * also we add the user to the vendor as ADMIN
    await this.userRepository.findOneAndUpdate(
      { id: user.id },
      {
        $addToSet: { roles: { vendor: vendor.id, role: adminRole.id } },
        selectedVendor: vendor.id,
      },
    );

    return vendor.save();
  }

  async getVendorById(id: string): Promise<Vendor> {
    return this.vendorRepository.findOne({ id });
  }

  async getVendorBySlug(slug: string): Promise<Vendor> {
    const vendor: Vendor = await this.vendorRepository.findOne({ slug });
    if (!vendor)
      throw new UserInputError(
        await this.i18n.translate("errors.VENDOR_NOT_EXISTS"),
      );
    return vendor;
  }

  async getAll(): Promise<Vendor[]> {
    return this.vendorRepository.find({});
  }

  async getSlugFromHostname(hostname: string): Promise<string> {
    const storedVendor = await this.vendorRepository.findOne({
      domains: hostname,
    });

    if (storedVendor) {
      return storedVendor.slug;
    }

    return null;
  }

  async getVendorBanners(vendor: string): Promise<VendorBanner[]> {
    const storedVendor: Vendor = await this.getVendorById(vendor);

    if (!storedVendor)
      throw new UserInputError(
        await this.i18n.translate("errors.VENDOR_NOT_EXISTS"),
      );

    return storedVendor.banners;
  }

  async createVendorUser(
    createVendorUserInput: CreateVendorUserInput,
    user: User,
  ): Promise<User> {
    // * first we need to validate if the user already exists
    const storedUser: User = await this.userRepository.findOne({
      email: createVendorUserInput.email,
      deleted: false,
    });

    if (storedUser)
      throw new UserInputError(
        await this.i18n.t("errors.USER_ALREADY_EXISTS"),
        {
          args: {
            email: createVendorUserInput.email,
          },
        },
      );

    // * we create the user
    const newUser = await this.userRepository.create({
      id: uuid(),
      name: createVendorUserInput.name,
      lastname: createVendorUserInput.lastname,
      email: createVendorUserInput.email,
      password: await bcrypt.hash(createVendorUserInput.password, 11),
      createdAt: new Date(),
      updatedAt: new Date(),
      selectedVendor: user.selectedVendor,
      roles: [
        { vendor: user.selectedVendor, role: createVendorUserInput.roles },
      ],
      deleted: false,
    });

    return newUser.save();
  }

  async updateVendor(
    updatedVendor: UpdateVendorInput,
    user: User,
  ): Promise<Vendor> {
    const storedVendor: Vendor = await this.vendorRepository.findOne({
      id: updatedVendor.id,
    });

    if (!storedVendor)
      throw new UserInputError(
        await this.i18n.translate("errors.VENDOR_NOT_EXISTS"),
      );

    const { logo, banners, thumbnail } = updatedVendor;

    let updatedVendorObj = {
      logo: logo ? logo : storedVendor.logo,
      banners: banners ? banners : storedVendor.banners,
      thumbnail: thumbnail ? thumbnail : storedVendor.thumbnail,
      colors: updatedVendor.colors ? updatedVendor.colors : storedVendor.colors,
      address: updatedVendor.address
        ? updatedVendor.address
        : storedVendor.address,
    };

    if (logo) {
      const matches = logo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (matches && matches[0].includes("base64")) {
        const uploadDto: UploadDto = {
          data: logo,
          filename: `${uuid()}.${matches[1].split("/")[1]}`,
          path: `${storedVendor.id}/logos`,
        };

        updatedVendorObj.logo = await this.commonService.upload(uploadDto);
      }
    }

    if (thumbnail) {
      const matches = thumbnail.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      if (matches && matches[0].includes("base64")) {
        const uploadDto: UploadDto = {
          data: thumbnail,
          filename: `${uuid()}.${matches[1].split("/")[1]}`,
          path: `${storedVendor.id}/thumbnails`,
        };

        updatedVendorObj.thumbnail = await this.commonService.upload(uploadDto);
      }
    }

    if (banners?.length) {
      for (const banner of banners) {
        const matches = banner.bannerUrl.match(
          /^data:([A-Za-z-+\/]+);base64,(.+)$/,
        );

        if (matches && matches[0].includes("base64")) {
          const imageBuffer = Buffer.from(
            banner.bannerUrl.split(",")[1],
            "base64",
          );

          const sharpBuffer = await sharp(imageBuffer)
            .resize(1000)
            .png({ compressionLevel: 8 })
            .toBuffer();

          const sharpB64 = Buffer.from(sharpBuffer).toString("base64");

          const uploadDto: UploadDto = {
            data: `${banner.bannerUrl.split(",")[0]},${sharpB64}`,
            filename: `${uuid()}.${matches[1].split("/")[1]}`,
            path: `${storedVendor.id}/banners`,
          };

          const newBanner = await this.commonService.upload(uploadDto);
          banner.bannerUrl = newBanner;
        }

        banner.cta =
          banner && banner.cta?.substring(0, 5) !== "https"
            ? `https://${banner.cta}`
            : banner.cta;
        banner.modal = banner.modal;
      }

      updatedVendorObj = {
        ...updatedVendorObj,
        banners: banners,
      };
    }

    return this.vendorRepository.findOneAndUpdate(
      { id: storedVendor.id },
      { ...updatedVendor, ...updatedVendorObj },
    );
  }

  async updateVendorUser(
    updateVendorUserInput: UpdateVendorUserInput,
  ): Promise<User> {
    // * first we need to validate if the user already exists
    const storedUser: User = await this.userRepository.findOne({
      email: updateVendorUserInput.email,
    });

    if (!storedUser)
      throw new UserInputError(await this.i18n.t("errors.USER_NOT_EXISTS"));

    if (updateVendorUserInput.password) {
      updateVendorUserInput.password = await bcrypt.hash(
        updateVendorUserInput.password,
        11,
      );
    } else {
      updateVendorUserInput.password = storedUser.password;
    }

    const otherVendorRoles = storedUser.roles.filter(
      role => role.vendor !== storedUser.selectedVendor,
    );

    // * we update the user
    return await this.userRepository.findOneAndUpdate(
      { id: storedUser.id },
      {
        ...updateVendorUserInput,
        roles: [
          {
            vendor: storedUser.selectedVendor,
            role: updateVendorUserInput.roles,
          },
          ...otherVendorRoles,
        ],
      },
    );
  }

  async vendorUsers(user: User): Promise<User[]> {
    return this.userRepository.find({
      "roles.vendor": user.selectedVendor,
    });
  }

  async deleteVendorUser(
    { id }: DeleteVendorUserInput,
    user: User,
  ): Promise<User> {
    const storedUser = await this.userRepository.findOne({ id });

    if (!storedUser)
      throw new UserInputError(
        await this.i18n.translate("errors.USER_NOT_EXISTS", {
          args: { id },
        }),
      );

    storedUser.roles = storedUser.roles.filter(
      role => role.vendor !== user.selectedVendor,
    );

    if (storedUser.selectedVendor === user.selectedVendor) {
      if (storedUser.roles.length) {
        storedUser.selectedVendor = storedUser.roles[0].vendor;
      } else {
        storedUser.selectedVendor = null;
      }
    }

    return storedUser.save();
  }
}
