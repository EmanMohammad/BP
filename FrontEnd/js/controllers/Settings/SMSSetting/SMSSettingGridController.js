
angular.module('MetronicApp').controller('SMSSettingGridController', function ($rootScope, $filter, $scope, iNNODB, $location, $timeout, $state
                          , ModalService, Common) {

    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }

    iNNODB.select('schSMSSetting', null, {}, "Settings.SMSSettings").then(function (response) {
        $scope.AllSMSSetting = response.data;
    }, function (r) {
    });

    $scope.smsSettings = {};
    $scope.onPageload = function (header) {
        $scope.displayLoad = true;
        if (header == undefined) {
            header = {};
        }
        var table = $('#tbl_SMSSetting').DataTable();
        $scope.SMSSetting = {};
        table.destroy();
        iNNODB.select('schSMSSetting', null, header, "Settings.SMSSettings").then(function (response) {
            $scope.SMSSetting = response.data;
            $scope.displayLoad = false;
            $scope.SMSSetting = $filter('orderBy')($scope.SMSSetting, '-id');
            setTimeout(
            function () {
                $('#tbl_SMSSetting').DataTable({});
            }, 100)

        }, function (r) {
        });
    }

    $scope.delete = function (id) {
        ModalService.showModal({
            templateUrl: "views/delete.html",
            controller: "DeleteController",
            inputs: {
                title: "Delete ",
                message: "Are you sure you want to delete? "
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function () {
                var header = {};
                header.sRowIDs = $scope.SMSSetting[id]._rowID;
                iNNODB.delete('schSMSSetting', null, header, "Settings.SMSSettings").then(function (r) {
                    console.log(r)
                    $scope.onPageload();
                }, function (r) {
                });
            });
        });
    }

    $scope.edit = function (id) {
        $scope.isEdit = true;

    }

    $scope.caseSearch = function () {
        $scope.SMSSetting = $scope.AllSMSSetting
        var filter = {}
        for (var key in $scope.smsSettings) {
            if ($scope.smsSettings.hasOwnProperty(key)) {
                if ($scope.smsSettings[key] != null && $scope.smsSettings[key] != undefined && $scope.smsSettings[key] != "")
                    filter[key] = $scope.smsSettings[key];
            }
        }
        header = {};
        header.sFilter = filter;
        $scope.onPageload(header);
    }


    $scope.Search_Cancle = function () {
        $scope.divSearch = "";
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

