import { statusCode } from "./statuscode.js";
import { conversion } from "./mimeType.js";

const getFirstLine = (status = 200) =>
  "HTTP/1.1" + " " + status + " " + statusCode[status];

const returnSpace = "\r\n";

const getContentType = (mimeType) => `Content-Type : ${mimeType}`;
const getContentLength = (data) => `Content-Length : ${findLength(data)}`;

const createResponse = (statsCode, mimeType, data) => [
  getFirstLine(statsCode),
  getContentType(mimeType),
  getContentLength(data),
];

const getttResponse = (statsCode, mimeType, data) =>
  createResponse(statsCode, mimeType, data).join("\r\n") + "\r\n";

export function getResponse(req, socket) {
  let firstLine = getFirstLine();
  const header = {};
  if (req.headers["Connection"])
    header["Connection"] = req.headers["Connection"];
  header["Date"] = Date.now().toString();

  return {
    headersSent: false,
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
      header[key] = value;
    },
    writeHead: function (status) {
      firstLine = getFirstLine(status);
      socket.write(firstLine);
      socket.write(JSON.stringify(header));
      socket.write(returnSpace);
      socket.end();
    },
    sendStatic: function (data, mimeType) {
      this.headersSent = true; //only here
      const encodedData = conversion[mimeType].encode(data);
      const temp = getttResponse(200, mimeType, data);
      socket.write(temp);
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

const findLength = (data) => {
  if (!data) return 0;
  const space = Buffer.byteLength("\r\n");
  if (typeof data === "string") return Buffer.byteLength(data, "utf8") + space;
  if (Buffer.isBuffer(data)) return data.length;
  if (typeof data === "object")
    return Buffer.byteLength(JSON.stringify(data), "utf8");
};

//Content-Type : ;
//Content-Length : ;
//Connection : Keep Alive;
