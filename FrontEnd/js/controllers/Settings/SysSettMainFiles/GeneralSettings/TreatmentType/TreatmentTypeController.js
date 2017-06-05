angular.module('MetronicApp').controller('TreatmentTypeController', function ($rootScope, $filter, $scope, iNNODB, ModalService, $log, Common) {


    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }
  
    $scope.onPageload = function () {
        $scope.displayLoad = true;
        var table = $('#tbl_Treatments').DataTable();
        $scope.TreatmentType = {};
        table.destroy();
        iNNODB.select('schTreatments', null, {}).then(function (response) {
            $scope.TreatmentType = response.data;
            $scope.displayLoad = false;
            $scope.TreatmentType = $filter('orderBy')($scope.TreatmentType, '-id');
            setTimeout(
            function () {
                $('#tbl_Treatments').DataTable({});
                $('.tooltips').tooltip();
            }, 100)

        }, function (r) {
        });
    }
    $scope.isEdit = null;


    $scope.InsertTreatmentType = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/TreatmentType/insert.html",
            controller: "TreatmentTypeInsertController",
            inputs: {
                title: "إضافة نوع معاملة"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                var data = [result.newTreatmentType];
                iNNODB.insert('schTreatments', data, {}).then(function (response) {
                    $scope.onPageload();
                }, function (r) {
                    //alert(r)
                });
            });
        });
    }




    $scope.edit = function (id) {
        ModalService.showModal({
            templateUrl: "views/Settings/SysSettMainFiles/GeneralSettings/TreatmentType/Edit.html",
            controller: "TreatmentTypeEditController",
            inputs: {
                title: "تعديل نوع معاملة",
                items: { treatmentName: $scope.TreatmentType[id].treatmentName }

            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {

                var header = {};
                header.sFilter = { "_rowID": $scope.TreatmentType[id]._rowID };
                var data = [];
                $scope.TreatmentType[id].treatmentName = result.treatmentName
                data.push($scope.TreatmentType[id]);
                iNNODB.update('schTreatments', data, header).then(function (response) {
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
                header.sRowIDs = $scope.TreatmentType[id]._rowID;
                iNNODB.delete('schTreatments', null, header).then(function (r) {
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