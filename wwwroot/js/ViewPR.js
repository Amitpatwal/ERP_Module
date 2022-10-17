$(document).ready(function () {
    /**/


    var now = new Date();
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " to " + dateStringWithTime;




    var condition = document.getElementById("condition").innerHTML;
    if (condition == "Check") {
        checkpendingApprovalItems();
        document.cookie = "redirctfrom=checkerPRView";
    }
    if (condition == "Create") {


        $.ajax({
            url: '/api/UserManagement/permissioncheck',
            type: 'GET',
            contentType: 'application/json',
            data: {
                formName: "PURCHASE_ITEM",
                operation: "VIEW",
            },
            success: function (data) {
                if (data.data.permission == true) {
                    document.getElementById('approveddiv').style.display = "block";
                } else {
                    document.getElementById('approveddiv').style.display = "none";
                }
            }
        });
        ApprovedItem();
        document.cookie = "redirctfrom=createrPRView";

        $.ajax({
            url: '/api/UserManagement/permissioncheck',
            type: 'GET',
            contentType: 'application/json',
            data: {
                formName: "PURCHASE_ITEM",
                operation: "CREATE",
            },
            success: function (data) {
                if (data.data.permission == true) {
                    document.getElementById('validation').style.display = "block";
                    document.getElementById('approveddiv').style.display = "block";
                    document.getElementById('rejecteddiv').style.display = "block";
                    document.getElementById('pendingdiv').style.display = "block";
                    document.getElementById('incompletediv').style.display = "block";
                   
                } else {
                    document.getElementById('validation').style.display = "none";
                    document.getElementById('approveddiv').style.display = "none";
                    document.getElementById('rejecteddiv').style.display = "none";
                    document.getElementById('pendingdiv').style.display = "none";
                    document.getElementById('incompletediv').style.display = "none";
                }
            }
        });



    }

});


function counter() {
    $.ajax({
        type: 'GET',
        url: "api/PR/counter",
        success: function (data) {
            if (data.success) {
                document.getElementById("approvedlabel").innerHTML = data.approved;
                document.getElementById("rejectedlabel").innerHTML = data.rejected;
                document.getElementById("pendinglabel").innerHTML = data.submitted;
                document.getElementById("incompletelabel").innerHTML = data.incomplete;
            }
        }
    });

}

