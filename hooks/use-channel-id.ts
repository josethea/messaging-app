import { useParams } from "next/navigation";

export const useChannelId = (): string | null => {
  const params = useParams();
  const channelId = params.channelId as string;
  return channelId;
};
