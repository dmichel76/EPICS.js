// socket
var socket = io()
socket.on('connect',function(){
	console.log('connected');
});


// bindings to html
var app = angular.module("epicsjs", 
	['epicsjs.led','epicsjs.progressbar','epicsjs.switch','epicsjs.imageboolean','epicsjs.imageswitch','epicsjs.blink']);

// general controller
app.controller("pvcontroller", function($scope, $attrs){
	
	if (!$attrs["pv"]) throw new Error("No PV specified as attribute");

	socket.on($attrs['pv'], function(message) {
		$scope.$apply(function(){
			$scope.value = message.value;
			$scope.name = message.name;
		});
	});
});

app.directive("custom", function() {
	return {
		restrict: 'E',
		scope: {
			pv: '@'
		},
		controller: function($scope, $element) {

			$scope.size = 10;

			// == using SVG.js
			var draw = SVG($element.find('custom'));
			circle = draw.circle(20);

						// how to modify it once it's drawn?

			// get pv value in real-time
			
			socket.on($scope.pv, function(message) {
				$scope.$apply(function() {
					$scope.value = message.value;
					circle.attr('r',$scope.value);
				});
			});
			
		}
	}
});


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