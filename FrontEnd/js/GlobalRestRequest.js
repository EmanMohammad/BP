(function () {

    var GlobalRestRequest = function ($q, $http) {
        var url = "http://localhost:52248/";

        var request = function (controlHTMLID, route, verb, headers, data) {
            if (data == undefined) {
                data = [];
            }
            if (headers == undefined) {
                headers = {};
            }
            headers["CompanyID"] = "cmpInnoCollect";
            headers["CompanyLicense"] = "InnoCollect#124578";
            headers["sRequesterUserName"] = "prdInnoCollectAdmin";
            headers["sRequesterPassword"] = "Admn1596";
            headers["sRequesterControlID"] = "0";
            return $http({
                method: verb,
                url: url + route,
                data: data,
                headers: headers
            }).then(function (responseData) {
                return responseData;
            })
           .catch(function (responseData) {
               return $q.reject(responseData);
           });
        }
        return {
            request: request,
        }
    }


    angular.module('MetronicApp')
    .factory('GlobalRestRequest', GlobalRestRequest);





}());