

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

    
    let url = new URLSearchParams(window.location.search);
    let msno = url.get('msno');
    if (msno != null) {
        viewMaterialShiftingForm(msno);
    }
    else
    {
        VoucherNo()
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById("Voucherdate").value = now.toISOString().slice(0, 16);
    }
});


function printMaterialShiftingButton() {
    var idd = document.getElementById('voucherno').value;
    window.open('../MaterialShiftingPrint?idd=' + idd, '_blank');
}

function viewMaterialShiftingForm(msno) {
    $.ajax({
        url: '/api/MaterialShifting/viewMaterialShifting?msno=' + msno,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.data.length > 0) {



                if (data.data[0].status == "Submitted") {

                    document.getElementById("approved").style.display = "block"
                    document.getElementById("rejected").style.display = "block"
                    document.getElementById("saveButton").style.display = "none"
                    document.getElementById("printbton").style.display = "none"

                }
                else if (data.data[0].status == "Approved") {

                    document.getElementById("approved").style.display = "block"
                    document.getElementById("rejected").style.display = "block"
                    document.getElementById("saveButton").style.display = "none"
                    document.getElementById("printbton").style.display = "block"

                }
                else if (data.data[0].status == "Rejected") {


                    document.getElementById("approved").style.display = "none"
                    document.getElementById("rejected").style.display = "none"
                    document.getElementById("saveButton").style.display = "block"
                }
              





                document.getElementById('voucherno').value = data.data[0].msno;
                var date = data.data[0].date;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('DD-MMMM-YYYY hh:mm');
                var hours = moment(now).format('hh');
                var x = Number(hours)
                var ampm = x >= 12 ? 'PM' : 'AM';
                dateStringWithTime = dateStringWithTime + " " + ampm;
                document.getElementById("Voucherdate").value = data.data[0].date;

                document.getElementById('shiftingIncharge').value = data.data[0].loadingInchrage;
                document.getElementById('transportName').value = data.data[0].transportName;
                document.getElementById('driverName').value = data.data[0].driverName;
                document.getElementById('vechileNo').value = data.data[0].vechileno;
                document.getElementById('remarks').value = data.data[0].remarks;
                document.getElementById('saveform').innerHTML = "Update";
                document.getElementById('tempsave').innerHTML = "Update";
                var msno = data.data[0].msno;
            }
            refreshtable(msno);
        }
    });
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

    var tempmsno = document.getElementById("tempmsno").innerHTML;
    var msnodigit = 0;
    var date = document.getElementById("Voucherdate").value;
    var shiftingIncharge = document.getElementById("shiftingIncharge").value;
    var transportName = document.getElementById("transportName").value;
    var driverName = document.getElementById("driverName").value;
    var vechileNo = document.getElementById("vechileNo").value;
    var remarks = document.getElementById("remarks").value;
    var msno = document.getElementById("voucherno").value;
    var savebutton = document.getElementById("saveform").innerHTML;
    if (shiftingIncharge != "") {
        document.getElementById("shiftingIncharge").style.borderColor = "black";
        document.getElementById("shiftlabel").style.color = "black";
        if (savebutton == "Save") {
            var url = "api/MaterialShifting/PermanantSave?tempmsno=" + tempmsno;
        }
        else {
            var url = "api/MaterialShifting/PermanantUpdate";
        }
        $.ajax({
            type: 'Post',
            url: url,
            data: {
                msnodigit: msnodigit,
                msno: msno,
                Date: date,
                loadingInchrage: shiftingIncharge,
                transportName: transportName,
                driverName: driverName,
                vechileno: vechileNo,
                remarks: remarks,
            },
            success: function (data) {
                if (data.success) {
                    var msno = data.data;
                    document.getElementById("voucherno").value = msno;
                    document.getElementById('saveform').innerHTML = "Update";
                    var savebutton = document.getElementById("saveform").innerHTML;

                    if (savebutton == "Save") {
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully saved'
                        })
                    }
                    else {
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully updated'
                        })
                    }

                    Swal.fire({
                        title: 'Are you sure ?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, Submit for Approval!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            finalSubmit()
                        }
                    })



                }
                else {
                    Swal.fire(data.message, '', 'info')
                }
            }
        });
    }
    else {
        document.getElementById("shiftingIncharge").style.borderColor = "red";
        document.getElementById("shiftlabel").style.color = "red";
        Swal.fire("Shifting Incharge is Missiong", '', 'info')

    }
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
                $('#toWarehouse').empty();
                $('#frmWarehouse').append("<option value='0'>Select</option>");
                $('#toWarehouse').append("<option value='0'>Select</option>");
                $.each(data.data, function (key, value) {
                    $('#frmWarehouse').append($("<option></option>").val(value.id).html(value.desc));
                    $('#toWarehouse').append($("<option></option>").val(value.id).html(value.desc));
                });
            }
            $("#frmWarehouse").select2();
            $("#toWarehouse").select2();
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
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var UpdatePermission = false;
    var ViewPermission = false;
    var deletePermission = false;
    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "MATERIAL_SHIFTING",
        },
        success: function (data) {
            if (data.data[0].operations == "VIEW") {
                if (data.data[0].permission == true) {
                    ViewPermission = true;
                } else {
                    ViewPermission = false;
                }
            }
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

            if (data.data[3].operations == "DELETE") {
                if (data.data[3].permission == true) {
                    deletePermission = true;
                } else {
                    deletePermission = false;
                }
            }
           
            document.getElementById('daterange').value = fromdate + " to " + todate;
           
           


            dataTable = $("#VoucherTable").DataTable({
                ajax: {
                    'url': '/api/MaterialShifting/VoucherList',
                    'type': 'GET',
                    data : {
                        fromdate: fromdate,
                        todate: todate,
                          },
                    'contentType': 'application/json'
                },
                columns: [
                    { 'data': 'voucherno', 'defaultContent': '-', 'width': '2%', 'font-size': '6px' },
                    {
                        'data': 'voucherdate', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('YYYY-MMM-DD');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '8%', 'font-size': '6px'
                    },
                    {
                        'data': 'pname', 'render': function (data, type, row) {
                            return `<a>${row.pname}</a><br>
                                    <a>${row.pclass}</a> ,&nbsp;
                                    <a>${row.psize}</a><br>
                                    <a>${row.pmake}</a>
                                       `;
                        }, 'width': '30%', 'font-size': '5px',
                    },
                    {
                        'data': 'qty', 'render': function (data, type, row) {
                            return `<a>${row.qty} ${row.qtyunit}</a>`;
                        }, 'width': '8%', 'font-size': '5px',
                    },

                    {
                        'data': 'altQty', 'render': function (data, type, row) {
                            return `<a>${row.altqty} ${row.altunit}</a>`;
                        }, 'width': '8%', 'font-size': '5px',
                    },
                    { 'data': 'username', 'defaultContent': '-', 'width': '8%', 'font-size': '6px' },

                    {
                        'data': 'voucherno', 'render': function (data, type, row) {
                            if (UpdatePermission == true && deletePermission == true) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#materialShifting" onclick=fetchVoucher('${data}')><i class="fas fa-pencil-alt"></i>Edit</a>
                              <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteVoucher('${data}')> <i class="fas fa-trash"></i>Delete</a>
                             `;
                            }
                            else if (UpdatePermission == true && deletePermission == false) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#materialShifting" onclick=fetchVoucher('${data}')><i class="fas fa-pencil-alt"></i>Edit</a>
                                       `;
                            }
                            else if (UpdatePermission == false && deletePermission == false) {
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
    $('#txtSize').empty();
    $('#txtClass').empty();
    $('#txtMake').val('');
    $('#txtMake').trigger('change');
    $('#frmWarehouse').trigger('change');
    $('#frmWarehouse').val('');
    $('#toWarehouse').trigger('change');
    $('#toWarehouse').val('');
    
    document.getElementById("QtyNo").value = "";
    document.getElementById("QtyUnit").value = "";
    document.getElementById("AltQtyNo").value = "";
    document.getElementById("AltQtyUnit").value = "";
    document.getElementById("currentStock").innerHTML = "";
    document.getElementById("AltDiv").style.display = "none";
    document.getElementById("saveebutton1").innerHTML = "Save";
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
    cleardataitem();
    fillwharehouse();
}

function VoucherNo() {
        $.ajax({
        type: 'GET',
        url: "api/MaterialShifting/VoucherNo",
        success: function (data) {
            if (data.success) {
                document.getElementById("voucherno").value = data.data;
            }
        }
    })
}


function adddetails() {
    var type = document.getElementById("tempsave").innerHTML;
    var savebutton = document.getElementById("saveform").innerHTML;
    if (savebutton == "Save") {
        var url = "api/MaterialShifting/AddtempmaterialShiftdetails?type=" + type;
        var msnodigit = document.getElementById("tempmsno").innerHTML;
    }
    else {
        var url = "api/MaterialShifting/Updatedetails";
        var msnodigit = document.getElementById("msnodigit").innerHTML;;
    }
    var loadingIncharge = document.getElementById("shiftingIncharge").value;
    var transportname = document.getElementById("transportName").value;
    var drivername = document.getElementById("driverName").value;
    var vechileno = document.getElementById("vechileNo").value;
    var date = document.getElementById("Voucherdate").value;
    var msno = document.getElementById('voucherno').value;
    var remarks = document.getElementById('remarks').value;
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            msnodigit: msnodigit,
            msno: msno,
            Date :date,
            loadingInchrage :loadingIncharge,
            transportName:transportname,
            driverName :drivername,
            vechileno:vechileno,
            remarks:remarks
        },
        success: function (data) {
            if (data.success) {
                document.getElementById('tempmsno').innerHTML = data.data;
                AddNewitem();
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
}

function AddNewitem() {

    var voucherDate = document.getElementById("Voucherdate").value;
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
    var frmWhareHouseid = document.getElementById("frmWarehouse").value;
    var frmWhareHouse = "";
    if (frmWhareHouseid != "" || frmWhareHouseid != "0") {
        frmWhareHouse = document.getElementById("frmWarehouse").selectedOptions[0].text;
    }
    var toWhareHouseid = document.getElementById("toWarehouse").value;
    var toWhareHouse = "";
    if (toWhareHouseid != "" || toWhareHouse != "0") {
        toWhareHouse = document.getElementById("toWarehouse").selectedOptions[0].text;
    }
    var type = document.getElementById("saveebutton1").innerHTML;

    var voucherno = document.getElementById("voucherno").value;
    var savebutton = document.getElementById("saveebutton1").innerHTML;
    var saveform = document.getElementById("saveform").innerHTML;
    var tempmsno = document.getElementById("tempmsno").innerHTML;
    var msnodigit = document.getElementById("msnodigit").innerHTML;
    var itemno = document.getElementById("itemid").value;

    if (savebutton == "Save") {
        if (saveform == "Save") {
            var url = "api/MaterialShifting/AddNewTempItem?tempmsno=" + tempmsno;
        }
        else {
            var url = "api/MaterialShifting/AddNewItem";
        }
    }
   
    else {
        if (saveform == "Save") {
            var url = "api/MaterialShifting/UpdateTempItem?tempmsno=" + tempmsno;
        }
        else {
            var url = "api/MaterialShifting/UpdateItem";
        }
    }

    $.ajax({
        type: 'Post',
        url: url,
        data: {
            msnodigit: msnodigit,
            type: type,
            msno: voucherno,
            itemid: itemno,
            Qty: Qty,
            QtyUnit: QtyUnit,
            AltQty: AltQty,
            AltQtyUnit: AltQtyUnit,
            pname: pname,
            psize: psize,
            pclass: pclass,
            pmake: make,
            makeid: makeid,
            fromGodown: frmWhareHouse,
            toGodown: toWhareHouse,
        },
        success: function (data) {
            if (data.success) {
                var tempbutton = document.getElementById('tempsave').innerHTML;
                var saveButton = document.getElementById('saveform').innerHTML;
                if (tempbutton == "Save") {
                    refreshtable(tempmsno);
                    document.getElementById('tempsave').innerHTML = "Update";
                }
                else if (saveButton == "Save") {
                    refreshtable(tempmsno);
                }
                else {
                    refreshtable(voucherno);
                }

            }
            else {
                Swal.fire(data.message, '', 'info')
            }

            $('#txtName').empty();
            $('#txtSize').empty();
            $('#txtClass').empty();
            $('#txtMake').empty();
            $('#toWarehouse').empty();
            $('#frmWarehouse').empty();
            document.getElementById('txtName').value = "";
            document.getElementById('txtSize').value = "";
            document.getElementById('txtClass').value = "";
            document.getElementById('txtMake').value = "";
            document.getElementById('toWarehouse').value = "";
            document.getElementById('frmWarehouse').value = "";


            document.getElementById('QtyNo').value = "";
            document.getElementById('QtyUnit').value = "";
            document.getElementById('AltQtyNo').value = "";
            document.getElementById('AltQtyUnit').value = "";
            document.getElementById('currentStock').innerHTML = "";
            document.getElementById("txtName").focus();
            document.getElementById("saveebutton1").innerHTML = "Save";
            fillwharehouse()

        }
    })
}
function refreshtable(msno) {
    var savebutton = document.getElementById("saveform").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/MaterialShifting/getitem?msnodigit=' + msno;
    }
    else {
        var url = '/api/MaterialShifting/getmaterialShiftingitem?msno=' + msno;
    }

    datatable = $("#ItemTable").DataTable({
        ajax: {
            'url': url,
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
                    }, 'width': '50%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },
                { 'data': 'pmake', 'defaultContent': '', 'width': '5%' },
                { 'data': 'fromGodown', 'defaultContent': '', 'width': '5%' },
                { 'data': 'toGodown', 'defaultContent': '', 'width': '5%' },
                
                
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.qty} ${row.qtyUnit}</a>`;
                    }, 'width': '10%', 'font-size': '5px',
                },

                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.altqty} ${row.altqtyUnit}</a>`;
                    }, 'width': '10%', 'font-size': '5px',
                },
                
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        return `<a class="fa fa-pencil" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=fillitemdata('${data}')></a>
                                            <a class="fa fa-trash" style="color:red" onclick=Remove(this)> </a>
                                           `;
                    }, 'width': '20%'
                },
            ],
        "language": {
            "emptyTable": "No data found, Please click on <b>Add New</b> Button"
        },

        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'ITEM REPORT',

            },

        ],
        "autoWidth": false,
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        "bAutoWidth": false,
        "bDestroy": true,
        "scrollX": true,

    });
}

