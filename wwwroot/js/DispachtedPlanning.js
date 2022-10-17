
$(document).ready(function () {
    SaleOrderDatatable();

    $('#HoldTablelist, #DailylistTable, #SearchTablelist, #SaleOrderlistTable').on('click', 'tr', function () {
        $(this).toggleClass('activee');
    });
    fillcompany1('suppliername', 'Supplier');

});

function counter1(date) {
    $.ajax({
        'url': '/api/DP/counter?edate=' + date,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("saleorderlabel").innerHTML = data.data.saleorder;
                document.getElementById("dailyplanningnumber").innerHTML = data.data.dailyplanning;
                document.getElementById("waitinglabel").innerHTML = data.data.waiting;
                document.getElementById("pendinglabel").innerHTML = data.data.pendingMaterial;
                document.getElementById("cancelLabel").innerHTML = data.data.cancelled;
                document.getElementById("holdlabel").innerHTML = data.data.holdorder;
            }
        }
    })
}

function SaleOrderDatatable() {


    var now = new Date();
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('DailyDate').value = dateStringWithTime;
    var ddate = document.getElementById("DailyDate").value;
    counter1(ddate);
    document.getElementById("SaleOrderDiv").style.display = "block";

    document.getElementById("MultipleDiv").style.display = "none";
    document.getElementById("holddiv").style.display = "none";
    document.getElementById("searchdiv").style.display = "none";
    document.getElementById("TitleColor").style.backgroundColor = "#17a2b8";
    document.getElementById("TitleID").innerHTML = "Sales Order Reports"
    document.getElementById("datediv").style.display = "none";
    dataTable = $("#SaleOrderlistTable").DataTable({
        ajax: {
            'url': '/api/DP/GetSOTable',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            {
                'data': 'soNo', 'render': function (data, type, row) {

                    if (row.counter != 0) {

                        return `
                                             <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                             <a class="dropdown-item"  onclick=itemDetails("${row.soNo}",${row.amount},this) data-toggle="modal" data-target="#exampleModal1" > <i class="fa fa-cart-arrow-down"> &nbsp;</i>Item</a>
                                             <a class="dropdown-item"  onclick=action("${row.soNo}") data-toggle="modal" data-target="#exampleModal2">  <i class="fas fa-print"> &nbsp;</i>Action</a>
                                         </div> </div>
                                                 `;
                    }
                    else {
                        return `<button type="button" class="btn btn-danger">Attachment is Pending</button>`
                    }


                }, 'width': '2%'
            },
            { 'data': 'soNo', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
            {
                'data': 'soDate', 'render': function (data) {
                    var dateStringWithTime = moment(data).format('DD-MM-YYYY');
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%', 'font-size': '6px'
            },
            { 'data': 'billCompanyname', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'piNo', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            {
                'data': 'amount', 'render': function (data, type, row) {
                    var amount = row.amount;
                    amount = amount.toFixed(2);
                    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return `<a>${amount}</a>`;
                }, 'width': '1%', 'className': "text-right", 'font-size': '5px'
            },

        ],
        "font- size": '1em',
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "scrollX": true,
        "autoWidth": false,
    })

}

function itemDetails(data, amount, row) {
    /*    $('#SaleOrderlistTable').DataTable({
            // ...
            "createdRow": function (row, data, dataIndex) {            
                    $(row).css("background-color", "Orange");
                    $(row).addClass("warning");
                
            },
            // ...
        });*/
    amount = amount.toFixed(2);
    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("TotalAmount").innerHTML = amount;
    $.ajax({
        'url': '/api/SO/viewSO?sono=' + data,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('itemsonumber').value = data.data.soNo;
                document.getElementById('itemcustomername').value = data.data.billCompanyname;
                document.getElementById('itemponumber').value = data.data.poNo;
            }
        }
    });
    dataTable = $("#listTable2").DataTable({
        ajax: {

            'url': '/api/SO/viewSoItem?sono=' + data,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'itemid', 'defaultContent': '', 'font-size': '6px' },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    if (row.pmake != null) {
                        if (row.pclass == null) {
                            var html = `<span>${row.pname} &nbsp;(${row.psize}) &nbsp ${row.pmake} </span>`
                        }
                        else {
                            var html = `<span>${row.pname} &nbsp;"${row.psize}" ${row.pclass}" &nbsp ${row.pmake} </span>`
                        }
                    }
                    else {
                        if (row.pclass == null) {
                            var html = `<span>${row.pname} &nbsp;(${row.psize})</span>`
                        }
                        else {
                            var html = `<span>${row.pname} &nbsp;"${row.psize}" ${row.pclass}" </span>`
                        }
                    }
                    return html;
                }, 'width': '60%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html1 = `<a>${row.qty} ${row.rateunit} </a>`
                    return html1;
                }, 'width': '10%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right",
            },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html = `<a>₹ ${row.rate} </a>`
                    return html;
                }, 'width': '10%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right"
            },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html = `<a>${row.discount} % </a>`
                    return html;
                }, 'width': '1%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right"
            },

            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html1 = `<a>₹ ${row.discountrate.toFixed(2)}  </a>`
                    return html1;
                }, 'width': '10%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right",
            },
            {
                'data': 'amount', 'render': function (data, type, row) {
                    var html1 = `<a>₹ ${row.amount.toFixed(2)}  </a>`
                    return html1;
                }, 'width': '10%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right",
            },
            /*  { 'data': 'remarks', 'defaultContent': '-', 'width': '1%', 'font-size': '5px' },*/
            /*{ 'data': 'amount', 'defaultContent': '-', 'width': '%', 'font-size': '5px', 'className': "text-right" },*/


        ],
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,
    });
}

