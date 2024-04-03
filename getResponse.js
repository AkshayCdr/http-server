import { statusCode } from "./statuscode.js";

export function getResponse(req, socket) {
  return {
    send: function (status) {
      const returnSpace = "\r\n";
      const firstLine =
        req.httpVersion + " " + status + " " + statusCode[status] + returnSpace;
      // const body =
      socket.write(firstLine);
      socket.write(returnSpace);
    },
  };
}
