$(document).ready(function () {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " to " + dateStringWithTime;
    despatchedList()
});

function despatchedList(data) {
    document.getElementById("datewiseButton").style.display = "block"
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;

    document.getElementById("TitleID").innerHTML = "Approved D.O"
    document.getElementById("dispachtedList").style.display = "block"
    document.getElementById("TitleColor").style.backgroundColor = "#28a745";

    var url = "";
    if ( data != "ALLDATA") {
        url = "/api/DO/GetPRTableApproved"
    }
    else {
        url ="/api/DO/AllData"
    }

    dataTable = $("#dispachtedTable").DataTable({
        ajax: {
            'url': url,
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
                  
                    return `<a class="btn btn-info btn-sm" style="color:white" href=Invoice?doNo=${data}> <i class="fa fa-plus"> &nbsp</i>Create Invoice</a>`;

                    }, 'width': '10%'
            },
        ],
        "autoWidth": false,
        "bDestroy": true,

    });
}


