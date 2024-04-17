import net from "net";
import { parseRequest, splitBody } from "./request.js";
import { response } from "./response.js";

const routes = {};

const middleWares = [];

const staticHandlers = [];

const setRoute = (method, path, handler) =>
  setRouteHandler(method, path, handler);

const setMiddlewares = (callback) => middleWares.push(callback);

//dont know why static handler adding to array .... it is trash
const setStatic = (callback) => staticHandlers.push(callback);

export function server() {
  const app = net.createServer({ allowHalfOpen: false }, handleConnection);
  app.route = setRoute;
  app.use = setMiddlewares;
  app.static = setStatic;
  return app;
}

async function handleConnection(socket) {
  console.log("client connected");
  socket.on("data", onData.bind(null, socket));
}

async function onData(socket, data) {
  if (Buffer.byteLength(data) === 0) return null;

  const [headers, body] = splitBody(data);
  const req = parseRequest(headers, routes);
  const res = response(req, socket);

  keepAliveConnection(socket, req);

  await staticHandlers[0](req, res);
  if (res.headersSent) return;

  let index = 0;
  if (middleWares.length > 0 && index < middleWares.length) {
    await middleWares[index](req, res, next, body);
    function next() {
      index = index + 1;
      middleWares.length > index && middleWares[index](req, res, next, body);
    }
  }

  const methodHandler = routes[req.path] || null;

  methodHandler ? methodHandler(req, res) : socket.writable && res.send(404);

  socket.on("end", () => {
    console.log("client disconnected");
  });
}

function keepAliveConnection(socket, req) {
  if (!isThereKeepAlive(req)) return;
  socket.setTimeout(3000);
  socket.on("timeout", () => {
    console.log("Time out .. Connection disconnecting");
    socket.end();
  });
}

const isThereKeepAlive = (req) =>
  req.headers["Connection"] &&
  req.headers["Connection"].toLowerCase() === "keep-alive";

function setRouteHandler(method, path, handler) {
  path = path.startsWith("/") ? path.slice(1) : path;

  const segments = path.split("/");
  let currentPath = method;

  segments.forEach((segment) => {
    currentPath += "/" + segment;

    routes[currentPath] = handler;
  });
}
