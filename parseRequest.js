export function parseRequest(input) {
  const [firstline, remaining] = firstLineParser(input.toString());
  const [method, path, httpVersion] = firstline.split(" ");
  // if (method === "OPTIONS") return corsParser(firstline.split(" "), remaining);
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

export const splitBody = (input) => input.toString().split(/\r?\n\r?\n/);

// function corsParser([_, path, httpVersion], remaining) {
//   const parsedHeader = headerParser(remaining);
//   parsedHeader["Access-Control-Request-Method"]
// }
