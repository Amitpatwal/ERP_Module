var debitcreditNote = "";
$(document).ready(function () {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('fromdate').value = moment(now).format('YYYY-MM-DD');
    document.getElementById('todate').value = moment(now).format('YYYY-MM-DD');
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " - " + dateStringWithTime;
    NoteList("DebitTable", "DEBIT");
    fillcompany1('partyName', 'Customer');
});

function gettablelist() {
    if (debitcreditNote == "DEBIT") {
        NoteList('DebitTable', debitcreditNote);
    } else {
        NoteList('CreditTable', debitcreditNote);
    }
}

function NoteList(TableName, debitcredit) {
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    document.getElementById("daterange").value = moment(fromdate).format('DD-MMM-YY') + "-" + moment(todate).format('DD-MMM-YY');
    var UpdatePermission = false;
    var DeletePermission = false;
    debitcreditNote = debitcredit;
    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "DEBIT_NOTE",
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
            dataTable = $("#" + TableName).DataTable({
                ajax: {
                    'url': '/api/CreditDebitNote/VouchersList',
                    data: {
                        type: debitcredit,
                        fromdate: fromdate,
                        todate: todate,
                    },
                    'type': 'GET',
                },
                columns: [
                    { 'data': null, 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
                    { 'data': 'voucherno', 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
                    {
                        'data': 'voucherdate', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('YY-MMM-DD');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '5%', 'font-size': '6px'
                    },
                    { 'data': 'companyname', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    { 'data': 'reference', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },

                    { 'data': 'type', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    {
                        'data': 'debit', 'render': function (data, type, row) {
                            return `<a>${data.toFixed(2)}</a>`;
                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'credit', 'render': function (data, type, row) {
                            return `<a>${data.toFixed(2)}</a>`;
                        }, 'width': '1%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'voucherno', 'render': function (data, type, row) {

                            if (UpdatePermission == true && DeletePermission == true) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal1" onclick=fillvoucherDetails("${data}","${debitcredit}")> <i class="fas fa-pencil-alt"></i>Edit</a>
                        <a class="btn btn-danger btn-sm" style="color:white" onclick=DeleteVoucher("${data}","${debitcredit}")>  <i class="fa fa-trash"></i> Delete</a>`;
                            }

                            else if (UpdatePermission == true && DeletePermission == false) {
                                return `<a class="btn btn-danger btn-sm" style="color:white" onclick=DeleteVoucher("${data}","${debitcredit}")>  <i class="fa fa-trash"></i> Delete</a>`;
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

function DeleteVoucher(voucherno, type) {
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
                url: "api/CreditDebitNote/DeleteVoucher",
                data: {
                    voucherno: voucherno,
                    type: type,
                },
                success: function (data) {
                    if (data.success) {
                        $('#DebitTable').DataTable().ajax.reload();
                        $('#CreditTable').DataTable().ajax.reload();
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

function voucherno() {
    var type = document.getElementById("vouchtype").value;

    $.ajax({
        type: 'GET',
        url: "api/CreditDebitNote/VoucherNo?type=" + type,
        success: function (data) {
            if (data.success) {
                document.getElementById("voucherno").value = data.data;
            }
        }
    })

}

function FillBillNumbers() {
    var code = document.getElementById("partyName").value;
    var type = document.getElementById("salepurchasetype").value;
    $.ajax({
        url: '/api/CreditDebitNote/FillBillNumbers',
        type: 'GET',
        data: {
            type: type,
            ccode: code,
        },
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                $("#billno").empty();
                $("#billno").append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (type == "Sale") {
                        $("#billno").append($("<option></option>").val(value.invoiceNO).html(value.invoiceNO));
                    } else {
                        $("#billno").append($("<option></option>").val(value.prNO).html(value.prNO));
                    }
                });
                $("#billno").select2();
            }
        }
    });
}

function filldetails() {
    voucherno();
    currentTime();
    clearsales();
}

function clearsales() {
    document.getElementById("billAmount").value = "";
    $('#partyName').val('');
    $('#partyName').trigger('change');
    document.getElementById("saveebutton").innerHTML = "Save";
}

function fillvoucherDetails(voucher, CrDr) {
    $.ajax({
        'type': 'GET',
        'url': "api/CreditDebitNote/ViewVoucher",
        'data': {
            voucher: voucher,
            type: CrDr,
        },
        'contentType': 'application/json',
        success: function (data) {
            if (data.success) {
                document.getElementById("voucherno").value = data.data.voucherno;
                var date = data.data.voucherdate;
                var now = date.toString().replace('T', ' ');
                document.getElementById("voucherDate").value = moment(now).format('YYYY-MM-DD');
                $("#partyName option[value=" + data.data.ccode + "]").remove();
                $('#partyName').append($("<option selected></option>").val(data.data.ccode).html(data.data.companyname));
                document.getElementById("salepurchasetype").value = data.data.type;
                if (data.data.vouchertype == "DEBIT") {
                    document.getElementById("billAmount").value = data.data.debit;
                }
                else {
                    document.getElementById("billAmount").value = data.data.credit;
                }
                $('#billno').empty();
                $('#billno').append($("<option selected></option>").val(data.data.reference).html(data.data.reference));
                /*document.getElementById("billno").value = data.data.reference;*/
                document.getElementById("vouchtype").value = data.data.vouchertype;
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
    document.getElementById('voucherDate').value = dateStringWithTime;
}

function saveVoucher() {
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
    var voucherdate = document.getElementById("voucherDate").value;
    var voucherno = document.getElementById("voucherno").value;
    var companyname = document.getElementById("partyName").selectedOptions[0].text;
    var ccode = document.getElementById("partyName").value;
    var reference = document.getElementById("billno").value;
    var type = document.getElementById("salepurchasetype").value;
    var vouchertype = document.getElementById("vouchtype").value;

    var Amount = document.getElementById("billAmount").value;
    var Debit = 0;
    var Credit = 0;
    if (vouchertype == "DEBIT") {
        Debit = Amount;
    } else {
        Credit = Amount;
    }
    var Savetype = document.getElementById("saveebutton").innerHTML;

    $.ajax({
        type: 'Post',
        url: "api/CreditDebitNote/AddVoucher",
        data: {
            Savetype: Savetype,
            type: type,
            voucherno: voucherno,
            voucherdate: voucherdate,
            vouchertype: vouchertype,
            ccode: ccode,
            companyname: companyname,
            reference: reference,
            Debit: Debit,
            Credit: Credit,
        },
        success: function (data) {
            if (data.success) {
                document.getElementById("voucherno").value = data.data;
                document.getElementById("saveebutton").innerHTML = "Update";
                Toast.fire({
                    icon: 'success',
                    title: data.message,
                })
                $('#DebitTable').DataTable().ajax.reload();
                $('#CreditTable').DataTable().ajax.reload();
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


