angular.module("epicsjs.pvcontroller", [])

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