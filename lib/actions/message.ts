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

  const totalCount = await db
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
    );

  const messagesData = await db
    .select()
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
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  const messagesWithUsers = await Promise.all(
    messagesData.map(async (item) => {
      const memberData = await db
        .select()
        .from(members)
        .where(eq(members.id, item.memberId))
        .limit(1);

      const userData =
        memberData.length > 0
          ? await db
              .select()
              .from(users)
              .where(eq(users.id, memberData[0]?.userId))
              .limit(1)
          : [];

      if (memberData.length === 0 || userData.length === 0) {
        return null;
      }

      return {
        ...item,
        totalCount: Number(totalCount[0].count),
        member: {
          id: memberData[0].id,
          userId: memberData[0].userId,
          workspaceId: memberData[0].workspaceId,
          role: memberData[0].role,
        },
        user: {
          id: userData[0].id,
          name: userData[0].name,
          email: userData[0].email,
          image: userData[0].image,
        },
      };
    }),
  );

  return messagesWithUsers.filter(
    (message) => message !== null,
  ) as MessagePopulate[];
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
