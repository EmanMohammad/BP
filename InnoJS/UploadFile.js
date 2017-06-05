var CloudServiceUri = "http://innocollect.innodevelopment.org/File";
var progressbar;
var progressbarLabel;
var UploadFileName = "";
var arrFileBuffer = new Array();
var arrFileBufferIndex = 0;
var maxBufferSize = 100000;

function StartFileUpload(input, name, CallbackFunction, bufferSize) {
    if (bufferSize != undefined && bufferSize < maxBufferSize) {
        maxBufferSize = bufferSize;
    }
    OpenUploaderPopup();
    StartFileUploadDo(input, name, function () { CloseUploaderPopup(); CallbackFunction() });
}

function OpenUploaderPopup() {
    $('#modelFileUploader').remove();
    var htmlContent = '';
    htmlContent += '<div class="modal" id="modelFileUploader" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    htmlContent += '<div class="modal-dialog"><div class="modal-content progressbar" ><div class="modal-body" style="height:120px"><div class="modal-wrapper">';
    htmlContent += '<div class="modal-text">';
    if (localStorage.lang == 'ar') {
        htmlContent += '<h4>The file is being uploaded, Please wait!</h4>';
    } else {
        htmlContent += '<h4> جاري رفع المرفقات من فضلك انتظر!</h4>';

    }
    htmlContent += '<div style="clear:both"></div>'
    htmlContent += '<div class="col-md-2"></div>'

    htmlContent += '<div class="progress progress-striped light active col-md-8">';
    htmlContent += '<div id="fileUploaderProgress"><div class="progress-label"></div></div>';
    htmlContent += '</div>';
    htmlContent += '<div class="col-md-2"></div>'
    htmlContent += '</div></div></div></div></div></div>';
    $(htmlContent).modal('show');
    progressbar = $("#fileUploaderProgress");
    progressbarLabel = $("#fileUploaderProgress .progress-label");

    // setTimeout("progress()", 2000);
}

function CloseUploaderPopup() {
    $('#modelFileUploader').modal('toggle');
    $('#modelFileUploader').remove();
}

function StartFileUploadDo(input, name, CallbackFunction) {
    arrFileBufferIndex = 0;
    UploadFileName = name;
    arrFileBuffer = new Array();
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result.split(",")[1];
            var filelength = data.length - 1;
            if (filelength / maxBufferSize > 1) {
                for (var i = 0; i <= (filelength / maxBufferSize) ; i++) {
                    var start = i * maxBufferSize;       //  :  0       ,   1000     ,    2000        
                    var end = (start + maxBufferSize); //   : 0 + 1000 ,  1000+1000 , 2000 + 1000
                    arrFileBuffer[i] = data.substring(start, end);
                }
            }
            else {
                arrFileBuffer[0] = data;
            }

            $("#fileUploaderProgress").progressbar({
                value: false,
                change: function () {
                    progressbarLabel.text(progressbar.progressbar("value").toFixed(1) + "%");
                },
                complete: function () {

                }
            });

            UploadFile(function () { CallbackFunction() });

        }
        reader.readAsDataURL(input.files[0]);
    }
}


function UploadFile(CallbackFunction) {
    progressbar = $("#fileUploaderProgress");
    progressbarLabel = $("#fileUploaderProgress .progress-label");
    if (arrFileBufferIndex < arrFileBuffer.length) {
        if (arrFileBufferIndex == 0) {
            UploadFileBuffer(arrFileBuffer[arrFileBufferIndex], UploadFileName, 0, CallbackFunction); //delete if exist
        } else {
            UploadFileBuffer(arrFileBuffer[arrFileBufferIndex], UploadFileName, 1, CallbackFunction);
        }
    }
    else {
        if (localStorage.lang == 'ar') {
            progressbarLabel.text("تم الرفع");
        } else {
            progressbarLabel.text("Completed!");
        }
        arrFileBuffer = [];
        arrFileBufferIndex = 0;
        CallbackFunction();
    }
}


function UploadFileBuffer(data, name, encoded, CallbackFunction) {
    var ContentData = {
        sCompanyId:localStorage.CompanyID,
        sFileName: name,
        sFileContentBase64: data,
        bFileDataEncoded: true
    };
    ContentData = JSON.stringify(ContentData);
    var aJaxType = "POST";
    if (encoded != 0) {
        aJaxType = "PUT";
    }
    $.ajax({
        type: aJaxType,
        url: CloudServiceUri,
        data: ContentData,
        dataType: 'json',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "DreamNetLicense",
            "sCompLicense": "key=AIzaSyAPrtP2Tq4m5WVInCvCWptVAKPhQ4SQNZA",
            "SchemaVer": "2"
        },
        accept: 'application/json charset=utf-8',
    }).done(function (responseObject) {
        if (responseObject.success == "true") {
            progressbar = $("#fileUploaderProgress");
            progressbarLabel = $("#fileUploaderProgress .progress-label");
            var step = 100 / arrFileBuffer.length;
            var val = progressbar.progressbar("value") || 0;
            if (val < 100) {
                progressbar.progressbar("value", val + step);
            }
            arrFileBufferIndex++;
            UploadFile(CallbackFunction);
        } else {
            GlobalOnFailFunction(responseObject);
        }

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


function ShowAttachments(element, rowID, fileName) {
    if (fileName == "") {
        if (getParameterFromUrl("SkinLang") == 'Ar') {
            ShowFailureMessage(0, "لا توجد مرفقات");
        } else {
            ShowFailureMessage(0, "There is no file to display");
        }
    }
    else {
        element.href = "/Rep/Services/file/Repository/" + localStorage.CompanyID + "/" + fileName;
        element.target = "_blank";
        element.onclick = "function(){return false;}";
    }
}

function GetAttachmentsUrl(fileName) {
    if (fileName == "") {
        return "";
    }
    else {
        return "http://innocollect.innodevelopment.org/Rep/Services/file/Repository/" + localStorage.CompanyID + "/" + fileName;
    }
}


function DeleteAttachement(fileName, doNotShowResult) {

    var ContentData = {
        sCompanyId: localStorage.CompanyID,
        sFileName: fileName
    };
    ContentData = JSON.stringify(ContentData);
    $.ajax({
        type: "DELETE",
        url:CloudServiceUri,
        data: ContentData,
        dataType: 'json',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "DreamNetLicense",
            "sCompLicense": "key=AIzaSyAPrtP2Tq4m5WVInCvCWptVAKPhQ4SQNZA",
            "SchemaVer": "2"
        },
        accept: 'application/json charset=utf-8',
    }).done(function (responseObject) {
        if (doNotShowResult == undefined || doNotShowResult == false) {
            if (responseObject.success == "true") {
                if (localStorage.lang == 'ar') {
                    ShowSuccessMessage(1, "تم حذف الملف بنجاح.");
                } else {
                    ShowSuccessMessage(1, "File has been deleted successfully.");
                }
            } else {
                GlobalOnFailFunction(responseObject);
            }
        }

    }).error(function (jqXHR, textStatus, errorThrown) {
        if (doNotShowResult == undefined || doNotShowResult == false) {
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
        }
    });

}
