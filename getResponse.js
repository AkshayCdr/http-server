import { statusCode } from "./statuscode.js";
import { conversion } from "./mimeType.js";

const getFirstLine = (status = 200) =>
  "HTTP/1.1" + " " + status + " " + statusCode[status];

const returnSpace = "\r\n";

const getContentType = (mimeType) => `Content-Type : ${mimeType}`;
const getContentLength = (data) => `Content-Length : ${findLength(data)}`;
const setConnection = (req) => `Connection : ${req.headers["Connection"]}`;

const createResponse = (statsCode, mimeType, data, req) => [
  getFirstLine(statsCode),
  getContentType(mimeType),
  getContentLength(data),
  req.headers["Connection"] && setConnection(req),
];

const getttResponse = (statsCode, mimeType, data, req) =>
  createResponse(statsCode, mimeType, data, req).join("\r\n") + "\r\n";

export function getResponse(req, socket) {
  // const request = req;
  return {
    headersSent: false,
    send: function (status, data, mimeType) {
      this.headersSent = true; //only here
      const encodedData = conversion[mimeType].encode(data);
      const temp = getttResponse(status, mimeType, data, req);
      socket.write(temp);
      socket.write(returnSpace);
      socket.write(encodedData);
    },
  };
}

export function sendResponse(socket, data) {
  socket.write(getFirstLine(data.status));
  socket.write("\r\n");
}

const findLength = (data) => {
  if (!data) return 0;
  const space = Buffer.byteLength("\r\n");
  if (typeof data === "string") return Buffer.byteLength(data, "utf8") + space;
  if (Buffer.isBuffer(data)) return data.length;
  if (typeof data === "object")
    return Buffer.byteLength(JSON.stringify(data), "utf8");
};
