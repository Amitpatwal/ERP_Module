$(document).ready(function () {
    $('#loading').hide();

    LoadDatatable()
    $('#MiniAmt, #MaxAmt').keyup(function () {
        dataTable.draw();
    });
    $('#listTable').on('click', 'tr', function () {
        $(this).toggleClass('activee');
    });

});
function LoadDatatable() {
    var now = new Date();
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " - " + dateStringWithTime;
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;

    var ViewPermission = false;
    var UpdatePermission = false;
    var DeletePermission = false;
    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "SALES_QUOTATION",
        },
        success: function (data) {
            if (data.data[1].operations == "CREATE") {
                if (data.data[1].permission == true) {
                    document.getElementById('createbutton1').style.display = "block";
                } else {
                    document.getElementById('createbutton1').style.display = "none";
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
                    'url': '/api/Quotation/GetQuotationTable',
                    data: {
                        fromdate: fromdate,
                        todate: todate,
                    },
                    'type': 'GET',
                    'contentType': 'application/json'
                },
                columns: [

                    {
                        'data': 'date', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                            var hours = moment(now).format('hh');
                            var x = Number(hours)
                            var ampm = x >= 12 ? 'PM' : 'AM';
                            dateStringWithTime = dateStringWithTime;
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '5%', 'font-size': '6px'
                    },
                    { 'data': 'quotno', 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
                    { 'data': 'companyname', 'defaultContent': '-', 'width': '20%', 'font-size': '6px' },
                    { 'data': 'contactperson', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    { 'data': 'dealingPerson', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },

                    { 'data': 'category', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            return `<a>₹ ${row.amount.toFixed(2)}</a>`;
                        }, 'width': '5%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'quotno', 'render': function (data, type, row) {

                            if (row.pino == null) {
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
                        'data': 'quotno', 'render': function (data, type, row) {

                            if (ViewPermission == true && UpdatePermission == true) {
                                if (row.pino == null) {
                                    if (DeletePermission == true) {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-refresh "></i> &nbsp; Convert to P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                                <a class="dropdown-item" onclick=DeleteQuotation("${data}")  >  <i class="fa fa-trash-o"></i> Delete</a>
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
                                              <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-refresh "></i> &nbsp; Convert to P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }

                                }
                                else {

                                    if (DeletePermission == true) {
                                        return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                             <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item" style="background-color:green;color:white"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-eye "></i>&nbsp; View P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                                <a class="dropdown-item" onclick=DeleteQuotation("${data}")>  <i class="fa fa-trash-o"></i> Delete</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                    else {
                                        return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                             <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item" style="background-color:green;color:white"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-eye "></i>&nbsp; View P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                }

                            }
                            else if (ViewPermission == true && UpdatePermission == false) {
                                return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i> Print</a>;
                                                 <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                            }
                            else if (ViewPermission == false && UpdatePermission == false) {
                                return ``;
                            }



                        }, 'width': '5%'
                    },
                ],
                "font- size": '1em',
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        title: 'SALES QUOTATION REPORT',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7],
                        },
                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        message: '',
                        orientation: 'portrait',
                        title: 'SALES QUOTATION REPORT',

                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7],
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
                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                        },
                        customize: function (list) {
                            $(list.document.body).find('table').css('font-size', '10pt');
                            $(list.document.body).find('table').css('border', '1px solid #000');
                            $(list.document.body).find('table td').css('border-left', '1px solid #000');
                            $(list.document.body).find('table td').css('border-top', '1px solid #000');
                            $(list.document.body).find('table td').css('border-right', '1px solid #000');
                            $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                        },
                        title: '<div style="text-align:center; "><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">SALES QUOTATION REPORT</h3></div><div style="text-align:center;font-size:13px;"></div>',
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
                "scrollX": false,
                "overflow- x": true,
                "responsive": true,
                language: {
                    searchPlaceholder: "Search records",
                    emptyTable: "No data found",
                    width: '100%',
                },
            });
            $.fn.dataTable.ext.search.push(
                function (settings, data, dataIndex) {
                    var min = parseInt($('#MiniAmt').val(), 10);
                    var max = parseInt($('#MaxAmt').val(), 10);
                    var age = parseFloat(data[6]) || 0; // use data for the age column

                    if ((isNaN(min) && isNaN(max)) ||
                        (isNaN(min) && age <= max) ||
                        (min <= age && isNaN(max)) ||
                        (min <= age && age <= max)) {
                        return true;
                    }
                    return false;
                }
            );
        }
    });
}

