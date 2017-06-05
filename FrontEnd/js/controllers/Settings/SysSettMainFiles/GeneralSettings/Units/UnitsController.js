angular.module('MetronicApp').controller('UnitsController', function ($rootScope, $filter, $scope, iNNODB, ModalService, $log, Common) {


    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }

    $scope.onPageload = function () {
        $scope.displayLoad = true;
        var table = $('#tbl_Units').DataTable();
        $scope.Units = {};
        table.destroy();
        iNNODB.select('schUnits', null, {}).then(function (response) {
            $scope.Units = response.data;
            $scope.displayLoad = false;
            $scope.Units = $filter('orderBy')($scope.Units, '-id');
            setTimeout(
            function () {
                $('#tbl_Units').DataTable({});
                $('.tooltips').tooltip();
            }, 100)

        }, function (r) {
        });
    }
    $scope.isEdit = null;


    $scope.InsertUnit = function () {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/Units/insert.html",
            controller: "UnitsInsertController",
            inputs: {
                title: "إضافة وحده"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                var data = [result.newUnit];
                iNNODB.insert('schUnits', data, {}).then(function (response) {
                    $scope.onPageload();
                }, function (r) {
                    //alert(r)
                });
            });
        });
    }

    $scope.edit = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/Units/Edit.html",
            controller: "UnitsEditController",
            inputs: {
                title: "تعديل ",
                items: { unitName: $scope.Units[id].unitName }

            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {

                var header = {};
                header.sFilter = { "_rowID": $scope.Units[id]._rowID };
                var data = [];
                $scope.Units[id].unitName = result.unitName
                data.push($scope.Units[id]);
                iNNODB.update('schUnits', data, header).then(function (response) {
                    $scope.onPageload();
                }, function (r) {
                });

            });
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
                header.sRowIDs = $scope.Units[id]._rowID;
                iNNODB.delete('schUnits', null, header).then(function (r) {
                    $scope.onPageload();
                }, function (r) {
                });
            });
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

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

});