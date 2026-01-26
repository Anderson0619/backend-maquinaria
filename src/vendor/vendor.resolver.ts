import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/guard/gql-auth.guard";
import {
  GqlUser,
  VendorHostname,
} from "src/customization/decorators/decorators";
import { User } from "src/user/schemas/user.schema";
import { CreateVendorUserInput } from "./inputs/create-vendor-user.input";
import { CreateVendorInput } from "./inputs/create-vendor.input";
import { DeleteVendorUserInput } from "./inputs/delete-vendor-user.input";
import { GetVendorBannersInput } from "./inputs/get-vendor-banners.input";
import { UpdateVendorUserInput } from "./inputs/update-vendor-user.input";
import { UpdateVendorInput } from "./inputs/update-vendor.input";
import { VendorBanner } from "./types/vendor-banner.type";
import { Vendor } from "./vendor.schema";
import { VendorService } from "./vendor.service";

@Resolver(() => Vendor)
export class VendorResolver {
  constructor(private readonly vendorService: VendorService) {}

  @Query(() => Vendor, { description: "Get vendor by hostname" })
  async vendor(@VendorHostname() hostname: string): Promise<Vendor> {
    const slug = await this.vendorService.getSlugFromHostname(hostname);
    return this.vendorService.getVendorBySlug(slug);
  }

  @Query(() => Vendor)
  async vendorBySlug(@Args("slug") slug: string): Promise<Vendor> {
    return this.vendorService.getVendorBySlug(slug);
  }

  @Query(() => [Vendor], { description: "Get all the vendors" })
  async vendors(): Promise<Vendor[]> {
    return this.vendorService.getAll();
  }

  @Query(() => [VendorBanner], { description: "Get all the vendor banners" })
  async vendorBanners(
    @Args("getVendorBannersInput") { vendor }: GetVendorBannersInput,
  ): Promise<VendorBanner[]> {
    return this.vendorService.getVendorBanners(vendor);
  }

  @Query(() => Vendor, {
    description: "Get vendor by logged user (selectedVendor)",
  })
  @UseGuards(GqlAuthGuard)
  async userVendor(@GqlUser() user: User): Promise<Vendor> {
    return this.vendorService.getVendorById(user.selectedVendor);
  }

  @Query(() => Vendor, { description: "Get current vendor" })
  @UseGuards(GqlAuthGuard)
  async currentVendor(@GqlUser() user: User): Promise<Vendor> {
    return this.vendorService.getVendorById(user.selectedVendor);
  }

  @Query(() => [User], { description: "Get all vendor users" })
  @UseGuards(GqlAuthGuard)
  async vendorUsers(@GqlUser() user: User): Promise<User[]> {
    return this.vendorService.vendorUsers(user);
  }

  @Mutation(() => Vendor)
  @UseGuards(GqlAuthGuard)
  async createVendor(
    @Args("createVendorInput") createVendorInput: CreateVendorInput,
    @GqlUser() user: User,
  ): Promise<Vendor> {
    return this.vendorService.create(createVendorInput, user);
  }

  @Mutation(() => Vendor, { description: "Update vendor" })
  @UseGuards(GqlAuthGuard)
  async updateVendor(
    @Args("updateVendorInput") updateVendorInput: UpdateVendorInput,
    @GqlUser() user: User,
  ): Promise<Vendor> {
    return this.vendorService.updateVendor(updateVendorInput, user);
  }

  @Mutation(() => User, { description: "Create a user for this vendor" })
  @UseGuards(GqlAuthGuard)
  async createUserVendor(
    @Args("createVendorUserInput") input: CreateVendorUserInput,
    @GqlUser() user: User,
  ): Promise<User> {
    return this.vendorService.createVendorUser(input, user);
  }

  @Mutation(() => User, { description: "Update a user for this vendor" })
  @UseGuards(GqlAuthGuard)
  async updateUserVendor(
    @Args("updateVendorUserInput") input: UpdateVendorUserInput,
    @GqlUser() user: User,
  ): Promise<User> {
    return this.vendorService.updateVendorUser(input);
  }

  @Mutation(() => User, { description: "Delete user" })
  @UseGuards(GqlAuthGuard)
  async deleteVendorUser(
    @Args("deleteVendorUserInput") deleteVendorUserInput: DeleteVendorUserInput,
    @GqlUser() user: User,
  ): Promise<User> {
    return this.vendorService.deleteVendorUser(deleteVendorUserInput, user);
  }
}
