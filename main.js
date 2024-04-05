import { server } from "./server.js";

const PORT = 3000;

const app = server();

// app.use(bodyParser);

app.use((req, res, next) => {
  console.log("this is first middleware");
  console.log(req);
  next();
});

app.use((req, res, next) => {
  console.log("this is the second middleware");
  console.log(res);
  next();
});

app.route("GET", "/", (req, res) => {
  res.json({ error: "this is a error" });
});

app.route("POST", "/", (req, res) => {
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

function bodyParser() {
  console.log("body parsing...");
}
