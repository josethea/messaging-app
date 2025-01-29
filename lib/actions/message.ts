"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { members, messages, users } from "@/database/schema";
import { and, desc, eq, lt, sql } from "drizzle-orm";

export const getMessages = async ({
  channelId,
  conversationId,
  parentMessageId,
  cursor,
  limit = 10,
}: {
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
  cursor?: Date;
  limit?: number;
}): Promise<MessagePopulate[]> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return [];
  }

  const [totalCount, messagesData] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(
        and(
          channelId ? eq(messages.channelId, channelId) : undefined,
          conversationId
            ? eq(messages.conversationId, conversationId)
            : undefined,
          parentMessageId
            ? eq(messages.parentMessageId, parentMessageId)
            : undefined,
          cursor ? lt(messages.createdAt, cursor) : undefined,
        ),
      ),
    db
      .select({
        message: messages,
        member: members,
        user: users,
      })
      .from(messages)
      .leftJoin(members, eq(messages.memberId, members.id))
      .leftJoin(users, eq(members.userId, users.id))
      .where(
        and(
          channelId ? eq(messages.channelId, channelId) : undefined,
          conversationId
            ? eq(messages.conversationId, conversationId)
            : undefined,
          parentMessageId
            ? eq(messages.parentMessageId, parentMessageId)
            : undefined,
          cursor ? lt(messages.createdAt, cursor) : undefined,
        ),
      )
      .orderBy(desc(messages.createdAt))
      .limit(limit),
  ]);

  return messagesData.map(({ message, member, user }) => ({
    ...message,
    totalCount: Number(totalCount[0].count),
    member: {
      id: member?.id,
      userId: member?.userId,
      workspaceId: member?.workspaceId,
      role: member?.role,
    },
    user: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      image: user?.image,
    },
  })) as MessagePopulate[];
};

export const createMessage = async ({
  content,
  image,
  workspaceId,
  channelId,
  conversationId,
  parentMessageId,
}: {
  content: string;
  image?: string;
  workspaceId: string;
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
}): Promise<MessagePopulate | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  const member = await db
    .select()
    .from(members)
    .where(
      and(
        eq(members.workspaceId, workspaceId),
        eq(members.userId, session.user.id!),
      ),
    )
    .limit(1);

  if (member.length === 0) {
    console.log("Member not found");
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, member[0].userId))
    .limit(1);

  if (user.length === 0) {
    console.log("User not found");
    return null;
  }

  const message = await db
    .insert(messages)
    .values({
      content,
      image,
      workspaceId,
      memberId: member[0].id,
      channelId,
      conversationId,
      parentMessageId,
    })
    .returning();

  if (message.length === 0) {
    console.log("Error trying to save message");
    return null;
  }

  return {
    ...message[0],
    member: {
      id: member[0].id,
      userId: member[0].userId,
      workspaceId: member[0].workspaceId,
      role: member[0].role,
    },
    user: {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      image: user[0].image,
    },
  } as MessagePopulate;
};