function clearpopup() {
    document.getElementById('sonumber').value = "";
    document.getElementById('customername').value = "";
    document.getElementById('ponumber').value = "";
    document.getElementById("ponumber").value = "";
    document.getElementById("DONO").value = "";

    document.getElementById("dispacthedlocation").value = "";
    document.getElementById("dispacthedincharge").value = "";
    document.getElementById("status").value = "";
    document.getElementById("holdreason").value = "";
    document.getElementById("remarks").value = "";
    document.getElementById("dpnumber").value = "";
    $('#suppliername').val('');
    $('#suppliername').trigger('change');
    document.getElementById("MaterialListt").style.display = "block"
    document.getElementById("savePlanning").innerHTML = "Save";
}

function action(data) {
    clearpopup();
    document.getElementById("deletePlanning").style.display = "none";

    document.getElementById('fromm').value = "SO";

    $.ajax({
        'url': '/api/DP/viewSO?sono=' + data,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('sonumber').value = data.data.soNo;

                $("#customername option[value=" + data.data.billCCode + "]").remove();
                $('#customername').append($("<option selected></option>").val(data.data.billCCode).html(data.data.billCompanyname));
                document.getElementById('ponumber').value = data.data.poNo;
                var now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                document.getElementById('dpdate').value = now.toISOString().slice(0, 16);
                document.getElementById("MaterialListt").style.display = "none"
                document.getElementById("savePlanning").innerHTML = "Save";
                document.getElementById('dpnumber').value = data.dpno;

            }

        }
    });
}

function DPaction(DPNO) {
    clearpopup();
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "DESPATCH_PLANNING",
            operation: "DELETE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                document.getElementById("deletePlanning").style.display = "block";
            } else {
                document.getElementById("deletePlanning").style.display = "none";
            }
        }
    });
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "DESPATCH_PLANNING",
            operation: "UPDATE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                document.getElementById("savePlanning").style.display = "block";
            } else {
                document.getElementById("savePlanning").style.display = "none";
            }
        }
    });
    $.ajax({
        'url': '/api/DP/viewDP?DPNO=' + DPNO,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('fromm').value = data.data.fromm;
                document.getElementById('sonumber').value = data.data.sono;
                $("#customername option[value=" + data.data.customerid + "]").remove();
                $('#customername').append($("<option selected></option>").val(data.data.customerid).html(data.data.customerName));
                document.getElementById('ponumber').value = data.data.pono;
                document.getElementById('dpdate').value = data.data.dpDate;
                document.getElementById("ponumber").value = data.data.pono;
                $("#suppliername option[value=" + data.data.supplierId + "]").remove();
                $('#suppliername').append($("<option selected></option>").val(data.data.supplierId).html(data.data.supplierName));
                document.getElementById("dispacthedlocation").value = data.data.dispachtedLocation;
                document.getElementById("dispacthedincharge").value = data.data.incharge;
                document.getElementById("status").value = data.data.status;
                if (data.data.status == "hold") {
                    document.getElementById("holdd").style.display = "block";
                } else {
                    document.getElementById("holdd").style.display = "none";
                }
                document.getElementById("holdreason").value = data.data.holdReason;
                document.getElementById("remarks").value = data.data.remarks;
                document.getElementById("dpnumber").value = data.data.dpNo;
                document.getElementById("DONO").value = data.data.dono;
                document.getElementById("MaterialListt").style.display = "block"
                if (data.data.dpstatus == 1) {
                    document.getElementById("savePlanning").disabled = true;
                    document.getElementById("deletePlanning").disabled = true;

                }
                else {
                    document.getElementById("savePlanning").disabled = false;
                    document.getElementById("deletePlanning").disabled = false;
                }

                document.getElementById("savePlanning").innerHTML = "Update";
            }
        }
    });


}

