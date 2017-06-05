(function (modules) { // webpackBootstrap
    // The module cache
    var installedModules = {};

    // The require function
    function __webpack_require__(moduleId) {

        // Check if module is in cache
        if (installedModules[moduleId])
            return installedModules[moduleId].exports;

        // Create a new module (and put it into the cache)
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: false

        };

        // Execute the module function
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // Flag the module as loaded
        module.loaded = true;

        // Return the exports of the module
        return module.exports;

    }


    // expose the modules object (__webpack_modules__)
    __webpack_require__.m = modules;

    // expose the module cache
    __webpack_require__.c = installedModules;

    // __webpack_public_path__
    __webpack_require__.p = "";

    // Load entry module and return exports
    return __webpack_require__(0);

})
/************************************************************************/
([
    function (module, exports) {
        'use strict';


        (function () {

            'use strict';

            var module = angular.module('ImportExcelService', []);

            module.factory('ImportExcel', [function () {

                function ImportExcel() {
                    var X = XLSX;
                    var result = "";
                    this.Import = function (data) {
                        var val = s2ab(data);
                        var v = XLSX.read(ab2str(val[1]), { type: 'binary' });
                        var res = { t: "xlsx", d: JSON.stringify(v) };
                        var r = s2ab(res.d)[1];
                        var xx = ab2str(r).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                        return result = to_json(JSON.parse(xx));
                    }
                    function s2ab(s) {
                        var b = new ArrayBuffer(s.length * 2), v = new Uint16Array(b);
                        for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
                        return [v, b];
                    }
                    function ab2str(data) {
                        var o = "", l = 0, w = 10240;
                        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
                        o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
                        return o;
                    }
                    function to_json(workbook) {
                        var result = [];
                        workbook.SheetNames.some(function (sheetName) {
                            var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                            result["colms"] = {};
                            result["data"] = {};
                            result["colms"] = roa.colms;
                            result["data"] = roa.data;
                            return true;
                        });
                        return result;
                    }
                }

                return new ImportExcel();
            }]);
        })();
    }
]);