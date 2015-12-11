angular.module("epicsjs.blink", [])

app.directive("blink", function($timeout){
	var blinkLinkFunction = function(scope, element, attributes){
		scope.period = attributes["blink"];
		if (scope.period=="") {
			scope.period=1000;
		}
	};
	return {
		restrict: 'A',
		transclude: true,
		scope: {},
		controller: function($scope, $element){
			function showElement(){
				$element.css('visibility','visible');
				$timeout(hideElement,$scope.period);
			}
			function hideElement(){
				$element.css('visibility','hidden')
				$timeout(showElement,$scope.period);
			}
			showElement();
		},
		template: '<div ng-transclude></div>',
		link: blinkLinkFunction
	};
});
