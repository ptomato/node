/* global console, require, process, setTimeout */
'use strict';

const net = require('net');

const abortController = new AbortController();
process.on('SIGINT', (_, signal) => {
  abortController.abort();
});

const socket = net.connect({
  port: 8080,
  signal: abortController.signal,
}, () => {
  console.log('connected');
  setTimeout(() => {
    console.log('writing data');
    socket.write('Hello, world!');
    setTimeout(() => socket.end(), 1000);
  }, 1000);
});
socket.on('close', () => console.log('socket closed'));
socket.on('data', (chunk) => console.log(`data received: ${chunk}`));
socket.on('drain', () => console.log('socket drained'));
socket.on('end', () => console.log('end of socket'));
socket.on('error', (error) => console.log(`error: ${error}`));
socket.on('lookup', () => console.log('lookup'));
socket.on('ready', () => console.log('socket ready'));
socket.on('timeout', () => console.log('timeout'));
