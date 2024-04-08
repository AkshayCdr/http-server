import fs from "fs";

// (async () => {
//   const data = await fs.readFile("/text.txt", "utf8");
//   console.log(data);
// })();

const data = fs.readFileSync("./public/index.html").toString();
console.log(data);
