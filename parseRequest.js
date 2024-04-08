export function parseRequest(input) {
  const [firstline, remaining] = firstLineParser(input.toString());
  console.log(firstline)
  console.log(remaining)
  const [method, path, httpVersion] = firstline.split(" ");
  const parsedHeader = headerParser(remaining);

  return {
    method,
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

export const splitBody = (input) => input.toString().split(/\r?\n\r?\n/);

// export function splitBody(input) {
//   const [headers, body] = input.toString().split(/\r?\n\r?\n/);
//   bodyBuffer = Buffer.
// }
