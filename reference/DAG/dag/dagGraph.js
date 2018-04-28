'use strict';
const IPFS = require('ipfs')
const Graph = require('ipld-graph-builder')
const ipfs = new IPFS()

//https://github.com/ipfs/js-ipfs/tree/master/examples/exchange-files-in-browser
//https://github.com/ipfs/interface-ipfs-core


ipfs.on('start', () => {
  const graph = new Graph(ipfs.dag)
    const block0 = {
        index: 0,
        time: '1505759228',
        transactions: [],
        nonce: 0,
    }
    const block1 = {
        index: 1,
        time: '1505759228',
        transactions: [],
        nonce: 0,
    }
    const block2 = {
        index: 2,
        time: '1505759228',
        transactions: [],
        nonce: 0,
    }
  
  const a = {
    some: {
      thing: 'nested'
    }
  }
  const b = {
    lol: 1
  }

    graph.set(block0, '/', block1).then(result => {
      // set "patches" together two objects
      console.log(JSON.stringify(result))
    // flush replaces the links with merkle links, resulting in a single root hash
    graph.flush(result).then((result) => {
      console.log(result)

      // taverse paths through merkle links given a starting vertex
      graph.get(result, '/').then(result2 => {
        console.log(result2)
      })
    })
  })
})