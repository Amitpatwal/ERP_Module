var weightt = 0.0;
var conver = 0.0;
$(document).ready(function () {
    fillcompany1('transportname', 'Transporter');
    let url = new URLSearchParams(window.location.search);
    let dpno = url.get('DPNO');
    if (dpno != null) {
        convertToLOD(dpno)
    }

});

function printLO() {
    var idd = document.getElementById('lono').value;
    window.open('../LoadingLOPrint?idd=' + idd, '_blank');
}

function convertToLOD(dpno) {
    $.ajax({
        url: '/api/LO/checkingLOD?dpno=' + dpno,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("suppliername").value = data.data.companyname;
                document.getElementById("addresss").value = data.data.address;
                document.getElementById("lonodigit").value = data.data.loNodigit;
                $("#transportname option[value=" + data.data.transportCCode + "]").remove();
                $('#transportname').append($("<option selected></option>").val(data.data.transportCCode).html(data.data.transportName));
                document.getElementById("driverName").value = data.data.driverName;
                document.getElementById("DriverMobile").value = data.data.mobileno;
                document.getElementById("vehicle").value = data.data.vechileNo;
                document.getElementById("incharge").value = data.data.unloadingIncharge;
                document.getElementById("Note").value = data.data.note;

                var dono = "";
                if (data.frm == "TEMP") {
                    document.getElementById("lonodigit").value = data.data.loNodigit;
                    dono = data.data.loNodigit;
                    document.getElementById("saveLO").innerHTML = "Save";
                    LODNumber()
                    currentTime();
                } else {
                    dono = data.data.lono;
                    document.getElementById("saveLO").innerHTML = "Update";
                    document.getElementById("lono").value = data.data.lono;
                    document.getElementById("lodate").value = data.data.loDate;
                    document.getElementById('printbton').style.display = "block";
                }
                refreshtable(dono)

            }
            else if (data.error == false) {
                $.ajax({
                    url: '/api/LO/ConvertToLO?dpno=' + dpno,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.success == true) {
                            document.getElementById("suppliername").value = data.data.companyname;
                            document.getElementById("addresss").value = data.data.address;
                            document.getElementById("lonodigit").value = data.data.loNodigit;
                            $("#transportname option[value=" + data.data.transportCCode + "]").remove();
                            $('#transportname').append($("<option selected></option>").val(data.data.transportCCode).html(data.data.transportName));
                            document.getElementById("driverName").value = data.data.driverName;
                            document.getElementById("DriverMobile").value = data.data.mobileno;
                            document.getElementById("vehicle").value = data.data.vechileNo;
                            document.getElementById("incharge").value = data.data.unloadingIncharge;
                            document.getElementById("saveLO").innerHTML = "Save";
                            document.getElementById("lonodigit").value = data.data.loNodigit;
                            LODNumber()
                            currentTime();
                            refreshtable(data.data.loNodigit)

                        }
                    }
                })
            }
            else {
                Swal.fire(data.message, '', 'info')
            }

        }
    })

}

function LODNumber() {
    $.ajax({
        type: 'GET',
        url: "api/LO/LODONO",
        success: function (data) {
            if (data.success) {
                document.getElementById("lono").value = data.data;
            }
        }
    });
}

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('lodate').value = now.toISOString().slice(0, 16);

}

