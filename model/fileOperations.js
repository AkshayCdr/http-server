import fs from "fs";

export const generateRandomId = () => Date.now().valueOf();
export const readData = () => fs.readFileSync("todoData.txt", "utf8");
export const appendData = (data) =>
  fs.appendFileSync("todoData.txt", JSON.stringify(data));

export const reWriteDataToFile = (data) =>
  fs.writeFileSync("todoData.txt", data);

export const converDataToArray = (data) =>
  data
    .split("}")
    .map((element) => element.trim() !== "" && JSON.parse(element.trim() + "}"))
    .filter((element) => element);

export const SortBasedOnId = (data) => data.sort((a, b) => a.id - b.id);

export const saveFile = (data) =>
  fs.writeFileSync(`Fileuploads/${data.filename}`, data.rawData);
