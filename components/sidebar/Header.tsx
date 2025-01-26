"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChannelId } from "@/hooks/use-channel-id";
import { useChannelsStore } from "@/lib/store/useChannels";

const Header = () => {
  const channelId = useChannelId();
  const channels = useChannelsStore((state) => state.channels);
  const currentChannel = channels.find((item) => item.id === channelId);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1>{currentChannel?.name}</h1>
      </div>
    </header>
  );
};

export default Header;
