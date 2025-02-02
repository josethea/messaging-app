"use client";

import MessageList from "@/components/chat/MessageList";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { markNotificationsAsRead } from "@/lib/actions/notification";
import { useCurrentMemberStore } from "@/lib/store/useCurrentMember";
import { useMessages, useMessagesStore } from "@/lib/store/useMessages";
import useUnreadMessagesStore from "@/lib/store/useUnreadMessages";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const Page = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const currentMember = useCurrentMemberStore((state) => state.currentMember);
  const clearUnread = useUnreadMessagesStore((state) => state.clearUnread);
  const { fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMessages({ channelId, conversationId: null });

  const allMessages = useMessagesStore((state) => state.messages);

  useEffect(() => {
    if (channelId && currentMember) {
      markNotificationsAsRead({
        workspaceId: workspaceId!,
        memberId: currentMember.id,
        channelId: channelId,
        conversationId: undefined,
      }).then((result) => {
        if (result) {
          clearUnread(channelId);
        }
      });
    }
  }, [channelId, currentMember, workspaceId]);

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
