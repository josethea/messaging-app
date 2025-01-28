"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { channels } from "@/database/schema";
import { desc, eq } from "drizzle-orm";

export const getChannels = async (
  workspaceId: string | null,
): Promise<Channel[]> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return [] as Channel[];
  }

  if (!workspaceId) {
    console.log("Workspace not found");
    return [] as Channel[];
  }

  const data = await db
    .select()
    .from(channels)
    .where(eq(channels.workspaceId, workspaceId))
    .orderBy(desc(channels.createdAt));

  return data as Channel[];
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
