
angular.module('MetronicApp').controller('ContractTypeEditController', function ($scope, $element, iNNODB, title, items, close) {

    $scope.ContractName = items.contractName;
    $scope.title = title;


    $scope.close = function () {
        close({
            contractName: $scope.ContractName
        }, 500);

    };


    $scope.cancel = function () {
        $element.modal('hide');
    };

})
