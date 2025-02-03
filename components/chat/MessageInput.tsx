import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { createMessage } from "@/lib/actions/message";
import { toast } from "@/hooks/use-toast";
import { useMessagesStore } from "@/lib/store/useMessages";
import { useMoreData } from "@/lib/store/useMoreData";
import { Socket } from "socket.io-client";
import { useMemberssStore } from "@/lib/store/useMembers";

const MessageInput = ({
  channel,
  member,
  workspaceId,
  socket,
  type,
  conversationId,
}: {
  channel: Channel | null;
  member: MemberPopulate | null;
  workspaceId: string;
  socket: Socket;
  type: "CHANNEL" | "MEMBER";
  conversationId: string | null;
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const setMessages = useMessagesStore((state) => state.setMessages);
  const setMoreData = useMoreData((state) => state.setMoreData);
  const members = useMemberssStore((state) => state.members);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createMessage,
  });

  const handleSendMessage = async () => {
    const messageData = await mutateAsync({
      content: message,
      workspaceId: workspaceId!,
      channelId: channel?.id,
      conversationId: conversationId ?? undefined,
    });

    if (messageData) {
      setMoreData(false);
      setMessages((prev: MessagePopulate[]) => [messageData, ...prev]);
      socket.emit("new-message", {
        message: messageData,
        memberIds: members.map((member) => member.id) as string[],
      });
    } else {
      toast({
        title: "Error",
        description: "An error occurred while sending the message",
        variant: "destructive",
      });
    }

    setMessage("");
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <div className="border-t p-4 h-16">
      <div className="flex gap-x-2">
        <Input
          ref={inputRef}
          placeholder={`Message to #${channel || member ? (type === "CHANNEL" ? channel?.name : member?.name) : ""}`}
          value={message}
          disabled={isPending}
          autoFocus
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={message === "" || isPending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
