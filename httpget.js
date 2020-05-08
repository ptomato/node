/* global console, process, setTimeout, require */
'use strict';

const https = require('https');

function log(message, ...args) {
  console.log(`${new Date().toISOString()}: ${message}`, ...args);
}

log('start');

const abortController = new AbortController();
process.on('SIGINT', (_, signal) => {
  log('Ctrl+C');
  abortController.abort();
});
setTimeout(() => {
  log('autocancel');
  abortController.abort();
}, 600);

let total = 0;
const req = https.get('https://www.yottaa.com/an-expert-guide-to-making-a-slow-website/', { signal: abortController.signal }, (res) => {
  log('statusCode:', res.statusCode);
  log('headers:', res.headers);

  res.on('data', (d) => {
    log(`received ${d.length} characters`);
    total += d.length;
    process.stdout.write(d.slice(0, 20));
    process.stdout.write('…|\n');
  });

});
req.on('error', (e) => {
  log('error:', e);
});
req.on('abort', () => {
  log(`aborted after ${total} characters`);
});
