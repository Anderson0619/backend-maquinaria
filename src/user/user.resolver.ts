import { UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guard/gql-auth.guard";
import { GqlUser } from "../customization/decorators/decorators";
import { VendorService } from "../vendor/vendor.service";
import { ChangePasswordRequestInput } from "./inputs/change-password-request.input";
import { ChangePasswordInput } from "./inputs/change-password.input";
import { UpdateProfileInput } from "./inputs/update-profile.input";
import { UpdateUserSelectedVendorInput } from "./inputs/update-user-seleceted-vendor.input";
import { UpdateUserInput } from "./inputs/update-user.input";
import { User } from "./schemas/user.schema";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly vendorService: VendorService,
  ) {}

  @Query(() => User, { description: "Get user information" })
  @UseGuards(GqlAuthGuard)
  user(@GqlUser() user: User): User {
    return user;
  }

  @Mutation(() => User, { description: "Updates user" })
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @Args("updateProfileInput") updateProfileInput: UpdateProfileInput,
    @GqlUser() user: User,
  ): Promise<User> {
    return this.userService.updateProfile(updateProfileInput, user);
  }

  @Mutation(() => User, { description: "Change password" })
  async changePassword(
    @Args("changePasswordRequestInput")
    changePasswordRequestInput: ChangePasswordRequestInput,
  ): Promise<User> {
    return this.userService.passwordReset(changePasswordRequestInput);
  }

  @Mutation(() => User, { description: "Do reset password" })
  async doResetPassword(
    @Args("changePasswordInput") changePasswordInput: ChangePasswordInput,
  ): Promise<User> {
    return this.userService.doPasswordReset(changePasswordInput);
  }

  @Mutation(() => User, { description: "Update user selected vendor" })
  @UseGuards(GqlAuthGuard)
  async updateUserSelectedVendor(
    @Args("updateUserSelectedVendorInput")
    updateUserSelectedVendorInput: UpdateUserSelectedVendorInput,
    @GqlUser() user: User,
  ): Promise<User> {
    return this.userService.updateUserSelectedVendor(
      updateUserSelectedVendorInput,
      user,
    );
  }

  @Mutation(() => User, { description: "Update user" })
  @UseGuards(GqlAuthGuard)
  async updateUser(@Args("updateUserInput") updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput);
  }

  @ResolveField()
  async selectedVendor(@Parent() user: User) {
    return this.vendorService.getVendorById(user.selectedVendor);
  }

  @ResolveField()
  async vendorList(@Parent() user: User) {
    return this.userService.getUserVendors(user);
  }

  @ResolveField()
  async vendorRoles(@Parent() user: User) {
    return this.userService.getUserVendorRoles(user);
  }

  @ResolveField()
  async userRoutes(@Parent() user: User) {
    return this.userService.getUserRoutes(user);
  }
}
