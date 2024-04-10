import { server } from "./server.js";
import { cors } from "./middlewares.js";
import { staticPage, bodyParser } from "./middlewares.js";
import { insertData, getData } from "./Controller/controller.js";

const PORT = 3000;

const app = server();

const STATIC_PATH = "files";

const staticMiddleWare = await staticPage(STATIC_PATH);

app.static(staticMiddleWare);

app.use((req, res, next) => {
  console.log("this is the first middlware");
  next();
});

// app.use(bodyParser);

app.body(bodyParser);

// app.use(cors);

app.route("GET", "/task", getData);

app.route("POST", "/task", insertData);

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
