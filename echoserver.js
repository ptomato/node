/* global console, process, require, setTimeout */
'use strict';

const net = require('net');
const clients = [];
const port = 8080;

function log(message) {
  console.log(`${new Date().toISOString()}: ${message}`);
}

const server = net.createServer((stream) => {
  stream.setEncoding('utf8');
  clients.push(stream);
  log('added client');
  stream.on('data', (data) => {
    log(`|${data}| sending to ${clients.length} clients.`);
    setTimeout(() => clients.forEach((c) => c.write(`${data}\0`)), 1000);
  });
  stream.on('end', () => {
    stream.end();
    clients.splice(clients.indexOf(stream), 1);
    log('removed client');
  });
});
process.on('uncaughtException', (e) => {
  log(`uncaught ${e}`);
});
log(`Server's running on 192.168.1.198:${port}`);
server.listen(port);
