/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    'angularModalService',
    'ImportExcelService',
    'ngIdle'
]);

MetronicApp.factory('Common', function () {
    return {
        Security_checkPrivilege: function (moduleHTMLID, pageCategoryHTMLID, pHTMLID, pnlHTMLID, cHtmlID) {
            var Security_LoggedRolePrivList = [];
            var result = false;
            var checkStr = "";
            if (moduleHTMLID != undefined)
                checkStr += moduleHTMLID;
            if (pageCategoryHTMLID != undefined)
                checkStr += "." + pageCategoryHTMLID;
            if (pHTMLID != undefined)
                checkStr += "." + pHTMLID;
            if (pnlHTMLID != undefined)
                checkStr += "." + pnlHTMLID;
            if (cHtmlID != undefined)
                checkStr += "." + cHtmlID;
            if (Security_LoggedRolePrivList == undefined || Security_LoggedRolePrivList.length == 0) {
                if (localStorage.Security_LoggedRolePrivList != undefined)
                    Security_LoggedRolePrivList = JSON.parse(localStorage.Security_LoggedRolePrivList);
                else
                    Security_LoggedRolePrivList = [];
            }
            if ($.inArray(checkStr, Security_LoggedRolePrivList) > -1) {
                result = true;
            }
            return result;
        },
        GetFormatedDateTo_YYMMDDHHMMSSss: function (dateStr, timeStr) {
            if (dateStr == "" || dateStr == undefined) {
                return "";
            }
            var dateStrAr = dateStr.split('/');
            year = "" + dateStrAr[2];
            month = "" + (dateStrAr[1]); if (month.length == 1) { month = "0" + month; }
            day = "" + dateStrAr[0]; if (day.length == 1) { day = "0" + day; }
            if (timeStr == undefined) {
                hour = "00";
                minute = "00";
                second = "00";
            }
            else {
                var timeStrArr = timeStr.split(':');
                hour = timeStrArr[0]; if (hour.length == 1) { hour = "0" + hour; }
                minute = timeStrArr[1]; if (minute.length == 1) { minute = "0" + minute; }
                second = timeStrArr[2]; if (second.length == 1) { second = "0" + second; }
            }
            milli = "000";
            return year + month + day + hour + minute + second + milli;
        },
        GetFormatedDateFrom_YYMMDDHHMMSSss: function (date, time) {
            if (date == "" || date == undefined || isNaN(parseInt(date))) {
                return "";
            }
            if (time != undefined) {
                return date.substring(6, 8) + "/" + date.substring(4, 6) + "/" + date.substring(0, 4) + " " + date.substring(8, 10) + ":" + date.substring(10, 12);
            }
            else {
                return date.substring(6, 8) + "/" + date.substring(4, 6) + "/" + date.substring(0, 4);
            }
        },
        getdiffDays: function (date1, date2, noDays, operator) {
            var fDate = new Date(date1);
            var sDate = new Date(date2);
            var timeDiff = (sDate.getTime() - fDate.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return (((operator == "1") && (diffDays < noDays)) || ((operator == "2") && (diffDays > noDays)) || (operator == "3" && (diffDays == noDays)));

        }


    };
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', '$location', '$window', function ($scope, $rootScope, $location, $window, Idle) {
    $scope.$on('$viewContentLoaded', function () {
        var pId = $location.path();    //path will be /person/show/321/, and array looks like: ["","person","show","321",""]
        if (pId != "/login") {
            $scope.isLogin = true;
            $scope.pagecontent = "page-content";
            $scope.className = "page-header-fixed page-sidebar-closed-hide-logo"
        }
        else {

            $scope.pagecontent = "";
            $scope.isLogin = false;
            $scope.className = " login"
        }
        App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
    $scope.$on('IdleTimeout', function () {
        // the user has timed out (meaning idleDuration + timeout has passed without any activity)
        // this is where you'd log them
        localStorage.removeItem("LoginUserData");
        localStorage.removeItem("CurrentUserID");
        localStorage.removeItem("CurrentUsername");
        localStorage.removeItem("CurrentUserPassword");
        $window.location.href = '#/login';
    });
}])

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', '$window', 'ModalService', function ($scope, $window, ModalService) {
    $scope.$on('$includeContentLoaded', function () {
        //Layout.initHeader(); // init header
    });
    $scope.LoginName = localStorage.CurrentUsername;
    $scope.LogoutUser = function () {
        ModalService.showModal({
            templateUrl: "views/Logout/logout.html",
            controller: "LogoutController",
            inputs: {
                title: "تسجيل خروج"
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function () {
                localStorage.removeItem("LoginUserData");
                localStorage.removeItem("CurrentUserID");
                localStorage.removeItem("CurrentUsername");
                localStorage.removeItem("CurrentUserPassword");
                $window.location.href = '#/login';

            });
        });
    }
    $scope.$on('LoginDone', function () {
        $scope.LoginName = localStorage.CurrentUsername;
    });
    $scope.LoginDone = function () {
        $scope.LoginName = localStorage.CurrentUsername;
    }
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', 'Common', function ($scope, Common) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
        $scope.CheckUserPrivileges = function (moduleHTMLID, pageCategoryHTMLID, pHTMLID) {
            return Common.Security_checkPrivilege(moduleHTMLID, pageCategoryHTMLID, pHTMLID);
        }
        $scope.FavoriteNames = JSON.parse(localStorage.FavoriteNames);
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);


/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        //Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        //Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login");

    $stateProvider
        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard/dashboard.html",
            data: { pageTitle: 'لوحة التحكم' },
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/dashboard.min.js',
                            'js/controllers/DashboardController.js',
                        ]
                    });
                }]
            }
        })

        .state('Profile', {
            url: "/Profile",
            templateUrl: "views/Profile/insert.html",
            data: { pageTitle: 'الملف الشخصى' },
            controller: "ProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/scripts/datatable.js',

                            "../assets/layouts/layout/scripts/demo.min.js",

                            'js/controllers/Profile/ProfileController.js',
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select-rtl.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            //'../assets/global/plugins/angularDatepicker/css/datetimepicker.css',
                            //'../assets/global/plugins/angularDatepicker/js/datetimepicker.js',
                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js'

                        ]
                    });
                }]
            }
        })

        // Employees

        .state('Employees', {
            url: "/Employees",
            templateUrl: "views/Employees/grid.html",
            data: { pageTitle: 'Employees' },
            controller: "EmployeesGridController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [

                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/scripts/datatable.js',

                            "../assets/layouts/layout/scripts/demo.min.js",

                            'js/controllers/Employees/EmployeesGridController.js',
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select-rtl.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                            //'../assets/global/plugins/angularDatepicker/css/datetimepicker.css',
                            //'../assets/global/plugins/angularDatepicker/js/datetimepicker.js',
                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js'

                        ]
                    });
                }]
            }
        })
        // Add Employees
        .state("add_Employees", {
            url: "/add_Employees",
            templateUrl: "views/Employees/insert.html",
            data: { pageTitle: 'add_Employees' },
            controller: "EmployeesInsertController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/scripts/datatable.js',

                            "../assets/layouts/layout/scripts/demo.min.js",
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select-rtl.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            'js/controllers/Employees/EmployeesInsertController.js'
                        ]
                    });
                }]
            }
        })

        .state("Edit_Employees", {
            url: "/Edit_Employees/:officerID",
            templateUrl: "views/Employees/Edit.html",
            data: { pageTitle: 'Edit Employees' },
            controller: "EmployeesEditController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            '../assets/global/scripts/datatable.js',

                            "../assets/layouts/layout/scripts/demo.min.js",
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select-rtl.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',
                            'js/controllers/Employees/EmployeesEditController.js'
                        ]
                    });
                }]
            }
        })

        .state("ResetPassword", {
            url: "/ResetPassword/:resetPasswordID",
            templateUrl: "views/ResetPassword/confirmEmail.html",
            data: { pageTitle: 'Reset Password' },
            controller: "confirmEmailController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'js/controllers/ResetPassword/confirmEmailController.js',
                            'js/controllers/ResetPassword/updatePasswordController.js'
                        ]
                    });
                }]
            }
        })
       // Settings

      .state('Settings/SysSettMainFiles/layout', {
                    url: "/Settings/SysSettMainFiles/layout",
                    templateUrl: "views/Settings/SysSettMainFiles/layout.html",
                    data: { pageTitle: 'Settings ' },
                    controller: "layoutController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MetronicApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [

                                    '../assets/global/plugins/datatables/datatables.min.css',
                                    '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                                    '../assets/global/plugins/datatables/datatables.all.min.js',

                                    '../assets/pages/scripts/table-datatables-managed.min.js',
                                    '../assets/global/scripts/datatable.js',

                                    "../assets/layouts/layout/scripts/demo.min.js",

                                    'js/controllers/Settings/SysSettMainFiles/GeneralSettings/ContractType/ContractTypeController.js',
                                    'js/controllers/Settings/SysSettMainFiles/GeneralSettings/ContractType/ContractTypeInsertController.js',
                                    'js/controllers/Settings/SysSettMainFiles/GeneralSettings/ContractType/ContractTypeEditController.js',

                                    'js/controllers/Settings/SysSettMainFiles/GeneralSettings/Items/ItemsController.js',
                                    'js/controllers/Settings/SysSettMainFiles/GeneralSettings/Items/ItemsEditController.js',
                                    'js/controllers/Settings/SysSettMainFiles/GeneralSettings/Items/ItemsInsertController.js',
                           
                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/Units/UnitsController.js',
                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/Units/UnitsInsertController.js',
                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/Units/UnitsEditController.js',


                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/TreatmentType/TreatmentTypeController.js',
                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/TreatmentType/TreatmentTypeInsertController.js',
                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/TreatmentType/TreatmentTypeEditController.js',

                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/TreatmentType/TreatmentTypeController.js',
                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/TreatmentType/TreatmentTypeInsertController.js',
                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/TreatmentType/TreatmentTypeEditController.js',

                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/OrderName/OrderNameController.js',
                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/OrderName/OrderNameInsertController.js',
                                     'js/controllers/Settings/SysSettMainFiles/GeneralSettings/OrderName/OrderNameEditController.js',

                                      'js/controllers/Settings/SysSettMainFiles/GeneralSettings/NickName/NickNameController.js',
                                      'js/controllers/Settings/SysSettMainFiles/GeneralSettings/NickName/NickNameInsertController.js',
                                      'js/controllers/Settings/SysSettMainFiles/GeneralSettings/NickName/NickNameEditController.js',


                                     'js/controllers/Settings/SysSettMainFiles/layoutController.js',
                                     '../assets/global/plugins/bootstrap-select/css/bootstrap-select-rtl.min.css',
                                     '../assets/global/plugins/select2/css/select2.min.css',
                                     '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                                     '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                     '../assets/global/plugins/select2/js/select2.full.min.js',

                                     '../assets/pages/scripts/components-bootstrap-select.min.js',
                                     '../assets/pages/scripts/components-select2.min.js'

                                ]
                            });
                        }]
                    }
                })

      .state('Departments', {
                url: "/Departments",
                templateUrl: "views/Settings/Departments/grid.html",
                data: { pageTitle: 'Department' },
                controller: "DepartmentsGridController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                            files: [

                                '../assets/global/plugins/datatables/datatables.min.css',
                                '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                                '../assets/global/plugins/datatables/datatables.all.min.js',

                                '../assets/pages/scripts/table-datatables-managed.min.js',
                                '../assets/global/scripts/datatable.js',

                                "../assets/layouts/layout/scripts/demo.min.js",

                                'js/controllers/Settings/Departments/DepartmentsGridController.js',
                                '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                '../assets/global/plugins/select2/css/select2.min.css',
                                '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                                '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                '../assets/global/plugins/select2/js/select2.full.min.js',

                                '../assets/pages/scripts/components-bootstrap-select.min.js',
                                '../assets/pages/scripts/components-select2.min.js'

                            ]
                        });
                    }]
                }
            })

      .state('add_Departments', {
             url: "/add_Departments",
             templateUrl: "views/Settings/Departments/insert.html",
             data: { pageTitle: 'Department' },
             controller: "DepartmentsInsertController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [

                             '../assets/global/plugins/datatables/datatables.min.css',
                             '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                             '../assets/global/plugins/datatables/datatables.all.min.js',

                             '../assets/pages/scripts/table-datatables-managed.min.js',
                             '../assets/global/scripts/datatable.js',

                             "../assets/layouts/layout/scripts/demo.min.js",

                             'js/controllers/Settings/Departments/DepartmentsInsertController.js',
                             '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                             '../assets/global/plugins/select2/css/select2.min.css',
                             '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                             '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             '../assets/global/plugins/select2/js/select2.full.min.js',

                             '../assets/pages/scripts/components-bootstrap-select.min.js',
                             '../assets/pages/scripts/components-select2.min.js'

                         ]
                     });
                 }]
             }
      })

      .state("Edit_Departments", {
          url: "/Edit_Departments/:DepartmentsID",
          templateUrl: "views/Departments/Edit.html",
          data: { pageTitle: 'تعديل قسم' },
          controller: "DepartmentsEditController",
             resolve: {
                 deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                     return $ocLazyLoad.load({
                         name: 'MetronicApp',
                         insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                         files: [
                             '../assets/global/plugins/datatables/datatables.min.css',
                             '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                             '../assets/global/plugins/datatables/datatables.all.min.js',

                             '../assets/pages/scripts/table-datatables-managed.min.js',
                             '../assets/global/scripts/datatable.js',

                             "../assets/layouts/layout/scripts/demo.min.js",
                             '../assets/global/plugins/bootstrap-select/css/bootstrap-select-rtl.min.css',
                             '../assets/global/plugins/select2/css/select2.min.css',
                             '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                             '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                             '../assets/global/plugins/select2/js/select2.full.min.js',

                             '../assets/pages/scripts/components-bootstrap-select.min.js',
                             '../assets/pages/scripts/components-select2.min.js',
                             'js/controllers/Settings/Departments/DepartmentsEditController.js'
                         ]
                     });
                 }]
             }
      })

      .state('UserSecurity', {
              url: "/UserSecurity",
              templateUrl: "views/UserSecurity/grid.html",
              data: { pageTitle: 'صلاحيات النظام ' },
              controller: "UserSecurityController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'MetronicApp',
                          insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                          files: [

                              '../assets/global/plugins/datatables/datatables.min.css',
                              '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                              '../assets/global/plugins/datatables/datatables.all.min.js',

                              '../assets/pages/scripts/table-datatables-managed.min.js',
                              '../assets/global/scripts/datatable.js',

                              "../assets/layouts/layout/scripts/demo.min.js",

                              '../assets/global/plugins/jstree/dist/themes/default/style.min.css',
                              '../assets/global/plugins/jstree/dist/jstree.min.js',

                              'js/controllers/UserSecurity/UserSecurityController.js',
                              'js/controllers/UserSecurity/UserSecurityInsertController.js',
                              'js/controllers/UserSecurity/UserSecurityEditController.js',
                              '../assets/global/plugins/bootstrap-select/css/bootstrap-select-rtl.min.css',
                              '../assets/global/plugins/select2/css/select2.min.css',
                              '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                              '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                              '../assets/global/plugins/select2/js/select2.full.min.js',

                              '../assets/pages/scripts/components-bootstrap-select.min.js',
                              '../assets/pages/scripts/components-select2.min.js'

                          ]
                      });
                  }]
              }
          })

        // login
       .state('login', {
            url: "/login",
            templateUrl: "views/Login/userLogin.html",
            data: { pageTitle: 'شاشة الدخول' },
            controller: "loginController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad, $scope) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/pages/scripts/table-datatables-managed.min.js',
                            'js/controllers/Login/loginController.js',
                            //'js/controllers/ResetPassword/ResetPasswordController.js',

                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select-rtl.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',

                        ]
                    });
                }]
            }
        })

}]);

    /* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "iNNODB", "$window", "$location", "Common", "$filter", function ($rootScope, settings, $state, iNNODB, $window, $location, Common, $filter) {
    M = 'online';
    //online  offline
    iNNODB.setStorageType(M);
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view

    $rootScope.LoginUserData = localStorage.LoginUserData;
    localStorage.setItem('CompanyID', "cmpInnoCollect");
    localStorage.setItem('CompanyLicense', "InnoCollect#124578");
    localStorage.setItem('ProductID', "prdInnoCollect");
    if ($rootScope.LoginUserData == undefined || $rootScope.LoginUserData == null || $rootScope.LoginUserData.length <= 0)
        $window.location.href = '#/login';
    $rootScope.$watch(function () {
        return $location.path();
    },
    function (a) {
        $rootScope.LoginUserData = localStorage.LoginUserData;
        if ($rootScope.LoginUserData == undefined || $rootScope.LoginUserData == null || $rootScope.LoginUserData.length <= 0)
            $window.location.href = '#/login';
                // show loading div, etc...
            });
    }]);

    function getObjectIndex(obj, keyToFind, ValueToFine) {
        var i = 0, key;
        var index = null;
        for (j = 0; j < obj.length; j++) {
            for (key in obj[j]) {
                if ((key == keyToFind) && (obj[j][key] == ValueToFine)) {
                    index = j;
                    break;
                }
                i++;
            }
            if (index != null) {
                return index;
                break;
            }
        }
        return index;

    }

    function PrintHtmlTable(title, divId, printDiv) {
        if (printDiv != undefined)
            var data = $("#" + divId).html()
        else
            var data = $("#" + divId + " .table-scrollable").html()
        var mywindow = window.open('', '_blank', 'height=900,width=1000');

        mywindow.document.write('<html><head><title>' + title + '</title>');

        mywindow.document.write('<style>#Process{display:none;}table { width:100%  !important; min-width:500px !important; } th { background-color:#AFAFAF!important; color:#2D2D2D !important; -webkit-print-color-adjust: exact; padding:2px !important;    } td { padding:2px;  border: 1px solid #dddddd  !important;} </style> </head><body ><div style="float:left !important"> <img src="../assets/layouts/layout/img/logo.png" height="45"></div> <div style=" margin-top:20px; float:left;direction: ltr; border:1px solid #DDDDDD;">');
        mywindow.document.write(data);
        mywindow.document.write('</div></body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        mywindow.print();
        mywindow.close();

        return true;
    }