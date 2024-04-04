import { server } from "./server.js";

const PORT = 3000;

const app = server();

// app.static("public");
// server().static("public");

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