function PendingApproved() {

    counter();

    document.getElementById("datewiseButton").style.display = "none";
    document.getElementById("approvalpending").style.display = "block";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("incompleteItems").style.display = "none";
    document.getElementById("approvedItem").style.display = "none";
    document.getElementById("TitleColor").style.backgroundColor = "#ffc107";
    document.getElementById("TitleID").innerHTML = "Pending Approval Items List"

    document.getElementById("addbutton").style.display = "none";

    dataTable = $("#approvalPendingTable").DataTable({
        ajax: {
            'url': '/api/PR/GetPRTableApprovalPending',
            'type': 'GET',
            'contentType': 'application/json'
        },
       
        columns: [
            {'data': 'prNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px',"visible": false},
            { 'data': 'prNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'prDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'userid', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'prNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=PurchaseItems?PRNO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function Rejecteditem() {

    counter();

    document.getElementById("datewiseButton").style.display ="none"
    document.getElementById("approvalpending").style.display = "none";
    document.getElementById("rejectedItems").style.display = "block";
    document.getElementById("incompleteItems").style.display = "none";
    document.getElementById("approvedItem").style.display = "none";
    document.getElementById("TitleColor").style.backgroundColor = "#dc3545";
    document.getElementById("TitleID").innerHTML = "Rejected Items List"
    document.getElementById("addbutton").style.display = "none";
    dataTable = $("#rejectedtable").DataTable({
        ajax: {
            'url': '/api/PR/GetPRTableRejected',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'prNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'prNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'prDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'reason', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'prNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=PurchaseItems?PRNO=${data}> <i class="fas fa-pencil-alt"></i>Edit</a>                        `;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function ApprovedItem() {
    counter();

    document.getElementById("datewiseButton").style.display = "block"

    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;


    document.getElementById("approvalpending").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("incompleteItems").style.display = "none";
    document.getElementById("approvedItem").style.display = "block";
    document.getElementById("TitleColor").style.backgroundColor = "#28a745";
    document.getElementById("TitleID").innerHTML = "Approved Items"
    document.getElementById("addbutton").style.display = "block";
   

    dataTable = $("#approvedTable").DataTable({
        ajax: {
            'url': '/api/PR/GetPRTableApproved',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                fromdate: fromdate,
                todate: todate,
            },
        },

        columns: [
            { 'data': 'prNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'prNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'prDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '8%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'prNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=PurchaseItems?PRNO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function IncompleteItems() {
    counter();
    document.getElementById("datewiseButton").style.display = "none";
    document.getElementById("approvalpending").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("approvedItem").style.display = "none";
    document.getElementById("incompleteItems").style.display = "block";

    document.getElementById("TitleColor").style.backgroundColor = "#dc3545";
    document.getElementById("TitleID").innerHTML = "Incomplete Items List"
    document.getElementById("addbutton").style.display = "none";

    dataTable = $("#icompletetable").DataTable({
        ajax: {
            'url': '/api/PR/GetPRTableIncomplete',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'prNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'prNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'prDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
          
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'userid', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'prNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=PurchaseItems?PRNO=${data}> <i class="fas fa-edit"> &nbsp</i>Edit</a>           

`;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function checkpendingApprovalItems() {
    counter();
    document.getElementById("datewiseButton").style.display = "none"
    document.getElementById("TitleColor").style.backgroundColor = "#ffc107";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("checkingApprovedItem").style.display = "none";
    document.getElementById("approvalItems").style.display = "block";

    document.getElementById("TitleID").innerHTML = "Pending Approval Items List"
    dataTable = $("#approvaltable").DataTable({
        ajax: {
            'url': '/api/PR/GetPRTableApprovalPending',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'prNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'prNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'prDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'userid', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'prNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=PurchaseItems?PrNO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function checkREjectedItems() {
    counter();
    document.getElementById("datewiseButton").style.display = "none"
    document.getElementById("TitleColor").style.backgroundColor = "#dc3545";
    document.getElementById("approvalItems").style.display = "none";
    document.getElementById("checkingApprovedItem").style.display = "none";
    document.getElementById("rejectedItems").style.display = "block";
    document.getElementById("TitleID").innerHTML = "Rejected Items"
    /*document.getElementById("btn").style.display = "none";*/
  
    dataTable = $("#checkrejectedTable").DataTable({
        ajax: {
            'url': '/api/PR/GetPRTableRejected',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'prNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'prNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'prDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'reason', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'prNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=PurchaseItems?PRnO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function checkApprovedItem() {

    document.getElementById("datewiseButton").style.display = "block"

    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;
    counter();

     document.getElementById("TitleColor").style.backgroundColor = "#28a745";
    document.getElementById("approvalItems").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("checkingApprovedItem").style.display = "block";
    document.getElementById("TitleID").innerHTML = "Approved Items"


        dataTable = $("#checkingApprovedTable").DataTable({
        ajax: {
            'url': '/api/PR/GetPRTableApproved',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                fromdate: fromdate,
                todate: todate,
            },
        },

        columns: [
            { 'data': 'prNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'prNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'prDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'prNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=PurchaseItems?PRNO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function finalSubmit() {
    var prno = document.getElementById("prnumber").value;
    var url = "api/PR/finalsubmit";
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            prno: prno
        },
        success: function (data) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            if (data.success == true) {
                Toast.fire({
                    icon: 'success',
                    title: 'Submitted saved'
                })
                document.getElementById('permanantbt').style.display = "none";
                document.getElementById('finalSubmit').style.display = "none";
            }
            else {
                Toast.fire({
                    icon: 'error',
                    title: data.message
                })
            }
        }
    })

}

function searchingReport() {
    var partynamecheck = document.getElementById("partynamecheck").checked;
    var PONO = document.getElementById("PONO").checked;
    var invoice = document.getElementById("invoice").checked;
    var heatno = document.getElementById("heatnoCheck").checked;
    var periodCheck = document.getElementById("periodcheck").checked;


    if (partynamecheck == true) {
        var searchtype = "PARTY";
    }
    else if (PONO == true) {
        var searchtype = "PONO";
    }
    else if (invoice == true) {
        var searchtype = "INVOICE";
    }
    else if (heatno == true) {
        var searchtype = "HEAT";
    }
    else {
        var searchtype = "PERIOD";
    }

    var frmdate = document.getElementById("fromdate").value;
    var todate = document.getElementById("todate").value;
    var searchValue = document.getElementById("SearchRecordInput").value;

    datatable = $("#checkingApprovedTable").DataTable({
        ajax: {
            'url': "api/PR/SearchPurchase1",
            'data': {
                searchtype: searchtype,
                searchValue: searchValue,
                frmdate: frmdate,
                todate: todate,
            },
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns: [
            { 'data': 'prNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'prNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'prDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'prNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=PurchaseItems?PRNO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '5%'
            },
        ],
        "language":
        {
            "emptyTable": "No data found, Please click on <b>Add New</b> Button"
        },
        dom: 'lfrtip',
        "bDestroy": true,
        "autoWidth": false,
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        fixedColumns: false,
        "bAutoWidth": false,
        "scrollX": false,
        "responsive": false,
    });
    datatable.on('order.dt ', function () {
        datatable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

}

function allData() {
    document.getElementById("datewiseButton").style.display = "block"
    counter();
    var datatable = "";
    var condition = document.getElementById("condition").innerHTML;
    if (condition == "Check") {
        document.getElementById("TitleColor").style.backgroundColor = "#28a745";
        document.getElementById("approvalItems").style.display = "none";
        document.getElementById("rejectedItems").style.display = "none";
        document.getElementById("checkingApprovedItem").style.display = "block";
        document.getElementById("TitleID").innerHTML = "Approved Items"
        datatable ="#checkingApprovedTable"
    }
    if (condition == "Create") {

        document.getElementById("approvalpending").style.display = "none";
        document.getElementById("rejectedItems").style.display = "none";
        document.getElementById("incompleteItems").style.display = "none";
        document.getElementById("approvedItem").style.display = "block";
        document.getElementById("TitleColor").style.backgroundColor = "#28a745";
        document.getElementById("TitleID").innerHTML = "Approved Items"
        document.getElementById("addbutton").style.display = "block";
        datatable = "#approvedTable"
    }
    dataTable = $(datatable).DataTable({
        ajax: {
            'url': '/api/PR/AllData',
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns: [
            { 'data': 'prNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'prNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'prDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'prNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=PurchaseItems?PRNO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}