function viewReport() {
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;

    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "SALES_QUOTATION",
        },
        success: function (data) {
            if (data.data[1].operations == "CREATE") {
                if (data.data[1].permission == true) {
                    document.getElementById('createbutton1').style.display = "block";
                } else {
                    document.getElementById('createbutton1').style.display = "none";
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
                    'url': '/api/Quotation/GetQuotationTable',
                    data: {
                        fromdate: fromdate,
                        todate: todate,
                    },
                    'type': 'GET',
                    'contentType': 'application/json'
                },
                columns: [

                    {
                        'data': 'date', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '5%', 'font-size': '6px'
                    },
                    { 'data': 'quotno', 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
                    { 'data': 'companyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    { 'data': 'contactperson', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    { 'data': 'dealingPerson', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    { 'data': 'category', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            var amount = row.amount;
                            amount = amount.toFixed(2);
                            amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                            return `<a>₹ ${amount}</a>`;
                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'quotno', 'render': function (data, type, row) {

                            if (row.pino == null) {
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
                        'data': 'quotno', 'render': function (data, type, row) {

                            if (ViewPermission == true && UpdatePermission == true) {
                                if (row.pistatus == false) {

                                    if (DeletePermission == true) {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-refresh "></i> &nbsp; Convert to P.I</a>
                                                 <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                                  <a class="dropdown-item" onclick=DeleteQuotation("${data}")  >  <i class="fa fa-trash-o"></i> Delete</a>
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
                                              <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-refresh "></i> &nbsp; Convert to P.I</a>
                                                 <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                }


                                else {

                                    if (DeletePermission == true) {
                                        return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                             <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item" style="background-color:green;color:white"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-eye "></i>&nbsp; View P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                                 <a class="dropdown-item" onclick=DeleteQuotation("${data}")  >  <i class="fa fa-trash-o"></i> Delete</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                    else {
                                        return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                             <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item" style="background-color:green;color:white"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-eye "></i>&nbsp; View P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }


                                }

                            }
                            else if (ViewPermission == true && UpdatePermission == false) {
                                return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i> Print</a>;
                                                  <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                            }
                            else if (ViewPermission == false && UpdatePermission == false) {
                                return ``;
                            }
                        }, 'width': '5%'
                    },
                ],
                "font- size": '1em',

                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        title: 'SALES QUOTATION REPORT',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7],
                        },

                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        message: '',
                        orientation: 'portrait',
                        title: 'SALES QUOTATION REPORT',

                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7],
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
                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                        },
                        customize: function (list) {
                            $(list.document.body).find('table').css('font-size', '10pt');
                            $(list.document.body).find('table').css('border', '1px solid #000');
                            $(list.document.body).find('table td').css('border-left', '1px solid #000');
                            $(list.document.body).find('table td').css('border-top', '1px solid #000');
                            $(list.document.body).find('table td').css('border-right', '1px solid #000');
                            $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                        },
                        title: '<div style="text-align:center; "><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">SALES QUOTATION REPORT</h3></div><div style="text-align:center;font-size:13px;"></div>',

                    },
                    {

                        extend: "colvis"
                    }


                ],

                "bDestroy": true,
                "paging": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "overflow- x": true,
                "scrollX": false,
                "responsive": true,
                language: {
                    searchPlaceholder: "Search records",
                    emptyTable: "No data found",
                    width: '100%',
                },


            });

            $.fn.dataTable.ext.search.push(
                function (settings, data, dataIndex) {
                    var min = parseInt($('#MiniAmt').val(), 10);
                    var max = parseInt($('#MaxAmt').val(), 10);
                    var age = parseFloat(data[6]) || 0; // use data for the age column

                    if ((isNaN(min) && isNaN(max)) ||
                        (isNaN(min) && age <= max) ||
                        (min <= age && isNaN(max)) ||
                        (min <= age && age <= max)) {
                        return true;
                    }
                    return false;
                }
            );
        }
    });
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

