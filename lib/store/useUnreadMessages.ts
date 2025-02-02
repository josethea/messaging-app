import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DataState {
  unreadCounts: Record<string, number>;
  setUnreadCount: (channelId: string, count: number) => void;
  incrementUnread: (channelId: string) => void;
  clearUnread: (channelId: string) => void;
}

const useUnreadMessagesStore = create<DataState>()(
  persist(
    (set, get) => ({
      unreadCounts: {},
      setUnreadCount: (channelId, count) =>
        set({ unreadCounts: { ...get().unreadCounts, [channelId]: count } }),
      incrementUnread: (channelId) =>
        set((state) => {
          // Only increment if we're not already viewing the channel
          const currentCount = state.unreadCounts[channelId] ?? 0;
          return {
            unreadCounts: {
              ...state.unreadCounts,
              [channelId]: currentCount + 1,
            },
          };
        }),
      clearUnread: (channelId) =>
        set((state) => {
          const newCounts = { ...state.unreadCounts };
          delete newCounts[channelId];
          return { unreadCounts: newCounts };
        }),
    }),
    {
      name: "unread-messages-storage",
    },
  ),
);

export default useUnreadMessagesStore;
