/* global console, require, process, setTimeout */
'use strict';

const fs = require('fs');

const abortController = new AbortController();
process.on('SIGINT', (_, signal) => {
  abortController.abort();
});

// The test program reads one character per second from the file.
// Ctrl+C will invoke the abort signal.

const stream = fs.createReadStream('README.md', {
  end: 10,
  signal: abortController.signal,
});
stream.on('close', () => console.log('stream closed'));
stream.on('data', (chunk) => {
  console.log(`data received: ${chunk}`);
  setTimeout(() => stream.read(1), 1000);
});
stream.on('end', () => console.log('end of stream'));
stream.on('error', (error) => console.log(`error: ${error}`));
stream.on('pause', () => console.log('stream paused'));
stream.on('readable', () => console.log('stream readable'));
stream.on('resume', () => console.log('stream resumed'));
setTimeout(() => stream.read(1), 1000);
