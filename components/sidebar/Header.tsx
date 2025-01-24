"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChannelId } from "@/hooks/use-channel-id";
import { useQuery } from "@tanstack/react-query";
import { getChannel } from "@/lib/actions/channel";
import { Loader2 } from "lucide-react";

const Header = () => {
  const channelId = useChannelId();

  const { isPending, data: channel } = useQuery({
    queryKey: ["channel"],
    queryFn: () => getChannel(channelId),
  });

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <h1>{channel?.name}</h1>
        )}
      </div>
    </header>
  );
};

export default Header;