function DPHoldaction(DPNO) {
    clearpopup();
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('dpdate').value = now.toISOString().slice(0, 16);
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "DESPATCH_PLANNING",
            operation: "DELETE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                document.getElementById("deletePlanning").style.display = "block";
            } else {
                document.getElementById("deletePlanning").style.display = "none";
            }
        }
    });
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "DESPATCH_PLANNING",
            operation: "UPDATE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                document.getElementById("savePlanning").style.display = "block";
            } else {
                document.getElementById("savePlanning").style.display = "none";
            }
        }
    });
    $.ajax({
        'url': '/api/DP/viewDP?DPNO=' + DPNO,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('fromm').value = data.data.fromm;
                document.getElementById('sonumber').value = data.data.sono;
                $("#customername option[value=" + data.data.customerid + "]").remove();
                $('#customername').append($("<option selected></option>").val(data.data.customerid).html(data.data.customerName));
                document.getElementById('ponumber').value = data.data.pono;
                document.getElementById("ponumber").value = data.data.pono;
                $("#suppliername option[value=" + data.data.supplierId + "]").remove();
                $('#suppliername').append($("<option selected></option>").val(data.data.supplierId).html(data.data.supplierName));
                document.getElementById("dispacthedlocation").value = data.data.dispachtedLocation;
                document.getElementById("dispacthedincharge").value = data.data.incharge;
                document.getElementById("status").value = data.data.status;
                if (data.data.status == "hold") {
                    document.getElementById("holdd").style.display = "block";
                } else {
                    document.getElementById("holdd").style.display = "none";
                }
                document.getElementById("holdreason").value = data.data.holdReason;
                document.getElementById("remarks").value = data.data.remarks;
                document.getElementById("dpnumber").value = data.data.dpNo;
                document.getElementById("DONO").value = data.data.dono;
                document.getElementById("MaterialListt").style.display = "block"
                if (data.data.dpstatus == 1) {
                    document.getElementById("savePlanning").disabled = true;
                    document.getElementById("deletePlanning").disabled = true;

                }
                else {
                    document.getElementById("savePlanning").disabled = false;
                    document.getElementById("deletePlanning").disabled = false;
                }

                document.getElementById("savePlanning").innerHTML = "Update";
            }
        }
    });


}

function PendingMaterialAction(data) {
    clearpopup();
    var now = new Date();
    document.getElementById("deletePlanning").style.display = "none";
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('dpdate').value = now.toISOString().slice(0, 16);
    document.getElementById('fromm').value = "PENDING";
    $.ajax({
        'url': '/api/DP/DPNO',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            document.getElementById('dpnumber').value = data.data;
        }
    })
    $.ajax({
        'url': '/api/DP/viewDP?DPNO=' + data,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('sonumber').value = data.data.sono;
                $("#customername option[value=" + data.data.customerid + "]").remove();
                $('#customername').append($("<option selected></option>").val(data.data.customerid).html(data.data.customerName));
                document.getElementById('ponumber').value = data.data.pono;
                $("#suppliername option[value=" + data.data.supplierId + "]").remove();
                $('#suppliername').append($("<option selected></option>").val(data.data.supplierId).html(data.data.supplierName));
                document.getElementById("dispacthedlocation").value = data.data.dispachtedLocation;
                document.getElementById("dispacthedincharge").value = data.data.incharge;
                document.getElementById("status").value = data.data.status;
                if (data.data.status == "hold") {
                    document.getElementById("holdd").style.display = "block";
                } else {
                    document.getElementById("holdd").style.display = "none";
                }
                document.getElementById("holdreason").value = data.data.holdReason;
                document.getElementById("DONO").value = data.data.dono;
                document.getElementById("remarks").value = data.data.remarks;
                document.getElementById("MaterialListt").style.display = "block"

            }
        }
    })


}

