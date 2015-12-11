// setup
console.log("Staring EPICS.js webserver...");
var express = require('express');
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var epics = require('epics');

// read config file
var fs = require('fs');
var array = fs.readFileSync('test.pvs').toString().split("\n");

// monitoring PVs
console.log("Monitoring PVs:");
for (i in array) {

	if (array[i]=="") continue; //ignore empty array element

	var channel = new epics.Channel(array[i]);

	console.log(channel.pvName);

	(function(channel_copy) {

		channel_copy.on('value', function(data){

			obj = pvobj(channel_copy.pvName,data);

			// emit PV when value changes
			io.sockets.emit(channel_copy.pvName, obj);

			(function(channel_copy_copy, obj_copy) {

				io.on("connection", function(socket){

					// emit PV on client connecting
					io.sockets.emit(channel_copy_copy.pvName, obj_copy);

					// receive PVs from clients, write back to IOC
					(function(channel_copy_copy_copy){
						socket.on(channel_copy_copy_copy.pvName, function(message){
							channel_copy_copy.put(message.value);
						});
					})(channel_copy_copy);
				});

			})(channel_copy, obj);

		});

		channel_copy.connect(function(){
			channel_copy.monitor();
		});

	})(channel);
}

function pvobj(name, val) {
	return JSON.parse('{"name": "' + name + '", "value": "' + val + '"}');
}


// when a client connects...
io.on("connection", function(socket){

	// log new connection
	ip = socket.request.connection.remoteAddress;
	console.log('%s is connected',ip);

	//  on client disconnecting
	socket.on("disconnect",function(){
		console.log('%s is disconnected',ip);
		socket.disconnect();
	});

});

// render static page
//console.log("Static html page rendering...");
app.use(express.static('public'))

// routing for single page app
app.get('/', function(req,res){
	res.render("index.html");
});

// start server
server.listen(8080, function(){
    console.log('Magic happens at http://%s:%s', this.address().address, this.address().port);
});

