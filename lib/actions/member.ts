"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { members, users } from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";

export const getMembers = async (
  workspaceId: string | null,
): Promise<MemberPopulate[]> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return [] as MemberPopulate[];
  }

  if (!workspaceId) {
    console.log("Workspace not found");
    return [] as MemberPopulate[];
  }

  const data = await db
    .select()
    .from(members)
    .where(eq(members.workspaceId, workspaceId))
    .orderBy(desc(members.createdAt));

  const membersData = [] as MemberPopulate[];

  for (const member of data) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, member.userId))
      .limit(1);

    if (user.length > 0) {
      membersData.push({
        ...member,
        name: user[0].name,
        email: user[0].email,
        image: user[0].image,
      } as MemberPopulate);
    }
  }
  return membersData;
};

export const getCurrentMember = async (
  workspaceId: string | null,
): Promise<Member | null> => {
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
    .from(members)
    .where(
      and(
        eq(members.workspaceId, workspaceId),
        eq(members.userId, session.user.id!),
      ),
    )
    .limit(1);

  return data[0] as Member;
};

export const getMember = async (
  memberId: string | null,
): Promise<MemberPopulate | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  if (!memberId) {
    console.log("MemberId was not provided");
    return null;
  }

  const data = await db
    .select({
      member: members,
      user: users,
    })
    .from(members)
    .leftJoin(users, eq(users.id, members.userId))
    .where(eq(members.id, memberId))
    .limit(1);

  if (data.length === 0 || !data[0].user) {
    console.log("Member or user not found");
    return null;
  }

  return {
    ...data[0].member,
    name: data[0].user.name as string,
    email: data[0].user.email,
    image: data[0].user.image as string,
  } as MemberPopulate;
};
