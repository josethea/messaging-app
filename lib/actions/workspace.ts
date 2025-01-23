"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { channels, members, workspaces } from "@/database/schema";
import { desc, eq } from "drizzle-orm";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () =>
      "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)],
  ).join("");
  return code;
};

export const getWorkspaces = async (): Promise<Workspace[]> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return [] as Workspace[];
  }

  const data = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, session.user.id!))
    .orderBy(desc(workspaces.createdAt));

  return data as Workspace[];
};

export const createWorkspace = async ({
  name,
}: {
  name: string;
}): Promise<string | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  const joinCode = generateCode();

  const workspace = await db
    .insert(workspaces)
    .values({
      name,
      joinCode,
      userId: session.user.id!,
    })
    .returning();

  await db.insert(members).values({
    userId: session.user.id!,
    workspaceId: workspace[0].id,
    role: "ADMIN",
  });

  await db.insert(channels).values({
    name: "General",
    workspaceId: workspace[0].id,
  });

  return workspace[0].id;
};
