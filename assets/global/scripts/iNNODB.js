
(function () {
    var app = angular.module('MetronicApp');


    app.factory('iNNODB', ['_LS', '_OS', 'ModalService', function (_LS, _OS, ModalService) {

        var StorageType = localStorage.mode;
        var setStorageType = function (value) {
            localStorage.mode = value;
        }
        // offline area

        var modalMe = function (sTitle, sMsg) {
            ModalService.showModal({
                templateUrl: "views/msg.html",
                controller: "msgController",
                inputs: {
                    title: sTitle,
                    message: sMsg
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) { });
            });
            /**************************************************/
        }

        /**************************************************/
        var loadingMe = function () {
            return ModalService.showModal({
                templateUrl: "views/loading.html",
                controller: "loadingController",

            }).then(function (modal) {
                modal.element.modal();
                return modal;
            });
        }
        /**************************************************/

        var insert = function (filename, item, header, controlID, loading, adminUserName, adminPassword) {
            //var mdl;
            //loadingMe().then(function (modal) { mdl = modal; });
            if (localStorage.mode == 'offline') {
                return _LS.insert(filename, item, header, controlID)
                        .then(function (response) {
                            //mdl.element.modal('hide');
                            /**************************************************/
                            if (loading != false) {
                                if (response.success == "true") {
                                    modalMe('عملية الاضافة', 'تم تنفيذ العملية بنجاح');
                                }
                                else {
                                    modalMe('عملية الاضافة', 'لم يتم تنفيذ العملية بنجاح');
                                }
                            }
                            /**************************************************/
                            return response;
                        })
            }
            else {
                return _OS.insert(filename, item, header, controlID, adminUserName, adminPassword)
                   .then(function (response) {
                       // mdl.element.modal('hide');
                       /**************************************************/
                       if (loading != false) {
                           if (response.status != -1 && response.data.success == "true") {
                               modalMe('عملية الاضافة', 'تم تنفيذ العملية بنجاح');
                           }
                           else {
                               modalMe('عملية الاضافة', 'لم يتم تنفيذ العملية بنجاح');
                           }
                       }
                       /**************************************************/

                       return response.data;
                   })
            }
        }
        var update = function (filename, item, header, controlID, loading, adminUserName, adminPassword) {
            //var mdl;
            //loadingMe().then(function (modal) { mdl = modal; });
            if (localStorage.mode == 'offline') {
                return _LS.update(filename, item, header)
                        .then(function (response) {
                            //mdl.element.modal('hide');
                            /**************************************************/
                            if (loading != false) {
                                if (response.success == "true") {
                                    modalMe('عملية التعديل', 'تم تنفيذ العملية بنجاح');
                                }
                                else {
                                    modalMe('عملية التعديل', 'لم يتم تنفيذ العملية بنجاح');
                                }
                            }
                            /**************************************************/
                            return response;
                        })
            }
            else {
                return _OS.update(filename, item, header, controlID, adminUserName, adminPassword)
                    .then(function (response) {
                        //mdl.element.modal('hide');
                        /**************************************************/
                        if (loading != false) {
                            if (response.status != -1 && response.data.success == "true") {
                                modalMe('عملية التعديل', 'تم تنفيذ العملية بنجاح');
                            }
                            else {
                                modalMe('عملية التعديل', 'لم يتم تنفيذ العملية بنجاح');
                            }
                        }
                        /**************************************************/
                        return response.data;
                    })
            }
        }
        var select = function (filename, item, header, controlID, adminUserName, adminPassword) {



            if (localStorage.mode == 'offline') {
                return _LS.select(filename, item, header)
                        .then(function (response) {

                            return response;
                        })
            } else {



                return _OS.select(filename, item, header, controlID, adminUserName, adminPassword)
                   .then(function (response) {

                       return response.data;
                   });
            }
        }
        var remove = function (filename, item, header, controlID, loading) {
            //var mdl;
            //loadingMe().then(function (modal) { mdl = modal; });
            if (localStorage.mode == 'offline') {
                return _LS.delete(filename, item, header)
                        .then(function (response) {
                            //mdl.element.modal('hide');
                            /**************************************************/
                            if (loading != false) {
                                if (response.success == "true") {
                                    modalMe('عملية الحذف', 'تم تنفيذ العملية بنجاح');
                                }
                                else {
                                    modalMe('عملية الحذف', 'لم يتم تنفيذ العملية بنجاح');
                                }
                            }
                            /**************************************************/

                            return response;
                        })
            } else {
                return _OS.delete(filename, item, header, controlID)
                   .then(function (response) {
                       //mdl.element.modal('hide');
                       /**************************************************/
                       if (loading != false) {
                           if (response.status != -1 && response.data.success == "true") {
                               modalMe('عملية الحذف', 'تم تنفيذ العملية بنجاح');
                           }
                           else {
                               modalMe('عملية الحذف', 'لم يتم تنفيذ العملية بنجاح');
                           }
                       }
                       /**************************************************/

                       return response.data;
                   })
            }
        }



        return {
            'setStorageType': setStorageType,
            'insert': insert,
            'select': select,
            'update': update,
            'delete': remove
        }



    }]);
}());