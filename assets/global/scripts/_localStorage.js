function LocalStorageService() {
    this.insert = function (filename, item) {
        var list = [];
        list = angular.fromJson(localStorage[filename]);
        if (typeof list == "undefined" || list==null) {
            list = angular.fromJson(localStorage[filename]);
     
            list = [];
            item.id = 0;
        }
        else {
            var idx = Math.max.apply(Math, list.map(function (o) {
                return o.id; 
            }));
            if (idx==-1) {
                item.id = 0;
            }
            else {
                item.id = 1 + idx;
            }
        }
        list.push(item);
        localStorage[filename] = angular.toJson(list);
    }, this.update = function (filename, item, id) {
        var list = [];
        if (localStorage[filename]) {
            list = angular.fromJson(localStorage[filename]);
            var idx = findIndex(list, "id", id);
            if (idx!=-1) {
            list[idx] = item;
            localStorage[filename] = angular.toJson(list);
            }
        }
    }, this.delete = function (filename, id) {
        var list = this.select(filename);
        var idx = findIndex(list, "id", id);
        if (idx != -1) {
            list.splice(idx, 1);
            if (list.length == 0)
            {
                localStorage.removeItem(filename);
            }
            else
            {
                localStorage[filename] = angular.toJson(list);
            }
        }
        return list;
    }, this.select = function (filename) {
        var list = [];
        if (localStorage[filename]) {
            list = angular.fromJson(localStorage[filename]);
            return list
        }
    }, this.selectItem = function (filename, id) {
        var list = this.select(filename);
        var idx = findIndex(list, "id", id);
        if (idx!=-1) {
            return list[idx];
        }
        else {
            return {};
        }

    }, this.PartialInsert = function (filename, filter, item) {
        if (!item) throw "Missing the object to be inserted.";
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
        var SelectedObject = {};
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
                    keyList.push(tempIdx);
                    CropedObject = SelectedArray[tempIdx];
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
                        if (SelectedArray) {
                            tempIdx = Math.max.apply(Math, SelectedArray.map(function (o) {
                                return o.id;
                            }));
                            if (isNaN(tempIdx)) {
                                returnedIdx = 0;
                            }
                            else {
                                returnedIdx = 1 + tempIdx;
                            }

                            if (item.constructor == Array) {

                                for (var i = 0; i < item.length; i++) {
                                    item[i].id = returnedIdx;
                                    returnedIdx++;
                                    SelectedArray.push(item[i]);
                                }
                            }
                            else {

                                item.id = returnedIdx;
                                SelectedArray.push(item);
                            }
                            
                        }
                        else {
                            returnedIdx = 0;
                            if (item.constructor == Array) {
                                for (var i = 0; i < item.length; i++) {
                                    item[i].id = returnedIdx;
                                    returnedIdx++;
                                    SelectedArray.push(item[i]);
                                }
                            }
                            else {
                                item.id = returnedIdx;
                                if (SelectedArray == undefined)
                                    SelectedArray = [];
                                SelectedArray.push(item);
                            }
                        }
                        stack.push(SelectedArray);
                        var temp;
                        for (var i = keyList.length - 1; i > 0; i--) {
                            temp = stack.pop();
                            stack[stack.length - 1][keyList[i]] = temp;
                        }
                        list[keyList[0]] = stack.pop();
                        localStorage.setItem(filename, angular.toJson(list));
                        return item.id;
                    }
                }
            }
        }
    }, this.PartialUpdateDot = function (filename, filter, item) {
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
                    return returnedIdx; // not existing property error
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
    }, this.PartialUpdate = function (filename, filter, item) {
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
    }, this.PartialDelete = function (filename, filter) {
        var list = [];
        ////getting root DB
        if (localStorage[filename]) {
            list = angular.fromJson(localStorage[filename]);
            if (list == undefined) {
                throw "Inaccurate filename";
                return;
            }
        }
        list = Parse4Delete(list, filter);
        localStorage.setItem(filename, angular.toJson(list));
    }, this.PartialDeleteOld = function (filename, filter) {
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
    }, this.FilteredSelect = function (filename, filter) {
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
        return ParseObject(list, filter);
    }, ParseObject = function (SelectedArray, filter) {
        var CropedObject = [];
        var tempIdx = [];
        var TempFeedBack = [];
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
                            TempFeedBack.push(arr[i]);
                        }
                    }
                    SelectedArray = TempFeedBack;
                }
            }
        }
        return SelectedArray;
    }, Parse4Insert = function (SelectedArray, filter, item) {
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
        if (isEmpty(filter)) {
            for (var i = 0; i < CropedObject.length; i++) {
                SelectedArray[tempIdx[i]] = item;
            }
        }
        return SelectedArray;
    }, Parse4Delete = function (SelectedArray, filter) {
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
                        return -1; // not existing property error
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
        if (isEmpty(filter)) {
            for (var i = 0; i < SelectedArray.length; i++) {
                SelectedArray.splice(tempIdx[i], 1);
            }
        }
        return SelectedArray;
    }, toArray = function (filter) {
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
    }, findIndex = function (array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] == value) {
                return i;
            }
        }
        return -1;
    }, findIndexs = function (array, attr, value) {
        var idxs = [];
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] == value) {
                idxs.push(i);
            }
        }
        return idxs;
    }, isEmpty = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) return false;
        }
        return JSON.stringify(obj) === JSON.stringify({});
    }
}