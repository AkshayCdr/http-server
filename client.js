import net from "net";
import readline from "readline";
const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const data = {
  name: "abhi",
  age: 14,
};

const headers = "HTTP1.0 200 OK\r\n";

const client = net.createConnection({ port: 3000 }, () => {
  client.write("hai\r\n");
  client.write(headers);
  client.write(JSON.stringify(data));
  console.log("connected to server");
});

read.on("line", (data) => {
  client.write(data + "\n");
});

client.on("data", (data) => {
  console.log(data.toString());
});

client.on("end", () => {
  console.log("disconnected from server");
});
