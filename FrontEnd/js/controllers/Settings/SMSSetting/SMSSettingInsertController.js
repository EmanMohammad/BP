
angular.module('MetronicApp').controller('SMSSettingInsertController', function ($rootScope, $state, $scope, iNNODB) {

    iNNODB.select('schDepartments', null, {}, "Settings.SMSSettings").then(function (response) {
        $scope.departmentData = response.data;
    }, function (r) {
    });

    $scope.saveSMSSetting = function () {
        $scope.newSMSSetting.departmentName = $scope.departmentData[$scope.departmentIdx].name;
        $scope.newSMSSetting.departmentId = $scope.departmentData[$scope.departmentIdx]._rowID;
        var SMSSettingArr = [];
        SMSSettingArr.push($scope.newSMSSetting);
        iNNODB.insert('schSMSSetting', SMSSettingArr, {}, "Settings.SMSSettings").then(function (response) {
            $state.go('SMSSetting');
        }, function (r) {
        });
    }

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});