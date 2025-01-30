"use client";

import Header from "@/components/chat/Header";
import MessageInput from "@/components/chat/MessageInput";
import MessageList from "@/components/chat/MessageList";
import { useMemberId } from "@/hooks/use-member-id";
import { useSocket } from "@/hooks/use-socket";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { getOrCreateConversation } from "@/lib/actions/conversation";
import { getMember } from "@/lib/actions/member";
import { useMessages, useMessagesStore } from "@/lib/store/useMessages";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

const Page = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const { isPending: isPendingCurrentChatMember, data: currentChatMember } =
    useQuery({
      queryKey: ["currentChatMember", memberId],
      queryFn: () => getMember(memberId),
      enabled: !!memberId,
    });

  const { isPending: isPendingConversation, data: conversation } = useQuery({
    queryKey: ["conversation", workspaceId, memberId],
    queryFn: () =>
      getOrCreateConversation({
        workspaceId: workspaceId!,
        memberId: memberId!,
      }),
    enabled: !!workspaceId && !!memberId,
  });

  const socket = useSocket({
    channelId: null,
    conversationId: conversation?.id!,
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMessages({ channelId: null, conversationId: conversation?.id! });

  const allMessages = useMessagesStore((state) => state.messages);

  if (isPendingCurrentChatMember || isPendingConversation) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <h1>There was an error when trying to get/create the conversation</h1>
      </div>
    );
  }

  if (!currentChatMember) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <h1>
          Member to start chatting not found or there is an error trying to
          get/create the conversation
        </h1>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header channel={null} member={currentChatMember} type="MEMBER" />
      <div className="h-[calc(100dvh-8rem)] relative group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[calc(100dvh-7rem)]">
        {status === "pending" ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <MessageList
            messages={allMessages}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </div>
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

export default Page;
