$(document).ready(function () {
    var now = new Date();
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " to " + dateStringWithTime;
    var condition = document.getElementById("condition").innerHTML;
    if (condition == "Check") {
        checkpendingApprovalItems();
        document.cookie = "redirctfrom=checkerDOView";
    }
    if (condition == "Create") {
        $.ajax({
            url: '/api/UserManagement/permissioncheck',
            type: 'GET',
            contentType: 'application/json',
            data: {
                formName: "DESPATCH_ORDER",
                operation: "VIEW",
            },
            success: function (data) {
                if (data.data.permission == true) {
                    document.getElementById('approveddiv').style.display = "block";
                }
                else {
                    document.getElementById('approveddiv').style.display = "none";
                }
            }
        });
        document.cookie = "redirctfrom=createrDOView";
        ApprovedItem();
        $.ajax({
            url: '/api/UserManagement/permissioncheck',
            type: 'GET',
            contentType: 'application/json',
            data: {
                formName: "DESPATCH_ORDER",
                operation: "CREATE",
            },
            success: function (data) {
                if (data.data.permission == true) {
                    document.getElementById('despachtedDiv').style.display = "block";
                    document.getElementById('approveddiv').style.display = "block";
                    document.getElementById('rejecteddiv').style.display = "block";
                    document.getElementById('pendingdiv').style.display = "block";
                    document.getElementById('incompletediv').style.display = "block";
                    document.getElementById('pendingmaterialdiv').style.display = "block";

                } else {
                    document.getElementById('despachtedDiv').style.display = "none";
                    document.getElementById('approveddiv').style.display = "none";
                    document.getElementById('rejecteddiv').style.display = "none";
                    document.getElementById('pendingdiv').style.display = "none";
                    document.getElementById('incompletediv').style.display = "none";
                    document.getElementById('pendingmaterialdiv').style.display = "none";
                }
            }
        });


    }

});

function counter() {
    var now = new Date();
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    var ddate = dateStringWithTime;
    var ddate = moment(ddate).format('YYYY-MM-DDT00:00:00');
    $.ajax({
        type: 'GET',
        url: "api/DO/counter?edate=" + ddate,
        success: function (data) {
            if (data.success) {
                document.getElementById("approvedlabel").innerHTML = data.approved;
                document.getElementById("planninglist").innerHTML = data.pendingDO;
                document.getElementById("rejectedlabel").innerHTML = data.rejected;
                document.getElementById("pendinglabel").innerHTML = data.submitted;
                document.getElementById("incompletelabel").innerHTML = data.incomplete;
                document.getElementById("pendingM").innerHTML = data.pendingMaterials;
            }
        }
    });
}

