var datatable;
$(document).ready(function () {
    $('#loading').hide();
    const fileInput = document.getElementById("document_attachment_doc");
    window.addEventListener('paste', e => {
        fileInput.files = e.clipboardData.files;
        previewimage()
    });


    SearchFunction();

    getconditions();
    let url = new URLSearchParams(window.location.search);
    let quotno = url.get('quotno');
    let Quotno = url.get('Quotno');
    if (quotno != null) {
        viewquotation(quotno);
    }
    else if (Quotno != null) {
        duplicateQuotation(Quotno);
        getcompany();

        currentTime();
        quotationnumber();
    }
    else {
        getcompany();
        checking();
        currentTime();
        quotationnumber();
    }
    $("#reset").click(function () {
        clearall();
    });

    $("#printbutton").click(function () {
        var idd = document.getElementById('quotationno').value;
        window.open('../SalesquotationPrint?idd=' + idd, '_blank');
    })

    $("#convertToPI").click(function () {
        var idd = document.getElementById('quotationno').value;
        window.location.href = "../PerformaInvoice?quotno=" + idd;
    });

});




function previewimage() {
    const [file] = document_attachment_doc.files
    if (file) {
        blah.src = URL.createObjectURL(file)
        document.getElementById("previewDiv").style.display = "block";
        document.getElementById("blah").style.display = "block";
    }
}

function closemodel() {
    document.getElementById("blah").style.display = "none";
    document.getElementById("previewDiv").style.display = "none";
    document.getElementById("document_attachment_doc").value = "";
}

function duplicateQuotation(Quotno) {

    $.ajax({
        url: '/api/Quotation/duplicate?Quotno=' + Quotno,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            checking();
        }
    });

}



function preview() {
    document.getElementById('uploadcontainer').style.display = "none";
    document.getElementById('frame').style.display = "block";
    frame.src = URL.createObjectURL(event.target.files[0]);
}

function SearchFunction() {
    $('#searchList').on('dblclick', 'tr', function () {
        $(this).toggleClass('activee');
        var row = $(this).closest("TR");
        var dono = $("TD", row).eq(2).html();
        viewquotation(dono)
    });
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    window.onbeforeunload = function (e) {
        if (document.getElementById("permanantbt").style.display == "block") {
            var e = e || window.event;
            if (e) e.returnValue = 'Browser is being closed, is it okay?';//for IE & Firefox
            return 'Browser is being closed, is it okay?';// for Safari and Chrome
        }
    };

    $('input[type=checkbox]').click(function () {
        var groupName = $(this).attr('groupname');
        if (!groupName)
            return;
        var checked = $(this).is(':checked');
        $("input[groupname='" + groupName + "']:checked").each(function () {
            $(this).prop('checked', '');
        });
        if (checked)
            $(this).prop('checked', 'checked');
    });
}