function holdorder() {
    document.getElementById("datediv").style.display = "none";
    document.getElementById("TitleColor").style.backgroundColor = "#ffc107";
    document.getElementById("TitleID").innerHTML = "Hold Order Report"
    document.getElementById("SaleOrderDiv").style.display = "none";
    document.getElementById("SaleOrderDiv").style.display = "none";
    document.getElementById("MultipleDiv").style.display = "none";
    document.getElementById("searchdiv").style.display = "none";
    document.getElementById("datediv").style.display = "none";
    document.getElementById("holddiv").style.display = "block";

    dataTable = $("#HoldTablelist").DataTable({
        ajax: {
            'url': '/api/DP/GetHoldTable',
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
                .column(10)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var ttamount = total;
            ttamount = ttamount.toFixed(2);
            ttamount = ttamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");



            // Update footer
            $(api.column(10).footer()).html(
                '' + '₹' + ttamount + ' '
            );
        },
        columns: [
            { 'data': 'sr', 'defaultContent': '-', 'font-size': '20px', 'width': '1%' },
            {
                'data': 'dpNo', 'render': function (data) {
                    return `   <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a class="dropdown-item"  onclick=DPitemDetails("${data}",this) data-toggle="modal" data-target="#exampleModal1" > <i class="fa fa-cart-arrow-down"> &nbsp;</i>Item</a>
                                              <a class="dropdown-item"  onclick=DPHoldaction("${data}") data-toggle="modal" data-target="#exampleModal2">  <i class="fas fa-print"> &nbsp;</i>Action</a>
                                            </div>
                                </div>
                        `;
                }, 'width': '3%'
            },
            {
                'data': 'dldate', 'render': function (data) {
                    var dateStringWithTime = moment(data).format('YYYY-MM-DD');
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '5%'
            },
            {
                'data': 'poDate', 'render': function (data) {
                    var dateStringWithTime = moment(data).format('YYYY-MM-DD');
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '3%',
            },
            { 'data': 'pono', 'defaultContent': '-', "width": "3%", 'font-size': '20px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'destination', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'supplierName', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'materialsource', 'defaultContent': '-', 'width': '3%' },
            { 'data': 'incharge', 'defaultContent': '-', 'width': '10%' },
            {
                'data': 'amount', 'render': function (data, type, row) {
                    var amount = row.amount;
                    amount = amount.toFixed(2);
                    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return `<a>${amount}</a>`;
                }, 'width': '1%', 'className': "text-right",
            },
            { 'data': 'remarks', 'defaultContent': '-', 'width': '5%' },


        ],
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'HOLD ORDER REPORT',
                exportOptions: {
                    columns: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'landscape',
                title: 'HOLD ORDER REPORT',

                exportOptions: {
                    columns: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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

                columns: ':not(.select-checkbox)',
                orientation: 'landscape',
                exportOptions: {
                    columns: [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
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
                    var companyname = document.getElementById('companyname1').innerHTML;
                    return pnsdo()
                    function pnsdo() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">HOLD ORDER REPORT</h3></div><div style="text-align:center;font-size:13px;"><br />${companyname}</div>`
                    }



                }
            },],
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "info": false,
        "scrollX": true,
        "autoWidth": true,
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
        },
    });

}

function cancelOrder() {

    document.getElementById("TitleColor").style.backgroundColor = "#dc3545";
    document.getElementById("TitleID").innerHTML = "Cancel Order Report"
    document.getElementById("SaleOrderDiv").style.display = "none";
    document.getElementById("searchdiv").style.display = "none";
    document.getElementById("MultipleDiv").style.display = "block";
    document.getElementById("holddiv").style.display = "none";
    document.getElementById("datediv").style.display = "none";
    dataTable = $("#DailylistTable").DataTable({

        ajax: {
            'url': '/api/DP/GetCancelTable',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            {
                'data': 'dpNo', 'render': function (data) {
                    return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                            <a class="dropdown-item"  onclick=DPitemDetails("${data}") data-toggle="modal" data-target="#exampleModal1" > <i class="fa fa-cart-arrow-down"> &nbsp;</i>Item</a>
                                            <a class="dropdown-item"  onclick=DPaction("${data}") data-toggle="modal" data-target="#exampleModal2">  <i class="fas fa-print"> &nbsp;</i>Action</a>
                                            </div> </div>
                        `;
                }, 'width': '8%'
            },
            {
                'data': 'dpDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '2%', 'font-size': '6px'
            },
            { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
            { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'deliveryaddress', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'supplierName', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'dispachtedLocation', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'incharge', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'remarks', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            {
                'data': 'amount', 'render': function (data, type, row) {
                    var amount = row.amount;
                    amount = amount.toFixed(2);
                    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return `<a>${amount}</a>`;
                }, 'width': '1%', 'font-size': '5px'
            },

        ],
        "font- size": '1em',
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": false,
        "info": false,
        "scrollX": true,
        "autoWidth": false,
    })
}

function PendingMaterialOrder() {

    document.getElementById("datediv").style.display = "none";
    document.getElementById("TitleColor").style.backgroundColor = "#28a745";
    document.getElementById("TitleID").innerHTML = "Pending Material"
    document.getElementById("SaleOrderDiv").style.display = "none";
    document.getElementById("holddiv").style.display = "none";
    document.getElementById("searchdiv").style.display = "none";
    document.getElementById("MultipleDiv").style.display = "block";

    var now = new Date();
    var ddate = moment(now).format('YYYY-MM-DDT00:00:00');
    dataTable = $("#DailylistTable").DataTable({
        ajax: {
            'url': '/api/DP/GetPendingMaterial?edate=' + ddate,
            'type': 'GET',
            'contentType': 'application/json',
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
                .column(10)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var ttamount = total;
            ttamount = ttamount.toFixed(2);
            ttamount = ttamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");



            // Update footer
            $(api.column(10).footer()).html(
                '' + '₹' + ttamount + ' '
            );
        },
        columns: [
            {
                'data': 'dpNo', 'render': function (data) {

                    return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                            <a class="dropdown-item"  onclick=DPitemDetails1("${data}") data-toggle="modal" data-target="#exampleModal1" > <i class="fa fa-cart-arrow-down"> &nbsp;</i>Item</a>
                                           <a class="dropdown-item"   onclick=PendingMaterialAction("${data}") data-toggle="modal" data-target="#exampleModal2">  <i class="fas fa-print"> &nbsp;</i>Action</a>
                                            </div> </div>
`;
                }, 'width': '8%'
            },
            {
                'data': 'dpDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '8%', 'font-size': '6px'
            },
            { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
            { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'deliveryaddress', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'supplierName', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'dispachtedLocation', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'incharge', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'remarks', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            {
                'data': 'amount', 'render': function (data, type, row) {
                    var amount = row.amount;
                    amount = amount.toFixed(2);
                    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return `<a>${amount}</a>`;
                }, 'width': '1%', 'font-size': '5px'
            },

        ],
        "font- size": '1em',
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "scrollX": true,
        "autoWidth": false,
    });
}

function saveplanning() {
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
    var counter = 0;
    var status = document.getElementById("status").value;
    var Holdreason = document.getElementById("holdreason").value;
    var remarks = document.getElementById("remarks").value;
    if (status == "" || status == "--Select Status--") {
        counter = counter + 1;
    }
    if (status == "hold") {
        if (Holdreason == "" || Holdreason == "--Select Hold Reason--") {
            counter = counter + 1;
        }
        if (remarks == "") {
            counter = counter + 1;
        }
    }
    if (counter == 0) {
        var dpdate = document.getElementById("dpdate").value;
        var pono = document.getElementById("ponumber").value;
        var sono = document.getElementById("sonumber").value;
        var DPNO = document.getElementById("dpnumber").value;
        var customerName = document.getElementById("customername").selectedOptions[0].text;
        var customerID = document.getElementById("customername").value;
        var supplierName = document.getElementById("suppliername").selectedOptions[0].text;
        var supplierID = document.getElementById("suppliername").value;

        var DispatchLocation = document.getElementById("dispacthedlocation").value;
        var Incharge = document.getElementById("dispacthedincharge").value;
        var type = document.getElementById("savePlanning").innerHTML;

        var dono = document.getElementById("DONO").value;

        var frm = document.getElementById('fromm').value;
        if (frm == "SO") {
            var url = "api/DP/saveplanning?type=" + type;
        }
        else if (frm == "PENDING") {
            var url = "api/DP/saveplanningPending?type=" + type;
        }
        $.ajax({
            type: 'Post',
            url: url,
            data: {
                DPNo: DPNO,
                DPDate: dpdate,
                PONO: pono,
                dono: dono,
                SONO: sono,
                CustomerName: customerName,
                Customerid: customerID,
                SupplierName: supplierName,
                SupplierId: supplierID,
                DispachtedLocation: DispatchLocation,
                Incharge: Incharge,
                Status: status,
                HoldReason: Holdreason,
                Remarks: remarks,
                Fromm: frm,
            },
            success: function (data) {

                if (data.success) {
                    var ddate = document.getElementById("DailyDate").value;
                    counter1(ddate);

                    document.getElementById("savePlanning").innerHTML = "Update";
                    document.getElementById("MaterialListt").style.display = "block";
                    document.getElementById("dpnumber").value = data.data;
                    if (document.getElementById("SaleOrderDiv").style.display == "block") {
                        $('#SaleOrderlistTable').DataTable().ajax.reload();
                    }
                    if (document.getElementById("MultipleDiv").style.display == "block") {
                        $('#DailylistTable').DataTable().ajax.reload();
                    }
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully saved'
                    })

                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: data.message,
                    })
                }
            }
        });
    }
    else {
        if (status == "" || status == "--Select Status--") {
            document.getElementById("status").style.borderColor = "red";
        } else {
            if (Holdreason == "" || Holdreason == "--Select Hold Reason--") {
                document.getElementById("holdreason").style.borderColor = "red";
                if (status == "hold" && remarks == "") {
                    document.getElementById("remarks").style.borderColor = "red";
                }
            }
        }

        Toast.fire({
            icon: 'error',
            title: 'Complete the details',
        })
    }
}

