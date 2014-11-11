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

app.factory('TemplateService', function ($http, URL) {
    var getTemplate = function (content) {
        return $http.get('templates/' + content + '.html');
    };

    return {
        getTemplate: getTemplate
    };
});

app.directive('contentItem', function ($compile, TemplateService) {
    var linker = function (scope, element, attrs) {
        scope.rootDirectory = 'images/';

        TemplateService.getTemplate(scope.content.content_type).then(function (response) {
            element.html(response.data);
            $compile(element.contents())(scope);
        });
    };

    return {
        restrict: "E",
        link: linker,
        scope: {
            content: '='
        }
    };
});

app.controller('ContentCtrl', function (DataService) {
    var ctrl = this;
    ctrl.content = [];

    ctrl.fetchContent = function () {
        DataService.getData().then(function (result) {
            ctrl.content = result.data;
        });
    };

    ctrl.fetchContent();
});