function saveed(event) {
    let key = event.which;
    if (key == 13) { addcompanydetails(); }
}
function viewquotation(quotno) {
    $.ajax({
        url: '/api/Quotation/viewquotation?quotno=' + quotno,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.data.length > 0) {
                document.getElementById('quotationno').value = data.data[0].quotno;
                var date = data.data[0].date;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('DD-MMMM-YYYY hh:mm');
                var hours = moment(now).format('hh');
                var x = Number(hours)
                var ampm = x >= 12 ? 'PM' : 'AM';
                dateStringWithTime = dateStringWithTime + " " + ampm;
                document.getElementById("Voucherdate").value = data.data[0].date;
                $.ajax({
                    url: '/api/Client/Filldatatable',
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (dataa) {
                        if (dataa.success) {
                            $('#companyname').empty();
                            $('#companyname').append("<option value='0'>--Select--</option>");
                            $.each(dataa.data, function (key, value) {
                                $('#companyname').append($("<option></option>").val(value.customerid).html(value.companyname));
                            });

                        }
                        $("#companyname option[value=" + data.data[0].ccode + "]").remove();
                        $('#companyname').append($("<option selected></option>").val(data.data[0].ccode).html(data.data[0].companyname));
                    }
                });
                $("#companyname").select2();

                document.getElementById('contactperson').value = data.data[0].contactperson;
                document.getElementById('companyCategory').value = data.data[0].category;
                document.getElementById('dealingPerson').value = data.data[0].dealingPerson;
                document.getElementById('email').value = data.data[0].email;
                document.getElementById('phone').value = data.data[0].phone;
                document.getElementById('enqdate').value = data.data[0].enqdate;
                document.getElementById('referencecode').value = data.data[0].enqno;
                document.getElementById('remarkss').value = data.data[0].remarks;
                document.getElementById('qtnodigit').value = data.data[0].quotnodigit;
                var finalamt = data.data[0].amount;
                finalamt = finalamt.toFixed(2);
                finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('Totalamount').innerHTML = finalamt;
                document.getElementById('savequotation').innerHTML = "Update";

                document.getElementById('tempsave').innerHTML = "Update";
                var quotno = data.data[0].quotno;
                document.getElementById("convertpi").style.display = "block";
                document.getElementById("printbton").style.display = "block";
                document.getElementById("attachmentsdiv").style.display = "block";

            }
            refreshtable(quotno);
            counter();
            $.ajax({
                url: '/api/Quotation/printcondition?qutono=' + quotno,
                type: 'GET',
                contentType: 'application/json',
                success: function (data) {
                    if (data.success) {
                        $("#condition1 option[value=" + data.data[0].id + "]").remove();
                        $('#condition1').append($("<option selected></option>").val(data.data[0].id).html(data.data[0].condition));
                        $("#condition2 option[value=" + data.data[1].id + "]").remove();
                        $('#condition2').append($("<option selected></option>").val(data.data[1].id).html(data.data[1].condition));
                        $("#condition3 option[value=" + data.data[2].id + "]").remove();
                        $('#condition3').append($("<option selected></option>").val(data.data[2].id).html(data.data[2].condition));
                        $("#condition4 option[value=" + data.data[3].id + "]").remove();
                        $('#condition4').append($("<option selected></option>").val(data.data[3].id).html(data.data[3].condition));
                        $("#condition5 option[value=" + data.data[4].id + "]").remove();
                        $('#condition5').append($("<option selected></option>").val(data.data[4].id).html(data.data[4].condition));
                        $("#condition6 option[value=" + data.data[5].id + "]").remove();
                        $('#condition6').append($("<option selected></option>").val(data.data[5].id).html(data.data[5].condition));
                        $("#condition7 option[value=" + data.data[6].id + "]").remove();
                        $('#condition7').append($("<option selected></option>").val(data.data[6].id).html(data.data[6].condition));
                    }
                }
            });
        }
    });
}
function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('enqdate').value = now.toISOString().slice(0, 16);
    document.getElementById("Voucherdate").value = now.toISOString().slice(0, 16);
}
function clearall() {
    var quotnodigit = document.getElementById("tempqtno").value;
    deletetempquotation(quotnodigit);
    window.location.href = "../Salesquotation";
}
function quotationnumber() {
    $.ajax({
        type: 'GET',
        url: "api/Quotation/QuotNo",
        success: function (data) {
            if (data.success) {
                $('#quotationno').text(data.data);
                document.getElementById("quotationno").value = data.data;
            }
        }
    })

}
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
function checking() {
    $.ajax({
        url: '/api/Quotation/checking',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.data.length > 0) {
                $("#companyname option[value=" + data.data[0].ccode + "]").remove();
                $('#companyname').append($("<option selected></option>").val(data.data[0].ccode).html(data.data[0].companyname));
                document.getElementById('contactperson').value = data.data[0].contactperson;
                document.getElementById('dealingPerson').value = data.data[0].dealingPerson;
                document.getElementById('email').value = data.data[0].email;
                document.getElementById('phone').value = data.data[0].phone;
                document.getElementById('enqdate').value = data.data[0].enqdate;
                document.getElementById('referencecode').value = data.data[0].enqno;
                document.getElementById('tempqtno').value = data.data[0].quotnodigit;
                var totalamount = Number(data.data[0].amount).toFixed(2)
                totalamount = totalamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('Totalamount').innerHTML = totalamount;
                document.getElementById('tempsave').innerHTML = "Update"
                var quotnodigit = document.getElementById("tempqtno").value;
                refreshtable(quotnodigit)
            }
        }
    });
}
function refreshtable(quotno) {
    var savebutton = document.getElementById("savequotation").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/Quotation/getitem?quotnodigit=' + quotno;
    }
    else {
        var url = '/api/Quotation/getQuotationitem?quotno=' + quotno;
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
                { 'data': 'rateunit', 'defaultContent': '', 'width': '5%' },
                {
                    'data': 'rate', 'render': function (data, type, row) {
                        var amount = row.rate;
                        amount = amount.toFixed(2);
                        amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        return `<a>${amount}</a>`;
                    }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
                },
                {
                    'data': 'discount', 'render': function (data, type, row) {
                        var discount = row.discount;
                        return `<a>${discount}</a>`;
                    }, 'width': '5%', 'className': "text-right", 'font-size': '5px'
                },
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.qty} ${row.rateunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px',
                },
                {
                    'data': 'discountrate', 'render': function (data, type, row) {
                        var amount = row.discountrate;
                        amount = amount.toFixed(2);
                        amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        return `<a>${amount}</a>`;
                    }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
                },
                {
                    'data': 'amount', 'render': function (data, type, row) {
                        var amount = row.amount;
                        amount = amount.toFixed(2);
                        amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        return `<a>${amount}</a>`;
                    }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
                },
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        return `<a class="fa fa-pencil" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=dataitem('${data}')></a>
                                            <a class="fa fa-trash" style="color:red" onclick=Remove(this)> </a>
                                            <a class="fa fa-plus-circle" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=insertRow(this)> </a>`;
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
    /*   datatable.on('order.dt search.dt', function () {
           datatable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
               cell.innerHTML = i + 1;
           });
       }).draw();*/
}
function fillitemdata(itemno) {
    var savebutton = document.getElementById("savequotation").innerHTML;
    var quotno = document.getElementById("quotationno").value;
    var tempqtno = document.getElementById("tempqtno").value;
    if (savebutton == "Save") {
        var type = "temp";
    }
    else {
        var type = "permanant";

    }
    $.ajax({
        'url': '/api/Quotation/getitembyid',
        'type': 'GET',
        'contentType': 'application/json',
        data:
        {
            tempqtno: tempqtno,
            itemid: itemno,
            type: type,
            quotno: quotno,
        },
        success: function (data) {
            if (data.success == true) {
                document.getElementById('itemid').value = data.data.itemid;
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
                                            var classs = data.data.pclass;
                                            $.ajax({
                                                type: 'Post',
                                                url: "api/itemdatatable/GetTableByData",
                                                data: { type: "unit", pname: Pname, size: size, Class: classs },
                                                success: function (data2) {
                                                    if (data.success) {
                                                        $('#txtUnit').empty();
                                                        $('#Unittype').empty();
                                                        $('#txtUnit').append("<option value='0'>--Select--</option>");
                                                        $('#Unittype').append("<option value='0'>--Select--</option>");
                                                        $.each(data2.data, function (key, value) {
                                                            $('#txtUnit').append($("<option></option>").val(value.id).html(value.desc));
                                                            $('#Unittype').append($("<option></option>").val(value.id).html(value.unitType));
                                                        });
                                                        $("#txtUnit option[value=" + data.data.unitid + "]").remove();
                                                        $('#txtUnit').append($("<option selected></option>").val(data.data.unitid).html(data.data.qtyunit));
                                                        $("#Unittype option[value=" + data.data.unitid + "]").remove();
                                                        $('#Unittype').append($("<option selected></option>").val(data.data.unitid).html(data.data.unitType));
                                                    }
                                                    $("#txtUnit").select2();

                                                }

                                            });

                                            let text = data.data.pmake;

                                            const myArray = text.split("/");
                                            $('#txtMake').val(myArray);
                                            $("#txtMake").select2();



                                        }
                                    });
                                    $("#txtName").select2();
                                }
                            }
                        }
                    });
                    $("#txtSize").select2();
                }
                document.getElementById('txtPrice').value = data.data.rate;
                document.getElementById('txtDisc').value = data.data.discount;
                document.getElementById('txtReqdQty').value = data.data.qty;
                document.getElementById('txtDiscPrice').value = data.data.discountrate;
                document.getElementById('txtAmount').value = data.data.amount;
                document.getElementById('txtRemarks').value = data.data.remarks;
                document.getElementById('saveebutton1').innerHTML = "Update";
            }
        }
    });
}
function deletetempquotation(quot) {
    $.ajax({
        type: 'Delete',
        url: "api/Quotation/DeleteTempQuotation?quotnodigit=" + quot,
        success: function (data) {
            if (data.success) {
                document.getElementById('tempqtno').value = "";
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
}

function addcompanydetails() {
    var type = document.getElementById("tempsave").innerHTML;
    var savebutton = document.getElementById("savequotation").innerHTML;
    if (savebutton == "Save") {
        var url = "api/Quotation/Addtempcompanydetails?type=" + type;
        var quotnodigit = document.getElementById("tempqtno").value;
    }
    else {
        var url = "api/Quotation/Updatecompanydetails";
        var quotnodigit = document.getElementById("qtnodigit").value;
    }

    var companyname = document.getElementById("companyname").selectedOptions[0].text;
    var ccodee = document.getElementById("companyname").value;
    var contactperson = document.getElementById("contactperson").value;
    var dealingPerson = document.getElementById("dealingPerson").value;
    var date = document.getElementById("Voucherdate").value;
    var email = document.getElementById("email").value;
    var remarks = document.getElementById("remarkss").value;
    var phone = document.getElementById("phone").value;
    var enqdate = document.getElementById("enqdate").value;
    var enqno = document.getElementById("referencecode").value;
    var quotno = document.getElementById('quotationno').value;
    var amount = document.getElementById('txtAmount').value;
    var category = document.getElementById('companyCategory').value;
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            quotnodigit: quotnodigit,
            quotno: quotno,
            date: date,
            ccode: ccodee,
            companyname: companyname,
            contactperson: contactperson,
            dealingPerson: dealingPerson,
            email: email,
            phone: phone,
            enqdate: enqdate,
            enqno: enqno,
            remarks: remarks,
            amount: amount,
            category: category,
        },
        success: function (data) {
            if (data.success) {
                document.getElementById('tempqtno').value = data.data;
                AddNewitem();
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
}
function AddNewitem() {
    var txtName = document.getElementById("txtName").selectedOptions[0].text;
    if (txtName == 0) txtName = "";
    var txtUnit = document.getElementById("txtUnit").selectedOptions[0].text;
    var unitType = document.getElementById("Unittype").selectedOptions[0].text;
    var unitid = document.getElementById("txtUnit").value;
    if (txtName != "" && txtUnit != "Select") {
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

        let count = $("#txtMake")[0].selectedOptions.length;
        var txttmake = "";
        for (i = 0; i < count; i++) {
            var txtMake = document.getElementById("txtMake").selectedOptions[i].text;
            if (i == 0) {
                var txttmake = txtMake;
            }
            else {
                var txttmake = txttmake + "/" + txtMake;
            }
        }
        var txtPrice = document.getElementById("txtPrice").value;
        var txtDisc = document.getElementById("txtDisc").value;
        var txtReqdQty = document.getElementById("txtReqdQty").value;
        var txtDiscPrice = document.getElementById("txtDiscPrice").value;
        txtDiscPric = Number(txtDiscPrice).toFixed(2);
        var txtRemarks = document.getElementById("txtRemarks").value;
        var txtAmount = document.getElementById("txtAmount").value;
        var quotno = document.getElementById('quotationno').value;
        var savebutton = document.getElementById("saveebutton1").innerHTML;
        var savequotation = document.getElementById("savequotation").innerHTML;
        var tempquotno = document.getElementById("tempqtno").value;
        var quotnodigit = document.getElementById("qtnodigit").value;
        var itemno = document.getElementById("itemid").value;

        if (savebutton == "Save") {
            if (savequotation == "Save") {
                var url = "api/Quotation/AddNewTempItem?tempquotno=" + tempquotno;
            }
            else {
                var url = "api/Quotation/AddNewItem";
            }
        }
        else if (savebutton == "Insert") {
            if (savequotation == "Save") {
                var url = "api/Quotation/InsertTempItem?tempquotno=" + tempquotno;
            }
            else {
                var url = "api/Quotation/InsertItem";
            }
        }
        else {
            if (savequotation == "Save") {
                var url = "api/Quotation/UpdateTempItem?tempquotno=" + tempquotno;
            }
            else {
                var url = "api/Quotation/UpdateItem";
            }
        }
        $.ajax({
            type: 'Post',
            url: url,
            data:
            {
                quotnodigit: quotnodigit,
                quotno: quotno,
                itemid: itemno,
                pname: txtName,
                /* altname: altname,*/
                psize: txtSize,
                /*altsize: altsize,*/
                pclass: txtClass,
                /*altclass: altlass,*/
                pmake: txttmake,
                rate: txtPrice,
                rateunit: txtUnit,
                unitType: unitType,
                discount: txtDisc,
                discountrate: txtDiscPrice,
                qty: txtReqdQty,
                amount: txtAmount,
                remarks: txtRemarks,
            },
            success: function (data) {
                if (data.success) {
                    var finalamt = data.data.toFixed(2);
                    document.getElementById('Totalamount').innerHTML = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    var tempbutton = document.getElementById('tempsave').innerHTML;
                    var saveButton = document.getElementById('savequotation').innerHTML;
                    if (tempbutton == "Save") {
                        refreshtable(tempquotno);
                        document.getElementById('tempsave').innerHTML = "Update";
                    }
                    else if (saveButton == "Save") {
                        refreshtable(tempquotno);
                    }
                    else {
                        refreshtable(quotno);
                    }

                }
                else {
                    Swal.fire(data.message, '', 'info')
                }
            }
        });


        $('#txtSize').empty();
        $('#txtName').empty();
        $('#txtClass').empty();
        $('#txtMake').empty();
        $('#txtUnit').empty();
        loadItems();
        document.getElementById('txtName').value = "";
        document.getElementById('txtUnit').value = "";
        document.getElementById('txtPrice').value = "";
        document.getElementById('txtDisc').value = "";
        document.getElementById('txtDiscPrice').value = "";
        document.getElementById('txtReqdQty').value = "";
        document.getElementById('txtRemarks').value = "";
        document.getElementById('txtAmount').value = "";
        document.getElementById("txtName").focus();
        document.getElementById("saveebutton1").innerHTML = "Save";
    }
    else {
        if (txtUnit == "Select") {
            document.getElementById("unitcolor").style.color = "red";
            document.getElementById("namecolor").style.color = "red";
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
                icon: 'error',
                title: 'Please input the required fields!'
            })
        }
        document.getElementById("txtName").style.borderColor = "red";
    }
}
function Remove(button) {
    var row = $(button).closest("TR");
    var itmno = $("TD", row).eq(0).html();
    var savebutton = document.getElementById("savequotation").innerHTML;
    if (savebutton == "Save") {
        var url = "api/Quotation/DeleteTempQuotationIT";
    }
    else {
        var url = "api/Quotation/DeleteQuotationIT";
    }
    if (confirm("Do you want to delete: " + itmno)) {
        var quot = document.getElementById("tempqtno").value;
        var quotno = document.getElementById("quotationno").value;
        $.ajax({
            type: 'Delete',
            url: url,
            data:
            {
                quotnodigit: quot,
                itmno: itmno,
                quotno: quotno,
            },
            success: function (data) {
                if (data.success) {
                    var table = $("#ItemTable")[0];
                    table.deleteRow(row[0].rowIndex);
                    var finalamt = data.data;
                    finalamt = finalamt.toFixed(2);
                    finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    document.getElementById('Totalamount').innerHTML = finalamt;
                    $('#ItemTable').DataTable().ajax.reload();
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
function changecursor(id) {
    document.getElementById(id).style.cursor = "pointer";
}
function filldetails() {
    var idd = document.getElementById("companyname").value;
    $.ajax({
        'url': '/api/Client/getClient?id=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('contactperson').value = data.data.contactPerson;
                document.getElementById('dealingPerson').value = data.data.dealingPerson;


                document.getElementById('email').value = data.data.email;
                document.getElementById('phone').value = data.data.phone;
            }
            else {
                document.getElementById('contactperson').value = "";
                document.getElementById('dealingPerson').value = "";
                document.getElementById('email').value = "";
                document.getElementById('phone').value = "";
            }
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
    var tempquotno = document.getElementById("tempqtno").value;
    var quotnodigit = 0;
    var quotdate = document.getElementById("Voucherdate").value;
    var companyname = document.getElementById("companyname").selectedOptions[0].text;
    var ccodee = document.getElementById("companyname").value;
    var contactperson = document.getElementById("contactperson").value;
    var dealingPerson = document.getElementById("dealingPerson").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var enqdate = document.getElementById("enqdate").value;
    var enqno = document.getElementById("referencecode").value;
    var remarks = document.getElementById("remarkss").value;
    var quotno = document.getElementById("quotationno").value;
    var category = document.getElementById("companyCategory").value;
    var savebutton = document.getElementById("savequotation").innerHTML;
    if (category == "") {
        category = "SelectCategory";
    }
    if (category != "SelectCategory") {
        document.getElementById("categoryColor").style.color = "black";
        document.getElementById("companyCategory").style.borderColor = "gray";
        if (savebutton == "Save") {
            var url = "api/Quotation/PermanantSave?tempquotno=" + tempquotno;
        }
        else {
            var url = "api/Quotation/PermanantUpdate";
        }

        $('#loading').show();
        $.ajax({
            type: 'Post',
            url: url,
            data: {
                category: category,
                Quotnodigit: quotnodigit,
                Quotno: quotno,
                Date: quotdate,
                Remarks: remarks,
                Enqno: enqno,
                Enqdate: enqdate,
                ContactPerson: contactperson,
                DealingPerson: dealingPerson,
                Companyname: companyname,
                Ccode: ccodee,
                Email: email,
                Phone: phone,
            },
            success: function (data) {
                if (data.success) {
                    var quotno = data.data;
                    document.getElementById("quotationno").value = quotno;
                    const condition = [];
                    condition[0] = document.getElementById("condition1").value;
                    condition[1] = document.getElementById("condition2").value;
                    condition[2] = document.getElementById("condition3").value;
                    condition[3] = document.getElementById("condition4").value;
                    condition[4] = document.getElementById("condition5").value;
                    condition[5] = document.getElementById("condition6").value;
                    condition[6] = document.getElementById("condition7").value;
                    var formData = new FormData();
                    for (i = 0; i < 7; i++) {
                        formData.append('conditionno', condition[i]);
                        formData.append('quotno', quotno);
                    }
                    $.ajax({
                        type: 'Post',
                        url: "api/Quotation/SaveCondition",
                        async: false,
                        cache: false,
                        contentType: false,
                        enctype: 'multipart/form-data',
                        processData: false,
                        data: formData,
                        success: function (data) {
                            if (data.success) {


                                var savebutton = document.getElementById("savequotation").innerHTML;
                                document.getElementById("convertpi").style.display = "block";
                                document.getElementById("printbton").style.display = "block";
                                if (savebutton == "Save") {
                                    Toast.fire({
                                        icon: 'success',
                                        title: 'Successfully saved'
                                    })
                                    document.getElementById("attachmentsdiv").style.display = "block";

                                }
                                else {
                                    Toast.fire({
                                        icon: 'success',
                                        title: 'Successfully updated'
                                    })
                                }
                                $('#loading').hide();

                                document.getElementById('savequotation').innerHTML = "Update";
                            }
                            else {
                                Swal.fire(data.message, '', 'info')
                                $('#loading').hide();
                            }
                        }
                    });
                }
                else {
                    Swal.fire(data.message, '', 'info')
                }
            }
        });
    }
    else {
        document.getElementById("categoryColor").style.color = "red";
        document.getElementById("companyCategory").style.borderColor = "red";
        Toast.fire({
            icon: 'error',
            title: 'Complete the required fields'
        })
    }
}
function addlist(nos) {
    Swal.fire({
        html: `<input type="hidden" id="id" class="swal2-input" value="${nos}">
                <a>${nos}  &#160</a>
                <input type="text" id="desc" style="width:450px ; class="swal2-input" placeholder="Enter Condition">
                `,
        confirmButtonText: 'Add',
        focusConfirm: false,
        preConfirm: () => {
            const desc = Swal.getPopup().querySelector("#desc").value;
            const id = Swal.getPopup().querySelector("#id").value;
            if (!desc) {
                Swal.showValidationMessage(`Value Cannot be null `)
            }
            return {
                desc: desc, id: id,
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const desc = `${result.value.desc}`;
            const id = `${result.value.id}`;
            $.ajax({
                type: 'Post',
                url: "api/Quotation/Addcondition",
                data: {
                    condition: desc, idd: id,
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire('Saved!', '', 'success')
                        getconditions();
                    }
                    else {
                        Swal.fire(data.message, '', 'info')
                    }
                }
            });




        }
    });
}
function viewTermandcondition(conditionno) {
    Swal.fire({
        html: `<div class="card">
                     <div class="card-body">
                                    <table id="conditionTable" class="table table-bordered table-hover" style="width:100%">
                                        <thead>
                                            <tr>
                                                <th style="width:5px">Sr No.</th>
                                                <th>Description</th>
                                                <th>Edit/Delete</th>
                                                <th>Default</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                       </div>      `,
        width: "900px",
        focusConfirm: false,
        showConfirmButton: false,
        preConfirm: () => {
            const desc = Swal.getPopup().querySelector("#desc").value;
            const id = Swal.getPopup().querySelector("#id").value;
            if (!desc) {
                Swal.showValidationMessage(`Value Cannot be null `)
            }
            return {
                desc: desc, id: id,
            };
        }
    })
    conditiontable = $("#conditionTable").DataTable({
        ajax: {
            'url': '/api/Quotation/Getconditions?conditionno=' + conditionno,
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                { 'data': 'id', 'defaultContent': '', 'width': '.5%' },
                { 'data': 'condition', 'defaultContent': '', 'width': '40%' },
                {
                    'data': 'sr', 'render': function (data, type, row) {
                        return `<a  class="btn btn-info btn-sm" style="color:white" onclick=updatecondition("${row.sr}")>  <i class="fas fa-edit">
                            Edit  </i></a>
                                   &nbsp &nbsp
                                    <a class="btn btn-danger btn-sm" style="color:white" onclick=deletecondition("${row.sr}","${row.conditionno}")> <i class="fas fa-trash">
                           Delete   </i> </a>`;
                    }, 'width': '20%'
                },
                {
                    'data': 'sr', 'render': function (data, type, row) {
                        return `<button onclick=defaultcondition("${row.conditionno}","${row.id}") id="printbutton" style="color:white " href="" class="btn btn-primary col start">
                                            <i class="fa fa-setting"></i>
                                            <span>Set as Default</span>
                                 </button>`
                    }, 'width': '16%'
                },
            ], "dom": '<"top"f>rt<"bottom"lp><"clear">',
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": true,
    });
}
function deletecondition(sr, nos) {
    swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this condition!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        showCancelButton: true,
    })
        .then((willDelete) => {
            if (willDelete.isConfirmed == true) {
                $.ajax({
                    type: 'Delete',
                    url: "api/Quotation/Deletecondition?sr=" + sr,
                    success: function (data) {
                        if (data.success) {
                            viewTermandcondition(nos);
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
                                title: 'Deleted Successfully'
                            })
                            viewTermandcondition(nos);
                        }
                        else {
                            Swal.fire(data.message, '', 'info')
                        }
                    }
                });
                /*  swal("Poof! Your condition has been deleted!", {
                      icon: "success",
                  });*/
            } else {
                swal.fire("Your condition is safe!");
                viewTermandcondition(nos);
            }
        });



}
function updatecondition(sr) {

    $.ajax({
        type: 'Get',
        url: "api/Quotation/GetconditionbySR?sr=" + sr,
        success: function (data) {
            $("#sr").val(data.data[0].sr);
            $("#desc").val(data.data[0].condition);
            $("#nos").val(data.data[0].conditionno);
        }
    });

    Swal.fire({
        html: `<input type="hidden" id="sr" class="swal2-input">
                <span id="nos"> &#160</span>
                <input type="text" id="desc" style="width:450px ; class="swal2-input" placeholder="Enter Condition">`,
        confirmButtonText: 'Update',

        focusConfirm: false,
        preConfirm: () => {
            const desc = Swal.getPopup().querySelector("#desc").value;
            const sr = Swal.getPopup().querySelector("#sr").value;
            const nos = Swal.getPopup().querySelector("#nos").value;
            if (!desc) {
                Swal.showValidationMessage(`Value Cannot be null `)
            }
            return {
                desc: desc, sr: sr, nos: nos
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const desc = `${result.value.desc}`;
            const sr = `${result.value.sr}`;
            $.ajax({
                type: 'Post',
                url: "api/Quotation/updatecondition",
                data: {
                    condition: desc, sr: sr,
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire('Update!', '', data.message)
                        getconditions();
                    }
                    else {
                        Swal.fire(data.message, '', 'info')
                    }
                }
            });
        }
        else {
            const nos = Swal.getPopup().querySelector("#nos").value;
            /*const nos = `${result.value.nos}`;*/
            viewTermandcondition(nos);
        }
    });
}
function defaultcondition(conditionno, id) {
    $.ajax({
        type: 'Post',
        url: "api/Quotation/defaultcondition",
        data: {
            conditionno: conditionno,
            idd: id,
        },
        success: function (data) {
            if (data.success) {
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

                Toast.fire({
                    icon: 'success',
                    title: 'Set as default'
                })
                getconditions();
                /*   conditiontable.ajax.reload();*/
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });

}
function getconditions() {
    $.ajax({
        type: 'Post',
        url: "api/Quotation/Getconditions?conditionno=" + 1,
        success: function (data) {
            if (data.success) {
                $('#condition1').empty();
                $('#condition1').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (value.defaultcondition == false) {
                        $('#condition1').append($("<option></option>").val(value.id).html(value.condition));
                    }
                    else {
                        $('#condition1').append($("<option selected></option>").val(value.id).html(value.condition));
                    }
                });
            }
        }
    });
    $.ajax({
        type: 'Post',
        url: "api/Quotation/Getconditions?conditionno=" + 2,

        success: function (data) {
            if (data.success) {
                $('#condition2').empty();
                $('#condition2').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (value.defaultcondition == false) {
                        $('#condition2').append($("<option></option>").val(value.id).html(value.condition));
                    }
                    else {
                        $('#condition2').append($("<option selected></option>").val(value.id).html(value.condition));
                    }
                });
            }
        }
    });
    $.ajax({
        type: 'Post',
        url: "api/Quotation/Getconditions?conditionno=" + 3,

        success: function (data) {
            if (data.success) {
                $('#condition3').empty();
                $('#condition3').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (value.defaultcondition == false) {
                        $('#condition3').append($("<option></option>").val(value.id).html(value.condition));
                    }
                    else {
                        $('#condition3').append($("<option selected></option>").val(value.id).html(value.condition));
                    }
                });
            }
        }
    });
    $.ajax({
        type: 'Post',
        url: "api/Quotation/Getconditions?conditionno=" + 4,

        success: function (data) {
            if (data.success) {
                $('#condition4').empty();
                $('#condition4').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (value.defaultcondition == false) {
                        $('#condition4').append($("<option></option>").val(value.id).html(value.condition));
                    }
                    else {
                        $('#condition4').append($("<option selected></option>").val(value.id).html(value.condition));
                    }
                });
            }
        }
    });
    $.ajax({
        type: 'Post',
        url: "api/Quotation/Getconditions?conditionno=" + 5,

        success: function (data) {
            if (data.success) {
                $('#condition5').empty();
                $('#condition5').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (value.defaultcondition == false) {
                        $('#condition5').append($("<option></option>").val(value.id).html(value.condition));
                    }
                    else {
                        $('#condition5').append($("<option selected></option>").val(value.id).html(value.condition));
                    }
                });
            }
        }
    });

    $.ajax({
        type: 'Post',
        url: "api/Quotation/Getconditions?conditionno=" + 6,
        success: function (data) {
            if (data.success) {
                $('#condition6').empty();
                $('#condition6').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (value.defaultcondition == false) {
                        $('#condition6').append($("<option></option>").val(value.id).html(value.condition));
                    }
                    else {
                        $('#condition6').append($("<option selected></option>").val(value.id).html(value.condition));
                    }
                });
            }
        }

    });
    $.ajax({
        type: 'Post',
        url: "api/Quotation/Getconditions?conditionno=" + 7,
        success: function (data) {
            if (data.success) {
                $('#condition7').empty();
                $('#condition7').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (value.defaultcondition == false) {
                        $('#condition7').append($("<option></option>").val(value.id).html(value.condition));
                    }
                    else {
                        $('#condition7').append($("<option selected></option>").val(value.id).html(value.condition));
                    }
                });
            }
        }

    });
    $("#condition1").select2();
    $("#condition2").select2();
    $("#condition3").select2();
    $("#condition4").select2();
    $("#condition5").select2();
    $("#condition6").select2();
    $("#condition7").select2();

}



