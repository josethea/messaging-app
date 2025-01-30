import { socket } from "@/lib/socket";
import { useMessagesStore } from "@/lib/store/useMessages";
import { useMoreData } from "@/lib/store/useMoreData";
import { useEffect } from "react";

export const useSocket = ({
  channelId,
  conversationId,
}: {
  channelId: string | null;
  conversationId: string | null;
}) => {
  const messages = useMessagesStore((state) => state.messages);
  const setMessages = useMessagesStore((state) => state.setMessages);
  const setMoreData = useMoreData((state) => state.setMoreData);

  useEffect(() => {
    if (channelId) {
      socket.emit("join-channel", channelId);
    } else if (conversationId) {
      socket.emit("join-conversation", conversationId);
    }

    socket.on("message-received", (message: MessagePopulate) => {
      setMoreData(false);
      setMessages([message, ...messages]);
    });

    return () => {
      if (channelId) {
        socket.emit("leave-channel", channelId);
      } else if (conversationId) {
        socket.emit("leave-conversation", conversationId);
      }
    };
  }, [channelId, conversationId, messages, setMessages, setMoreData]);

  return socket;
};
