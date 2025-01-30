"use client";

import Header from "@/components/chat/Header";
import MessageInput from "@/components/chat/MessageInput";
import MessageList from "@/components/chat/MessageList";
import { useChannelId } from "@/hooks/use-channel-id";
import { useSocket } from "@/hooks/use-socket";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { getChannel } from "@/lib/actions/channel";
import { useMessages, useMessagesStore } from "@/lib/store/useMessages";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const Page = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const socket = useSocket(channelId!);

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
          channel={currentChannel}
          workspaceId={workspaceId!}
          socket={socket!}
        />
      </div>
    </div>
  );
};

export default Page;
