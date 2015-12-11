angular.module("epicsjs.imageswitch", [])

app.directive("imageswitch", function(){
	return {
		restrict: 'E',
		scope: {
			width: '@',
			height: '@',
			onimage: '@',
			offimage: '@',
			pv: '@'
		},
		template: "<img ng-click='switch()' src='{{source}}' height='{{height}}' width='{{width}}'>",
		controller: function($scope){
			
			// raise exception for missing compulsory attributes
			if (!angular.isDefined($scope.pv)) {
				throw new Error("No PV specified as attribute");
			}
			if (!angular.isDefined($scope.onimage)) {
				throw new Error("No onimage specified as attribute");
			}
			if (!angular.isDefined($scope.offimage)) {
				throw new Error("No offimage specified as attribute");
			}

			// get pv value in real-time
			// and set value
			socket.on($scope.pv, function(message) {
				$scope.$apply(function() {

					$scope.value = message.value;

					if(message.value==1) {
						$scope.source = $scope.onimage;
					}
					else {
						$scope.source = $scope.offimage;
					}
				});
			});

			$scope.switch = function() {			
				socket.emit($scope.pv, pvobj($scope.pv,$scope.value==1 ? 0:1));
			}
		}
	}
});