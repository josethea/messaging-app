import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

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
    socket.on("join-channel", (channelId: string) => {
      socket.join(channelId);
    });

    socket.on("leave-channel", (channelId: string) => {
      socket.leave(channelId);
    });

    socket.on("join-conversation", (conversationId: string) => {
      socket.join(conversationId);
    });

    socket.on("leave-conversation", (conversationId: string) => {
      socket.leave(conversationId);
    });

    socket.on("new-message", (message: MessagePopulate) => {
      if (message.channelId) {
        socket.to(message.channelId!).emit("message-received", message);
      } else if (message.conversationId) {
        socket.to(message.conversationId!).emit("message-received", message);
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`,
    );
  });
});
