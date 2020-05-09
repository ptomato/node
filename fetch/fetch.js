/* global console, process, require, setTimeout */

'use strict';

const fetch = require('@ptomato/node-fetch');

function log(message) {
  console.log(`${new Date().toISOString()}: ${message}`);
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
}, 500);

fetch('https://www.yottaa.com/an-expert-guide-to-making-a-slow-website/', { signal: abortController.signal })
  .then((res) => {
    log(`received result ${res}`);
    return res.text();
  })
  .then((body) => {
    log(`received ${body.length} chars`);
    log(body.slice(0, 1000));
  })
  .catch((err) => log(`${err}`))
  .finally(() => log('end'));
