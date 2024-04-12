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
  res.json(getDataFromFile());
}

export function updateData(req, res) {
  updateDataInFile(req.params.id, req.body);
  res.send("data updated");
}

export function deleteData(req, res) {
  deleteDataInFile(req.params.id);
  res.send("data deleted");
}

export function toggleStatus(req, res) {
  changeTaskStatus(req.params.id, req.body);
  res.send("status changed");
}
