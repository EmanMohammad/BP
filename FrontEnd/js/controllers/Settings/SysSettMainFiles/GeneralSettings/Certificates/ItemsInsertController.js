
angular.module('MetronicApp').controller('ItemsInsertController', function ($rootScope, $scope, $element, iNNODB, title, close) {

    $scope.title = title;

    $scope.close = function () {
        close({
            newItem: $scope.newItem
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
