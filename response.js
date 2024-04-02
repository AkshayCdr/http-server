export function sendResponse(socket, req) {
  response(req);
  const length = Buffer.byteLength('{"name":"babu"}\r\n');
  socket.write("HTTP/1.1 200 OK\r\n");
  socket.write("Content-Type: application/json\r\n");
  socket.write("Content-Length: " + length + "\r\n");
  socket.write("\r\n");
  socket.write('{"name":"babu"}\r\n');
}

function response(req) {
  //first line
  const { method, path, httpVersion } = req;
  console.log(method);
  console.log(path);
  console.log(httpVersion);

  //header
  //body
}
