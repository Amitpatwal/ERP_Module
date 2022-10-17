$(document).ready(function () {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('fromdate').value = moment(now).format('YYYY-MM-DD');
    document.getElementById('todate').value = moment(now).format('YYYY-MM-DD');
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " - " + dateStringWithTime;
    LoadDatatable()
    $('#MiniAmt, #MaxAmt').keyup(function () {
        dataTable.draw();
    });
    $('#listTable').on('click', 'tr', function () {
        $(this).toggleClass('activee');
    });
    fillcompany1('companyname', 'Customer');
    fillcompany1('transportname', 'Transporter');
});

function LoadDatatable() {
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var UpdatePermission = false;
    var DeletePermission = false;
    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "SALE",
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
                UpdatePermission = data.data[2].permission
            }
            if (data.data[0].operations == "VIEW") {
                ViewPermission = data.data[0].permission
            }
            if (data.data[3].operations == "DELETE") {
                DeletePermission = data.data[0].permission
            }

            dataTable = $("#listTable").DataTable({
                ajax: {
                    'url': '/api/SALES/SalesList',
                    data: {
                        fromdate: fromdate,
                        todate: todate,
                    },
                    'type': 'GET',
                    'contentType': 'application/json'
                },
                columns: [
                    { 'data': null, 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
                    { 'data': 'invoiceNO', 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
                    {
                        'data': 'date', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('YY-MMM-DD');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '5%', 'font-size': '6px'
                    },
                    { 'data': 'companyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    { 'data': 'pono', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    {
                        'data': 'pOdate', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('YY-MM-DD');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '5%', 'font-size': '6px'
                    },
                    {
                        'data': 'pterm', 'render': function (data) {
                            return `<a>${data} days</a>`;

                        }, 'width': '10%', 'font-size': '6px'
                    },
                    {
                        'data': 'paymentStatus', 'render': function (data, type, row) {
                            if (data == true) {
                                return `<button type="button" class="btn btn-success">Paid</button>`;
                            }
                            else {
                                return `<button type="button" class="btn btn-danger">Pending</button>`;
                            }
                        }, 'width': '5%', 'font-size': '6px'
                    },
                    {
                        'data': 'debit', 'render': function (data, type, row) {
                            return `<a>${data.toFixed(2)}</a>`;
                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },

                    {
                        'data': 'invoiceNO', 'render': function (data, type, row) {
                            if (UpdatePermission == true && DeletePermission == true) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal1" onclick=fillSaleDetail("${data}")> <i class="fas fa-pencil-alt"></i>Edit</a>
                                        <a class="btn btn-danger btn-sm" style="color:white" onclick=DeleteSales("${data}")>  <i class="fa fa-trash"></i> Delete</a>`;
                            }
                            else if (UpdatePermission == true && DeletePermission == false) {
                                return `<a class="btn btn-danger btn-sm" style="color:white" onclick=DeleteSales("${data}")>  <i class="fa fa-trash"></i> Delete</a>`;
                            }
                            else if (UpdatePermission == false && DeletePermission == false) {
                                return ``;
                            }



                        }, 'width': '10%'
                    },
                ],
                "font- size": '1em',
                dom: 'lBfrtip',
                "bDestroy": true,
                "paging": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
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
                    var age = parseFloat(data[8]) || 0; // use data for the age column

                    if ((isNaN(min) && isNaN(max)) ||
                        (isNaN(min) && age <= max) ||
                        (min <= age && isNaN(max)) ||
                        (min <= age && age <= max)) {
                        return true;
                    }
                    return false;
                }
            );
            dataTable.on('order.dt search.dt', function () {
                dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();
        }

    });

}

function DeleteSales(InvoiceNO) {
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
                url: "api/SALES/DeleteSales?InvoiceNO=" + InvoiceNO,
                success: function (data) {
                    if (data.success) {
                        $('#listTable').DataTable().ajax.reload();
                        Toast.fire({
                            icon: 'success',
                            title: data.message,
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

        };
    })

}

function SalesNumber() {
    $.ajax({
        type: 'GET',
        url: "api/SALES/SalesNO",
        success: function (data) {
            if (data.success) {
                document.getElementById("invoiceno").value = data.data;
            }
        }
    })

}

function filldetails() {
    SalesNumber();
    currentTime();
    clearsales();
}

function clearsales() {
    document.getElementById("Pterm").value = "";
    document.getElementById("pono").value = "";
    document.getElementById("billAmount").value = "";
    $('#companyname').val('');
    $('#companyname').trigger('change');
    $("#transportname option[value=" + 0 + "]").remove();
    $('#transportname').append($("<option selected></option>").val(0).html("--Select--"));
    document.getElementById("saveebutton").innerHTML = "Save";
}

function fillSaleDetail(InvoiceNO) {
    $.ajax({
        'type': 'GET',
        'url': "api/SALES/viewSales",
        'data': {
            InvoiceNO: InvoiceNO,
        },
        'contentType': 'application/json',
        success: function (data) {
            if (data.success) {
                document.getElementById("invoiceno").value = data.data.invoiceNO;
                var date = data.data.date;
                var now = date.toString().replace('T', ' ');
                document.getElementById("datetime").value = moment(now).format('YYYY-MM-DD');
                $("#companyname option[value=" + data.data.ccode + "]").remove();
                $('#companyname').append($("<option selected></option>").val(data.data.ccode).html(data.data.companyname));
                $("#transportname option[value=" + data.data.tcode + "]").remove();
                $('#transportname').append($("<option selected></option>").val(data.data.tcode).html(data.data.transportName));
                document.getElementById("Pterm").value = data.data.pterm;
                date = data.data.pOdate;
                now = date.toString().replace('T', ' ');
                document.getElementById("podate").value = moment(now).format('YYYY-MM-DD');
                document.getElementById("pono").value = data.data.pono;
                document.getElementById("billAmount").value = data.data.debit;
            }
            else {
                Toast.fire({
                    icon: 'error',
                    title: 'Successfully saved'
                })
            }
        }
    });
    document.getElementById("saveebutton").innerHTML = "Update";
}

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    document.getElementById('datetime').value = dateStringWithTime;
    document.getElementById('podate').value = dateStringWithTime;
}

function saveSALE() {
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
    var Date = document.getElementById("datetime").value;
    var Companyname = document.getElementById("companyname").selectedOptions[0].text;
    var Ccode = document.getElementById("companyname").value;
    var TransportName = document.getElementById("transportname").selectedOptions[0].text;
    var Tcode = document.getElementById("transportname").value;
    var Pterm = document.getElementById("Pterm").value;
    var POdate = document.getElementById("podate").value;
    var Pono = document.getElementById("pono").value;
    var InvoiceNO = document.getElementById("invoiceno").value;
    var Amount = document.getElementById("billAmount").value;
    var type = document.getElementById("saveebutton").innerHTML;
    var Credit = 0;
    $.ajax({
        type: 'Post',
        url: "api/SALES/AddVoucher",
        data: {
            type: type,
            InvoiceNO: InvoiceNO,
            Date: Date,
            Ccode: Ccode,
            Companyname: Companyname,
            POdate: POdate,
            Pono: Pono,
            TransportName: TransportName,
            Tcode: Tcode,
            Pterm: Pterm,
            Debit: Amount,
            Credit: Credit,
        },
        success: function (data) {
            if (data.success) {
                document.getElementById("invoiceno").value = data.data;
                document.getElementById("saveebutton").innerHTML = "Update";
                Toast.fire({
                    icon: 'success',
                    title: data.message,
                })
                $('#listTable').DataTable().ajax.reload();
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


