//client.js
var io = require('socket.io-client');
var socket = io.connect('http://localhost:8081', {reconnect: true});

// Add a connect listener
socket.on('connect', function () {
    console.log('Connected!');

    // register
    socket.emit('register', 'TEST:PROGRESS');
    socket.emit('register', 'TEST:AI');

});

socket.on('TEST:PROGRESS', function(msg){
    console.log(msg)
});


function sendUpdate(){
    socket.emit('TEST:AI', {'pv': 'TEST:AI', 'val': '1.2'});
}

setTimeout(sendUpdate, 3000);

