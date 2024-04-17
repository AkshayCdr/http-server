export function parseRequest(input, routes) {
  const [firstline, remaining] = firstLineParser(input.toString());
  const [method, path, httpVersion] = firstline.split(" ");
  const [params, dynamicRoute] = parameterAndRouteParser(
    method,
    path,
    routes,
  ) || [null, null];
  const [queries, queryRoute] = queryParser(method, path, routes) || [
    null,
    null,
  ];
  const headers = headerParser(remaining);

  return {
    method:
      method === "OPTIONS" ? headers["Access-Control-Request-Method"] : method,
    path: dynamicRoute ? dynamicRoute : queryRoute ? queryRoute : path,
    params,
    queries,
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
  const [pathArray, routeArray] =
    getPathAndRouteArray(method, path, routes) || [];
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

function queryParser(method, path, routes) {
  const [pathArray, _] = getPathAndRouteArray(method, path, routes) || [];
  if (!pathArray.join("/").includes("?")) return null;
  const output = getQueryParams(pathArray);
  return output || null;
}

const getQueryParams = (path) => [
  getParams(path),
  path.join("/").split("?")[0],
];

const getParams = (path) => {
  const obj = {};
  path
    .join("/")
    .split("?")[1]
    .split("&")
    .forEach((element) => {
      const [key, value] = element.split("=");
      obj[key] = value;
    });
  return obj;
};

function getPathAndRouteArray(method, path, routes) {
  const pathArray = (method + path).split("/");
  const routeArray = [];
  for (let route in routes) routeArray.push(route.split("/"));
  return [pathArray, routeArray];
}
