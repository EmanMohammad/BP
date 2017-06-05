angular.module('MetronicApp').controller('ContractTypeController', function ($rootScope, $filter, $scope, iNNODB, ModalService, $log, Common) {


    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }

    $scope.onPageload = function () {
        $scope.displayLoad = true;
        var table = $('#tbl_ContractType').DataTable();
        $scope.ContractName = {};
        table.destroy();
        iNNODB.select('schContractType', null, {}).then(function (response) {
            $scope.ContractName = response.data;
            $scope.displayLoad = false;
            $scope.ContractName = $filter('orderBy')($scope.ContractName, '-id');
            setTimeout(
            function () {
                $('#tbl_ContractType').DataTable({});
            }, 100)

        }, function (r) {
        });
    }
    $scope.isEdit = null;


    $scope.InsertContractType = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/ContractType/insert.html",
            controller: "ContractTypeInsertController",
            inputs: {
                title: "إضافة نوع عقد"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                var ContractNameArr = [];
                ContractNameArr.push(result.newContractName);
                iNNODB.insert('schContractType', ContractNameArr, {}).then(function (response) {
                    $scope.onPageload();
                }, function (r) {
                });
            });
        });
    }


    $scope.edit = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/ContractType/Edit.html",
            controller: "ContractTypeEditController",
            inputs: {
                title: "تعديل نوع عقد",
                items: { contractName: $scope.ContractName[id].contractName }

            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {

                var header = {};
                header.sFilter = { "_rowID": $scope.ContractName[id]._rowID };
                var data = [];
                $scope.ContractName[id].contractName = result.contractName
                data.push($scope.ContractName[id]);
                iNNODB.update('schContractType', data, header).then(function (response) {
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
                header.sRowIDs = $scope.ContractName[id]._rowID;
                iNNODB.delete('schContractType', null, header).then(function (r) {
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