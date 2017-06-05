
angular.module('MetronicApp').controller('EmployeesInsertController', function ($rootScope, $state, $scope, $http, iNNODB, Common, $filter, $timeout, ModalService) {

    iNNODB.select('schDepartments', null, {}, "Employees").then(function (response) {
        $scope.DepartmentData = response.data;
    }, function (r) {
    });
    iNNODB.select('schCities', null, {}, "Employees").then(function (response) {
        $scope.CitiesData = response.data;
    }, function (r) {
    });
    header.CustomSchemaProjection = { "KeyProjection": ["_rowID", "userName", "name"] }
    iNNODB.select('schEmployees', null, header, "Employees").then(function (response) {
        $scope.EmployeesData = response.data;
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

    $scope.saveOfficer = function () {
        var header = {};
        header["sProductID"] = "prdCM";
        header["sCompanyID"] = "cmpCM";
        header["sCompanyLicense"] = "cm#20201";
        var SecurityRole = {};
        SecurityRole["AuthenticationID"] = "";
        SecurityRole["sBranchID"] = "";
        SecurityRole["sOldUserName"] = "";
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
            $scope.newOfficer.Archive = "0";
            $scope.newOfficer.status = "0";

            if ($scope.departmentIdx != undefined && $scope.departmentIdx != null && $scope.departmentIdx != "") {
                $scope.newOfficer.departmentName = $scope.DepartmentData[$scope.departmentIdx].name;
                $scope.newOfficer.departmentId = $scope.DepartmentData[$scope.departmentIdx]._rowID;
            }
            if ($scope.managerIdx != undefined && $scope.managerIdx != null && $scope.managerIdx != "") {
                $scope.newOfficer.managerName = $scope.EmployeesData[$scope.managerIdx].name;
                $scope.newOfficer.managerId = $scope.EmployeesData[$scope.managerIdx]._rowID;
            }

            var _date = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.newOfficer.crtDate = Common.GetFormatedDateTo_YYMMDDHHMMSSss(_date);
            $scope.newOfficer.usrCrtId = localStorage.CurrentUserID;
            $scope.newOfficer.usrCrtName = localStorage.CurrentUsername;

            var officerArr = [];
            officerArr.push($scope.newOfficer);
            iNNODB.insert('schEmployees', officerArr, {}, "Employees", false).then(function (response) {
                if (response.success == "true") {
                    ModalService.showModal({
                        templateUrl: "views/GeneralOperationPopUp.html",
                        controller: "GeneralOperationsController",
                        inputs: {
                            title: "Add Operation",
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
                                //var header = {};
                                //header["sProductID"] = "prdCM";
                                //header["sCompanyID"] = "cmpCM";
                                //header["sCompanyLicense"] = "cm#20201";
                                //var SecurityRole = {};
                                //SecurityRole["AuthenticationID"] = $scope.newOfficer.authenticationId;
                                //$http({
                                //    method: "POST",
                                //    url: "http://cm.innodevelopment.org/DeleteAuthentication",
                                //    data: JSON.stringify(SecurityRole),
                                //    headers: header
                                //}).then(function (responseData) {
                                //}).catch(function (responseData) {
                                //    return responseData;
                                //});
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

    $scope.Close = function () {
        $timeout(function () {
            $state.go('Employees');
        }, 1500);
    }

    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});

