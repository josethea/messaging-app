import { createNotification } from "@/lib/actions/notification";
import { getSocket } from "@/lib/socket";
import { useMessagesStore } from "@/lib/store/useMessages";
import { useMoreData } from "@/lib/store/useMoreData";
import useUnreadMessagesStore from "@/lib/store/useUnreadMessages";
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
  const incrementUnread = useUnreadMessagesStore(
    (state) => state.incrementUnread,
  );

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

    const handleCreateNewNotification = async ({
      message,
      memberIds,
    }: {
      message: MessagePopulate;
      memberIds: string[];
    }) => {
      memberIds.forEach(async (memberId) => {
        await createNotification({
          workspaceId: message.workspaceId,
          memberId: memberId,
          channelId: message.channelId,
          messageId: message.id,
          read: false,
        });
      });
    };

    const handleSendNewNotification = ({
      channelId,
    }: {
      channelId: string;
    }) => {
      incrementUnread(channelId);
    };

    socket.current.on("message-received", handleMessage);
    socket.current.on("create-new-notification", handleCreateNewNotification);
    socket.current.on("send-new-notification", handleSendNewNotification);

    return () => {
      socket.current.off("message-received", handleMessage);
      socket.current.off(
        "create-new-notification",
        handleCreateNewNotification,
      );
      socket.current.off("send-new-notification", handleSendNewNotification);

      if (channelId) {
        console.log(`Member [${memberId}] left the channel [${channelId}]`);
        socket.current.emit("leave-channel", { memberId, channelId });
      } else if (conversationId) {
        console.log(
          `Member [${memberId}] left the conversation [${conversationId}]`,
        );
        socket.current.emit("leave-conversation", { memberId, conversationId });
      }
    };
  }, [memberId, channelId, conversationId, setMessages, setMoreData]);

  return socket.current;
};
