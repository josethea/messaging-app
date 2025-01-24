import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Plus, Users, User } from "lucide-react";
import { ChevronRight } from "lucide-react";

const CollapsibleMembers = ({
  isPending,
  data,
  workspaceId,
}: {
  isPending: boolean;
  data: MemberPopulate[] | undefined;
  workspaceId: string | null;
}) => {
  return (
    <Collapsible
      key="members"
      asChild
      defaultOpen={true}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Members">
          <Users />
          <span>Direct Messages</span>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction
            className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
            showOnHover
          >
            <ChevronRight />
          </SidebarMenuAction>
        </CollapsibleTrigger>
        <SidebarMenuAction showOnHover>
          <Plus />
        </SidebarMenuAction>
        <CollapsibleContent>
          <SidebarMenuSub>
            {data?.map((member: MemberPopulate) => (
              <SidebarMenuSubItem key={member.id}>
                <SidebarMenuSubButton asChild>
                  <a href={`/workspace/${workspaceId}/member/${member.id}`}>
                    <User />
                    <span>{member.name}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default CollapsibleMembers;
