
angular.module('MetronicApp').controller('DeleteController', function ($rootScope, $scope, $element, title, message, close) {

    $scope.title = title;
    $scope.message = message;
    $scope.close = function () {
        close({
        }, 500);
    };

    $scope.cancel = function () {
        $element.modal('hide');
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

})
angular.module('MetronicApp').controller('GeneralController', function ($rootScope, $scope, $element, title, message, close, BtnName) {

    $scope.title = title;
    $scope.message = message;
    $scope.BtnName = BtnName;
    $scope.close = function () {
        close({
        }, 500);
    }; 0

    $scope.cancel = function () {
        $element.modal('hide');
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

})
angular.module('MetronicApp').controller('GeneralOperationsController', function ($rootScope, $scope, $timeout, $element, title, message, close) {

    $scope.title = title;
    $scope.message = message;

    $timeout(function () { $element.modal('hide'); }, 1000);


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

})

