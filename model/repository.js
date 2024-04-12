import fs from "fs";

export function setDataToFile(data) {
  data.id = generateRandomId();
  appendData(data);
  console.log("data written");
}

const generateRandomId = () => Date.now().valueOf();
const readData = () => fs.readFileSync("todoData.txt", "utf8");
const appendData = (data) =>
  fs.appendFileSync("todoData.txt", JSON.stringify(data));

const reWriteDataToFile = (data) => fs.writeFileSync("todoData.txt", data);

const converDataToArray = (data) =>
  data
    .split("}")
    .map((element) => element.trim() !== "" && JSON.parse(element.trim() + "}"))
    .filter((element) => element);

export const getDataFromFile = () => converDataToArray(readData());

export function updateDataInFile(id, data) {
  let str = "";
  getDataFromFile()
    .map((ele) => {
      if (ele.id === Number(id)) {
        return {
          ...ele,
          name: data.name,
          completed: data.completed || false,
          description: data.description || null,
          priority: data.priority || null,
          date: data.date || null,
        };
      }
      return ele;
    })
    .forEach((ele) => (str += JSON.stringify(ele)));

  reWriteDataToFile(str);
}
