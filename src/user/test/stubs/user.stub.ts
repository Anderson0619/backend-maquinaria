import { UserNetworkTypeEnum } from "../../../user/enums/user-network-type.enum";
import { User } from "../../schemas/user.schema";

export const userStub = (): User => {
  return {
    id: "123",
    email: "test@example.com",
    name: "Test User",
    profileImage: "",
    selectedVendor: "",
    networkType: UserNetworkTypeEnum.WEB,
    roles: [],
    active: true,
    password: "",
    deleted: false,
  };
};
