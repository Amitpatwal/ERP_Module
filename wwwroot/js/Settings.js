
function VocherDiv() {
    document.getElementById("buisnessDiv").style.display = "none";
    document.getElementById("addbuisnessdiv").style.display = "none";
    document.getElementById("header").style.display = "none";
    document.getElementById("bankDiv").style.display = "none";
    document.getElementById("voucherdiv").style.display = "block";
    document.getElementById("Voucherheader").style.display = "block";
    document.getElementById("Bankheader").style.display = "none";
    LoadVoucher()
}

function AddBuisnessDiv() {
    document.getElementById("voucherdiv").style.display = "none";
    document.getElementById("bankDiv").style.display = "none";
    document.getElementById("buisnessDiv").style.display = "block";
    document.getElementById("header").style.display = "block";
    document.getElementById("Voucherheader").style.display = "none";
    document.getElementById("Bankheader").style.display = "none";
}

function savebankDetails() {

    document.getElementById("approvedItem").style.display = "block";
    var accountno = document.getElementById("accoutno").value;
    var retypeaccountno = document.getElementById("retypeaccountno").value;
    var bankname = document.getElementById("bankname").value;
    var holdername = document.getElementById("holdername").value;
    var ifsc = document.getElementById("ifsccode").value;
    var branch = document.getElementById("branch").value;
    var srno = document.getElementById("srno").value;
    var savebutton = document.getElementById("button12").innerHTML;



    if (accountno == retypeaccountno) {
        $.ajax({
            type: 'Post',
            'url': '/api/Client/AddBank?type=' + savebutton,
            data: {
                srno: srno,
                BankName: bankname,
                AcoountNo: accountno,
                ISFC: ifsc,
                Branch: branch,
                AccountHolderName: holdername
            },
            success: function (data) {
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
                if (data.success == true) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Succesfully Saved Bank Details'
                    })
                    viewBankList()

                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message,
                    })
                }
            }
        });

    }
    else {

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Account No. and Retype Account No Incorrect',
        })

    }


}

function deleteBank() {

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
            var srno = document.getElementById("srno").value;
            $.ajax({
                type: 'Delete',
                url: 'api/Client/DeleteBank?SrNo=' + srno,
                success: function (data) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    if (data.success == true) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Bank Details has been deleted.',
                        })
                        viewBankList()

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

function updatebankDetails(srno) {

    $.ajax({
        'url': '/api/Client/FetchBankByID?srno=' + srno,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("srno").value = data.data.srNo;
                document.getElementById("accoutno").value = data.data.acoountNo;
                document.getElementById("retypeaccountno").value = data.data.acoountNo;
                document.getElementById("bankname").value = data.data.bankName;
                document.getElementById("holdername").value = data.data.accountHolderName;
                document.getElementById("ifsccode").value = data.data.isfc;
                document.getElementById("branch").value = data.data.branch;
                document.getElementById("button12").innerHTML = "Update";
                document.getElementById("delete").style.display = "block";
            }
        }
    })

}

function addBank() {
    document.getElementById("header").style.display = "none";
    document.getElementById("voucherdiv").style.display = "none";
    document.getElementById("buisnessDiv").style.display = "none";
    document.getElementById("addbuisnessdiv").style.display = "none";
    document.getElementById("bankDiv").style.display = "block";
    document.getElementById("Bankheader").style.display = "block";
    document.getElementById("Voucherheader").style.display = "none";
    viewBankList()

}

