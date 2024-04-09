export const conversion = {
  "application/json": {
    decode: (data) => JSON.stringify(data),
    encode: (data) => JSON.parse(data),
  },
  "text/plain": {
    decode: (data) => JSON.stringify(data),
    encode: (data) => data.toString(),
  },
  "text/html": {
    decode: (data) => data,
    encode: (data) => data,
  },
  "text/css": {
    decode: (data) => data,
    encode: (data) => data,
  },
  "image/jpeg": {
    decode: (data) => data,
    encode: (data) => data,
  },
};
