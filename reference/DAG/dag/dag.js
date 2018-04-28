'use strict';
// push the blocks into a merkle dag

// https://github.com/ipld/js-ipld-dag-pb

// each block is a node in the dag...
// each node is linked with a hash...
// ... a merkle dag!

//const block = require ('./block')

const debug = require('debug')('app:dag')
//const store = require('./store')

const CID = require('cids')

const dag = require('ipld-dag-pb')

const DAGNode = dag.DAGNode
const DAGLink = dag.DAGLink

const multihash = require('multihashes')

//dag.DAGNode.create  // create a DAGNode
//clonedag.DAGNode.clone   // clone a DAGNode
//dag.DAGNode.addLink // add a Link to a DAGNode, creating a new one
//dag.DAGNode.rmLink  // remove a Link to a DAGNode, creating a new one
//dag.DAGLink.create  // create a DAGLink

//const link = new DAGLink(name, size, multihash)
const data = { 
    block0 : {
        index: 0,
        time: '1505759228',
        transactions: [],
        nonce: 0,
    },
    block1 : {
        index: 1,
        time: '1505759228',
        transactions: [],
        nonce: 0,
    },
    block2 : {
        index: 2,
        time: '1505759228',
        transactions: [],
        nonce: 0,
    },
}



// Add block of data to a Dag Node
function dagBlock (block) {
    DAGNode.create(new Buffer(block), (err, node) => {
        if (err) {
        throw error
        }
        console.log (node)
        return dagNode
        // node1 is your DAGNode instance.
        multihash.decode
    })
}

// Link a hash with data
function linkNodes (node, links) {
    links = []
    DAGNode.addLink(new Buffer(node), links, (err, node) => {
        if (err) {
        throw error
        }
        // node - DAGNode instance with the link
        console.log('with link', node.toJSON())
    })
}


//const link = new DAGLink('newlink', 17, multihash.encode(new Buffer (data.block0), code = 0))

//console.log (link)
dagBlock (data.block1.toString())
//addBlocktoNode (data.block2.toString())
//linkNodes (data.block0.toString(), link)
//linkNodes (data.block0.toString())

