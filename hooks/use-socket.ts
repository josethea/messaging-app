import { getSocket } from "@/lib/socket";
import { useMessagesStore } from "@/lib/store/useMessages";
import { useMoreData } from "@/lib/store/useMoreData";
import { useEffect, useRef } from "react";

export const useSocket = ({
  channelId,
  conversationId,
}: {
  channelId: string | null;
  conversationId: string | null;
}) => {
  const socket = useRef(getSocket());
  // const messages = useMessagesStore((state) => state.messages);
  const setMessages = useMessagesStore((state) => state.setMessages);
  const setMoreData = useMoreData((state) => state.setMoreData);

  useEffect(() => {
    if (channelId) {
      socket.current.emit("join-channel", channelId);
    } else if (conversationId) {
      socket.current.emit("join-conversation", conversationId);
    }

    const handleMessage = (message: MessagePopulate) => {
      setMoreData(false);
      setMessages((prev: MessagePopulate[]) => [message, ...prev]);
    };

    socket.current.on("message-received", handleMessage);

    return () => {
      socket.current.off("message-received", handleMessage);

      if (channelId) {
        socket.current.emit("leave-channel", channelId);
      } else if (conversationId) {
        socket.current.emit("leave-conversation", conversationId);
      }
    };
  }, [channelId, conversationId, setMessages, setMoreData]);

  return socket.current;
};
