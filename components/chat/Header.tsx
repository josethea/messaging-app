"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Hash } from "lucide-react";

const Header = ({
  channel,
  member,
  type,
}: {
  channel: Channel | null;
  member: MemberPopulate | null;
  type: "CHANNEL" | "MEMBER";
}) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-x-2 px-4">
        <SidebarTrigger className="-ml-1" />
        {type === "CHANNEL" ? (
          <>
            <h1 className="font-semibold"># {channel?.name}</h1>
            <p className="text-sm text-muted-foreground">
              {channel?.description}
            </p>
          </>
        ) : (
          <>
            <h1 className="font-semibold">{member?.name}</h1>
            <p className="text-sm text-muted-foreground">{member?.email}</p>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
