//version 1.12

(function () {

    angular.module('MetronicApp')
    .factory('_OS', ['$q', '$http', function ($q, $http) {

        var url = "http://innocollect.innodevelopment.org/InnoTech/srvInnoCollect/";

        var postRequest = function (route, data, headers, controlID, adminUserName, adminPassword) {
            var Headers = {};
            Headers["sCompanyID"] = localStorage.CompanyID;
            Headers["sCompanyLicense"] = localStorage.CompanyLicense;
            Headers["sProductID"] = localStorage.ProductID;
            if (localStorage.CurrentUsername != undefined)
                Headers["sRequesterUserName"] = localStorage.CurrentUsername;
            else
                Headers["sRequesterUserName"] = adminUserName;

            if (localStorage.CurrentUserPassword != undefined)
                Headers["sRequesterPassword"] = localStorage.CurrentUserPassword;
            else
                Headers["sRequesterPassword"] = adminPassword;

            Headers["sRequesterControlID"] = controlID;
            Headers["sBranchID"] = "1";
            Headers["sPersonID"] = "Ali";

            if (data == undefined) {
                data = [];
            }
            if (headers != undefined || headers != null || headers != {}) {
                for (var property in headers) {
                    if (headers.hasOwnProperty(property)) {
                        Headers[property] = angular.toJson(headers[property]);
                    }
                }
                for (var key in Headers) {
                    if (Headers.hasOwnProperty(key)) {
                        Headers[key] = encodeURIComponent(Headers[key]);
                    }
                }
            }
            return $http({
                method: 'POST',
                url: url + route,
                data: data,
                headers: Headers
            }).then(function (responseData) {
                return responseData;
            }, function (responseData) {
                return responseData;
            })
            .catch(function (responseData) {
                return $q.reject(responseData);
            });
        }


        var putRequest = function (route, data, headers, controlID, adminUserName, adminPassword) {
            var Headers = {};
            Headers["sCompanyID"] = localStorage.CompanyID;
            Headers["sCompanyLicense"] = localStorage.CompanyLicense;
            Headers["sProductID"] = localStorage.ProductID;
            if (localStorage.CurrentUsername != undefined)
                Headers["sRequesterUserName"] = localStorage.CurrentUsername;
            else
                Headers["sRequesterUserName"] = adminUserName;

            if (localStorage.CurrentUserPassword != undefined)
                Headers["sRequesterPassword"] = localStorage.CurrentUserPassword;
            else
                Headers["sRequesterPassword"] = adminPassword;

            Headers["sRequesterControlID"] = controlID;
            Headers["sBranchID"] = "1";
            Headers["sPersonID"] = "Ali";

            if (data == undefined) {
                data = [];
            }
            if (headers != undefined || headers != null || headers != {}) {
                for (var property in headers) {
                    if (headers.hasOwnProperty(property)) {
                        Headers[property] = angular.toJson(headers[property]);
                    }
                }
                for (var key in Headers) {
                    if (Headers.hasOwnProperty(key)) {
                        Headers[key] = encodeURIComponent(Headers[key]);
                    }
                }
            }
            if (data == undefined) {
                data = [];
            }
            //if (headers != undefined || headers != null || headers != {}) {
            //    Headers.sFilter = headers;
            //}
            return $http({
                method: 'PUT',
                url: url + route,
                data: data,
                headers: Headers
            }).then(function (responseData) {
                return responseData;
            }, function (responseData) {
                return responseData;
            })
             .catch(function (responseData) {
                 return $q.reject(responseData);
             });
        }
        var getRequest = function (route, data, headers, controlID, adminUserName, adminPassword) {
            var Headers = {};
            Headers["sCompanyID"] = localStorage.CompanyID;
            Headers["sCompanyLicense"] = localStorage.CompanyLicense;
            Headers["sProductID"] = localStorage.ProductID;
            if (localStorage.CurrentUsername != undefined)
                Headers["sRequesterUserName"] = localStorage.CurrentUsername;
            else
                Headers["sRequesterUserName"] = adminUserName;

            if (localStorage.CurrentUserPassword != undefined)
                Headers["sRequesterPassword"] = localStorage.CurrentUserPassword;
            else
                Headers["sRequesterPassword"] = adminPassword;

            Headers["sRequesterControlID"] = controlID;
            Headers["sBranchID"] = "1";
            Headers["sPersonID"] = "Ali";

            if (data != null) {
                data = null;
            }
            if (headers != undefined || headers != null || headers != {}) {
                for (var property in headers) {
                    if (headers.hasOwnProperty(property)) {
                        Headers[property] = angular.toJson(headers[property]);
                    }
                }
                for (var key in Headers) {
                    if (Headers.hasOwnProperty(key)) {
                        Headers[key] = encodeURIComponent(Headers[key]);
                    }
                }
            }
            return $http({
                method: 'GET',
                url: url + route,
                data: data,
                headers: Headers
            }).then(function (response) {
                return response;
            }, function (response) {
                return response;
            })
           .catch(function (response) {
               return $q.reject(response);
           });
        }
        var deleteRequest = function (route, data, header, controlID, adminUserName, adminPassword) {
            var Headers = {};
            Headers["sCompanyID"] = localStorage.CompanyID;
            Headers["sCompanyLicense"] = localStorage.CompanyLicense;
            Headers["sProductID"] = localStorage.ProductID;
            if (localStorage.CurrentUsername != undefined)
                Headers["sRequesterUserName"] = localStorage.CurrentUsername;
            else
                Headers["sRequesterUserName"] = adminUserName;

            if (localStorage.CurrentUserPassword != undefined)
                Headers["sRequesterPassword"] = localStorage.CurrentUserPassword;
            else
                Headers["sRequesterPassword"] = adminPassword;

            Headers["sRequesterControlID"] = controlID;
            Headers["sBranchID"] = "1";
            Headers["sPersonID"] = "Ali";

            if (data != null) {
                data = null;
            }
            if (header != undefined || header != null || header != {}) {
                if (header.sRowIDs) {
                    Headers['sRowIDs'] = header.sRowIDs;
                }
                else if (header.sFilter) {
                    Headers['sFilter'] = angular.toJson(header['sFilter']);
                }

            }
            return $http({
                method: 'DELETE',
                url: url + route,
                data: data,
                headers: Headers
            }).then(function (response) {

                return response;

            }, function (response) {
                return response;
            })
            .catch(function (responseData) {
                return $q.reject(responseData);
            });
        }

        return {
            'insert': postRequest,
            'update': putRequest,
            'select': getRequest,
            'delete': deleteRequest
        }
    }]);
}());