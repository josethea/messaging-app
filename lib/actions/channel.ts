"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { channels } from "@/database/schema";
import { eq } from "drizzle-orm";

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
    .where(eq(channels.workspaceId, workspaceId));

  return data as Channel[];
};

export const createChannel = async ({
  name,
  description,
  workspaceId,
}: {
  name: string;
  description: string;
  workspaceId: string;
}): Promise<string | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
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

  return channel[0].id;
};
