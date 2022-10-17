
var datatable;
$(document).ready(function () {
    SearchFunction();
    fillcompany1('suppliercompanyname', 'Supplier');
    fillcompany1('consigncompanyname', 'Customer');
    fillcompany1('recipientcompanyname', 'Customer');
    print_state("supplierstate");
    print_state("recipientstate");
    print_state("consignstate");
    currentTime();
    let url = new URLSearchParams(window.location.search);
    let ponumber = url.get('PONO');
    let pinumber = url.get('PINO');
    let sono = url.get('SONO');
    if (ponumber != null) {
        viewPO(ponumber);
    }
    else if (pinumber != null) {
        convertfromPI(pinumber);
        poNumber();
    }
    else if (sono != null) {
        convertfromSO(sono)
        poNumber();
    }
    else {
        checking();
        poNumber();
    }
    $("#reset").click(function () {
        clearall();
    });
  
})

function PrintPO(print) {
    var idd = document.getElementById('ponumber').value;
    window.open('../PurchaseOrderPrint?idd=' + idd + '&printtype=' + print, '_blank');
  
   

}



function SearchFunction() {
    $('#searchList').on('dblclick', 'tr', function () {
        $(this).toggleClass('activee');
        var row = $(this).closest("TR");
        var dono = $("TD", row).eq(2).html();
        viewPO(dono)
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

function searchingReport() {
    $("#searchReportDiv").show(150);
    var partynamecheck = document.getElementById("partynamecheck").checked;
    var PONO = document.getElementById("PONO").checked;
    var consignenamecheck = document.getElementById("consignenamecheck").checked;
    var periodCheck = document.getElementById("periodcheck").checked;


    if (partynamecheck == true) {
        var searchtype = "PARTY";
    }
    else if (PONO == true) {
        var searchtype = "PONO";
    }
    else if (consignenamecheck == true) {
        var searchtype = "CONSIGNEPARTY";
    }
    else {
        var searchtype = "PERIOD";
    }

    var frmdate = document.getElementById("fromdate").value;
    var todate = document.getElementById("todate").value;
    var searchValue = document.getElementById("SearchRecordInput").value;

    datatable = $("#searchList").DataTable({
        ajax: {
            'url': "api/PO/SearchPO",
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
               /* { 'data': 'date', 'defaultContent': '', 'width': '5%' },*/
                {
                    'data': 'date', 'render': function (data) {
                        var date = data;
                        var now = date.toString().replace('T', ' ');
                        var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                        return `<span>${dateStringWithTime}</span>`;
                    }, 'width': '5%', 'font-size': '6px'
                },
                { 'data': 'poNo', 'defaultContent': '', 'width': '10%' },
                { 'data': 'supplierCompanyname', 'defaultContent': '', 'width': '80%' },

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


function checking() {
    $.ajax({
        url: '/api/PO/checking',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                viewTempPO(data.data.poNodigit);
            }
        }
    });
}
function convertfromPI(pino) {
    $.ajax({
        url: '/api/PO/CheckPI?pino=' + pino,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.status == true) {
                if (data.datafrom == "permanant") {
                    var PONO = data.data;
                    viewPO(PONO);
                }
                else {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "A Previous P.O is available!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, Resume it!',
                        cancelButtonText: 'New P.O',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            viewTempPO(data.data.poNodigit)
                           
                        }
                        else {
                            ponodigit = data.data.poNodigit;
                            //new po
                            $.ajax({
                                url: '/api/PO/DeleteTempPO?ponodigit=' + ponodigit,
                                type: 'Delete',
                                contentType: 'application/json',
                                success: function (data) {
                                    if (data.success == true) {
                                        $.ajax({
                                            url: '/api/PO/ConvertFromPI?pino=' + pino,
                                            type: 'GET',
                                            contentType: 'application/json',
                                            success: function (data) {
                                                if (data.success == true) {
                                                    viewTempPO(data.data);
                                                   
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    })
                }
            }
            else {
                $.ajax({
                    url: '/api/PO/ConvertFromPI?pino=' + pino,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.success == true) {
                            viewTempPO(data.data);
                            
                        }
                    }
                });
            }

        }
    });

}
function convertfromSO(sono) {
    $.ajax({
        url: '/api/PO/Check?sono=' + sono,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.status == true) {
                if (data.datafrom == "permanant") {
                    var PONO = data.data;
                    viewPO(PONO);
                }
                else {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "A Previous P.O is available!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, Resume it!',
                        cancelButtonText: 'New P.O',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            //old PO
                            viewTempPO(data.data.poNodigit)
                        }
                        else {
                            ponodigit = data.data.poNodigit;
                            //new po
                            $.ajax({
                                url: '/api/PO/DeleteTempPO?ponodigit=' + ponodigit,
                                type: 'Delete',
                                contentType: 'application/json',
                                success: function (data) {
                                    if (data.success == true) {
                                        $.ajax({
                                            url: '/api/PO/ConvertFromSo?sono=' + sono,
                                            type: 'GET',
                                            contentType: 'application/json',
                                            success: function (data) {
                                                if (data.success == true) {
                                                    viewTempPO(data.data);
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    })
                }
            }
            else {
                $.ajax({
                    url: '/api/PO/ConvertFromSo?sono=' + sono,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.success == true) {
                            viewTempPO(data.data);
                        }
                    }
                });
            }

        }
    });

}
function saveed(event) {
    let key = event.which;
    if (key == 13) {
        addpodetails();
    }
}

function convertToPO(pinumber) {

}

function clearall() {
    var ponodigit = document.getElementById("tempponumber").value;
    deletetemp(ponodigit);
    window.location.href = "../PurchaseOrder";
}

function deletetemp(quot) {
    $.ajax({
        type: 'Delete',
        url: "api/PO/DeleteTempPO?ponodigit=" + quot,
        success: function (data) {
            if (data.success) {
                document.getElementById('tempponumber').value = "";
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
}

function viewTempPO(ponodigit) {
    $.ajax({
        url: '/api/PO/viewTempPurchaseOrder?ponodigit=' + ponodigit,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('tempponumber').value = data.data.poNodigit;

                $("#suppliercompanyname option[value=" + data.data.supplierCCode + "]").remove();
                $('#suppliercompanyname').append($("<option selected></option>").val(data.data.supplierCCode).html(data.data.supplierCompanyname));
                document.getElementById("suppliergst").value = data.data.supplierGST;
                document.getElementById("suppliercontactperson").value = data.data.supplierContactperson;
                document.getElementById("supplierphone").value = data.data.supplierPhone;
                document.getElementById("suppliermail").value = data.data.supplierEmail;
                document.getElementById("supplierqtnno").value = data.data.supplierQuotationNo;
                document.getElementById("supplierqtndate").value = data.data.supplierQuotationDate;
                document.getElementById("supplierstate").value = data.data.supplierState;
                var supplierstatecode = data.data.supplierStateCode;
                print_city('suppliercity', supplierstatecode);
                document.getElementById("suppliercity").value = data.data.supplierCity;
                document.getElementById("supplieraddress").value = data.data.supplierAddress;

                $("#recipientcompanyname option[value=" + data.data.recipientCCode + "]").remove();
                $('#recipientcompanyname').append($("<option selected></option>").val(data.data.recipientCCode).html(data.data.recipientCompanyname));
                document.getElementById("recipientgst").value = data.data.recipientGST;
                document.getElementById("recipientcontactperson").value = data.data.recipientContactPerson;
                document.getElementById("recipientmobile").value = data.data.recipientMobile;
                document.getElementById("recipientmail").value = data.data.recipientEmail;
                document.getElementById("orderno").value = data.data.recipientOrderNo;
                document.getElementById("orderdate").value = data.data.recipientOrderDate;
                document.getElementById("recipientstate").value = data.data.recipientState;
                var recipientstatecode = data.data.recipientStateCode;
                print_city('recipientcity', recipientstatecode);
                document.getElementById("recipientcity").value = data.data.recipientCity;
                document.getElementById("recipientaddress").value = data.data.recipientAddress;


                $("#consigncompanyname option[value=" + data.data.consignCCode + "]").remove();
                $('#consigncompanyname').append($("<option selected></option>").val(data.data.consignCCode).html(data.data.consignCompanyname));
                document.getElementById("Consigngst").value = data.data.consignGST;
                document.getElementById("Consigncontactperson").value = data.data.consignContactPerson;
                document.getElementById("Consignmobile").value = data.data.consignMobile;
                document.getElementById("Consignmail").value = data.data.consignEmail;
                document.getElementById("consignstate").value = data.data.consignState;
                var consignstatecode = data.data.consignStateCode;
                print_city('consigncity', consignstatecode);
                document.getElementById("consigncity").value = data.data.consignCity;
                document.getElementById("Consignaddress").value = data.data.consignAddress;
                document.getElementById("Consignaddress").value = data.data.consignAddress;
                document.getElementById("pono").value = data.data.consignOrderNo;
                document.getElementById("cpodate").value = data.data.consignOrderDate;

                var finalamt = data.data.amount;
                finalamt = finalamt.toFixed(2);
                finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('Totalamount').innerHTML = finalamt;
                document.getElementById('tempsave').innerHTML = "Update";
                var ponodigit = document.getElementById("tempponumber").value;
                refreshtable(ponodigit)
                currentTime();
            }
        }
    });

}
function viewPO(PONO) {
    /* var type = document.getElementById("savePO").innerHTML;
     var url = "";
     if (type = "Save") {
         url = '/api/PO/viewPurchaseOrder?PONO=' + PONO;
     }
     else {
         url = '/api/PO/viewPurchaseOrder?PONO=' + PONO;
     }*/
    $.ajax({
        url: '/api/PO/viewPurchaseOrder?PONO=' + PONO,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('ponodigit').value = data.data.poNodigit;
                $("#suppliercompanyname option[value=" + data.data.supplierCCode + "]").remove();
                $('#suppliercompanyname').append($("<option selected></option>").val(data.data.supplierCCode).html(data.data.supplierCompanyname));
                document.getElementById("suppliergst").value = data.data.supplierGST;
                document.getElementById("suppliercontactperson").value = data.data.supplierContactperson;
                document.getElementById("supplierphone").value = data.data.supplierPhone;
                document.getElementById("suppliermail").value = data.data.supplierEmail;
                document.getElementById("supplierqtnno").value = data.data.supplierQuotationNo;
                document.getElementById("supplierqtndate").value = moment(data.data.deliveryDate).format('yyyy-MM-DDThh:mm');data.data.supplierQuotationDate;
                document.getElementById("supplierstate").value = data.data.supplierState;
                var supplierstatecode = data.data.supplierStateCode;
                print_city('suppliercity', supplierstatecode);
                document.getElementById("suppliercity").value = data.data.supplierCity;
                document.getElementById("supplieraddress").value = data.data.supplierAddress;

                $("#recipientcompanyname option[value=" + data.data.recipientCCode + "]").remove();
                $('#recipientcompanyname').append($("<option selected></option>").val(data.data.recipientCCode).html(data.data.recipientCompanyname));
                document.getElementById("recipientgst").value = data.data.recipientGST;
                document.getElementById("recipientcontactperson").value = data.data.recipientContactPerson;
                document.getElementById("recipientmobile").value = data.data.recipientMobile;
                document.getElementById("recipientmail").value = data.data.recipientEmail;
                document.getElementById("orderno").value = data.data.recipientOrderNo;
                document.getElementById("orderdate").value = moment(data.data.deliveryDate).format('yyyy-MM-DDThh:mm'); data.data.recipientOrderDate;
                document.getElementById("recipientstate").value = data.data.recipientState;
                var recipientstatecode = data.data.recipientStateCode;
                print_city('recipientcity', recipientstatecode);
                document.getElementById("recipientcity").value = data.data.recipientCity;
                document.getElementById("recipientaddress").value = data.data.recipientAddress;


                $("#consigncompanyname option[value=" + data.data.consignCCode + "]").remove();
                $('#consigncompanyname').append($("<option selected></option>").val(data.data.consignCCode).html(data.data.consignCompanyname));
                document.getElementById("Consigngst").value = data.data.consignGST;
                document.getElementById("Consigncontactperson").value = data.data.consignContactPerson;
                document.getElementById("Consignmobile").value = data.data.consignMobile;
                document.getElementById("Consignmail").value = data.data.consignEmail;
                document.getElementById("consignstate").value = data.data.consignState;
                var consignstatecode = data.data.consignStateCode;
                print_city('consigncity', consignstatecode);
                document.getElementById("consigncity").value = data.data.consignCity;
                document.getElementById("Consignaddress").value = data.data.consignAddress;
                document.getElementById("Consignaddress").value = data.data.consignAddress;
                document.getElementById("pono").value = data.data.consignOrderNo;
                document.getElementById("cpodate").value = moment(data.data.consignOrderDate).format('yyyy-MM-DDThh:mm');

                var finalamt = data.data.amount;
                finalamt = finalamt.toFixed(2);
                finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('Totalamount').innerHTML = finalamt;

                document.getElementById("cash").value = data.data.cash
                document.getElementById("gst").value = data.data.gst
                document.getElementById("delivery").value = data.data.delivery
                document.getElementById("mtc").value = data.data.mtc
                document.getElementById("nameoftransport").value = data.data.nameofTransport
                document.getElementById("pricebasis").value = data.data.priceBasis
                document.getElementById("paymentterms").value = data.data.paymentTerms
                document.getElementById("freightcharge").value = data.data.freightCharge
                document.getElementById("ponumber").value = data.data.poNo;
                document.getElementById("podate").value = moment(data.data.date).format('yyyy-MM-DDThh:mm');
                document.getElementById("note").value = data.data.remarks;

            }
            document.getElementById('tempsave').innerHTML = "Update";
            document.getElementById("savePO").innerHTML = "Update";
            document.getElementById("printbtn").style.display = "block";
            refreshtable(PONO);
        }
    });

}

function poNumber() {
    $.ajax({
        type: 'GET',
        url: "api/PO/PONO",
        success: function (data) {
            if (data.success) {
                $('#ponumber').text(data.data);
                document.getElementById("ponumber").value = data.data;
            }
        }
    });
}

function temppoNumber() {
    $.ajax({
        type: 'GET',
        url: "api/PO/TempPONO",
        success: function (data) {
            if (data.success) {
                var pono = data.data;
                $('#tempponumber').text(pono);
            }
        }
    });
}

function fillitemdata(itemno) {
    var savebutton = document.getElementById("savePO").innerHTML;
    var quotno = document.getElementById("ponumber").value;
    var tempqtno = document.getElementById("tempponumber").value;
    if (savebutton == "Save") {
        var type = "temp";
    }
    else {
        var type = "permanant";

    }
    $.ajax({
        'url': '/api/PO/getitembyid',
        'type': 'GET',
        'contentType': 'application/json',
        data:
        {
            tempPono: tempqtno,
            itemid: itemno,
            type: type,
            PONO: quotno,
        },
        success: function (data) {
            if (data.success == true) {
                document.getElementById('itemid').value = data.data.itemid;
                $("#txtName option[value=" + data.data.pnameid + "]").remove();
                $('#txtName').append($("<option selected></option>").val(data.data.pnameid).html(data.data.pname));

                /*document.getElementById('txtName').value = data.data[0].pname;*/
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
                                                        $('#txtUnit').append("<option value='0'>--Select--</option>");
                                                        $.each(data2.data, function (key, value) {
                                                            $('#txtUnit').append($("<option></option>").val(value.id).html(value.desc));
                                                        });
                                                        $("#txtUnit option[value=" + data.data.unitid + "]").remove();
                                                        $('#txtUnit').append($("<option selected></option>").val(data.data.unitid).html(data.data.qtyunit));
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
             /*   $("#txtUnit option[value=" + data.data.unitid + "]").remove();
                $('#txtUnit').append($("<option selected></option>").val(data.data.unitid).html(data.data.qtyunit));*/



              
                /*$('#txtUnit').append($("<option></option>").val(data.data[0].rateunit).html(data.data[0].rateunit));*/
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

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('podate').value = now.toISOString().slice(0, 16);
    document.getElementById('supplierqtndate').value = now.toISOString().slice(0, 16);
    document.getElementById('orderdate').value = now.toISOString().slice(0, 16);
    document.getElementById('cpodate').value = now.toISOString().slice(0, 16);
}

function AddNewitem() {

    var txtName = document.getElementById("txtName").selectedOptions[0].text;
    if (txtName == 0) txtName = "";
    var txtUnit = document.getElementById("txtUnit").selectedOptions[0].text;
    if (txtName != "" && txtUnit != "Select") {
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
        var PoNo = document.getElementById('ponumber').value;
        var savePO = document.getElementById("savePO").innerHTML;

        if (txtAmount != "" && txtAmount != "0.00") {


            if (savePO == "Save") {
                var PoNodigit = document.getElementById("tempponumber").value;
            }
            else {
                var PoNodigit = document.getElementById("ponodigit").value;
            }
            var savebutton = document.getElementById("saveebutton1").innerHTML;
            if (savebutton == "Save") {
                var itemno = 0;
                if (savePO == "Save") {
                    var url = "api/PO/AddNewTempItem";
                }
                else {
                    var url = "api/PO/AddNewItem";
                }
            }
            else if (savebutton == "Insert") {
                var itemno = document.getElementById("itemid").value;
                if (savePO == "Save") {
                    var url = "api/PO/InsertTempItem";
                }
                else {
                    var url = "api/PO/InsertItem";
                }
            }
            else {
                var itemno = document.getElementById("itemid").value;
                if (savePO == "Save") {
                    var url = "api/PO/UpdateTempItem";
                }
                else {
                    var url = "api/PO/UpdateItem";
                }
            }
            $.ajax({
                type: 'Post',
                url: url,
                data:
                {
                    PoNodigit: PoNodigit,
                    PoNo: PoNo,
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
                    discount: txtDisc,
                    discountrate: txtDiscPrice,
                    qty: txtReqdQty,
                    amount: txtAmount,
                    remarks: txtRemarks,
                },
                success: function (data) {
                    if (data.success) {
                        var finalamt = data.data;
                        finalamt = finalamt.toFixed(2);
                        finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        document.getElementById('Totalamount').innerHTML = finalamt;
                        var tempbutton = document.getElementById('tempsave').innerHTML;
                        if (tempbutton == "Save") {
                            refreshtable(PoNodigit);
                            document.getElementById('tempsave').innerHTML = "Update";
                        }
                        else {
                            $('#ItemTable').DataTable().ajax.reload();
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
            document.getElementById('txtUnit').value = "";
            document.getElementById('txtPrice').value = "";
            document.getElementById('txtDisc').value = "";
            document.getElementById('txtDiscPrice').value = "";
            document.getElementById('txtReqdQty').value = "";
            document.getElementById('txtRemarks').value = "";
            document.getElementById('txtAmount').value = "";
            document.getElementById("saveebutton1").innerHTML = "Save";
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Price is required',
            })
        }
    }

    else {
        if (txtUnit == "Select") {
            document.getElementById("unitcolor").style.color = "red";
            document.getElementById("namecolor").style.color = "red";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please input the required fields!',
            })


        }
        document.getElementById("txtName").style.borderColor = "red";
    }





}

/*function getcompany() {
    $.ajax({
        url: '/api/Client/Filldatatable',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                $('#suppliercompanyname').empty();
                $('#consigncompanyname').empty();
                $('#recipientcompanyname').empty();
                $('#consigncompanyname').append("<option value='0'>--Select--</option>");
                $('#suppliercompanyname').append("<option value='0'>--Select--</option>");
                $('#recipientcompanyname').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $('#consigncompanyname').append($("<option></option>").val(value.customerid).html(value.companyname));
                    $('#suppliercompanyname').append($("<option></option>").val(value.customerid).html(value.companyname));
                    $('#recipientcompanyname').append($("<option></option>").val(value.customerid).html(value.companyname));
                });
            }
        }
    });
    $("#consigncompanyname").select2();
    $("#suppliercompanyname").select2();
    $("#recipientcompanyname").select2();
}*/

function refreshtable(ponodigit) {
    var savebutton = document.getElementById("savePO").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/PO/getitem?PoNodigit=' + ponodigit;
    }
    else {
        var url = '/api/PO/getitemByPONO?PoNo=' + ponodigit;
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
                { 'data': 'rateunit', 'defaultContent': '', 'width': '112px' },
                { 'data': 'rate', 'defaultContent': '', 'width': '112px' },
               
                { 'data': 'discount', 'defaultContent': '', 'width': '10px' },
                { 'data': 'qty', 'defaultContent': '', 'width': '112px' },
                { 'data': 'discountrate', 'defaultContent': '', 'width': '112px' },

                { 'data': 'amount', 'defaultContent': '', 'width': '112px' },
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        return `<a class="fa fa-pencil" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=dataitem('${data}')></a>
                                <a class="fa fa-trash" style="color:red" onclick=Remove(this)> </a>
                                <a class="fa fa-plus-circle" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=insertRow(this)> </a>`;
                    }, 'width': '00px'
                },

            ],
        "language": {
            "emptyTable": "No data found, Please click on <b>Add New</b> Button"
        },
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false,
        "bAutoWidth": false,
        "bDestroy": true,
    });
}

function addpodetails() {

    var pono = document.getElementById("ponumber").value;
    var suppliercompanyname = document.getElementById("suppliercompanyname").selectedOptions[0].text;
    var suppliercompanynamecode = document.getElementById("suppliercompanyname").value;
    var suppliergst = document.getElementById("suppliergst").value;
    var suppliercontactperson = document.getElementById("suppliercontactperson").value;
    var supplierphone = document.getElementById("supplierphone").value;
    var supplieremail = document.getElementById("suppliermail").value;
    var supplierqtnno = document.getElementById("supplierqtnno").value;
    var supplierqtndate = document.getElementById("supplierqtndate").value;
    var supplierstate = document.getElementById("supplierstate").value;
    var supplierstatecode = document.getElementById("supplierstate").selectedIndex;
    var suppliercity = document.getElementById("suppliercity").value;
    var supplieraddress = document.getElementById("supplieraddress").value;

    var recipientcompanyname = document.getElementById("recipientcompanyname").selectedOptions[0].text
    var recipientcompanynamecode = document.getElementById("recipientcompanyname").value;
    var recipientgst = document.getElementById("recipientgst").value;
    var recipientcontactperson = document.getElementById("recipientcontactperson").value;
    var recipientphone = document.getElementById("recipientmobile").value;
    var recipientmail = document.getElementById("recipientmail").value;
    var recipientorderno = document.getElementById("orderno").value;
    var recipientorderdate = document.getElementById("orderdate").value;
    var recipientstate = document.getElementById("recipientstate").value;
    var recipientstatecode = document.getElementById("recipientstate").selectedIndex;
    var recipientcity = document.getElementById("recipientcity").value;
    var recipientaddress = document.getElementById("recipientaddress").value;

    var consigncompanyname = document.getElementById("consigncompanyname").selectedOptions[0].text
    var consigncompanynamecode = document.getElementById("consigncompanyname").value;
    var consigngst = document.getElementById("Consigngst").value;
    var consigncontactperson = document.getElementById("Consigncontactperson").value;
    var consignphone = document.getElementById("Consignmobile").value;
    var consignemail = document.getElementById("Consignmail").value;
    var consignpono = document.getElementById("pono").value;
    var consignpodate = document.getElementById("cpodate").value;
    var consignstate = document.getElementById("consignstate").value;
    var consignstatecode = document.getElementById("consignstate").selectedIndex;
    var consigncity = document.getElementById("consigncity").value;
    var consignaddress = document.getElementById("Consignaddress").value;
    var savebutton = document.getElementById("savePO").innerHTML;
    var type = document.getElementById("tempsave").innerHTML;
    if (savebutton == "Save") {
        var url = "api/PO/addtemppodetails?type=" + type;
        var ponodigit = document.getElementById("tempponumber").value;
    }
    else {
        var url = "api/PO/Updatecompanydetails";
        var ponodigit = document.getElementById("ponodigit").value;
    }
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            PoNodigit: ponodigit,
            PoNo: pono,

            SupplierCompanyname: suppliercompanyname,
            SupplierCCode: suppliercompanynamecode,
            SupplierGST: suppliergst,
            SupplierContactperson: suppliercontactperson,
            SupplierPhone: supplierphone,
            SupplierEmail: supplieremail,
            SupplierQuotationNo: supplierqtnno,
            SupplierQuotationDate: supplierqtndate,
            SupplierState: supplierstate,
            SupplierStateCode: supplierstatecode,
            SupplierCity: suppliercity,
            SupplierAddress: supplieraddress,

            RecipientCompanyname: recipientcompanyname,
            RecipientCCode: recipientcompanynamecode,
            RecipientGST: recipientgst,
            RecipientContactPerson: recipientcontactperson,
            RecipientMobile: recipientphone,
            RecipientEmail: recipientmail,
            RecipientOrderNo: recipientorderno,
            RecipientOrderDate: recipientorderdate,
            RecipientState: recipientstate,
            RecipientStateCode: recipientstatecode,
            RecipientCity: recipientcity,
            RecipientAddress: recipientaddress,

            ConsignCompanyname: consigncompanyname,
            ConsignCCode: consigncompanynamecode,
            ConsignGST: consigngst,
            ConsignContactPerson: consigncontactperson,
            ConsignMobile: consignphone,
            ConsignEmail: consignemail,
            ConsignOrderNo: consignpono,
            ConsignOrderDate: consignpodate,
            ConsignState: consignstate,
            ConsignStateCode: consignstatecode,
            ConsignCity: consigncity,
            ConsignAddress: consignaddress,


        },
        success: function (data) {
            if (data.success == true) {
                var tempsave = document.getElementById('tempsave').innerHTML;
                if (tempsave == "Save") {
                    document.getElementById('tempponumber').value = data.data;
                }
                AddNewitem();
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });


}

function permanentsave() {

    var ponodigit = document.getElementById("ponodigit").innerHTML;
    var date = document.getElementById("podate").value;
    var pono = document.getElementById("ponumber").value;
    var suppliercompanyname = document.getElementById("suppliercompanyname").selectedOptions[0].text;
    var suppliercompanynamecode = document.getElementById("suppliercompanyname").value;
    var suppliergst = document.getElementById("suppliergst").value;
    var suppliercontactperson = document.getElementById("suppliercontactperson").value;
    var supplierphone = document.getElementById("supplierphone").value;
    var supplieremail = document.getElementById("suppliermail").value;
    var supplierqtnno = document.getElementById("supplierqtnno").value;
    var supplierqtndate = document.getElementById("supplierqtndate").value;
    var supplierstate = document.getElementById("supplierstate").value;
    var supplierstatecode = document.getElementById("supplierstate").selectedIndex;
    var suppliercity = document.getElementById("suppliercity").value;
    var supplieraddress = document.getElementById("supplieraddress").value;


    var recipientcompanyname = document.getElementById("recipientcompanyname").selectedOptions[0].text
    var recipientcompanynamecode = document.getElementById("recipientcompanyname").value;
    var recipientgst = document.getElementById("recipientgst").value;
    var recipientcontactperson = document.getElementById("recipientcontactperson").value;
    var recipientphone = document.getElementById("recipientmobile").value;
    var recipientmail = document.getElementById("recipientmail").value;
    var recipientorderno = document.getElementById("orderno").value;
    var recipientorderdate = document.getElementById("orderdate").value;
    var recipientstate = document.getElementById("recipientstate").value;
    var recipientstatecode = document.getElementById("recipientstate").selectedIndex;
    var recipientcity = document.getElementById("recipientcity").value;
    var recipientaddress = document.getElementById("recipientaddress").value;

    var consigncompanyname = document.getElementById("consigncompanyname").selectedOptions[0].text
    var consigncompanynamecode = document.getElementById("consigncompanyname").value;
    var consigngst = document.getElementById("Consigngst").value;
    var consigncontactperson = document.getElementById("Consigncontactperson").value;
    var consignphone = document.getElementById("Consignmobile").value;
    var consignemail = document.getElementById("Consignmail").value;
    var consignpono = document.getElementById("pono").value;
    var consignpodate = document.getElementById("cpodate").value;
    var consignstate = document.getElementById("consignstate").value;
    var consignstatecode = document.getElementById("consignstate").selectedIndex;
    var consigncity = document.getElementById("consigncity").value;
    var consignaddress = document.getElementById("Consignaddress").value;

    var cash = document.getElementById("cash").value;
    var gst = document.getElementById("gst").value;
    var delivery = document.getElementById("delivery").value;
    var MTC = document.getElementById("mtc").value;
    var NameofTransport = document.getElementById("nameoftransport").value;
    var PriceBasis = document.getElementById("pricebasis").value;
    var PaymentTerms = document.getElementById("paymentterms").value;
    var FreightCharge = document.getElementById("freightcharge").value;
    var type = document.getElementById("savePO").innerHTML;
    var note = document.getElementById("note").value;


    if (type == "Save") {
        ponodigit = document.getElementById("tempponumber").value;
    }

    $.ajax({
        type: 'Post',
        url: "api/PO/PermanantSave?type=" + type,
        data:
        {
            PoNodigit: ponodigit,
            PoNo: pono,
            Date: date,

            SupplierCompanyname: suppliercompanyname,
            SupplierCCode: suppliercompanynamecode,
            SupplierGST: suppliergst,
            SupplierContactperson: suppliercontactperson,
            SupplierPhone: supplierphone,
            SupplierEmail: supplieremail,
            SupplierQuotationNo: supplierqtnno,
            SupplierQuotationDate: supplierqtndate,
            SupplierState: supplierstate,
            SupplierStateCode: supplierstatecode,
            SupplierCity: suppliercity,
            SupplierAddress: supplieraddress,

            RecipientCompanyname: recipientcompanyname,
            RecipientCCode: recipientcompanynamecode,
            RecipientGST: recipientgst,
            RecipientContactPerson: recipientcontactperson,
            RecipientMobile: recipientphone,
            RecipientEmail: recipientmail,
            RecipientOrderNo: recipientorderno,
            RecipientOrderDate: recipientorderdate,
            RecipientState: recipientstate,
            RecipientStateCode: recipientstatecode,
            RecipientCity: recipientcity,
            RecipientAddress: recipientaddress,

            ConsignCompanyname: consigncompanyname,
            ConsignCCode: consigncompanynamecode,
            ConsignGST: consigngst,
            ConsignContactPerson: consigncontactperson,
            ConsignMobile: consignphone,
            ConsignEmail: consignemail,
            ConsignOrderNo: consignpono,
            ConsignOrderDate: consignpodate,
            ConsignState: consignstate,
            ConsignStateCode: consignstatecode,
            ConsignCity: consigncity,
            ConsignAddress: consignaddress,

            Cash: cash,
            GST: gst,
            Delivery: delivery,
            MTC: MTC,
            NameofTransport: NameofTransport,
            PriceBasis: PriceBasis,
            PaymentTerms: PaymentTerms,
            FreightCharge: FreightCharge,
            Remarks: note
        },
        success: function (data) {
            if (data.success == true) {
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
                var savebutton = document.getElementById("savePO").innerHTML;
                if (savebutton == "Save") {
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully saved'
                    })
                    document.getElementById("ponumber").value = data.data;
                }
                else {
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully updated'
                    })
                }
                document.getElementById('savePO').innerHTML = "Update";
                document.getElementById("printbtn").style.display = "block";
            }


            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
}

function Remove(button) {
    var row = $(button).closest("TR");
    var itmno = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete: " + itmno)) {
        var quot = document.getElementById("tempponumber").value;
        var PONO = document.getElementById("ponumber").value;
        $.ajax({
            type: 'Delete',
            url: "api/PO/DeleteTempPOIT",
            data:
            {
                TEMPPONO: quot,
                itmno: itmno,
                PONO: PONO,
            },
            success: function (data) {
                if (data.success) {
                    var finalamt = data.data;
                    finalamt = finalamt.toFixed(2);
                    finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    document.getElementById('Totalamount').innerHTML = finalamt;
                    var table = $("#ItemTable")[0];
                    table.deleteRow(row[0].rowIndex);
                    $('#ItemTable').DataTable().ajax.reload();
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

function fillSuppliersdetails() {
    var idd = document.getElementById("suppliercompanyname").value;
    $.ajax({
        'url': '/api/Client/getClient?id=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                if (data.data.gSt == null) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `GST is Missing! Go and Update first in Customer Data`,
                    })
                    document.getElementById('suppliercontactperson').value = "";
                    document.getElementById('supplierphone').value = "";
                    document.getElementById('suppliermail').value = "";
                    document.getElementById('suppliergst').value = "";
                    document.getElementById('supplieraddress').value = "";
                }
                else {
                    document.getElementById('suppliercontactperson').value = data.data.contactPerson;
                    document.getElementById('supplierphone').value = data.data.phone;
                    document.getElementById('suppliermail').value = data.data.email;
                    document.getElementById('supplierstate').value = data.data.state;
                    print_city('suppliercity', data.data.statecode);
                    document.getElementById('suppliercity').value = data.data.city;
                    document.getElementById('suppliergst').value = data.data.gSt;
                    document.getElementById('supplieraddress').value = data.data.address
                }
            }
            else {
                document.getElementById('suppliercompanyname').value = "";
                document.getElementById('supplierphone').value = "";
                document.getElementById('suppliergst').value = "";
            }
        }
    });
}

function fillRecipientdetails() {
    var idd = document.getElementById("recipientcompanyname").value;
    $.ajax({
        'url': '/api/Client/getClient?id=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {


                if (data.data.gSt == null) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please input the required fields! GST is Missing Your Customer Data Go and Update first ',
                    })

                    document.getElementById('recipientcontactperson').value = "";
                    document.getElementById('recipientmobile').value = "";
                    document.getElementById('recipientmail').value = "";
                    document.getElementById('recipientgst').value = "";
                    document.getElementById('recipientaddress').value = "";



                } else {
                    document.getElementById('recipientcontactperson').value = data.data.contactPerson;
                    document.getElementById('recipientmobile').value = data.data.phone;
                    document.getElementById('recipientmail').value = data.data.email;
                    document.getElementById('recipientgst').value = data.data.gSt;
                    document.getElementById('recipientaddress').value = data.data.address
                    document.getElementById('recipientstate').value = data.data.state;
                    print_city('recipientcity', data.data.statecode);
                    document.getElementById('recipientcity').value = data.data.city;
                }


            }
            else {
                document.getElementById('tcs').value = "";
                document.getElementById('recipientmobile').value = "";
                document.getElementById('recipientmail').value = "";
                document.getElementById('recipientgst').value = "";
                document.getElementById('recipientaddress').value = "";
            }
        }
    });
}

function fillConsigndetails() {
    var idd = document.getElementById("consigncompanyname").value;
    $.ajax({
        'url': '/api/Client/getClient?id=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                if (data.data.gSt == null) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please input the required fields! GST is Missing Your Customer Data Go and Update first ',
                    })

                    document.getElementById('Consignmobile').value = "";
                    document.getElementById('Consignmail').value = "";
                    document.getElementById('Consigngst').value = "";
                    document.getElementById('Consignaddress').value = "";
                    document.getElementById('Consigncontactperson').value = "";

                } else {
                    document.getElementById('Consigncontactperson').value = data.data.contactPerson;
                    document.getElementById('Consigngst').value = data.data.gSt;
                    document.getElementById('Consignmobile').value = data.data.phone;
                    document.getElementById('Consignmail').value = data.data.email;
                    document.getElementById('Consigngst').value = data.data.gSt;
                    document.getElementById('Consignaddress').value = data.data.address
                    document.getElementById('consignstate').value = data.data.state;
                    print_city('consigncity', data.data.statecode);
                    document.getElementById('consigncity').value = data.data.city;
                }

            }
            else {
                document.getElementById('tcs').value = "";
                document.getElementById('Consignmobile').value = "";
                document.getElementById('Consignmail').value = "";
                document.getElementById('Consigngst').value = "";
                document.getElementById('Consignaddress').value = "";
            }
        }
    });
}

