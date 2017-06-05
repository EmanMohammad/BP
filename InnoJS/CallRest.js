
function GlobalRestRequest(controlHTMLID,route, verb, querystring, header, data, OnSuccessCallBackFunction, OnFailCallBackFunction, doNotShowLoading,userName,password) {
    if ((doNotShowLoading == undefined || doNotShowLoading != true) && verb != "GET") {
        ShowLoading();
    }
    if (data == undefined) {
        data = [];
    }
    if (header == undefined) {
        header = {};
    }
    header["CompanyID"] = localStorage.CompanyID;
    header["CompanyLicense"] = localStorage.CompanyLicense;
	if(userName==undefined)
	header["sRequesterUserName"] = sessionStorage.CurrentUsername;
else
	header["sRequesterUserName"] =userName;
if(password==undefined)
    header["sRequesterPassword"] = sessionStorage.CurrentUserPassword ;
else	
	header["sRequesterPassword"] = password;
    header["sRequesterControlID"] = controlHTMLID;
	
    var url = MasterUrl + route;
    if (querystring != undefined && querystring != "") {
        url += "?" + $.param(querystring)
    }  
    for (var key in header) {
        if (header.hasOwnProperty(key)) {
            header[key] = encodeURIComponent(header[key]);
        }
    }
    $.ajax({
        type: verb,
        url: url,
        headers: header,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        dataType: 'text',
        accept: 'application/json charset=utf-8'
    }).done(function (ResultData) {
         if ((doNotShowLoading == undefined || doNotShowLoading != true) && verb != "GET") {
            HideLoading();
        }
        var responseObject = JSON.parse(ResultData);
        if (responseObject.success == "false" && responseObject.errorCode =="err-RequestTimeOut") {
            ShowTimeOutMessage(responseObject, OnSuccessCallBackFunction);
            return;
        }
        if (OnSuccessCallBackFunction != undefined) {
            OnSuccessCallBackFunction(responseObject);
        }
    }).error(function (jqXHR, textStatus, errorThrown) {
         if ((doNotShowLoading == undefined || doNotShowLoading != true) && verb != "GET") {
            HideLoading();
        }
        try {
			 if (jqXHR.status == "401") {
                if (window.location.pathname.split("/").pop().toLowerCase() == "dashboard.html") {
                    ShowFailureMessage("خطأ", "عفوا هذه العمليه غير مصرحه لك");
                    LogoutDo();
					return;
                }
            }
            var errorObject = JSON.parse(jqXHR.responseText);
            if (OnFailCallBackFunction != undefined) {
                OnFailCallBackFunction(errorObject);
            } else {
                GlobalOnFailFunction(errorObject);
            }
        }
        catch (e) {
            if (localStorage.lang == 'ar')
                ShowFailureMessage("خطأ", jqXHR.responseText || textStatus, true)
            else
                ShowFailureMessage("Error", jqXHR.responseText || textStatus, true)
        }
    });
}

