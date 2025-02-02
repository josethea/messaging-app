import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { getChannels } from "../actions/channel";
import { useEffect } from "react";
import useUnreadMessagesStore from "./useUnreadMessages";

interface DataState {
  channels: Channel[];
  currentChannel: Channel | null;
  setChannels: (channels: Channel[]) => void;
  setCurrentChannel: (channelId: string) => void;
  updateChannel: (channel: Channel) => void;
}

export const useChannelsStore = create<DataState>()((set) => ({
  channels: [],
  currentChannel: null,
  setChannels: (newChannels) => set({ channels: newChannels }),
  setCurrentChannel: (channelId) =>
    set((state) => ({
      currentChannel:
        state.channels.find((item) => item.id === channelId) || null,
    })),
  updateChannel: (updatedChannel) =>
    set((state) => ({
      channels: state.channels.map((item) =>
        item.id === updatedChannel.id ? updatedChannel : item,
      ),
    })),
}));

export const useChannels = (
  workspaceId: string | null,
  channelId: string | null,
) => {
  const setChannels = useChannelsStore((state: DataState) => state.setChannels);
  const setCurrentChannel = useChannelsStore(
    (state) => state.setCurrentChannel,
  );
  const setUnreadCount = useUnreadMessagesStore(
    (state) => state.setUnreadCount,
  );

  const query = useQuery({
    queryKey: ["channels", workspaceId],
    queryFn: () => getChannels(workspaceId),
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (query.data) {
      setChannels(query.data.map((item) => item.channel));

      query.data.forEach((item) => {
        setUnreadCount(item.channel.id, item.unreadCount as number);
      });

      if (channelId) {
        setCurrentChannel(channelId as string);
      }
    }
  }, [query.data, setChannels, setCurrentChannel, channelId, setUnreadCount]);

  return query;
};
