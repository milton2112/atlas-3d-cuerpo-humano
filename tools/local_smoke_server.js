const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = Number(process.argv[2] || 8765);
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".glb": "model/gltf-binary",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

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
      response.writeHead(200, { "Content-Type": mimeTypes[path.extname(file).toLowerCase()] ?? "application/octet-stream" });
      response.end(data);
    });
  })
  .listen(port, "127.0.0.1");
