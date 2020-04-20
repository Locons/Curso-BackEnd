const io = require('socket.io-client');

let host = 'http://localhost:3000';

if (process.env.NODE_ENV && process.env.NODE_ENV == 'production'){
    host = 'https://stormy-peak-66883.herokuapp.com/';
}

let socket = io.connect(host, {reconnect: true});

socket.on('connect', function(){
    console.log("\n\nConecto\n\n");
})

module.exports = socket;