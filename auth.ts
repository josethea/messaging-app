import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { db } from "./database/drizzle";
import { accounts, users } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import config from "./lib/config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) {
          return null;
        }

        if (!user[0].password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].name,
          image: user[0].image,
          role: user[0].role,
        } as User;
      },
    }),
    GithubProvider({
      clientId: config.env.authGithubId,
      clientSecret: config.env.authGithubSecret,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, token.sub))
        .limit(1);

      if (existingUser.length === 0) {
        return token;
      }

      token.id = existingUser[0].id;
      token.name = existingUser[0].name;
      token.role = existingUser[0].role;

      const existingAccount = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, existingUser[0].id))
        .limit(1);

      if (existingAccount.length === 0) {
        token.provider = "credentials";
      } else {
        token.provider = existingAccount[0].provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
});
