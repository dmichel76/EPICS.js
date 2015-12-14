angular.module("epicsjs.custom", [])

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