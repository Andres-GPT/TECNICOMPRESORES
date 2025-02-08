const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;
const baseDirectory = path.join(__dirname, 'frontend'); // Directorio base para los archivos estáticos
const uploadsDirectory = path.join(__dirname, 'backend/src/uploads'); // Directorio de imágenes

const server = http.createServer((req, res) => {
  let filePath;

  // Verifica si la solicitud es para una imagen en /uploads/
  if (req.url.startsWith('/uploads/')) {
    filePath = path.join(uploadsDirectory, req.url.replace('/uploads/', ''));
  } else {
    filePath = path.join(baseDirectory, req.url === '/' ? 'index.html' : req.url);
  }

  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml',
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
