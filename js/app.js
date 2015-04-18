var app = angular.module('myApp', []);

app.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
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

app.factory('TemplateService', function ($http, $compile, $q, URL) {
    
    var deferred    = $q.defer(),
        templates   = null,
        loadPromise = deferred.promise;

    var loadTemplates = function () {
        $http.get(URL + 'templates.json').then(function(res){
            templates = res.data;
            deferred.resolve();
        });
    };

    var getTemplate = function (name) {
        return templates[name] || '';
    };

    return {
        load: function(){
            loadTemplates();

            return this;
        },

        compile:function(params){
            var _compile = function(){
                params.element.html( getTemplate(params.templateName) );

                $compile( params.element.contents() )(params.scope);
            }

            if(null !== templates){
                _compile();
            }
            else{
                loadPromise.then(_compile);
            }
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

app.directive('contentItem', function (TemplateService) {
    var getTemplate = function (templates, contentType) {
        return templates[contentType] || '';
    };

    var linker = function (scope, element, attrs) {
        scope.rootDirectory = 'images/';

        TemplateService
            .load()
            .compile({
                templateName    : scope.content.content_type,
                scope           : scope,
                element         : element
            });

    };

    return {
        restrict: 'E',
        link: linker,
        scope: {
            content: '='
        }
    };
});


