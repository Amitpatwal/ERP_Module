var datatable;
$(document).ready(function () {

    const fileInput = document.getElementById("document_attachment_doc");
    window.addEventListener('paste', e => {
        fileInput.files = e.clipboardData.files;
        previewimage()
    });


    fillcompany1('suppliername', 'Supplier');
    fillcompany1('transportname', 'Transporter');
    fillcompany1('contractor', 'Contractor');
    currentTime();
    $("#resetitemm").click(function () {
        cleardataitem();
    });

    let url = new URLSearchParams(window.location.search);
    let pro = url.get('PrNO');
    let pron = url.get('PRnO');
    let prnumber = url.get('PRNO');
    let ponumber = url.get('PONO');
    if (prnumber == null) {
        prnumber = pro;
    }
    if (prnumber == null) {
        prnumber = pron;
    }

    if (prnumber != null) {
        viewPR(prnumber);
    }
    else if (ponumber != null) {
        convertToPR(ponumber);
        prNumber()
        currentTime()
        document.getElementById("permanantbt").style.display = "block";
    }
    else {
        checking();
        document.getElementById("permanantbt").style.display = "block";
        document.getElementById("clearbt").style.display = "block";

        prNumber()
    }
    $("#reset").click(function () {
        clearall();
    });
    $("#printbutton").click(function () {
        var idd = document.getElementById('prnumber').value;
            window.open('../PurchaseItemsPrint?idd=' + idd, '_blank');
       
    });
    SearchFunction()
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


function convertToPR(ponumber) {

   
    $.ajax({
        url: '/api/PR/ConvertToPO?pono=' + ponumber,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                viewTempPR(data.data);
            }
        }
    });
}


function viewTempPR(prnodigit) {
    $.ajax({
        url: '/api/PR/ViewTempPR?prnodigit=' + prnodigit,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                $("#suppliername option[value=" + data.data.supplierCCode + "]").remove();
                $('#suppliername').append($("<option selected></option>").val(data.data.supplierCCode).html(data.data.supplierCompanyname));
             
                document.getElementById('ponumber').value = data.data.poNo;
                document.getElementById('podate').value = data.data.poDate;
                document.getElementById('tempprnumber').value = prnodigit;
                document.getElementById("tempsave").innerHTML = "Update";
                
    
            }
            refreshtable(prnodigit)
        }
    })
}



function clearall() {
    var prnodigit = document.getElementById("tempprnumber").value;
    deletetemp(prnodigit);
    window.location.href = "../PurchaseItems";
}

