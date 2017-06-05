//version 1.11.1
(function () {
    angular.module('MetronicApp')
        .factory('_LS', ['$q', '$timeout', function ($q, $timeout) {
            var guid = function () {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                      .toString(16)
                      .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                  s4() + '-' + s4() + s4() + s4();
            }

            var giveIDsAndPush = function (list, item) {

                var idx;
                var rowIDsArr = [];
                if (list == undefined || list == null || list.length == 0) {
                    list = [];
                    idx == -1;
                }
                else {
                    idx = Math.max.apply(Math, list.map(function (o) {
                        return o.id;
                    }));
                }
                if (isNaN(idx + 1)) idx = 0;
                if (item.constructor == Array) {
                    for (var i = 0; i < item.length; i++) {
                        item[i]._rowID = guid();
                        item[i].id = ++idx;
                    }
                }
                else {

                    item._rowID = guid();
                    item.id = ++idx;
                    var tempItemArr = [];
                    tempItemArr.push(item);
                    item = tempItemArr;
                }
                //validate ids
                for (var i = 0; i < item.length; i++) {
                    if (item[i].constructor == Array) {

                    }
                }

                for (var i = 0; i < item.length; i++) {
                    list.push(item[i]);
                    rowIDsArr.push(item[i]._rowID);
                }
                var returnedArr = [];
                returnedArr.push(list);
                returnedArr.push(rowIDsArr);

                return returnedArr;

            }
            function responseObject() {
                this.success = "",
                this.errorCode = "err-00",
                this.message = "",
                this.servermls = "",
                this.data = {
                    'Received Rows Count': 0,
                    'Succeeded Rows Count': 0,
                    'Failed Rows Count': 0,
                    '_rowID(s)': -1
                }
            }




            var insert = function (filename, item, header) {

                var deferred = $q.defer();

                var response;
                if (item == undefined || item == {} || item == []) {
                    deferred.reject('No data to be inserted.');
                }
                else {
                    if (header == undefined || header == {} || header == null || header.sFilter == undefined) {
                        response = insertTop(filename, item);
                    }
                    else {
                        response = PartialInsert(filename, item, header.sFilter);
                    }
                    if (response.success == "true") {
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject('Can not be Inserted.');
                    }
                }
                return deferred.promise;
            }
            var insertTop = function (filename, item) {
                var returnedCount = 0;
                var list = [];
                list = angular.fromJson(localStorage[filename]);
                var idx = -1;
                if (typeof list == "undefined" || list == null || list.length == 0) {
                    list = [];
                    idx = -1;
                }
                else {
                    idx = Math.max.apply(Math, list.map(function (o) {
                        return o.id;
                    }));
                    if (isNaN(idx + 1)) {
                        idx = -1;
                    }
                }

                if (item.constructor == Array) {
                    returnedCount = item.length;
                    for (var i = 0; i < item.length; i++) {
                        item[i]._rowID = guid();
                        item[i].id = ++idx;
                        list.push(item[i]);
                    }
                }
                else {
                    returnedCount = 1;
                    item._rowID = guid();
                    item.id = ++idx;
                    list.push(item);
                }

                localStorage[filename] = angular.toJson(list);
                var response = new responseObject();
                response.success = "true";
                response.data["Received Rows Count"] = returnedCount;
                response.data["Succeeded Rows Count"] = returnedCount;
                response.data["Failed Rows Count"] = 0;
                if (item.constructor != Array) {
                    var tempArr = [];
                    tempArr.push(item._rowID);
                    item = tempArr;
                }
                response.data["_rowID(s)"] = [];
                for (var r = 0; r < item.length; r++) {
                    response.data["_rowID(s)"].push(item[r]._rowID);
                }
                response.data["_rowID(s)"] = response.data["_rowID(s)"].toString()
                return response;
            }
            var PartialInsert = function (filename, item, filter) {
                var response = new responseObject();
                if (!item) throw "Missing the object to be inserted.";
                var list = [];
                //getting root DB      

                /**********************************************************
                 * cropping filename                                       *
                 *                                                        *
                 **********************************************************/
                filename = filename.split('.')[0];
                list = angular.fromJson(localStorage[filename]);
                if (list == undefined || list.length == 0) {
                    list = [];
                    //list = giveIDsAndPush(list, item)
                }




                //filtering 
                var SelectedObject = {};
                var CropedObject = {};
                var SelectedArray = list;
                var keyList = [];
                var tempIdx;
                var stack = [];
                for (var property in filter) {
                    if (filter.hasOwnProperty(property)) {
                        if (typeof (filter[property]) !== "object") {
                            tempIdx = findIndex(SelectedArray, property, filter[property]);;
                            if (tempIdx == -1) {
                                console.log('Err: Not found Row ' + JSON.stringify(filter));
                                return -1; // not existing property error
                            }
                            else {
                                keyList.push(tempIdx);
                                CropedObject = SelectedArray[tempIdx];
                                stack.push(CropedObject)
                                delete filter[property];
                            }
                        }
                        else { //nested level exist 
                            if (!isEmpty(filter[property])) {
                                keyList.push(property);
                                SelectedArray = CropedObject[property];
                                stack.push(SelectedArray);
                                delete filter[property];
                                //first idx then keys
                                continue;
                            }
                            else { //target level: here should add our object
                                keyList.push(property);
                                SelectedArray = CropedObject[property];
                                var FormatedIDsData = giveIDsAndPush(SelectedArray, item);
                                SelectedArray = FormatedIDsData[0];
                                stack.push(SelectedArray);
                                var temp;
                                for (var i = keyList.length - 1; i > 0; i--) {
                                    temp = stack.pop();
                                    stack[stack.length - 1][keyList[i]] = temp;
                                }
                                list[keyList[0]] = stack.pop();
                                localStorage.setItem(filename, angular.toJson(list));

                                var response = new responseObject();
                                response.success = "true";
                                response.data["Received Rows Count"] = item.length;
                                response.data["Succeeded Rows Count"] = item.length;
                                response.data["Failed Rows Count"] = 0;
                                response.data["_rowID(s)"] = FormatedIDsData[1].toString();
                                return response;
                            }
                        }
                    }
                }
            }



            var update = function (filename, item, header) {
                var deferred = $q.defer();
                var response;
                if (item == undefined || item == {} || item == []) {
                    deferred.reject('No data to be updated.');
                }
                else {
                    if (header == undefined || header == {} || header == null || header.sFilter == undefined) {
                        deferred.reject('Not existing Filter.');
                    }
                    else {
                        response = PartialUpdate(filename, item, header.sFilter);
                    }
                    if (response.success == "true") {
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject('Can not be updated.');
                    }
                }
                return deferred.promise;
            }
            var updateTop = function (filename, item, id) {
                var list = [];
                if (localStorage[filename]) {
                    list = angular.fromJson(localStorage[filename]);
                    var idx = findIndex(list, "id", id);
                    if (idx != -1) {
                        list[idx] = item;
                        localStorage[filename] = angular.toJson(list);
                    }
                }
            }
            var PartialUpdate = function (filename, item, filter) {
                var response = new responseObject();
                if (!item) {
                    throw "Missing update Object parameter";
                    return;
                }
                var list = [];
                ////getting root DB
                if (localStorage[filename]) {
                    list = angular.fromJson(localStorage[filename]);
                    if (list == undefined) {
                        throw "Inaccurate filename";
                        return;
                    }
                }

                list = Parse4Insert(list, filter, item);
                localStorage.setItem(filename, angular.toJson(list));
                response.success = "true";
                response.data["Received Rows Count"] = 1;
                response.data["Succeeded Rows Count"] = 1;
                response.data["Failed Rows Count"] = 0;
                return response;
            }

            var remove = function (filename, data, header) {
                var deferred = $q.defer();

                var response;
                if (header == undefined || header == null) {
                    deferred.reject('No specific Data.');
                }
                else if (typeof (header) == 'object' && header.sFilter == undefined) {
                    response = deleteTop(filename, header);
                }
                else if (typeof (header) == 'object' && typeof (header.sFilter) == 'object') {
                    response = PartialDelete(filename, header.sFilter);
                }
                if (response.success == "true") {
                    deferred.resolve(response);
                }
                else {
                    deferred.reject('Cannot delete.');
                }
                return deferred.promise;
            }

            var deleteTop = function (filename, filter) {
                var response = new responseObject();

                var list = angular.fromJson(localStorage[filename]);
                var idx = findIndexsFilArr(list, "_rowID", filter["sRowIDs"].split(','));
                var countChanged = list.length;
                if (idx != []) {
                    for (var i = idx.length - 1; i >= 0; i--) {
                        list.splice(idx[i], 1);
                    }

                    if (list.length == 0) {
                        list = [];
                    }
                    localStorage[filename] = angular.toJson(list);
                    countChanged -= list.length;
                    response.success = "true";
                    response.data["Received Rows Count"] = idx.length;
                    response.data["Succeeded Rows Count"] = countChanged;;
                    response.data["Failed Rows Count"] = Math.abs(idx.length - countChanged);
                    return response;
                }
                response.success = "true";
                response.data["Received Rows Count"] = idx.length;
                response.data["Succeeded Rows Count"] = 0;
                response.data["Failed Rows Count"] = idx.length;
                return response;
            }
            var PartialDelete = function (filename, filter) {
                var response = new responseObject();

                var list = [];
                list = angular.fromJson(localStorage[filename]);
                if (list == undefined || list == null || list == []) {
                    response.success = "false";
                    response.data = [];
                    return response;
                }
                var count = list.length;
                list = Parse4Delete(list, filter);
                count -= list.length;
                localStorage.setItem(filename, angular.toJson(list));
                response.success = "true";
                response.data["Received Rows Count"] = count;
                response.data["Succeeded Rows Count"] = count;
                response.data["Failed Rows Count"] = 0;
                return response;
            }


            var select = function (filename, item, header) {
                var deferred = $q.defer();

                var response;
                if (header == undefined || header == {} || header == null || header.sFilter == undefined) {
                    response = selectTop(filename);
                }
                else {
                    response = FilteredSelect(filename, header.sFilter);
                }
                if (response.success == "true") {
                    deferred.resolve(response);
                }
                else {
                    deferred.reject('No Available Data.');
                }
                return deferred.promise;
            }
            var selectTop = function (filename) {
                var list = [];
                var response = new responseObject();
                if (localStorage[filename]) {
                    list = angular.fromJson(localStorage[filename]);
                    response.success = "true";
                    response.data = list;
                    return response;
                }
                else { //note found local storage
                    response.success = "true";
                    response.data = [];
                    return response;

                }
            }
            var selectItem = function (filename, id) {
                var list = this.select(filename);
                var idx = findIndex(list, "id", id);
                if (idx != -1) {
                    return list[idx];
                }
                else {
                    return {};
                }

            }
            var FilteredSelect = function (filename, filter) {
                var response = new responseObject();
                var list = [];
                //getting root DB
                list = angular.fromJson(localStorage[filename]);
                if (list == undefined || list == null || list == []) {
                    response.success = "true";
                    response.data = [];
                    return response;
                }
                list = angular.fromJson(localStorage[filename]);
                list = ParseObject(list, filter);
                response.success = "true";
                response.data = list;
                return response;
            }

            var PartialUpdateDot = function (filename, filter, item) {
                var returnedIdx = -1;
                if (!item) return returnedIdx;
                var list = [];
                //getting root DB
                if (localStorage[filename]) {
                    list = angular.fromJson(localStorage[filename]);
                    if (list == undefined) {
                        list = [];
                    }
                }
                //filtering 
                var SelectedObject = {};
                var CropedObject = {};
                var SelectedArray = list;
                var keyList = [];
                var stack = [];
                var filterDotList = [];
                var tempIdx = -1;
                for (var property in filter) {
                    if (filter.hasOwnProperty(property)) {
                        filterDotList = [];
                        filterDotList = property.split(".");
                        var idxFilter = 0;
                        if (filterDotList.length > 1) {
                            SelectedArray = CropedObject[filterDotList[idxFilter]];
                            keyList.push(filterDotList[idxFilter]);
                            stack.push(SelectedArray)
                            idxFilter++;
                        }
                        tempIdx = findIndex(SelectedArray, filterDotList[idxFilter], filter[property]);
                        if (tempIdx == -1) { //Not existing id
                            console.log('Not found property Err:' + JSON.stringify(filter));
                            return -1; // not existing property error
                        }
                        else { //  existing id>> Then crop object
                            CropedObject = SelectedArray[tempIdx];
                            stack.push(CropedObject)
                            keyList.push(tempIdx);
                        }
                    }
                }
                //keyList.push(property);
                //SelectedArray = CropedObject[property];
                stack.pop();
                stack.push(item)
                var temp = item;
                var i;
                for (i = keyList.length - 1; i > 0; i--) {
                    temp = stack.pop();
                    stack[stack.length - 1][keyList[i]] = temp;
                }
                list[keyList[i]] = stack.pop();
                //return returnedIdx;
                localStorage.setItem(filename, angular.toJson(list));
            }
            var PartialDeleteOld = function (filename, filter) {
                var list = [];
                var returnedIdx = -1;
                if (!item) return returnedIdx;
                var list = [];
                //getting root DB
                if (localStorage[filename]) {
                    list = angular.fromJson(localStorage[filename]);
                    if (list == undefined) {
                        list = [];
                        item.id = list.length;
                    }
                }
                //filtering 
                //var filter = { "id": 0, "Pockets": {} };
                var CropedObject = {};
                var SelectedArray = list;
                var keyList = [];
                var tempIdx;
                var stack = [];
                for (var property in filter) {
                    if (filter.hasOwnProperty(property)) {
                        if (typeof (filter[property]) !== "object") {
                            if (findIndex(SelectedArray, property, filter[property]) == -1) {
                                console.log('Not found property Err:' + JSON.stringify(filter));
                                return returnedIdx; // not existing property error
                            }
                            tempIdx = findIndex(SelectedArray, property, filter[property]);
                            CropedObject = SelectedArray[tempIdx];
                            keyList.push(tempIdx);
                            stack.push(CropedObject)
                        }
                        else { //nested level exist 
                            if (!isEmpty(filter[property])) {
                                keyList.push(property);
                                filter = filter[property];
                                SelectedArray = CropedObject[property];
                                stack.push(SelectedArray)
                                //first idx then keys
                                continue;
                            }
                            else { //target level: here should add our object
                                keyList.push(property);
                                SelectedArray = CropedObject[property];
                                SelectedArray.push(item);
                                stack.push(SelectedArray);
                                var temp;
                                for (var i = keyList.length - 1; i > 0; i--) {
                                    temp = stack.pop();
                                    stack[stack.length - 1][keyList[i]] = temp;
                                }
                                list[keyList[0]] = stack.pop();
                                localStorage.setItem(filename, angular.toJson(list));
                            }
                        }
                    }
                }
            }
            var ParseObject = function (SelectedArray, filter) {
                var CropedObject = [];
                var tempIdx = [];
                var TempFeedBack = [];
                for (var property in filter) {
                    if (filter.hasOwnProperty(property)) {
                        if (typeof (filter[property]) !== "object") {
                            tempIdx = findIndexs(SelectedArray, property, filter[property]);
                            if (tempIdx.length == 0) {
                                //console.log('Not found property Err:' + JSON.stringify(filter));
                                return []; // not existing property error
                            }
                            else {
                                for (var i = 0; i < tempIdx.length; i++) {
                                    CropedObject.push(SelectedArray[tempIdx[i]]);
                                }
                                SelectedArray = CropedObject;
                                CropedObject = [];
                                delete filter[property];
                            }
                        }
                        else { //nested level exist
                            var newfil = JSON.stringify(filter[property]);
                            var TempFeedBack = [];
                            var arr = [];
                            for (var i = 0; i < tempIdx.length; i++) {
                                var arr = ParseObject(SelectedArray[i][property], JSON.parse(newfil))
                                for (var j = 0; j < arr.length; j++) {
                                    TempFeedBack.push(arr[j]);
                                }
                            }
                            SelectedArray = TempFeedBack;
                            delete filter[property];
                        }
                    }
                }
                return SelectedArray;
            }
            var Parse4Insert = function (SelectedArray, filter, item) {
                var CropedObject = [];
                var tempIdx = [];
                var TempFeedBack = [];
                var keyList = [];
                for (var property in filter) {
                    if (filter.hasOwnProperty(property)) {
                        if (typeof (filter[property]) !== "object") {
                            tempIdx = findIndexs(SelectedArray, property, filter[property]);
                            if (tempIdx.length == 0) {
                                console.log('Not found property Err:' + JSON.stringify(filter));
                                return []; // not existing property error
                            }
                            else {
                                for (var i = 0; i < tempIdx.length; i++) {
                                    CropedObject.push(SelectedArray[tempIdx[i]]);
                                    keyList.push(property);
                                }
                                delete filter[property];
                            }
                        }
                        else { //nested level exist
                            var newfil = JSON.stringify(filter[property]);
                            var TempFeedBack = [];
                            TempFeedBack = CropedObject;
                            var arr = [];
                            for (var i = 0; i < tempIdx.length; i++) {
                                SelectedArray[tempIdx[i]][property] = Parse4Insert(CropedObject[i][property], JSON.parse(newfil), item)
                            }
                        }
                    }
                }
                var count = CropedObject.length;
                if (isEmpty(filter)) {
                    for (var i = 0; i < CropedObject.length; i++) {
                        for (var property in item[0]) {
                            if (item[0].hasOwnProperty(property)) {
                                SelectedArray[tempIdx[i]][property] = item[0][property];
                            }
                        }
                    }
                }

                return SelectedArray;
            }
            var Parse4Delete = function (SelectedArray, filter) {
                var CropedObject = [];
                var tempIdx = [];
                var TempFeedBack = [];
                var keyList = [];
                for (var property in filter) {
                    if (filter.hasOwnProperty(property)) {
                        if (typeof (filter[property]) !== "object") {
                            tempIdx = findIndexs(SelectedArray, property, filter[property]);
                            if (tempIdx.length == 0) {
                                console.log('Not found property Err:' + JSON.stringify(filter));
                                return []; // not existing property error
                            }
                            else {
                                for (var i = 0; i < tempIdx.length; i++) {
                                    CropedObject.push(SelectedArray[tempIdx[i]]);
                                    keyList.push(property);
                                }
                                delete filter[property];
                            }
                        }
                        else { //nested level exist
                            var newfil = JSON.stringify(filter[property]);
                            var arr = [];
                            for (var i = 0; i < tempIdx.length; i++) {
                                arr = Parse4Delete(CropedObject[i][property], JSON.parse(newfil))
                                if (arr == []) {
                                    SelectedArray[tempIdx[i]][property] = "";
                                }
                                else {
                                    SelectedArray[tempIdx[i]][property] = arr;
                                }
                            }
                        }
                    }
                }
                //var be4DeleteArr = SelectedArray;

                if (isEmpty(filter)) {
                    _rowIDs = [];
                    for (var i = tempIdx.length - 1; i >= 0; i--) {
                        _rowIDs.push(SelectedArray[tempIdx[i]]._rowID);
                        SelectedArray.splice(tempIdx[i], 1);
                    }
                }
                return SelectedArray;
            }
            var _rowIDs = [];
            var toArray = function (filter) {
                const result = [];
                for (var prop in filter) {
                    var value = filter[prop];
                    if (typeof value === 'object') {
                        result.push(toArray(value)); // <- recursive call
                    }
                    else {
                        result.push([prop, value]);
                    }
                }
                return result;
            }
            var findIndex = function (array, attr, value) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i][attr] == value) {
                        return i;
                    }
                }
                return -1;
            }
            var findIndexs = function (array, attr, value) {
                var idxs = [];
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i][attr] == value) {
                        idxs.push(i);
                    }
                }
                return idxs;
            }
            var findIndexsFilArr = function (array, attr, value) {
                var idxs = [];
                for (var i = 0; i < array.length; i += 1) {
                    for (var j = 0; j < value.length; j += 1) {
                        if (array[i][attr] == value[j]) {
                            idxs.push(i);
                        }
                    }
                }
                return idxs;
            }
            var isEmpty = function (obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) return false;
                }
                return JSON.stringify(obj) === JSON.stringify({});
            }

            return {
                'insert': insert,
                'select': select
                , 'update': update
                , 'delete': remove
            }
        }])
}());