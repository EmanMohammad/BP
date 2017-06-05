
angular.module('MetronicApp').controller('UnitsEditController', function ($scope, $element, iNNODB, title, items, close) {


    $scope.unitName = items.unitName;
    $scope.title = title;


    $scope.close = function () {
        close({
            unitName: $scope.unitName
        }, 500);

    };


    $scope.cancel = function () {
        $element.modal('hide');
    };

})
