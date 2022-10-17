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

function LoadDatatable() {

    var ViewPermission = false;
    var UpdatePermission = false;

    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "PURCHASE_ORDER",
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

            dataTable = $("#listTable").DataTable({
                ajax: {
                    'url': '/api/PO/GetPOTable',
                    'type': 'GET',
                    'contentType': 'application/json'
                },

                columns: [
                    {
                        'data': 'date', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                            var hours = moment(now).format('hh');
                            var x = Number(hours)
                            var ampm = x >= 12 ? 'PM' : 'AM';
                            dateStringWithTime = dateStringWithTime;
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '5%', 'font-size': '6px'
                    },

                    { 'data': 'poNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },
                    

                    { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '20%', 'font-size': '6px' },
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
                        'data': 'poNo', 'render': function (data, type, row) {

                            if (ViewPermission == true && UpdatePermission == true) {
                               
                                    return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item" href=PurchaseOrder?PONO=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item"  onclick=printPO("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=PurchaseItems?PONO=${data} ><i class="fa fa-clone" ></i> &nbsp; Convert To PR</a>
                                              <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PURCHASE_ORDER","PURCHASE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                               
                               
                            }
                            else if (ViewPermission == true && UpdatePermission == false) {
                                return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"  onclick=printPO("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                             <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PURCHASE_ORDER","PURCHASE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                            }
                            else   {
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
                        title: 'PURCHASE ORDER REPORT',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
                        },

                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        message: '',
                        orientation: 'portrait',
                        title: 'PURCHASE ORDER REPORT',

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
                        title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">PURCHASE ORDER REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

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
            formName: "PURCHASE_ORDER",
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

            dataTable = $("#listTable").DataTable({
                ajax: {
                    'url': '/api/PO/DateWiseFilter',
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
                            var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                            var hours = moment(now).format('hh');
                            var x = Number(hours)
                            var ampm = x >= 12 ? 'PM' : 'AM';
                            dateStringWithTime = dateStringWithTime;
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '5%', 'font-size': '6px'
                    },

                    { 'data': 'poNo', 'defaultContent': '-', 'width': '4%', 'font-size': '6px' },


                    { 'data': 'supplierCompanyname', 'defaultContent': '-', 'width': '20%', 'font-size': '6px' },
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
                        'data': 'poNo', 'render': function (data, type, row) {

                            if (ViewPermission == true && UpdatePermission == true) {

                                return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item" href=PurchaseOrder?PONO=${data}> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a class="dropdown-item"  onclick=printPO("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                              <a class="dropdown-item" href=PurchaseItems?PONO=${data} ><i class="fa fa-clone" ></i> &nbsp; Convert To PR</a>
                                              <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PURCHASE_ORDER","PURCHASE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;


                            }
                            else if (ViewPermission == true && UpdatePermission == false) {
                                return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"  onclick=printPO("${data}") target="_blank"><i class="fas fa-print"></i> &nbsp; Print</a>
                                             <a class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"PURCHASE_ORDER","PURCHASE_ORDER",2)> <i class="fa fa-history"></i>&nbsp; Logs</a>
                                            </div>
                                          </div>&nbsp;&nbsp;
                                         <i data-toggle="modal" onclick=fetchItems("${data}") data-target="#ItemsModel" class="fa fa-arrow-right" ></i>`;
                            }
                            else {
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
                        title: 'PURCHASE ORDER REPORT',
                        exportOptions: {
                            columns: [1, 2, 3, 4, 5],
                        },

                    },
                    {
                        extend: 'pdfHtml5',
                        text: '<i class="fas fa-file-pdf"></i> PDF',
                        message: '',
                        orientation: 'portrait',
                        title: 'PURCHASE ORDER REPORT',

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
                        title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">PURCHASE ORDER REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

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



function printPO(idd) {

    window.open('../PurchaseOrderPrint?idd=' + idd, '_blank');

}


function ConvertPR(poNo) {

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

function fetchItems(poNo) {

    document.getElementById("pono").innerHTML = poNo,
        datatable = $("#ItemTable").DataTable({
            ajax: {

                'url': '/api/PO/getitemByPONO?PoNo=' + poNo,
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
                        }, 'width': '40%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                    },
                    { 'data': 'rateunit', 'defaultContent': '', 'width': '5%' },
                    { 'data': 'rate', 'defaultContent': '', 'width': '5%' },

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
            "bDestroy": true,
        });
}