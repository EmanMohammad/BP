angular.module('MetronicApp').controller('UserSecurityController', function ($rootScope, $scope, $http, iNNODB, ModalService, $log, Common) {

    $scope.displayLoad = true;
    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }

    var header = {};
    header["sProductID"] = "prdInnoCollect";
    header["sCompanyID"] = "cmpInnoCollect";
    header["sCompanyLicense"] = "InnoCollect#124578";
    $http({
        method: "GET",
        url: "/selectAllRoles",
        data: [],
        headers: header
    }).then(function (responseData) {
        $scope.displayLoad = false;
        $scope.UserSecurity = responseData.data.data;
        $scope.MainRole = "0ca3380f-9d0f-4573-90bc-5b5707f69c5e";

    }).catch(function (responseData) {
        return responseData;
    });

    $scope.isEdit = null;


    $scope.InsertUserSecurity = function (id) {
        ModalService.showModal({
            templateUrl: "views/UserSecurity/insert.html",
            controller: "UserSecurityInsertController",
            inputs: {
                title: "إضافة نظام أمنى",
                UserSecurity: $scope.UserSecurity
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result.newUserSecurity != "close") {
                    $scope.newUserSecurity = result.newUserSecurity;
                    var header = {};
                    header["sProductID"] = "prdInnoCollect";
                    header["sCompanyID"] = "cmpInnoCollect";
                    header["sCompanyLicense"] = "InnoCollect#124578";
                    $http({
                        method: "POST",
                        url: "/AddRole",
                        data: JSON.stringify($scope.newUserSecurity),
                        headers: header
                    }).then(function (responseData) {
                        $scope.UserSecurity = responseData.data.data;
                    }).catch(function (responseData) {
                        return responseData;
                    });
                }
            });
        });
    }

    $scope.edit = function (idx) {
        ModalService.showModal({
            templateUrl: "views/UserSecurity/Edit.html",
            controller: "UserSecurityEditController",
            inputs: {
                title: "تعديل نظام أمنى",
                items: {
                    newUserSecurity: $scope.UserSecurity[idx],
                    UserSecurity: $scope.UserSecurity
                }
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result.newUserSecurity != "close") {
                    $scope.newUserSecurity = result.newUserSecurity;
                    var header = {};
                    header["sProductID"] = "prdInnoCollect";
                    header["sCompanyID"] = "cmpInnoCollect";
                    header["sCompanyLicense"] = "InnoCollect#124578";
                    $http({
                        method: "POST",
                        url: "/AddRole",
                        data: JSON.stringify($scope.newUserSecurity),
                        headers: header
                    }).then(function (responseData) {
                        $scope.UserSecurity = responseData.data.data;
                        ModalService.showModal({
                            templateUrl: "views/msg.html",
                            controller: "msgController",
                            inputs: {
                                title: "عملية الاضافة",
                                message: "تم تنفيذ العملية بنجاح"
                            }
                        }).then(function (modal) {
                            modal.element.modal();
                            modal.close.then(function (result) { });
                        });
                    }).catch(function (responseData) {
                        return responseData;
                    });
                }
            });

        });
    }


    $scope.delete = function (idx) {
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
                header["sProductID"] = "prdInnoCollect";
                header["sCompanyID"] = "cmpInnoCollect";
                header["sCompanyLicense"] = "InnoCollect#124578";
                $http({
                    method: "POST",
                    url: "/DeleteRole",
                    data: JSON.stringify($scope.UserSecurity[idx]),
                    headers: header
                }).then(function (responseData) {
                    ///$scope.UserSecurity = responseData.data.data;
                    ModalService.showModal({
                        templateUrl: "views/msg.html",
                        controller: "msgController",
                        inputs: {
                            title: "عملية التعديل",
                            message: "تم تنفيذ العملية بنجاح"
                        }
                    }).then(function (modal) {
                        modal.element.modal();
                        modal.close.then(function (result) { });
                    });
                }).catch(function (responseData) {
                    return responseData;
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