'use strict';
global.debug = require('debug')('app:global')
require('./network/server') // HTTP server and Web sockets
const config = require('./config')
const store = require('./network/store')
const {mine} = require('./network/miner')
require('./network/peers') // Connect to peers and recieve connections