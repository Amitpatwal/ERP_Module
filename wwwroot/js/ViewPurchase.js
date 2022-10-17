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
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('fromdate').value = moment(now).format('YYYY-MM-DD');
    document.getElementById('todate').value = moment(now).format('YYYY-MM-DD');
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime + " - " + dateStringWithTime;
    fillcompany1('companyname', 'Customer');
    pvnumber()
    viewReport()
    currentTime()
});

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById("pidatetime").value = dateStringWithTime;
    document.getElementById("podate").value = dateStringWithTime;

}

function resetData() {
    pvnumber()
    currentTime()
    document.getElementById("saveebutton").innerHTML = "Save";
    $('#companyname').val('');
    $('#companyname').trigger('change');
    document.getElementById("prinvoiceno").value = "";
    document.getElementById("pobillno").value = "";
    document.getElementById("Pterm").value = "";
    document.getElementById("billAmount").value = "";
}

function pvnumber() {
    $.ajax({
        type: 'GET',
        url: "api/Voucher/PVNO",
        success: function (data) {
            if (data.success) {
                document.getElementById("prinvoiceno").value = data.data;
            }
        }
    })
}
function viewReport() {

    var updatePermission = false;
    var deletePermission = false;
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    document.getElementById('daterange').value = moment(fromdate).format('DD-MMM-YY') + " - " + moment(todate).format('DD-MMM-YY');
    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "PURCHASE",
        },
        success: function (data) {
            if (data.data[1].operations == "CREATE") {
                if (data.data[1].permission == true) {
                    document.getElementById('purchaseButton').style.display = "block";
                } else {
                    document.getElementById('purchaseButton').style.display = "none";
                }
            }
            if (data.data[2].operations == "UPDATE") {
                if (data.data[2].permission == true) {
                    updatePermission = true;
                } else {
                    updatePermission = false;
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
                    deletePermission = true;
                } else {
                    deletePermission = false;
                }
            }
            dataTable = $("#PRlistTable").DataTable({
                ajax: {
                    'url': '/api/Voucher/PRTable',
                    'type': 'GET',
                    'data': {
                        fromdate: fromdate,
                        todate: todate,
                    },
                    'contentType': 'application/json'
                },
                columns: [
                    { 'data': null, 'defaultContent': '-', 'width': '1%' },
                    { 'data': 'prNO', 'defaultContent': '-', 'width': '8%', 'font-size': '6px', },
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
                    { 'data': 'companyname', 'defaultContent': '-', 'width': '15%', 'font-size': '6px' },
                    { 'data': 'purchaseNo', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
                    {
                        'data': 'purchaseDate', 'render': function (data) {
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
                    {
                        'data': 'pterm', 'render': function (data, type, row) {
                            return `<a>${data} days</a>`;

                        }, 'width': '5%', 'font-size': '6px', 'className': "text-right"
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
                        'data': 'credit', 'render': function (data) {
                            return `<a>${data.toFixed(2)}</a>`;
                        }, 'width': '5%', 'className': "text-right", 'font-size': '6px'
                    },
                    {
                        'data': 'prNO', 'render': function (data) {
                            if (updatePermission == true && deletePermission == true) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal1" onclick=fetchData("${data}")><i class="fas fa-pencil-alt"></i>Edit</a>
                              <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteData("${data}")> <i class="fas fa-trash"></i>Delete</a>
                             `;
                            }
                            else if (updatePermission == true && deletePermission == false) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal1" onclick=fetchData("${data}")><i class="fas fa-pencil-alt"></i>Edit</a>
                                       `;
                            }
                            else if (updatePermission == false && deletePermission == true) {
                                return ` <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteData("${data}")> <i class="fas fa-trash"> </i>Delete</a>
                                       `;
                            }
                            else {
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


function deleteData(id) {
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
                url: "api/Voucher/DeleteData",
                data: {
                    Id: id,
                },
                success: function (data) {
                    if (data.success) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Deleted'
                        })
                        $('#PRlistTable').DataTable().ajax.reload();
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            });

        };
    })

}


function savePurchase() {
    var prinvoiceno = document.getElementById("prinvoiceno").value;
    var pidatetime = document.getElementById("pidatetime").value;
    var companyname = document.getElementById("companyname").selectedOptions[0].text;
    var ccodee = document.getElementById("companyname").value;
    var pobillno = document.getElementById("pobillno").value;
    var podate = document.getElementById("podate").value;
    var billAmount = document.getElementById("billAmount").value;
    var paymentTerm = document.getElementById("Pterm").value;
    var Type = document.getElementById("saveebutton").innerHTML;

    $.ajax({
        type: 'Post',
        url: "api/Voucher/AddPurchaseVoucher",
        data:
        {
            type: Type,
            PrNO: prinvoiceno,
            Date: pidatetime,
            Companyname: companyname,
            Ccode: ccodee,
            PurchaseNo: pobillno,
            PurchaseDate: podate,
            Credit: billAmount,
            Debit: 0.0,
            Pterm: paymentTerm,
        },
        success: function (data) {
            if (data.success) {
                Toast.fire({
                    icon: 'success',
                    title: 'Successfully saved'
                })
                $('#PRlistTable').DataTable().ajax.reload();
                resetData();
                document.getElementById("saveebutton").innerHTML = "Save";
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


function fetchData(url) {
    $.ajax({
        'url': '/api/Voucher/getData?id=' + url,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            $("#prinvoiceno").val(data.data.prNO);
            var date = data.data.date;
            var now = date.toString().replace('T', ' ');
            document.getElementById("pidatetime").value = moment(now).format('YYYY-MM-DD');
            $("#companyname option[value=" + data.data.ccode + "]").remove();
            $('#companyname').append($("<option selected></option>").val(data.data.ccode).html(data.data.companyname));
            $("#pobillno").val(data.data.purchaseNo);
            var ponow = data.data.date.toString().replace('T', ' ');
            document.getElementById("podate").value = moment(ponow).format('YYYY-MM-DD');
            $("#Pterm").val(data.data.pterm);
            $("#billAmount").val(data.data.credit);
        }
    })
    document.getElementById("saveebutton").innerHTML = "Update";
}