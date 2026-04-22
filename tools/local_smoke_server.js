const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = Number(process.argv[2] || 8765);

http
  .createServer((request, response) => {
    let pathname = decodeURIComponent(request.url.split("?")[0]);
    if (pathname === "/") pathname = "/index.html";
    const file = path.join(root, pathname);
    fs.readFile(file, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("missing");
        return;
      }
      response.writeHead(200);
      response.end(data);
    });
  })
  .listen(port, "127.0.0.1");
