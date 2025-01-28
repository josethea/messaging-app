import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

const Message = ({ message }: { message: MessagePopulate }) => {
  return (
    <Card className="p-4">
      <div className="flex gap-x-4">
        <Avatar>
          <AvatarImage src={message.user?.image || ""} />
          <AvatarFallback>
            {message.user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-semibold">
              {message.user?.name || "Unknown User"}
            </p>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), "PPp")}
            </span>
          </div>
          <p>{message.content}</p>
        </div>
      </div>
    </Card>
  );
};

export default Message;
