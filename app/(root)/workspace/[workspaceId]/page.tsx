"use client";

import React, { useEffect } from "react";
import { getChannels } from "@/lib/actions/channel";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const Page = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { isPending, data: channels } = useQuery({
    queryKey: ["channels"],
    queryFn: () => getChannels(workspaceId),
  });

  const channelId = channels?.[0]?.id;

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (channelId) {
      router.replace(`/workspace/${workspaceId}/channel/${channelId}`);
    }
  }, [channelId, isPending, router, workspaceId]);

  return (
    <div className="flex w-full h-full items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default Page;
