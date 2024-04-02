export function parseData(input) {
  const data = input.toString();

  const [firstline, remaining] = firstLineParser(data);
  const [method, path, httpVersion] = firstline.split(" ");

  const [headers, body] = headerSplitter(remaining);
  const parsedHeader = headerParser(headers);

  return {
    method,
    path,
    httpVersion,
    parsedHeader,
    body: () =>
      parsedHeader.hasOwnProperty("Content-Length") &&
      bodyParser(body, parsedHeader["Content-Type"].trim()),
  };
}

const firstLineParser = (input) => [
  input.split(/\r?\n/)[0],
  input.slice(input.split(/\r?\n/)[0].length).trim(),
];

const headerSplitter = (input) => [
  input.split(/(\r?\n){2}/)[0],
  input.slice(input.split(/(\r?\n){2}/)[0].length).trim(),
];

const headerParser = (input) =>
  Object.fromEntries(input.split("\r\n").map((string) => string.split(":")));

function bodyParser(body, contentType) {
  if (contentType === "application/json") return JSON.parse(body);
  if (contentType === "text/plain") return body.toString();
}
