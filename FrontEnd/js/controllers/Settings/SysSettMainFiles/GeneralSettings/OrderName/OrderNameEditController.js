
angular.module('MetronicApp').controller('OrderNameEditController', function ($scope, $element, iNNODB, title, items, close) {


    $scope.orderName = items.orderName;
    $scope.title = title;


    $scope.close = function () {
        close({
            orderName: $scope.orderName
        }, 500);
    };


    $scope.cancel = function () {
        $element.modal('hide');
    };

})