function SearchFunction() {
    $('#searchList').on('dblclick', 'tr', function () {
        $(this).toggleClass('activee');
        var row = $(this).closest("TR");
        var dono = $("TD", row).eq(2).html();
        viewPR(dono)
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
    var invoice = document.getElementById("invoice").checked;
    var heatno = document.getElementById("heatnoCheck").checked;
    var vechilecheck = document.getElementById("vechilecheck").checked;
    var periodCheck = document.getElementById("periodcheck").checked;


    if (partynamecheck == true) {
        var searchtype = "PARTY";
    }
    else if (PONO == true) {
        var searchtype = "PONO";
    }
    else if (invoice == true) {
        var searchtype = "INVOICE";
    }
    else if (heatno == true) {
        var searchtype = "HEAT";
    }
    else if (vechilecheck == true) {
        var searchtype = "VECHILE";
    }
    else {
        var searchtype = "PERIOD";
    }

    var frmdate = document.getElementById("fromdate").value;
    var todate = document.getElementById("todate").value;
    var searchValue = document.getElementById("SearchRecordInput").value;

    datatable = $("#searchList").DataTable({
        ajax: {
            'url': "api/PR/SearchPurchase",
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
                    'data': 'prDate', 'render': function (data) {
                        var date = data;
                        var now = date.toString().replace('T', ' ');
                        var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                        return `<span>${dateStringWithTime}</span>`;
                    }, 'width': '5%', 'font-size': '6px'
                },
                { 'data': 'prNo', 'defaultContent': '', 'width': '10%' },
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

function cleardataitem() {
    $('#txtName').empty();
    $('#txtSize').empty();
    $('#txtClass').empty();
    $('#txtMake').empty();
    document.getElementById("altqtyy").style.display = "none";
    document.getElementById("itemweight").style.display = "none";
    document.getElementById("weightunit").value = "";
    document.getElementById("altquantityunit").value = "";
    document.getElementById('saveebutton1').innerHTML = "Save";
    document.getElementById('quantity').value = "";
    document.getElementById('quantity').value = ""; 
    document.getElementById("namecolor").style.color = "black";
    document.getElementById("txtName").style.borderColor = "black";
    document.getElementById("wharehouselabel").style.color = "black";
    document.getElementById("txtWarehouse").style.borderColor = "black";
    document.getElementById("quantityunit").value = "";
    document.getElementById("heatno").value = "";
    document.getElementById("totalAmount").value = "";


    
    loadItems();
}

function deletetemp(quot) {
    $.ajax({
        type: 'Delete',
        url: "api/PR/DeleteTempPR?prnodigit=" + quot,
        success: function (data) {
            if (data.success) {
                document.getElementById('tempprnumber').value = "";
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
}

function goback() {

    var usertype = document.getElementById("").value;
    if (usertype == "Admin") {

    }

}

function calcCrane() {
    var wt = document.getElementById("craneweightmt").value;
    var price = document.getElementById("cranecharge").value;
    var amount = wt * price;
    var amount = Number(amount).toFixed(2)
    document.getElementById("craneuloadingtotal").value = amount;

}

function calcManual() {
    var wt = document.getElementById("manualweightmt").value;
    var price = document.getElementById("manualunloadingcharge").value;
    var amount = wt * price;
    var amount = Number(amount).toFixed(2)
    document.getElementById("manulunloadingamount").value = amount;

}

function calcCraneAmount() {
    var wt = document.getElementById("craneweightmt").value;
    var price = document.getElementById("craneuloadingtotal").value;
    var amount = price / wt;
    var amount = Number(amount).toFixed(2)
    document.getElementById("cranecharge").value = amount;
}

function calcManualAmount() {
    var wt = document.getElementById("manualweightmt").value;
    var price = document.getElementById("manulunloadingamount").value;
    var amount = price / wt;
    var amount = Number(amount).toFixed(2)
    document.getElementById("manualunloadingcharge").value = amount;
}

function checking() {
    $.ajax({
        url: '/api/PR/checking',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('tempprnumber').value = data.data.prNodigit;

                $("#suppliername option[value=" + data.data.supplierCCode + "]").remove();
                $('#suppliername').append($("<option selected></option>").val(data.data.supplierCCode).html(data.data.supplierCompanyname));
                document.getElementById("ponumber").value = data.data.poNo;
                var date = data.data.poDate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                document.getElementById("podate").value = dateStringWithTime;
                document.getElementById("invoiceno").value = data.data.piNo;
                var date = data.data.piDate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                document.getElementById("invoicedate").value = dateStringWithTime;

                $("#transportname option[value=" + data.data.transportCCode + "]").remove();
                $('#transportname').append($("<option selected></option>").val(data.data.transportCCode).html(data.data.transportName));
                /*document.getElementById("transportname").value = data.data.;*/
                document.getElementById("drivername").value = data.data.driverName;
                document.getElementById("driverlicenses").value = data.data.license;
                document.getElementById("drivermobile").value = data.data.mobileno;
                document.getElementById("vechileno").value = data.data.vechileNo;
                document.getElementById("unloadingincharge").value = data.data.unloadingIncharge;
                document.getElementById("grno").value = data.data.grNO;
                document.getElementById("futa").value = data.data.forwardingTransportAmount;
                $("#contractor option[value=" + data.data.contratorid + "]").remove();
                $('#contractor').append($("<option selected></option>").val(data.data.contratorid).html(data.data.contractor));
                document.getElementById("freighttype").value = data.data.freightType;
                document.getElementById("freightcharge").value = data.data.freightCharge;
                document.getElementById("note").value = data.data.note;
                document.getElementById("craneweightkg").value = data.data.craneLoadingWeightkg;
                document.getElementById("craneweightmt").value = data.data.craneLoadingWeightmt;
                document.getElementById("manualweightkg").value = data.data.manualLoadingWeightkg;
                document.getElementById("manualweightmt").value = data.data.manualLoadingWeightmt;

                document.getElementById("cranecharge").value = data.data.craneCharge;
                document.getElementById("craneuloadingtotal").value = data.data.craneCharge;

                document.getElementById("manualunloadingcharge").value = data.data.manualCharge;
                document.getElementById("manulunloadingamount").value = data.data.manualTotalCharge;

                document.getElementById("tempsave").innerHTML = "Update";
                var prnodigit = document.getElementById("tempprnumber").value;
                refreshtable(prnodigit)
            }

        }
    })
}

function viewPR(PRNO) {
    $.ajax({
        url: '/api/PR/viewPurchaseReciept?PRNO=' + PRNO,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("tempsave").innerHTML = "Update";
                document.getElementById("savePR").innerHTML = "Update";
                let url = new URLSearchParams(window.location.search);
                let pro = url.get('PrNO');
                let pron = url.get('PRnO');
                if (data.data.reason == "incomplete" || data.data.reason == "rejected") {
                    if (pron == null) {
                        document.getElementById("permanantbt").style.display = "block";
                        document.getElementById("addbtn").style.display = "block";
                        refreshtable(PRNO);
                    }
                    else {
                        document.getElementById("permanantbt").style.display = "none";
                        document.getElementById("addbtn").style.display = "none";
                        document.getElementById("actionbt").style.display = "none";
                        $("#viewDiv :input").prop("disabled", true);
                        refreshtable1(PRNO);
                    }
                }
                else if (data.data.reason == "approved") {

                    document.getElementById("permanantbt").style.display = "none";
                    document.getElementById("addbtn").style.display = "none";
                    /*document.getElementById("actionbt").style.display = "block";*/
                    document.getElementById("clearbt").style.display = "none";
                    $("#viewDiv :input").prop("disabled", true);
                    document.getElementById("printbt").style.display = "block";
                    document.getElementById("createdby").innerHTML = "Created By :  " + data.data.userid;
                    $("#viewModel :input").prop("disabled", true);
                    var admin = data.username;

                    
                    $.ajax({
                        url: '/api/UserManagement/permissioncheck',
                        type: 'GET',
                        contentType: 'application/json',
                        data: {
                            formName: "PURCHASE_ITEM",
                            operation: "CHECKER",
                        },
                        success: function (data) {
                            if (data.data.permission == true) {

                                var prdate = document.getElementById("prdate").value;
                                var now1 = prdate.toString().replace('T', ' ');
                                var prdateWithoutTime = moment(now1).format('YYYYMMDD');

                                var now = new Date();
                                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                                var CurrentDate  = moment(now).format('YYYYMMDD');
                                var datefilter = (CurrentDate - prdateWithoutTime);

                                if (datefilter < 7)
                                {
                                    document.getElementById("rejected").style.display = "block";
                                }
                                else {

                                    if (admin == "AMIT PATWAL") {
                                        document.getElementById("rejected").style.display = "block";
                                    }
                                    else {
                                        document.getElementById("rejected").style.display = "none";
                                    }
                                }
                                
                            } else {

                                document.getElementById("rejected").style.display = "none";
                            }
                        }
                    });
                    refreshtable1(PRNO);
                }
                else if (data.data.reason == "submitted") {
                    if (pro == null) {
                        document.getElementById("permanantbt").style.display = "none";
                        
                        document.getElementById("addbtn").style.display = "none";
                      /*  document.getElementById("actionbt").style.display = "none";*/
                        document.getElementById("clearbt").style.display = "none";
                        document.getElementById("printbt").style.display = "none";
                        $("#viewDiv :input").prop("disabled", true);

                    } else {




                        document.getElementById("approved").style.display = "block";
                        document.getElementById("rejected").style.display = "block";
                       /* document.getElementById("addbtn").style.display = "none";*/
                        document.getElementById("actionbt").style.display = "none";
                        document.getElementById("permanantbt").style.display = "none";
                        document.getElementById("clearbt").style.display = "none";
                        document.getElementById("printbt").style.display = "none";
                        $("#viewDiv :input").prop("disabled", true);
                       

                        

                }
                    refreshtable1(PRNO);
                }
                else {
                    refreshtable(PRNO);
                }

                document.getElementById('prnodigit').value = data.data.prNodigit;
                document.getElementById('prnumber').value = data.data.prNo;
                document.getElementById('prdate').value = data.data.prDate;

                $("#suppliername option[value=" + data.data.supplierCCode + "]").remove();
                $('#suppliername').append($("<option selected></option>").val(data.data.supplierCCode).html(data.data.supplierCompanyname));
                document.getElementById("ponumber").value = data.data.poNo;
                var date = data.data.poDate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                document.getElementById("podate").value = dateStringWithTime;
                document.getElementById("invoiceno").value = data.data.piNo;
                var date = data.data.piDate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                document.getElementById("invoicedate").value = dateStringWithTime;

                $("#transportname option[value=" + data.data.transportCCode + "]").remove();
                $('#transportname').append($("<option selected></option>").val(data.data.transportCCode).html(data.data.transportName));
                /*document.getElementById("transportname").value = data.data.;*/
                document.getElementById("drivername").value = data.data.driverName;
                document.getElementById("driverlicenses").value = data.data.license;
                document.getElementById("drivermobile").value = data.data.mobileno;
                document.getElementById("vechileno").value = data.data.vechileNo;
                document.getElementById("unloadingincharge").value = data.data.unloadingIncharge;
                $("#contractor option[value=" + data.data.contratorid + "]").remove();
                $('#contractor').append($("<option selected></option>").val(data.data.contratorid).html(data.data.contractor));
                document.getElementById("freighttype").value = data.data.freightType;
                document.getElementById("freightcharge").value = data.data.freightCharge;
                document.getElementById("note").value = data.data.note;
                document.getElementById("craneweightkg").value = data.data.craneLoadingWeightkg;
                document.getElementById("craneweightmt").value = data.data.craneLoadingWeightmt;
                document.getElementById("manualweightkg").value = data.data.manualLoadingWeightkg;
                document.getElementById("manualweightmt").value = data.data.manualLoadingWeightmt;

                document.getElementById("cranecharge").value = data.data.craneCharge;
                document.getElementById("craneuloadingtotal").value = data.data.craneTotalCharge;

                document.getElementById("manualunloadingcharge").value = data.data.manualCharge;
                document.getElementById("manulunloadingamount").value = data.data.manualTotalCharge;
                document.getElementById("grno").value = data.data.grNO;
                document.getElementById("futa").value = data.data.forwardingTransportAmount;

                counter();
           
            }

        }
    })


}

function prNumber() {
    $.ajax({
        type: 'GET',
        url: "api/PR/PRNO",
        success: function (data) {
            if (data.success) {
                $('#prnumber').text(data.data);
                document.getElementById("prnumber").value = data.data;
                document.getElementById("prnodigit").value = data.data;
                $('#tempprnumber').text(data.data1);
            }
        }
    });
}

function fillitemdata(itemno) {
    var savebutton = document.getElementById("savePR").innerHTML;
    var prno = document.getElementById("prnumber").value;
    var tempprno = document.getElementById("tempprnumber").value;
    if (savebutton == "Save") {
        var type = "temp";
    }
    else {
        var type = "permanant";

    }
    $.ajax({
        'url': '/api/PR/getitembyid',
        'type': 'GET',
        'contentType': 'application/json',
        data:
        {
            tempPrno: tempprno,
            itemid: itemno,
            type: type,
            PRNO: prno,
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
                                    $("#txtName").select2()
                                }
                            }
                        }

                    });
                    $("#txtSize").select2();
                }
                $("#txtMake option[value=" + data.data.pmakeid + "]").remove();
                $('#txtMake').append($("<option selected></option>").val(data.data.pmakeid).html(data.data.pmake));

                $("#txtWarehouse option[value=" + data.data.wharehouseid + "]").remove();
                $('#txtWarehouse').append($("<option selected></option>").val(data.data.wharehouseid).html(data.data.wharehouse));
                $("#txtUnit option[value=" + data.data.unitid + "]").remove();
                $('#txtUnit').append($("<option selected></option>").val(data.data.unitid).html(data.data.qtyunit));
                document.getElementById('quantity').value = data.data.qty;
                document.getElementById('quantityunit').value = data.data.qtyunit;
                if (data.data.altQtyunit == null) {
                    document.getElementById("altqtyy").style.display = "none";
                }
                else {
                    document.getElementById("altqtyy").style.display = "block";
                }
                if (data.data.itemWeightUnit == null) {
                    document.getElementById("itemweight").style.display = "none";

                }
                else {
                    document.getElementById("itemweight").style.display = "block";

                }
                document.getElementById('altquantity').value = data.data.altQty;
                document.getElementById('altquantityunit').value = data.data.altQtyunit;
                document.getElementById('weight').value = data.data.itemWeight;
                document.getElementById('weightunit').value = data.data.itemWeightUnit;
                document.getElementById('unloadedby').value = data.data.unloadedby;

                document.getElementById('pricePRIN').value = data.data.prAmount;
                document.getElementById('pricePR').value = data.data.qtyunit;

                document.getElementById('priceSecIN').value = data.data.scAmount;
                document.getElementById('priceThIN').value = data.data.weightAmount;

                if (data.data.altQtyunit != null) {
                    document.getElementById("scPriceDiv").style.display = "block"
                    document.getElementById("priceSec").value = data.data.altQtyunit
                }
                else {
                    document.getElementById("scPriceDiv").style.display = "none"
                }
                if (data.data.itemWeightUnit != null) {
                    document.getElementById("weightPriceDIv").style.display = "block"
                    document.getElementById("priceTh").value = data.data.itemWeightUnit;

                }
                else {
                    document.getElementById("weightPriceDIv").style.display = "none"
                }


                document.getElementById('totalAmount').value = data.data.amount;

                document.getElementById('heatno').value = data.data.hsncode;

                document.getElementById('saveebutton1').innerHTML = "Update";

                checkalternateunit()
            }
        }
    });
}

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('prdate').value = now.toISOString().slice(0, 16);
    document.getElementById('podate').value = dateStringWithTime;
    document.getElementById('invoicedate').value = dateStringWithTime;

}


