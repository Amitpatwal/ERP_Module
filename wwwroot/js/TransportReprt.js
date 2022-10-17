var editor;
$(document).ready(function () {
    $("#frieghttype").select2();
    $("#TransName").select2();
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " - " + dateStringWithTime;
    fillcompany1('TransName', 'Transporter');

});

function changecompanydetail() {
    var dt = document.getElementById("searchBy").value;
    $('#TransName').empty();
    if (dt == "transporter") {
        document.getElementById("searchh").innerHTML = "Transport Name";
        fillcompany1('TransName', 'Transporter');
    } else {
        document.getElementById("searchh").innerHTML = "Company Name";
        fillcompany1('TransName', 'Customer');
    }
}

function viewReport() {
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
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    var frm = document.getElementById("frm").value;

    var TransName = document.getElementById("TransName").value;

    if (TransName != 0) {
        var TransName = document.getElementById("TransName").selectedOptions[0].text;
        document.getElementById('daterange').value = dateStringWithTime1 + " - " + dateStringWithTime2;
        let count = $("#frieghttype")[0].selectedOptions.length;
        const frieghttype = [];
        for (i = 0; i < count; i++) {
            frieghttype[i] = document.getElementById("frieghttype").selectedOptions[i].text;
        }
        var searchBy = document.getElementById("searchBy").value;
        if (searchBy == "transporter") {
            document.getElementById("cName").innerHTML = "Company Name";
        }
        else {
            document.getElementById("cName").innerHTML = "Transport Name";
        }
        dataTable = $("#listTable").DataTable({
            ajax: {
                'url': '/api/LoadingReport/ViewTransportLedger',
                'traditional': true,
                'data': {
                    frmdata: fromdate,
                    todate: todate,
                    frm: frm,
                    frieghttype: frieghttype,
                    contractorName: TransName,
                    searchBy: searchBy,
                },
                'type': 'GET',
                'contentType': 'application/json'
            },

            "footerCallback": function (row, data, start, end, display) {
                var api = this.api(), data;
                // Remove the formatting to get integer data for summation
                var intVal = function (i) {
                    return typeof i === 'string' ?
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                // Total over all pages
                total = api
                    .column(7)
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                var ttamount = total;
                ttamount = ttamount.toFixed(2);
                ttamount = ttamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                // Update footer
                $(api.column(7).footer()).html(
                    '' + '₹' + ttamount + ' '
                );
            },
            columns: [
                { 'data': 'sr', 'defaultContent': '-', 'width': '1%', 'font-size': '6px' },
                {
                    'data': 'date', 'render': function (data) {
                        var date = data;
                        var now = date.toString().replace('T', ' ');
                        var dateStringWithTime = moment(now).format('DD-MMM-YYYY');
                        return `<span>${dateStringWithTime}</span>`;
                    }, 'width': '5%', 'font-size': '6px'
                },
                { 'data': 'voucherno', 'defaultContent': '-', 'width': '8%', 'font-size': '6px' },
                { 'data': 'invoiceno', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                { 'data': 'companyname', 'defaultContent': '-', 'width': '40%', 'font-size': '6px' },
                { 'data': 'frtype', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                { 'data': 'type', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
                {
                    'data': 'amount', 'render': function (data, type, row) {
                        var amount = row.amount;
                        amount = amount.toFixed(2);
                        amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                        return `<a>${amount}</a>`;
                    }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                },

            ],
            "font- size": '1em',
            dom: 'lBfrtip',
            buttons: [
                {
                    extend: 'excel',
                    text: '<i class="fas fa-file-excel"></i> Excel',
                    title: 'TRANSPORT LEDGER REPORT',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7],
                    },
                },
                {
                    extend: 'pdfHtml5',
                    text: '<i class="fas fa-file-pdf"></i> PDF',
                    message: '',
                    orientation: 'portrait',
                    title: 'TRANSPORT LEDGER REPORT',

                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7],
                    },
                    customize: function (doc) {
                        doc.pageMargins = [10, 10, 10, 10];
                        doc.defaultStyle.fontSize = 7;
                        doc.styles.tableHeader.fontSize = 7;
                        doc.styles.title.fontSize = 9;
                        // Remove spaces around page title
                        doc.content[0].text = doc.content[0].text.trim();
                        var objLayout = {
                        };
                        // Horizontal line thickness
                        objLayout['hLineWidth'] = function (i) { return .5; };
                        // Vertikal line thickness
                        objLayout['vLineWidth'] = function (i) { return .5; };
                        // Horizontal line color
                        objLayout['hLineColor'] = function (i) { return '#aaa'; };
                        // Vertical line color
                        objLayout['vLineColor'] = function (i) { return '#aaa'; };
                        // Left padding of the cell
                        objLayout['paddingLeft'] = function (i) { return 4; };
                        // Right padding of the cell
                        objLayout['paddingRight'] = function (i) { return 4; };
                        // Inject the object in the document
                        doc.content[1].layout = objLayout;
                    }
                },

                {
                    text: '<i class="fa fa-print"></i> Print',
                    extend: 'print', footer: true, autoPrint: true,
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7]
                    },
                    customize: function (list) {
                        $(list.document.body).find('table').css('font-size', '10pt');
                        $(list.document.body).find('table').css('border', '1px solid #000');
                        $(list.document.body).find('table td').css('border-left', '1px solid #000');
                        $(list.document.body).find('table td').css('border-top', '1px solid #000');
                        $(list.document.body).find('table td').css('border-right', '1px solid #000');
                        $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                    },
                    title: function () {
                        var displaytime = document.getElementById('daterange').value;
                        return display()
                        function display() {
                            return `<div style="text-align:center; "><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">TRANSPORT LEDGER REPORT</h3></div><div style="text-align:center;font-size:13px;">${TransName} <br/> ${displaytime}</div>`;
                        }

                    }
                },
                {
                    extend: "colvis"
                }
            ],
            "bDestroy": true,
            "paging": false,
            "searching": true,
            "ordering": true,
            "info": true,
            "scrollX": true,
            "responsive": true,
            language: {
                searchPlaceholder: "Search records",
                emptyTable: "No data found",
                width: '100%',
            },

        });
    }
    else {
        Toast.fire({
            icon: 'error',
            title: 'Please select company'
        })
    }
}