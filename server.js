import net from "net";
import { parseRequest } from "./parseRequest.js";
import { getResponse } from "./getResponse.js";

const routes = {
  GET: {},
  POST: {},
};

export function server() {
  const app = net.createServer(handleConnection);
  app.get = function (path, getHandler) {
    routes["GET"][path] = getHandler;
  };
  app.post = function (path, postHandler) {
    routes["POST"][path] = postHandler;
  };
  return app;
}

function handleConnection(socket) {
  console.log("client connected");
  socket.on("data", (data) => {
    const req = parseRequest(data);
    const res = getResponse(req, socket);
    routes[req.method][req.path](req, res);
    socket.end();
  });

  socket.on("end", () => {
    console.log("client disconnected");
  });
}