function Approved() {
    var shiftingno = document.getElementById("voucherno").value;
    var shiftingdate = document.getElementById("Voucherdate").value;
    $.ajax({
        type: 'Post',
        url: "api/MaterialShifting/Approved",
        data: {
            ShiftingNo: shiftingno,
            Shiftingdate: shiftingdate
        },
        success: function (data) {
            if (data.success == true) {
                Toast.fire({
                    icon: 'success',
                    title: data.message,
                })
                document.getElementById("approved").style.display ="none"
                document.getElementById("rejected").style.display ="none"
               

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


function SaveVoucher() {
    var voucherno = document.getElementById("voucherno").value;
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
    var psize=""
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
    var frmWhareHouseid = document.getElementById("frmWarehouse").value;
    var frmWhareHouse = "";
    if (frmWhareHouseid != "" || frmWhareHouseid != "0") {
        frmWhareHouse = document.getElementById("frmWarehouse").selectedOptions[0].text;
    }
    var toWhareHouseid = document.getElementById("toWarehouse").value;
    var toWhareHouse = "";
    if (toWhareHouseid != "" || toWhareHouse != "0") {
        toWhareHouse = document.getElementById("toWarehouse").selectedOptions[0].text;
    }
    var type = document.getElementById("saveebutton1").innerHTML;
    $.ajax({
        type: 'Post',
        url: "api/MaterialShifting/addVoucher",
        data: {
            type: type,
            voucherno: voucherno,
            voucherDate: voucherDate,
            Qty: Qty,
            QtyUnit: QtyUnit,
            AltQty: AltQty,
            AltQtyUnit: AltQtyUnit,
            pname: pname,
            pnameid: pnameid,
            size: psize,
            sizeid: psizeid,
            Class: pclass,
            classid: pclassid,
            make: make,
            makeid: makeid,
            frmWhareHouseid: frmWhareHouseid,
            frmWhareHouse: frmWhareHouse,
            toWhareHouse: toWhareHouse,
            toWhareHouseid: toWhareHouseid,
        },
        success: function (data) {
            if (data.success == true) {
                document.getElementById("saveebutton1").innerHTML = "Update";
                document.getElementById("voucherno").value = data.data;
                $('#VoucherTable').DataTable().ajax.reload();
                Toast.fire({
                    icon: 'success',
                    title: data.message,
                })
            }
            else {

                document.getElementById("AltDiv").style.display = "none";
                document.getElementById("AltQtyUnit").value = "";
                Toast.fire({
                    icon: 'error',
                    title: data.message,
                })
            }
        }
    })
}

function fetchVoucher(voucherno)
{
    $.ajax({
        url: '/api/MaterialShifting/viewvVoucher?InvoiceNO=' + voucherno,
        type: 'GET',
        contentType: 'application/json',
            success: function (data) {
                if (data.success == true) {
                    var dateStringWithTime = moment(data.data.voucherDate).format('YYYY-MM-DD');
                    document.getElementById("voucherno").value = data.data.voucherno;
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
                    $("#toWarehouse option[value=" + data.data.toWhareHouseid + "]").remove();
                    $('#toWarehouse').append($("<option selected></option>").val(data.data.toWhareHouseid).html(data.data.toWhareHouse));
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

function Rejected() {
    var shiftingno = document.getElementById("voucherno").value;
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
                    url: "api/MaterialShifting/Rejected?voucherno=" + shiftingno,
                    success: function (data) {
                        if (data.success) {
                            Toast.fire({
                                icon: 'success',
                                title: data.message,
                            })
                            document.getElementById("approved").style.display = "none"
                            document.getElementById("rejected").style.display = "none"
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

function Remove(button) {
    var row = $(button).closest("TR");
    var itmno = $("TD", row).eq(0).html();
    var savebutton = document.getElementById("saveform").innerHTML;
    if (savebutton == "Save") {
        var url = "api/MaterialShifting/Deletetemprow";
    }
    else {
        var url = "api/MaterialShifting/Deleterow";
    }
    if (confirm("Do you want to delete: " + itmno)) {
        var tempmsno = document.getElementById("tempmsno").innerHTML;
        var msno = document.getElementById("voucherno").value;
        $.ajax({
            type: 'Delete',
            url: url,
            data:
            {
                msnodigit: tempmsno,
                itmno: itmno,
                msno: msno,
            },
            success: function (data) {
                if (data.success) {
                    var table = $("#ItemTable")[0];
                    table.deleteRow(row[0].rowIndex);
                    var finalamt = data.data;
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

function fillitemdata(itemno) {
    var savebutton = document.getElementById("saveform").innerHTML;
    var msno = document.getElementById("voucherno").value;
    var tempmsno = document.getElementById("tempmsno").innerHTML;
    if (savebutton == "Save") {
        var type = "temp";
    }
    else {
        var type = "permanant";

    }
    $.ajax({
        'url': '/api/MaterialShifting/getitembyid',
        'type': 'GET',
        'contentType': 'application/json',
        data:
        {
            tempmsno: tempmsno,
            itemid: itemno,
            type: type,
            msno: msno,
        },
        success: function (data) {
            if (data.success == true) {
                document.getElementById('itemid').value = data.data.itemid;
                $("#txtName option[value=" + data.data.pnameid + "]").remove();
                $('#txtName').append($("<option selected></option>").val(data.data.pnameid).html(data.data.pname));
                $("#txtSize option[value=" + data.data.psizeid + "]").remove();
                $('#txtSize').append($("<option selected></option>").val(data.data.psizeid).html(data.data.psize));
                $("#txtClass option[value=" + data.data.pclassid + "]").remove();
                $('#txtClass').append($("<option selected></option>").val(data.data.pclassid).html(data.data.pclass));
              /*  const Pname = data.data.pname;
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
                                const Psize = data.data.psize;
                                if (Pname != "") {
                                    $.ajax({
                                        type: 'Post',
                                        url: "api/itemdatatable/GetTableByData",
                                        data: { type: "class", pname: Pname, psize: Psize },
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

                }*/
                $("#frmWarehouse option[value=" + data.data.frmWhareHouseid + "]").remove();
                $('#frmWarehouse').append($("<option selected></option>").val(data.data.frmWhareHouseid).html(data.data.fromGodown));
                $("#toWarehouse option[value=" + data.data.toWhareHouseid + "]").remove();
                $('#toWarehouse').append($("<option selected></option>").val(data.data.toWhareHouseid).html(data.data.toGodown));
                $("#txtMake option[value=" + data.data.makeid + "]").remove();
                $('#txtMake').append($("<option selected></option>").val(data.data.makeid).html(data.data.pmake));
                document.getElementById('QtyNo').value = data.data.qty;
                document.getElementById('QtyUnit').value = data.data.qtyUnit;
                document.getElementById('AltQtyNo').value = data.data.altqty;
                document.getElementById('AltQtyUnit').value = data.data.altqtyUnit;
                if (data.data.altqtyUnit != null) {
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


function finalSubmit() {
    var msno = document.getElementById("voucherno").value;
    var url = "api/MaterialShifting/finalsubmit";
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            msno: msno,
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
                    title: 'Submitted saved'
                })
                document.getElementById("saveButton").style.display ="none"
                document.getElementById("printbton").style.display ="none"
            }
            else {
                Toast.fire({
                    icon: 'error',
                    title: data.message
                })
            }
        }
    })

}

function CurrentStock() {

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
    var Pmake = document.getElementById("txtMake").selectedOptions[0].text;
    var godown = document.getElementById("frmWarehouse").selectedOptions[0].text;
    $.ajax({
        type: 'Post',
        url: "api/MaterialShifting/CurrentMaterialstock",
        data: {
            pname: pname,
            Psize: psize,
            Pclass: pclass,
            Pmake: Pmake,
            GodownLocation: godown,
        },
        success: function (data) {
            if (data.success == true) {

                 var QtyUnit = document.getElementById("QtyUnit").value;
                document.getElementById("currentStock").innerHTML = data.currentStock.toFixed(2) + "  " + QtyUnit;
               
            }
            else {

            }
        }
    })
}