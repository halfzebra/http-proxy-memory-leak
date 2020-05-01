const http = require('http');
const httpProxy = require('http-proxy');

const proxyServer = httpProxy.createServer();

const server = http.createServer((req, res) => {
  console.log(req.method, { host: req.headers.host, url: req.url });

  proxyServer.web(req, res, {
    // This host does not exist and will result into an error.
    target: { host: 'http://127.0.0.1', port: 3999 },
    selfHandleResponse: true,
  });
});

proxyServer.on('error', (err, req, res) => {
  console.log('ERROR', err.message);

  req.headers.host = 'example.com'

  proxyServer.web(req, res, {
    target: { host: 'example.com', port: 80 },
    selfHandleResponse: true,
    followRedirects: true,
  });
});

proxyServer.on('proxyRes', (proxyRes, req, res) => {
  console.log('proxyRes', proxyRes.statusCode)
  res.writeHead(proxyRes.statusCode, {
    ...proxyRes.headers
  });
  proxyRes.pipe(res)
});

server.listen(3001, () => {
  console.log('Running at http://localhost:3001');
});
