import net from "net";
import { parseRequest, splitBody } from "./request.js";
import { response } from "./response.js";

const routes = {};

const middleWares = [];

const staticHandlers = [];

const bodyParsers = [];

const setRoute = (method, path, handler) =>
  setRouteHandler(method, path, handler);

const setMiddlewares = (callback) => middleWares.push(callback);

//dont know why static handler adding to array .... it is trash
const setStatic = (callback) => staticHandlers.push(callback);

//why ? array ?
const setBody = (callback) => bodyParsers.push(callback);

export function server() {
  const app = net.createServer(handleConnection);
  app.route = setRoute;
  app.use = setMiddlewares;
  app.static = setStatic;
  app.body = setBody;
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

  await staticHandlers[0](req, res);
  if (res.headersSent) return;

  if (req.method === "POST" || req.method === "PUT")
    if (bodyParsers[0]) req.body = bodyParsers[0](req, body);

  //next function is trash ... need to change it ....
  let index = 0;
  if (middleWares.length > 0 && index < middleWares.length) {
    await middleWares[index](req, res, next);
    function next() {
      index = index + 1;
      middleWares.length > index && middleWares[index](req, res, next);
    }
  }

  const methodHandler = routes[req.path] || null;

  socket.on("end", () => console.log("client disconnected"));

  methodHandler ? methodHandler(req, res) : socket.writable && res.send(404);
}

function setRouteHandler(method, path, handler) {
  path = path.startsWith("/") ? path.slice(1) : path;

  const segments = path.split("/");
  let currentPath = method;

  segments.forEach((segment) => {
    currentPath += "/" + segment;

    routes[currentPath] = handler;
  });
}
