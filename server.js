import net from "net";
import { parseRequest, splitBody } from "./parseRequest.js";
import { getResponse, sendResponse } from "./getResponse.js";
import fs from "fs";

const routes = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {},
};

const middleWares = [];

const staticHandlers = [];

const setRoute = (method, path, handler) => (routes[method][path] = handler);

const setMiddlewares = (callback) => middleWares.push(callback);

const setStatic = (callback) => staticHandlers.push(callback);

export function server() {
  const app = net.createServer(handleConnection);
  app.route = setRoute;
  app.use = setMiddlewares;
  app.static = setStatic;
  return app;
}

async function handleConnection(socket) {
  console.log("client connected");

  socket.on("data", async (data) => {
    if (Buffer.byteLength(data) === 0) return null;

    const [headers, body] = splitBody(data);
    const req = parseRequest(headers);
    const res = getResponse(req, socket);

    for (const staticHandler of staticHandlers) {
      await staticHandler(req, res);
      if (res.headersSent) return; // If headers sent, stop further processing
    }

    let index = 0;
    if (middleWares.length > 0 && index < middleWares.length) {
      await middleWares[index](req, res, next);
      function next() {
        index = index + 1;
        middleWares.length > index && middleWares[index](req, res, next);
      }
    }

    const methodHandler = routes[req.method][req.path] || null;

    socket.on("end", () => console.log("client disconnected"));

    methodHandler
      ? methodHandler(req, res)
      : socket.writable && sendResponse(socket, { status: 404 });

    // socket.end();
  });
}
