import fs from "fs";

export function cors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  if (req.method === "OPTIONS") res.writeHead(200);
  next();
}

export async function staticPage(url) {
  return async function (req, res, next) {
    try {
      const path =
        req.path === "/" ? `./${url}/index.html` : `./${url}/${req.path}`;
      const data = fs.readFileSync(path);
      const memeType = getMemeType(getFileType(path));
      res.sendStatic(data, memeType);
    } catch (error) {
      res.sendStatus(404);
    }
    next();
  };
}

const getFileType = (path) => path.match(/\.\w+/)[0].slice(1);

const getMemeType = (file) => {
  const memeTypes = {
    html: "text/html",
    css: "text/css",
    jpeg: "image/jpeg",
    js: "text/javascript",
  };

  return memeTypes[file];
};
