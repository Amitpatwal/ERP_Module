$(document).ready(function () {

    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " to " + dateStringWithTime;

    LoadDatatable();

    $('#listTable').on('click', 'tr', function () {
        $(this).toggleClass('activee');
    });



});

function LoadDatatable() {

    var ViewPermission = false;
    var UpdatePermission = false;
    var DeletePermission = false;

    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "PROFORMA_INVOICE",
        },
        success: function (data) {
            if (data.data[1].operations == "CREATE") {
                if (data.data[1].permission == true) {
                    document.getElementById('validation').style.display = "block";
                } else {
                    document.getElementById('validation').style.display = "none";
                }
            }
            if (data.data[2].operations == "UPDATE") {
                if (data.data[2].permission == true) {
                    UpdatePermission = true;
                } else {
                    UpdatePermission = false;
                }
            }
            if (data.data[0].operations == "VIEW") {
                if (data.data[0].permission == true) {
                    ViewPermission = true;
                } else {
                    ViewPermission = false;
                }
            }
            if (data.data[3].operations == "DELETE") {
                if (data.data[3].permission == true) {
                    DeletePermission = true;
                } else {
                    DeletePermission = false;
                }
            }
            dataTable = $("#listTable").DataTable({
                ajax: {
                    'url': '/api/PI/GetPITable',
                    'type': 'GET',
                    'contentType': 'application/json'
                },

                columns: [
                    {
                        'data': 'date', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                            var hours = moment(now).format('hh');
                            var x = Number(hours)
                            var ampm = x >= 12 ? 'PM' : 'AM';
                            dateStringWithTime = dateStringWithTime;
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '3%', 'font-size': '6px'
                    },
                    { 'data': 'piNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                    { 'data': 'qtNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },

                    { 'data': 'billCompanyname', 'defaultContent': '-', 'width': '15%', 'font-size': '6px' },
                    { 'data': 'userid', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            var amount = row.amount;
                            amount = amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return `<a>${amount}</a>`;
                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'piNo', 'render': function (data, type, row) {
                            if (row.sostatuss == null) {
                                return `<button type="button" class="btn btn-warning">Pending</button>`;
                            }
                            else {
                                return `<button type="button" class="btn btn-success">Converted</button>`;
                            }

                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },

                    {
                        'data': 'piNo', 'render': function (data, type, row) {

                            if (ViewPermission == true && UpdatePermission == true) {
                                if (row.sostatuss == null) {

                                    if (DeletePermission == true) {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"  href=PerformaInvoice?pino=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item"  onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" onclick=DeletePI("${data}")><i class="fas fa-trash" ) ></i> &nbsp; Delete</a>
                                              <a class="dropdown-item" href=SaleOrder?PINO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To SO</a>
                                              <a class="dropdown-item" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i> &nbsp;Convert to P.O</a>;
                                              <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                    else {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"  href=PerformaInvoice?pino=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item"  onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=SaleOrder?PINO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To SO</a>
                                              <a class="dropdown-item" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i> &nbsp;Convert to P.O</a>;
                                              <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }

                                }
                                else {

                                    if (DeletePermission == true) {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"   href=PerformaInvoice?pino=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item" onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" onclick=DeletePI("${data}") ><i class="fas fa-trash"></i> &nbsp; Delete</a>
                                              <a class="dropdown-item" style="color:white;background-color:green" href=SaleOrder?PINO=${data} > <i class="fa fa-eye "></i> &nbsp;View S.O</a>
                                              <a class="dropdown-item" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i>&nbsp;Convert to P.O </a>
                                              <a class="dropdown-item" href=""  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>  &nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                    else {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"   href=PerformaInvoice?pino=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item" onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" style="color:white;background-color:green" href=SaleOrder?PINO=${data} > <i class="fa fa-eye "></i> &nbsp;View S.O</a>
                                              <a class="dropdown-item" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i>&nbsp;Convert to P.O </a>
                                              <a class="dropdown-item" href=""  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>  &nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }

                                }
                            }
                            else if (ViewPermission == true && UpdatePermission == false) {
                                if (row.sostatuss == null) {

                                    if (DeletePermission == true) {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                               <a class="dropdown-item"  onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=SaleOrder?PINO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To SO</a>
                                              <a class="dropdown-item" onclick=DeletePI("${data}")><i class="fas fa-trash"></i> &nbsp; Delete</a>
                                              <a class="btn btn-info btn-sm" style="color:white" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i>Convert to P.O</a>;
                                              <a class="dropdown-item" href=""  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>  &nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                    else {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                               <a class="dropdown-item"  onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=SaleOrder?PINO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To SO</a>
                                              <a class="btn btn-info btn-sm" style="color:white" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i>Convert to P.O</a>;
                                              <a class="dropdown-item" href=""  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>  &nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }

                                }

                                else {

                                    if (DeletePermission == true) {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                                <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                                <a class="dropdown-item"  onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                                <a class="btn btn-info btn-sm" style="color:white;background-color:green" href=SaleOrder?PINO=${data} > <i class="fa fa-eye "></i>View S.O</a>
                                                <a class="dropdown-item" onclick=DeletePI("${data}")><i class="fas fa-trash"></i> &nbsp; Delete</a>
                                                <a class="btn btn-info btn-sm" style="color:white" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i>Convert to P.O</a>;
                                                <a class="dropdown-item" href=""  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>  &nbsp; Logs</a>
                                            </div>&nbsp;&nbsp;
                                            <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                    else {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                                <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                                <a class="dropdown-item"  onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                                <a class="btn btn-info btn-sm" style="color:white;background-color:green" href=SaleOrder?PINO=${data} > <i class="fa fa-eye "></i>View S.O</a>
                                                <a class="btn btn-info btn-sm" style="color:white" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i>Convert to P.O</a>;
                                                <a class="dropdown-item" href=""  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>  &nbsp; Logs</a>
                                            </div>&nbsp;&nbsp;
                                            <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }

                                }
                            }
                            else {
                                return ``;
                            }
                        }, 'width': '2%', 'className': "text-right", 'font-size': '6px'
                    },
                ],
                "font- size": '1em',

                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        title: 'PERFORMA INVOICE REPORT',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
                        },

                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        message: '',
                        orientation: 'portrait',
                        title: 'PERFORMA INVOICE REPORT',

                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
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
                            columns: [1, 2, 3, 4, 5, 6]
                        },
                        customize: function (list) {
                            $(list.document.body).find('table').css('font-size', '10pt');
                            $(list.document.body).find('table').css('border', '1px solid #000');
                            $(list.document.body).find('table td').css('border-left', '1px solid #000');
                            $(list.document.body).find('table td').css('border-top', '1px solid #000');
                            $(list.document.body).find('table td').css('border-right', '1px solid #000');
                            $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                        },
                        title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">PERFORMA INVOICE REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

                    },],

                "bDestroy": true,
                "paging": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "overflow- x": true,
                "responsive": true,
                "scrollX": false,
                language: {
                    searchPlaceholder: "Search records",
                    emptyTable: "No data found",
                    width: '100%',
                },
            });
        }
    });

}

