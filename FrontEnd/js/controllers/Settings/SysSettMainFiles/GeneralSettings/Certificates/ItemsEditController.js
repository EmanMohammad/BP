
angular.module('MetronicApp').controller('ItemsEditController', function ($scope, $element, iNNODB, title, items, close) {


    $scope.newItem = {};
    $scope.newItem.itemName = items.itemName;
   
    $scope.title = title;


    $scope.close = function () {
        close({
           items: $scope.newItem
        }, 500);

    };


    $scope.cancel = function () {
        $element.modal('hide');
    };

})
