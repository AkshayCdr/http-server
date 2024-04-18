import {
  setDataToFile,
  getDataFromFile,
  updateDataInFile,
  deleteDataInFile,
  changeTaskStatus,
  writeToFile,
} from "../model/repository.js";

export function insertData(req, res) {
  setDataToFile(req.body);
  res.send(200, "Data set", "text/plain");
}

export function getData(req, res) {
  res.send(201, getDataFromFile(), "application/json");
}

export function updateData(req, res) {
  updateDataInFile(req.params.id, req.body);
  res.send(200, "data updated", "text/plain");
}

export function deleteData(req, res) {
  deleteDataInFile(req.params.id);
  res.send(200, "data deleted", "text/plain");
}

export function toggleStatus(req, res) {
  changeTaskStatus(req.params.id, req.body);
  res.send(200, "status changed", "text/plain");
}

export async function getFile(req, res) {
  console.log("getting file ....");
  await writeToFile(req);
  res.send(200, "file sending success", "text/plain");
}