function materialList() {

    var dpno = document.getElementById("dpnumber").value;

    dataTable = $("#DispatchList").DataTable({
        ajax: {
            'url': '/api/DP/GetDispatchMaterial?DPNO=' + dpno,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'itemid', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   &nbsp(${row.pmake}) </a>`
                    return html1;
                }, 'width': '50%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },
            { 'data': 'qty', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'qty', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'qty', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            {
                'data': 'itemid', 'render': function (data) {
                    if (document.getElementById("savePlanning").disabled == true) {
                        return `<a class="btn btn-info btn-sm" style="color:white" )  > <i class="fa fa-cart-arrow-down"> &nbsp;</i>Edit</a>
                        <a class="btn btn-danger btn-sm" style="color:white" disabled  >  <i class="fas fa-minus"> &nbsp;</i></a>
                        `;
                    }
                    else {
                        return `<a class="btn btn-info btn-sm" style="color:white" )  > <i class="fa fa-cart-arrow-down"> &nbsp;</i>Edit</a>
                        <a class="btn btn-danger btn-sm" style="color:white"  onclick=holditem("${data}")>  <i class="fas fa-minus"> &nbsp;</i></a>
                        `;
                    }

                }, 'width': '16%'
            },
        ],

        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,
    });
}

function HoldmaterialList() {
    var dpno = document.getElementById("dpnumber").value;

    dataTable = $("#holdorderList").DataTable({
        ajax: {
            'url': '/api/DP/GetHoldMaterial?DPNO=' + dpno,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'itemid', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   &nbsp(${row.pmake}) </a>`
                    return html1;
                }, 'width': '70%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },
            { 'data': 'qty', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            {
                'data': 'itemid', 'render': function (data) {
                    if (document.getElementById("savePlanning").disabled == true) {
                        return `<a class="btn btn-info btn-sm" style="color:white"> <i class="fas fa-minus"></i></a>`;
                    }
                    else {
                        return `<a class="btn btn-info btn-sm" style="color:white" onclick="unholditem(${data})" > <i class="fas fa-minus"></i></a>`;
                    }

                }, 'width': '8%'
            },
        ],
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,
    });
}