function refreshtable(LoNodigit) {
    var savebutton = document.getElementById("saveLO").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/LO/getitemLO?LoNodigit=' + LoNodigit;
    }
    else {
        var url = '/api/LO/getitemByLONO?LONO=' + LoNodigit;
    }

    datatable = $("#ItemTable").DataTable({
        ajax: {
            'url': url,
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                { 'data': null, 'defaultContent': '', 'width': '.1%' },
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
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.orderqty} ${row.orderunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
                },
                { 'data': 'mtrqTy', 'defaultContent': '', 'width': '5%', 'className': "text-right" },
                { 'data': 'altQty', 'defaultContent': '', 'width': '5%', 'className': "text-right" },
                { 'data': 'itemWeight', 'defaultContent': '', 'width': '5%', 'className': "text-right" },
                { 'data': 'materialSource', 'defaultContent': 'Select Material Source', 'width': '20%' },

                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        return `<a class="fa fa-pencil" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=dataitem('${data}')></a>`;
                    }, 'width': '1%',
                },
            ],
        "language":
        {
            "emptyTable": "No data found, Please click on <b>Add New</b> Button"
        },
        dom: 'lBfrtip',
        "bDestroy": true,
        "autoWidth": false,
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        fixedColumns: false,
        "bAutoWidth": false,
        "scrollX": false,
        "responsive": false,
        buttons: [
            {
                text: 'Print',
                action: function (e, dt, node, config) {
                    var idd = document.getElementById('donumber').value;
                    window.open('../LoadingPrint?idd=' + idd, '_blank');

                }
            }
        ],


    });
    datatable.on('order.dt ', function () {
        datatable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

}
function fillitemdata(itemno) {
    var savebutton = document.getElementById("saveLO").innerHTML;
    var LONO = document.getElementById("lono").value;
    var tempDono = document.getElementById("lonodigit").value;
    if (savebutton == "Save") {
        var type = "temp";
    }
    else {
        var type = "permanant";

    }
    $.ajax({
        'url': '/api/LO/getitembyidLO',
        'type': 'GET',
        'contentType': 'application/json',
        data:
        {
            tempDono: tempDono,
            itemid: itemno,
            type: type,
            LONO: LONO,
        },
        success: function (data) {
            if (data.success == true) {
                document.getElementById('itemid').value = data.data.itemid;
                $("#txtName option[value=" + data.data.pnameid + "]").remove();
                $('#txtName').append($("<option selected></option>").val(data.data.pnameid).html(data.data.pname));
                $("#txtSize option[value=" + data.data.psizeid + "]").remove();
                $('#txtSize').append($("<option selected></option>").val(data.data.psizeid).html(data.data.psize));
                weightt = data.data2.weight;
                conver = data.data2.from;
                const Pname = data.data.pname;
                const size = data.data.psize;
                $.ajax({
                    type: 'Post',
                    url: "api/itemdatatable/GetTableByData",
                    data: { type: "class", pname: Pname, size: size },
                    success: function (data2) {
                        if (data2.success) {
                            $('#txtClass').empty();
                            $('#txtClass').append("<option value='0'>--Select--</option>");
                            $.each(data2.data, function (key, value) {
                                $('#txtClass').append($("<option></option>").val(value.id).html(value.desc));
                            });
                            document.getElementById('txtClass').value = data.data.pclassid;
                        }
                    }
                })


                $("#txtMake option[value=" + data.data.pmakeid + "]").remove();
                $('#txtMake').append($("<option selected></option>").val(data.data.pmakeid).html(data.data.pmake));
                $("#txtWarehouse option[value=" + data.data.sourceid + "]").remove();
                $('#txtWarehouse').append($("<option selected></option>").val(data.data.sourceid).html(data.data.materialSource));

                document.getElementById('orderqtyy').value = data.data.orderqty;
                document.getElementById('orderqtyunit').value = data.data.orderunit;
                document.getElementById('orderQty').value = data.data.orderqty + " " + data.data.orderunit;
                document.getElementById('qtyMtr').value = data.data.mtrqTy;
                document.getElementById('altqty').value = data.data.altQty;
                document.getElementById('itmweight').value = data.data.itemWeight;
                if (data.status) {
                    document.getElementById('saveebutton1').innerHTML = "Update";
                } else {
                    document.getElementById('saveebutton1').innerHTML = "Save";
                }
            }
        }
    });
}
function addLOdetails() {
    var LoNodigit = document.getElementById("lonodigit").value;
    var lono = document.getElementById("lono").value;
    var olddono = document.getElementById("olddono").innerHTML;
    var transporterid = document.getElementById("transportname").value;
    if (transporterid != "") {
        var transporter = document.getElementById("transportname").selectedOptions[0].text;
    } else {
        var transporter = "";
    }
    var driverName = document.getElementById("driverName").value;
    var vechileNo = document.getElementById("vehicle").value;
    var mobileNo = document.getElementById("DriverMobile").value;
    var UnloadingIncharge = document.getElementById("incharge").value;
    var Note = document.getElementById("Note").value;
    var savebutton = document.getElementById("saveLO").innerHTML;
    if (savebutton == "Save") {
        url = 'api/LO/Updatetempcompanydetails';
    }
    else {
        url = 'api/LO/Updatecompanydetails';
    }
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            LoNodigit: LoNodigit,
            Lono: lono,
            OldDoNo: olddono,
            TransportName: transporter,
            TransportCCode: transporterid,
            UnloadingIncharge: UnloadingIncharge,
            DriverName: driverName,
            VechileNO: vechileNo,
            Mobileno: mobileNo,
            Note: Note,
        },
        success: function (data) {
            if (data.success == true) {
                AddNewitem();
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
}


function AddNewitem() {
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
    var txtWarehouse = document.getElementById("txtWarehouse").value;
    if (txtWarehouse != "") { var txtWarehouse = document.getElementById("txtWarehouse").selectedOptions[0].text; }
    if (txtWarehouse == "Select") {
        txtWarehouse = "";
    }
    if (txtWarehouse != "") {
        document.getElementById("wharehouselabel").style.color = "black";
        document.getElementById("txtWarehouse").style.borderColor = "black";
        var txtName = document.getElementById("txtName").selectedOptions[0].text;
        if (txtName == 0) txtName = "";
        if (txtName == "--Select--") txtName = "";
        var txtSize = document.getElementById("txtSize").value;
        if (txtSize != "") {

            var txtSize = document.getElementById("txtSize").selectedOptions[0].text;
            if (txtSize == "--Select--") { txtSize = ""; }
        }

        var txtClass = document.getElementById("txtClass").value;
        if (txtClass != "") {
            var txtClass = document.getElementById("txtClass").selectedOptions[0].text;
            if (txtClass == "--Select--") { txtClass = ""; }
        }

        var txtmake = document.getElementById("txtMake").value;
        if (txtmake != "") {
            var txtmake = document.getElementById("txtMake").selectedOptions[0].text;
            if (txtmake == "--Select--") { txtmake = ""; }
        }

        var OrderQty = document.getElementById("orderqtyy").value;
        var orderqtyunit = document.getElementById("orderqtyunit").value;
        var Qty = document.getElementById("qtyMtr").value;
        var altqty = document.getElementById("altqty").value;
        var ItemWeight = document.getElementById("itmweight").value;

        var lono = document.getElementById('lono').value;
        var lonodigit = document.getElementById("lonodigit").value;
        var saveDO = document.getElementById("saveLO").innerHTML;
        var saveitemm = document.getElementById("saveebutton1").innerHTML;
        if (saveDO == "Save") {

            var url = "api/LO/AddNewTempItem?type=" + saveitemm;
        }
        else {
            var url = "api/LO/AddNewItem?type=" + saveitemm;
        }

        var itemid = document.getElementById("itemid").value;

        $.ajax({
            type: 'Post',
            url: url,
            data:
            {
                LoNodigit: lonodigit,
                LoNo: lono,
                Itemid: itemid,
                pname: txtName,
                psize: txtSize,
                pclass: txtClass,
                pmake: txtmake,
                OrderQty: OrderQty,
                orderunit: orderqtyunit,
                MTRQTy: Qty,
                altQty: altqty,
                ItemWeight: ItemWeight,
                MaterialSource: txtWarehouse,
            },
            success: function (data) {
                if (data.success) {

                    document.getElementById('saveebutton1').innerHTML = "Update";
                    $('#ItemTable').DataTable().ajax.reload();
                    $('#ItemTableLoad').DataTable().ajax.reload();
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully add!'
                    })
                }
                else {
                    Swal.fire(data.message, '', 'info')
                }
            }
        });

    }
    else {


        document.getElementById("wharehouselabel").style.color = "red";
        document.getElementById("txtWarehouse").style.borderColor = "red";

        Toast.fire({
            icon: 'error',
            title: 'Please select the wharehouse!'
        })

    }
}


