"use client";

import React from "react";
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
import { useChannels, useChannelsStore } from "@/lib/store/useChannels";
import { useMembers, useMemberssStore } from "@/lib/store/useMembers";
import {
  useCurrentMember,
  useCurrentMemberStore,
} from "@/lib/store/useCurrentMember";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";

const AppSidebar = ({ session }: { session: Session | null }) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();

  const { isPending: isPendingChannels } = useChannels(workspaceId, channelId);
  const { isPending: isPendingMembers } = useMembers(workspaceId, memberId);
  const { isPending: isPendingCurrentMember } = useCurrentMember(workspaceId);

  const channels = useChannelsStore((state) => state.channels);
  const members = useMemberssStore((state) => state.members);
  const currentMember = useCurrentMemberStore((state) => state.currentMember);

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
              currentMember={currentMember}
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
