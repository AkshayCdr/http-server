function Response() {
  this.firstline = "";
  this.headers = {};
  this.body = {};
}

Response.prototype.get = function () {
  return {
    firsline: this.firstline,
    headers: this.headers,
    body: this.body,
  };
};

Response.prototype.set = function (headers) {
  this.firstline = "HTTP/1.0 200 OK\r\n";
  this.headers = headers;
  this.body;
};
