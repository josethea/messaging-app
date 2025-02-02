import { Server, Socket } from "socket.io";

interface ActiveChannelMembers {
  [channelId: string]: Set<string>;
}

interface SocketMemberMap {
  [socketId: string]: string; // socketId >> memberId
}
interface MemberSocketMap {
  [memberId: string]: string; // memberId >> socketId
}

export const activeChannelMembers: ActiveChannelMembers = {};
export const socketToMember: SocketMemberMap = {};
export const memberToSocket: MemberSocketMap = {};

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on(
      "join-channel",
      ({ memberId, channelId }: { memberId: string; channelId: string }) => {
        socketToMember[socket.id] = memberId;
        memberToSocket[memberId] = socket.id;

        if (!activeChannelMembers[channelId]) {
          activeChannelMembers[channelId] = new Set();
        }
        activeChannelMembers[channelId].add(memberId);

        socket.join(channelId);
      },
    );

    socket.on(
      "leave-channel",
      ({ memberId, channelId }: { memberId: string; channelId: string }) => {
        if (activeChannelMembers[channelId]) {
          activeChannelMembers[channelId].delete(memberId);
        }
        socket.leave(channelId);
      },
    );

    socket.on(
      "join-conversation",
      ({
        memberId,
        conversationId,
      }: {
        memberId: string;
        conversationId: string;
      }) => {
        socket.join(conversationId);
      },
    );

    socket.on(
      "leave-conversation",
      ({
        memberId,
        conversationId,
      }: {
        memberId: string;
        conversationId: string;
      }) => {
        socket.leave(conversationId);
      },
    );

    socket.on(
      "new-message",
      ({
        message,
        memberIds,
      }: {
        message: MessagePopulate;
        memberIds: string[];
      }) => {
        if (message.channelId) {
          // emit the event message for all the active members
          socket.to(message.channelId).emit("message-received", message);

          // emit the event notification for all the inactive members
          const activeMembers = Array.from(
            activeChannelMembers[message.channelId] || new Set(),
          );
          const inactiveMemberIds = memberIds.filter(
            (memberId) => !activeMembers.includes(memberId),
          );
          io.to(memberToSocket[message.memberId]).emit(
            "create-new-notification",
            {
              message: message,
              memberIds: inactiveMemberIds,
            },
          );
          inactiveMemberIds.forEach((inactiveMemberId) => {
            if (memberToSocket[inactiveMemberId]) {
              io.to(memberToSocket[inactiveMemberId]).emit(
                "send-new-notification",
                {
                  channelId: message.channelId,
                },
              );
            }
          });
        } else if (message.conversationId) {
          socket.to(message.conversationId).emit("message-received", message);
        }
      },
    );

    socket.on("disconnect", () => {
      // clean up the mapping when socket disconnects
      const memberId = socketToMember[socket.id];
      if (memberId) {
        delete socketToMember[socket.id];
        delete memberToSocket[memberId];
      }
    });
  });
};