function addprdetails() {

    var prno = document.getElementById("prnumber").value;
    var prdate = document.getElementById("prdate").value;
    var ponumber = document.getElementById("ponumber").value;
    var podate = document.getElementById("podate").value;
    var invoiceno = document.getElementById("invoiceno").value;
    var invoicedate = document.getElementById("invoicedate").value;
    var suppliercompanynamecode = document.getElementById("suppliername").value;
    if (suppliercompanynamecode != "") {
        var suppliercompanyname = document.getElementById("suppliername").selectedOptions[0].text;
    } else {
        var suppliercompanyname = "";
    }


    var contractorid = document.getElementById("contractor").value;
    if (contractorid != "") {
        var contractor = document.getElementById("contractor").selectedOptions[0].text;
    } else {
        var contractor = "";
    }

    var transporterid = document.getElementById("transportname").value;
    if (transporterid != "") {
        var transporter = document.getElementById("transportname").selectedOptions[0].text;
    } else {
        var transporter = "";
    }

    var driverName = document.getElementById("drivername").value;
    var driverLicenses = document.getElementById("driverlicenses").value;
    var vechileNo = document.getElementById("vechileno").value;
    var mobileNo = document.getElementById("drivermobile").value;
    var freightType = document.getElementById("freighttype").value;
    var freigtCharge = document.getElementById("freightcharge").value;
    var UnloadingIncharge = document.getElementById("unloadingincharge").value;
    var note = document.getElementById("note").value;
    var savebutton = document.getElementById("savePR").innerHTML;
    var type = document.getElementById("tempsave").innerHTML;
    var fruptotransamount = document.getElementById("futa").value;
    var grno = document.getElementById("grno").value;
    if (savebutton == "Save") {
        var url = "api/PR/Addtempcompanydetails?type=" + type;
        var prnodigit = document.getElementById("tempprnumber").value;
    }
    else {
        var url = "api/PR/Updatecompanydetails";
        var prnodigit = document.getElementById("prnodigit").value;
    }

    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            PrNodigit: prnodigit,
            PrNo: prno,
            PrDate: prdate,
            PoNo: ponumber,
            PoDate: podate,
            PINo: invoiceno,
            PIDate: invoicedate,
            SupplierCompanyname: suppliercompanyname,
            SupplierCCode: suppliercompanynamecode,
            Contractor: contractor,
            Contratorid: contractorid,
            TransportName: transporter,
            TransportCCode: transporterid,
            UnloadingIncharge: UnloadingIncharge,

            DriverName: driverName,
            License: driverLicenses,
            VechileNO: vechileNo,
            Mobileno: mobileNo,

            FreightType: freightType,
            FrerightCharge: freigtCharge,
            Note: note,
            GrNO: grno,
            ForwardingTransportAmount: fruptotransamount,



        },
        success: function (data) {
            if (data.success == true) {
                var tempsave = document.getElementById('tempsave').innerHTML;
                if (tempsave == "Save") {
                    document.getElementById('tempprnumber').value = data.data;
                }
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
    if (txtName == "--Select--") txtName = "";
    var txtWarehouse = document.getElementById("txtWarehouse").value;
    if (txtWarehouse != "") { var txtWarehouse = document.getElementById("txtWarehouse").selectedOptions[0].text; }
    if (txtWarehouse == "Select") {
        txtWarehouse = "";
    }
    if (txtName != "" && txtWarehouse != "") {
        var txtSize = document.getElementById("txtSize").value;
        if (txtSize != "") {
            var txtSize = document.getElementById("txtSize").selectedOptions[0].text;
            if (txtSize == "--Select--") { txtSize = ""; }
        }
        document.getElementById("namecolor").style.color = "black";
        document.getElementById("txtName").style.borderColor = "black";
        document.getElementById("wharehouselabel").style.color = "black";
        document.getElementById("txtWarehouse").style.borderColor = "black";
        var txtClass = document.getElementById("txtClass").value;
        if (txtClass != "") {
            var txtClass = document.getElementById("txtClass").selectedOptions[0].text;
            if (txtClass == "--Select--") { txtClass = ""; }
        }


        var txtmake = document.getElementById("txtMake").value;
        if (txtmake != "") {
            var txtmake = document.getElementById("txtMake").selectedOptions[0].text;
            if (txtmake == "Select" || txtmake == "--Select--") { txtmake = ""; }
        }


        var quantity = document.getElementById("quantity").value;
        var quantityunit = document.getElementById("quantityunit").value;
        var altquantity = document.getElementById("altquantity").value;
        var altquantityunit = document.getElementById("altquantityunit").value;

        var weight = document.getElementById("weight").value;
        var heatno = document.getElementById("heatno").value;

        var prPrice = document.getElementById("pricePRIN").value;
        var scPrice = document.getElementById("priceSecIN").value;
        var weightPrice = document.getElementById("priceThIN").value;

        var Totalamount = document.getElementById("totalAmount").value;

        var weightunit = document.getElementById("weightunit").value;


        var unloadedby = document.getElementById("unloadedby").value;
        if (unloadedby != "") { var unloadedby = document.getElementById("unloadedby").selectedOptions[0].text; }

        var PrNo = document.getElementById('prnumber').value;
        var savebutton = document.getElementById("saveebutton1").innerHTML;
        var savePR = document.getElementById("savePR").innerHTML;

        if (price != "") {

            if (savePR == "Save") {
                var PrNodigit = document.getElementById("tempprnumber").value;
            }
            else {
                var PrNodigit = document.getElementById("prnodigit").value;
            }
            if (savebutton == "Save") {
                var itemno = 0;
                if (savePR == "Save") {
                    var url = "api/PR/AddNewTempItem";
                }
                else {
                    var url = "api/PR/AddNewItem";
                }
            }
            else if (savebutton == "Insert") {
                var itemno = document.getElementById("itemid").value;
                if (savePR == "Save") {
                    var url = "api/PR/InsertTempItem";
                }
                else {
                    var url = "api/PR/InsertItem";
                }
            }
            else {
                var itemno = document.getElementById("itemid").value;
                if (savePR == "Save") {
                    var url = "api/PR/UpdateTempItem";
                }
                else {
                    var url = "api/PR/UpdateItem";
                }
            }
            $.ajax({
                type: 'Post',
                url: url,
                data:
                {
                    PrNodigit: PrNodigit,
                    PrNo: PrNo,
                    itemid: itemno,
                    pname: txtName,
                    psize: txtSize,
                    pclass: txtClass,
                    pmake: txtmake,
                    wharehouse: txtWarehouse,
                    qty: quantity,
                    qtyunit: quantityunit,
                    altQty: altquantity,
                    altQtyunit: altquantityunit,
                    itemWeight: weight,
                    itemWeightUnit: weightunit,
                    unloadedBy: unloadedby,
                    heatNo: heatno,
                    PrAmount: prPrice,
                    ScAmount: scPrice,
                    WeightAmount: weightPrice,
                    TotalAmount: Totalamount,
                },
                success: function (data) {
                    if (data.success) {
                        document.getElementById("craneweightkg").value = data.data.craneLoadingWeightkg;
                        document.getElementById("craneweightmt").value = data.data.craneLoadingWeightmt;
                        document.getElementById("manualweightkg").value = data.data.manualLoadingWeightkg;
                        document.getElementById("manualweightmt").value = data.data.manualLoadingWeightmt;
                        calcCrane();
                        calcManual();
                        var tempbutton = document.getElementById('tempsave').innerHTML;
                        if (tempbutton == "Save") {
                            refreshtable(PrNodigit);
                            document.getElementById('tempsave').innerHTML = "Update";
                        }
                        else {
                            $('#ItemTable').DataTable().ajax.reload();
                        }

                        clearData();
                    }
                    else {
                        Swal.fire(data.message, '', 'info')
                    }
                }
            });
            cleardataitem();
        }

        else {
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
                title: 'Price Cannot be empty!'
            })

        }
       



    
    }
    else {
        if (txtWarehouse == "") {
            document.getElementById("wharehouselabel").style.color = "red";
            document.getElementById("txtWarehouse").style.borderColor = "red";
        }
        else {
            document.getElementById("wharehouselabel").style.color = "black";
            document.getElementById("txtWarehouse").style.borderColor = "black";
        }
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
        if (txtName == "") {
            document.getElementById("namecolor").style.color = "red";
            document.getElementById("txtName").style.borderColor = "red";
        }
        else {
            document.getElementById("namecolor").style.color = "black";
            document.getElementById("txtName").style.borderColor = "black";
        }
    }

}

