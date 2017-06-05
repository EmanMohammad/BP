angular.module('MetronicApp').controller('DashboardController', function ($rootScope, $scope, $http, $timeout, $filter, $ocLazyLoad, iNNODB, Common) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });
    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
    }

    $scope.GetFormatedDateFrom_YYMMDDHHMMSSss = function (date) {
        return Common.GetFormatedDateFrom_YYMMDDHHMMSSss(date);
    }


    // Upper
    //================================================================================== 
    iNNODB.select('schStatistics', null, {}, "Dashboard").then(function (response) {
        if (response.success == "true") {
            var statistics = response.data[0];
            $scope.custNumbers = statistics.customerNo;
            $scope.pocketNumbers = statistics.PocketsNo;
            $scope.totalCollection = statistics.totalAmount;
        }
    })

    iNNODB.select('schCompanies', null, {}, "Dashboard").then(function (response) {
        var Companies = response.data;
        if (Companies.length > 0 || Companies != undefined) {
            $scope.Pockets = [];
            Companies.forEach(function (comp) {
                if (comp.Pockets != undefined) {
                    comp.Pockets.forEach(function (v) {
                        $scope.Pockets.push(v);
                    });
                }
            });
            $scope.PocketNames = [];
            $scope.PocketDept = [];
            $scope.pocketRemain = [];
            for (var l = 0; l < $scope.Pockets.length; l++) {
                $scope.PocketNames.push($scope.Pockets[l].pocketName);
                $scope.PocketDept.push($scope.Pockets[l].totalDeptAmount);
                $scope.pocketRemain.push(parseFloat($scope.Pockets[l].totalDeptAmount) - parseFloat($scope.Pockets[l].remainDept));
            }
        }
    }, function (r) {
    });

    //=====================================================================================================
    // News
    iNNODB.select("schControlPanels", null, {}, "Dashboard").then(function (response) {
        if (response.success == "true") {
            $scope.ControlPanels = response.data;
            $scope.ControlPanels = $filter('orderBy')($scope.ControlPanels, '-id');

        }
    });
      
    //$scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    //$scope.series = ['Series A', 'Series B'];

    //$scope.data = [
    //  [65, 59, 80, 81, 56, 55, 40],
    //  [28, 48, 40, 19, 86, 27, 90]
    //];
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});