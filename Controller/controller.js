import {
  setDataToFile,
  getDataFromFile,
  updateDataInFile,
  deleteDataInFile,
  changeTaskStatus,
} from "../model/repository.js";

export function insertData(req, res) {
  setDataToFile(req.body);
  res.send("Data set");
}

export function getData(req, res) {
  console.log("inside get");
  res.json(getDataFromFile());
}

export function updateData(req, res) {
  console.log("inside update data");
  updateDataInFile(req.params.id, req.body);
  res.send("data updated");
}

export function deleteData(req, res) {
  console.log("inside delete data");
  deleteDataInFile(req.params.id);
  res.send("data deleted");
}

export function toggleStatus(req, res) {
  console.log("inside toggle status");
  changeTaskStatus(req.params.id, req.body);
  res.send("status changed");
}
