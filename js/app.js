var app = angular.module('myApp', []);

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

  return {
    getTemplates: getTemplates
  };
});

app.directive('contentItem', function ($compile, TemplateService) {
    var getTemplate = function(templates, contentType) {
        var template = '';

        switch(contentType) {
            case 'image':
                template = templates.imageTemplate;
                break;
            case 'video':
                template = templates.videoTemplate;
                break;
            case 'notes':
                template = templates.noteTemplate;
                break;
        }

        return template;
    }

    var linker = function(scope, element, attrs) {
        scope.rootDirectory = 'images/';

        TemplateService.getTemplates().then(function(response) {
          var templates = response.data;

          element.html(getTemplate(templates, scope.content.content_type)).show();

          $compile(element.contents())(scope);
        });

    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            content:'='
        }
    };
});

function ContentCtrl($scope, $http, DataService) {
    "use strict";

    $scope.content = [];

    $scope.fetchContent = function() {
        DataService.getData().then(function(result){
            $scope.content = result.data;
        });
    }

    $scope.fetchContent();
}

