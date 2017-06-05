angular.module('MetronicApp').controller('DepartmentsInsertController', function ($rootScope, $state, $scope, iNNODB, ModalService, $timeout) {


    iNNODB.select('schEmployees', null, {}).then(function (response) {
        $scope.EmployeesData = response.data;
    }, function (r) {
    });

    $scope.saveDepartments = function () {
        $scope.newDepartments = {};
        $scope.newDepartments.headDeptIdName = $scope.EmployeesData[$scope.EmployeesIdx].Name;
        $scope.newDepartments.headDeptId = $scope.EmployeesData[$scope.EmployeesIdx]._rowID;


        var data = [];
        data.push($scope.newDepartments);
        iNNODB.insert('schDepartments', data, {}).then(function (response) {
            $state.go('Departments');
        }, function (r) {
        });
    }
    $scope.Close = function () {
        $timeout(function () {
            $state.go('Departments');
        }, 1500);
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