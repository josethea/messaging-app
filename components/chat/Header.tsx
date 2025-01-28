"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = ({ channel }: { channel: Channel }) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-x-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="font-semibold"># {channel?.name}</h1>
        <p className="text-sm text-muted-foreground">{channel?.description}</p>
      </div>
    </header>
  );
};

export default Header;
