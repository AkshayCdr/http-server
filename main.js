import { server } from "./server.js";

const PORT = 3000;

const app = server();

// app.use(bodyParser);

app.use(cors);

app.route("GET", "/task", (req, res) => {
  res.json({ error: "this is a error" });
});

app.route("POST", "/task", (req, res) => {
  console.log("inside post");
  console.log(req);
  res.send("this is a response from post");
});

app.route("PUT", "/", (req, res) => {
  res.sendStatus(300);
});

app.route("DELETE", "/", (req, res) => {
  res.send("this is a response from delete");
});

app.listen(PORT, () => {
  console.log("listening");
});

// function bodyParser() {
//   console.log("body parsing...");
// }

function cors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
  }
  next();
}
