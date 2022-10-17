var debitcreditNote = "";
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

$(document).ready(function () {
    fillcompany1('companyname', 'Customer');
    fillBank('bankName');
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('fromdate').value = moment(now).format('YYYY-MM-DD');
    document.getElementById('todate').value = moment(now).format('YYYY-MM-DD');
    document.getElementById('daterange').value = dateStringWithTime + " - " + dateStringWithTime;
    NoteList("ReceiptTable", "RECEIPT");
});

function checkamt() {
    var amt1 = document.getElementById("Amount").value;
    var amt = document.getElementById("amt").value;
    if (++amt1 > ++amt) {
        document.getElementById("Amount").style.borderColor = "RED";
    }
    else {
        document.getElementById("Amount").style.borderColor = "BLACK";
    }
}


function gettablelist() {
    if (debitcreditNote == "RECEIPT") {
        NoteList("ReceiptTable", "RECEIPT");
    } else {
        NoteList("PaymentTable", "PAYMENT");
    }
}

function NoteList(TableName, debitcredit) {
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    document.getElementById("daterange").value = moment(fromdate).format('DD-MMM-YY') + "-" + moment(todate).format('DD-MMM-YY');
    var UpdatePermission = false;
    var DeletePermission = false;
    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: debitcredit,
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
            debitcreditNote = debitcredit;
            dataTable = $("#" + TableName).DataTable({
                ajax: {
                    'url': '/api/PaymentVoucherController/VouchersList',
                    data: {
                        type: debitcredit,
                        fromdate: fromdate,
                        todate: todate,
                    },
                    'type': 'GET',
                },
                columns: [
                    { 'data': null, 'defaultContent': '-', 'width': '1%', 'font-size': '6px' },
                    { 'data': 'voucherNo', 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
                    {
                        'data': 'voucherDate', 'render': function (data) {
                            var now = data.toString().replace('T', ' ');
                            return `<span>${moment(now).format('YY-MMM-DD')}</span>`;
                        }, 'width': '5%', 'font-size': '6px'
                    },
                    { 'data': 'customerName', 'defaultContent': '-', 'width': '20%', 'font-size': '6px' },
                    { 'data': 'bankName', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
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
                        'data': 'voucherNo', 'render': function (data, type, row) {

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
            dataTable.on('order.dt search.dt', function () {
                dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();
        }

    });

}

function DeleteVoucher(voucherno, vouchertype) {


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
                url: "api/PaymentVoucherController/DeleteVoucher",
                data: {
                    voucherno: voucherno,
                    vouchertype: vouchertype,
                },
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

function fillvoucherDetails(voucher, CrDr) {
    $.ajax({
        'type': 'GET',
        'url': "api/PaymentVoucherController/ViewVoucher",
        'data': {
            voucher: voucher,
            type: CrDr,
        },
        'contentType': 'application/json',
        success: function (data) {
            if (data.success) {
                document.getElementById("voucherno").value = data.data.voucherNo;
                var date = data.data.voucherDate;
                var now = date.toString().replace('T', ' ');
                document.getElementById("voucherDate").value = moment(now).format('YYYY-MM-DD');
                $("#companyname option[value=" + data.data.customerID + "]").remove();
                $('#companyname').append($("<option selected></option>").val(data.data.customerID).html(data.data.customerName));
                $("#bankName option[value=" + data.data.bankId + "]").remove();
                $('#bankName').append($("<option selected></option>").val(data.data.bankId).html(data.data.bankName));
                if (data.data.voucherType == "PAYMENT") {
                    document.getElementById("billAmount").value = data.data.debit;
                }
                else {
                    document.getElementById("billAmount").value = data.data.credit;
                }
                document.getElementById("vouchtype").value = data.data.voucherType;
                document.getElementById("Narration").value = data.data.narration;
                document.getElementById("vouchtype").disabled = true;
                document.getElementById("againstButton").style.display = "block";
            }
        }

    });
    document.getElementById("saveebutton").innerHTML = "Update";
}

function fillBank(dropdown) {
    $.ajax({
        url: '/api/PaymentVoucherController/FillBank',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                $("#" + dropdown).empty();
                $("#" + dropdown).append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $("#" + dropdown).append($("<option></option>").val(value.srNo).html(value.bankName));
                });
            }
        }
    });
    $("#" + dropdown).select2();
}

function filldetails() {
    voucherno();
    currentTime();
    clearsales();
}

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('voucherDate').value = moment(now).format('YYYY-MM-DD');
}

function clearsales() {
    document.getElementById("billAmount").value = "";
    document.getElementById("billno").value = "";
    $('#billno').empty();
    $('#companyname').val('');
    $('#companyname').trigger('change');
    $('#bankName').val('');
    $('#bankName').trigger('change');
    document.getElementById("saveebutton").innerHTML = "Save";
}

function voucherno() {
    document.getElementById("vouchtype").disabled = false;
    document.getElementById("againstButton").style.display = "none";
    var type = document.getElementById("vouchtype").value;
    if (type == "RECEIPT") {
        document.getElementById("billamountlabel").innerHTML = "Credit Amount"
    } else {
        document.getElementById("billamountlabel").innerHTML = "Debit Amount"
    }
    $.ajax({
        type: 'GET',
        url: "api/PaymentVoucherController/VoucherNo?type=" + type,
        success: function (data) {
            if (data.success) {
                document.getElementById("voucherno").value = data.data;
            }
        }
    })

}

function FillBillNo() {
    var ccode = document.getElementById("companyname").value;
    var type = document.getElementById("vouchtype").value;
    var date = document.getElementById("voucherDate").value;
    $.ajax({
        url: '/api/PaymentVoucherController/FillBillNumbers',
        type: 'GET',
        data: {
            Type: type,
            ccode: ccode,
            date: date,
        },
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                $("#billno").empty();
                $("#billno").append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (type == "RECEIPT") {
                        $("#billno").append($("<option></option>").val(value.debit).html(value.invoiceNO));
                    }
                    else {
                        $("#billno").append($("<option></option>").val(value.credit).html(value.prNO));
                    }
                });
                $.each(data.data1, function (key, value) {
                    if (type == "RECEIPT") {
                        if (value.debit != 0) {
                            $("#billno").append($("<option></option>").val("OPENINIG").html(value.invoiceno));
                        }
                    }
                    else {
                        if (value.credit != 0) {
                            $("#billno").append($("<option></option>").val("OPENINIG").html(value.invoiceno));
                        }
                    }
                });
            }
        }
    });
    $("#billno").select2();
}

