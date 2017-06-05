
angular.module('MetronicApp').controller('OfficersEditController', function ($rootScope, $state, $stateParams, $scope, $http, iNNODB, Common, $filter, ModalService, $timeout) {

    iNNODB.select('schDepartments', null, {}, "Officers").then(function (response) {
        $scope.DepartmentData = response.data;
    }, function (r) {
    });
    iNNODB.select('schCities', null, {}, "Officers").then(function (response) {
        $scope.CitiesData = response.data;
    }, function (r) {
    });
    var header = { "sFilter": { "type": "4", "status": "1" } }
    header.CustomSchemaProjection = { "KeyProjection": ["_rowID", "userName", "name"] }
    iNNODB.select('schOfficers', null, header, "Officers").then(function (response) {
        $scope.OfficersData = response.data;
    }, function (r) {
    });

    var header = {};
    header["sProductID"] = "prdCM";
    header["sCompanyID"] = "cmpCM";
    header["sCompanyLicense"] = "cm#20201";
    $http({
        method: "GET",
        url: "http://cm.innodevelopment.org/selectAllRoles",
        data: [],
        headers: header
    }).then(function (responseData) {
        $scope.SecurityRoles = responseData.data.data;
    }).catch(function (responseData) {
        return responseData;
    });

    header = {};
    var filter = {}
    filter["_rowID"] = $stateParams.officerID;
    header.sFilter = filter;
    iNNODB.select('schOfficers', null, header, "Officers").then(function (response) {
        $scope.newOfficer = response.data[0];
        $scope.newOfficer.mobile = parseInt(response.data[0].mobile);
        $scope.newOfficer.telNo = parseInt(response.data[0].telNo);
        $scope.newOfficer.empId = parseInt(response.data[0].empId);
        $scope.departmentIdx = $scope.DepartmentData.findIndex(x => x._rowID == $scope.newOfficer.departmentId).toString();
        $scope.managerIdx = $scope.OfficersData.findIndex(x => x._rowID == $scope.newOfficer.managerId).toString();


        var lstSecurityRole = [];
        var SecurityRole = {};
        SecurityRole["AuthenticationID"] = $scope.newOfficer.authenticationId;
        lstSecurityRole.push(SecurityRole);
        var header = {};
        header["sProductID"] = "prdCM";
        header["sCompanyID"] = "cmpCM";
        header["sCompanyLicense"] = "cm#20201";
        $http({
            method: "POST",
            url: "http://cm.innodevelopment.org/PrevAuthenticationData",
            data: lstSecurityRole[0],
            headers: header
        }).then(function (responseData) {
            if (responseData.data.success == "true")
                $scope.newOfficer.security = responseData.data.data.sRoleID;
        }).catch(function (responseData) {
            return responseData;
        });

    }, function (r) {
    });


    $scope.saveOfficer = function () {
        if ($stateParams.officerID) {

            var lstSecurityRoles = [];
            var SecurityRole = {};
            SecurityRole["AuthenticationID"] = $scope.newOfficer.authenticationId;
            lstSecurityRoles.push(SecurityRole);
            var header = {};
            header["sProductID"] = "prdCM";
            header["sCompanyID"] = "cmpCM";
            header["sCompanyLicense"] = "cm#20201";
            $http({
                method: "POST",
                url: "http://cm.innodevelopment.org/PrevAuthenticationData",
                data: lstSecurityRoles[0],
                headers: header
            }).then(function (responseData) {
                if (responseData.data.success == "true") {
                    var resultArr = responseData.data.data;
                    if (resultArr != "") {
                        oldPersonRoleID = resultArr.sRoleID;
                        AuthenticationPrevUserName = resultArr.sUserName;
                        AuthenticationPrevPassword = resultArr.sPassword;
                        AuthenticationPrevRoleID = resultArr.sRoleID;
                        var SecurityRole = {};
                        SecurityRole["AuthenticationID"] = $scope.newOfficer.authenticationId;
                        SecurityRole["sBranchID"] = "";
                        SecurityRole["sOldUserName"] = AuthenticationPrevUserName;
                        SecurityRole["sUserName"] = $scope.newOfficer.userName;
                        SecurityRole["sPassword"] = $scope.newOfficer.password;
                        SecurityRole["sServiceID"] = "";
                        SecurityRole["sSchemaID"] = "";
                        SecurityRole["sVersionID"] = "";
                        SecurityRole["sRoleID"] = $scope.newOfficer.security;
                        $http({
                            method: "POST",
                            url: "http://cm.innodevelopment.org/AddAuthentication",
                            data: JSON.stringify(SecurityRole),
                            headers: header
                        }).then(function (responseData) {
                            $scope.newOfficer.authenticationId = responseData.data.data;

                            if ($scope.departmentIdx != undefined && $scope.departmentIdx != null && $scope.departmentIdx != "") {
                                $scope.newOfficer.departmentName = $scope.DepartmentData[$scope.departmentIdx].name;
                                $scope.newOfficer.departmentId = $scope.DepartmentData[$scope.departmentIdx]._rowID;
                            }
                            if ($scope.newOfficer.manager != undefined && $scope.newOfficer.manager != null && $scope.newOfficer.manager != "") {
                                $scope.newOfficer.managerName = $scope.OfficersData[$scope.manager].name;
                                $scope.newOfficer.managerId = $scope.OfficersData[$scope.manager]._rowID;
                            }

                            var _date = $filter('date')(new Date(), 'dd/MM/yyyy');
                            $scope.newOfficer.crtDate = Common.GetFormatedDateTo_YYMMDDHHMMSSss(_date);
                            $scope.newOfficer.usrCrtId = localStorage.CurrentUserID;
                            $scope.newOfficer.usrCrtName = localStorage.CurrentUsername;

                            var userArr = [];
                            userArr.push($scope.newOfficer);
                            var header = {};
                            header.sFilter = { "_rowID": $scope.newOfficer._rowID };
                            iNNODB.update('schOfficers', userArr, header, "Officers", false).then(function (response) {
                                if (response.success == "true") {
                                    ModalService.showModal({
                                        templateUrl: "views/GeneralOperationPopUp.html",
                                        controller: "GeneralOperationsController",
                                        inputs: {
                                            title: "Edit Operation",
                                            message: "The operation was performed successfully"
                                        }
                                    }).then(function (modal) {
                                        modal.element.modal();
                                        modal.close.then(function () {
                                        });
                                    });
                                    $scope.Close();
                                }
                                else {
                                    var message = JSON.parse(response.message);
                                    if (message[0]["Error Type"] == "Duplication") {
                                        ModalService.showModal({
                                            templateUrl: "views/GeneralPopUp.html",
                                            controller: "GeneralController",
                                            inputs: {
                                                title: "Error",
                                                message: message[0].AdditionalInfo,
                                                BtnName: "Agreed"
                                            }
                                        }).then(function (modal) {
                                            modal.element.modal();
                                            modal.close.then(function () {
                                            });
                                        });
                                    }
                                }
                            }, function (r) {
                            });
                        }).catch(function (responseData) {
                            return responseData;
                        });
                    }
                }
            }).catch(function (responseData) {
                return responseData;
            });
        }
    }

    $scope.Close = function () {
        $timeout(function () {
            $state.go('Officers');
        }, 1500);
    }

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

})

