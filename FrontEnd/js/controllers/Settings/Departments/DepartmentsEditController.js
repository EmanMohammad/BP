
angular.module('MetronicApp').controller('DepartmentsEditController', function ($rootScope, $state, $stateParams, $scope, iNNODB, ModalService, $timeout) {

        iNNODB.select('schEmployees', null, {}).then(function (response) {
            $scope.EmployeesData = response.data;
        }, function (r) {
        });
    

   setTimeout(function () {
    header = {};
    var filter = {}
    filter["id"] = $stateParams.DepartmentsID;
    header.sFilter = filter;
    iNNODB.select('schDepartments', null, header).then(function (response) {
        $scope.newDepartments = response.data[0];

        $scope.EmployeesIdx = parseInt(getObjectIndex($scope.EmployeesData, "_rowID", $scope.newDepartments.headDeptIdId));
        $scope.EmployeesDataObj = $scope.EmployeesData[parseInt($scope.EmployeesIdx)]; // Set by default the   value "carton"

    }, function (r) {
    });
   }, 300)

    $scope.saveDepartments = function () {

        $scope.newDepartments.headDeptIdName = $scope.EmployeesDataObj.Name;
        $scope.newDepartments.headDeptIdId = $scope.EmployeesDataObj._rowID;

        if ($stateParams.DepartmentsID) {
            var header = {};
            header.sFilter = { "_rowID": $scope.newDepartments._rowID };
            var data = [];
            data.push($scope.newDepartments);
            iNNODB.update('schDepartments', data, header).then(function (response) {
                $state.go('Departments');
            }, function (r) {
            });
        }
    }
    $scope.Close = function () {
        $timeout(function () {
            $scope.newDepartments = {};
            $state.go('Departments');
        }, 1500);
    }
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

})
