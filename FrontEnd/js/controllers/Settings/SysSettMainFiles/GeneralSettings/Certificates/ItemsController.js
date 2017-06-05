angular.module('MetronicApp').controller('ItemsController', function ($rootScope, $filter, $scope, iNNODB, ModalService, $log, Common) {


    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID, pnlHTMLID, cHtmlID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID, pnlHTMLID, cHtmlID);
    }

    $scope.onPageload = function () {
        $scope.displayLoad = true;
        var table = $('#tbl_items').DataTable();
        $scope.Items = {};
        table.destroy();
        iNNODB.select('schItems', null, {}, "Settings.SystemSettings").then(function (response) {
            $scope.Items = response.data;
            console.log(response.data);
            $scope.displayLoad = false;
            $scope.Items = $filter('orderBy')($scope.Items, '-id');
            setTimeout(
            function () {
                $('#tbl_items').DataTable({});
            }, 100)

        }, function (r) {
        });
    }
    $scope.isEdit = null;


    $scope.insertItem = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/Items/insert.html",
            controller: "ItemsInsertController",
            inputs: {
                title: "اضافه بند "
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                iNNODB.insert('schItems', [result.newItem], {}, "Settings.SystemSettings").then(function (response) {
                    $scope.onPageload();
                }, function (r) {
                });
            });
        });
    }


    $scope.edit = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/Items/Edit.html",
            controller: "ItemsEditController",
            inputs: {
                title: "تعديل بند",
                items: {
                    itemName: $scope.Items[id].itemName
                    
                }


            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {

                var header = {};
                header.sFilter = { "_rowID": $scope.Items[id]._rowID };
                var data = [];
                $scope.Items[id].itemName = result.items.itemName
               
                data.push($scope.Items[id]);
                iNNODB.update('schItems', data, header, "Settings.SystemSettings").then(function (response) {
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
                title: "حذف بند",
                message: "هل أنت متأكد أنك تريد الحذف ؟"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function () {
                var header = {};
                header.sRowIDs = $scope.Items[id]._rowID;
                iNNODB.delete('schItems', null, header, "Settings.SystemSettings").then(function (r) {
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