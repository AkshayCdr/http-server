import fs from "fs";

export function cors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
  }
  next();
}

export async function staticPage(req, res, next) {
  const filePath = "./public/index.html";
  try {
    const data = fs.readFileSync("./public/index.html").toString();
    console.log(data);
    res.sendStatic(data);
  } catch (error) {}
  next();
}