function viewBankList() {

    dataTable = $("#viewBankList").DataTable({
        ajax: {
            'url': '/api/Client/FetchBankList',
            'type': 'GET',
            'contentType': 'application/json'
        },

        columns: [

            { 'data': 'null', 'defaultContent': '-', 'width': '1%', 'font-size': '6px', },
            { 'data': 'acoountNo', 'defaultContent': '-', 'width': '20%', 'font-size': '6px' },
            { 'data': 'bankName', 'defaultContent': '-', 'width': '20%', 'font-size': '6px' },
            { 'data': 'isfc', 'defaultContent': '-', 'width': '8%', 'font-size': '6px' },
            { 'data': 'accountHolderName', 'defaultContent': '-', 'width': '20%', 'font-size': '6px' },
            { 'data': 'branch', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            {
                'data': 'srNo', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal" onclick="updatebankDetails(${data})"> <i class="fa fa-edit "></i></a>   
                        <a class="btn btn-info btn-sm" style="color:white" onclick="setasDefault(${data})"> <i class="fa fa-gear "></i></a>   
                            <a class="btn btn-info btn-sm" style="color:white" onclick="deleteBank(${data})"> <i class="fa fa-trash "> &nbsp</i></a>                        `;
                }, 'width': '12%'
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

};
function setasDefault(id) {
    $.ajax({
        type: 'Post',
        'url': '/api/Client/setasDefault?id=' + id,
        success: function (data) {
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
            if (data.success == true) {
                Toast.fire({
                    icon: 'success',
                    title: 'Set as Default'
                })

            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message,
                })
            }
        }
    });
}

function saveVocherNo(textbox, type) {

    var prefix = document.getElementById(textbox).value;

    $.ajax({
        type: 'Post',
        'url': '/api/Client/AddVoucherNo',
        data: {

            Prefixname: prefix,
            Type: type,
        },
        success: function (data) {
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
            if (data.success == true) {
                Toast.fire({
                    icon: 'success',
                    title: 'Succesfully Updated Voucher No.'
                })

            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message,
                })
            }
        }
    });
}

function LoadVoucher() {
    $.ajax({
        'url': '/api/Client/FetchVoucherNo',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            $.each(data.data, function (key, value) {
                switch (value.type) {
                    case "quotationVocher":
                        document.getElementById("quotationVouherno").value = value.prefixname;
                        break;
                    case "dispachtedorder":
                        document.getElementById("dispachtedOrderVoucherno").value = value.prefixname;
                        break;
                    case "performaVoucher":
                        document.getElementById("performaVoucherno").value = value.prefixname;
                        break;
                    case "saleOrder":
                        document.getElementById("salesorderVocherno").value = value.prefixname;
                        break;
                    case "purchaseOrderVoucher":
                        document.getElementById("purchaseOrderVoucherno").value = value.prefixname;
                        break;
                    case "purchaseRecieptVoucher":
                        document.getElementById("purchaseRecieptVoucherno").value = value.prefixname;
                        break;
                    case "dispachtedPlanningVoucher":
                        document.getElementById("dispachtedPlanningVoucherno").value = value.prefixname;
                        break;
                    case "invoiceVoucher":
                        document.getElementById("invoiceVoucherno").value = value.prefixname;
                        break;
                    case "loadingorder":
                        document.getElementById("loadingOrderVoucherno").value = value.prefixname;
                        break;
                    case "SalesVoucher":
                        document.getElementById("SalesVoucherno").value = value.prefixname;
                        break;
                    case "PurchaseVoucher":
                        document.getElementById("PurchaseVoucherno").value = value.prefixname;
                        break;
                    case "DebitVoucher":
                        document.getElementById("DebitVoucherno").value = value.prefixname;
                        break;
                    case "CreditVoucher":
                        document.getElementById("CreditVoucherno").value = value.prefixname;
                        break;
                    case "PaymentVoucher":
                        document.getElementById("PaymentVoucherno").value = value.prefixname;
                        break;
                    case "ReceiptVoucher":
                        document.getElementById("ReceiptVoucherno").value = value.prefixname;
                        break;
                    case "MaterialVoucher":
                        document.getElementById("MaterialShiftVoucherno").value = value.prefixname;
                        break;

                    case "GeneralEntryVoucher":
                        document.getElementById("GeneralEntryVoucherno").value = value.prefixname;
                        break;

                    case "RRVoucher":
                        document.getElementById("RRVoucherno").value = value.prefixname;
                        break;

                    default:
                    // code block
                }
            });



        }
    })

}

function addBusiness() {
    document.getElementById("addbuisnessdiv").style.display = "block";
    document.getElementById("buisnessDiv").style.display = "none";
    companyList()
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById("bookbeginningFrom").value = dateStringWithTime;
    document.getElementById("yearBeginningDate").value = dateStringWithTime;
}

function companyList() {
    dataTable = $("#companylistTable").DataTable({
        ajax: {
            'url': '/api/Client/FetchCompanyListprofile',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [

            { 'data': null, 'defaultContent': '', 'width': '2%' },
            { 'data': 'companyname', 'defaultContent': '', 'width': '30%' },
            { 'data': 'financialYear', 'defaultContent': '', 'width': '10%' },
            { 'data': 'email', 'defaultContent': '', 'width': '10%' },
            { 'data': 'phone', 'defaultContent': '', 'width': '10%' },
            { 'data': 'gst', 'defaultContent': '', 'width': '10%' },
            { 'data': 'pan', 'defaultContent': '', 'width': '10%' },
            { 'data': 'address', 'defaultContent': '', 'width': '10%' },

            {
                'data': 'companyid', 'render': function (data, type, row) {
                    return `<a class="btn btn-primary btn-sm" style="color:white" onclick="updateCompany(${data})">  <i class="fas fa-pencil-alt">
                              </i>
                              Edit</a> 
`
                        ;
                }, 'width': '10%'
            },

        ],
        dom: 'Bfrtip',

        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": true,
        "scrollX": false,
        "responsive": false,
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    dataTable.on('order.dt', function () {
        dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}

function addCompany() {

    var financialYear = document.getElementById("financialYear").value;
    var companyid = document.getElementById("companyid").innerHTML;
    var companyname = document.getElementById("buisnessname").value;
    var companymailingname = document.getElementById("companymailingname").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("mobileno").value;
    var pan = document.getElementById("pan").value;
    var gst = document.getElementById("gst").value;
    var address = document.getElementById("address").value;
    var yearBeginningDate = document.getElementById("yearBeginningDate").value;
    var beggingFrom = document.getElementById("bookbeginningFrom").value;
    var savebutton = document.getElementById("savecompanyButton").innerHTML;
    var ctr = 0;
    if (beggingFrom < yearBeginningDate) {
        ctr = ctr + 1;
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'beginning date cannot be less than Financial Date',
        })


    }
    if ((!companyname || !email) && ctr == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Enter Required Fields',
        })
        document.getElementById("buisnessname").style.borderColor = "red";
        document.getElementById("email").style.borderColor = "red";
    }
    else {
        $.ajax({
            type: 'Post',
            'url': 'api/Client/AddCompany?type=' + savebutton,
            data: {
                companyid: companyid,
                FinancialYear: financialYear,
                Companyname: companyname,
                MailingName: companymailingname,
                Email: email,
                Phone: phone,
                PAN: pan,
                GST: gst,
                Address: address,
                begningdate: beggingFrom,
                financialdate: yearBeginningDate,

            },
            success: function (data) {
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
                if (data.success == true) {
                    Toast.fire({
                        icon: 'success',
                        title: data.message,
                    })
                    document.getElementById("buisnessname").style.borderColor = "black";
                    document.getElementById("email").style.borderColor = "black";
                    document.getElementById("savecompanyButton").innerHTML = "Save"
                    clearData()
                    companyList()
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message,
                    })
                }
            }
        });

    }

}

function clearData() {

    document.getElementById("financialYear").value = "";
    document.getElementById("buisnessname").value = "";
    document.getElementById("companymailingname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("mobileno").value = "";
    document.getElementById("pan").value = "";
    document.getElementById("gst").value = "";
    document.getElementById("address").value = "";
}

function updateCompany(companyid) {
    $.ajax({
        'url': '/api/Client/FetchCompanyByID?companyid=' + companyid,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {

                document.getElementById("companyid").innerHTML = data.data.companyid;

                document.getElementById("financialYear").value = data.data.financialYear;
                document.getElementById("buisnessname").value = data.data.companyname;
                document.getElementById("companymailingname").value = data.data.mailingName;
                document.getElementById("email").value = data.data.email;
                document.getElementById("mobileno").value = data.data.phone;
                document.getElementById("pan").value = data.data.pan;
                document.getElementById("gst").value = data.data.gst;
                document.getElementById("address").value = data.data.address;
                var dd = data.data.financialdate;
                var dateS = moment(dd).format('YYYY-MM-DD');
                document.getElementById("yearBeginningDate").value = dateS;
                var dd1 = data.data.begningdate;
                dateS = moment(dd1).format('YYYY-MM-DD');
                document.getElementById("bookbeginningFrom").value = dateS;
                document.getElementById("savecompanyButton").innerHTML = "Update";



            }
        }
    })

}
function switchCompany() {
    document.getElementById("selectcompany").style.display = "block";
}


