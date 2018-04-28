'use strict';
const IPFS = require('ipfs')
const ipfs = new IPFS()

//https://github.com/ipfs/js-ipfs/tree/master/examples/exchange-files-in-browser
//https://github.com/ipfs/interface-ipfs-core


ipfs.on('start', () => {
  
  // example
  const data = {
      index: 0,
      time: '1505759228',
      transactions: [],
      nonce: 0,

      block1 : {
        index: 1,
        time: '1505759229',
        transactions: [],
        nonce: 0,
    },
    block2 : {
        index: 2,
        time: '1505759230',
        transactions: [],
        nonce: 0,
    }
  }
  


  ipfs.dag.put(data, { format: 'dag-cbor', hashAlg: 'sha2-256' }, (err, cid) => {
    
    const put = cid.toBaseEncodedString()
    console.log(put)

    function errOrLog(err, result) {
      if (err) {
        console.error('error: ' + err)
      } else {
        console.log(result.value)
      }
    }

    ipfs.dag.get(put , errOrLog)

    ipfs.dag.tree(put , errOrLog)

  })  


})
