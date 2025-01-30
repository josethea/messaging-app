"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { conversations, members } from "@/database/schema";
import { and, eq, or } from "drizzle-orm";

export const getOrCreateConversation = async ({
  workspaceId,
  memberId,
}: {
  workspaceId: string;
  memberId: string;
}): Promise<Conversation | null> => {
  const session = await auth();

  if (!session) {
    console.log("Unauthorized");
    return null;
  }

  if (!workspaceId || !memberId) {
    console.log("Missing workspaceId or memberId");
    return null;
  }

  const currentMember = await db
    .select()
    .from(members)
    .where(
      and(
        eq(members.workspaceId, workspaceId),
        eq(members.userId, session.user.id!),
      ),
    )
    .limit(1);

  if (currentMember.length === 0) {
    console.log("Current member associated to the current user not found");
    return null;
  }

  let conversation = await db
    .select()
    .from(conversations)
    .where(
      or(
        and(
          eq(conversations.memberOneId, memberId),
          eq(conversations.memberTwoId, currentMember[0].id),
        ),
        and(
          eq(conversations.memberOneId, currentMember[0].id),
          eq(conversations.memberTwoId, memberId),
        ),
      ),
    )
    .limit(1);

  if (conversation.length === 0) {
    conversation = await db
      .insert(conversations)
      .values({
        workspaceId,
        memberOneId: currentMember[0].id,
        memberTwoId: memberId,
      })
      .returning();

    if (conversation.length === 0) {
      console.log("Error trying to save new conversation");
      return null;
    }
  }

  return conversation[0] as Conversation;
};
