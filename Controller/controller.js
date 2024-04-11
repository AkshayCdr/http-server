export function insertData(req, res) {
  console.log(req.body);
  setData(req.body);
  res.send("Data set");
}
let index = 2;
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

export function updateData(req, res) {
  console.log("inside update data");
  changeData(req.params.id, req.body);
  res.send("data updated");
}

export function deleteData(req, res) {
  console.log("inside delete data");
  res.send("data deleted");
}

export function toggleStatus(req, res) {
  console.log("inside toggle status");
}

function setData(data) {
  data.id = index++;
  todos.push(data);
}

function changeData(id, data) {
  const todo = todos.map((ele) => {
    if (ele.id === id) {
      (ele.name = data.name),
        (ele.date = data.date),
        (ele.priority = data.priority),
        (ele.description = data.description);
    }
    return ele;
  });
  console.log(todo);
}
