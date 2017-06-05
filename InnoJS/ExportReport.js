
//Export Repors using Rest..
function Glob_ReportExcelExport_Rest(arr, title, templateFileName, repType, arrHeader, pdfRowsPerPageCount) {

    if (arr.length == 0) {
        return;
    }

    var tempArr = [];
    for (var x = 0; x < arr.length; x++) {
        tempArr[x] = arr[x].slice();
    }
    var ObjContentData = {
        'sType': 'xls', 'sTitle': title,
        'lstData': tempArr,
        'iExcelTemplateCellNo': tempArr[0].length
    };

    if (repType != undefined) {
        ObjContentData["sType"] = repType;
    }
    var arrHeaderTemp = new Array();

    if (arrHeader != undefined) {
        var arrHeaderTemp__ = arrHeader.slice();
        if (Object.prototype.toString.call(arrHeader[0]) != '[object Array]') {
            arrHeaderTemp[0] = arrHeaderTemp__;
        }
        else {
            arrHeaderTemp = arrHeaderTemp__;
        }
        if (repType == "pdf") {
            for (var i = 0; i < arrHeaderTemp.length; i++) {
                arrHeaderTemp[i].reverse();
            }
        }

        ObjContentData["lstHeader"] = arrHeaderTemp;
        ObjContentData["sExcelTemplatePath"] = '';
    }
    else {
        ObjContentData["sExcelTemplatePath"] = templateFileName;
    }

    if (pdfRowsPerPageCount == undefined) {
        ObjContentData["iPageCount"] = 20;
    }
    else {
        ObjContentData["iPageCount"] = pdfRowsPerPageCount;
    }

    if (ObjContentData["sType"] == "pdf") {
        //arrHeaderTemp.reverse();
        for (var i = 0; i < tempArr.length; i++) {
            tempArr[i].reverse();
        }
    }

    var find = '/';
    var re = new RegExp(find, 'g');
    ObjContentData["sTitle"] = ObjContentData["sTitle"].replace(re, '-')

    if (ObjContentData["sType"] == "pdf") {
        ObjContentData["sLogo"] = $(".logo-container img").prop('src');
        Glob_ReportExcelExport_Rest_Do(ObjContentData);
    }
    else {
        Glob_ReportExcelExport_Rest_Do(ObjContentData);
    }
}

function Glob_ReportExcelExport_Rest_Do(ObjContentData) {
    var lineItems = new Array();
    lineItems[0] = new Object(ObjContentData);

    ShowLoading();
    $.ajax({
        type: 'POST',
        url: 'http://innocollect.innodevelopment.org/Report',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(lineItems),
        dataType: 'text',
        accept: 'application/json charset=utf-8'
    }).done(function (result) {
        HideLoading();
        result = JSON.parse(result);
        if (result.success == "true") {
            var url = result.data;
            
            var fileURL =url.replace("../", "");
            fileURL = "http://innocollect.innodevelopment.org/" + fileURL;
            var filename = url.substring(url.lastIndexOf('/')+1);
            SaveToDisk(fileURL, filename)    
        }
        else {
            GlobalOnFailFunction(result);
        }
    }).error(function (jqXHR, textStatus, errorThrown) {
        //PopUpNotify(0, jqXHR.responseText || textStatus);
    });
}
function SaveToDisk(fileURL, fileName) {
    // for non-IE
    if (!window.ActiveXObject) {
        var save = document.createElement('a');
        save.href = fileURL;
        save.target = '_blank';
        save.download = fileName || fileURL;
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
            false, false, false, false, 0, null);
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    }

        // for IE
    else if (!!window.ActiveXObject && document.execCommand) {
        var _window = window.open(fileURL, "_blank");
        //_window.document.close();
        _window.document.execCommand('SaveAs', true, fileName || fileURL)
        _window.close();
    }
}
function Glob_ReportExcelExport_Rest_FromHTMLIDs(title, headerID, boodyID, repType, pdfRowsPerPageCount) {
    var headerArr = Glob_Common_HTMLTableToArray(headerID, "th");
    var dataArr = Glob_Common_HTMLTableToArrayBoody(boodyID, "td");
    Glob_ReportExcelExport_Rest(dataArr, title, "", repType, headerArr, pdfRowsPerPageCount);
}

function Glob_Common_HTMLTableToArrayBoody(elementId, subElement) {
    var myTableArray = [];
    var tbodyRows = $("tbody#" + elementId).find('tr');
    tbodyRows.each(function () {
        var arrayOfThisRow = [];
        var tableData = $(this).find(subElement);
        if (tableData.length > 0) {
            tableData.each(function () {
                var sValue = $(this).text();
                var sTd_ID = $(this).context.id;
                if (sTd_ID != "Process") {
                    var colspanVal = $(this).attr("colspan");
                    if (colspanVal != undefined) {
                        sValue += "^^^" + colspanVal;//to send col span to the server to view it..
                    }
                    arrayOfThisRow.push(sValue);
                }
            });
            myTableArray.push(arrayOfThisRow);
        }
    });

    return myTableArray;
}

function Glob_Common_HTMLTableToArray(elementId, subElement) {
    var myTableArray = [];
    $("#" + elementId + " tr").each(function () {
        var arrayOfThisRow = [];
        var tableData = $(this).find(subElement);
        if (tableData.length > 0) {
            tableData.each(function () {
                var sValue = $(this).text();
                var sTd_ID = $(this).context.id;
                if (sTd_ID != "Process") {
                    var colspanVal = $(this).attr("colspan");

                    if (colspanVal != undefined) {
                        sValue += "^^^" + colspanVal;//to send col span to the server to view it..
                    }
                    arrayOfThisRow.push(sValue);
                }
            });
            myTableArray.push(arrayOfThisRow);
        }
    });

    return myTableArray;
}

