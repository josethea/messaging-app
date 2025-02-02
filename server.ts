import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { initializeSocket } from "./lib/socket/handlers";
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

  initializeSocket(io);

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
