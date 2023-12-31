import { User } from "@prisma/client";
import { Prettify } from "../utils";

export type UserDangerProps =
  | "email"
  | "school42Id"
  | "isTfaEnabled"
  | "createdAt"
  | "updatedAt";

export type GameProfile = Prettify<
  Omit<User, UserDangerProps> & {
    nbWins: number;
    nbLoses: number;
    isFriend: boolean;
  }
>;
