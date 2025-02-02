"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Frame, Plus, Hash } from "lucide-react";
import { useCreateChannelModal } from "@/lib/store/useCreateChannelModal";
import { useChannelId } from "@/hooks/use-channel-id";
import { useRouter } from "next/navigation";
import useUnreadMessagesStore from "@/lib/store/useUnreadMessages";

const CollapsibleChannels = ({
  isPending,
  data,
  workspaceId,
  currentMember,
}: {
  isPending: boolean;
  data: Channel[] | undefined;
  workspaceId: string | null;
  currentMember: Member | null;
}) => {
  const router = useRouter();
  const { setOpen } = useCreateChannelModal();
  const channelId = useChannelId();
  const unreadCounts = useUnreadMessagesStore((state) => state.unreadCounts);

  return (
    <Collapsible
      key="channels"
      asChild
      defaultOpen={true}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Channels">
          <Frame />
          <span>Channels</span>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction
            className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
            showOnHover
          >
            <ChevronRight />
          </SidebarMenuAction>
        </CollapsibleTrigger>
        {currentMember?.role === "ADMIN" && (
          <SidebarMenuAction showOnHover onClick={() => setOpen(true)}>
            <Plus />
          </SidebarMenuAction>
        )}
        <CollapsibleContent>
          <SidebarMenuSub>
            {data?.map((channel: Channel) => (
              <SidebarMenuSubItem key={channel.id}>
                <SidebarMenuSubButton
                  asChild
                  isActive={channel.id === channelId}
                  onClick={() =>
                    router.push(
                      `/workspace/${workspaceId}/channel/${channel.id}`,
                    )
                  }
                  className="cursor-pointer"
                >
                  <p>
                    <Hash />
                    <span>{channel.name}</span>
                    {unreadCounts[channel.id] > 0 && (
                      <span className="ml-1 text-xs font-semibold rounded-full bg-red-500 text-white px-2 py-0.5">
                        {unreadCounts[channel.id]}
                      </span>
                    )}
                  </p>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default CollapsibleChannels;
