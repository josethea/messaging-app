import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "@/components/chat/Message";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useMoreData } from "@/lib/store/useMoreData";

interface MessageListProps {
  messages: MessagePopulate[];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

const MessageList = ({
  messages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const moreData = useMoreData((state) => state.moreData);
  const setMoreData = useMoreData((state) => state.setMoreData);

  useEffect(() => {
    if (moreData) {
      return;
    }

    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, moreData]);

  const displayMessages = [...messages].reverse();

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-y-4 p-4 min-h-full">
        {hasNextPage && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                setMoreData(true);
                fetchNextPage();
              }}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Load more"
              )}
            </Button>
          </div>
        )}
        {displayMessages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
