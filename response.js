import { statusCode } from "./statuscode.js";
import { conversion } from "./mimeType.js";

const getFirstLine = (status = 200) =>
  "HTTP/1.1" + " " + status + " " + statusCode[status];

const CLRF = "\r\n";

const getContentType = (mimeType) => `Content-Type: ${mimeType}`;
const getContentLength = (data) => `Content-Length: ${findLength(data)}`;
const getConnection = (req) => `Connection: ${req.headers["Connection"]}`;
const getDate = () => `Date: ${new Date().toUTCString()}`;

const getResponse = (statsCode, mimeType, data, req) =>
  [
    getFirstLine(statsCode),
    getDate(),
    mimeType && getContentType(mimeType),
    data && getContentLength(data),
    req.headers["Connection"] && getConnection(req),
  ].filter((header) => header !== undefined);

const createResponse = (statsCode, mimeType, data, req) =>
  getResponse(statsCode, mimeType, data, req).join("\r\n") + "\r\n";

export function response(req, socket) {
  return {
    headersSent: false,
    send: function (status, data, mimeType) {
      this.headersSent = true; //only here
      const encodedData = mimeType && conversion[mimeType].encode(data);
      const response = createResponse(status, mimeType, data, req);
      socket.write(response);
      socket.write(CLRF);
      encodedData && socket.write(encodedData);
      req.headers["Connection"].toLowerCase() !== "keep-alive" && socket.end();
    },
  };
}

const findLength = (data) => {
  if (!data) return 0;
  if (typeof data === "string") return Buffer.byteLength(data, "utf8");
  if (Buffer.isBuffer(data)) return data.length;
  if (typeof data === "object")
    return Buffer.byteLength(JSON.stringify(data), "utf8");
};
