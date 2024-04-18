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

const STATIC_PATH = "files";

const staticMiddleWare = await staticPage(STATIC_PATH);

app.use(staticMiddleWare);

app.use((req, res, next) => {
  console.log("this is the first middlware");
  next();
});

app.use(bodyParser);

app.route("POST", "/file", getFile);

app.route("GET", "/task", getData);

app.route("POST", "/task", insertData);

app.route("PUT", "/task/:id", updateData);

app.route("PUT", "/task/done/:id", toggleStatus);

app.route("DELETE", "/task/:id", deleteData);

app.listen(PORT, () => {
  console.log("listening");
});

//things to fix
//keep connection header
//file handling
//chunked data - transfer encoding chunked
