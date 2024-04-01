import net from "net";

const server = net.createServer((socket) => {
  // 'connection' listener.
  console.log("client connected");
  socket.on("end", () => {
    console.log("client disconnected");
  });
  socket.write("hello\r\n");
  socket.pipe(socket);
});
server.on("error", (err) => {
  throw err;
});
server.listen(3000, () => {
  console.log("server bound");
});