function despatchMaterial() {

    var type = document.getElementById("saveLO").innerHTML;
    var lonodigit = document.getElementById("lonodigit").value;
    var LONO = document.getElementById("lono").value;

    datatable = $("#dispachtedMaterial").DataTable({
        ajax: {
            'url': '/api/LO/getdespatchitem',
            'data': {
                LONO: LONO,
                type: type,
                lonodigit: lonodigit,
            },
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                { 'data': null, 'defaultContent': '', 'width': '.1%' },
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
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.orderqty} ${row.orderunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
                },
                { 'data': 'mtrqTy', 'defaultContent': '', 'width': '5%', 'className': "text-right" },
                { 'data': 'altQty', 'defaultContent': '', 'width': '5%', 'className': "text-right" },
                { 'data': 'itemWeight', 'defaultContent': '', 'width': '5%', 'className': "text-right" },
                { 'data': 'materialSource', 'defaultContent': 'Select Material Source', 'width': '20%' },

                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        return `<a class="fa fa-pencil" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=dataitem('${data}')></a>
                                <a class="fa fa-close" style="font-size:24px;color:red" onclick=Remove(${data})></a>`;
                    }, 'width': '1%',
                },
            ],
        "language": {
            "emptyTable": "No data found, Please click on <b>Add New</b> Button"
        },
        "bDestroy": true,
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bAutoWidth": false,
    });
    datatable.on('order.dt', function () {
        datatable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}

function Remove(itmno) {
    var type = document.getElementById("saveLO").innerHTML;
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
    if (confirm("Do you want to delete: " + itmno)) {
        var lonodigit = document.getElementById("lonodigit").value;
        var lono = document.getElementById("lono").value;
        $.ajax({
            type: 'Delete',
            url: "api/LO/DeleteLOItem",
            data:
            {
                type: type,
                lonodigit: lonodigit,
                itmno: itmno,
                lono: lono,
            },
            success: function (data) {
                if (data.success) {
                    $('#ItemTable').DataTable().ajax.reload();
                    $('#dispachtedMaterial').DataTable().ajax.reload();
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully deleted',
                    })
                }
                else {

                    Swal.fire(data.message, '', 'info')
                }
            }
        });
    }
}
function permanentsave() {
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

    var companyname = document.getElementById("suppliername").value;
    var address = document.getElementById("addresss").value;
    var lono = document.getElementById("lono").value;
    var lonodigit = document.getElementById("lonodigit").value;
    var lodate = document.getElementById("lodate").value;
    var Note = document.getElementById("Note").value;
    var transporterid = document.getElementById("transportname").value;
    if (transporterid != "") {
        var transporter = document.getElementById("transportname").selectedOptions[0].text;
    } else {
        var transporter = "";
    }

    var driverName = document.getElementById("driverName").value;
    var vechileNo = document.getElementById("vehicle").value;
    var mobileNo = document.getElementById("DriverMobile").value;
    var UnloadingIncharge = document.getElementById("incharge").value;
    var type = document.getElementById("saveLO").innerHTML;
    var olddono = document.getElementById("olddono").innerHTML;
    if (type == "Save") {

        url = "api/LO/PermanantSave?templonodigit=" + lonodigit;

    }
    else {
        url = "api/LO/PermanantUpdate";
    }

    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            lono: lono,
            OldDoNo: olddono,
            LoDate: lodate,
            Companyname: companyname,
            Address: address,
            DriverName: driverName,
            VechileNO: vechileNo,
            Mobileno: mobileNo,
            TransportName: transporter,
            TransportCCode: transporterid,
            Note: Note,
            UnloadingIncharge: UnloadingIncharge,
        },
        success: function (data) {
            if (data.success == true) {
                document.getElementById("lono").value = data.data;
                document.getElementById('saveLO').innerHTML = "Update";
                document.getElementById('printbton').style.display = "block";
                Toast.fire({
                    icon: 'succedd',
                    title: 'Successfull saved',
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
function altweight() {
    var qty = document.getElementById("qtyMtr").value;
    document.getElementById("altqty").value = (qty / conver).toFixed(2);
    document.getElementById("itmweight").value = (qty * weightt).toFixed(2);
}
function getconer() {
    $.ajax({
        type: 'Post',
        url: "api/LO/getconvertor",
        data:
        {
            pname: txtName,
            psize: txtSize,
            pclass: txtClass,
        },
        success: function (data) {
            if (data.success) {
                weightt = data.data.weight;
                conver = data.data.from;

            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
}