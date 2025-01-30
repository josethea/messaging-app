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
import { useMemberId } from "@/hooks/use-member-id";
import { Plus, Users, User, BadgeCheck } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const CollapsibleMembers = ({
  isPending,
  data,
  workspaceId,
  currentMember,
}: {
  isPending: boolean;
  data: MemberPopulate[] | undefined;
  workspaceId: string | null;
  currentMember: Member | null;
}) => {
  const router = useRouter();
  const memberId = useMemberId();

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
                <SidebarMenuSubButton
                  asChild
                  onClick={() =>
                    router.push(`/workspace/${workspaceId}/member/${member.id}`)
                  }
                  isActive={member.id === memberId}
                  className="cursor-pointer"
                >
                  <p>
                    <User />
                    <span>{member.name}</span>
                    {member.id === currentMember?.id && (
                      <BadgeCheck className="ml-auto" />
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

export default CollapsibleMembers;
