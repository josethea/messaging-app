import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
// import socketHandler from './server/sockets';

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  /**
   * Socket.io server
   */
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    // socketHandler(socket, io);
    console.log("connected", socket.id);

    socket.on("join-channel", (channelId: string) => {
      console.log("joined channel", channelId);
      socket.join(channelId);
    });

    socket.on("leave-channel", (channelId: string) => {
      socket.leave(channelId);
    });

    socket.on("new-message", (message: MessagePopulate) => {
      socket.to(message.channelId!).emit("message-received", message);
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
