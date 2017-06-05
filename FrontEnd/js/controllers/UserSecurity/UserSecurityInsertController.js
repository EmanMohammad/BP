
angular.module('MetronicApp').controller('UserSecurityInsertController', function ($rootScope, $scope, $http, $timeout, $element, title, close, UserSecurity) {

    $scope.title = title;
    $scope.UserSecurity = UserSecurity;
    $scope.Security_Tree_rowListJson = [];
    var lstRowJson_PC = [];
    var lstRowJson_P = [];
    var lstRowJson_Pan = [];
    var lstRowJson_C = [];
    var header = {};
    header["sProductID"] = "prdInnoCollect";
    header["sCompanyID"] = "cmpInnoCollect";
    header["sCompanyLicense"] = "InnoCollect#124578";
    var cdt = new Date();
    //var currentDateUTC = GetFormatedDateTo_YYMMDDHHMMSSss(cdt.getUTCDate() + "/" + (cdt.getUTCMonth() + 1) + '/' + cdt.getUTCFullYear(), cdt.getUTCHours() + ":" + cdt.getUTCMinutes() + ":" + cdt.getUTCSeconds());
    //header["sCurrentDateUTC"] = currentDateUTC;

    $http({
        method: "GET",
        url: "/GetAllStrcuture",
        data: [],
        headers: header
    }).then(function (responseData) {
        $scope.TreeArr = responseData.data.data;
        $scope.ParseTreeArr();
    }).catch(function (responseData) {
        return responseData;
    });

    $scope.generateStructureTree = function () {
        $('#tree_2').jstree({
            'plugins': ["checkbox", "types"],
            'core': {
                "themes": {
                    "responsive": false
                },
                'data': [{
                    "text": "All",
                    "children": $scope.Security_Tree_rowListJson
                }]
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                }
            }
        });
    }

    $scope.ParseTreeArr = function () {

        for (var i = 0; i < $scope.TreeArr.length; i++) {
            var rowJson = {};
            lstRowJson_PC = [];
            lstRowJson_P = [];
            lstRowJson_Pan = [];
            lstRowJson_C = [];
            var moduleID = $scope.TreeArr[i].sModuleHTMLID;
            var sModuleName = $scope.TreeArr[i].sModuleName;
            var sModuleArName = $scope.TreeArr[i].sModuleArName;
            rowJson["id"] = moduleID;
            rowJson["pId"] = "";
            rowJson["text"] = sModuleArName;
            //rowJson["chechboxId"] = moduleID;
            rowJson["idx"] = i;
            rowJson["children"] = [];
            rowJson["children"] = angular.copy($scope.GetPageCategories(i, moduleID));

            //$scope.Security_Tree_rowListJson.push(rowJson);

            $scope.Security_Tree_rowListJson.push(rowJson);
        }
        $scope.generateStructureTree();
    }

    $scope.GetPageCategories = function (i, moduleID, Module) {
        var pageCategories = $scope.TreeArr[i].PageCategories;
        if (pageCategories != null || PageCategories != undefined) {
            for (var pc = 0; pc < pageCategories.length; pc++) {
                var rowJson_PC = {};
                lstRowJson_P = [];
                lstRowJson_Pan = [];
                lstRowJson_C = [];
                var pageCatID = pageCategories[pc].sPageCategoryHTMLID;
                var sPageCategoryName = pageCategories[pc].sPageCategoryName;
                var sPageCategoryArName = pageCategories[pc].sPageCategoryArName;
                rowJson_PC["id"] = moduleID + "_" + pageCatID;
                rowJson_PC["pId"] = moduleID;
                rowJson_PC["text"] = sPageCategoryArName;
                //rowJson_PC["chechboxId"] = moduleID + "_" + pageCatID;
                if (Module != undefined && Module.length > 0) {
                    var pCategory = Module[0].PageCategories.filter(function (el) { return el.sPageCategoryHTMLID == rowJson_PC["id"].replace(moduleID + "_", ''); })
                    if (pCategory.length > 0)
                        if (pCategory[0].Pages.length <= 0)
                            if (pCategory[0].sEnable) {
                                rowJson_PC["state"] = {};
                                rowJson_PC["state"]["selected"] = true;
                            }
                }
                //rowJson_PC["idx"] = i + "_" + pc;
                rowJson_PC["children"] = [];
                rowJson_PC["children"] = angular.copy($scope.GetPages(pageCategories, pc, moduleID, pageCatID, i, Module, pCategory));

                lstRowJson_PC.push(rowJson_PC);
                //$scope.Security_Tree_rowListJson.push(rowJson);
            }
        }
        return lstRowJson_PC;
    }

    $scope.GetPages = function (pageCategories, pc, moduleID, pageCatID, i, Module, pCategory) {
        var pages = pageCategories[pc].Pages;
        if (pages != null || pages != undefined) {
            for (var p = 0; p < pages.length; p++) {
                var rowJson_P = {};
                lstRowJson_Pan = [];
                lstRowJson_C = [];
                var pagID = pages[p].sPageHTMLID;
                var sPageName = pages[p].sPageName;
                var sPageArName = pages[p].sPageArName;
                rowJson_P["id"] = moduleID + "_" + pageCatID + "_" + pagID;
                rowJson_P["pId"] = moduleID + "_" + pageCatID;
                rowJson_P["text"] = sPageArName;
                if (Module != undefined && pCategory != undefined)
                    if (Module.length > 0 && pCategory.length > 0) {
                        var page = pCategory[0].Pages.filter(function (el) { return el.sPageHTMLID == rowJson_P["id"].replace(moduleID + "_" + pageCatID + "_", ''); });
                        if (page.length > 0)
                            if (page[0].Panels.length <= 0)
                                if (page[0].sEnable) {
                                    rowJson_P["state"] = {};
                                    rowJson_P["state"]["selected"] = true;
                                }
                    }
                //rowJson_P["chechboxId"] = moduleID + "_" + pageCatID + "_" + pagID;
                //rowJson_P["idx"] = i + "_" + pc + "_" + p;
                rowJson_P["children"] = [];
                rowJson_P["children"] = angular.copy($scope.GetPanels(pages, p, moduleID, pageCatID, pagID, i, pc, p, Module, pCategory, page));
                lstRowJson_P.push(rowJson_P);
                //$scope.Security_Tree_rowListJson.push(rowJson);
            }
        }
        return lstRowJson_P;
    }

    $scope.GetPanels = function (pages, p, moduleID, pageCatID, pagID, i, pc, p, Module, pCategory, page) {
        var panels = pages[p].Panels;
        if (panels != null || panels != undefined) {
            for (var pnl = 0; pnl < panels.length; pnl++) {
                var rowJson_Pan = {};
                lstRowJson_C = [];
                var pnlID = panels[pnl].sPanelHTMLID;
                var sPanelName = panels[pnl].sPanelName;
                var sPanelArName = panels[pnl].sPanelArName;
                rowJson_Pan["id"] = moduleID + "_" + pageCatID + "_" + pagID + "_" + pnlID;
                rowJson_Pan["pId"] = moduleID + "_" + pageCatID + "_" + pagID;
                rowJson_Pan["text"] = sPanelArName;
                if (Module != undefined && pCategory != undefined && page != undefined)
                    if (Module.length > 0 && pCategory.length > 0 && page.length > 0) {
                        var panel = page[0].Panels.filter(function (el) { return el.sPanelHTMLID == rowJson_Pan["id"].replace(moduleID + "_" + pageCatID + "_" + pagID + "_", ''); });
                        if (panel.length > 0)
                            if (panel[0].Controls.length <= 0)
                                if (panel[0].sEnable) {
                                    rowJson_Pan["state"] = {};
                                    rowJson_Pan["state"]["selected"] = true;
                                }
                    }
                //rowJson_Pan["chechboxId"] = moduleID + "_" + pageCatID + "_" + pagID + "_" + pnlID;
                //rowJson_Pan["idx"] = i + "_" + pc + "_" + p + "_" + pnl;
                rowJson_Pan["children"] = [];
                rowJson_Pan["children"] = angular.copy($scope.GetControls(panels, pnl, moduleID, pageCatID, pagID, pnlID, i, pc, p, pnl, Module, pCategory, page, panel));
                lstRowJson_Pan.push(rowJson_Pan);
                //$scope.Security_Tree_rowListJson.push(rowJson);
            }
        }
        return lstRowJson_Pan;
    }

    $scope.GetControls = function (panels, pnl, moduleID, pageCatID, pagID, pnlID, i, pc, p, pnl, Module, pCategory, page, panel) {
        var controls = panels[pnl].Controls;
        if (controls != null || controls != undefined) {
            for (var c = 0; c < controls.length; c++) {
                var rowJson_C = {};
                var controlId = controls[c].sControlHTMLID;
                var sPanelName = controls[c].sPanelName;
                var sControlArName = controls[c].sControlArName;
                var rowJson = {};
                rowJson_C["id"] = moduleID + "_" + pageCatID + "_" + pagID + "_" + pnlID + "_" + controlId;
                rowJson_C["pId"] = moduleID + "_" + pageCatID + "_" + pagID + "_" + pnlID;
                rowJson_C["text"] = sControlArName;
                if (Module != undefined && pCategory != undefined && page != undefined && panel != undefined)
                    if (Module.length > 0 && pCategory.length > 0 && page.length > 0 && panel.length > 0) {
                        var control = panel[0].Controls.filter(function (el) { return el.sControlHTMLID == rowJson_C["id"].replace(moduleID + "_" + pageCatID + "_" + pagID + "_" + pnlID + "_", ''); });
                        if (control.length > 0)
                            if (control[0].Controls.length > 0)
                                if (control[0].sEnable) {
                                    rowJson_C["state"] = {};
                                    rowJson_C["state"]["selected"] = true;
                                }
                    }
                //rowJson_C["chechboxId"] = moduleID + "_" + pageCatID + "_" + pagID + "_" + pnlID + "_" + controlId;
                //rowJson_C["idx"] = i + "_" + pc + "_" + p + "_" + pnl + "_" + c;
                lstRowJson_C.push(rowJson_C);
                //$scope.Security_Tree_rowListJson.push(rowJson);
            }
        }
        return lstRowJson_C;
    }

    $scope.close = function () {
        $scope.Security_Tree_Arr = $('#tree_2').jstree().get_json()[0].children;
        var lstModules = [];
        for (var i = 0; i < $scope.Security_Tree_Arr.length; i++) {
            var objModule = {};
            var moduleID = $scope.Security_Tree_Arr[i].id;
            if ($scope.Security_Tree_Arr[i].state.selected) {
                objModule["sModuleHTMLID"] = moduleID;
                objModule["sEnable"] = "True";
                objModule["sVisible"] = "True";
                objModule["PageCategories"] = [];
            }

            var pageCategories = $scope.Security_Tree_Arr[i].children;
            if (pageCategories != null || PageCategories != undefined) {
                for (var pc = 0; pc < pageCategories.length; pc++) {
                    var objPageCategory = {};
                    var pageCat = pageCategories[pc].id;
                    var pageCatID = pageCat.replace(moduleID + "_", '');
                    if (pageCategories[pc].state.selected) {
                        if (!objModule.hasOwnProperty("sModuleHTMLID")) {
                            objModule["sModuleHTMLID"] = moduleID;
                            objModule["sEnable"] = "True";
                            objModule["sVisible"] = "True";
                            objModule["PageCategories"] = [];
                        }
                        objPageCategory["sPageCategoryHTMLID"] = pageCatID;
                        objPageCategory["sEnable"] = "True";
                        objPageCategory["sVisible"] = "True";
                        objPageCategory["Pages"] = [];
                    }

                    var pages = pageCategories[pc].children;
                    if (pages != null || pages != undefined) {
                        for (var p = 0; p < pages.length; p++) {
                            var objPage = {};
                            var pag = pages[p].id;
                            var pagID = pag.replace(pageCat + "_", '');
                            if (pages[p].state.selected) {
                                if (!objPageCategory.hasOwnProperty("sPageCategoryHTMLID")) {
                                    objPageCategory["sPageCategoryHTMLID"] = pageCatID;
                                    objPageCategory["sEnable"] = "True";
                                    objPageCategory["sVisible"] = "True";
                                    objPageCategory["Pages"] = [];
                                }
                                objPage["sPageHTMLID"] = pagID;
                                objPage["sEnable"] = "True";
                                objPage["sVisible"] = "True";
                                objPage["Panels"] = [];
                            }

                            var panels = pages[p].children;
                            if (panels != null || panels != undefined) {
                                for (var pnl = 0; pnl < panels.length; pnl++) {
                                    var objPanel = {};
                                    var pnel = panels[pnl].id;
                                    var pnlID = pnel.replace(pag + "_", '');
                                    if (panels[pnl].state.selected) {
                                        if (!objPage.hasOwnProperty("sPageHTMLID")) {
                                            objPage["sPageHTMLID"] = pagID;
                                            objPage["sEnable"] = "True";
                                            objPage["sVisible"] = "True";
                                            objPage["Panels"] = [];
                                        }
                                        objPanel["sPanelHTMLID"] = pnlID;
                                        objPanel["sEnable"] = "True";
                                        objPanel["sVisible"] = "True";
                                        objPanel["Controls"] = [];
                                    }

                                    var controls = panels[pnl].children;
                                    if (controls != null || controls != undefined) {
                                        for (var c = 0; c < controls.length; c++) {
                                            var objControl = {};
                                            var control = controls[c].id;
                                            var controlId = control.replace(pnel + "_", '');
                                            if (controls[c].state.selected) {
                                                if (!objPanel.hasOwnProperty("sPageHTMLID")) {
                                                    objPanel["sPanelHTMLID"] = pnlID;
                                                    objPanel["sEnable"] = "True";
                                                    objPanel["sVisible"] = "True";
                                                    objPanel["Controls"] = [];
                                                }
                                                objControl["sControlHTMLID"] = controlId;
                                                objControl["sEnable"] = "True";
                                                objControl["sVisible"] = "True";
                                            }
                                            else {
                                                continue;
                                            }
                                            if (objPanel.hasOwnProperty("sPanelHTMLID") && objControl.hasOwnProperty("sControlHTMLID"))
                                                objPanel["Controls"].push(objControl);
                                        }
                                    }
                                    if (objPanel.hasOwnProperty("sPanelHTMLID")) {
                                        if (!objPage.hasOwnProperty("sPageHTMLID")) {
                                            objPage["sPageHTMLID"] = pagID;
                                            objPage["sEnable"] = "True";
                                            objPage["sVisible"] = "True";
                                            objPage["Panels"] = [];
                                        }
                                        objPage["Panels"].push(objPanel);
                                    }
                                }
                            }
                            if (objPage.hasOwnProperty("sPageHTMLID")) {
                                if (!objPageCategory.hasOwnProperty("sPageCategoryHTMLID")) {
                                    objPageCategory["sPageCategoryHTMLID"] = pageCatID;
                                    objPageCategory["sEnable"] = "True";
                                    objPageCategory["sVisible"] = "True";
                                    objPageCategory["Pages"] = [];
                                }
                                objPageCategory["Pages"].push(objPage);
                            }
                        }
                    }
                    if (objPageCategory.hasOwnProperty("sPageCategoryHTMLID")) {
                        if (!objModule.hasOwnProperty("sModuleHTMLID")) {
                            objModule["sModuleHTMLID"] = moduleID;
                            objModule["sEnable"] = "True";
                            objModule["sVisible"] = "True";
                            objModule["PageCategories"] = [];
                        }
                        objModule["PageCategories"].push(objPageCategory);
                    }
                }
            }
            if (objModule.hasOwnProperty("sModuleHTMLID"))
                lstModules.push(objModule);
        }
        $scope.newUserSecurity.Modules = lstModules;
        close({
            newUserSecurity: $scope.newUserSecurity
        }, 500);
    };

    $scope.cancel = function () {
        close({
            newUserSecurity: "close"
        }, 500);
        //$element.modal('hide');
    };

    $scope.PreviousRoleChange = function () {
        if ($scope.newUserSecurity.prevRole != undefined && $scope.newUserSecurity.prevRole != "") {
            $scope.prevRole = $scope.UserSecurity[$scope.UserSecurity.findIndex(x=> x.sRoleID == $scope.newUserSecurity.prevRole)]
            $scope.Security_Tree_rowListJson = [];
            $("#div_tree").html('<div id="tree_2" class="tree-demo"> </div>');
            $scope.ParseTreeArrPrev();
        }
    }

    $scope.ParseTreeArrPrev = function () {
        for (var i = 0; i < $scope.TreeArr.length; i++) {
            var rowJson = {};
            lstRowJson_PC = [];
            lstRowJson_P = [];
            lstRowJson_Pan = [];
            lstRowJson_C = [];
            var moduleID = $scope.TreeArr[i].sModuleHTMLID;
            var sModuleName = $scope.TreeArr[i].sModuleName;
            var sModuleArName = $scope.TreeArr[i].sModuleArName;
            rowJson["id"] = moduleID;
            rowJson["pId"] = "";
            rowJson["text"] = sModuleArName;
            //rowJson["chechboxId"] = moduleID;
            var Module = $scope.prevRole.Modules.filter(function (el) { return el.sModuleHTMLID == moduleID; })
            //if ($scope.newUserSecurity.Modules.length > 0 && i < $scope.newUserSecurity.Modules.length)
            if (Module.length > 0)
                if (Module[0].PageCategories.length <= 0)
                    if (Module[0].sEnable) {
                        rowJson["state"] = {};
                        rowJson["state"]["selected"] = true;
                    }
            rowJson["idx"] = i;
            rowJson["children"] = [];
            rowJson["children"] = angular.copy($scope.GetPageCategories(i, moduleID, Module));

            //$scope.Security_Tree_rowListJson.push(rowJson);

            $scope.Security_Tree_rowListJson.push(rowJson);
        }
        $scope.generateStructureTree();
    }

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

})
