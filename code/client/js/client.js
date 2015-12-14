// socket
var socket = io()
socket.on('connect',function(){
	console.log('connected');
});


// bindings to html
var app = angular.module("epicsjs", 
	['epicsjs.pvcontroller',
	'epicsjs.led',
	'epicsjs.progressbar',
	'epicsjs.switch',
	'epicsjs.imageboolean',
	'epicsjs.imageswitch',
	'epicsjs.blink',
	'epicsjs.custom']);


function pvobj(name, val) {
	return JSON.parse('{"name": "' + name + '", "value": "' + val + '"}');
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}