"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { members, users } from "@/database/schema";
import { eq } from "drizzle-orm";

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
    .where(eq(members.workspaceId, workspaceId));

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
