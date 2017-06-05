angular.module('MetronicApp').controller('loginController', function ($rootScope, $scope, $state, iNNODB, $http, $location, Common) {
    //  $scope.template = "view1.htm";
    var schemaName = "LoginUser";
    $scope.IsValid = false;
    $scope.LoginFormDisplay = true;
    //   $scope.RegisterFrom = true;

    $scope.LoginEvent = function () {

        if (($scope.LoginForm.$invalid)) {
            $scope.errorMsg = "من فضلك ادخل اسم المستخدم و كلمة المرور  "
            $scope.IsValid = true;
        }
        else {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();

            var hType;
            if (h >= 12) {
                hType = "م";
            } else {
                hType = "ص";
            }
            if (h > 12) {
                h = h - 12;
            }
            // add a zero in front of numbers<10

            if (m.length == 1) { m = "0" + m; }
            if (s.length == 1) { s = "0" + s; }

            var year = today.getYear();
            if (year < 1000)
                year += 1900;
            var day = today.getDay();
            var month = today.getMonth();
            var daym = today.getDate();
            if (daym < 10) {
                daym = "0" + daym;
            }
            var dayarray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
            var montharray = new Array("/01/", "/02/", "/03/", "/04/", "/05/", "/06/", "/07/", "/08/", "/09/", "/10/", "/11/", "/12/");
            var lastLogDte = daym + montharray[month] + year + ",&nbsp;" + h + ":" + m + " " + hType;
            header = {};
            header["sCompanyID"] = "cmpInnoCollect";
            header["sCompanyLicense"] = "InnoCollect#124578";
            header["sProductID"] = "prdInnoCollect";
            header["sRequesterUserName"] = $scope.Login.userName;
            header["sRequesterPassword"] = $scope.Login.password;
            header["sCurrentDate"] = encodeURIComponent(lastLogDte);
            var cdt = new Date();
            var currentDateUTC = Common.GetFormatedDateTo_YYMMDDHHMMSSss(cdt.getUTCDate() + "/" + (cdt.getUTCMonth() + 1) + '/' + cdt.getUTCFullYear(), cdt.getUTCHours() + ":" + cdt.getUTCMinutes() + ":" + cdt.getUTCSeconds());
            header["sCurrentDateUTC"] = currentDateUTC
            $http({
                method: "GET",
                url: "http://innocollect.innodevelopment.org/InnoDBLogin",
                data: [],
                headers: header
            }).then(function (responseData) {
                var SecurityResult = responseData.data.data;
                if (SecurityResult != "") {
                    sessionStorage.Login_RoleID = SecurityResult.Authentication.sRoleID;
                    sessionStorage.Login_RoleName = SecurityResult.Authentication.sRoleArName;
                    localStorage.Security_LoggedRolePrivList = JSON.stringify(SecurityResult.Role);

                    if (SecurityResult.sLastLoginDate != null && SecurityResult.sLastLoginDate != undefined) {
                        var date = SecurityResult.sLastLoginDate;
                        sessionStorage.LastLoginDate = date[0];
                        sessionStorage.LastLoginDatetime = date[1].split(";")[1];
                    }

                    //Get All Account where Parent Id  Current Account
                    var header = {};
                    var filter = {};
                    var username = {};
                    username["eIC"] = $scope.Login.userName;
                    filter["userName"] = username;
                    filter["status"] = "1";
                    filter["password"] = $scope.Login.password;
                    filter["Archive"] = "0";
                    header["sFilter"] = filter;

                    iNNODB.select('schEmployees', null, header, "0", "prdInnoCollectAdmin", "Admn1596").then(function (response) {
                        $scope.LoginEmp = response.data;
                        if ($scope.LoginEmp != undefined && $scope.LoginEmp != null && $scope.LoginEmp.length > 0) {
                            localStorage.LoginUserData = JSON.stringify($scope.LoginEmp);
                            localStorage.CurrentUserID = $scope.LoginEmp[0]._rowID;
                            localStorage.CurrentUsername = $scope.LoginEmp[0].userName;
                            localStorage.CurrentUserPassword = $scope.LoginEmp[0].password;
                            $scope.$emit('LoginDone');
                            angular.element($("#HeaderController")).scope().LoginDone();
                            $state.go("dashboard");
                            //$location.path('#/dashboard.html');
                        }
                        else {
                            $scope.errorMsg = "اسم المستخدم او كلمه المرور غير صحيحه "
                            $scope.IsValid = true;
                        }
                    }, function (r) {
                    });
                    ////End DB Check
                }
            }).catch(function (responseData) {
                if(responseData.status==401)
                {
                    $scope.errorMsg = "اسم المستخدم او كلمه المرور غير صحيحه "
                    $scope.IsValid = true;
                }
            });



        }


    }
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    }
    );

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = false;
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
});