function fillAmount() {
    var vouchertype = document.getElementById("vouchtype").value;

    var voucherno = document.getElementById("billno").selectedOptions[0].text;
    if (voucherno != "--Select--") {
        document.getElementById("Amount").disabled = false;
        var type = document.getElementById("billno").value;
        $.ajax({
            type: 'Post',
            url: 'api/PaymentVoucherController/getAmount1',
            data: {
                vouchertype: vouchertype,
                VoucherNo: voucherno,
                type: type,
            },
            success: function (data) {
                if (data.success) {
                    var amount = document.getElementById("billAmount").value;
                    var
                    if (vouchertype == "RECEIPT") {
                        var TotCrd = document.getElementById("TotCrd").value;

                    } else {
                        var TotDeb = document.getElementById("TotDeb").value;
                    }
                    document.getElementById("Amount").value = data.data.toFixed(2);
                }
            }
        });
    } else {
        document.getElementById("Amount").disabled = true;
    }
    checkamt();
}

function addVoucher() {
    var ctr = 0;
    var vouchertype = document.getElementById("vouchtype").value;
    var voucherno = document.getElementById("voucherno").value;
    var voucherDate = document.getElementById("voucherDate").value;
    var bankid = document.getElementById("bankName").value;
    var ccode = document.getElementById("companyname").value;
    var bankName = "";
    var companyname = "";
    if (bankid != "") {
        bankName = document.getElementById("bankName").selectedOptions[0].text;
    }
    else {
        ctr = ctr + 1;
    }
    if (ccode != "") {
        companyname = document.getElementById("companyname").selectedOptions[0].text;
    }
    else {
        ctr = ctr + 1;
    }
    var billAmount = document.getElementById("billAmount").value;
    var Narration = document.getElementById("Narration").value;
    if (billAmount != 0) {
        ctr = ctr + 1;
    }
    var Credit = 0;
    var Debit = 0;
    if (vouchertype == "RECEIPT") {
        Credit = billAmount;
    } else {
        Debit = billAmount;
    }
    var Savetype = document.getElementById("saveebutton").innerHTML;

    $.ajax({
        type: 'Post',
        url: 'api/PaymentVoucherController/AddVoucher',
        data: {
            Savetype: Savetype,
            vouchertype: vouchertype,
            VoucherNo: voucherno,
            VoucherDate: voucherDate,
            BankName: bankName,
            BankId: bankid,
            CustomerName: companyname,
            CustomerID: ccode,
            Credit: Credit,
            Debit: Debit,
            Narration: Narration,

        },
        success: function (data) {
            if (data.success) {
                document.getElementById("voucherno").value = data.data;
                document.getElementById("saveebutton").innerHTML = "Update";
                document.getElementById("vouchtype").disabled = true;
                document.getElementById("againstButton").style.display = "block";
                if (vouchertype == "RECEIPT") {
                    $('#ReceiptTable').DataTable().ajax.reload();
                } else {
                    $('#PaymentTable').DataTable().ajax.reload();
                }

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
}

function getamt() {
    var voucherno = document.getElementById("voucherno").value;
    var voucherType = document.getElementById("vouchtype").value;
    $.ajax({
        type: 'Post',
        url: 'api/PaymentVoucherController/getAmount',
        data: {
            VoucherNo: voucherno,
            voucherType: voucherType,
        },
        success: function (data) {
            if (data.success) {
                document.getElementById("amt").value = data.data;
                document.getElementById("TotCrd").value = data.data1.credit.toFixed(2);
                document.getElementById("TotDeb").value = data.data1.debit.toFixed(2);
            }
        }
    });
}

function againstDetails() {
    FillBillNo();
    getamt();
    var voucherno = document.getElementById("voucherno").value;
    var voucherType = document.getElementById("vouchtype").value;
    document.getElementById("Amount").value = "";
    document.getElementById("uptoAmount").innerHTML = document.getElementById("billAmount").value;
    document.getElementById("billwisecompanyname").innerHTML = document.getElementById("companyname").selectedOptions[0].text;

    dataTable = $("#againstTable").DataTable({
        ajax: {
            'url': '/api/PaymentVoucherController/GetAgainstTable',
            data: {
                voucherno: voucherno,
                voucherType: voucherType,
            },
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            {
                'data': 'sr', 'render': function (data, type, row) {
                    return `<a class="btn btn-info btn-sm" style="color:white"  onclick=fillSaleDetail("${data}")> <i class="fas fa-pencil-alt"></i>Edit</a>
                        <a class="btn btn-danger btn-sm" style="color:white" onclick=DeleteReference("${data}","${row.reference}","${row.type}")>  <i class="fa fa-trash"></i> Delete</a>`;

                }, 'width': '10%'
            },
            { 'data': 'reference', 'defaultContent': '-', 'width': '20%', 'font-size': '6px' },

            {
                'data': 'debit', 'render': function (data) {
                    return `<a>${data.toFixed(2)}</a>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '6px'
            },
            {
                'data': 'credit', 'render': function (data) {
                    return `<a>${data.toFixed(2)}</a>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '6px'
            },


        ],
        "font- size": '1em',
        dom: 'lBfrtip',
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": false,
        "autoWidth": false,
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    document.getElementById("Amount").focus();
}

function saveAgainst() {
    var vouchertype = document.getElementById("vouchtype").value;
    var voucherno = document.getElementById("voucherno").value;
    var voucherDate = document.getElementById("voucherDate").value;
    var reference = document.getElementById("billno").selectedOptions[0].text;
    if (reference != "--Select--") {
        var SrNo = document.getElementById("SrNo").value;
        document.getElementById("billno").style.borderColor = "grey";
        var Debit = 0.0;
        var Credit = 0.0;
        var billAmount = document.getElementById("Amount").value;
        if (vouchertype == "RECEIPT") {
            Credit = billAmount;
        } else {
            Debit = billAmount;
        }
        var type = document.getElementById("billno").value;
        var Savetype = document.getElementById("buttonid").innerHTML;

        var amt = document.getElementById("amt").value;
        if (++billAmount <= ++amt) {

            $.ajax({
                type: 'Post',
                url: 'api/PaymentVoucherController/AddAgainst',
                data: {
                    Savetype: Savetype,
                    vouchertype: vouchertype,
                    VoucherNo: voucherno,
                    VoucherDate: voucherDate,
                    reference: reference,
                    Credit: Credit,
                    Debit: Debit,
                    SrNo: SrNo,
                    type: type,
                },
                success: function (data) {
                    if (data.success) {
                        Toast.fire({
                            icon: 'success',
                            title: data.message,
                        })
                        FillBillNo();
                        getamt();
                        document.getElementById("Amount").value = "";
                        $('#againstTable').DataTable().ajax.reload();
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
            document.getElementById("Amount").style.borderColor = "RED";
            var amt = document.getElementById('uptoAmount').innerHTML;
            Swal.fire('Amount can be settled upto Rs.' + amt, '', 'info')
        }
    } else {
        document.getElementById("billno").style.borderColor = "RED";
        Swal.fire('Please Select the inoice number', 'info')
    }
}

function DeleteReference(reference, voucherno, type) {

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
            var voucherType = document.getElementById("vouchtype").value;
            $.ajax({
                type: 'Delete',
                url: "api/PaymentVoucherController/DeleteReference",
                data: {
                    referenceno: reference,
                    voucherType: voucherType,
                    voucherno: voucherno,
                    type: type,
                },
                success: function (data) {
                    if (data.success) {
                        $('#againstTable').DataTable().ajax.reload();
                        FillBillNo();
                        getamt();
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


function openingbalance() {
    var voucherdate = document.getElementById("voucherDate").value;
    var companyname = document.getElementById("companyname").selectedOptions[0].text;
    var ccode = document.getElementById("companyname").value;
    $.ajax({
        type: 'Post',
        url: 'api/PaymentVoucherController/openingbalance',
        data: {
            voucherdate: voucherdate,
            companyname: companyname,
            ccode: ccode,
        },
        success: function (data) {
            if (data.success) {
                document.getElementById("amt").value = data.data;

            }
        }
    });
}