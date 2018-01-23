var app = angular.module('app', ['naif.base64', 'ngImgCrop']);
app.controller('fileController', function ($scope, $http, $window, $timeout) {

    $scope.myImage = '';
    $scope.myCroppedImage = '';

    var handleFileSelect = function (evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                $scope.myImage = evt.target.result;
                console.log('myCroppedImage', $scope.myCroppedImage);
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);


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
        var postVars = {fileName: $scope.myFile.filename, image: $scope.myFile.base64};
        console.log(JSON.stringify(postVars));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/ams/upload',
            data: postVars
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log('from successCallback');
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('from errorCallback');
        });
    };


    /**
     *  export table content to a file
     */
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) {
            return $window.btoa(unescape(encodeURIComponent(s)));
        },
        format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        },
        tableToExcel = function (tableId, worksheetName) {
            var table = angular.element(document.querySelector(tableId)),
                ctx = {worksheet: worksheetName, table: table.html()},
                href = uri + base64(format(template, ctx));
            return href;
        };

    $scope.exportToExcel = function (id) {
        $scope.exportHref = tableToExcel(id, 'sheet name');
        $timeout(function () {
            location.href = $scope.exportHref;
        }, 100); // trigger download
    };

    function test(event) {
        handleFile(event.currentTarget.files[0]);
    }
    $scope.import = function () {
        
    };
    angular.element(document.querySelector('#fileInput1')).on('change', test);

    function handleFile(file) {

        if (file) {

            var reader = new FileReader();

            reader.onload = function (e) {

                var data = e.target.result;

                var workbook = XLSX.read(data, { type: 'binary' });

                var first_sheet_name = workbook.SheetNames[0];

                var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]);

                //console.log(excelData);

                if (dataObjects.length > 0) {


                    console.log(dataObjects);


                } else {
                    $scope.msg = "Error : Something Wrong !";
                }

            };

            reader.onerror = function (ex) {

            };

            reader.readAsBinaryString(file);
        }
    }


});