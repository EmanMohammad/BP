
angular.module('MetronicApp').controller('msgController', function ($rootScope, $scope, $element, title, message, close, $timeout) {

    $scope.title = title;
    $scope.message = message;
    $scope.close = function () {
        $element.modal('hide');
        //close({}, 100);
        //var modals = document.getElementsByClassName('modal-backdrop fade in');
        //while (modals[0]) {
        //    modals[0].parentNode.removeChild(modals[0]);
        //}
        //close({}, 500);
    };

    $timeout(function () {
        $element.modal('hide');
        //close({}, 2);
        //$timeout(function () {
        //    var modals = document.getElementsByClassName('modal-backdrop fade in');
        //    while (modals[0]) {
        //        modals[0].parentNode.removeChild(modals[0]);
        //    }
        //}, 1000);
    }, 1500);



    //// set sidebar closed and body solid layout mode
    //$rootScope.settings.layout.pageContentWhite = true;
    //$rootScope.settings.layout.pageBodySolid = false;
    //$rootScope.settings.layout.pageSidebarClosed = false;

})

