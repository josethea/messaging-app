"use client";

import Header from "@/components/chat/Header";
import MessageInput from "@/components/chat/MessageInput";
import { useMemberId } from "@/hooks/use-member-id";
import { useSocket } from "@/hooks/use-socket";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { getOrCreateConversation } from "@/lib/actions/conversation";
import { useCurrentMemberStore } from "@/lib/store/useCurrentMember";
import { useMemberssStore } from "@/lib/store/useMembers";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();
  const currentMember = useCurrentMemberStore((state) => state.currentMember);
  const currentChatMember = useMemberssStore(
    (state) => state.currentChatMember,
  );

  const { data: conversation } = useQuery({
    queryKey: ["conversation", workspaceId, memberId],
    queryFn: () =>
      getOrCreateConversation({
        workspaceId: workspaceId!,
        memberId: memberId!,
      }),
    enabled: !!workspaceId && !!memberId,
  });

  const socket = useSocket({
    memberId: currentMember?.id as string,
    channelId: null,
    conversationId: conversation?.id!,
  });

  return (
    <div className="flex h-full flex-col">
      <Header channel={null} member={currentChatMember} type="MEMBER" />
      {children}
      <div className="sticky bottom-0 inset-x-0 bg-background">
        <MessageInput
          channel={null}
          member={currentChatMember}
          workspaceId={workspaceId!}
          socket={socket!}
          type="MEMBER"
          conversationId={conversation?.id!}
        />
      </div>
    </div>
  );
};

export default Layout;
