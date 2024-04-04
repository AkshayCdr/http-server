const conversion = {
  "application/json": {
    json: (data) => JSON.stringify(data),
    extract: (data) => JSON.parse(data),
  },
  "text/plain": {
    json: (data) => JSON.stringify(data),
    extract: (data) => data.toString(),
  },
  //   "text/html":{

  //   }
};

// function mime(mimeType){
//     if
// }
