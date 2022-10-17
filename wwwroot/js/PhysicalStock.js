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
    document.getElementById('currentdate').value = moment(now).format('YYYY-MM-DD');
    var dateStringWithTime = moment(now).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime;
    LoadDatatable();
    fillwharehouse();
});



function getcompany() {
    $.ajax({
        url: '/api/Client/Filldatatable',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                $('#companyname').empty();
                $('#companyname').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $('#companyname').append($("<option></option>").val(value.customerid).html(value.companyname));
                });
            }
        }
    });
    $("#companyname").select2();
}
function fillwharehouse() {
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/GetTableByData",
        data: { type: "pname" },
        success: function (data) {
            if (data.success) {
                var cde = document.getElementById("txtName").value;
                $('#txtName').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (cde != value.id) {
                        $('#txtName').append($("<option></option>").val(value.id).html(value.desc));
                    }
                });
            }
            $("#txtName").select2();
        }
    });
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/GetTable",
        data: { type: "godown" },
        success: function (data) {
            if (data.success) {
                $('#frmWarehouse').empty();
                $('#frmWarehouse').append("<option value='0'>Select</option>");
                $.each(data.data, function (key, value) {
                    $('#frmWarehouse').append($("<option></option>").val(value.id).html(value.desc));
                });
            }
            $("#frmWarehouse").select2();
            document.getElementById("txtName").focus();
        }
    })
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/GetTable",
        data: { type: "make" },
        success: function (data) {
            if (data.success) {
                $('#txtMake').empty();
                $('#txtMake').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $('#txtMake').append($("<option></option>").val(value.desc).html(value.desc));
                });
            }
            $("#txtMake").select2();
        }
    })
}

