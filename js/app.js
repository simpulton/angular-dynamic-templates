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

app.factory('DataService', function($http, URL) {
  var getData = function() {
    return $http.get(URL + 'content.json');
  };

  return {
    getData: getData
  };
});

app.factory('TemplateService', function($http, URL) {
  var getTemplates = function() {
    return $http.get(URL + 'templates.json');
  };

  var getTemplate = function(content) {
    return $http.get('templates/' + content + '.html');
  };

  return {
    getTemplates: getTemplates,
    getTemplate: getTemplate
  };
});

app.directive('contentItem', function ($compile, TemplateService) {
    var linker = function(scope, element, attrs) {
        scope.rootDirectory = 'images/';

        TemplateService.getTemplate(scope.content.content_type).then(function(response) {
            element.html(response.data).show();
            $compile(element.contents())(scope);
        });
    };

    return {
        restrict: "E",
        link: linker,
        scope: {
            content:'='
        }
    };
});

app.controller('ContentCtrl', function($scope, $http, DataService) {
    "use strict";

    $scope.content = [];

    $scope.fetchContent = function() {
        DataService.getData().then(function(result){
            $scope.content = result.data;
        });
    }

    $scope.fetchContent();
});

