import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { createMessage } from "@/lib/actions/message";
import { toast } from "@/hooks/use-toast";
import { useMessagesStore } from "@/lib/store/useMessages";
import { useMoreData } from "@/lib/store/useMoreData";

const MessageInput = ({
  channel,
  workspaceId,
}: {
  channel: Channel;
  workspaceId: string;
}) => {
  const [message, setMessage] = useState("");
  const allMessages = useMessagesStore((state) => state.messages);
  const setMessages = useMessagesStore((state) => state.setMessages);
  const setMoreData = useMoreData((state) => state.setMoreData);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createMessage,
  });

  const handleSendMessage = async () => {
    const messageData = await mutateAsync({
      content: message,
      workspaceId: workspaceId!,
      channelId: channel.id,
    });

    if (messageData) {
      setMoreData(false);
      setMessages([messageData, ...allMessages]);
    } else {
      toast({
        title: "Error",
        description: "An error occurred while sending the message",
        variant: "destructive",
      });
    }

    setMessage("");
  };

  return (
    <div className="border-t p-4">
      <div className="flex gap-x-2">
        <Input
          placeholder={`Message #${channel?.name}`}
          value={message}
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
