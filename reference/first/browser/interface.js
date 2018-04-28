'use strict';
var chain = require("./chain.js");
var SimpleMultiPeer = require('simple-multi-peer')

var peers = [{server: 'ws://localhost:3000', room: 'main'}];

var MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
};


var getBlocks = () => {
    return JSON.stringify(chain.blockchain);
}

var mineBlock = (data) => {
    var newBlock = chain.generateNextBlock(data);
    chain.addBlock(newBlock);
    broadcast(responseLatestMsg());
    console.log('block added: ' + JSON.stringify(newBlock));
    getBlocks();
}

var showPeers = () => {
    peers.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort);
}


var initConnection = (sp) => {
    console.log(sp)
    
    initMessageHandler(sp);
    initErrorHandler(sp);
    // data handler here
};

var initMessageHandler = (sp) => {
    sp.on('message', (data) => {
        var message = JSON.parse(data);
        console.log('Received message' + JSON.stringify(message));
        switch (message.type) {
            case MessageType.QUERY_LATEST:
                write(sp, responseLatestMsg());
                break;
            case MessageType.QUERY_ALL:
                write(sp, responseChainMsg());
                break;
            case MessageType.RESPONSE_BLOCKCHAIN:
                chain.handleBlockchainResponse(message);
                break;
        }
    });
};

var initErrorHandler = (sp) => {
    var closeConnection = (sp) => {
        console.log('connection failed to peer: ' + sp.url);
        sp.destroy();
        peers.splice(peers.indexOf(sp), 1);
    };
    sp.on('close', () => closeConnection(sp));
    sp.on('error', () => closeConnection(sp));
};


var connectToPeers = (newPeers) => {
    newPeers.forEach((peer) => {
        var sp = new SimpleMultiPeer(peer)
        sp.on('connect', () => initConnection(sp));
        sp.on('error', () => {
            console.log('connection failed')
        });
    });
};

var queryChainLengthMsg = () => ({'type': MessageType.QUERY_LATEST});
var queryAllMsg = () => ({'type': MessageType.QUERY_ALL});
var responseChainMsg = () =>({
    'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(blockchain)
});
var responseLatestMsg = () => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([chain.getLatestBlock()])
});

var write = (sp, message) => sp.send(JSON.stringify(message));
var broadcast = (message) => sockets.forEach(socket => write(socket, message));

connectToPeers(peers);