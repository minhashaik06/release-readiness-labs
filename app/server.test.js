const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

const app = require('./server');

test('GET /health returns healthy status', async () => {
  const server = app.listen(0);

  await new Promise((resolve) => {
    server.once('listening', resolve);
  });

  const port = server.address().port;

  const response = await new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/health`, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(body)
        });
      });
    }).on('error', reject);
  });

  server.close();

  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(response.body.status, 'ok');
});