import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/AppSidebar";
import Header from "@/components/sidebar/Header";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset>
        <Header />
        <div className="flex w-full h-full p-4">
          <div className="flex-1 bg-muted">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