function GlobalOnFailFunction(errorObject) {
    if (errorObject.message != undefined) {
        try {
            var errors = JSON.parse(errorObject.message);
            var htmlContent = "";
            for (var i = 0; i < errors.length; i++) {
                if (errors[i]["Error Type"] != undefined) {
                    htmlContent += '<p>';
                    if (localStorage.lang == 'ar')
                        htmlContent += 'نوع الخطأ:' + errors[i]["Error Type"];
                    else
                        htmlContent += 'Error Type:' + errors[i]["Error Type"];

                    htmlContent += '</p>';
                }
                if (errors[i]["AdditionalInfo"] != undefined) {
                    htmlContent += '<p>';
                    if (localStorage.lang == 'ar')
                        htmlContent += 'التفاصيل:' + errors[i]["AdditionalInfo"];
                    else
                        htmlContent += 'Details:' + errors[i]["AdditionalInfo"];

                    htmlContent += '</p>';
                }
            }
            if (htmlContent != "") {
                if (localStorage.lang == 'ar')
                    ShowFailureMessage("خطأ", htmlContent, true)
                else
                    ShowFailureMessage("Error", htmlContent, true)
            }
        }
        catch (e) {
            if (errorObject.message != "") {
                if (localStorage.lang == 'ar')
                    ShowFailureMessage("خطأ", errorObject.message == undefined ? "حدث خطأ ما. من فضلك حاول في وقت لاحق" : errorObject.message);
                else
                    ShowFailureMessage("Error", errorObject.message == undefined ? "Something went wrong. Please try again later." : errorObject.message);
            }
        }
    }
}
var TimeOutCallBackFunctions = {};
function ShowTimeOutMessage(responseObject, callBackFunction) {
    var requestID = responseObject.message;
    TimeOutCallBackFunctions[requestID] = callBackFunction;
    $('#divTimeOutLoading').remove();
    var htmlContent = '';
    htmlContent += '<div class="modal" id="divTimeOutLoading" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    htmlContent += '<div class="modal-dialog">';
    htmlContent += '<div class="modal-content progressbar" style="width: inherit;left: inherit;"><header class="modal-header"><h4 class="modal-title">';
    if (localStorage.lang == 'ar')
        htmlContent += 'نفذ الوقت';
    else
        htmlContent += 'Time Out';

    htmlContent += '</h4></header><div class="modal-body"><div class="modal-wrapper"><h4>';
    if (localStorage.lang == 'ar')
        htmlContent += 'يبدو ان طلبك إستغرق وقت أطول من اللازم في تنفيذه، من فضلك إنتظر...';
    else
        htmlContent += 'Your request seems to be taking to much time, please wait while its being processed';
    htmlContent += '</h4>';
    htmlContent += '<div class="col-md-2"></div><div class="progress progress-striped light active col-md-8"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div></div><div class="col-md-2"></div>';
    htmlContent += '<div style="clear:both"></div></div></div>';
    htmlContent += '<footer class="modal-footer text-right"><div class="row"><div class="col-md-12 text-right">';
    htmlContent += '<button class="btn btn-default modal-dismiss" onclick="CloseTimeOutMessage(\'' + requestID + '\')">';
    if (localStorage.lang == 'ar')
        htmlContent += 'إعتبره تم';
    else
        htmlContent += 'Consider it done';
    htmlContent += '</button></div></div></footer></div>';

    htmlContent += '</div></div></div>';
    $(htmlContent).modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
    GetRequestResponse(requestID, callBackFunction);
}
function CloseTimeOutMessage(requestID) {
    delete TimeOutCallBackFunctions[requestID];
    $("#divTimeOutLoading").modal('toggle');
    $('#divTimeOutLoading').remove();
}
function GetRequestResponse(requestID) {
    if (!TimeOutCallBackFunctions.hasOwnProperty(requestID)) {
        return;
    }
    var url = "/GetResponse";
    $.ajax({
        type: "GET",
        url: url,
        headers: { "sRequestID": requestID },
        contentType: 'application/json; charset=utf-8',
        dataType: 'text',
        accept: 'application/json charset=utf-8'
    }).done(function (ResultData) {
        var responseObject = JSON.parse(ResultData);
        if (responseObject.success == "false" && responseObject.errorCode == "err-RequestTimeOut") {
            setTimeout("GetRequestResponse('"+requestID+"')",500)
            return;
        }
        if (TimeOutCallBackFunctions[requestID] != undefined) {
            TimeOutCallBackFunctions[requestID](responseObject);
        }
        CloseTimeOutMessage(requestID);

    }).error(function (jqXHR, textStatus, errorThrown) {
       
        try {
            var errorObject = JSON.parse(jqXHR.responseText);
            if (OnFailCallBackFunction != undefined) {
                OnFailCallBackFunction(errorObject);
            } else {
                GlobalOnFailFunction(errorObject);
            }
        }
        catch (e) {
            if (localStorage.lang == 'ar')
                ShowFailureMessage("خطأ", jqXHR.responseText || textStatus, true)
            else
                ShowFailureMessage("Error", jqXHR.responseText || textStatus, true)
        }
    });
}
