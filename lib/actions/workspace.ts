"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { channels, members, workspaces } from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";

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

  const membersData = await db
    .select()
    .from(members)
    .where(eq(members.userId, session.user.id!))
    .orderBy(desc(members.createdAt));

  const workspaceIds = membersData.map((member) => member.workspaceId);

  const data = [];

  for (const workspaceId of workspaceIds) {
    const workspaceData = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (workspaceData.length > 0) {
      data.push(workspaceData[0]);
    }
  }

  return data;
};

export const getLastWorkspace = async (): Promise<Workspace | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  const membersData = await db
    .select()
    .from(members)
    .where(eq(members.userId, session.user.id!))
    .orderBy(desc(members.createdAt))
    .limit(1);

  if (membersData.length === 0) {
    console.log("There is no member associated to this user");
    return null;
  }

  const data = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, membersData[0].workspaceId))
    .limit(1);

  if (data.length === 0) {
    console.log(`Workspace not found`);
    return null;
  }

  return data[0] as Workspace;
};

export const createWorkspace = async ({
  name,
}: {
  name: string;
}): Promise<Workspace | null> => {
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

  return workspace[0] as Workspace;
};

export const updateJoinCode = async (
  workspaceId: string | null,
): Promise<Workspace | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  if (!workspaceId) {
    console.log("Workspace not found");
    return null;
  }

  const joinCode = generateCode();

  const workspace = await db
    .update(workspaces)
    .set({ joinCode })
    .where(eq(workspaces.id, workspaceId))
    .returning();

  return workspace[0] as Workspace;
};

export const getWorkspaceInfo = async (
  workspaceId: string | null,
): Promise<{ name: string | null; isMember: boolean } | null> => {
  const session = await auth();
  if (!session) {
    console.log("Unauthorized");
    return null;
  }
  if (!workspaceId) {
    console.log("Workspace not found");
    return null;
  }
  const isMember = await db
    .select()
    .from(members)
    .where(
      and(
        eq(members.workspaceId, workspaceId),
        eq(members.userId, session.user.id!),
      ),
    )
    .limit(1);

  const workspace = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  return {
    name: workspace.length > 0 ? workspace[0].name : null,
    isMember: !!isMember[0],
  };
};

export const joinWorkspace = async (
  workspaceId: string | null,
  joinCode: string,
): Promise<Workspace | null> => {
  const session = await auth();
  if (!session) {
    console.log("Unauthorized");
    return null;
  }
  if (!workspaceId) {
    console.log("Workspace Id not provided");
    return null;
  }

  const workspace = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  if (workspace.length === 0) {
    console.log("Workspace not found");
    return null;
  }

  if (workspace[0].joinCode !== joinCode.toLowerCase()) {
    console.log("Invalid join code");
    return null;
  }

  const member = await db
    .select()
    .from(members)
    .where(
      and(
        eq(members.workspaceId, workspace[0].id),
        eq(members.userId, session.user.id!),
      ),
    )
    .limit(1);

  if (member.length > 0) {
    console.log("Already member of this workspace");
    return null;
  }

  await db.insert(members).values({
    userId: session.user.id!,
    workspaceId: workspace[0].id,
    role: "MEMBER",
  });

  return workspace[0];
};
