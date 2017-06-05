
angular.module('MetronicApp').controller('TreatmentTypeEditController', function ($scope, $element, iNNODB, title, items, close) {


    $scope.treatmentName = items.treatmentName;
    $scope.title = title;


    $scope.close = function () {
        close({
            treatmentName: $scope.treatmentName
        }, 500);
    };


    $scope.cancel = function () {
        $element.modal('hide');
    };

})
