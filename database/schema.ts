import {
  pgTable,
  timestamp,
  pgEnum,
  text,
  integer,
  primaryKey,
  PgColumn,
} from "drizzle-orm/pg-core";
import { AdapterAccountType } from "next-auth/adapters";

export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);
export const MEMBER_ROLE = pgEnum("member_role", ["ADMIN", "MEMBER"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"),
  role: ROLE_ENUM("role").default("USER"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const workspaces = pgTable("workspace", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  joinCode: text("join_code").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const members = pgTable("member", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: MEMBER_ROLE("role").notNull().default("MEMBER"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const channels = pgTable("channel", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const conversations = pgTable("conversation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  memberOneId: text("memberOneId")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  memberTwoId: text("memberTwoId")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const messages = pgTable("message", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  image: text("image"),
  workspaceId: text("workspaceId")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  memberId: text("memberId")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  channelId: text("channelId").references(() => channels.id, {
    onDelete: "cascade",
  }),
  conversationId: text("conversationId").references(() => conversations.id, {
    onDelete: "cascade",
  }),
  parentMessageId: text("parentMessageId").references(
    (): PgColumn => messages.id,
    {
      onDelete: "cascade",
    },
  ),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
