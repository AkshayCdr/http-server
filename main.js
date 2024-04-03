import { server } from "./server.js";

const PORT = 3000;

const app = server();

app.get("/", (req, res) => {
  console.log(req.body());
  res.send(200);
});

app.post("/", (req) => {
  console.log(req);
});

app.listen(PORT, () => {
  console.log("listening");
});
