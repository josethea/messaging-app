import "next-auth";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: string;
  provider: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