function HoldmaterialListt() {
  var  dataTable = $("#HoldMaterialList").DataTable({
        ajax: {
            'url': '/api/DP/GetHoldMateriall',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            { 'data': 'companyname', 'defaultContent': '-', 'width': '30%', 'font-size': '5px' },
            { 'data': 'pono', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            {
                'data': 'pname', 'render': function (data, type, row) {
                    var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   &nbsp(${row.pmake}) </a>`
                    return html1;
                }, 'width': '70%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },
            {
                'data': 'qty', 'render': function (data, type, row) {
                    return `<a>${row.qty} ${row.qtyunit}</a>`
                }, 'width': '10%', 'font-size': '5px', 'className': "text-right"
            },
        ],
        "font- size": '1em',
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "scrollX": true,
        "autoWidth": false,
    });
    dataTable.on('order.dt', function () {
        dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}


function unholditem(itemid) {
    var DPNO = document.getElementById("dpnumber").value;
    $.ajax({
        type: 'Post',
        url: "api/DP/Unholditem",
        data: {
            dpno: DPNO,
            itemid: itemid,
        },
        success: function (data) {
            if (data.success) {

                $('#holdorderList').DataTable().ajax.reload();
                Toast.fire({
                    icon: 'success',
                    title: 'Successfully unhold'
                })

            }
            else {
                Toast.fire({
                    icon: 'error',
                    title: data.message,
                })
            }
        }
    });
}

function holditem(itemid) {
    var DPNO = document.getElementById("dpnumber").value;
    $.ajax({
        type: 'Post',
        url: "api/DP/holditem",
        data: {
            dpno: DPNO,
            itemid: itemid,
        },
        success: function (data) {
            if (data.success) {
                $('#DispatchList').DataTable().ajax.reload();

                Toast.fire({
                    icon: 'success',
                    title: 'Successfully Hold'
                })

            }
            else {
                Toast.fire({
                    icon: 'error',
                    title: data.message,
                })
            }
        }
    })
}

function holdreason() {
    var status = document.getElementById("status").value;
    if (status == "hold") {
        document.getElementById("holdd").style.display = "block";
    }
    else {
        document.getElementById("holdd").style.display = "none";
    }
}

function DailyPlanningReport() {

    document.getElementById("SaleOrderDiv").style.display = "none";
    document.getElementById("holddiv").style.display = "none";
    document.getElementById("searchdiv").style.display = "none";

    document.getElementById("MultipleDiv").style.display = "block";
    document.getElementById("datediv").style.display = "block";
    document.getElementById("TitleColor").style.backgroundColor = "#FF00FC";
    document.getElementById("TitleID").innerHTML = "Daily Despatch Planning Report"

    DailyPlanningReportview();
}

function DailyPlanningReportview() {
    var ddate = document.getElementById("DailyDate").value;
    var ddate = moment(ddate).format('YYYY-MM-DDT00:00:00');
    counter1(ddate);
    dataTable = $("#DailylistTable").DataTable({
        ajax: {
            'url': '/api/DP/GetDailyDispatchTable',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                edate: ddate,
            }
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
                .column(9)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var ttamount = total;
            ttamount = ttamount.toFixed(2);
            ttamount = ttamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // Update footer
            $(api.column(9).footer()).html(
                '' + '₹' + ttamount + ' '
            );
        },
        columns: [
            {
                'data': 'dpNo', 'render': function (data, type, row) {
                    return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                             <a class="dropdown-item" onclick=DPitemDetails("${data}") data-toggle="modal" data-target="#exampleModal1" > <i class="fa fa-cart-arrow-down"> &nbsp;</i>Item</a>
                        <a class="dropdown-item" onclick=DPaction("${data}") data-toggle="modal" data-target="#exampleModal2">  <i class="fas fa-print"> &nbsp;</i>Action</a>
                        <a class="dropdown-item"  onClick=printSaleOrder("${row.sono}")> <i class="fas fa-print"> &nbsp;</i>View SO</a>
                                            </div> </div>`;
                }, 'width': '3%',
            },
            {
                'data': 'dpDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '2%', 'font-size': '6px'
            },
            { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
            { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'deliveryaddress', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'supplierName', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'dispachtedLocation', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'incharge', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            {
                'data': 'amount', 'render': function (data, type, row) {
                    var amount = row.amount;
                    amount = amount.toFixed(2);
                    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return `<a>₹ ${amount}</a>`;
                }, 'width': '5%', 'font-size': '5px', 'className': "text-right"
            },
            { 'data': 'remarks', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },


        ],
        "font- size": '1em',
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "scrollX": true,
        "autoWidth": false,
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'DAILY DESPATCH PLANNING REPORT',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },

            },
            {
                extend: 'pdfHtml5', footer: true,
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'landscape',
                title: 'DAILY DESPATCH PLANNING REPORT',

                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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

                columns: ':not(.select-checkbox)',
                orientation: 'landscape',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
                    var ddate = document.getElementById("DailyDate").value;
                    var ddate = moment(ddate).format('DD-MMM-YYYY');
                    var companyname = document.getElementById('companyname1').innerHTML;
                    return printt()
                    function printt() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">DAILY DESPATCH PLANNING REPORT</h3> <h6>${ddate}</h6> </div><div style="text-align:center;font-size:13px;">${companyname}</div>`
                    }
                }
            },],
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    })
}
function printSaleOrder(idd) {
    window.open('../SaleOrder?soNo=' + idd, '_blank');
}

