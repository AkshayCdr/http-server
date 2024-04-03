import net from "net";
import { parseRequest } from "./parseRequest.js";
import { sendResponse } from "./response.js";
import { parseResponse } from "./parseResponse.js";

const routes = {};

export function server() {
  const app = net.createServer(handleConnection);
  app.get = function (path, getHandler) {
    routes[path] = getHandler;
  };
  app.post = function (path, postHandler) {
    routes[path] = postHandler;
  };

  return app;
}

function handleConnection(socket) {
  console.log("client connected");
  socket.on("data", (data) => {
    const req = parseRequest(data);
    console.log(req);
  });
}
