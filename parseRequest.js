export function parseRequest(input) {
  const [firstline, remaining] = firstLineParser(input.toString());
  const [method, path, httpVersion] = firstline.split(" ");
  const parsedHeader = headerParser(remaining);

  return {
    method:
      method === "OPTIONS"
        ? parsedHeader["Access-Control-Request-Method"]
        : method,
    path,
    httpVersion,
    parsedHeader,
  };
}

const firstLineParser = (input) => [
  input.split(/\r?\n/)[0],
  input.slice(input.split(/\r?\n/)[0].length).trim(),
];

const headerParser = (input) =>
  Object.fromEntries(
    input
      .split("\r\n")
      .map((string) => string.split(":").map((part) => part.trim()))
  );

// export const splitBody = (input) => input.toString().split(/\r?\n\r?\n/);

// export function splitBody(input) {
//   let index = input.indexOf("\r\n\r\n");
//   console.log(index);
//   const header = input.subarray(0, index).toString();
//   const body = input.subarray(index, index.length).toString();
//   console.log(header);
//   console.log(body);
// }

// export function splitBody(input) {
//   const index = input.indexOf("\r\n\r\n");

//   return [input.subarray(0, index).toString(), input.subarray(index + 4)];
// }

export const splitBody = (input) => [
  input.subarray(0, input.indexOf("\r\n\r\n")).toString(),
  input.subarray(input.indexOf("\r\n\r\n") + 4),
];