function WaitingDespatchReport() {
    document.getElementById("datediv").style.display = "none";
    document.getElementById("SaleOrderDiv").style.display = "none";
    document.getElementById("searchdiv").style.display = "none";
    document.getElementById("MultipleDiv").style.display = "block";
    document.getElementById("holddiv").style.display = "none";

    document.getElementById("TitleColor").style.backgroundColor = "#A52B2A";
    document.getElementById("TitleID").innerHTML = "Balance to Despatch Order"

    dataTable = $("#DailylistTable").DataTable({

        ajax: {
            'url': '/api/DP/WaitingDespatchReport',
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
                .column(10)
                .data()
                .reduce(function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0);

            var ttamount = total;
            ttamount = ttamount.toFixed(2);
            ttamount = ttamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");



            // Update footer
            $(api.column(10).footer()).html(
                '' + '₹' + ttamount + ' '
            );
        },
        columns: [
            {
                'data': 'dpNo', 'render': function (data) {
                    return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                           <a class="dropdown-item"  onclick=DPitemDetails("${data}") data-toggle="modal" data-target="#exampleModal1" > <i class="fa fa-cart-arrow-down"> &nbsp;</i>Item</a>
                                           <a class="dropdown-item"   onclick=DPaction("${data}") data-toggle="modal" data-target="#exampleModal2">  <i class="fas fa-print"> &nbsp;</i>Action</a>
                                            </div> </div>
                        `;
                }, 'width': '8%'
            },
            {
                'data': 'dpDate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '2%', 'font-size': '6px'
            },
            { 'data': 'sono', 'defaultContent': '-', 'width': '3%', 'font-size': '6px' },
            { 'data': 'pono', 'defaultContent': '-', 'width': '5%', 'font-size': '5px' },
            { 'data': 'customerName', 'defaultContent': '-', 'width': '20%', 'font-size': '5px' },
            { 'data': 'deliveryaddress', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'supplierName', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'dispachtedLocation', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'incharge', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            { 'data': 'remarks', 'defaultContent': '-', 'width': '10%', 'font-size': '5px' },
            {
                'data': 'amount', 'render': function (data, type, row) {
                    var amount = row.amount;
                    amount = amount.toFixed(2);
                    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return `<a>${amount}</a>`;
                }, 'width': '1%', 'font-size': '5px', 'className': "text-right"
            },

        ],
        "font- size": '1em',
        "font- size": '1em',
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "scrollX": true,
        "autoWidth": false,
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'WATING ORDER REPORT',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'landscape',
                title: 'WATING ORDER REPORT',

                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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

                columns: ':not(.select-checkbox)',
                orientation: 'landscape',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
                    var companyname = document.getElementById('companyname1').innerHTML;
                    return printt()
                    function printt() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">WATING ORDER REPORT</h3> </div><div style="text-align:center;font-size:13px;">${companyname}</div>`
                    }
                }

            },],

        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },

    })
}

function DPitemDetails(data) {
    $.ajax({
        'url': '/api/DP/viewDP?DPNO=' + data,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('itemsonumber').value = data.data.sono;
                document.getElementById('itemcustomername').value = data.data.customerName;
                document.getElementById('itemponumber').value = data.data.pono;
                var amount = data.data.amount;
                amount = amount.toFixed(2);
                amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('TotalAmount').innerHTML = amount;
                document.getElementById("DONO").value = data.data.dono;
            }

        }
    });
    dataTable = $("#listTable2").DataTable({
        ajax: {

            'url': '/api/DP/viewDPItem?DPNO=' + data,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'itemid', 'defaultContent': '', 'font-size': '6px' },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    if (row.pmake != null) {
                        if (row.pclass == null) {
                            var html = `<span>${row.pname} &nbsp;(${row.psize}) &nbsp ${row.pmake} </span>`
                        }
                        else {
                            var html = `<span>${row.pname} &nbsp;"${row.psize}" ${row.pclass}" &nbsp ${row.pmake} </span>`
                        }
                    }
                    else {
                        if (row.pclass == null) {
                            var html = `<span>${row.pname} &nbsp;(${row.psize})</span>`
                        }
                        else {
                            var html = `<span>${row.pname} &nbsp;"${row.psize}" ${row.pclass}" </span>`
                        }
                    }
                    return html;
                }, 'width': '30%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html1 = `<a>${row.qty.toFixed(2)} ${row.rateunit} </a>`
                    return html1;
                }, 'width': '20%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right",
            },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html = `<a>₹ ${row.rate} </a>`
                    return html;
                }, 'width': '20%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right"
            },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html = `<a>${row.discount} % </a>`
                    return html;
                }, 'width': '20%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right"
            },

            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html1 = `<a>₹ ${row.discountrate}  </a>`
                    return html1;
                }, 'width': '20%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right",
            },

            {
                'data': 'amount', 'render': function (data, type, row) {
                    var html = `<a>${row.amount.toFixed(2)}</a>`
                    return html;
                }
                , 'width': '20%', 'font-size': '5px', 'className': "text-right"
            },


        ],
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,
    });
}