function allData() {

    var ViewPermission = false;
    var UpdatePermission = false;
    var DeletePermission = false;

    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "SALES_QUOTATION",
        },
        success: function (data) {
            if (data.data[1].operations == "CREATE") {
                if (data.data[1].permission == true) {
                    document.getElementById('createbutton1').style.display = "block";
                } else {
                    document.getElementById('createbutton1').style.display = "none";
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
                    'url': '/api/Quotation/ALLQuotationTable',
                    'type': 'GET',
                    'contentType': 'application/json'
                },
                columns: [

                    {
                        'data': 'date', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '5%', 'font-size': '6px'
                    },
                    { 'data': 'quotno', 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
                    { 'data': 'companyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    { 'data': 'contactperson', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    { 'data': 'dealingPerson', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    { 'data': 'category', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            var amount = row.amount;
                            amount = amount.toFixed(2);
                            amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                            return `<a>₹ ${amount}</a>`;
                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'quotno', 'render': function (data, type, row) {

                            if (row.pino == null) {
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
                        'data': 'quotno', 'render': function (data, type, row) {

                            if (ViewPermission == true && UpdatePermission == true) {
                                if (row.pino == null) {
                                    if (DeletePermission == true) {
                                        return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-refresh "></i> &nbsp; Convert to P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                                <a class="dropdown-item"  onclick=DeleteQuotation("${data}")>  <i class="fa fa-trash-o"></i> Delete</a>
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
                                              <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-refresh "></i> &nbsp; Convert to P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }

                                }
                                else {

                                    if (DeletePermission == true) {
                                        return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                             <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item" style="background-color:green;color:white"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-eye "></i>&nbsp; View P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                                <a class="dropdown-item" onclick=DeleteQuotation("${data}")>  <i class="fa fa-trash-o"></i> Delete</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                    else {
                                        return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                             <a class="dropdown-item"  href=Salesquotation?quotno=${data}> <i class="fas fa-pencil-alt"></i>&nbsp; Edit</a>
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i>&nbsp; Print</a>
                                                <a class="dropdown-item"  href=Salesquotation?Quotno=${data}> <i class="fa fa-refresh "></i>&nbsp; Duplicate</a>
                                                <a class="dropdown-item" style="background-color:green;color:white"  href=PerformaInvoice?quotno=${data}> <i class="fa fa-eye "></i>&nbsp; View P.I</a>
                                                <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                    }
                                }

                            }
                            else if (ViewPermission == true && UpdatePermission == false) {
                                return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                                <a class="dropdown-item"  href=SalesquotationPrint?idd=${data} target="_blank">  <i class="fas fa-print"></i> Print</a>;
                                                 <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"QUOTATION","QUOTATION",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                            }
                            else if (ViewPermission == false && UpdatePermission == false) {
                                return ``;
                            }



                        }, 'width': '5%'
                    },
                ],
                "font- size": '1em',

                keys: {
                    clipboard: false
                },
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        title: 'SALES QUOTATION REPORT',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 7],
                        },

                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        message: '',
                        orientation: 'portrait',
                        title: 'SALES QUOTATION REPORT',

                        exportOptions: {
                            columns: [1, 2, 3, 4, 5, 7],
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
                            columns: [1, 2, 3, 4, 5, 7]
                        },
                        customize: function (list) {
                            $(list.document.body).find('table').css('font-size', '10pt');
                            $(list.document.body).find('table').css('border', '1px solid #000');
                            $(list.document.body).find('table td').css('border-left', '1px solid #000');
                            $(list.document.body).find('table td').css('border-top', '1px solid #000');
                            $(list.document.body).find('table td').css('border-right', '1px solid #000');
                            $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                        },
                        title: '<div style="text-align:center; "><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">SALES QUOTATION REPORT</h3></div><div style="text-align:center;font-size:13px;"></div>',

                    },
                    {

                        extend: "colvis"
                    }


                ],

                "bDestroy": true,
                "paging": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "overflow- x": true,
                "scrollX": false,
                "responsive": true,
                language: {
                    searchPlaceholder: "Search records",
                    emptyTable: "No data found",
                    width: '100%',
                },
            });

            $.fn.dataTable.ext.search.push(
                function (settings, data, dataIndex) {
                    var min = parseInt($('#MiniAmt').val(), 10);
                    var max = parseInt($('#MaxAmt').val(), 10);
                    var age = parseFloat(data[6]) || 0; // use data for the age column

                    if ((isNaN(min) && isNaN(max)) ||
                        (isNaN(min) && age <= max) ||
                        (min <= age && isNaN(max)) ||
                        (min <= age && age <= max)) {
                        return true;
                    }
                    return false;
                }
            );
        }
    });


}

