"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
// import Header from "@/components/sidebar/Header";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        {/* <Header /> */}
        <div className="flex w-full h-full">
          <div className="flex-1 bg-muted">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
