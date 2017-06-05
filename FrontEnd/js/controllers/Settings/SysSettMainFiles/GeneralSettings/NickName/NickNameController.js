angular.module('MetronicApp').controller('NickNameController', function ($rootScope, $filter, $scope, iNNODB, ModalService, $log, Common) {


    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }

    $scope.onPageload = function () {
        $scope.displayLoad = true;
        var table = $('#Itbl_Name').DataTable();
        $scope.NickName = {};
        table.destroy();
        iNNODB.select('schNickName', null, {}).then(function (response) {
            $scope.NickName = response.data;
            $scope.displayLoad = false;
            $scope.NickName = $filter('orderBy')($scope.NickName, '-id');
            setTimeout(
            function () {
                $('#Itbl_Name').DataTable({});
                $('.tooltips').tooltip();
            }, 100)

        }, function (r) {
        });
    }
    $scope.isEdit = null;


    $scope.InsertNeckName = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/NickName/insert.html",
            controller: "NickNameInsertController",
            inputs: {
                title: "إضافة لقب"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                var data = [result.newNickName];
                iNNODB.insert('schNickName', data, {}).then(function (response) {
                    $scope.onPageload();
                }, function (r) {
                    //alert(r)
                });
            });
        });
    }




    $scope.edit = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/NickName/Edit.html",
            controller: "NickNameEditController",
            inputs: {
                title: "تعديل ",
                items: { nickName: $scope.NickName[id].nickName }

            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {

                var header = {};
                header.sFilter = { "_rowID": $scope.NickName[id]._rowID };
                var data = [];
                $scope.NickName[id].nickName = result.nickName
                data.push($scope.NickName[id]);
                iNNODB.update('schNickName', data, header).then(function (response) {
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
                header.sRowIDs = $scope.NickName[id]._rowID;
                iNNODB.delete('schNickName', null, header).then(function (r) {
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