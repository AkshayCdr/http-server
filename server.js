import net from "net";

const server = net.createServer((socket) => {
  // 'connection' listener.
  console.log("client connected");
  socket.on("end", () => {
    console.log("client disconnected");
  });

  socket.on("close", () => {
    console.log("Client disconnected before receiving full response");
    // Handle disconnection (e.g., stop sending data)
  });
  //   socket.write("hello\r\n");

  socket.on("data", (data) => {
    parseData(data);
  });

  //   socket.write("HTTP/1.1 200 OK\r\n");
  //   socket.write("Content-Type: text/plain\r\n");
  //   socket.write("\r\n"); // Empty line to separate headers and body
  //   socket.write("Hello from server!\r\n");

  socket.write("HTTP/1.1 200 OK\r\n");
  socket.write("Content-Type: application/json\r\n");
  socket.write("\r\n");
  socket.write('{"name":"babu"}\r\n');
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
  console.log(data);
  const [firstline, remaining] = firstLineParser(data);
  const [headers, body] = headerParser(remaining);
  //   const bodyData = JSON.parse(body);
  //   console.log(bodyData);
  console.log("outside the function");
}

function firstLineParser(input) {
  const parsedData = input.split(/\r?\n/);
  return [parsedData[0], input.slice(parsedData[0].length).trim()];
}

function headerParser(input) {
  const parsedData = input.split(/(\r?\n){2}/);
  return [parsedData[0], input.slice(parsedData[0].length).trim()];
}
