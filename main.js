import { server } from "./server.js";

const PORT = 3000;

const app = server();

app.route("GET", "/", (req, res) => {
  req.httpVersion;
  // res.send("this is a response from get");
  res.json({ error: "this is a error" });
});

app.route("POST", "/", (req, res) => {
  req.httpVersion;
  res.send("this is a response from post");
});

app.route("PUT", "/", (req, res) => {
  req.httpVersion;
  res.sendStatus(300);
});

app.route("DELETE", "/", (req, res) => {
  req.httpVersion;
  res.send("this is a response from delete");
});

app.listen(PORT, () => {
  console.log("listening");
});
