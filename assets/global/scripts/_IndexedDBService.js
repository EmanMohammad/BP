function IndexedDBService()
{
    this.insert= function(filename, data)
    {
        var list = [];
        if (localStorage[filename]) {
            list=angular.fromJson(localStorage[filename]);
        }
        list.push(data);
        localStorage[filename] = angular.toJson(data);
        console.log(list);

    },
    this.select = function (filename) {
        var list = [];
        if (localStorage[filename]) {
            list = angular.fromJson(localStorage[filename]);
            console.log(list);
            return list
        }
    }
}