function DPitemDetails1(data) {
    $.ajax({
        'url': '/api/DP/viewDP1?DPNO=' + data,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('itemsonumber').value = data.data.sono;
                document.getElementById('itemcustomername').value = data.data.customerName;
                document.getElementById('itemponumber').value = data.data.pono;
                var amount = data.data.amount;
                amount = amount.toFixed(2);
                amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('TotalAmount').innerHTML = amount;

            }

        }
    });
    dataTable = $("#listTable2").DataTable({
        ajax: {

            'url': '/api/DP/viewDPItem1?DPNO=' + data,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'itemid', 'defaultContent': '', 'font-size': '6px' },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    if (row.pclass == null) {
                        var html = `<span>${row.pname} &nbsp;(${row.psize}) &nbsp ${row.pmake} </span>`

                    }


                    else if (row.pmake == null) {
                        var html = `<span>${row.pname} &nbsp;"${row.psize}" ${row.pclass} </span>`
                    }

                    else {
                        var html = `<span>${row.pname} &nbsp;"${row.psize}" ${row.pclass}" &nbsp ${row.pmake} </span>`
                    }
                    return html;
                }, 'width': '30%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html1 = `<a>${row.qty.toFixed(2)} ${row.rateunit} </a>`
                    return html1;
                }, 'width': '20%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right",
            },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html = `<a>₹ ${row.rate.toFixed(2)} </a>`
                    return html;
                }, 'width': '20%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right"
            },
            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html = `<a>${row.discount} % </a>`
                    return html;
                }, 'width': '20%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right"
            },

            {
                'data': 'itemid', 'render': function (data, type, row) {
                    var html1 = `<a>₹ ${row.discountrate.toFixed(2)}  </a>`
                    return html1;
                }, 'width': '20%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right",
            },

            {
                'data': 'amount', 'render': function (data, type, row) {
                    var html1 = `<a>₹ ${row.amount.toFixed(2)}  </a>`
                    return html1;
                }, 'width': '20%', 'font-size': '5px', 'className': "text-right"
            },


        ],
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,
    });
}

function deleteplanning() {
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
    var sono = document.getElementById("sonumber").value;
    var DPNO = document.getElementById("dpnumber").value;
    var frm = document.getElementById('fromm').value;
    var dono = document.getElementById("DONO").value;
    var url = "api/DP/deletePlannings";
    $.ajax({
        type: 'Delete',
        url: url,
        data: {
            frm: frm,
            sono: sono,
            DPNO: DPNO,
            dono: dono,
        },
        success: function (data) {
            var now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            var dateStringWithTime = moment(now).format('YYYY-MM-DD');
            document.getElementById('DailyDate').value = dateStringWithTime;
            var ddate = document.getElementById("DailyDate").value;
            counter1(ddate);
            if (document.getElementById("holddiv").style.display == "block") {
                $('#HoldTablelist').DataTable().ajax.reload();
            }

            if (document.getElementById("SaleOrderDiv").style.display == "block") {
                $('#SaleOrderlistTable').DataTable().ajax.reload();
            }
            if (document.getElementById("MultipleDiv").style.display == "block") {
                $('#DailylistTable').DataTable().ajax.reload();
            }

            if (document.getElementById("searchdiv").style.display == "block") {
                $('#SearchTablelist').DataTable().ajax.reload();
            }

            if (data.success) {
                Toast.fire({
                    icon: 'success',
                    title: 'Successfully saved'
                })

            }
            else {
                Toast.fire({
                    icon: 'error',
                    title: data.message,
                })
            }
        }
    });
}

function attachments() {
    var voucherno = document.getElementById("sonumber").value;
    var vouchername = "SALE_ORDER";
    datatable2 = $("#attachmentsTable").DataTable({
        ajax: {
            'url': '/api/Attachments/getFiledetail',
            'type': 'GET',
            'contentType': 'application/json',
            'data': {
                voucherno: voucherno,
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
            "emptyTable": "No Attachment Found "
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
function SearchOperation() {
    document.getElementById("TitleColor").style.backgroundColor = "#ffc107";
    document.getElementById("TitleID").innerHTML = "Search Record"
    document.getElementById("datediv").style.display = "none";
    document.getElementById("SaleOrderDiv").style.display = "none";
    document.getElementById("MultipleDiv").style.display = "none";
    document.getElementById("datediv").style.display = "none";
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