function DateWiseFilter() {


    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;

    var ViewPermission = false;
    var UpdatePermission = false;


    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "PROFORMA_INVOICE",
        },
        success: function (data) {
            if (data.data[1].operations == "CREATE") {
                if (data.data[1].permission == true) {
                    document.getElementById('validation').style.display = "block";
                } else {
                    document.getElementById('validation').style.display = "none";
                }
            }
            if (data.data[2].operations == "UPDATE") {
                if (data.data[2].permission == true) {
                    UpdatePermission = true;
                } else {
                    UpdatePermission = false;
                }
            }
            if (data.data[0].operations == "VIEW") {
                if (data.data[0].permission == true) {
                    ViewPermission = true;
                } else {
                    ViewPermission = false;
                }
            }
            dataTable = $("#listTable").DataTable({
                ajax: {
                    'url': '/api/PI/DateWiseFilter',
                    'type': 'GET',
                    'contentType': 'application/json',
                    data: {
                        fromdate: fromdate,
                        todate: todate,
                    }
                },

                columns: [
                    {
                        'data': 'date', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                            var hours = moment(now).format('hh');
                            var x = Number(hours)
                            var ampm = x >= 12 ? 'PM' : 'AM';
                            dateStringWithTime = dateStringWithTime;
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '3%', 'font-size': '6px'
                    },
                    { 'data': 'piNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                    { 'data': 'qtNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },

                    { 'data': 'billCompanyname', 'defaultContent': '-', 'width': '15%', 'font-size': '6px' },
                    { 'data': 'userid', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            var amount = row.amount;
                            amount = amount.toFixed(2);
                            amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return `<a>${amount}</a>`;
                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'piNo', 'render': function (data, type, row) {

                            if (row.sostatuss == null) {
                                return `
                                <button type="button" class="btn btn-warning">Pending</button>
                                `;
                            }
                            else {
                                return `
                            <button type="button" class="btn btn-success">Converted</button>
                            `;
                            }

                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },

                    {
                        'data': 'piNo', 'render': function (data, type, row) {

                            if (ViewPermission == true && UpdatePermission == true) {
                                if (row.sostatuss == null) {
                                    return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"  href=PerformaInvoice?pino=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item"  onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=SaleOrder?PINO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To SO</a>
                                              <a class="dropdown-item" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i> &nbsp;Convert to P.O</a>;
                                              <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                }
                                else {
                                    return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"   href=PerformaInvoice?pino=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item" onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" style="color:white;background-color:green" href=SaleOrder?PINO=${data} > <i class="fa fa-eye "></i> &nbsp;View S.O</a>
                                              <a class="dropdown-item" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i>&nbsp;Convert to P.O </a>
                                              <a class="dropdown-item" href=""  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>  &nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                }
                            }
                            else if (ViewPermission == true && UpdatePermission == false) {
                                if (row.sostatus == false) {
                                    return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                               <a class="dropdown-item"  onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=SaleOrder?PINO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To SO</a>
                                              <a class="btn btn-info btn-sm" style="color:white" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i>Convert to P.O</a>;
                                              <a class="dropdown-item" href=""  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>  &nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;

                                }

                                else {

                                    return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                                <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                                <a class="dropdown-item"  onclick=printPI("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                                <a class="btn btn-info btn-sm" style="color:white;background-color:green" href=SaleOrder?PINO=${data} > <i class="fa fa-eye "></i>View S.O</a>
                                                <a class="btn btn-info btn-sm" style="color:white" href=PurchaseOrder?PINO=${data} > <i class="fa fa-refresh "></i>Convert to P.O</a>;
                                                <a class="dropdown-item" href=""  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PERFORMA","PERFORMA",2)> <i class="fa fa-history"></i>  &nbsp; Logs</a>
                                            </div>&nbsp;&nbsp;
                                            <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;

                                }



                            }
                            else {
                                return ``;
                            }
                        }, 'width': '2%', 'className': "text-right", 'font-size': '6px'
                    },
                ],
                "font- size": '1em',

                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        title: 'PERFORMA INVOICE REPORT',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
                        },

                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        message: '',
                        orientation: 'portrait',
                        title: 'PERFORMA INVOICE REPORT',

                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 6],
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
                            columns: [1, 2, 3, 4, 5, 6]
                        },
                        customize: function (list) {
                            $(list.document.body).find('table').css('font-size', '10pt');
                            $(list.document.body).find('table').css('border', '1px solid #000');
                            $(list.document.body).find('table td').css('border-left', '1px solid #000');
                            $(list.document.body).find('table td').css('border-top', '1px solid #000');
                            $(list.document.body).find('table td').css('border-right', '1px solid #000');
                            $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                        },
                        title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">PERFORMA INVOICE REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

                    },],

                "bDestroy": true,
                "paging": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "overflow- x": true,
                "responsive": true,
                "scrollX": true,
                language: {
                    searchPlaceholder: "Search records",
                    emptyTable: "No data found",
                    width: '100%',
                },
            });
        }
    });

}



