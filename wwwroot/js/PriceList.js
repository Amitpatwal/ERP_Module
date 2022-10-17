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
    LoadData();
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

function LoadData() {
    document.getElementById("addButton").style.display = "block"
    document.getElementById("dateDiv").style.display = "block"
    document.getElementById("ItemDiv").style.display = "none"
    dataTable = $("#PriceListDate").DataTable({
        ajax: {
            'url': '/api/PriceList/loadPricedateTable',
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns: [

            { 'data': null, 'defaultContent': '', 'width': '5%' },
            {
                'data': 'date', 'render': function (data) {
                    var dateStringWithTime = moment(data).format('DD-MMM-YYYY');
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '60%', 'font-size': '6px'
            },
            {
                'data': 'date', 'render': function (data) {
                    return `<button type="button" class="btn btn-success" onclick=ViewItem('${data}')>View Item</button>`;
                }, 'width': '30%', 'font-size': '6px'
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


    dataTable.on('order.dt ', function () {
        dataTable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
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
    document.getElementById("priceValue").value = "";
    document.getElementById("QtyUnit").value = "";
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
                    /* var were = data.data.where;
                     var frm = data.data.from
                     var altvalue = frm / were;*/

                }
                else {
                }
            }
            else {


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
    document.getElementById("txtName").disabled = false;
    document.getElementById("txtSize").disabled = false;
    document.getElementById("txtClass").disabled = false;
    document.getElementById("txtMake").disabled = false;
    currentTime();
    cleardataitem();
}


function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('pricedate').value = dateStringWithTime;
}

function SavePriceList() {


    var PriceDate = document.getElementById("pricedate").value;
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
   /* var makeid = document.getElementById("txtMake").value;
    var make = "";
    if (makeid != "" || makeid != "0") {
        make = document.getElementById("txtMake").selectedOptions[0].text;
    }*/
    let count = $("#txtMake")[0].selectedOptions.length;
    var txttmake = "";
    const make = [];
    for (i = 0; i < count; i++) {
        var txtMake = document.getElementById("txtMake").selectedOptions[i].text;
        make[i] = txtMake;
        if (i == 0) {
            var txttmake = txtMake;
        }
        else {
            var txttmake = txttmake + "/" + txtMake;
        }
    }
    var type = document.getElementById("saveebutton1").innerHTML;
    var price = document.getElementById("priceValue").value;
    var unitid = document.getElementById("txtUnit").value;
    var Unit = "";
    if (unitid != "")
    {
        Unit = document.getElementById("txtUnit").selectedOptions[0].text;
    }
    var Itemid = document.getElementById("Itemid").innerHTML;
   
    $.ajax({
        type: 'Post',
        url: "api/PriceList/savePriceList",
        data: {
            Type: type,
            date: PriceDate,
            pname: pname,
            pnameid: pnameid,
            psize: psize,
            psizeid: psizeid,
            pclass: pclass,
            pclassid: pclassid,
            pmake: txttmake,
            amount: price,
            unit: Unit,
            unitid: unitid,
            Itemid: Itemid,
            make: make
        },
        success: function (data) {
            if (data.success == true) {

                Toast.fire({
                    icon: 'success',
                    title: data.message,
                })
                if (type == "Save") {
                    $("#PriceListDate").DataTable().ajax.reload();
                }
                else if (type == "Update") {
                    $("#PriceListTable").DataTable().ajax.reload();
                }
                else {
                    $("#PriceListTable").DataTable().ajax.reload();
                }
                cleardataitem();
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


function fetchPriceList(id) {
    document.getElementById("Itemid").innerHTML = id;
    $.ajax({
        url: '/api/PriceList/ViewPurchase',
        type: 'GET',
        data: {
            ID: id,
        },
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                var dateStringWithTime = moment(data.data.date).format('YYYY-MM-DD');
                document.getElementById("pricedate").value = dateStringWithTime;
                $("#txtName option[value=" + data.data.pnameid + "]").remove();
                $('#txtName').append($("<option selected></option>").val(data.data.pnameid).html(data.data.pname));
                const Pname = data.data.pname;
                const size = data.data.psize;
                const classs = data.data.pclass;
                const unitid = data.data.unitid;
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
                                document.getElementById("txtSize").value = data.data.psizeid;
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
                                                document.getElementById('txtClass').value = data.data.pclassid;
                                            }
                                        }
                                    });
                                    $("#txtName").select2();
                            }
                        }
                    });
                    $("#txtSize").select2();
                }
                $('#txtMake').val(data.makelist);
                $('#txtMake').trigger('change');
                document.getElementById("priceValue").value = data.data.amount;
                $.ajax({
                    type: 'Post',
                    url: "api/itemdatatable/GetTableByData",
                    data: { type: "unit", pname: Pname, size: size, Class: classs },
                    success: function (data) {
                        if (data.success) {
                            $('#txtUnit').empty();
                            $('#txtUnit').append("<option value='0'>--Select--</option>");
                            $.each(data.data, function (key, value) {
                                $('#txtUnit').append($("<option></option>").val(value.id).html(value.desc));
                            });
                        }
                        $("#txtUnit").select2();
                        $('#txtUnit').val(unitid);
                        $('#txtUnit').trigger('change');
                    }
                });
              
                document.getElementById('saveebutton1').innerHTML = "Update";
            }
        }
    });
}


