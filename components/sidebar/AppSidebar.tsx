"use client";

import React, { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import WorkspaceSwitcher from "@/components/sidebar/WorkspaceSwitcher";
import NavUser from "@/components/sidebar/NavUser";
import { Session } from "next-auth";
import CollapsibleChannels from "@/components/sidebar/CollapsibleChannels";
import CollapsibleMembers from "@/components/sidebar/CollapsibleMembers";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getChannels } from "@/lib/actions/channel";
import { getCurrentMember, getMembers } from "@/lib/actions/member";

const AppSidebar = ({ session }: { session: Session }) => {
  const workspaceId = useWorkspaceId();

  const { isPending: isPendingCurrentMember, data: currentMember } = useQuery({
    queryKey: ["currentMember"],
    queryFn: () => getCurrentMember(workspaceId),
  });

  const { isPending: isPendingChannels, data: channels } = useQuery({
    queryKey: ["channels"],
    queryFn: () => getChannels(workspaceId),
  });

  const { isPending: isPendingMembers, data: members } = useQuery({
    queryKey: ["members"],
    queryFn: () => getMembers(workspaceId),
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher
          workspaceId={workspaceId}
          isPendingCurrentMember={isPendingCurrentMember}
          currentMember={currentMember}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <CollapsibleChannels
              workspaceId={workspaceId}
              isPending={isPendingChannels}
              data={channels}
            />
            <CollapsibleMembers
              workspaceId={workspaceId}
              isPending={isPendingMembers}
              data={members}
              currentMember={currentMember}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
