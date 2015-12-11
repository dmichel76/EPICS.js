angular.module("epicsjs.switch", [])


app.directive("switch", function(){
	return {
		restrict: 'E',
		scope: {
			width: '@',
			height: '@',
			offcolour: '@',
			oncolour: '@',
			offtext: '@',
			ontext: '@',
			textcolour: '@',
			fontsize: '@',
			pv: '@'
		},
		templateUrl: "./svg/switch.svg",
		controller: function($scope) {

			function init(){

				$scope.id = guid();

				$scope.width = angular.isDefined($scope.width) ? $scope.width : 80;
				$scope.height = angular.isDefined($scope.height) ? $scope.height : 30;
				$scope.ontext = angular.isDefined($scope.ontext) ? $scope.ontext : "ON";
				$scope.offtext = angular.isDefined($scope.offtext) ? $scope.offtext : "0FF";
				$scope.textcolour = angular.isDefined($scope.textcolour) ? $scope.textcolour : "black";				
				$scope.fontsize = angular.isDefined($scope.fontsize) ? $scope.fontsize : 10;
				$scope.offcolour = angular.isDefined($scope.offcolour) ? $scope.offcolour : "rgb(200,100,100)";				
				$scope.oncolour = angular.isDefined($scope.oncolour) ? $scope.oncolour : "rgb(100,200,100)";				

				$scope.strokewidth = 1;
				$scope.sliderextra = 1;

				$scope.strokecolour = "rgb(80,80,80)";
				$scope.slidercolour = "rgb(220,220,220)"
				$scope.slidercolour_light = "white"

				$scope.offbox_x = $scope.strokewidth+$scope.sliderextra;
				$scope.offbox_y = $scope.strokewidth+$scope.sliderextra;
				$scope.offbox_width = 0.5*$scope.width-($scope.strokewidth+$scope.sliderextra);
				$scope.offbox_height = $scope.height-2*$scope.offbox_y;

				$scope.onbox_x = $scope.offbox_x+$scope.offbox_width;
				$scope.onbox_y = $scope.strokewidth+$scope.sliderextra;
				$scope.onbox_width = 0.5*$scope.width-($scope.strokewidth+$scope.sliderextra);
				$scope.onbox_height = $scope.height-2*$scope.onbox_y;

				$scope.slider_shift = 0.5*$scope.width-$scope.sliderextra-$scope.strokewidth;
				$scope.slider_y = $scope.strokewidth*0.5;
				$scope.slider_width = 0.5*$scope.width+$scope.sliderextra;
				$scope.slider_height = $scope.height-$scope.strokewidth;
			}
			init();

			function move(pos){
					$scope.slider_x = $scope.strokewidth*0.5 
					+ pos*$scope.slider_shift;

					$scope.l1x1 = $scope.slider_x + 3*(0.5*$scope.width/8);
					$scope.l1y1 = ($scope.height/4);
					$scope.l1x2 = $scope.slider_x + 3*(0.5*$scope.width/8);
					$scope.l1y2 = 3*($scope.height/4);

					$scope.l2x1 = $scope.slider_x + 4*(0.5*$scope.width/8);
					$scope.l2y1 = ($scope.height/4);
					$scope.l2x2 = $scope.slider_x + 4*(0.5*$scope.width/8);
					$scope.l2y2 = 3*($scope.height/4);

					$scope.l3x1 = $scope.slider_x + 5*(0.5*$scope.width/8);
					$scope.l3y1 = ($scope.height/4);
					$scope.l3x2 = $scope.slider_x + 5*(0.5*$scope.width/8);
					$scope.l3y2 = 3*($scope.height/4);
			}

			// get pv value in real-time
			socket.on($scope.pv, function(message) {
				$scope.$apply(function() {
					$scope.value = message.value;
					move(($scope.value==1)? 0:1);			
				});
			});

			// on click action
			$scope.click = function() {
				socket.emit($scope.pv, pvobj($scope.pv,$scope.value==1 ? 0:1));
			}
		}
	}
});

