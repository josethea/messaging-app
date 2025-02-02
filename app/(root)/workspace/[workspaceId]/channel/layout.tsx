"use client";

import Header from "@/components/chat/Header";
import MessageInput from "@/components/chat/MessageInput";
import { useSocket } from "@/hooks/use-socket";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelsStore } from "@/lib/store/useChannels";
import { useCurrentMemberStore } from "@/lib/store/useCurrentMember";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const workspaceId = useWorkspaceId();
  const currentChannel = useChannelsStore((state) => state.currentChannel);

  const currentMember = useCurrentMemberStore((state) => state.currentMember);

  const socket = useSocket({
    memberId: currentMember?.id as string,
    channelId: currentChannel?.id!,
    conversationId: null,
  });

  return (
    <div className="flex h-full flex-col">
      <Header channel={currentChannel} member={null} type="CHANNEL" />
      {children}
      <div className="sticky bottom-0 inset-x-0 bg-background">
        <MessageInput
          channel={currentChannel}
          member={null}
          workspaceId={workspaceId!}
          socket={socket!}
          type="CHANNEL"
          conversationId={null}
        />
      </div>
    </div>
  );
};

export default Layout;
