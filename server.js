import net from "net";

const server = net.createServer((socket) => {
  console.log("client connected");
  socket.on("end", () => {
    console.log("client disconnected");
  });

  socket.on("data", (data) => {
    parseData(data);
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
  // console.log(data);
  const [firstline, remaining] = firstLineParser(data);
  const [method, path, httpVersion] = firstline.split(" ");

  const [headers, body] = headerSplitter(remaining);
  const result = headerParser(headers);

  if (result.hasOwnProperty("Content-Length"))
    bodyParser(body, result["Content-Type"]);

  console.log("outside the function");
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
  console.log(body);
  console.log(contentType);
}
