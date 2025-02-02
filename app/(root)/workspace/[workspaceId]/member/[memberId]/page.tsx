"use client";

import MessageList from "@/components/chat/MessageList";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { getOrCreateConversation } from "@/lib/actions/conversation";
import { useMessages, useMessagesStore } from "@/lib/store/useMessages";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

const Page = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const { isPending: isPendingConversation, data: conversation } = useQuery({
    queryKey: ["conversation", workspaceId, memberId],
    queryFn: () =>
      getOrCreateConversation({
        workspaceId: workspaceId!,
        memberId: memberId!,
      }),
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMessages({ channelId: null, conversationId: conversation?.id! });

  const allMessages = useMessagesStore((state) => state.messages);

  if (status === "pending") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-8rem)] relative group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[calc(100dvh-7rem)]">
      <MessageList
        messages={allMessages}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default Page;
