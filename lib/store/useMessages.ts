import { useInfiniteQuery } from "@tanstack/react-query";
import { create } from "zustand";
import { getMessages } from "../actions/message";
import { useEffect } from "react";

interface DataState {
  messages: MessagePopulate[];
  setMessages: (messages: MessagePopulate[]) => void;
  updateMessage: (message: MessagePopulate) => void;
}

export const useMessagesStore = create<DataState>()((set) => ({
  messages: [],
  setMessages: (newMessages) => set({ messages: newMessages }),
  updateMessage: (updatedMessage) =>
    set((state) => ({
      messages: state.messages.map((item) =>
        item.id === updatedMessage.id ? updatedMessage : item,
      ),
    })),
}));

export const useMessages = (channelId: string | null) => {
  const setMessages = useMessagesStore((state: DataState) => state.setMessages);

  const query = useInfiniteQuery({
    queryKey: ["messages", channelId],
    queryFn: ({ pageParam }: { pageParam: Date | undefined }) =>
      getMessages({
        channelId: channelId!,
        cursor: pageParam,
        limit: 10,
      }),
    refetchOnWindowFocus: false,
    initialPageParam: undefined as Date | undefined,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, page) => sum + page.length, 0);

      if (
        lastPage.length === 0 ||
        lastPage.length < 10 ||
        totalFetched >= lastPage[0].totalCount
      )
        return undefined;
      return lastPage[lastPage.length - 1].createdAt;
    },
    enabled: !!channelId,
  });

  useEffect(() => {
    if (query.data) {
      setMessages(
        (query.data?.pages.flatMap((page) => page) as MessagePopulate[]) ?? [],
      );
    }
  }, [query.data, setMessages]);

  return query;
};
