import fs from "fs";
import { conversion } from "./mimeType.js";

export function cors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  if (req.method === "OPTIONS") res.writeHead(200);
  next();
}

export async function staticPage(url) {
  return async function staticMidlleware(req, res, next) {
    try {
      const path =
        req.path === "/" ? `./${url}/index.html` : `./${url}/${req.path}`;
      const data = fs.readFileSync(path);
      const memeType = getMimeType(getFileType(path));
      res.send(200, data, memeType);
    } catch (error) {
      //if there is no static file then return
      next();
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

export const bodyParser = (req, res, next, body) => {
  if ((req.method === "POST" || req.method === "PUT") && body.length !== 0) {
    if (req.headers["Content-Type"].trim().startsWith("multipart/form-data")) {
      req.body = fileHandler(req, body);
    } else {
      req.body = conversion[getContentType(req, body)].decode(body);
    }
  }
  next();
  return;
};

const getContentType = (req, body) => req.headers["Content-Type"];

function fileHandler(req, body) {
  console.log(body.toString());
  const [mimeType, boundary] = getMimeBoundary(req);
  return getHeadersBody(body, boundary);
}

const getMimeBoundary = (req) =>
  req.headers["Content-Type"]
    .split(";")
    .map((ele) => ele.trim())
    .map((ele) => ele.startsWith("boundary") && ele.slice(9));

function getHeadersBody(body, boundary) {
  const [header1, header2, rawData] = getSections(body, boundary);
  const headers = header1 + ";" + header2;
  return { headers: getHeadersObj(headers), rawData };
}

function getHeadersObj(headers) {
  const headerObj = {};
  headers
    .replaceAll("=", ":")
    .replaceAll('"', "")
    .split(";")
    .forEach((ele) => {
      const [key, value] = ele.split(":");
      headerObj[key.trim()] = value.trim();
    });
  return headerObj;
}

const getSections = (body, boundary) =>
  body
    .toString()
    .trim()
    .split(boundary)
    .filter((ele) => ele !== "--")
    .join()
    .split(/\r\n/)
    .filter((ele) => ele !== "" && ele !== "--");
