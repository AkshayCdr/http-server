import { statusCode } from "./statuscode.js";

const getFirstLine = (status) =>
  "HTTP/1.1" + " " + status + " " + statusCode[status] + "\r\n";

export function getResponse(req, socket) {
  const returnSpace = "\r\n";
  return {
    send: function (status) {
      socket.write(getFirstLine(status));
      socket.write(returnSpace);
    },
    sendStatus: function (status) {
      const firstLine =
        req.httpVersion + " " + status + " " + statusCode[status] + returnSpace;
      // const body =
      socket.write(firstLine);
      socket.write(returnSpace);
    },
  };
}

export function sendResponse(socket, data) {
  const firstLine = getFirstLine(data.status);
  socket.write(firstLine);
}
