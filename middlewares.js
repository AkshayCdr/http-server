import fs from "fs";

export function cors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  if (req.method === "OPTIONS") res.writeHead(200);
  next();
}

export async function staticPage(req, res, next) {
  try {
    const path =
      req.path === "/" ? `./public/index.html` : `./public/${req.path}`;
    const data = fs.readFileSync(path).toString();
    const memeType = getMemeType(getFileType(path));
    res.sendStatic(data, memeType);
  } catch (error) {
    res.sendStatus(404);
  }
  next();
}

const getFileType = (path) => path.match(/\.\w+/)[0].slice(1);

const getMemeType = (file) => {
  const memeTypes = {
    html: "text/html",
    css: "text/css",
  };

  return memeTypes[file];
};
