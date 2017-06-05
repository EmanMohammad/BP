
angular.module('MetronicApp').controller('DepartmentsGridController', function ($rootScope, $filter, $scope, iNNODB, $location, $timeout, $state
                  , ModalService, Common) {

    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }

    $scope.onPageload = function () {
        $scope.displayLoad = true;
        var table = $('#tbl_Departments').DataTable();
        $scope.Departments = {};
        table.destroy();
        iNNODB.select('schDepartments', null, {}).then(function (response) {
            $scope.Departments = response.data;
            $scope.displayLoad = false;
            $scope.Departments = $filter('orderBy')($scope.Departments, '-id');
            setTimeout(
              function () {
                  $('#tbl_Departments').DataTable({});
              }, 100)

        }, function (r) {
        });
    }

    $scope.delete = function (id) {
        ModalService.showModal({
            templateUrl: "views/delete.html",
            controller: "DeleteController",
            inputs: {
                title: "حذف ",
                message: "هل أنت متأكد أنك تريد الحذف "
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function () {
                var header = {};
                header.sRowIDs = $scope.Departments[id]._rowID;
                iNNODB.delete('schDepartments', null, header).then(function (r) {
                    $scope.onPageload();
                }, function (r) {
                });
            });
        });
    }

    $scope.edit = function (id) {
        $scope.isEdit = true;
    }


    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

});

