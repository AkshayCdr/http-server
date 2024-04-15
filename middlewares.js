import fs from "fs";
import { conversion } from "./mimeType.js";

export function cors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  if (req.method === "OPTIONS") res.writeHead(200);
  next();
}

export const bodyParser = (req, body) =>
  body.length === 0
    ? null
    : conversion[req.headers["Content-Type"]].decode(body);

export async function staticPage(url) {
  return async function staticMidlleware(req, res) {
    try {
      const path =
        req.path === "/" ? `./${url}/index.html` : `./${url}/${req.path}`;
      const data = fs.readFileSync(path);
      const memeType = getMimeType(getFileType(path));
      res.send(200, data, memeType);
    } catch (error) {
      res.send(404);
      return;
    }
  };
}

const getFileType = (path) => path.match(/\.\w+/)[0].slice(1);

const getMimeType = (file) => {
  const mimeTypes = {
    html: "text/html",
    css: "text/css",
    jpeg: "image/jpeg",
    js: "text/javascript",
  };
  return mimeTypes[file];
};
