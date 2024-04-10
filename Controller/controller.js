export function insertData(req, res) {
  console.log("inside post");
  res.send("this is a response from post");
}

const todos = [
  {
    id: 1,
    name: "first todo",
    completed: false,
    date: "2024-04-01",
    priority: "LOW",
    description: "there is no desc",
  },
];

export function getData(req, res) {
  console.log("inside get");
  res.json(todos);
}
