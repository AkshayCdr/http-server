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
  if (
    (req.method === "POST" || req.method === "PUT") &&
    body.byteLength !== 0
  ) {
    if (req.headers["Content-Type"].trim().startsWith("multipart/form-data")) {
      req.body = formDataHandler(req, body);
    } else {
      req.body = conversion[getContentType(req, body)].decode(body);
    }
  }
  next();
  return;
};

const getContentType = (req, body) => req.headers["Content-Type"];

function formDataHandler(req, body) {
  const [_, boundary] = getMimeBoundary(req);
  const parts = body.toString().split(`--${boundary}`).slice(1);
  parts.pop();

  const formData = [];

  parts.forEach((file) => {
    const obj = {};

    const index = file.indexOf("\r\n\r\n");
    const headers = file.substring(0, index);
    const body = file.substring(index + 4);

    const name = headers.match(/name="([^"]+)"/);
    const fileName = headers.match(/filename="([^"]+)"/);
    const mimeType = headers.match(/Content-Type: ([^\s]+)/);

    if (fileName && fileName[1]) obj["filename"] = fileName[1];
    if (mimeType && mimeType[1]) obj["mimetype"] = mimeType[1];
    if (name && name[1]) obj["name"] = name[1];
    if (body) obj["rawData"] = body.trim();

    formData.push(obj);
  });
  return formData;
}

const getMimeBoundary = (req) =>
  req.headers["Content-Type"]
    .split(";")
    .map((ele) => ele.trim())
    .map((ele) => ele.startsWith("boundary") && ele.slice(9));

// "\r\nContent-Disposition: form-data; name=\"file1\"; filename=\"hello.cpp\"\r\nContent-Type: text/x-c\r\n\r\n#include <iostream>\n\nint main() {\n    std::cout << \"Hello World!\";\n    return 0;\n}\n\n\r\n"
// "\r\nContent-Disposition: form-data; name=\"file2\"; filename=\"config\"\r\nContent-Type: application/octet-stream\r\n\r\n[core]\n\trepositoryformatversion = 0\n\tfilemode = true\n\tbare = false\n\tlogallrefupdates = true\n[remote \"origin\"]\n\turl = git@github.com:AkshayCdr/Obsidian.git\n\tfetch = +refs/heads/*:refs/remotes/origin/*\n[branch \"main\"]\n\tremote = origin\n\tmerge = refs/heads/main\n\r\n"
