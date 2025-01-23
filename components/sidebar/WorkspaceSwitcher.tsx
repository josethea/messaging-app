"use client";

import React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, ChevronsUpDown, Loader2, Rocket } from "lucide-react";
import { useCreateWorkspaceModal } from "@/lib/store/useCreateWorkspaceModal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/lib/actions/workspace";
import { useRouter } from "next/navigation";

const WorkspaceSwitcher = () => {
  const { isMobile } = useSidebar();
  const { setOpen } = useCreateWorkspaceModal();
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const { isPending, data: workspaces } = useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspaces(),
  });

  const activeWorkspace = workspaces?.find(
    (workspace) => workspace.id === workspaceId,
  );

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace.id !== workspaceId,
  );

  const goToWorkspace = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isPending ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Rocket className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeWorkspace?.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeWorkspace?.joinCode}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              {filteredWorkspaces?.map((workspace, index) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => goToWorkspace(workspace.id)}
                  className="gap-2 p-2 cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Rocket className="size-4 shrink-0" />
                  </div>
                  {workspace.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2 cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Create new workspace
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default WorkspaceSwitcher;
