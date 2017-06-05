
angular.module('MetronicApp').controller('OfficersGridController', function ($rootScope, $filter, $scope, iNNODB, $location, $timeout, $state
    , ModalService, Common, $http) {

    $scope.CheckOfficerPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }

    $scope.GetFormatedDateFrom_YYMMDDHHMMSSss = function (date) {
        return Common.GetFormatedDateFrom_YYMMDDHHMMSSss(date);
    }

    $scope.onPageload = function (header) {
        $scope.displayLoad = true;
        if (header == undefined) {
            header = {};
            header.sFilter = { "type": { "ne": "0" } }
        }
        var table = $('#tbl_Officers').DataTable();
        $scope.Officers = {};
        table.destroy();
        iNNODB.select('schOfficers', null, header, "Officers").then(function (response) {
            $scope.Officers = response.data;
            $scope.displayLoad = false;
            $scope.Officers = $filter('orderBy')($scope.Officers, '-id');
            setTimeout(
                function () {
                    $('#tbl_Officers').DataTable({});
                    $('.tooltips').tooltip();
                }, 100)

        }, function (r) {
        });
    }

    $scope.activeUser = function (idx) {
        $scope.newOfficer = $scope.Officers[idx]
        var popUpTitle = $scope.newOfficer.status == "1" ? "Deactivate " : "Activate"

        ModalService.showModal({
            templateUrl: "views/GeneralPopUp.html",
            controller: "GeneralController",
            inputs: {
                title: popUpTitle,
                message: ' Are you sure you want to ' + popUpTitle + '  this user  (' + $scope.Officers[idx].name + ') and all  his data permanently?',
                BtnName: "Agree"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function () {
                $scope.newOfficer.status = $scope.newOfficer.status == "1" ? "0" : "1";
                var header = {};
                header.sFilter = { "_rowID": $scope.newOfficer._rowID };
                var data = [];
                data.push($scope.newOfficer);
                iNNODB.update('schOfficers', data, header, "Officers").then(function (response) {
                    $scope.onPageload();
                }, function (r) {
                });
            });
        });
    }

    $scope.SendDetails = function (idx) {
        ModalService.showModal({
            templateUrl: "views/GeneralPopUp.html",
            controller: "GeneralController",
            inputs: {
                title: "Send Details",
                message: ' Are you sure you want to Send UserName and password for this user  (' + $scope.Officers[idx].name + ') to him?',
                BtnName: "Agree"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function () {
                // send sms
                iNNODB.select('schAccountSettings', null, {}, "Officers").then(function (response) {
                    $scope.AccountSettings = response.data[0];
                    var header = {};
                    header["UserName"] = $scope.AccountSettings.userName;
                    header["Password"] = $scope.AccountSettings.password;
                    header["SendAsync"] = true;
                    var messageBody = {
                        "SenderName": $scope.AccountSettings.senderName,
                        "Message": "your UserName : " + $scope.Officers[idx].userName + " Password : " + $scope.Officers[idx].password + ".",
                        "Mobiles": $scope.Officers[idx].mobile
                    };
                    var lstMessage = [];
                    lstMessage.push(messageBody);
                    $http({
                        method: "POST",
                        url: "http://api.dreamsms.net/sms",
                        data: lstMessage,
                        headers: header
                    }).then(function (responseData) {
                        if (responseData.data.success == "true") {
                            ModalService.showModal({
                                templateUrl: "views/msg.html",
                                controller: "msgController",
                                inputs: {
                                    title: "عملية الارسال",
                                    message: "تم الارسال بنجاح"
                                }
                            }).then(function (modal) {
                                modal.element.modal();
                                modal.close.then(function (result) { });
                            });
                        }
                    }).catch(function (responseData) {
                        return responseData;
                    });
                })
            });
        });
    }

    $scope.delete = function (idx) {
        ModalService.showModal({
            templateUrl: "views/delete.html",
            controller: "DeleteController",
            inputs: {
                title: "Delete ",
                message: "Are you sure you want to delete?"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function () {
                var header = {};
                header.sRowIDs = $scope.Officers[idx]._rowID;
                iNNODB.delete('schOfficers', null, header, "Officers").then(function (r) {
                    var header = {};
                    header["sProductID"] = "prdCM";
                    header["sCompanyID"] = "cmpCM";
                    header["sCompanyLicense"] = "cm#20201";
                    var SecurityRole = {};
                    SecurityRole["AuthenticationID"] = $scope.Officers[idx].authenticationId;
                    $http({
                        method: "POST",
                        url: "http://cm.innodevelopment.org/DeleteAuthentication",
                        data: JSON.stringify(SecurityRole),
                        headers: header
                    }).then(function (responseData) {
                    }).catch(function (responseData) {
                        return responseData;
                    });
                    $scope.onPageload();
                }, function (r) {
                });
            });
        });
    }

    $scope.Officers_Search = function () {
        $scope.divSearch = "views/Officers/search.html";
        $scope.Officer = {};
    }

    $scope.Search_Cancle = function () {
        $scope.divSearch = "";
    }

    $scope.OfficersSearch = function () {
        $scope.Officers = $scope.AllOfficers
        var filter = {}
        for (var key in $scope.Officer) {
            if ($scope.Officer.hasOwnProperty(key)) {
                if ($scope.Officer[key] != null && $scope.Officer[key] != undefined && $scope.Officer[key] != "")
                    filter[key] = $scope.Officer[key];
            }
        }
        header = {};
        header.sFilter = filter;
        $scope.onPageload(header);
    }

    iNNODB.select('schDepartments', null, {}, "Officers").then(function (response) {
        $scope.DepartmentData = response.data;
    }, function (r) {
        });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

}).directive('match', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                return $parse(attrs.match)(scope) === ctrl.$modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('mismatch', currentValue);
            });
        }
    };
});


