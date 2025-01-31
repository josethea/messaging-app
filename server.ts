import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const activeChannelMembers: { [channelId: string]: Set<string> } = {};

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    socket.on(
      "join-channel",
      ({ memberId, channelId }: { memberId: string; channelId: string }) => {
        if (!activeChannelMembers[channelId]) {
          activeChannelMembers[channelId] = new Set();
        }
        activeChannelMembers[channelId].add(memberId);
        console.log(activeChannelMembers);
        socket.join(channelId);
      },
    );

    socket.on(
      "leave-channel",
      ({ memberId, channelId }: { memberId: string; channelId: string }) => {
        if (activeChannelMembers[channelId]) {
          activeChannelMembers[channelId].delete(memberId);
        }
        console.log(activeChannelMembers);
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

    socket.on("new-message", (message: MessagePopulate) => {
      if (message.channelId) {
        socket.to(message.channelId!).emit("message-received", message);
      } else if (message.conversationId) {
        socket.to(message.conversationId!).emit("message-received", message);
      }
    });
  });

  const shutdown = () => {
    console.log("Closing all connections...");

    // Remove process listeners before shutdown
    process.removeListener("SIGINT", shutdown);
    process.removeListener("SIGTERM", shutdown);

    // Close all Socket.IO connections
    io.close(() => {
      console.log("All Socket.IO connections closed");

      // Then close the HTTP server
      httpServer.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  httpServer.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`,
    );
  });
});
