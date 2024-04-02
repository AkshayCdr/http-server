import net from "net";

const server = net.createServer((socket) => {
  console.log("client connected");
  socket.on("end", () => {
    console.log("client disconnected");
  });

  socket.on("data", (data) => {
    const result = parseData(data);
    console.log(result.body());
  });

  //   socket.write("HTTP/1.1 200 OK\r\n");
  //   socket.write("Content-Type: text/plain\r\n");
  //   socket.write("\r\n"); // Empty line to separate headers and body
  //   socket.write("Hello from server!\r\n");

  //   socket.write("HTTP/1.1 200 OK\r\n");
  //   socket.write("Content-Type: application/json\r\n");
  //   socket.write("\r\n");
  //   socket.write('{"name":"babu"}\r\n');
  //   socket.pipe(socket);
});
server.on("error", (err) => {
  throw err;
});
server.listen(3000, () => {
  console.log("server bound");
});

function parseData(input) {
  console.log("inside the function");
  const data = input.toString();

  const [firstline, remaining] = firstLineParser(data);
  const [method, path, httpVersion] = firstline.split(" ");

  const [headers, body] = headerSplitter(remaining);
  const headerParsed = headerParser(headers);

  console.log("outside the function");

  return {
    method,
    path,
    httpVersion,
    headerParsed,
    body: () =>
      headerParsed.hasOwnProperty("Content-Length") &&
      bodyParser(body, headerParsed["Content-Type"].trim()),
  };
  // const getmethod = () => method;
  // const getpath = () => path;
  // const getHttpVersion = () => httpVersion;
  // const getHeader = () => headerParsed;
  // const getBody = () =>
  //   headerParsed.hasOwnProperty("Content-Length") &&
  //   bodyParser(body, headerParsed["Content-Type"].trim());
}

const firstLineParser = (input) => [
  input.split(/\r?\n/)[0],
  input.slice(input.split(/\r?\n/)[0].length).trim(),
];

const headerSplitter = (input) => [
  input.split(/(\r?\n){2}/)[0],
  input.slice(input.split(/(\r?\n){2}/)[0].length).trim(),
];

const headerParser = (input) =>
  Object.fromEntries(input.split("\r\n").map((string) => string.split(":")));

function bodyParser(body, contentType) {
  if (contentType === "application/json") return JSON.parse(body);
  if (contentType === "text/plain") return body.toString();
}
