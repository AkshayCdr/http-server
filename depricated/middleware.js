// function formDataHandler(req, body) {
//   console.log(body.toString());
//   const [mimeType, boundary] = getMimeBoundary(req);
//   return getHeadersBody(body, boundary);
// }
// const getMimeBoundary = (req) =>
//   req.headers["Content-Type"]
//     .split(";")
//     .map((ele) => ele.trim())
//     .map((ele) => ele.startsWith("boundary") && ele.slice(9));

// function getHeadersBody(body, boundary) {
//   const [header1, header2, rawData] = getSections(body, boundary);
//   console.log(getSections(body, boundary));
//   console.log(header1);
//   console.log(header2);
//   console.log(rawData);
//   const headers = header1 + ";" + header2;
//   return { headers: getHeadersObj(headers), rawData };
// }

// function getHeadersObj(headers) {
//   const headerObj = {};
//   headers
//     .replaceAll("=", ":")
//     .replaceAll('"', "")
//     .split(";")
//     .forEach((ele) => {
//       const [key, value] = ele.split(":");
//       headerObj[key.trim()] = value.trim();
//     });
//   return headerObj;
// }

// const getSections = (body, boundary) =>
//   body
//     .toString()
//     .trim()
//     .split(boundary)
//     .filter((ele) => ele !== "--")
//     .join()
//     .split(/\r\n/)
//     .filter((ele) => ele !== "" && ele !== "--");
