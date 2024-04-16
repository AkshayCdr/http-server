import { server } from "./server.js";

import { staticPage, bodyParser } from "./middlewares.js";
import {
  insertData,
  getData,
  updateData,
  deleteData,
  toggleStatus,
  getFile,
} from "./Controller/controller.js";

const PORT = 3000;

const app = server();

const STATIC_PATH = "public";

const staticMiddleWare = await staticPage(STATIC_PATH);

app.static(staticMiddleWare);

app.use((req, res, next) => {
  console.log("this is the first middlware");
  next();
});

// app.body(bodyParser);

// app.route("POST", "/file", getFile);

app.route("GET", "/temp", (req, res) => {
  console.log("this is inside get");
  res.send(200, "received temp", "text/plain");
});

// app.route("GET", "/task", getData);

// app.route("POST", "/task", insertData);

// app.route("PUT", "/task/:id", updateData);

// app.route("PUT", "/task/done/:id", toggleStatus);

// app.route("DELETE", "/task/:id", deleteData);

app.listen(PORT, () => {
  console.log("listening");
});