function LoadDatatable() {
    var currentdate = document.getElementById('currentdate').value;
    var UpdatePermission = false;
    var ViewPermission = false;
    var DeletePermission = false;
    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "PHYSICAL_STOCK",
        },
        success: function (data) {
            if (data.success) {
                if (data.data[0].operations == "VIEW") {
                    if (data.data[0].permission == true) {
                        ViewPermission = true;
                    }
                    else {
                        ViewPermission = false;
                    }
                }
                if (data.data[1].operations == "CREATE") {
                    if (data.data[1].permission == true) {
                        document.getElementById("addButton").style.display = "block";
                    } else {

                        document.getElementById("addButton").style.display = "none";
                    }
                }
                if (data.data[2].operations == "UPDATE") {
                    if (data.data[2].permission == true) {
                        UpdatePermission = true;
                    } else {
                        UpdatePermission = false;
                    }
                }

                if (data.data[3].operations == "DELETE") {
                    if (data.data[3].permission == true) {
                        DeletePermission = true;
                    } else {
                        DeletePermission = false;
                    }
                }
            }

            document.getElementById('daterange').value = currentdate;
            dataTable = $("#VoucherTable").DataTable({
                ajax: {
                    'url': '/api/physicalstock/VoucherList',
                    'type': 'GET',
                    data: {
                        currentdate: currentdate,
                    },
                    'contentType': 'application/json'
                },
                columns: [
                    {
                        'data': 'voucherDate', 'render': function (data) {
                            var dateStringWithTime = moment(data).format('YYYY-MMM-DD');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '10%', 'font-size': '6px'
                    },


                    {
                        'data': 'pname', 'render': function (data, type, row) {
                            return `<a>${row.pname}</a><br>
                                    <a>${row.psize}</a> , &nbsp; 
                                    <a>${row.pclass}</a><br>
                                    <a>${row.pmake}</a><br>`;
                        }, 'width': '30%', 'font-size': '5px',
                    },
                    { 'data': 'wharehouse', 'defaultContent': '-', 'width': '12%', 'font-size': '6px' },
                    {
                        'data': 'qty', 'render': function (data, type, row) {
                            return `<a>${row.qty} ${row.qtyunit}</a>`;
                        }, 'width': '8%', 'font-size': '5px',
                    },

                    {
                        'data': 'altQty', 'render': function (data, type, row) {
                            return `<a>${row.altQty} ${row.altQtyunit}</a>`;
                        }, 'width': '8%', 'font-size': '5px',
                    },
                    { 'data': 'userid', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },


                    {
                        'data': 'sr', 'render': function (data, type, row) {
                            if (UpdatePermission == true && DeletePermission == true) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#physicalStock" onclick=fetchVoucher('${data}')><i class="fas fa-pencil-alt"></i>Edit</a>
                              <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteVoucher('${data}')> <i class="fas fa-trash"></i>Delete</a>
                             `;
                            }
                            else if (UpdatePermission == true && DeletePermission == false) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-toggle="modal" data-target="#physicalStock" onclick=fetchVoucher('${data}')><i class="fas fa-pencil-alt"></i>Edit</a>
                                       `;
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
function Materialdataitem(itemno) {
    if (itemno != null && itemno != "" && itemno != "0") {
    }
    else {
        cleardataitem()
    }
}
function cleardataitem() {
    $('#txtName').val('');
    $('#txtName').trigger('change');
    $('#txtMake').val('');
    $('#txtMake').trigger('change');
    $('#frmWarehouse').val('');
    $('#frmWarehouse').trigger('change');
    $('#txtSize').empty();
    $('#txtClass').empty();
    document.getElementById("saveebutton1").innerHTML = "Save";
    document.getElementById("QtyNo").value = "";
    document.getElementById("QtyUnit").value = "";
    document.getElementById("AltQtyNo").value = "";
    document.getElementById("AltQtyUnit").value = "";
    document.getElementById("AltDiv").style.display = "none";
}

function getsize(from) {
    var pnameid = document.getElementById("txtName").value;
    if (pnameid != "") {
        const Pname = document.getElementById("txtName").selectedOptions[0].text;
        $('#txtClass').empty();
        if (Pname != "") {
            $.ajax({
                type: 'Post',
                url: "api/itemdatatable/GetTableByData",
                data: { type: "size", pname: Pname },
                success: function (data) {
                    if (data.success) {
                        $('#txtSize').empty();
                        $('#txtSize').append("<option value='0'>--Select--</option>");
                        $.each(data.data, function (key, value) {
                            $('#txtSize').append($("<option></option>").val(value.id).html(value.desc));
                        });
                        $('#txtSize').select2();
                    }
                    else {
                        $('#txtSize').empty();

                    }
                    checkalternateunit();
                }
            });
        }
    }

}

function checkalternateunit() {
    var pname = document.getElementById("txtName").selectedOptions[0].text;
    var psize = document.getElementById("txtSize").value;
    if (psize == 0) { psize = ""; }
    if (psize != "") {
        psize = document.getElementById("txtSize").selectedOptions[0].text;
    }
    var pclass = document.getElementById("txtClass").value;
    if (pclass == 0) { pclass = ""; }
    if (pclass != "") {
        pclass = document.getElementById("txtClass").selectedOptions[0].text;
    }
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/alternateUnit",
        data: {
            pname: pname,
            size: psize,
            Class: pclass,
        },
        success: function (data) {
            if (data.success == true) {
                document.getElementById("QtyUnit").value = data.data.unit;
                if (data.data.enableunit == true) {
                    document.getElementById("AltDiv").style.display = "block";
                    document.getElementById("AltQtyUnit").value = data.data.altunit;
                    /* var were = data.data.where;
                     var frm = data.data.from
                     var altvalue = frm / were;*/

                }
                else {
                    document.getElementById("AltDiv").style.display = "none";
                    document.getElementById("AltQtyUnit").value = "";
                }
            }
            else {

                document.getElementById("AltDiv").style.display = "none";
                document.getElementById("AltQtyUnit").value = "";

            }
        }
    })


}

function getclass(from) {
    const Pname = document.getElementById("txtName").selectedOptions[0].text;;
    const size = document.getElementById("txtSize").selectedOptions[0].text;;
    if (Pname != "") {
        $.ajax({
            type: 'Post',
            url: "api/itemdatatable/GetTableByData",
            data: { type: "class", pname: Pname, size: size },
            success: function (data) {
                if (data.success) {
                    $('#txtClass').empty();
                    $('#txtClass').append("<option value='0'>--Select--</option>");
                    $.each(data.data, function (key, value) {
                        $('#txtClass').append($("<option></option>").val(value.id).html(value.desc));
                    });

                }
                $("#txtClass").select2();
                checkalternateunit();
            }

        });
    }


}

function filldetails() {
    currentTime();
    cleardataitem();

}


function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('currentdate').value = dateStringWithTime;
    document.getElementById('voucherdate').value = dateStringWithTime;
}

function SaveVoucher() {

    var voucherDate = document.getElementById("voucherdate").value;
    var Qty = document.getElementById("QtyNo").value;
    var QtyUnit = document.getElementById("QtyUnit").value;
    if (document.getElementById("AltDiv").style.display != "none") {
        var AltQty = document.getElementById("AltQtyNo").value;
        var AltQtyUnit = document.getElementById("AltQtyUnit").value;
    } else {
        var AltQty = 0;
        var AltQtyUnit = "";
    }
    var pnameid = document.getElementById("txtName").value;
    var pname = "";
    if (pnameid != "" || pnameid != "0") {
        pname = document.getElementById("txtName").selectedOptions[0].text;
    }
    var psizeid = document.getElementById("txtSize").value;
    var psize = ""
    if (psizeid != "" || psizeid != "0") {
        psize = document.getElementById("txtSize").selectedOptions[0].text;
    }
    var pclassid = document.getElementById("txtClass").value;
    var pclass = "";
    if (pclassid != "" || pclassid != "0") {
        pclass = document.getElementById("txtClass").selectedOptions[0].text;
    }
    var makeid = document.getElementById("txtMake").value;
    var make = "";
    if (makeid != "" || makeid != "0") {
        make = document.getElementById("txtMake").selectedOptions[0].text;
    }
    var wharehouseid = document.getElementById("frmWarehouse").value;
    var wharehouse = "";
    if (wharehouseid != "" || wharehouse != "0") {
        wharehouse = document.getElementById("frmWarehouse").selectedOptions[0].text;
    }
    var type = document.getElementById("saveebutton1").innerHTML;
    var voucherno = document.getElementById("voucherno").innerHTML;
    if (type == "Save") {
        voucherno = "";
    }

    $.ajax({
        type: 'Post',
        url: "api/physicalstock/addVoucher",
        data: {
            Sr: voucherno,
            Type: type,
            voucherDate: voucherDate,
            Qty: Qty,
            QtyUnit: QtyUnit,
            AltQty: AltQty,
            AltQtyUnit: AltQtyUnit,
            pname: pname,
            pnameid: pnameid,
            psize: psize,
            psizeid: psizeid,
            pclass: pclass,
            pclassid: pclassid,
            pmake: make,
            pmakeid: makeid,
            wharehouse: wharehouse,
            wharehouseID: wharehouseid,
        },
        success: function (data) {
            if (data.success == true) {
                
                Toast.fire({
                    icon: 'success',
                    title: data.message,
                 

                })
                cleardataitem();
                $('#VoucherTable').DataTable().ajax.reload();
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


function fetchVoucher(voucherno) {
    document.getElementById('voucherno').innerHTML = voucherno;
    $.ajax({
        url: '/api/physicalstock/viewvVoucher',
        type: 'GET',
        data: {
            voucherno: voucherno,
        },
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                var dateStringWithTime = moment(data.data.voucherDate).format('YYYY-MM-DD');
                document.getElementById("voucherdate").value = dateStringWithTime;
                $("#txtName option[value=" + data.data.pnameid + "]").remove();
                $('#txtName').append($("<option selected></option>").val(data.data.pnameid).html(data.data.pname));
                const Pname = data.data.pname;
                if (Pname != "") {
                    $.ajax({
                        type: 'Post',
                        url: "api/itemdatatable/GetTableByData",
                        data: { type: "size", pname: Pname },
                        success: function (data1) {
                            if (data1.success) {
                                $('#txtSize').empty();
                                $('#txtSize').append("<option value='0'>--Select--</option>");
                                $.each(data1.data, function (key, value) {
                                    $('#txtSize').append($("<option></option>").val(value.id).html(value.desc));
                                });
                                document.getElementById("txtSize").value = data.data.sizeid;
                                const size = data.data.size;
                                if (Pname != "") {
                                    $.ajax({
                                        type: 'Post',
                                        url: "api/itemdatatable/GetTableByData",
                                        data: { type: "class", pname: Pname, size: size },
                                        success: function (data2) {
                                            if (data2.success == true) {
                                                $('#txtClass').empty();
                                                $('#txtClass').append("<option value='0'>--Select--</option>");
                                                $.each(data2.data, function (key, value) {
                                                    $('#txtClass').append($("<option></option>").val(value.id).html(value.desc));
                                                });
                                                document.getElementById('txtClass').value = data.data.classid;
                                            }
                                        }
                                    });
                                    $("#txtName").select2();
                                }
                            }
                        }

                    });
                    $("#txtSize").select2();

                }

                $("#frmWarehouse option[value=" + data.data.frmWhareHouseid + "]").remove();
                $('#frmWarehouse').append($("<option selected></option>").val(data.data.frmWhareHouseid).html(data.data.frmWhareHouse));

                $("#txtMake option[value=" + data.data.makeid + "]").remove();
                $('#txtMake').append($("<option selected></option>").val(data.data.makeid).html(data.data.make));
                document.getElementById('QtyNo').value = data.data.qty;
                document.getElementById('QtyUnit').value = data.data.qtyUnit;
                document.getElementById('AltQtyNo').value = data.data.altQty;
                document.getElementById('AltQtyUnit').value = data.data.altQtyUnit;
                if (data.data.altQtyUnit != null) {
                    document.getElementById('AltDiv').style.display = "block";
                }
                else {
                    document.getElementById('AltDiv').style.display = "none";
                }
                document.getElementById('saveebutton1').innerHTML = "Update";
            }
        }
    });
}

function deleteVoucher(voucherno) {
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
                url: "api/physicalstock/DeleteVoucher",
                data: {
                    voucherno: voucherno,
                },
                success: function (data) {
                    if (data.success) {
                        $('#VoucherTable').DataTable().ajax.reload();
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