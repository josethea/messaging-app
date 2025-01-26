import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { getChannels } from "../actions/channel";
import { useEffect } from "react";

interface DataState {
  channels: Channel[];
  setChannels: (channels: Channel[]) => void;
  updateChannel: (channel: Channel) => void;
}

export const useChannelsStore = create<DataState>()((set) => ({
  channels: [],
  setChannels: (newChannels) => set({ channels: newChannels }),
  updateChannel: (updatedChannel) =>
    set((state) => ({
      channels: state.channels.map((item) =>
        item.id === updatedChannel.id ? updatedChannel : item,
      ),
    })),
}));

export const useChannels = (workspaceId: string | null) => {
  const setChannels = useChannelsStore((state: DataState) => state.setChannels);

  const query = useQuery({
    queryKey: ["channels", workspaceId],
    queryFn: () => getChannels(workspaceId),
    enabled: !!workspaceId,
  });

  useEffect(() => {
    if (query.data) {
      setChannels(query.data);
    }
  }, [query.data, setChannels]);

  return query;
};