function dispachtedPlanningList() {
    counter();
    document.getElementById("datewiseButton").style.display = "none"
    document.getElementById("approvalpending").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("approvedItem").style.display = "none";
    document.getElementById("incompleteItems").style.display = "none";
    document.getElementById("dispachtedList").style.display = "block";
    document.getElementById("TitleColor").style.backgroundColor = "#dc3545";
    document.getElementById("TitleID").innerHTML = "Dispachted Planning List"

    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "DESPATCH_ORDER",
            operation: "CREATE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                var now = new Date();
                var ddate = moment(now).format('YYYY-MM-DD');
                ddate = moment(ddate).format('YYYY-MM-DDT00:00:00');
                dataTable = $("#dispachtedTable").DataTable({
                    ajax: {
                        'url': '/api/DO/DispacthedPlanningTable?currentdate=' + ddate,
                        'type': 'GET',
                        'contentType': 'application/json'
                    },
                    columns: [
                        { 'data': 'dpNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px', },
                        { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                        { 'data': 'customerName', 'defaultContent': '-', 'width': '20%', 'font-size': '5px' },
                        { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
                        {
                            'data': 'dpNo', 'render': function (data, type, row) {
                                if (row.lostatus != null) {
                                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=redirectt("${data}")> <i class="fa fa-cart-arrow-down"> &nbsp;</i>Create D.O</a>
                                        <a class="btn btn-success btn-sm" style="color:white"  href=DOLoadingDetails?DPNO=${data}> <i class="fa fa-eye"> &nbsp;</i>View Loading Details</a>`;
                                } else {
                                    return `<a class="btn btn-info btn-sm" style="color:white"  onclick=redirectt("${data}")> <i class="fa fa-cart-arrow-down"> &nbsp;</i>Create D.O</a>
                                        <a class="btn btn-info btn-sm" style="color:white"  href=DOLoadingDetails?DPNO=${data}> <i class="fa fa-truck"> &nbsp;</i>Create Loading Details</a>`;
                                }

                            }, 'width': '10%'
                        },
                    ],
                    "font- size": '1em',
                    "bDestroy": true
                });
            } else {
                dataTable = $("#dispachtedTable").DataTable({
                    ajax: {
                        'url': '/api/DO/DispacthedPlanningTable',
                        'type': 'GET',
                        'contentType': 'application/json'
                    },

                    columns: [

                        { 'data': 'dpNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px', },
                        { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                        { 'data': 'customerName', 'defaultContent': '-', 'width': '20%', 'font-size': '5px' },
                        { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
                        {
                            'data': 'dpNo', 'render': function (data) {
                                return ``;
                            }, 'width': '10%'
                        },
                    ],
                    "font- size": '1em',
                    "bDestroy": true
                });
            }
        }
    });

}

function CheckdispachtedPlanningList() {
    counter();
    document.getElementById("planingList").style.display = "block";
    document.getElementById("datewiseButton").style.display = "none"


    document.getElementById("TitleColor").style.backgroundColor = "#dc3545";
    document.getElementById("TitleID").innerHTML = "Dispachted Planning List"


    dataTable = $("#dispachtedTable").DataTable({
        ajax: {
            'url': '/api/DO/DispacthedPlanningTable',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [

            { 'data': 'dpNo', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', },
            { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },

            {
                'data': 'dpNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white"  href=DispatchedOrder?DPNO=${data}> <i class="fa fa-cart-arrow-down"> &nbsp;</i>Create D.O</a>
                        `;
                }, 'width': '8%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}


function PendingApproved() {

    counter();
    document.getElementById("datewiseButton").style.display = "none"
    document.getElementById("approvalpending").style.display = "block";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("incompleteItems").style.display = "none";
    document.getElementById("approvedItem").style.display = "none";
    document.getElementById("dispachtedList").style.display = "none";
    document.getElementById("TitleColor").style.backgroundColor = "#ffc107";
    document.getElementById("TitleID").innerHTML = "Pending Approval D.O List"

    dataTable = $("#approvalPendingTable").DataTable({
        ajax: {
            'url': '/api/DO/GetPRTableApprovalPending',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'doNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'doNo', 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '5%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '15%', 'font-size': '6px' },
            { 'data': 'soNo', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            { 'data': 'userid', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'doNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '2%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function Rejecteditem() {

    counter();
    document.getElementById("datewiseButton").style.display = "none"
    document.getElementById("approvalpending").style.display = "none";
    document.getElementById("rejectedItems").style.display = "block";
    document.getElementById("incompleteItems").style.display = "none";
    document.getElementById("approvedItem").style.display = "none";
    document.getElementById("dispachtedList").style.display = "none";
    document.getElementById("TitleColor").style.backgroundColor = "#dc3545";
    document.getElementById("TitleID").innerHTML = "Rejected D.O List"

    dataTable = $("#rejectedtable").DataTable({
        ajax: {
            'url': '/api/DO/GetPRTableRejected',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [

            { 'data': 'dono', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'createdBy', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejectedBY', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejectedReason', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'dono', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-pencil-alt"></i>Edit</a>                        `;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function ApprovedItem() {


    document.getElementById("datewiseButton").style.display = "block"
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;


    counter();
    document.getElementById("approvalpending").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("incompleteItems").style.display = "none";

    document.getElementById("dispachtedList").style.display = "none";
    document.getElementById("TitleColor").style.backgroundColor = "#28a745";
    document.getElementById("TitleID").innerHTML = "Approved D.O"
    document.getElementById("approvedItem").style.display = "block";


    dataTable = $("#approvedTable").DataTable({
        ajax: {
            'url': '/api/DO/GetPRTableApproved',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                fromdate: fromdate,
                todate: todate,
            },

        },

        columns: [
            { 'data': 'doNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'doNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
                    return `<span>${moment(data).format('YYYY-MM-DD')}</span>`;
                }, 'width': '8%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'doNo', 'render': function (data, type, row) {
                    if (row.lostatuss != null) {
                        return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                    
                       <a class="btn btn-info btn-sm" style="color:white" href=DOLoadingDetails?DPNO=${row.dpno}> <i class="fas fa-eye"> &nbsp</i>View LR</a>`;
                    } else {
                        return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                    }

                }, 'width': '5%'
            },
        ],
        "autoWidth": false,
        "bDestroy": true,

    });
}


function IncompleteItems() {
    document.getElementById("datewiseButton").style.display = "none"
    counter();
    document.getElementById("approvalpending").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("approvedItem").style.display = "none";
    document.getElementById("incompleteItems").style.display = "block";
    document.getElementById("dispachtedList").style.display = "none";

    document.getElementById("TitleColor").style.backgroundColor = "#dc3545";
    document.getElementById("TitleID").innerHTML = "Incomplete D.O List";



    dataTable = $("#icompletetable").DataTable({
        ajax: {
            'url': '/api/DO/GetPRTableIncomplete',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'doNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'doNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },

            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'soNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'userid', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'doNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-edit"> &nbsp</i>Edit</a>           

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
    document.getElementById("planingList").style.display = "none";
    document.getElementById("approvalItems").style.display = "block";


    document.getElementById("TitleID").innerHTML = "Pending Approval D.O List"
    dataTable = $("#approvaltable").DataTable({
        ajax: {
            'url': '/api/DO/GetPRTableApprovalPending',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'doNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'doNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'soNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'userid', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'doNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DoNO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
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
    document.getElementById("planingList").style.display = "none";
    document.getElementById("rejectedItems").style.display = "block";
    document.getElementById("TitleID").innerHTML = "Rejected D.O"



    dataTable = $("#checkrejectedTable").DataTable({
        ajax: {
            'url': '/api/DO/GetPRTableRejected',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [

            { 'data': 'dono', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'reason', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'dono', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DoNO=${data}> <i class="fas fa-pencil-alt"></i>Edit</a>                        `;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });
}

function checkApprovedItem() {

    counter();
    document.getElementById("datewiseButton").style.display = "block"
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;


    document.getElementById("TitleColor").style.backgroundColor = "#28a745";
    document.getElementById("approvalItems").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("planingList").style.display = "none";
    document.getElementById("checkingApprovedItem").style.display = "block";
    document.getElementById("TitleID").innerHTML = "Approved D.O"


    dataTable = $("#checkingApprovedTable").DataTable({
        ajax: {
            'url': '/api/DO/GetPRTableApproved',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                fromdate: fromdate,
                todate: todate,
            },
        },

        columns: [
            { 'data': 'doNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'doNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
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
                'data': 'doNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>`;
                }, 'width': '5%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true,
        "search": true,
    });
}

function checkPlanningDO() {

    counter();
    document.getElementById("datewiseButton").style.display = "block"
    document.getElementById("TitleColor").style.backgroundColor = "#28a745";
    document.getElementById("approvalItems").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("checkingApprovedItem").style.display = "none";
    document.getElementById("planingList").style.display = "block";
    document.getElementById("TitleID").innerHTML = "Planning D.O List";


    dataTable = $("#dispachtedTable").DataTable({
        ajax: {
            'url': '/api/DO/DispacthedPlanningTable',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'dpNo', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', },
            { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            {
                'data': 'dpNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white"  href=DispatchedOrder?DPNO=${data}> <i class="fa fa-cart-arrow-down"> &nbsp;</i>Create D.O</a>
                        `;
                }, 'width': '8%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });

    /*taTable = $("#panningTable").DataTable({
        ajax: {
            'url': '/api/DO/DispacthedPlanningTable',
            'type': 'GET',
            'contentType': 'application/json'



        },

        columns: [
            { 'data': 'dpNo', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', },
            { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },

            {
                'data': 'dpNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white"  href=DispatchedOrder?DPNO=${data}> <i class="fa fa-cart-arrow-down"> &nbsp;</i>Create D.O</a>
                        `;
                }, 'width': '8%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    });*/
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




function pendingMaterials() {
    counter();
    document.getElementById("approvalpending").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("approvedItem").style.display = "none";
    document.getElementById("incompleteItems").style.display = "none";
    document.getElementById("dispachtedList").style.display = "block";

    document.getElementById("TitleColor").style.backgroundColor = "#dc3545";
    document.getElementById("TitleID").innerHTML = "Pending Material Order List";
    var now = new Date();
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    var ddate = dateStringWithTime;
    var ddate = moment(ddate).format('YYYY-MM-DDT00:00:00');


    dataTable = $("#dispachtedTable").DataTable({
        ajax: {
            'url': '/api/DO/GetPendingMaterialsTable?edate=' + ddate,
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'dpNo', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', },
            { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },

            {
                'data': 'dono', 'render': function (data) {

                    return `<a class="btn btn-info btn-sm" style="color:white"  href=DispatchedOrder?DONO1=${data}> <i class="fa fa-cart-arrow-down"> &nbsp;</i>Create D.O</a>`;
                }, 'width': '8%'
            },
        ],
        "font- size": '1em',
        "bDestroy": true
    })
}


/*function viewReport() {

    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;
    counter();
    document.getElementById("approvalpending").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("incompleteItems").style.display = "none";

    document.getElementById("dispachtedList").style.display = "none";
    document.getElementById("TitleColor").style.backgroundColor = "#28a745";
    document.getElementById("TitleID").innerHTML = "Approved D.O"
    document.getElementById("approvedItem").style.display = "block";





    dataTable = $("#approvedTable").DataTable({
        ajax: {
            'url': '/api/DO/RangeApprovedTable',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                fromdate: fromdate,
                todate: todate,
            },
        },

        columns: [
            { 'data': 'doNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'doNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '8%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'doNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '5%'
            },
        ],
        "autoWidth": false,
        "bDestroy": true,

    });
}
function checkviewReport() {

    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;
    counter();
    document.getElementById("TitleColor").style.backgroundColor = "#28a745";
    document.getElementById("approvalItems").style.display = "none";
    document.getElementById("rejectedItems").style.display = "none";
    document.getElementById("planingList").style.display = "none";
    document.getElementById("checkingApprovedItem").style.display = "block";
    document.getElementById("TitleID").innerHTML = "Approved D.O"





    dataTable = $("#checkingApprovedTable").DataTable({
        ajax: {
            'url': '/api/DO/RangeApprovedTable',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                fromdate: fromdate,
                todate: todate,
            },
        },

        columns: [
            { 'data': 'doNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'doNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '8%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'doNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                }, 'width': '5%'
            },
        ],
        "autoWidth": false,
        "bDestroy": true,

    });
}*/


function allData() {
    document.getElementById("datewiseButton").style.display = "block"
    counter();
    var datatable = "";
    var condition = document.getElementById("condition").innerHTML;
    if (condition == "Check") {

        document.getElementById("TitleColor").style.backgroundColor = "#28a745";
        document.getElementById("approvalItems").style.display = "none";
        document.getElementById("rejectedItems").style.display = "none";
        document.getElementById("planingList").style.display = "none";
        document.getElementById("checkingApprovedItem").style.display = "block";
        document.getElementById("TitleID").innerHTML = "Approved D.O"
        datatable = "#checkingApprovedTable"

    }
    if (condition == "Create") {

        document.getElementById("approvalpending").style.display = "none";
        document.getElementById("rejectedItems").style.display = "none";
        document.getElementById("incompleteItems").style.display = "none";
        document.getElementById("dispachtedList").style.display = "none";
        document.getElementById("TitleColor").style.backgroundColor = "#28a745";
        document.getElementById("TitleID").innerHTML = "Approved D.O"
        document.getElementById("approvedItem").style.display = "block";
        datatable = "#approvedTable"
    }
    dataTable = $(datatable).DataTable({
        ajax: {
            'url': '/api/DO/AllData',
            'type': 'GET',
            'contentType': 'application/json',
        },

        columns: [
            { 'data': 'doNodigit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px', "visible": false },
            { 'data': 'doNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
            {
                'data': 'doDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '8%', 'font-size': '6px'
            },
            { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'poNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'created', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'rejected', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'doNo', 'render': function (data, type, row) {
                    if (row.lostatus == true) {
                        return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                    
                                <a class="btn btn-info btn-sm" style="color:white" href=DOLoadingDetails?DPNO=${row.dpno}> <i class="fas fa-eye"> &nbsp</i>View LR</a>`;
                    } else {
                        return `<a class="btn btn-info btn-sm" style="color:white" href=DispatchedOrder?DONO=${data}> <i class="fas fa-eye"> &nbsp</i>View</a>                        `;
                    }

                }, 'width': '5%'
            },
        ],
        "autoWidth": false,
        "bDestroy": true,

    });
}

function redirectt(dpno) {
    var tp = "DP";
    var now = new Date();
    var currentTime = moment(now).format('YYYY-MM-DDTHH:mm:SS');
    $.ajax({
        url: '/api/DO/reservationChecking?dpno=' + dpno,
        data: {
            currentTime: currentTime,
            tp: tp,
        },
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                if (data.frm == "TEMPORARY" && data.status == "NOT") {
                    location.href = "DispatchedOrder?DPNO=" + dpno;

                } else if (data.frm == "TEMPORARY" && data.status == "RESERVED") {

                    Swal.fire({
                        title: 'Already reserved by ' + data.data.userid,
                        showDenyButton: false,
                        showCancelButton: false,
                    }).then((result) => {



                    })
                }
            } else {
                location.href = "DispatchedOrder?DPNO=" + dpno;
            }

        }
    })

}