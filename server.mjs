import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

const server = createServer(async (request, response) => {
  const urlPath = request.url === "/" ? "/index.html" : request.url;
  const target = normalize(join(root, decodeURIComponent(urlPath)));

  if (!target.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(target);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(target)] || "text/plain; charset=utf-8",
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

const port = 4173;
server.listen(port, () => {
  console.log(`Coin Divination app running at http://localhost:${port}`);
});