function refreshtable(prnodigit) {
    var savebutton = document.getElementById("savePR").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/PR/getitem?PrNodigit=' + prnodigit;
    }
    else {
        var url = '/api/PR/getitemByPRNO?PRNO=' + prnodigit;
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
                        if (row.pclass != null)
                        {
                            
                            if (row.itemWeightUnit == null) {
                                var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.pname} &nbsp;"${row.psize}" &nbsp"${row.pclass}" </span>`
                            }
                            else
                            {
                                var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.pname} &nbsp;"${row.psize}" &nbsp"${row.pclass}" </span><br />
                                             <span style="font-family: 'sans-serif'; font-weight: normal;">${row.qty} ${row.qtyunit} = ${row.altQty} ${row.altQtyunit} </span>`
                            }
                        }
                        else
                        {
                            var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.pname} &nbsp;"${row.psize}"</span>`
                        }
                        return html1;
                    }, 'width': '30%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },
                { 'data': 'pmake', 'defaultContent': '', 'width': '112px' },
                { 'data': 'wharehouse', 'defaultContent': '', 'width': '112px' },

                
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        var html1 = `<span>${row.qty} ${row.qtyunit}</span>`

                        return html1;
                    }, 'width': '112px', 'font-size': '10px', 'font-size': '90%', 'className': "text-right", 'font-family': 'Tahoma',
                },
              
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        if (row.altQtyunit != null) {
                            var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.itemWeight} ${row.itemWeightUnit}</span>`
                        }
                        else {
                            var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.itemWeight} </span>`
                        }

                        return html1;
                    }, 'width': '112px', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right",
                },
                { 'data': 'heatNo', 'defaultContent': '', 'width': '112px' },
                { 'data': 'unloadedBy', 'defaultContent': '', 'width': '112px' },

                {
                    'data': 'totalAmount', 'render': function (data, type, row) {
                        return `<span>₹ ${row.totalAmount}</span>`

                    }, 'width': '112px'

                },


                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        return `<a class="fa fa-pencil" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=dataitem('${data}')></a>
                                <a class="fa fa-trash" style="color:red" onclick=Remove(this)> </a>
                                <a class="fa fa-plus-circle" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=insertRow1(this)> </a>`;
                    }, 'width': '100px'
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
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,

    });
}

function refreshtable1(prnodigit) {
    var savebutton = document.getElementById("savePR").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/PR/getitem?PrNodigit=' + prnodigit;
    }
    else {
        var url = '/api/PR/getitemByPRNO?PRNO=' + prnodigit;
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
                        if (row.pclass != null) {
                            if (row.itemWeightUnit == null) {
                                var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.pname} &nbsp;"${row.psize}" &nbsp"${row.pclass}" </span>`
                            }
                            else {
                                var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.pname} &nbsp;"${row.psize}" &nbsp"${row.pclass}" </span><br />
                                             <span style="font-family: 'sans-serif'; font-weight: normal;">${row.qty} ${row.qtyunit} = ${row.altQty} ${row.altQtyunit} </span>`
                            }
                        }
                        else {
                            var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.pname} &nbsp;"${row.psize}"</span>`
                        }
                        return html1;
                    }, 'width': '30%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },
                { 'data': 'pmake', 'defaultContent': '', 'width': '112px' },
                { 'data': 'wharehouse', 'defaultContent': '', 'width': '112px' },
               
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        var html1 = `<span>${row.qty} ${row.qtyunit}</span>`
                        return html1;
                    }, 'width': '112px', 'font-size': '10px', 'font-size': '90%', 'className': "text-right", 'font-family': 'Tahoma',
                },
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        if (row.altQtyunit != null) {
                            var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.itemWeight} ${row.itemWeightUnit}</span>`
                        }
                        else {
                            var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.itemWeight} </span>`
                        }

                        return html1;
                    }, 'width': '112px', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma', 'className': "text-right",
                },
                { 'data': 'heatNo', 'defaultContent': '', 'width': '112px' },
                { 'data': 'unloadedBy', 'defaultContent': '', 'width': '112px' },
                {
                    'data': 'totalAmount', 'render': function (data, type, row) {
                        return `<span>₹ ${row.totalAmount}</span>`

                    }, 'width': '112px'

                },
              
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                       
                            return `<a class="fa fa-eye" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=dataitem('${data}')></a>`;
                      
                        
                       
                    }, 'width': '100px'
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
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,

    });
}

