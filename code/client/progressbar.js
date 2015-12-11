
angular.module("epicsjs.progressbar", [])

app.directive("progressbar",function(){
	return {
		restrict: 'E',
		scope: {
			foreground: '@',
			background: '@',
			colour: '@',
			max: '@',
			min: '@',
			percentage: '@',	
			text: '@',		
			width: '@',
			height:  '@',
			ddd: '@?',
			pv: '@'
		},
		templateUrl: "./svg/progressbar.svg",
		controller: function($scope){

			$scope.id = guid();

			// raise exception for missing compulsory attributes
			if (!angular.isDefined($scope.pv)) {
				throw new Error("No PV specified as attribute");
			}

			// set default values for missing optional attributes
			$scope.min = angular.isDefined($scope.min) ? parseInt($scope.min) : 0;
			$scope.max = angular.isDefined($scope.max) ? parseInt($scope.max) : 100;
			$scope.percentage = angular.isDefined($scope.percentage) ? $scope.percentage : "no";
			$scope.text = angular.isDefined($scope.text) ? $scope.text : "yes";
			$scope.width = angular.isDefined($scope.width) ? $scope.width : 100;
			$scope.height = angular.isDefined($scope.height) ? $scope.height : 20;
			$scope.background = angular.isDefined($scope.background) ? $scope.background : "grey";
			$scope.foreground = angular.isDefined($scope.foreground) ? $scope.foreground : "white";
			$scope.colour = angular.isDefined($scope.colour) ? $scope.colour : "blue";			
			$scope.ddd = angular.isDefined($scope.ddd) ? $scope.ddd : "yes";

			// default values
			$scope.size = 2;
			$scope.value = "";

			// GUIDs
			$scope.grad_id_1 = guid();
			$scope.grad_id_2 = guid();


			// get pv value in real-time
			// and set value
			socket.on($scope.pv, function(message) {
				$scope.$apply(function(){

					// calculate size of fill rectangle depending on min, max and the current valu
					value = parseInt(message.value);
					max = parseInt($scope.max);
					min = parseInt($scope.min);
					$scope.size = (value >= min && value <= max) ? ((value-min)*$scope.width)/(max-min) : 2;

					// if percentage attributed turned on, display percentage value, otherwise raw value
					$scope.value = ($scope.percentage=="yes") ? Math.floor(100*($scope.size/$scope.width)) + "%" : value;

					// if no text, display nothing
					if ($scope.text=="no") { $scope.value = ""; }

					// if 3D is turned on
					if ($scope.ddd=="yes") {
						$scope.fill_1 = "url(#" + $scope.grad_id_1 + ")";
						$scope.fill_2 = "url(#" + $scope.grad_id_2 + ")";
					}
					else {
						$scope.fill_1 = $scope.background;
						$scope.fill_2 = $scope.colour;
					}

				});
			});
		},
		link: function(scope, elem, attr) {

			//var text = svg.find('text');
    		//var bbox = text.get(0).getBBox();
		}
	}
});