// EPICS.js server.
// (c) Dr. David Michel 2016

var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var epics = require('epics')
var stringify = require('stringify-object');

var middleware = require('socketio-wildcard')();
io.use(middleware);

var pvSocket = {} // list of Sockets of CA channels
var pvClients = {} // list of clients and theirs PVs
var pvMonitors = {} // list of pvs and the # of clients using them.
var pvList = [] // just a list of the monitored pvs

// Registering client
// so we know what PVs are being channeled by this client.
// and starts monitoring PV through CA and handles the socket I/O
function register(client, pv) {

  if(client in pvClients) { pvClients[client].push(pv) }
  else { pvClients[client] = [pv] }

  if(pv in pvSocket) {
    pvMonitors[pv] += 1
  }
  else {
    pvMonitors[pv] = 1

    pvSocket[pv] = new epics.Channel(pv)
    pvSocket[pv].on('value', function (data) { 
      json = {'pv': pv, 'val': data}
      //console.log("updating: " + stringify(json))
      io.emit(pv, json) 
    })
    pvSocket[pv].connect(function () { pvSocket[pv].monitor() })

  }

  pvList.push(pv)

  console.log('Monitoring PV: ' + pv + " for " + pvMonitors[pv] + " client(s)")
}


// Unregister client
// if no other client is looking at a particular PV, disconnect the CA monitor
function unregister(client) {

  if (client in pvClients) {

    pvClients[client].forEach(function (pv) {

      pvMonitors[pv] -= 1

      if (pvMonitors[pv]==0) {
        pvSocket[pv].disconnect()
        delete pvSocket[pv]
        delete pvMonitors[pv]
        pvList.splice(pvList.indexOf(pv), 1)

        console.log("Stop monitoring PV: " + pv)
      }

    })

    delete pvClients[client]
  }

}


// When a client connect or disconnect
io.on("connection", function(socket) {

	// when a client connects
	ip = socket.request.connection.remoteAddress
	port = socket.request.connection.remotePort
	console.log('%s:%s is connected', ip, port)

	// when a client disconnects
	socket.on("disconnect",function(){
    unregister(socket.id)
    socket.disconnect()
    console.log('%s:%s is disconnected', ip, port)
	});

  // when a client ask for a PV to be registered
  socket.on('register', function(pv){
    register(socket.id, pv)
  })


  // deal with messages from client
  socket.on('*', function(packet){

    pvname = packet.data[0]
    pv = packet.data[1]

    if (pvList.indexOf(pvname)==1) { 
      //console.log("writing: " + stringify(pv))
      pvSocket[pvname].put(pv.val)
    }
  })


})


// serves static html
app.use(express.static(__dirname + '/static'))
app.get('/', function (req, res) {
  res.render("index.html")
})

// start server
server.listen(8081, function() {
    console.log('Magic happens at http://%s:%s', require('my-local-ip')(), this.address().port)
})
