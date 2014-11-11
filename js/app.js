var app = angular.module('myApp', []);

app.config(function ($sceProvider, $sceDelegateProvider) {
    $sceProvider.enabled(false);

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://vimeo.com/**']);
});

app.constant('URL', 'data/');

app.factory('DataService', function ($http, URL) {
    var getData = function () {
        return $http.get(URL + 'content.json');
    };

    return {
        getData: getData
    };
});

app.controller('ContentCtrl', function ($scope, DataService, $sce) {
    $scope.content = [];
    $scope.types = {};
    $scope.imageDirectory = 'images/';
    $scope.audioDirectory = 'audio/';

    var format = '.html';

    $scope.concat = function (directory, file) {
        return directory + file;
    };

    $scope.fetchContent = function () {
        DataService.getData().then(function (result) {
            var templateUrl = 'templates/';

            $scope.content = result.data;

            // get all content types
            $scope.content.filter(function (item) {
                $scope.types[item.content_type] = templateUrl + item.content_type + format;
            });
        });
    };

    $scope.fetchContent();
});

