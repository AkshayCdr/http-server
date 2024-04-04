import net from "net";
import { parseRequest } from "./parseRequest.js";
import { getResponse, sendResponse } from "./getResponse.js";

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
    if (Buffer.byteLength(data) < 0) return null;
    const req = parseRequest(data);
    const res = getResponse(req, socket);
    // routes[req.method][req.path](req, res);
    const methodHandler = routes[req.method][req.path] || null;
    if (methodHandler) {
      methodHandler(req, res);
    } else {
      sendResponse(socket, { status: 404 });
    }
    socket.end();
  });

  socket.on("end", () => {
    console.log("client disconnected");
  });
}
