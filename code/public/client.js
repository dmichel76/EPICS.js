// socket
var socket = io()
socket.on('connect',function(){
	console.log('connected');
});


// bindings to html
var app = angular.module("epicsjs", ['epicsjs.led']);

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

// custom directives
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