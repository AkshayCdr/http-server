import { statusCode } from "./statuscode.js";
import { conversion } from "./mimeType.js";

const getFirstLine = (status) =>
  "HTTP/1.1" + " " + status + " " + statusCode[status] + "\r\n";

const returnSpace = "\r\n";

const getHeader = (data, mimeType) => {
  let length;
  if (mimeType === "text/plain" || mimeType === "text/html")
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
  let firstLine = ``;
  const header = {};
  const body = {};

  return {
    send: function (data) {
      socket.write(getFirstLine(200));
      socket.write(getHeader(data, "text/plain"));
      socket.write(returnSpace);
      data && socket.write(JSON.stringify(data));
      socket.end();
    },
    sendStatus: function (data) {
      socket.write(getFirstLine(data));
      socket.write(returnSpace);
      socket.end();
    },
    json: function (data) {
      socket.write(getFirstLine(200));
      socket.write(getHeader(data, "application/json"));
      socket.write(returnSpace);
      socket.write(JSON.stringify(data) + "\r\n");
      socket.end();
    },
    setHeader: function (key, value) {
      header[key] = value + "\r\n";
    },
    writeHead: function (status) {
      firstLine = getFirstLine(status);
      socket.write(firstLine);
      socket.write(JSON.stringify(header));
      socket.write(returnSpace);
      socket.end();
    },
    sendStatic: function (data, mimeType) {
      socket.write(getFirstLine(200));
      const encodedData = conversion[mimeType].encode(data);
      // socket.write(getHeader(data, "text/html"));
      // console.log(getHeader(data, "text/html"));
      socket.write(`Content-Type: ${mimeType}\r\n`);
      socket.write(returnSpace);
      socket.write(encodedData);
      socket.end();
    },
  };
}

export function sendResponse(socket, data) {
  socket.write(getFirstLine(data.status));
  socket.write("\r\n");
}
