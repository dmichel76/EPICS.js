angular.module("epicsjs.imageboolean", [])

app.directive("imageboolean", function() {
	return {
		restrict: 'E',
		scope: {
			onimage: '@',
			offimage: '@',
			width: '@',
			height: '@',
			pv: '@'
		},
		template: "<img src='{{source}}' height='{{height}}' width='{{width}}'>",
		controller: function($scope) {
			
			$scope.id = guid();

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

					if(message.value==1) {
						$scope.source = $scope.onimage;
					}
					else {
						$scope.source = $scope.offimage;
					}
				});
			});
		}
	}
});