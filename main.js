import { server } from "./server.js";
import { cors } from "./middlewares.js";
import { staticPage } from "./middlewares.js";

const PORT = 3000;

const app = server();

const staticMiddleWare = await staticPage("files");

app.use(staticMiddleWare);

// app.use(cors);

// app.route("GET", "/task", (req, res) => {
//   res.json({ error: "this is a error" });
// });

// app.route("POST", "/task", (req, res) => {
//   console.log("inside post ");
//   console.log(req);
//   res.send("this is a response from post");
// });

// app.route("PUT", "/", (req, res) => {
//   res.sendStatus(300);
// });

// app.route("DELETE", "/", (req, res) => {
//   res.send("this is a response from delete");
// });

app.listen(PORT, () => {
  console.log("listening");
});

//pid 14378
