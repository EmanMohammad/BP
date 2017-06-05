angular.module('MetronicApp').controller('AccountSettingsInsertController', function ($rootScope, $state, $scope, $http, iNNODB, ModalService) {

    iNNODB.select('schAccountSettings', null, {}, "Settings.AccountSettings").then(function (response) {
        $scope.newAccountSettings = response.data[0];
        $scope.getAccountBalance();
    }, function (r) {
    });

    $scope.getAccountBalance = function () {
        var header = {};
        header["UserName"] = $scope.newAccountSettings.userName;
        header["Password"] = $scope.newAccountSettings.password;
        $http({
            method: "GET",
            url: "http://api.dreamsms.net/sms",
            data: [],
            headers: header
        }).then(function (responseData) {
            $scope.newAccountSettings.balance = responseData.data.data;
        }).catch(function (responseData) {
            return responseData;
        });
    }

   
    $scope.saveAccountSettings = function () {
        if ($scope.newAccountSettings._rowID != undefined) //Update
        {
            var header = {};

            var data = [];
            header.sFilter = { "_rowID": $scope.newAccountSettings._rowID };
            data.push($scope.newAccountSettings);
            iNNODB.update('schAccountSettings', data, header, "Settings.AccountSettings").then(function (response) {
              
            }, function (r) {
            });
        }
        else { //Insert

            var data = [];
            data.push($scope.newAccountSettings);
            iNNODB.insert('schAccountSettings', data, {}, "Settings.AccountSettings").then(function (response) {
               
            }, function (r) {
            });
        }
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