function jumptoPrevious() {
    var quotnodigit = document.getElementById("qtnodigit").value;
    $.ajax({
        url: '/api/Quotation/jumptoPrevious?quotnodigit=' + quotnodigit,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
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
                    title: "Previous",
                })
                viewquotation(data.data);
            }
        }
    });
}
function jumptoNext() {
    var quotnodigit = document.getElementById("qtnodigit").value;
    $.ajax({
        url: '/api/Quotation/jumptoNext?quotnodigit=' + quotnodigit,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
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
                    title: "Next",
                })
                viewquotation(data.data);
            }


        }
    });
}


function attachments() {
    var voucherno = document.getElementById("quotationno").value;
    var vouchername = "SALES_QUOTATION";
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
                            <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteFile("${row.sr}")> <i class="fa fa-trash"></i>Delete</a>
                                `;
                    }, 'width': '15%'
                },
            ],
        "language": {
            "emptyTable": "No data found, Please click on "
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

function uploadFile() {
    let File1 = $("#document_attachment_doc")[0].files;
    let url = new URLSearchParams(window.location.search);
    var fu1 = document.getElementById("document_attachment_doc").value;
    var fu2 = fu1.substring(fu1.lastIndexOf('/') + 1);
    var voucherno = document.getElementById('quotationno').value;
    var datetime = document.getElementById('Voucherdate').value;
    if (File1 != null) {

        var formData = new FormData();
        for (i = 0; i < File1.length; i++) {
            formData.append('Name1', File1[i]);
            formData.append('vouchername', "SALES_QUOTATION");
            formData.append('voucherno', voucherno);
            formData.append('date', datetime);
        }
        console.log(formData);
        $.ajax({
            type: 'Post',
            url: "api/Attachments/AddFile",
            async: false,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            data: formData,
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
                if (data.success) {
                    Toast.fire({
                        icon: 'success',
                        title: 'File is Uploaded!'
                    })
                    datatable2.ajax.reload();
                    counter();
                    closemodel()
                }
                else {
                    Swal.fire(data.message, '', 'error')
                }
            }
        });
    }
    else {
        Swal.fire("Please select the file to upload", '', 'error')
    }
}
function deleteFile(id) {
    Swal.fire({
        title: 'Are your sure you want to delete?',
        text: "Once deleted, you'll be not able to recover file.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            var vouchername = "SALES_QUOTATION";
            var url = "api/Attachments/DeleteFile";
            $.ajax({
                type: 'Delete',
                url: url,
                data: {
                    vouchername: vouchername,
                    Id: id,
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
                    if (data.success) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Deleted'
                        })

                        datatable2.ajax.reload();
                        counter();
                    }
                    else {
                        Swal.fire(data.message, '', 'error');
                    }
                }
            })
        }
    })
}

function counter() {

    var voucherno = document.getElementById("quotationno").value;
    var vouchername = "SALES_QUOTATION";
    $.ajax({
        type: 'GET',
        url: "api/Attachments/counter",
        data: {
            voucherno: voucherno,
            vouchername: vouchername,
        },
        success: function (data) {
            if (data.success) {
                document.getElementById("attachmentsno").innerHTML = data.data;
            }
            else {
                document.getElementById("attachmentsno").innerHTML = "0";
            }
        }
    });

}

function searchingReport() {
    $("#searchReportDiv").show(150);
    var partynamecheck = document.getElementById("partynamecheck").checked;
    var QTNO = document.getElementById("QuotNoO").checked;
    var periodCheck = document.getElementById("periodcheck").checked;


    if (partynamecheck == true) {
        var searchtype = "PARTY";
    }
    else if (QTNO == true) {
        var searchtype = "QUOTNO";
    }
    else {
        var searchtype = "PERIOD";
    }

    var frmdate = document.getElementById("fromdate").value;
    var todate = document.getElementById("todate").value;
    var searchValue = document.getElementById("SearchRecordInput").value;

    datatable = $("#searchList").DataTable({
        ajax: {
            'url': "api/Quotation/SearchQuotation",
            'data': {
                searchtype: searchtype,
                searchValue: searchValue,
                frmdate: frmdate,
                todate: todate,
            },
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                { 'data': null, 'defaultContent': '', 'width': '.1%' },
                {
                    'data': 'date', 'render': function (data) {
                        var date = data;
                        var now = date.toString().replace('T', ' ');
                        var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                        return `<span>${dateStringWithTime}</span>`;
                    }, 'width': '5%', 'font-size': '6px'
                },
                { 'data': 'quotno', 'defaultContent': '', 'width': '10%' },
                { 'data': 'companyname', 'defaultContent': '', 'width': '80%' },

            ],
        "language":
        {
            "emptyTable": "No data found, Please click on <b>Add New</b> Button"
        },
        dom: 'lfrtip',
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

    });
    datatable.on('order.dt ', function () {
        datatable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

}




function saveitemaster() {
    var Pname = document.getElementById("pname").selectedOptions[0].text;
    var pnameid = document.getElementById("pname").value;
    var Size = document.getElementById("size").selectedOptions[0].text;
    var sizeid = document.getElementById("size").value;
    var Classs = document.getElementById("Class").selectedOptions[0].text;
    var classid = document.getElementById("Class").value;
    var Category = document.getElementById("category").selectedOptions[0].text;
    var categoryid = document.getElementById("category").value;
    var Unit = document.getElementById("unit").selectedOptions[0].text;
    var unitid = document.getElementById("unit").value;

    var enableunit = document.getElementById("togBtnunit").checked;
    var Altunit = document.getElementById("altunit").selectedOptions[0].text;
    var altunitid = document.getElementById("altunit").value;

    var where = document.getElementById("where").value;
    var from = document.getElementById("from").value;

    var enableweight = document.getElementById("togBtnweight").checked;
    var weightunit = document.getElementById("weightunit").selectedOptions[0].text;
    var weightunitid = document.getElementById("weightunit").value;
    var weight = document.getElementById("weight").value;
    var enableLowStock = document.getElementById("togBtnLowStock").checked;
    var ChooseWarningUnit = document.getElementById("togBtnSrUnit").checked;

    var maximumStock = document.getElementById("maximumStock").value;
    var maximumStockUnit = document.getElementById("highstocksuffix").value;
    var maximumStockUnitId = document.getElementById("maxstockid").value;

    var Lowstock = document.getElementById("minimumStock").value;
    var LowstockUnit = document.getElementById("lowstocksuffix").value;
    var LowstockUnitID = document.getElementById("lowstockid").value;

    var purchaseprice = document.getElementById("purchaseprice").value;
    var Hsncode = document.getElementById("hsncode").value;
    var id = document.getElementById("ItemId").value;
    var now = new Date;
    document.getElementById("creationdate").value = now.toISOString().slice(0, 16);
    var creationdate = document.getElementById("creationdate").value;
    if (enableunit == false) {
        where = 0;
        from = 0;
    }
    var counter = 0;
    if (Hsncode == "") {
        counter = counter + 1;
        document.getElementById("hsncolor").style.color = "red";
        document.getElementById("hsncode").style.borderColor = "red";
    } else {
        document.getElementById("hsncolor").style.color = "black";
        document.getElementById("hsncode").style.borderColor = "black";
    }
    if (Pname == "--Select--") {
        counter = counter + 1;
        document.getElementById("namecolor").style.color = "red";
        document.getElementById("namecolor").style.color = "red";
    } else {
        document.getElementById("namecolor").style.color = "black";
    }
    if (Category == "--Select--") {
        counter = counter + 1;
        document.getElementById("categorycolor").style.color = "red";
    } else {
        document.getElementById("categorycolor").style.color = "black";
    }
    if (Unit == "--Select--") {
        counter = counter + 1;
        document.getElementById("unitcolor").style.color = "red";
    } else {
        document.getElementById("unitcolor").style.color = "black";
    }
    if ((Altunit == "" || Altunit == "Select") && enableunit == true) {
        counter = counter + 1;
        document.getElementById("altunitcolor").style.color = "red";
    }
    else {
        document.getElementById("altunitcolor").style.color = "black";
    }
    if (from == "0" && enableunit == true) {
        counter = counter + 1;
        document.getElementById("from").style.color = "red";
    }
    else {
        document.getElementById("from").style.color = "black";
    }
    if (where == "0" && enableunit == true) {
        counter = counter + 1;
        document.getElementById("where").style.color = "red";
    }
    else {
        document.getElementById("where").style.color = "black";
    }
    if (counter > 0) {
        Swal.fire(`Complete the details!`, '', 'info')

    }
    else {
        if (Size == "--Select--") { Size = ""; }
        if (Classs == "--Select--") { Classs = ""; }
        if (Altunit == "Select") { Altunit = ""; }

        var savebutton = document.getElementById("savebutton").innerHTML;
        if (savebutton == "Save") {
            var url = "api/itemdatatable/AddNewItem?";
        }
        else {
            var url = "api/itemdatatable/UpdateItemMaster";
        }
        $.ajax({
            type: 'Post',
            url: url,
            data: {
                createiondate: creationdate,
                ItemId: id,
                pname: Pname,
                pnameid: pnameid,
                size: Size,
                sizeid: sizeid,
                Class: Classs,
                classid: classid,
                category: Category,
                categoryid: categoryid,
                unit: Unit,
                unitid: unitid,
                enableunit: enableunit,
                altunit: Altunit,
                altunitid: altunitid,
                where: where,
                from: from,
                enableweight: enableweight,

                weightunit: weightunit,
                weightunitid: weightunitid,
                weight: weight,

                price: purchaseprice,
                Hsncode: Hsncode,
                EnableLowStock: enableLowStock,
                chooseWarningUnit: ChooseWarningUnit,
                Lowstock: Lowstock,
                LowstockUnit: LowstockUnit,
                LowstockUnitID: LowstockUnitID,
                MaxStock: maximumStock,
                maximumStockUnit: maximumStockUnit,
                maximumStockUnitId: maximumStockUnitId,



            },
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
}