function samedata() {
    var x = $("#datacheck").is(":checked");
    if (x == true) {

        $("#consigncompanyname option[value=" + document.getElementById('recipientcompanyname').value + "]").remove();
        $('#consigncompanyname').append($("<option selected></option>").val(document.getElementById('recipientcompanyname').value).html(document.getElementById('recipientcompanyname').selectedOptions[0].text));
        document.getElementById('consigncompanyname').value = document.getElementById('recipientcompanyname').value
        document.getElementById('Consigngst').value = document.getElementById('recipientgst').value
        document.getElementById('Consigncontactperson').value = document.getElementById('recipientcontactperson').value
        document.getElementById('Consignaddress').value = document.getElementById('recipientaddress').value
        document.getElementById('Consignmobile').value = document.getElementById('recipientmobile').value
        document.getElementById('Consignmail').value = document.getElementById('recipientmail').value

        document.getElementById('consignstate').value = document.getElementById('recipientstate').value
        var selectin = document.getElementById("consignstate").selectedIndex;
        print_city('consigncity', selectin);
        document.getElementById('consigncity').value = document.getElementById('recipientcity').value


    }
    else {

    }
}


function jumptoPrevious() {
    var ponodigit = document.getElementById("ponodigit").value;
    $.ajax({
        url: '/api/PO/jumptoPrevious?ponodigit=' + ponodigit,
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
                viewPO(data.data);
            }
        }
    });
}
function jumptoNext() {
    var ponodigit = document.getElementById("ponodigit").value;
    $.ajax({
        url: '/api/PO/jumptoNext?ponodigit=' + ponodigit,
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
                viewPO(data.data);
            }


        }
    });
}
