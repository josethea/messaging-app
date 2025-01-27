"use client";

import React, { useState } from "react";
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
import {
  Plus,
  ChevronsUpDown,
  Loader2,
  Rocket,
  Share,
  Settings,
} from "lucide-react";
import { useCreateWorkspaceModal } from "@/lib/store/useCreateWorkspaceModal";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "@/lib/actions/workspace";
import InviteModal from "../modals/InviteModal";
import { useWorkspaces, useWorkspacesStore } from "@/lib/store/useWorkspaces";
import { useRouter } from "next/navigation";

const WorkspaceSwitcher = ({
  workspaceId,
  isPendingCurrentMember,
  currentMember,
}: {
  workspaceId: string | null;
  isPendingCurrentMember: boolean;
  currentMember: Member | null | undefined;
}) => {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { setOpen } = useCreateWorkspaceModal();
  const [inviteOpen, setInviteOpen] = useState(false);
  const { isPending } = useWorkspaces();

  const workspaces = useWorkspacesStore((state) => state.workspaces);
  const updateWorkspace = useWorkspacesStore((state) => state.updateWorkspace);
  const activeWorkspace = workspaces.find((item) => item.id === workspaceId);
  const filteredWorkspaces = workspaces.filter(
    (item) => item.id !== workspaceId,
  );

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        workspaceId={workspaceId}
        name={activeWorkspace?.name ?? null}
        joinCode={activeWorkspace?.joinCode ?? null}
        updateWorkspace={updateWorkspace}
      />
      <SidebarMenu>
        <SidebarMenuItem>
          {isPending || isPendingCurrentMember ? (
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
                    <span className="truncate text-xs uppercase">
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
                {currentMember?.role === "ADMIN" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      ADMIN OPTIONS
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      className="gap-2 p-2 cursor-pointer"
                      onClick={() => setInviteOpen(true)}
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <Share className="size-4 shrink-0" />
                      </div>
                      <span className="truncate">
                        Invite people to {activeWorkspace?.name}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <Settings className="size-4 shrink-0" />
                      </div>
                      Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  OTHER WORKSPACES
                </DropdownMenuLabel>
                {filteredWorkspaces?.map((workspace, index) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    className="gap-2 p-2 cursor-pointer"
                    onClick={() => router.push(`/workspace/${workspace.id}`)}
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
                  <div className="font-medium">Create new workspace</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
};

export default WorkspaceSwitcher;
