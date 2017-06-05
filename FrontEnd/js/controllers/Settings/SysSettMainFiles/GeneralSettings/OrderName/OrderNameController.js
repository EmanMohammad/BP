angular.module('MetronicApp').controller('OrderNameController', function ($rootScope, $filter, $scope, iNNODB, ModalService, $log, Common) {


    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }
  
    $scope.onPageload = function () {
        $scope.displayLoad = true;
        var table = $('#tbl_OrderName').DataTable();
        $scope.OrderName = {};
        table.destroy();
        iNNODB.select('schOrderName', null, {}).then(function (response) {
            $scope.OrderName = response.data;
            $scope.displayLoad = false;
            $scope.OrderName = $filter('orderBy')($scope.OrderName, '-id');
            setTimeout(
            function () {
                $('#tbl_OrderName').DataTable({});
                $('.tooltips').tooltip();
            }, 100)

        }, function (r) {
        });
    }
    $scope.isEdit = null;


    $scope.InsertOrderName = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/OrderName/insert.html",
            controller: "OrderNameInsertController",
            inputs: {
                title: "إضافة نوع معاملة"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                var data = [result.newOrderName];
                iNNODB.insert('schOrderName', data, {}).then(function (response) {
                    $scope.onPageload();
                }, function (r) {
                    //alert(r)
                });
            });
        });
    }




    $scope.edit = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/OrderName/Edit.html",
            controller: "OrderNameEditController",
            inputs: {
                title: "تعديل اسم الطلب",
                items: { orderName: $scope.OrderName[id].orderName }

            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {

                var header = {};
                header.sFilter = { "_rowID": $scope.OrderName[id]._rowID };
                var data = [];
                $scope.OrderName[id].orderName = result.orderName
                data.push($scope.OrderName[id]);
                iNNODB.update('schOrderName', data, header).then(function (response) {
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
                header.sRowIDs = $scope.OrderName[id]._rowID;
                iNNODB.delete('schOrderName', null, header).then(function (r) {
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