"use client";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const Page = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  return <div>ChannelPage</div>;
};

export default Page;
