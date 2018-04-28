'use strict'
const kad = require('kad')
const quasar = require('kad-quasar')
const spartacus = require('kad-spartacus')

const level = require('level')
const db = level('./db')

// Initialize our node
const node = kad({
  transport: new kad.HTTPTransport(),
  storage: db,
  contact: { hostname: 'localhost', port: 8080 }
})

const seed = [
  'ea48d3f07a5241291ed0b4cab6483fa8b8fcc127',
  { hostname: 'localhost', port: 8080 }
]

node.plugin(spartacus())

//console.log(node.identity.toString('base64'))
node.listen(1337)
node.join(seed, function() {
  console.log(`Connected to ${node.router.size} peers!`);
});