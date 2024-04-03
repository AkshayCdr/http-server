import { server } from "./server.js";

const PORT = 3000;

const app = server();

app.get("/", (req, res) => {});

app.listen(PORT, () => {
  console.log("listening");
});
