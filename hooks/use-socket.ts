import { getSocket } from "@/lib/socket";
import { useMessagesStore } from "@/lib/store/useMessages";
import { useMoreData } from "@/lib/store/useMoreData";
import { useEffect, useRef } from "react";

export const useSocket = ({
  memberId,
  channelId,
  conversationId,
}: {
  memberId: string;
  channelId: string | null;
  conversationId: string | null;
}) => {
  const socket = useRef(getSocket());
  const setMessages = useMessagesStore((state) => state.setMessages);
  const setMoreData = useMoreData((state) => state.setMoreData);

  useEffect(() => {
    if (!memberId) {
      return;
    }
    if (channelId) {
      console.log(`Member [${memberId}] joined to the channel [${channelId}]`);
      socket.current.emit("join-channel", { memberId, channelId });
    } else if (conversationId) {
      console.log(
        `Member [${memberId}] joined to the conversation [${conversationId}]`,
      );
      socket.current.emit("join-conversation", { memberId, conversationId });
    }

    const handleMessage = (message: MessagePopulate) => {
      setMoreData(false);
      setMessages((prev: MessagePopulate[]) => [message, ...prev]);
    };

    socket.current.on("message-received", handleMessage);

    return () => {
      socket.current.off("message-received", handleMessage);

      if (channelId) {
        console.log(`Member [${memberId}] left the channel [${channelId}]`);
        socket.current.emit("leave-channel", { memberId, channelId });
      } else if (conversationId) {
        console.log(
          `Member [${memberId}] left the conversation [${channelId}]`,
        );
        socket.current.emit("leave-conversation", { memberId, conversationId });
      }
    };
  }, [memberId, channelId, conversationId, setMessages, setMoreData]);

  return socket.current;
};
