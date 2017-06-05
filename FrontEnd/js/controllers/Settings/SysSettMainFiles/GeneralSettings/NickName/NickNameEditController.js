
angular.module('MetronicApp').controller('NickNameEditController', function ($scope, $element, iNNODB, title, items, close) {


    $scope.nickName = items.nickName;
    $scope.title = title;


    $scope.close = function () {
        close({
            nickName: $scope.nickName
        }, 500);

    };


    $scope.cancel = function () {
        $element.modal('hide');
    };

})