function fetchUpdatePriceList(id) {

    document.getElementById("Itemid").innerHTML = id;
    $.ajax({
        url: '/api/PriceList/ViewPurchase',
        type: 'GET',
        data: {
            ID: id,
        },
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                var dateStringWithTime = moment(data.data.date).format('YYYY-MM-DD');
                document.getElementById("pricedate").value = dateStringWithTime;
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
                                document.getElementById("txtSize").value = data.data.psizeid;
                                const size = data.data.psize;
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
                                                document.getElementById('txtClass').value = data.data.pclassid;
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

                $("#txtMake option[value=" + data.data.pmakeid + "]").remove();
                $('#txtMake').append($("<option selected></option>").val(data.data.pmakeid).html(data.data.pmake));
                document.getElementById("priceValue").value = data.data.amount;
                document.getElementById("QtyUnit").value = data.data.unit;
                document.getElementById('saveebutton1').innerHTML = "Update Price List";
                document.getElementById("txtName").disabled = true;
                document.getElementById("txtSize").disabled = true;
                document.getElementById("txtClass").disabled = true;
                document.getElementById("txtMake").disabled = true;
            }
        }
    });
}



function deletePriceList(itemId) {
    document.getElementById("Itemid").innerHTML = itemId;
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
                url: "api/PriceList/DeletePriceList",
                data: {
                    itemid: itemId,
                },
                success: function (data) {
                    if (data.success) {
                       
                        Toast.fire({
                            icon: 'success',
                            title: 'Price List Deleted',
                        })
                        $('#PriceListTable').DataTable().ajax.reload();
                    }
                    else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Something Went Wrong',
                        })
                    }
                }
            });

        };
    })


}

function ViewReport() {
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;
    LoadDatatable();
}

function ViewItem(date) {

    document.getElementById("dateDiv").style.display ="none"
    document.getElementById("ItemDiv").style.display ="block"

    dataTable = $("#PriceListTable").DataTable({
        ajax: {
            'url': '/api/PriceList/loadPricedateItemTable',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                Date: date
            }
        },
        columns: [
            { 'data': null, 'defaultContent': '', 'width': '2%' },
            {
                'data': 'pname', 'render': function (data, type, row) {
                    return `<a>${row.pname}</a><br>
                                    <a>${row.psize}</a> , &nbsp; 
                                    <a>${row.pclass}</a><br>
                                    <a>${row.pmake}</a><br>`;
                }, 'width': '30%', 'font-size': '5px',
            },
            { 'data': 'unit', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            { 'data': 'amount', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#Pricelist" onclick=fetchPriceList('${data}')><i class="fas fa-pencil-alt"></i>Edit</a>
                                    <a class="btn btn-success" style="color:white" data-toggle="modal" data-target="#Pricelist" onclick=fetchUpdatePriceList('${data}')><i class="fas fa-pencil-alt"></i>Copy List</a>
                                    <a class="btn btn-danger btn-sm" style="color:white" onclick=deletePriceList('${data}')> <i class="fas fa-trash"></i>Delete</a>
                             `;

                }, 'width': '15%'
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
    dataTable.on('order.dt ', function () {
        dataTable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}

function getunit() {
    var Pname = document.getElementById("txtName").selectedOptions[0].text;
    var size = document.getElementById("txtSize").selectedOptions[0].text;
    var classs = document.getElementById("txtClass").selectedOptions[0].text;
    if (classs == "--Select--") {
        classs = "";
    }
    if (Pname != null) {
        $.ajax({
            type: 'Post',
            url: "api/itemdatatable/GetTableByData",
            data: { type: "unit", pname: Pname, size: size, Class: classs },
            success: function (data) {
                if (data.success) {
                    $('#txtUnit').empty();
                    $('#txtUnit').append("<option value='0'>--Select--</option>");
                    $.each(data.data, function (key, value) {
                        $('#txtUnit').append($("<option></option>").val(value.id).html(value.desc));
                    });
                }
                $("#txtUnit").select2();
            }
        });
    }
}

