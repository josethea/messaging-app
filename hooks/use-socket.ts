import { socket } from "@/lib/socket";
import { useMessagesStore } from "@/lib/store/useMessages";
import { useMoreData } from "@/lib/store/useMoreData";
import { useEffect } from "react";

export const useSocket = (channelId: string) => {
  const messages = useMessagesStore((state) => state.messages);
  const setMessages = useMessagesStore((state) => state.setMessages);
  const setMoreData = useMoreData((state) => state.setMoreData);

  useEffect(() => {
    socket.emit("join-channel", channelId);

    socket.on("message-received", (message: MessagePopulate) => {
      setMoreData(false);
      setMessages([message, ...messages]);
    });

    return () => {
      socket.emit("leave-channel", channelId);
      // socket.disconnect();
    };
  }, [channelId, messages, setMessages, setMoreData]);

  return socket;
};
