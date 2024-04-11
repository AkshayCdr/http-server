import net from "net";
import { parseRequest, splitBody } from "./parseRequest.js";
import { getResponse, sendResponse } from "./getResponse.js";

const routes = {
  // GET: {},
  // POST: {},
  // PUT: {},
  // DELETE: {},
  // PATCH: {},
};

const middleWares = [];

const staticHandlers = [];

const bodyParsers = [];

// const setRoute = (method, path, handler) => (routes[method][path] = handler);

const setRoute = (method, path, handler) =>
  setRouteHandler(method, path, handler);

const setMiddlewares = (callback) => middleWares.push(callback);

const setStatic = (callback) => staticHandlers.push(callback);

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

  socket.on("data", async (data) => {
    if (Buffer.byteLength(data) === 0) return null;

    const [headers, body] = splitBody(data);
    const req = parseRequest(headers, routes);
    const res = getResponse(req, socket);

    for (const staticHandler of staticHandlers) {
      await staticHandler(req, res);
      if (res.headersSent) return;
    }

    if (bodyParsers[0]) req.body = bodyParsers[0](req, body);

    let index = 0;
    if (middleWares.length > 0 && index < middleWares.length) {
      await middleWares[index](req, res, next);
      function next() {
        index = index + 1;
        middleWares.length > index && middleWares[index](req, res, next);
      }
    }

    // pathFormatter(req, routes);
    // console.log(routes);
    // console.log(req);

    const methodHandler = routes[req.path] || null;

    socket.on("end", () => console.log("client disconnected"));

    methodHandler
      ? methodHandler(req, res)
      : socket.writable && sendResponse(socket, { status: 404 });

    // socket.end();
  });
}

// function setRouteHandler(method, path, handler) {
//   console.log("inside hadner");
//   path = path.startsWith("/") ? path.slice(1) : path;
//   const paths = path.split("/");

//   let head = method;

//   paths.forEach((element) => {
//     const node = Object.create({ element: {} });
//     routes[head] = node;
//     head = node;
//   });

//   console.log(routes);
//   //routes[method]path[0]path[1]path[2] ......
//   //if there is : -> dynamic

//   // console.log(paths);
// }

function setRouteHandler(method, path, handler) {
  const paths = []; // Create an empty array to store paths

  // Remove leading slash and split into segments
  path = path.startsWith("/") ? path.slice(1) : path;
  const segments = path.split("/");

  let currentPath = method;

  segments.forEach((segment) => {
    currentPath += "/" + segment;

    // console.log(currentPath);
    // Check for dynamic segment
    // if (segment.startsWith(":")) {
    //   // Dynamic segment - store placeholder in path list
    //   paths.push(currentPath.replace(segment, ":id"));
    // } else {
    //   // Static segment - add full path to list
    //   paths.push(currentPath);
    // }

    // const node = Object.create({ element: {} });
    routes[currentPath] = handler;
  });

  // console.log(routes); // Still logs the route tree
  // console.log(path);
  // Return the list of paths with dynamic placeholders
}

function pathFormatter(req, routes) {
  //req.method/req.path
  // path task/1
  //route GET/task/:id
}