function fetchItems(quotno) {

    document.getElementById("Quotationno").innerHTML = quotno,
        datatable = $("#ItemTable").DataTable({
            ajax: {
                'url': '/api/Quotation/getQuotationitem?quotno=' + quotno,
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
                                    if (row.pclass != null) {
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
                        }, 'width': '50%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                    },

                    { 'data': 'rateunit', 'defaultContent': '', 'width': '112px' },
                    { 'data': 'rate', 'defaultContent': '', 'width': '112px' },
                    {
                        'data': 'discount', 'render': function (data, type, row) {
                            var discount = row.discount;

                            return `<a>${discount}</a>`;
                        }, 'width': '5%', 'className': "text-right", 'font-size': '5px'
                    },
                    {
                        'data': 'qty', 'render': function (data, type, row) {
                            return `<a>${row.qty} ${row.rateunit}</a>`;
                        }, 'width': '6%', 'font-size': '5px',
                    },
                    {
                        'data': 'discountrate', 'render': function (data) {
                            return `<a>${data.toFixed(2)}</a>`;
                        }, 'width': '5%', 'className': "text-right", 'font-size': '5px'
                    },
                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            var amount = row.amount;
                            amount = amount.toFixed(2);
                            amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                            return `<a>${amount}</a>`;
                        }, 'width': '5%', 'className': "text-right", 'font-size': '5px'
                    },

                ],
            "autoWidth": false,

            "dom": 'lBfrtip',

            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "bAutoWidth": false,
            "bDestroy": true,




        })
}

function DeleteQuotation(qtno) {
    Swal.fire({
        title: 'Are your sure you want to delete this Quotation?',
        text: "Once deleted, you'll be not able to recover this Quotation.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            var url = "api/Quotation/DeleteQuotation";
            $.ajax({
                type: 'Delete',
                url: url,
                data: {
                    Quotno: qtno,
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

function SearchOperation() {
  
    document.getElementById("holddiv").style.display = "none";
    document.getElementById("searchdiv").style.display = "block";


    var searchby = document.getElementById("searchby").value;
    var searchvalue = document.getElementById("serachvalue").value;


    dataTable = $("#SearchTablelist").DataTable({
        ajax: {
            'url': '/api/DP/GetSearchTable',
            'data': {
                searchvalue: searchvalue,
                searchby: searchby,
            },
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [
            { 'data': 'sr', 'defaultContent': '-', 'font-size': '20px' },
            {
                'data': 'dpNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=DPitemDetails("${data}") data-toggle="modal" data-target="#exampleModal1" > <i class="fa fa-cart-arrow-down"> &nbsp;</i>Item</a>
                        <a class="btn btn-danger btn-sm" style="color:white"  onclick=DPHoldaction("${data}") data-toggle="modal" data-target="#exampleModal2">  <i class="fas fa-print"> &nbsp;</i>Action</a>
                        `;
                }, 'width': '8%'
            },
            { 'data': 'orderstatus', 'defaultContent': '-', "width": "10%", 'font-size': '20px' },

            {
                'data': 'dldate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD/MMM/YY');
                    return `<span>${dateStringWithTime}</span>`;
                },
            },
            {
                'data': 'poDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD/MMM/YY');
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%',
            },
            { 'data': 'sono', 'defaultContent': '-', "width": "10%", 'font-size': '20px' },
            { 'data': 'pono', 'defaultContent': '-', "width": "10%", 'font-size': '20px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '25%' },
            { 'data': 'destination', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'supplierName', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'materialsource', 'defaultContent': '-', 'width': '5%' },
            { 'data': 'incharge', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'remarks', 'defaultContent': '-', 'width': '10%' },
            {
                'data': 'amount', 'render': function (data, type, row) {
                    var amount = row.amount;
                    amount = amount.toFixed(2);
                    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return `<a>${amount}</a>`;
                }, 'width': '1%', 'className': "text-right",
            },

        ],

        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": false,
        "info": false,
        "scrollX": true,

        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
        },
    });

}