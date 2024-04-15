export function parseRequest(input, routes) {
  const [firstline, remaining] = firstLineParser(input.toString());
  const [method, path, httpVersion] = firstline.split(" ");
  const [params, dynamicRoute] = parameterAndRouteParser(
    method,
    path,
    routes,
  ) || [null, null];
  const [query, queryRoute] = [null, null];
  const headers = headerParser(remaining);

  return {
    method:
      method === "OPTIONS" ? headers["Access-Control-Request-Method"] : method,
    path: dynamicRoute ? dynamicRoute : path,
    params,
    httpVersion,
    headers,
  };
}

const firstLineParser = (input) => [
  input.split(/\r?\n/)[0],
  input.slice(input.split(/\r?\n/)[0].length).trim(),
];

const headerParser = (input) =>
  Object.fromEntries(
    input
      .split("\r\n")
      .map((string) => string.split(":").map((part) => part.trim())),
  );

export const splitBody = (input) => [
  input.subarray(0, input.indexOf("\r\n\r\n")).toString(),
  input.subarray(input.indexOf("\r\n\r\n") + 4),
];

function parameterAndRouteParser(method, path, routes) {
  // GET/task/1.. . split('/')
  const pathArray = (method + path).split("/");
  const routeArray = [];
  //GET/task/:id
  for (let route in routes) routeArray.push(route.split("/"));
  //params{id:1 , username:"name", ....}, path{GET/task/:id}
  const output = getParametersAndRoute(pathArray, routeArray);
  return output || null;
}

function getParametersAndRoute(path, route) {
  const params = {};
  for (let i = 0; i < route.length; i++) {
    let match = true;
    for (let j = 0; j < path.length; j++) {
      if (route[i][j] && route[i][j].startsWith(":")) {
        params[route[i][j].slice(1)] = path[j];
        continue;
      }
      if (!(path[j] === route[i][j])) {
        match = false;
        break;
      }
    }
    if (match) return [params, route[i].join("/")];
  }
  return null;
}
