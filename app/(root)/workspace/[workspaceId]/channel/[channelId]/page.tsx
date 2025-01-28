"use client";

import Header from "@/components/chat/Header";
import MessageInput from "@/components/chat/MessageInput";
import MessageList from "@/components/chat/MessageList";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { getChannel } from "@/lib/actions/channel";
import { getMessages } from "@/lib/actions/message";
import { useMessages, useMessagesStore } from "@/lib/store/useMessages";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const Page = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { isPending, data: currentChannel } = useQuery({
    queryKey: ["currentChannel", channelId],
    queryFn: () => getChannel(channelId),
    enabled: !!channelId,
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMessages(channelId);

  const allMessages = useMessagesStore((state) => state.messages);

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!currentChannel) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <h1>Channel not found</h1>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header channel={currentChannel} />
      <div className="flex-1 h-[calc(100%-8rem)] relative">
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
        <MessageInput channel={currentChannel} workspaceId={workspaceId!} />
      </div>
    </div>
  );
};

export default Page;
