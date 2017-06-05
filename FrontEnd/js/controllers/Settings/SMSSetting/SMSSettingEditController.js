
angular.module('MetronicApp').controller('SMSSettingEditController', function ($rootScope, $state, $stateParams, $scope, iNNODB) {

    iNNODB.select('schDepartments', null, {} , "Settings.SMSSettings").then(function (response) {
        $scope.departmentData = response.data;
    }, function (r) {
    });

    header = {};
    var filter = {}
    filter["id"] = $stateParams.SMSSettingID;
    iNNODB.select('schSMSSetting', null, header, "Settings.SMSSettings").then(function (response) {
        $scope.newSMSSetting = response.data[0];
        $scope.departmentIdx = $scope.departmentData.findIndex(x => x._rowID == $scope.newSMSSetting.departmentId);
        $scope.departmentDataObj = $scope.departmentData[parseInt($scope.departmentIdx)]; // Set by default the   value "carton"

    }, function (r) {
    });

    $scope.saveSMSSetting = function () {
        $scope.newSMSSetting.departmentName = $scope.departmentDataObj.name;
        $scope.newSMSSetting.departmentId = $scope.departmentDataObj._rowID;
        if ($stateParams.SMSSettingID) {
            var header = {};
            header.sFilter = { "_rowID": $scope.newSMSSetting._rowID };
            var data = [];
            data.push($scope.newSMSSetting);
            iNNODB.update('schSMSSetting', data, header, "Settings.SMSSettings").then(function (response) {
               $scope.newSMSSetting = {};
                $state.go('SMSSetting');
            }, function (r) {
            });
        }
    }


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

})
