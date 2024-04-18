import {
  generateRandomId,
  appendData,
  reWriteDataToFile,
  converDataToArray,
  SortBasedOnId,
  readData,
  saveFile,
} from "./fileOperations.js";

export function setDataToFile(data) {
  data.id = generateRandomId();
  appendData(data);
}

export const getDataFromFile = () =>
  SortBasedOnId(converDataToArray(readData()));

export function updateDataInFile(id, data) {
  let str = "";
  getDataFromFile()
    .map((ele) => {
      //look at the type of the data you are checking ......
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

export function deleteDataInFile(id) {
  let str = "";
  getDataFromFile()
    .filter((ele) => ele.id !== Number(id))
    .forEach((ele) => (str += JSON.stringify(ele)));

  reWriteDataToFile(str);
}

export function changeTaskStatus(id, data) {
  let str = "";
  getDataFromFile()
    .map((ele) => {
      //look at the type of the data you are checking ......
      if (ele.id === Number(id)) {
        return {
          ...ele,
          completed: data.completed || false,
        };
      }
      return ele;
    })
    .forEach((ele) => (str += JSON.stringify(ele)));

  reWriteDataToFile(str);
}

export async function writeToFile(req) {
  req.body.forEach((formData) => {
    if (formData.filename) {
      //if it is file
      try {
        saveFile(formData);
      } catch (error) {
        console.log(error.message);
      }
    }
  });
}
