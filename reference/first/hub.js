var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

exports.startHub = () => {
    io.on('connection', function(socket){
        console.log('Hub Started.')

        socket.on('join', function(room) {
        // Get the list of peers in the room
        var peers = io.nsps['/'].adapter.rooms[room] ?
                    Object.keys(io.nsps['/'].adapter.rooms[room].sockets) : []
        
        // Send them to the client
        socket.emit('peers', peers);
        // And then add the client to the room
        socket.join(room);
        });

        socket.on('signal', function(data) {
        var client = io.sockets.connected[data.id];
        client && client.emit('signal', {
            id: socket.id,
            signal: data.signal,
        });
        });
    });
}