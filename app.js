var app = angular.module('app', ['naif.base64']);
app.controller('fileController', function ($scope, $http) {

	$http({
		  method: 'GET',
		  url: 'http://localhost:8080/ams/articles'
		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
		    console.log('from successCallback');
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log('from errorCallback');
		  });

    console.log('init controlller done');
    $scope.changeFile = function () {
        console.log($scope, $scope.myFile);
    };
    $scope.save = function () {
        console.log($scope.myFile);
		var postVars = {fileName:$scope.myFile.filename,image:$scope.myFile.base64};
		console.log(JSON.stringify(postVars));
        $http({
		  method: 'POST',
		  url: 'http://localhost:8080/ams/upload',
		  data : postVars
		}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
		    console.log('from successCallback');
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log('from errorCallback');
		  });
    }
});