import { statusCode } from "./statuscode.js";

const getFirstLine = (status) =>
  "HTTP/1.1" + " " + status + " " + statusCode[status] + "\r\n";
const returnSpace = "\r\n";
const getHeader = (data, mimeType) => {
  let length;
  if (mimeType === "text/plain")
    length = Buffer.byteLength(data) + Buffer.byteLength("\r\n");
  if (mimeType === "application/json")
    length =
      Buffer.byteLength(JSON.stringify(data)) + Buffer.byteLength("\r\n");
  return (
    "Content-Type : " +
    mimeType +
    "\r\n" +
    "Content-Length : " +
    length +
    "\r\n"
  );
};

export function getResponse(req, socket) {
  return {
    send: function (data) {
      socket.write(getFirstLine(200));
      socket.write(getHeader(data, "text/plain"));
      socket.write(returnSpace);
      data && socket.write(JSON.stringify(data));
    },
    sendStatus: function (data) {
      socket.write(getFirstLine(data));
      socket.write(returnSpace);
    },
    json: function (data) {
      socket.write(getFirstLine(200));
      socket.write(getHeader(data, "application/json"));
      socket.write(returnSpace);
      socket.write(JSON.stringify(data) + "\r\n");
    },
  };
}

export function sendResponse(socket, data) {
  socket.write(getFirstLine(data.status));
  socket.write("\r\n");
}

export function sendStatic(socket, data) {
  console.log(data);
  socket.write(getFirstLine(200));
  socket.write(getHeader(data, "text/html"));
  socket.write(returnSpace);
  socket.write(JSON.stringify(data) + "\r\n");
}
