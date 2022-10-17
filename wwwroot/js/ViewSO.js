$(document).ready(function () {
    LoadDatatable();
    $('#listTable').on('click', 'tr', function () {
        $(this).toggleClass('activee');
    });

    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " to " + dateStringWithTime;


  });
function previewimage() {
    const [file] = document_attachment_doc.files
    if (file) {
        blah.src = URL.createObjectURL(file)
        document.getElementById("blah").style.display = "block";
    }
    
}
function LoadDatatable() {
    var ViewPermission = false;
    var UpdatePermission = false;

    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "SALE_ORDER",
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
                    'url': '/api/SO/GetSOTable',
                    'type': 'GET',
                    'contentType': 'application/json'
                },
                columns: [

                    {
                        'data': 'soDate', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '3%', 'font-size': '6px'
                    },

                    { 'data': 'soNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                    { 'data': 'pino', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                    
                    { 'data': 'billCompanyname', 'defaultContent': '-', 'width': '15%', 'font-size': '6px' },
                    { 'data': 'poNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                    { 'data': 'userid', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            var amount = row.amount.toFixed(2);
                            amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return `<a>${amount}</a>`;
                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'soNo', 'render': function (data, type, row) {
                            return `
                              <button type="button" class="btn btn-warning " data-toggle="modal" data-target="#attchmentsModel" onclick=attachments("${row.soNo}")>${row.counter}</button>`
                        }, 'width': '3%', 'font-size': '6px'
                    },
                    {
                        'data': 'soNo', 'render': function (data, type, row) {

                            if (row.status == false) {
                                return `
                                <button  type="button" class="btn btn-warning">Pending</button>
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
                        'data': 'soNo', 'render': function (data, type, row) {
                            if (ViewPermission == true && UpdatePermission == true) {
                                if (row.status == false) {
                                    return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu" style="z-index: 1;">
                                              <a class="dropdown-item" href=SaleOrder?soNo=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item" href='' onclick=printSaleOrder("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=PurchaseOrder?SONO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To PO</a>
                                            <a class="dropdown-item" href='' data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"SALE_ORDER","SALE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>

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
                                            <div class="dropdown-menu" role="menu" style="z-index: 1;">
                                              <a class="dropdown-item" href=SaleOrder?soNo=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; View</a>
                                              <a class="dropdown-item"  href='' onclick=printSaleOrder("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=PurchaseOrder?SONO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To PO</a>
                                              <a class="dropdown-item" href=''  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"SALE_ORDER","SALE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                }
                            }
                            else if (ViewPermission == true && UpdatePermission == false) {
                                return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu" style="z-index: 1;">
                                              <a class="dropdown-item"  href='' onclick=printSaleOrder("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=''  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"SALE_ORDER","SALE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                            }
                            else if (ViewPermission == false && UpdatePermission == false) {
                                return ``;
                            }


                        }, 'width': '3%', 'className': "text-right", 'font-size': '6px'
                    },



                ], 
                "font- size": '1em',
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        title: 'SALE ORDER REPORT',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
                        },

                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        message: '',
                        orientation: 'portrait',
                        title: 'SALE ORDER REPORT',

                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
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
                            columns: [1, 2, 3, 4, 5]
                        },
                        customize: function (list) {
                            $(list.document.body).find('table').css('font-size', '10pt');
                            $(list.document.body).find('table').css('border', '1px solid #000');
                            $(list.document.body).find('table td').css('border-left', '1px solid #000');
                            $(list.document.body).find('table td').css('border-top', '1px solid #000');
                            $(list.document.body).find('table td').css('border-right', '1px solid #000');
                            $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                        },
                        title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">SALE ORDER REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

                    },],
                "bDestroy": true,

                "paging": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "overflow- x": true,
                "responsive": true,
               
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
            formName: "SALE_ORDER",
          
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
                    'url': '/api/SO/DateWiseFilter',
                    'type': 'GET',
                    'contentType': 'application/json',
                    data: {
                        fromdate: fromdate,
                        todate: todate,
                    }
                },

                columns: [

                    {
                        'data': 'soDate', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                            var hours = moment(now).format('hh');
                            var x = Number(hours)
                            var ampm = x >= 12 ? 'PM' : 'AM';
                            dateStringWithTime = dateStringWithTime;
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '3%', 'font-size': '6px'
                    },
                    { 'data': 'soNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                    { 'data': 'pINo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },

                    { 'data': 'billCompanyname', 'defaultContent': '-', 'width': '15%', 'font-size': '6px' },
                    { 'data': 'poNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                    { 'data': 'userid', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            var amount = row.amount;
                            amount = amount.toFixed(2);
                            amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            return `<a>${amount}</a>`;
                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'soNo', 'render': function (data, type, row) {
                            return `
                              <button type="button" class="btn btn-warning ">${row.counter}</button>`
                        }, 'width': '3%', 'font-size': '6px'
                    },
                    {
                        'data': 'soNo', 'render': function (data, type, row) {

                            if (row.status == false) {
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
                        'data': 'soNo', 'render': function (data, type, row) {

                            if (ViewPermission == true && UpdatePermission == true) {
                                if (row.status == false) {
                                    return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu" style="z-index: 1;">
                                              <a class="dropdown-item" href=SaleOrder?soNo=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item"  onclick=printSaleOrder("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=PurchaseOrder?SONO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To PO</a>
                                            <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"SALE_ORDER","SALE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>

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
                                            <div class="dropdown-menu" role="menu" style="z-index: 1;">
                                              <a class="dropdown-item" href=SaleOrder?soNo=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; View</a>
                                              <a class="dropdown-item"  onclick=printSaleOrder("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=PurchaseOrder?SONO=${data}> <i class="fa fa-refresh "></i>  &nbsp; Convert To PO</a>
                                              <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"SALE_ORDER","SALE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                                }
                            }
                            else if (ViewPermission == true && UpdatePermission == false) {
                                return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu" style="z-index: 1;">
                                              <a class="dropdown-item"  onclick=printSaleOrder("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"SALE_ORDER","SALE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                            }
                            else if (ViewPermission == false && UpdatePermission == false) {
                                return ``;
                            }


                        }, 'width': '3%', 'className': "text-right", 'font-size': '6px'
                    },



                ],
                "font- size": '1em',
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excel',
                        text: '<i class="fas fa-file-excel"></i> Excel',
                        title: 'SALE ORDER REPORT',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
                        },

                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        message: '',
                        orientation: 'portrait',
                        title: 'SALE ORDER REPORT',

                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
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
                            columns: [1, 2, 3, 4, 5]
                        },
                        customize: function (list) {
                            $(list.document.body).find('table').css('font-size', '10pt');
                            $(list.document.body).find('table').css('border', '1px solid #000');
                            $(list.document.body).find('table td').css('border-left', '1px solid #000');
                            $(list.document.body).find('table td').css('border-top', '1px solid #000');
                            $(list.document.body).find('table td').css('border-right', '1px solid #000');
                            $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                        },
                        title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">SALE ORDER REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

                    },],
                "bDestroy": true,
                "lengthChange": false,
                "paging": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "overflow- x": true,
                "responsive": true,

                language: {
                    searchPlaceholder: "Search records",
                    emptyTable: "No data found",
                    width: '100%',
                },
            });
        }
    });
}

function printSaleOrder(idd) {
    window.open('../SaleOrderPrint?idd=' + idd, '_blank');
}


function fetchItems(soNo) {

    document.getElementById("sono").innerHTML = soNo,
        datatable = $("#ItemTable").DataTable({
            ajax: {
                'url': '/api/SO/viewSoItem?sono=' + soNo,
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
            /*  "dom": '<"top"i>rt<"bottom"flp><"clear">',*/
            dom: 'lBfrtip',

            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "bAutoWidth": false,
            "bDestroy": true,




        })
}

function attachments(sono) {
    document.getElementById("attachmentlabel").innerHTML = sono;
   
    var vouchername = "SALE_ORDER";
    datatable2 = $("#attachmentsTable").DataTable({
        ajax: {
            'url': '/api/Attachments/getFiledetail',
            'type': 'GET',
            'contentType': 'application/json',
            'data': {
                voucherno: sono,
                vouchername: vouchername,
            }
        },
        columns:
            [
                { 'data': null, 'defaultContent': '', 'width': '2%' },
                { 'data': 'filename', 'defaultContent': '', 'width': '60%' },
                {
                    'data': 'filename', 'render': function (data, type, row) {
                        return `
                            <a target="_blank" class="btn btn-info btn-sm" style="color:white" href="${row.url}" > <i class="fa fa-eye"></i>View</a>
                           
                                `;
                    }, 'width': '15%'
                },
            ],
        "language": {
            "emptyTable": "No data found, Please click on "
        },

        dom: 'lBfrtip',
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "bDestroy": true,
        "ordering": true,
        "info": false,
        "searching": false,
        "bAutoWidth": false,
    });
    datatable2.on('order.dt ', function () {
        datatable2.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}