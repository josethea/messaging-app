"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { notifications } from "@/database/schema";
import { and, eq, sql } from "drizzle-orm";

export const createNotification = async ({
  workspaceId,
  memberId,
  channelId,
  conversationId,
  messageId,
  read,
}: {
  workspaceId: string;
  memberId: string;
  channelId?: string;
  conversationId?: string;
  messageId: string;
  read: boolean;
}): Promise<NotificationMessage | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  if (!workspaceId) {
    console.log("Workspace not found");
    return null;
  }

  if (!memberId) {
    console.log("Member was not provided");
    return null;
  }

  const notification = await db
    .insert(notifications)
    .values({
      workspaceId,
      memberId,
      channelId,
      conversationId,
      messageId,
      read,
    })
    .returning();

  return notification[0] as NotificationMessage;
};

export const markNotificationsAsRead = async ({
  workspaceId,
  memberId,
  channelId,
  conversationId,
}: {
  workspaceId: string;
  memberId: string;
  channelId?: string;
  conversationId?: string;
}): Promise<boolean> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return false;
  }

  if (!workspaceId) {
    console.log("Workspace not found");
    return false;
  }

  if (!memberId) {
    console.log("Member was not provided");
    return false;
  }

  await db
    .update(notifications)
    .set({ read: true })
    .where(
      and(
        eq(notifications.workspaceId, workspaceId),
        eq(notifications.memberId, memberId),
        eq(notifications.read, false),
        channelId ? eq(notifications.channelId, channelId) : undefined,
        conversationId
          ? eq(notifications.conversationId, conversationId)
          : undefined,
      ),
    );

  return true;
};

export const getUnreadNotificationsNumber = async ({
  workspaceId,
  memberId,
  channelId,
  conversationId,
}: {
  workspaceId: string;
  memberId: string;
  channelId?: string;
  conversationId?: string;
}): Promise<number | null> => {
  if (!workspaceId) {
    console.log("Workspace not found");
    return null;
  }

  if (!memberId) {
    console.log("Member was not provided");
    return null;
  }

  const data = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.workspaceId, workspaceId),
        eq(notifications.memberId, memberId),
        eq(notifications.read, false),
        channelId ? eq(notifications.channelId, channelId) : undefined,
        conversationId
          ? eq(notifications.conversationId, conversationId)
          : undefined,
      ),
    );

  return Number(data[0].count);
};
