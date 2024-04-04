import net from "net";
import { parseRequest, splitBody } from "./parseRequest.js";
import { getResponse, sendResponse } from "./getResponse.js";

const routes = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {},
};

const setRoute = (method, path, handler) => (routes[method][path] = handler);

export function server() {
  const app = net.createServer(handleConnection);
  app.route = setRoute;
  return app;
}

function handleConnection(socket) {
  console.log("client connected");
  socket.on("data", (data) => {
    if (Buffer.byteLength(data) < 0) return null;
    const [headers, body] = splitBody(data);
    const req = parseRequest(headers);
    const res = getResponse(req, socket);
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
