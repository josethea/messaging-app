import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import WorkspaceSwitcher from "@/components/sidebar/WorkspaceSwitcher";
import NavUser from "@/components/sidebar/NavUser";
import { Session } from "next-auth";
import NavMain from "@/components/sidebar/NavMain";
import NavProjects from "./NavProjects";

const AppSidebar = ({ session }: { session: Session }) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
