function OpenModal(htmlContent,preventEsc) {
    $('#divModal').remove();
    var content = '<div class="modal fade" id="divModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div id="divModalContent" class="modal-content">';
    content += htmlContent;
    content += '</div></div></div>';
    if (preventEsc != undefined && preventEsc==true) {
        $(content).modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });
    } else {
        $(content).modal('show');
    }
  
    setTimeout('AddValidations("divModal");', 500);
    setTimeout('ApplyDraggable("divModal");', 500);
}
function ApplyDraggable(divID) {
    $("#" + divID).draggable({
        handle: ".modal-header",
        cursor: "move"
    });

}
function CloseModel() {
    $('#divModal').modal('toggle');
    $('#divModal').remove();
}

function OpenModal2(htmlContent, preventEsc) {
    $('#divModal2').remove();
    var content = '<div class="modal fade" id="divModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div id="divModalContent" class="modal-content">';
    content += htmlContent;
    content += '</div></div></div>';
    if (preventEsc != undefined && preventEsc == true) {
        $(content).modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });
    } else {
        $(content).modal('show');
    }
    setTimeout('AddValidations("divModal2");', 500);
    setTimeout('ApplyDraggable("divModal2");', 500);
}
function CloseModel2() {
    $('#divModal2').modal('toggle');
    $('#divModal2').remove();
}


function ShowSuccessMessage(title, message, isHTML, preventEsc) {
    $('#modelSuccessMessage').remove();
    var htmlContent = '';
    htmlContent += '<div class="modal" id="modelSuccessMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    htmlContent += '<div class="modal-dialog "><div class="modal-content success" id="divSuccessMessage">';
    htmlContent += '<div class="modal-body">';
    htmlContent += '<div class="modal-wrapper">';
    htmlContent += '<div class="modal-icon"><i class="fa fa-check"></i></div>';
    htmlContent += '<div class="modal-text">';
    if (isHTML == undefined || !isHTML) {
        htmlContent += '<h4>' + message + '</h4>';
    } else {
        htmlContent += message;
    }
    htmlContent += '</div></div></div>';
    htmlContent += '</div></div></div>';
    if (preventEsc != undefined && preventEsc == true) {
        $(htmlContent).modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });
    } else {
        $(htmlContent).modal('show');
    }
    setTimeout("CloseSuccessMessage()", 2000);
}

function CloseSuccessMessage() {
    $('#modelSuccessMessage').modal('toggle');
    $('#modelSuccessMessage').remove();
}

function ShowFailureMessage(title, message, isHTML, preventEsc) {
    $('#modalFailureMessage').remove();
    var htmlContent = '';
    htmlContent += '<div class="modal" id="modalFailureMessage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    htmlContent += '<div class="modal-dialog "><div class="modal-content error" id="divFailureMessage">';
    htmlContent += '<div class="modal-body">';
    htmlContent += '<div class="modal-wrapper">';
    htmlContent += '<div class="modal-icon"><i class="fa fa-times-circle"></i></div>';
    htmlContent += '<div class="modal-text">';
    if (isHTML == undefined || !isHTML) {
        htmlContent += '<h4>' + message + '</h4>';
    } else {
        htmlContent += message;
    }
    htmlContent += '</div></div></div>';
    if (localStorage.lang == 'ar')
        htmlContent += '<div class="modal-footer"><button type="button" class="btn btn-warning" onclick="CloseFailureMessage()">إغلاق</button></div>';
    else
        htmlContent += '<div class="modal-footer"><button type="button" class="btn btn-warning" onclick="CloseFailureMessage()">Close</button></div>';
    htmlContent += '</div></div></div>';
    if (preventEsc != undefined && preventEsc == true) {
        $(htmlContent).modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });
    } else {
        $(htmlContent).modal('show');
    }

}

function CloseFailureMessage() {
    $('#modalFailureMessage').modal('toggle');
    $('#modalFailureMessage').remove();
}
function ShowLoading(preventEsc) {
    $('#divModuleLoading').remove();
    var htmlContent = '';
    htmlContent += '<div class="modal" id="divModuleLoading" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
    htmlContent += '<div class="modal-dialog"><div class="modal-content progressbar"><div class="modal-body"><div class="modal-wrapper">';
    htmlContent += '<div class="col-md-2"></div>';
    htmlContent += '<div class="progress progress-striped light active col-md-8">';
    htmlContent += '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div>';
    htmlContent += '</div><div class="col-md-2"></div></div></div></div></div></div>';
    if (preventEsc != undefined && preventEsc == true) {
        $(htmlContent).modal({
            show: true,
            keyboard: false,
            backdrop: 'static'
        });
    } else {
        $(htmlContent).modal('show');
    }
}

function HideLoading() {
    $('#divModuleLoading').modal('toggle');
    $('#divModuleLoading').remove();
}