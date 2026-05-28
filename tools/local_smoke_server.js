const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = Number(process.argv[2] || 8765);
const cacheableExtensions = new Set([".css", ".js", ".svg", ".glb", ".png", ".jpg", ".jpeg"]);
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
    const file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(root)) {
      response.writeHead(403);
      response.end("forbidden");
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("missing");
        return;
      }
      const extension = path.extname(file).toLowerCase();
      const headers = { "Content-Type": mimeTypes[extension] ?? "application/octet-stream" };
      if (cacheableExtensions.has(extension)) headers["Cache-Control"] = "public, max-age=3600";
      else headers["Cache-Control"] = "no-cache";
      response.writeHead(200, headers);
      response.end(data);
    });
  })
  .listen(port, "127.0.0.1");
