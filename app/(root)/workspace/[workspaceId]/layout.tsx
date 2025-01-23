import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <h1>{session.user?.name}</h1>
          </div>
        </header>
        <div className="flex w-full h-full p-4">
          <div className="flex-1 bg-muted">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
