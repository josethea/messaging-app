"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { channels, members } from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";
import { getUnreadNotificationsNumber } from "./notification";

export const getChannels = async (
  workspaceId: string | null,
): Promise<ChannelsData[]> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return [] as ChannelsData[];
  }

  if (!workspaceId) {
    console.log("Workspace not found");
    return [] as ChannelsData[];
  }

  const member = await db
    .select()
    .from(members)
    .where(
      and(
        eq(members.userId, session.user.id!),
        eq(members.workspaceId, workspaceId),
      ),
    )
    .limit(1);

  if (member.length === 0) {
    console.log("Member not found");
    return [] as ChannelsData[];
  }

  const data = await db
    .select()
    .from(channels)
    .where(eq(channels.workspaceId, workspaceId))
    .orderBy(desc(channels.createdAt));

  const channelsData = [] as ChannelsData[];

  for (const item of data) {
    const unreadMessages = await getUnreadNotificationsNumber({
      workspaceId,
      memberId: member[0].id,
      channelId: item.id,
      conversationId: undefined,
    });

    channelsData.push({
      unreadCount: unreadMessages ?? 0,
      channel: item as Channel,
    });
  }

  return channelsData;
};

export const getLastChannel = async (
  workspaceId: string | null,
): Promise<Channel | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  if (!workspaceId) {
    console.log("Workspace not found");
    return null;
  }

  const data = await db
    .select()
    .from(channels)
    .where(eq(channels.workspaceId, workspaceId))
    .orderBy(desc(channels.createdAt))
    .limit(1);

  if (data.length === 0) {
    return null;
  }

  return data[0] as Channel;
};

export const createChannel = async ({
  name,
  description,
  workspaceId,
}: {
  name: string;
  description: string;
  workspaceId?: string;
}): Promise<Channel | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  if (!workspaceId) {
    console.log("Workspace not found");
    return null;
  }

  const channel = await db
    .insert(channels)
    .values({
      name,
      description,
      workspaceId,
    })
    .returning();

  return channel[0] as Channel;
};

export const getChannel = async (
  channelId: string | null,
): Promise<Channel | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  if (!channelId) {
    console.log("Channel not found");
    return null;
  }

  const data = await db
    .select()
    .from(channels)
    .where(eq(channels.id, channelId));

  return data[0] as Channel;
};
