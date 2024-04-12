import {
  setDataToFile,
  getDataFromFile,
  updateDataInFile,
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
  res.send("data deleted");
}

export function toggleStatus(req, res) {
  console.log("inside toggle status");
}
