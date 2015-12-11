
angular.module("epicsjs.led", [])

.directive("led", function() {
	return {
		restrict: 'E',
		scope: {
			oncolour: '@?',
			offcolour: '@?',
			defaultcolour: '@?',
			size: '@?',
			stroke: '@?',
			strokewidth: '@?',
			ddd: '@?',
			pv: '@'
		},
		templateUrl: "./svg/led.svg",
		controller: function($scope) {

			$scope.id = guid();

			// raise exception for missing compulsory attributes
			if (!angular.isDefined($scope.pv)) {
				throw new Error("No PV specified as attribute");
			}

			// set default values for missing optional attributes
			$scope.oncolour = angular.isDefined($scope.oncolour) ? $scope.oncolour : "rgb(0,255,0)";
			$scope.offcolour = angular.isDefined($scope.offcolour) ? $scope.offcolour : "rgb(255,0,0)";
			$scope.ddd = angular.isDefined($scope.ddd) ? $scope.ddd : "yes";

			// default values
			$scope.defaultColour = "grey";
			$scope.size= 20;
			$scope.stroke = "black"; 
			$scope.strokewidth = 1.5;

			// GUIDs
			$scope.grad_id_1 = guid();
			$scope.grad_id_2 = guid();

			// get pv value in real-time
			// and set value
			socket.on($scope.pv, function(message) {
				$scope.$apply(function(){
					if(message.value==1) { $scope.colour = $scope.oncolour; }
					else if (message.value==0) { $scope.colour = $scope.offcolour;}
					else { $scope.colour = $scope.defaultColour;}

					// if 3D is turned on
					if ($scope.ddd=="yes") {
						$scope.fill_1 = "url(#" + $scope.grad_id_1 + ")";
						$scope.fill_2 = "url(#" + $scope.grad_id_2 + ")";
					}
					else {
						$scope.fill_1 = $scope.colour;
						$scope.fill_2 = $scope.stroke;
					}

				});
			});
		}
	}
});