function insertRow1(button) {
    var row = $(button).closest("TR");
    var itmno = $("TD", row).eq(0).html();
    document.getElementById('itemid').value = itmno;
    loadItems()
    intt1();
}

function intt1() {
    document.getElementById('saveebutton1').innerHTML = "Insert";
    document.getElementById('txtName').focus();
}

function filltransportdetails() {

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
    var suppliercompanynamecode = document.getElementById("suppliername").value;
    if (suppliercompanynamecode != "") {
        var suppliercompanyname = document.getElementById("suppliername").selectedOptions[0].text;
    } else {
        var suppliercompanyname = "";
    }
    var invoiceno = document.getElementById("invoiceno").value;
    if (suppliercompanyname != "--Select Company Name--" && invoiceno != "") {

        document.getElementById("invoicelabel").style.color = "black";
        document.getElementById("invoiceno").style.borderColor = "black";
        document.getElementById("supplierlabel").style.color = "black";
        document.getElementById("suppliername").style.borderColor = "black";


        var prno = document.getElementById("prnumber").value;
        var tempprno = document.getElementById("tempprnumber").value;
        var prdate = document.getElementById("prdate").value;
        var ponumber = document.getElementById("ponumber").value;
        var podate = document.getElementById("podate").value;

        var invoicedate = document.getElementById("invoicedate").value;



        var contractorid = document.getElementById("contractor").value;
        if (contractorid != "") {
            var contractor = document.getElementById("contractor").selectedOptions[0].text;
        } else {
            var contractor = "";
        }

        var transporterid = document.getElementById("transportname").value;
        if (transporterid != "") {
            var transporter = document.getElementById("transportname").selectedOptions[0].text;
        } else {
            var transporter = "";
        }

        var driverName = document.getElementById("drivername").value;
        var driverLicenses = document.getElementById("driverlicenses").value;
        var vechileNo = document.getElementById("vechileno").value;
        var mobileNo = document.getElementById("drivermobile").value;
        var freightType = document.getElementById("freighttype").value;
        var freigtCharge = document.getElementById("freightcharge").value;
        var UnloadingIncharge = document.getElementById("unloadingincharge").value;
        var note = document.getElementById("note").value;
        var savebutton = document.getElementById("savePR").innerHTML;

        var craneweightkg= document.getElementById("craneweightkg").value;
        var craneweightmt= document.getElementById("craneweightmt").value;
        var manualLoadingWeightkg=  document.getElementById("manualweightkg").value;
        var manualweightmt=  document.getElementById("manualweightmt").value;

        var cranecharge=  document.getElementById("cranecharge").value;
        var craneuloadingtotal= document.getElementById("craneuloadingtotal").value;

        var manualunloadingcharge= document.getElementById("manualunloadingcharge").value;
        var manulunloadingamount=  document.getElementById("manulunloadingamount").value;
        var fruptotransamount = document.getElementById("futa").value;
        var grno = document.getElementById("grno").value;
        



        if (savebutton == "Save") {
            url = "api/PR/PermanantSave?tempprno=" + tempprno;
        }
        else {
            url = "api/PR/PermanantUpdate";
        }

        $.ajax({
            type: 'Post',
            url: url,
            data:
            {
                PrNo: prno,
                PrDate: prdate,
                PoNo: ponumber,
                PoDate: podate,
                PINo: invoiceno,
                PIDate: invoicedate,
                SupplierCompanyname: suppliercompanyname,
                SupplierCCode: suppliercompanynamecode,
                Contractor: contractor,
                Contratorid: contractorid,
                TransportName: transporter,
                TransportCCode: transporterid,
                UnloadingIncharge: UnloadingIncharge,

                DriverName: driverName,
                License: driverLicenses,
                VechileNO: vechileNo,
                Mobileno: mobileNo,

                FreightType: freightType,
                FreightCharge: freigtCharge,
                Note: note,
                CraneLoadingWeightkg: craneweightkg,
                CraneLoadingWeightmt: craneweightmt,
                CraneCharge: cranecharge,
                CraneTotalCharge: craneuloadingtotal,

                ManualLoadingWeightkg: manualLoadingWeightkg,
                ManualLoadingWeightmt: manualweightmt,
                ManualCharge: manualunloadingcharge,
                ManualTotalCharge: manulunloadingamount,
                GrNO: grno,
                ForwardingTransportAmount: fruptotransamount,


            },
            success: function (data) {
                if (data.success == true) {

                    var savebutton = document.getElementById("savePR").innerHTML;
                    document.getElementById("prnumber").value = data.data;

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

                            finalSubmit();
                        }
                    })

                   
                    document.getElementById('savePR').innerHTML = "Update";
                    document.getElementById('printpreview').style.display = "block";


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
    else {
        if (invoiceno == "") {
            document.getElementById("invoicelabel").style.color = "red";
            document.getElementById("invoiceno").style.borderColor = "red";
        }
       

        
        else {
            document.getElementById("invoicelabel").style.color = "black";
            document.getElementById("invoiceno").style.borderColor = "black";
        }
        if (suppliercompanyname == "--Select Company Name--") {
            document.getElementById("supplierlabel").style.color = "red";
            document.getElementById("suppliername").style.borderColor = "red";
        }
        else {
            document.getElementById("supplierlabel").style.color = "black";
            document.getElementById("suppliername").style.borderColor = "black";
        }
        Toast.fire({
            icon: 'error',
            title: 'Complete the required fields'
        })
    }
}

function finalSubmit() {
    var prno = document.getElementById("prnumber").value;
    var url = "api/PR/finalsubmit";
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            prno: prno
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
                document.getElementById('permanantbt').style.display = "none";
                
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

function approved() {
    var prno = document.getElementById("prnumber").value;
    var url = "api/PR/approved";
    var date1 = new Date();
    var now1 = date1.toString().replace('', ' ');
    var currentdate = moment(now1).format('YYYY-MM-DD hh:mm');
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            prno: prno,
            Date: currentdate,

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
                document.getElementById('approved').style.display = "none";
                document.getElementById('rejected').style.display = "none";
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

function rejected() {
    var prno = document.getElementById("prnumber").value;
    var reason = document.getElementById("reasonText").value;
    if (reason != null && reason != "") {
        document.getElementById("reasonlabel").style.color = "black";
        document.getElementById("reasonText").style.borderColor = "black";
        var date1 = new Date();
        var now1 = date1.toString().replace('', ' ');
        var currentdate = moment(now1).format('YYYY-MM-DD hh:mm');

        var url = "api/PR/rejected";
        $.ajax({
            type: 'Post',
            url: url,
            data:
            {
                Remarks: reason,
                Prno: prno,
                Date: currentdate,
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
                    document.getElementById('approved').style.display = "none";
                    document.getElementById('rejected').style.display = "none";
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

    else {
        document.getElementById("reasonlabel").style.color = "red";
        document.getElementById("reasonText").style.borderColor = "red";
    }
}

function Remove(button) {
    var row = $(button).closest("TR");
    var itmno = $("TD", row).eq(0).html();
    var savebutton = document.getElementById("savePR").innerHTML;
    if (savebutton == "Save") {
        var url = "api/PR/DeleteTempPRIT";
    }
    else {
        var url = "api/PR/DeletePRIT";
    }
    if (confirm("Do you want to delete: " + itmno)) {
        var temppr = document.getElementById("tempprnumber").value;
        var PRNO = document.getElementById("prnumber").value;
        $.ajax({
            type: 'Delete',
            url: url,
            data:
            {
                TEMPPRNO: temppr,
                itmno: itmno,
                PRNO: PRNO,
            },
            success: function (data) {
                if (data.success) {

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

function goback() {
    let redirctfrom = getCookie("redirctfrom");
    if (redirctfrom == "createrPRView") {
        window.location.href = "ViewPR";
    }
    else if (redirctfrom = "checkerPRView") {
        window.location.href = "PurchaseItemCheck";
    }

}



function printPreview() {
    var idd = document.getElementById('prnumber').value;
    window.open('../PRPrintPreview?idd=' + idd, '_blank');
}
function jumptoPrevious() {
    var prnodigit = document.getElementById("prnodigit").value;
    $.ajax({
        url: '/api/PR/jumptoPrevious?prnodigit=' + prnodigit,
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
                viewPR(data.data);
            }
        }
    });
}
function jumptoNext() {
    var prnodigit = document.getElementById("prnodigit").value;
    $.ajax({
        url: '/api/PR/jumptoNext?prnodigit=' + prnodigit,
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
                viewPR(data.data);
            }


        }
    });
}





function attachments() {
    var voucherno = document.getElementById("prnumber").value;
    var vouchername = "PURCHASE_ITEMS";
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
    var voucherno = document.getElementById('prnumber').value;
    var datetime = document.getElementById('prdate').value;
    if (File1 != null) {

        var formData = new FormData();
        for (i = 0; i < File1.length; i++) {
            formData.append('Name1', File1[i]);
            formData.append('vouchername', "PURCHASE_ITEMS");
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
                if (data.success) {
                    Swal.fire('File is Uploaded!', '', 'success')
                    datatable2.ajax.reload();
                    closemodel()
                    counter()
                }
                else {
                    Swal.fire(data.message, '', 'error')
                }
            }
        });
    }
    else {
        toastr.error("Please select the file to upload");
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
            var vouchername = "PURCHASE_ITEMS";
            var url = "api/Attachments/DeleteFile";
            $.ajax({
                type: 'Delete',
                url: url,
                data: {
                    vouchername: vouchername,
                    Id: id,
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
                            title: 'Successfully Deleted'
                        })
                        datatable2.ajax.reload();
                        counter()
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            })
        }
    })
}

function counter() {

    var voucherno = document.getElementById("prnumber").value;
    var vouchername = "PURCHASE_ITEMS";
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

function rateselectedBy() {
   
}


function RateValue() {


    var QtyUnit = "";
    var quantity = document.getElementById("quantity").value;
    var altquantity = document.getElementById("altquantity").value;
    var weightquantity = document.getElementById("weight").value;
    var rate = document.getElementById("price").value;


    var selectedValue = document.getElementById("selectBy").value;
    if (selectedValue == "pr") {
        QtyUnit = document.getElementById("quantityunit").value;
        document.getElementById("totalAmount").value = rate * quantity;

    }
    else if (selectedValue == "sc") {
        QtyUnit = document.getElementById("altquantityunit").value;
        document.getElementById("totalAmount").value = rate * altquantity;
    }
    else {
        QtyUnit = document.getElementById("weightunit").value;
        document.getElementById("totalAmount").value = rate * weightquantity;
    }
    document.getElementById("priceUnit").innerHTML = QtyUnit;

    
}

function OnvalueChange() {
    var totalAmount = document.getElementById("totalAmount").value;
    var qty = document.getElementById("quantity").value;
    var qtyunit = document.getElementById("quantityunit").value;
    var altqty = document.getElementById("altquantity").value;
    var altqtyunit = document.getElementById("altquantityunit").value;
    var weight = document.getElementById("weight").value;
    var weightunit = document.getElementById("weightunit").value;

    var prPrice = (totalAmount / qty);
    document.getElementById("pricePRIN").value = prPrice.toFixed(2);
    document.getElementById("pricePR").value = qtyunit

    if (altqty != "") {

        document.getElementById("scPriceDiv").style.display = "block"
        var scPrice = (totalAmount / altqty);
        document.getElementById("priceSecIN").value = scPrice.toFixed(2);
        document.getElementById("priceSec").value = altqtyunit
    }
    else {
        document.getElementById("scPriceDiv").style.display = "none"
       
    }
    if (weightunit != "") {
        document.getElementById("weightPriceDIv").style.display = "block"
        var weightPrice = (totalAmount / weight);
        document.getElementById("priceThIN").value = weightPrice.toFixed(2);
        document.getElementById("priceTh").value = weightunit;
    }
    else {
        document.getElementById("weightPriceDIv").style.display = "none"
       
    }
}

function clearData() {
    document.getElementById("quantity").value =""
     document.getElementById("quantityunit").value =""
    document.getElementById("pricePRIN").value =""
    document.getElementById("pricePR").value = ""

    document.getElementById("scPriceDiv").style.display = "none"
    document.getElementById("priceSecIN").value =""
    document.getElementById("priceSec").value = ""

    document.getElementById("weightPriceDIv").style.display = "none"
    document.getElementById("priceThIN").value =""
    document.getElementById("priceTh").value = ""

    document.getElementById("totalAmount").value =""
}