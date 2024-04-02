import net from "net";
import { parseData } from "./parseData.js";
import { sendResponse } from "./response.js";

const server = net.createServer((socket) => {
  console.log("client connected");
  socket.on("end", () => {
    console.log("client disconnected");
  });

  socket.on("data", (data) => {
    const parsedData = parseData(data);
    // sendResponse(socket, parsedData);
  });
});
server.on("error", (err) => {
  throw err;
});
server.listen(3000, () => {
  console.log("server bound");
});
