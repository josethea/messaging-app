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

  const shutdown = async () => {
    console.log("Closing all connections...");
    console.log(`Active Socket.IO connections: ${io.sockets.sockets.size}`);

    // Remove process listeners before shutdown
    process.removeListener("SIGINT", shutdown);
    process.removeListener("SIGTERM", shutdown);

    try {
      // Force close all Socket.IO connections first
      io.sockets.sockets.forEach((socket) => {
        socket.disconnect(true);
      });

      // Set a timeout for the entire shutdown process
      const shutdownTimeout = setTimeout(() => {
        console.log("Shutdown taking too long, forcing exit...");
        process.exit(1);
      }, 10000); // 10 seconds timeout

      // First, stop accepting new connections
      await new Promise<void>((resolve) => {
        httpServer.close(() => {
          console.log("HTTP server closed");
          resolve();
        });
      });

      // Then close all Socket.IO connections
      await new Promise<void>((resolve, reject) => {
        io.close((err) => {
          if (err) {
            console.error("Error closing Socket.IO:", err);
            reject(err);
            return;
          }
          console.log("All Socket.IO connections closed");
          resolve();
        });
      });

      clearTimeout(shutdownTimeout);
      console.log("Shutdown completed successfully");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
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