function printPI(idd) {
    window.open('../PerformaInvoicePrint?idd=' + idd, '_blank');
}
function deleteitem(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'Delete',
                url: "api/itemdatatable/Deleteproduct",
                data: {
                    Id: id,
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                        /* toastr.success(data.message);*/
                        dataTable.ajax.reload();
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            });

        };
    })

}

function fetchItems(piNo) {

    document.getElementById("pino").innerHTML = piNo,
        datatable = $("#ItemTable").DataTable({
            ajax: {
                'url': '/api/PI/viewPiItem?pino=' + piNo,
                'type': 'GET',
                'contentType': 'application/json',
            },
            columns:
                [
                    { 'data': 'itemid', 'defaultContent': '', 'width': '.1%' },
                    {
                        'data': 'itemid', 'render': function (data, type, row) {
                            if (row.remarks != null) {
                                if (row.pmake != null) {
                                    if (row.pclass == null) {
                                        var html1 =
                                            `<a>${row.pname} &nbsp; </br>  "${row.psize}" &nbsp(${row.pmake}) </a> <br>
                                            <a>${row.remarks}<a/>`
                                    }
                                    else {
                                        var html1 =
                                            `<a>${row.pname} &nbsp; </br> "${row.psize}" &nbsp"${row.pclass}" </br>   &nbsp(${row.pmake}) </a> <br>
                                            <a>${row.remarks}<a/>`
                                    }
                                }
                                else if (row.pclass != null) {
                                    var html1 = `<a>${row.pname} &nbsp;</br>  "${row.psize}" &nbsp"${row.pclass}"  </a> <br>
                                            <a>${row.remarks}<a/>`
                                }
                                else {
                                    var html1 = `<a>${row.pname} &nbsp; </br> " ${row.psize}"  </a> <br>
                                            <a>${row.remarks}<a/>`
                                }
                            }
                            else {
                                if (row.pmake != null) {
                                    if (row.pclass != null) {
                                        var html1 =
                                            `<a>${row.pname} &nbsp;</br> "${row.psize}" &nbsp"${row.pclass}"  <br/> &nbsp(${row.pmake}) </a>`
                                    }
                                    else {
                                        var html1 =
                                            `<a>${row.pname} &nbsp; </br> "${row.psize}"  &nbsp(${row.pmake}) </a>`
                                    }
                                }
                                else if (row.pclass != null) {
                                    var html1 = `<a>${row.pname} &nbsp; </br> "${row.psize}" &nbsp"${row.pclass}" </a>`
                                }
                                else {
                                    var html1 = `<a>${row.pname} &nbsp; </br> "${row.psize}"  </a>`
                                }
                            }
                            return html1;
                        }, 'width': '50%', 'font-size': '10px', 'font-size': '90% ', 'font-family': 'Tahoma',
                    },
                    { 'data': 'rateunit', 'defaultContent': '', 'width': '5%' },
                    {
                        'data': 'rate', 'render': function (data, type, row) {
                            var amount = row.rate;
                            amount = amount.toFixed(2);
                            amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return `<a>${amount}</a>`;
                        }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
                    },
                    {

                        'data': 'discount', 'render': function (data, type, row) {
                            var discount = row.discount;
                            return `<a>${discount}</a>`;
                        }, 'width': '5%', 'className': "text-right", 'font-size': '5px'
                    },
                    {
                        'data': 'qty', 'render': function (data, type, row) {
                            return `<a>${row.qty} ${row.rateunit}</a>`;
                        }, 'width': '10%', 'font-size': '5px',
                    },
                    {

                        'data': 'discountrate', 'render': function (data) {

                            return `<a>${data.toFixed(2)}</a>`;
                        }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
                    },
                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            var amount = row.amount;
                            amount = amount.toFixed(2);
                            amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return `<a>${amount}</a>`;
                        }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
                    },


                ],
            "language": {
                "emptyTable": "No data found, Please click on <b>Add New</b> Button"
            },
            "autoWidth": false,
            "dom": '<"top"i>rt<"bottom"flp><"clear">',
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "bAutoWidth": false,
            "scrollX": true,
            "bDestroy": true,
        });
}

function DeletePI(piNo) {
    Swal.fire({
        title: 'Are your sure you want to delete this PI?',
        text: "Once deleted, you'll be not able to recover this PI.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            var url = "api/PI/DeletePI";
            $.ajax({
                type: 'Delete',
                url: url,
                data: {
                    PINO: piNo,
                },
                success: function (data) {
                    if (data.success) {
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
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Deleted'
                        })

                        $('#listTable').DataTable().ajax.reload();
                    }
                    else {
                        Swal.fire(data.message, '', 'error')

                    }
                }
            })
        }
    })

}