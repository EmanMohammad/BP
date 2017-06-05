(function () {
    var app = angular.module('MetronicApp');


    app.factory('OfflineDBInterface', function (_LS, _OS) {
        var StorageType = localStorage.mode;
        var setStorageType = function (value) {
            localStorage.mode = value;
        }
        // offline area
        var insert = function (filename, item, header) {
            if (localStorage.mode == 'offline') {
                return _LS.insert(filename, item, header)
                        .then(function (response) { return response; })
            }
            else {
                return _OS.insert(filename, item, header)
                   .then(function (response) { return response; })
            }
        }
        var update = function (filename, item, header) {
            if (localStorage.mode == 'offline') {
                return _LS.update(filename, item, header)
                        .then(function (response) { return response; })
            }
            else {
                return _OS.update(filename, item, header)
   .then(function (response) { return response; })
            }
        }
        var select = function (filename, item, header) {
            if (localStorage.mode == 'offline') {
                return _LS.select(filename, item, header)
                        .then(function (response) { return response; })
            } else {
                return _OS.select(filename, item, header)
                   .then(function (response) { return response.data; });
            }
        }
        var remove = function (filename, item, header) {
            if (localStorage.mode == 'offline') {
                return _LS.delete(filename, item, header)
                        .then(function (response) { return response; })
            } else {
                return _OS.delete(filename, item, header)
                   .then(function (response) { return response; })
            }
        }


        //if (StorageType == 'offline') {
        return {
            'setStorageType': setStorageType,
            'insert': insert,
            'select': select,
            'update': update,
            'delete': remove
        }

        //}


    });
}());