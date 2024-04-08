import net from "net";
import { parseRequest, splitBody } from "./parseRequest.js";
import { getResponse, sendResponse, sendStatic } from "./getResponse.js";
import fs from "fs";

const routes = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {},
};

const middleWares = [];

const setRoute = (method, path, handler) => (routes[method][path] = handler);

const setMiddlewares = (callback) => middleWares.push(callback);

export function server() {
  const app = net.createServer(handleConnection);
  app.route = setRoute;
  app.use = setMiddlewares;
  return app;
}

async function handleConnection(socket) {
  console.log("client connected");
  socket.on("data", async (data) => {
    if (Buffer.byteLength(data) < 0) return null;

    const [headers, body] = splitBody(data);
    const req = parseRequest(headers);
    const res = getResponse(req, socket);

    if (middleWares.length > 0) {
      let index = 0;
      await middleWares[index](req, res, next);
      function next() {
        index = index + 1;
        middleWares.length > index && middleWares[index](req, res, next);
      }
    }

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
