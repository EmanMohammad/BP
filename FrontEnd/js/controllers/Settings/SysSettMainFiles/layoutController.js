
angular.module('MetronicApp').controller('layoutController', TabsController, function ($rootScope, $scope, Common) {

    $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
        return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
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

function TabsController($scope, $window, $stateParams, $timeout) {
    $scope.tabs = [{
        title: 'نوع العقد',
        url: 'views/Settings/SysSettMainFiles/GeneralSettings/ContractType/grid.html'
    }, {
        title: 'نوع المعاملة',
        url: 'views/Settings/SysSettMainFiles/GeneralSettings/TreatmentType/grid.html'
    }, {
        title: 'اسم الطلب',
        url: 'views/Settings/SysSettMainFiles/GeneralSettings/OrderName/grid.html'
    }, {
        title: 'الألقاب',
        url: 'views/Settings/SysSettMainFiles/GeneralSettings/NickName/grid.html'
    }, {
        title: 'الشهادات',
        url: 'views/Settings/SysSettMainFiles/GeneralSettings/Certificates/grid.html'
    }, {
        title: 'الوحدات',
        url: 'views/Settings/SysSettMainFiles/GeneralSettings/Units/grid.html'
    }, {
        title: 'البنود',
        url: 'views/Settings/SysSettMainFiles/GeneralSettings/Items/grid.html'
    }
    ];
}
