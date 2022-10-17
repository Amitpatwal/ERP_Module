var tp = "";
var dpno = "";
var oldDono = "";
var itemid = "";
$(document).ready(function () {
    $('#loading').hide();
    const fileInput = document.getElementById("document_attachment_doc");
    window.addEventListener('paste', e => {
        fileInput.files = e.clipboardData.files;
        previewimage()
    });
    window.onbeforeunload = function (e) {
        if (document.getElementById("permanantbt").style.display == "block") {
            RemoveReservation();
        }
    };

    $('#searchList').on('dblclick', 'tr', function () {
        $(this).toggleClass('activee');
        var row = $(this).closest("TR");
        var dono = $("TD", row).eq(2).html();
        viewDO(dono)
    });

    var now = new Date();
    document.getElementById('fromdate').value = moment(now).format('YYYY-MM-DD');;
    document.getElementById('todate').value = moment(now).format('YYYY-MM-DD');;

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

    fillcompany1('transportname', 'Transporter');
    fillcompany1('contractor', 'Contractor');
    fillcompany1('manualcontractor', 'Contractor');
    fillcompany1('suppliername', 'Customer');

    let url = new URLSearchParams(window.location.search);
    let pro = url.get('DoNO');
    let pron = url.get('DoNO');
    let donumber = url.get('DONO');
     dpno = url.get('DPNO');
    let dono1 = url.get('DONO1');
    if (donumber == null) {
        donumber = pro;
    }
    if (donumber == null) {
        donumber = pron;
    }
    if (donumber != null) {
        viewDO(donumber)
    }
    else if (dpno != null) {
        tp = "DP";
        convertToDO(dpno)
        doNumber()
        currentTime();
        document.getElementById("permanantbt").style.display = "block";
    } else if (dono1 != null) {
        tp = "pending";
        convertToDO1(dono1)
        doNumber()
        currentTime();
        document.getElementById("permanantbt").style.display = "block";
    }
    else {
        checking();
        doNumber()
        currentTime();
        document.getElementById("permanantbt").style.display = "block";
    }
    $("#reset").click(function () {
        clearall();
    });

    $("#printbt").click(function () {
        var idd = document.getElementById('donumber').value;
        window.open('../DispachtedOrderPrint?idd=' + idd, '_blank');

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



function updatereservation() {
    var now = new Date();
    var currentTime = moment(now).format('YYYY-MM-DDTHH:mm:SS');
    var dono = document.getElementById("donumber").value;
    var type = document.getElementById("saveDO").innerHTML;
    var donodigit = document.getElementById("tempdonumber").value;
    $.ajax({
        url: '/api/DO/UpdateReservation',
        data: {
            currentTime: currentTime,
            dono: dono,
            type: type,
            donodigit: donodigit
        },
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {

            }

        }
    })
}

function RemoveReservation() {
    var now = new Date();
    var currentTime = moment(now).format('YYYY-MM-DDTHH:mm:SS');
    var dono = document.getElementById("donumber").value;
    var type = document.getElementById("saveDO").innerHTML;
    var donodigit = document.getElementById("tempdonumber").value;
    $.ajax({
        url: '/api/DO/RemoveReservation',
        data: {
            currentTime: currentTime,
            dono: dono,
            type: type,
            donodigit: donodigit
        },
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {

            }

        }
    })
}

function convertToDO(dpno) {
    var now = new Date();
    var currentTime = moment(now).format('YYYY-MM-DDTHH:mm:SS');
    $.ajax({
        url: '/api/DO/reservationChecking?dpno=' + dpno,
        data: {
            currentTime: currentTime,
            tp: tp,
        },
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                if (data.frm == "TEMPORARY" && data.status == "NOT") {
                    document.getElementById('tempdonumber').value = data.data.doNodigit;
                    viewTempDO(data.data.doNodigit);
                    setInterval(function () {
                        updatereservation();
                    }, 100);
                } else if (data.frm == "TEMPORARY" && data.status == "RESERVED") {
                    Swal.fire({
                        title: 'Already reserved by ' + data.data.userid,
                        showDenyButton: false,
                        showCancelButton: false,
                    }).then((result) => {
                        window.open('../ViewDispachtedOrder');
                    })
                }
            }
            else {
                $.ajax({
                    url: '/api/DO/ConvertToDO?dpno=' + dpno,
                    type: 'GET',
                    data: { currentTime: currentTime },
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.success == true) {
                            document.getElementById("tempdonumber").value = data.data;
                            viewTempDO(data.data);
                            setInterval(function () {
                                updatereservation();
                            }, 10000);
                        }
                        else {
                            Swal.fire({
                                title: data.message,
                                showDenyButton: false,
                                showCancelButton: false,
                                /*confirmButtonText: 'Save',*/
                            }).then((result) => {

                            })
                        }
                    }
                })
            }
        }
    })

}


function printbtn() {
    var idd = document.getElementById('donumber').value;
    window.open('../LoadingPrint?idd=' + idd, '_blank');
}

function convertToDO1(dono) {
    document.getElementById("olddono").innerHTML = dono;
    $.ajax({
        url: '/api/DO/ConvertToDO1?dono=' + dono,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                oldDono = dono;
                document.getElementById("tempdonumber").value = data.data;
                viewTempDO(data.data);
            }
        }
    })

}

function viewTempDO(DoNodigit) {
    $.ajax({
        url: '/api/DO/viewTempDispachtedOrder?DoNodigit=' + DoNodigit,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {

                $("#suppliername option[value=" + data.data.supplierCCode + "]").remove();
                $('#suppliername').append($("<option selected></option>").val(data.data.supplierCCode).html(data.data.supplierCompanyname));
                document.getElementById("ponumber").value = data.data.poNo;
                var date = data.data.poDate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                document.getElementById("podate").value = dateStringWithTime;
                document.getElementById("invoiceno").value = data.data.soNo;
                document.getElementById("donodigit").value = data.data.doNodigit;
                var date = data.data.soDate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                document.getElementById("invoicedate").value = dateStringWithTime;
                document.getElementById("tempsave").value = "Update";


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
                $("#manualcontractor option[value=" + data.data.manualContratorid + "]").remove();
                $('#manualcontractor').append($("<option selected></option>").val(data.data.manualContratorid).html(data.data.manualContractor));
                document.getElementById("freighttype").value = data.data.freightType;
                document.getElementById("freightcharge").value = data.data.freightCharge;
                document.getElementById("futa").value = data.data.forwardingTransportAmount;
                document.getElementById("grno").value = data.data.grNO

                document.getElementById("note").value = data.data.note;
                document.getElementById("craneweightkg").value = data.data.craneLoadingWeightkg;
                document.getElementById("craneweightmt").value = data.data.craneLoadingWeightmt;
                document.getElementById("manualweightkg").value = data.data.manualLoadingWeightkg;
                document.getElementById("manualweightmt").value = data.data.manualLoadingWeightmt;

                document.getElementById("cranecharge").value = data.data.craneCharge;
                document.getElementById("craneuloadingtotal").value = data.data.craneTotalCharge;

                document.getElementById("manualunloadingcharge").value = data.data.manualCharge;
                document.getElementById("manulunloadingamount").value = data.data.manualTotalCharge;





            }
            refreshtable(DoNodigit);
        }
    })
}

function doNumber() {
    $.ajax({
        type: 'GET',
        url: "api/DO/DONO",
        success: function (data) {
            if (data.success) {
                document.getElementById("donumber").value = data.data;
            }
        }
    });
}

function viewDO(DONO) {
    $.ajax({
        url: '/api/DO/viewDispachtedOrder?DONO=' + DONO,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("tempsave").innerHTML = "Update";
                document.getElementById("saveDO").innerHTML = "Update";
                document.getElementById('dodate').value = data.data.doDate;


                let url = new URLSearchParams(window.location.search);
                let pro = url.get('DoNO');
                let pron = url.get('DoNO');
                let dono = url.get('DONO');
                if (data.data.reason == "incomplete" || data.data.reason == "rejected") {
                    if (pron == null) {
                        document.getElementById("permanantbt").style.display = "block";
                        /*document.getElementById("finalSubmit").style.display = "block";*/
                        refreshtable(DONO);
                    }
                    else {
                        document.getElementById("permanantbt").style.display = "none";
                        /*document.getElementById("finalSubmit").style.display = "none";*/
                        refreshtable1(DONO);
                    }
                }
                else if (data.data.reason == "approved" && pro == null) {
                    document.getElementById("permanantbt").style.display = "none";
                    /*document.getElementById("finalSubmit").style.display = "none";*/
                    document.getElementById("clearbt").style.display = "none";
                   
                    document.getElementById('printbt').style.display = "block";
                    document.getElementById("createdby").innerHTML = "Created By : " + data.data.userid;

                    var admin = data.username;


                    var dodate = document.getElementById("dodate").value;
                    var now1 = dodate.toString().replace('T', ' '); 
                    var dodateWithoutTime = moment(now1).format('YYYYMMDD');

                    var now = new Date();
                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                    var CurrentDate = moment(now).format('YYYYMMDD');

                    var datefilter = (CurrentDate - dodateWithoutTime);


                    if (datefilter < 7) {
                        document.getElementById("rejected").style.display = "block";
                    }
                    else {

                        if (admin == "AMIT PATWAL") {
                            document.getElementById("rejected").style.display = "block";
                        }
                        else {
                            document.getElementById("rejected").style.display = "block";
                        }
                    }

                    let redirctfrom = getCookie("redirctfrom");
                    if (redirctfrom == "createrDOView") {
                        document.getElementById("rejected").style.display = "block";
                    }
                    else if (redirctfrom = "checkerDOView") {

                    }
                    $("#viewDiv :input").prop("disabled", true);


                    refreshtable1(DONO);

                }
                else if (data.data.reason == "submitted") {
                    if (pro == null) {
                        document.getElementById("permanantbt").style.display = "none";
                        /*document.getElementById("finalSubmit").style.display = "none";*/
                        document.getElementById("clearbt").style.display = "none";
                        document.getElementById("printbt").style.display = "none";
                        $("#viewDiv :input").prop("disabled", true);
                    } else {
                        document.getElementById("approved").style.display = "block";
                        document.getElementById("rejected").style.display = "block";

                        $("#viewDiv :input").prop("disabled", true);
                        document.getElementById("permanantbt").style.display = "none";
                        document.getElementById("clearbt").style.display = "none";
                        document.getElementById("printbt").style.display = "none";

                    }
                    refreshtable1(DONO);


                }
                else {
                    refreshtable(DONO);
                }


                document.getElementById('donodigit').value = data.data.doNodigit;
                document.getElementById('donumber').value = data.data.doNo;
                

                $("#suppliername option[value=" + data.data.supplierCCode + "]").remove();
                $('#suppliername').append($("<option selected></option>").val(data.data.supplierCCode).html(data.data.supplierCompanyname));
                document.getElementById("ponumber").value = data.data.poNo;
                var date = data.data.poDate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                document.getElementById("podate").value = dateStringWithTime;
                document.getElementById("invoiceno").value = data.data.soNo;
                var date = data.data.soDate;
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
                $("#manualcontractor option[value=" + data.data.manualContratorid + "]").remove();
                $('#manualcontractor').append($("<option selected></option>").val(data.data.manualContratorid).html(data.data.manualContractor));
                document.getElementById("freighttype").value = data.data.freightType;
                document.getElementById("freightcharge").value = data.data.freightCharge;
                document.getElementById("futa").value = data.data.forwardingTransportAmount;
                document.getElementById("grno").value = data.data.grNO

                document.getElementById("note").value = data.data.note;
                document.getElementById("craneweightkg").value = data.data.craneLoadingWeightkg;
                document.getElementById("craneweightmt").value = data.data.craneLoadingWeightmt;
                document.getElementById("manualweightkg").value = data.data.manualLoadingWeightkg;
                document.getElementById("manualweightmt").value = data.data.manualLoadingWeightmt;

                document.getElementById("cranecharge").value = data.data.craneCharge;
                document.getElementById("craneuloadingtotal").value = data.data.craneTotalCharge;

                document.getElementById("manualunloadingcharge").value = data.data.manualCharge;
                document.getElementById("manulunloadingamount").value = data.data.manualTotalCharge;

                counter();

                $.ajax({
                    url: '/api/UserManagement/permissioncheck',
                    type: 'GET',
                    contentType: 'application/json',
                    data: {
                        formName: "DESPATCH_ORDER",
                        operation: "DELETE",
                    },
                    success: function (data) {
                        if (data.data.permission == true) {
                            document.getElementById("deletebutton").style.display = "block";
                        } else {
                            document.getElementById("deletebutton").style.display = "none";
                        }
                    }
                });

            }
        }
    })
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "DESPATCH_ORDER",
            operation: "DELETE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                document.getElementById("deletebutton").style.display = "block";
            } else {
                document.getElementById("deletebutton").style.display = "none";
            }
        }
    });

}

function clearall() {
    var donodigit = document.getElementById("tempdonumber").value;
    deletetemp(donodigit);
    window.location.href = "../DispatchedOrder";
}

function cleardataitem() {
    $('#txtName').val('');
    $('#txtSize').val('');
    $('#txtClass').val('');
    $('#txtClass').trigger('change');
    $('#txtMake').val('');
    $('#txtMake').trigger('change');
    document.getElementById('saveebutton1').innerHTML = "Save";
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
        url: '/api/DO/checking',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('tempdonumber').value = data.data.doNodigit;

                $("#suppliername option[value=" + data.data.supplierCCode + "]").remove();
                $('#suppliername').append($("<option selected></option>").val(data.data.supplierCCode).html(data.data.supplierCompanyname));
                document.getElementById("ponumber").value = data.data.poNo;
                var date = data.data.poDate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('YYYY-MM-DD');
                document.getElementById("podate").value = dateStringWithTime;
                document.getElementById("invoiceno").value = data.data.soNo;
                var date = data.data.soDate;
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
                $("#manualcontractor option[value=" + data.data.manualContratorid + "]").remove();
                $('#manualcontractor').append($("<option selected></option>").val(data.data.manualContratorid).html(data.data.manualContractor));
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
                var donodigit = document.getElementById("tempdonumber").value;
                refreshtable(donodigit)
            }

        }
    })
}

function fillitemdata(itemno) {
    document.getElementById("itemid").value = itemno;
    var savebutton = document.getElementById("saveDO").innerHTML;
    var dono = document.getElementById("donumber").value;
    var tempdono = document.getElementById("tempdonumber").value;
    if (savebutton == "Save") {
        var type = "temp";
    }
    else {
        var type = "permanant";
    }
    $.ajax({
        'url': '/api/DO/getitembyid',
        'type': 'GET',
        'contentType': 'application/json',
        data:
        {
            tempDono: tempdono,
            itemid: itemno,
            type: type,
            DONO: dono,
        },
        success: function (data) {
            if (data.success == true) {
                itemid = data.data.itemid;
                document.getElementById("txtName").value = data.data.pname;
                document.getElementById("txtSize").value = data.data.psize;
                $("#txtMake option[value=" + data.data.pmakeid + "]").remove();
                $('#txtMake').append($("<option selected></option>").val(data.data.pmakeid).html(data.data.pmake));
                document.getElementById('quantityunit').value = data.data.qtyunit;
                document.getElementById('altquantityunit').value = data.data.altQtyunit;
                document.getElementById('weightunit').value = data.data.itemWeightUnit;
                document.getElementById('saveebutton1').innerHTML = "Save";

                document.getElementById('OrderQty').innerHTML = data.data1.orderqty;
                document.getElementById('OrderQtyUnit').innerHTML = data.data.qtyunit;
                document.getElementById('DespatchQty').innerHTML = data.data1.qty;
                document.getElementById('DespatchQtyUnit').innerHTML = data.data.qtyunit;
                document.getElementById('balanceQty').innerHTML = data.data1.balanceqty.toFixed(2);
                document.getElementById('BalqtyOrder').value = data.data1.balanceqty.toFixed(2) + " " + data.data.qtyunit;
                document.getElementById('BalqtyOrderValue').value = data.data1.balanceqty.toFixed(2);
                document.getElementById('balanceqtyUnit').innerHTML = data.data.qtyunit;
                document.getElementById('desquantityunit').value = data.data.qtyunit;
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
                        currentstock();
                    }
                })

               

                
            }
        }
    });
}

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('dodate').value = now.toISOString().slice(0, 16);
    document.getElementById('podate').value = dateStringWithTime;
    document.getElementById('invoicedate').value = dateStringWithTime;

}

function addDOdetails() {
    var donodigit = document.getElementById("donodigit").value;
    var dono = document.getElementById("donumber").value;
    var olddono = document.getElementById("olddono").innerHTML;
    var contractorid = document.getElementById("contractor").value;
    if (contractorid != "") {
        var contractor = document.getElementById("contractor").selectedOptions[0].text;
    } else {
        var contractor = "";
    }
    var manualcontractorid = document.getElementById("manualcontractor").value;
    if (manualcontractorid != "") {
        var manualcontractor = document.getElementById("manualcontractor").selectedOptions[0].text;
    } else {
        var manualcontractor = "";
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
    var forwardingUptoTransportAmount = document.getElementById("futa").value;
    var grno = document.getElementById("grno").value;
    var note = document.getElementById("note").value;
    var savebutton = document.getElementById("saveDO").innerHTML;
    if (savebutton == "Save") {
        url = 'api/DO/Addtempcompanydetails';
    }
    else {
        url = 'api/DO/Updatecompanydetails';
    }
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            DoNodigit: donodigit,
            DoNo: dono,
            OldDoNo: olddono,
            Contractor: contractor,
            Contratorid: contractorid,
            ManualContractor: manualcontractor,
            ManualContratorid: manualcontractorid,
            TransportName: transporter,
            TransportCCode: transporterid,
            UnloadingIncharge: UnloadingIncharge,
            DriverName: driverName,
            License: driverLicenses,
            VechileNO: vechileNo,
            Mobileno: mobileNo,
            FreightType: freightType,
            FrerightCharge: freigtCharge,
            ForwardingTransportAmount: forwardingUptoTransportAmount,
            GrNO: grno,
            Note: note,
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
    var ctr = 0;
    const qty = document.getElementById("Qty1").value;
    const altqty = document.getElementById("AltQty1").value;
    const currentqty = document.getElementById("quantity").value;
    const currentaltqty = document.getElementById("altquantity").value;
    var despqty = document.getElementById("DespQuantity").value;

    if (+currentqty > +qty) {
        document.getElementById("quantity").style.borderColor = "red";
        ctr = ctr + 1;
    }
    else {
        document.getElementById("quantity").style.borderColor = "black";
    }
    if (+currentaltqty > +altqty) {
        document.getElementById("altquantity").style.borderColor = "red";
        ctr = ctr + 1;
    }
    else {
        document.getElementById("altquantity").style.borderColor = "black";
    }
    if (ctr > 0) {

        Toast.fire({
            icon: 'error',
            title: 'Negative Stock is not allowed!'
        })
    } else {
        var txtName = document.getElementById("txtName").value;
       /* if (txtName == 0) txtName = "";
        if (txtName == "--Select--") txtName = "";*/
        var txtWarehouse = document.getElementById("txtWarehouse").value;
        if (txtWarehouse != "") { var txtWarehouse = document.getElementById("txtWarehouse").selectedOptions[0].text; }
        if (txtWarehouse == "Select") {
            txtWarehouse = "";
        }
        if (txtName != "" && txtWarehouse != "" && ctr == 0) {

            document.getElementById("wharehouselabel").style.color = "black";
            document.getElementById("txtWarehouse").style.borderColor = "black";
            var txtSize = document.getElementById("txtSize").value;
          

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


            var quantity = document.getElementById("quantity").value;
            if (quantity == "") {
                ctr = ctr + 1;
                document.getElementById("quantity").style.borderColor = "red";
            } else {
                document.getElementById("quantity").style.borderColor = "black";
            }
            if (despqty == "") {
                ctr = ctr + 1;
                document.getElementById("DespQuantity").style.borderColor = "red";
            } else {
                document.getElementById("DespQuantity").style.borderColor = "black";
            }
            var quantityunit = document.getElementById("quantityunit").value;
            var altquantity = document.getElementById("altquantity").value;
            var altquantityunit = document.getElementById("altquantityunit").value;
            var weight = document.getElementById("weight").value;

            var weightunit = document.getElementById("weightunit").value;
            var heatno = document.getElementById("heatno").value;

            var unloadedby = document.getElementById("unloadedby").value;
            if (unloadedby != "") { var unloadedby = document.getElementById("unloadedby").selectedOptions[0].text; }

            var DoNo = document.getElementById('donumber').value;
            var saveitemm = document.getElementById("saveebutton1").innerHTML;
            var saveDO = document.getElementById("saveDO").innerHTML;
            if (saveDO == "Save") {
                var DoNodigit = document.getElementById("tempdonumber").value;
                var url = "api/DO/AddNewTempItem?type=" + saveitemm;
            }
            else {
                var DoNodigit = document.getElementById("donodigit").value;
                var url = "api/DO/AddNewItem?type=" + saveitemm;
            }
            
            var itemno = document.getElementById("itemid").value;
            var itemnosr = document.getElementById("itemidsr").value;
            if (ctr == 0) {
                $.ajax({
                    type: 'Post',
                    url: url,
                    data:
                    {
                        itemsrno: itemnosr,
                        HeatNumber: heatno,
                        DoNodigit: DoNodigit,
                        DoNo: DoNo,
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
                        despqty: despqty,
                    },
                    success: function (data) {
                        if (data.success) {
                            document.getElementById("craneweightkg").value = data.data.craneLoadingWeightkg;
                            document.getElementById("craneweightmt").value = data.data.craneLoadingWeightmt;
                            document.getElementById("manualweightkg").value = data.data.manualLoadingWeightkg;
                            document.getElementById("manualweightmt").value = data.data.manualLoadingWeightmt;

                            document.getElementById('OrderQty').innerHTML = data.data1.orderqty;
                            document.getElementById('OrderQtyUnit').innerHTML = data.data1.qtyunit;
                            document.getElementById('DespatchQty').innerHTML = data.data1.qty;
                            document.getElementById('DespatchQtyUnit').innerHTML = data.data1.qtyunit;

                            document.getElementById("BalqtyOrder").value = data.data1.balanceqty.toFixed(2); + " " + data.data1.qtyunit;
                            document.getElementById('balanceQty').innerHTML = data.data1.balanceqty.toFixed(2);
                            document.getElementById('balanceqtyUnit').innerHTML = data.data1.qtyunit;
                            document.getElementById('saveebutton1').innerHTML = "Save";
                            $('#ItemTable').DataTable().ajax.reload();
                            $('#ItemTableLoad').DataTable().ajax.reload();
                            currentstock();
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

                document.getElementById('quantity').value = "";
                document.getElementById('altquantity').value = "";
                document.getElementById('weight').value = "";
                document.getElementById('heatno').value = "";
                document.getElementById('DespQuantity').value = "";
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Complete the details'
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


            Toast.fire({
                icon: 'error',
                title: 'Please select the wharehouse!'
            })

        }
    }
}
function despatchMaterial() {

    var savebutton = document.getElementById("saveDO").innerHTML;
    if (savebutton == "Save") {
        var DoNodigit = document.getElementById("tempdonumber").value;
        var url = '/api/DO/getitemtemp?DoNodigit=' + DoNodigit;
    }
    else {
        var DoNo = document.getElementById("donumber").value;
        var url = '/api/DO/getdespatchitem?DONO=' + DoNo;
    }
    datatable = $("#dispachtedMaterial").DataTable({
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
                        if (row.pclass != null) {
                            if (row.altQtyunit != null) {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}" <br /></a>
                                                <a>${row.qty} ${row.qtyunit} = ${row.altQty} ${row.altQtyunit}"   </a>`
                            }
                            else {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   </a>`
                            }
                        }
                        else {
                            if (row.altQtyunit != null) {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" <br /></a>
                                            <a>${row.qty} ${row.qtyunit} = ${row.altQty} ${row.altQtyunit}" `
                            }
                            else {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" </a> `
                            }
                        }
                        return html1;
                    }, 'width': '35%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },
                { 'data': 'pmake', 'defaultContent': '', 'width': '10%' },
                { 'data': 'wharehouse', 'defaultContent': '', 'width': '10%' },
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.qty} ${row.qtyunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                {
                    'data': 'itemWeight', 'render': function (data, type, row) {
                        if (row.itemWeightUnit != null) {
                            var html = `<a>${row.itemWeight} ${row.itemWeightUnit}</a>`;
                        }
                        else {
                            var html = `<a>${row.itemWeight}</a>`;
                        }
                        return html;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                { 'data': 'unloadedBy', 'defaultContent': '', 'width': '8%' },
                { 'data': 'heatNumber', 'defaultContent': '', 'width': '10%' },

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


function refreshtable(DoNodigit) {
    var savebutton = document.getElementById("saveDO").innerHTML;

    if (savebutton == "Save") {
        var url = '/api/DO/getitem?DoNodigit=' + DoNodigit;
    }
    else {
        var url = '/api/DO/getitemByDONO?DONO=' + DoNodigit;
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
                { 'data': 'pmake', 'defaultContent': '', 'width': '10%' },
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.orderqty} ${row.qtyunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
                },
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.qty} ${row.qtyunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                {
                    'data': 'altQty', 'render': function (data, type, row) {
                        return `<a>${row.balanceqty.toFixed(2)} ${row.qtyunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                {
                    'data': 'itemWeight', 'render': function (data, type, row) {
                        if (row.itemWeightUnit != null) {
                            var html = `<a>${row.itemWeight} ${row.itemWeightUnit}</a>`;
                        }
                        else {
                            var html = `<a>${row.itemWeight}</a>`;
                        }
                        return html;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        return `<a class="fa fa-pencil" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=refreshItem('${data}')></a>`;
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
            },
            
            {
                text: 'Refresh Item',
                action: function (e, dt, node, config) {
                    refreshItemm();
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
function refreshItemm() {
    var savebutton = document.getElementById("saveDO").innerHTML;
    if (savebutton == "Save") {
        Swal.fire({
            title: 'Are you sure you want to refresh the item ?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Refresh the item!'
        }).then((result) => {
            if (result.isConfirmed) {
                var donodigit = document.getElementById('tempdonumber').value;
                $.ajax({
                    type: 'Post',
                    url: "/api/DO/refreshitem",
                    data:
                    {
                        donodigit: donodigit,
                        dpno: dpno
                    },
                    success: function (data) {
                        if (data.success) {
                            $('#ItemTable').DataTable().ajax.reload();
                        }
                        else {
                            Swal.fire(data.message, '', 'info')
                        }
                    }
                });
            }
        })
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
            title: 'Not Allowed to refresh Item'
        })
    }
}

function refreshtable1(DoNodigit) {
    var savebutton = document.getElementById("saveDO").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/DO/getitem?DoNodigit=' + DoNodigit;
    }
    else {
        var url = '/api/DO/getitemByDONO?DONO=' + DoNodigit;
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
                        if (row.pclass != null) {

                            if (row.itemWeightUnit == null) {
                                var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.pname} &nbsp;"${row.psize}" &nbsp"${row.pclass}" </span>`
                            }
                            else {
                                var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.pname} &nbsp;"${row.psize}" &nbsp"${row.pclass}" </span><br />
                                             <span style="font-family: 'sans-serif'; font-weight: normal;">${row.qty.toFixed(2)} ${row.qtyunit} = ${row.altQty} ${row.altQtyunit} </span>`
                            }
                        }
                        else {
                            var html1 = `<span style="font-family: 'sans-serif'; font-weight: normal;">${row.pname} &nbsp;"${row.psize}"</span>`
                        }
                        return html1;
                    }, 'width': '30%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },
                { 'data': 'pmake', 'defaultContent': '', 'width': '10%' },
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.orderqty.toFixed(2)} ${row.qtyunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
                },
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.qty.toFixed(2)} ${row.qtyunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                {
                    'data': 'altQty', 'render': function (data, type, row) {
                        return `<a>${row.balanceqty.toFixed(2)} ${row.qtyunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                {
                    'data': 'itemWeight', 'render': function (data, type, row) {
                        if (row.itemWeightUnit != null) {
                            var html = `<a>${row.itemWeight} ${row.itemWeightUnit}</a>`;
                        }
                        else {
                            var html = `<a>${row.itemWeight}</a>`;
                        }
                        return html;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        return `<a class="fa fa-eye" style="color:green" data-toggle="modal" data-target="#eyebutton" onclick=refreshItem1('${data}')></a>`;
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
        "bDestroy": true,
        "bAutoWidth": false,

    });
    datatable.on('order.dt ', function () {
        datatable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}

function refreshItem(itemid) {
    dataitem(itemid)
    var savebutton = document.getElementById("saveDO").innerHTML;
    if (savebutton == "Save") {
        var DoNodigit = document.getElementById("donodigit").value;
        var url = '/api/DO/getitemList?DoNodigit=' + DoNodigit;
    }
    else {
        var DoNodigit = document.getElementById("donumber").value;
        var url = '/api/DO/getitemListByDONO?DONO=' + DoNodigit;
    }

    datatable = $("#ItemTableLoad").DataTable({
        ajax: {
            'url': url,
            data: {
                itemid: itemid,
            },
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                { 'data': 'itemsrno', 'defaultContent': '', 'width': '.1%' },
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        if (row.pclass != null) {
                            if (row.altQtyunit != null) {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}" <br /></a>
                                                <a>${row.qty} ${row.qtyunit} = ${row.altQty} ${row.altQtyunit}"   </a>`
                            }
                            else {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   </a>`
                            }
                        }
                        else {
                            if (row.altQtyunit != null) {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" <br /></a>
                                            <a>${row.qty} ${row.qtyunit} = ${row.altQty} ${row.altQtyunit}" `
                            }
                            else {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" </a> `
                            }
                        }
                        return html1;
                    }, 'width': '35%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },
                { 'data': 'pmake', 'defaultContent': '', 'width': '10%' },
                { 'data': 'wharehouse', 'defaultContent': '', 'width': '10%' },
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.qty} ${row.qtyunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                {
                    'data': 'itemWeight', 'render': function (data, type, row) {
                        if (row.itemWeightUnit != null) {
                            var html = `<a>${row.itemWeight} ${row.itemWeightUnit}</a>`;
                        }
                        else {
                            var html = `<a>${row.itemWeight}</a>`;
                        }
                        return html;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                { 'data': 'unloadedBy', 'defaultContent': '', 'width': '8%' },
                { 'data': 'heatNumber', 'defaultContent': '', 'width': '10%' },
                {
                    'data': 'itemsrno', 'render': function (data, type, row) {
                        return `<a class="fa fa-pencil" style="color:green" onclick=fillitemlist('${data}')></a>
                                <a class="fa fa-trash" style="color:red" onclick=Remove1('${data}')></a>`;
                    }, 'width': '.1%'
                },
            ],
        "language": {
            "emptyTable": "No data found, Please click on <b>Add New</b> Button"
        },
        "bDestroy": true,
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bDestroy": true,
        "bAutoWidth": false,

    });
}

function refreshItem1(itemid) {
    var savebutton = document.getElementById("saveDO").innerHTML;
    if (savebutton == "Save") {
        var DoNodigit = document.getElementById("donodigit").value;
        var url = '/api/DO/getitemList?DoNodigit=' + DoNodigit;
    }
    else {
        var DoNodigit = document.getElementById("donumber").value;
        var url = '/api/DO/getitemListByDONO?DONO=' + DoNodigit;
    }

    datatable = $("#ViewTableLoad").DataTable({
        ajax: {
            'url': url,
            data: {
                itemid: itemid,
            },
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                { 'data': 'itemsrno', 'defaultContent': '', 'width': '.1%' },
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        if (row.pclass != null) {
                            if (row.altQtyunit != null) {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}" <br /></a>
                                                <a>${row.qty} ${row.qtyunit} = ${row.altQty} ${row.altQtyunit}"   </a>`
                            }
                            else {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   </a>`
                            }
                        }
                        else {
                            if (row.altQtyunit != null) {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" <br /></a>
                                            <a>${row.qty} ${row.qtyunit} = ${row.altQty} ${row.altQtyunit}" `
                            }
                            else {
                                var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" </a> `
                            }
                        }
                        return html1;
                    }, 'width': '35%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },
                { 'data': 'pmake', 'defaultContent': '', 'width': '10%' },
                { 'data': 'wharehouse', 'defaultContent': '', 'width': '10%' },
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.qty} ${row.qtyunit}</a>`;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                {
                    'data': 'itemWeight', 'render': function (data, type, row) {
                        if (row.itemWeightUnit != null) {
                            var html = `<a>${row.itemWeight} ${row.itemWeightUnit}</a>`;
                        }
                        else {
                            var html = `<a>${row.itemWeight}</a>`;
                        }
                        return html;
                    }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-right"
                },
                { 'data': 'unloadedBy', 'defaultContent': '', 'width': '8%' },
                { 'data': 'heatNumber', 'defaultContent': '', 'width': '10%' },
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
        "bDestroy": true,
        "bAutoWidth": false,

    });
}

function Remove1(button) {
    var itmno = document.getElementById("itemid").value;
    var type = document.getElementById("saveDO").innerHTML;
    var url = "api/DO/DeleteIT";

    if (confirm("Do you want to delete: " + button)) {
        var tempdo = document.getElementById("tempdonumber").value;
        var dono = document.getElementById("donumber").value;
        $.ajax({
            type: 'Delete',
            url: url,
            data:
            {
                type: type,
                tempdo: tempdo,
                itmno: itmno,
                dono: dono,
                itemsrno: button,
            },
            success: function (data) {
                if (data.success) {
                    document.getElementById('OrderQty').innerHTML = data.data1.orderqty;
                    document.getElementById('OrderQtyUnit').innerHTML = data.data1.qtyunit;
                    document.getElementById('DespatchQty').innerHTML = data.data1.qty;
                    document.getElementById('DespatchQtyUnit').innerHTML = data.data1.qtyunit;
                    document.getElementById('balanceQty').innerHTML = data.data1.balanceqty.toFixed(2);
                    document.getElementById('balanceqtyUnit').innerHTML = data.data1.qtyunit;
                    $('#ItemTableLoad').DataTable().ajax.reload();
                    $('#ItemTable').DataTable().ajax.reload();
                    currentstock();
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
                        title: 'Successfully deleted!'
                    })
                }
                else {
                    Swal.fire(data.message, '', 'info')
                }
            }
        });
    }
}

function fillitemlist(itemsr) {
    var savebutton = document.getElementById("saveDO").innerHTML;
    var dono = document.getElementById("donumber").value;
    var tempdono = document.getElementById("tempdonumber").value;
    var itemno = document.getElementById("itemid").value;
    if (savebutton == "Save") {
        var type = "temp";
    }
    else {
        var type = "permanant";
    }
    $.ajax({
        'url': '/api/DO/getitemListbyid',
        'type': 'GET',
        'contentType': 'application/json',
        data:
        {
            tempDono: tempdono,
            itemid: itemno,
            itemidsr: itemsr,
            type: type,
            DONO: dono,
        },
        success: function (data) {
            if (data.success == true) {
                document.getElementById('itemidsr').value = data.data.itemsrno;
                const Pname = data.data.pname;
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
                                document.getElementById('txtClass').value = data.data2;
                            }
                        }
                    })
                }
                $("#txtMake option[value=" + data.data1 + "]").remove();
                $('#txtMake').append($("<option selected></option>").val(data.data1).html(data.data.pmake));
                $("#txtWarehouse option[value=" + data.data3 + "]").remove();
                $('#txtWarehouse').append($("<option selected></option>").val(data.data3).html(data.data.wharehouse));
                $("#txtUnit option[value=" + data.data.unitid + "]").remove();
                $('#txtUnit').append($("<option selected></option>").val(data.data.unitid).html(data.data.qtyunit));
                document.getElementById('quantity').value = data.data.qty;
                document.getElementById('quantityunit').value = data.data.qtyunit;
                document.getElementById('altquantity').value = data.data.altQty;
                document.getElementById('altquantityunit').value = data.data.altQtyunit;
                document.getElementById('weight').value = data.data.itemWeight;
                document.getElementById('weightunit').value = data.data.itemWeightUnit;
                document.getElementById('unloadedby').value = data.data.unloadedBy;
                document.getElementById('heatno').value = data.data.heatNumber;
                document.getElementById('DespQuantity').value = data.data.despQty;
                document.getElementById('saveebutton1').innerHTML = "Update";
                currentstock();
            }
        }
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
    if (suppliercompanyname != "--Select--" && invoiceno != "") {

        document.getElementById("invoicelabel").style.color = "black";
        document.getElementById("invoiceno").style.borderColor = "black";
        document.getElementById("supplierlabel").style.color = "black";
        document.getElementById("suppliername").style.borderColor = "black";
        var dono = document.getElementById("donumber").value;
        var tempdono = document.getElementById("tempdonumber").value;
        var dodate = document.getElementById("dodate").value;
        var ponumber = document.getElementById("ponumber").value;
        var podate = document.getElementById("podate").value;
        var invoicedate = document.getElementById("invoicedate").value;
        var contractorid = document.getElementById("contractor").value;
        if (contractorid != "") {
            var contractor = document.getElementById("contractor").selectedOptions[0].text;
        } else {
            var contractor = "";
        }
        var manualcontractorid = document.getElementById("manualcontractor").value;
        if (manualcontractorid != "") {
            var manualcontractor = document.getElementById("manualcontractor").selectedOptions[0].text;
        } else {
            var manualcontractor = "";
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
        var forwardinguptotransportCharge = document.getElementById("futa").value;
        var grno = document.getElementById("grno").value;
        var UnloadingIncharge = document.getElementById("unloadingincharge").value;
        var note = document.getElementById("note").value;

        var craneweightKG = document.getElementById("craneweightkg").value;
        var craneweightMT = document.getElementById("craneweightmt").value;
        var manualweightKG = document.getElementById("manualweightkg").value;
        var manualweightMT = document.getElementById("manualweightmt").value;
        var cranecharge = document.getElementById("cranecharge").value;
        var craneloadingtotal = document.getElementById("craneuloadingtotal").value;
        var manualunloadingcharge = document.getElementById("manualunloadingcharge").value;
        var manualloadingAmount = document.getElementById("manulunloadingamount").value;
        var savebutton = document.getElementById("saveDO").innerHTML;
        var now = new Date();
        var frm = tp;
        var ReservationTime = moment(now).format('YYYY-MM-DDTHH:mm:SS');
        if (savebutton == "Save") {
            url = "api/DO/PermanantSave?tempdono=" + tempdono;
        }
        else {
            url = "api/DO/PermanantUpdate";
        }
        $('#loading').show();
        $.ajax({
            type: 'Post',
            url: url,
            data:
            {
                frm: frm,
                ReservationTime: ReservationTime,
                DoNo: dono,
                OldDoNo: oldDono,
                DoDate: dodate,
                PoNo: ponumber,
                PoDate: podate,
                soNo: invoiceno,
                soDate: invoicedate,
                SupplierCompanyname: suppliercompanyname,
                SupplierCCode: suppliercompanynamecode,
                Contractor: contractor,
                Contratorid: contractorid,
                ManualContractor: manualcontractor,
                ManualContratorid: manualcontractorid,
                TransportName: transporter,
                TransportCCode: transporterid,
                UnloadingIncharge: UnloadingIncharge,

                DriverName: driverName,
                License: driverLicenses,
                VechileNO: vechileNo,
                Mobileno: mobileNo,

                FreightType: freightType,
                FreightCharge: freigtCharge,
                ForwardingTransportAmount: forwardinguptotransportCharge,
                GrNO: grno,

                CraneLoadingWeightkg: craneweightKG,
                CraneLoadingWeightmt: craneweightMT,
                CraneCharge: cranecharge,
                CraneTotalCharge: craneloadingtotal,
                ManualLoadingWeightkg: manualweightKG,
                ManualLoadingWeightmt: manualweightMT,
                ManualCharge: manualunloadingcharge,
                ManualTotalCharge: manualloadingAmount,


                Note: note,
                Dpno:dpno,


            },
            success: function (data) {
                if (data.success == true) {

                    var savebutton = document.getElementById("saveDO").innerHTML;
                    document.getElementById("donumber").value = data.data;

                    document.getElementById('saveDO').innerHTML = "Update";
                    document.getElementById('printpreview').style.display = "block";
                    $('#loading').hide();
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
                            counter();
                            finalSubmit();
                        }
                    })

                }
                else {
                    $('#loading').hide();
                    Toast.fire({
                        icon: 'error',
                        title: data.message,
                    })
                }
            }
        })
    }
    else {
        $('#loading').hide();
        if (invoiceno == "") {
            document.getElementById("invoicelabel").style.color = "red";
            document.getElementById("invoiceno").style.borderColor = "red";
        }
        else {
            document.getElementById("invoicelabel").style.color = "black";
            document.getElementById("invoiceno").style.borderColor = "black";
        }
        if (suppliercompanyname == "--Select--") {
            document.getElementById("supplierlabel").style.color = "red";
            document.getElementById("suppliername").style.backgroundColor = "red";
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
    var dono = document.getElementById("donumber").value;
    var url = "api/DO/finalsubmit";
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            dono: dono
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
                refreshtable1(dono)
                Toast.fire({
                    icon: 'success',
                    title: 'Submitted saved'
                })
                document.getElementById('permanantbt').style.display = "none";
                /* document.getElementById('finalSubmit').style.display = "none";*/

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

    var dono = document.getElementById("donumber").value;
    var url = "api/DO/approved";
    var date1 = new Date();
    var now1 = date1.toString().replace('', ' ');
    var currentdate = moment(now1).format('YYYY-MM-DD hh:mm');
    $.ajax({
        type: 'Post',
        url: url,
        data:
        {
            dono: dono,
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

                $.ajax({
                    url: '/api/UserManagement/permissioncheck',
                    type: 'GET',
                    contentType: 'application/json',
                    data: {
                        formName: "DESPATCH_ORDER",
                        operation: "FINAL_PRINT",
                    },
                    success: function (data) {
                        if (data.data.permission == true) {
                            document.getElementById('printbt').style.display = "block";

                        } else {
                            document.getElementById('printbt').style.display = "block";
                        }
                    }
                });





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
    var dono = document.getElementById("donumber").value;
    var reason = document.getElementById("reasonText").value;
    if (reason != null && reason != "") {
        document.getElementById("reasonlabel").style.color = "black";
        document.getElementById("reasonText").style.borderColor = "black";
        var date1 = new Date();
        var now1 = date1.toString().replace('', ' ');
        var currenttimedate = moment(now1).format('YYYY-MM-DD hh:mm');

        var url = "api/DO/rejected";
        $.ajax({
            type: 'Post',
            url: url,
            data:
            {
                Remarks: reason,
                Dono: dono,
                Date: currenttimedate,
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


function currentstock() {
    var txtName = document.getElementById("txtName").value;
  
    var txtWarehouse = document.getElementById("txtWarehouse").value;
    if (txtWarehouse != "") { var txtWarehouse = document.getElementById("txtWarehouse").selectedOptions[0].text; }
    if (txtWarehouse == "Select") {
        txtWarehouse = "";
    }
    var txtSize = document.getElementById("txtSize").value;
   

    var txtClass = document.getElementById("txtClass").value;
    if (txtClass != "") {
        var txtClass = document.getElementById("txtClass").selectedOptions[0].text;
        if (txtClass == "--Select--") { txtClass = ""; }
    }

    var txtmake = document.getElementById("txtMake").value;
    if (txtmake != "") {
        var txtmake = document.getElementById("txtMake").selectedOptions[0].text;
        if (txtmake == "--Select--") {
            txtmake = "";
        }
    }
    checkalternateunit1()
    var type = document.getElementById("saveDO").innerHTML;
    var edate = document.getElementById("dodate").value;
    var itemtype = document.getElementById("saveebutton1").innerHTML;
    var itemid = document.getElementById('itemid').value;
    var itemsrno = document.getElementById('itemidsr').value;
    var dono = document.getElementById('donumber').value;
    var donodigit = document.getElementById('donodigit').value;
    $.ajax({
        type: 'Post',
        url: "api/DO/Currentstock",
        data:
        {
            donodigit: donodigit,
            dono: dono,
            itemtype: itemtype,
            typee: type,
            pname: txtName,
            psize: txtSize,
            pclass: txtClass,
            pmake: txtmake,
            GodownLocation: txtWarehouse,
            ddate: edate,
            itemid: itemid,
            itemsrno: itemsrno,
        },
        success: function (data) {
            if (data.success) {
                document.getElementById("Qty1").value = data.qty.toFixed(2);
                document.getElementById("AltQty1").value = data.altqty;
                document.getElementById("qtystock").value = data.qty.toFixed(2) + " " + document.getElementById("quantityunit").value;
                document.getElementById("Altqtystock").value = data.altqty + " " + document.getElementById("altquantityunit").value;
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
            const qty = document.getElementById("Qty1").value;
            const altqty = document.getElementById("AltQty1").value;
            const currentqty = document.getElementById("quantity").value;
            const currentaltqty = document.getElementById("altquantity").value;

            if (+currentqty > +qty) {
                document.getElementById("quantity").style.borderColor = "red";
            }
            else {
                document.getElementById("quantity").style.borderColor = "black";
            }
            if (+currentaltqty > +altqty) {
                document.getElementById("altquantity").style.borderColor = "red";
            }
            else {
                document.getElementById("altquantity").style.borderColor = "black";
            }
        }
    });

}
function negativestock(frm) {
    if (frm == 1) {
        calcy();
    }
    currentstock();
}

function goback() {
    let redirctfrom = getCookie("redirctfrom");
    if (redirctfrom == "createrDOView") {
        window.location.href = "ViewDispachtedOrder";
    }
    else if (redirctfrom = "checkerDOView") {
        window.location.href = "DispachtedOrderCheck";
    }

}

function printPreview() {
    var idd = document.getElementById('donumber').value;
    window.open('../DOPrintPreview?idd=' + idd, '_blank');
}


function jumptoPrevious() {
    var donodigit = document.getElementById("donodigit").value;
    $.ajax({
        url: '/api/DO/jumptoPrevious?donodigit=' + donodigit,
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
                viewDO(data.data);
            }
        }
    });
}
function jumptoNext() {
    var donodigit = document.getElementById("donodigit").value;
    $.ajax({
        url: '/api/DO/jumptoNext?donodigit=' + donodigit,
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
                viewDO(data.data);
            }


        }
    });
}



function attachments() {

    var voucherno = document.getElementById("donumber").value;
    var vouchername = "DESPATCHED_ORDER";
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
    var voucherno = document.getElementById('donumber').value;
    var datetime = document.getElementById('dodate').value;
    if (File1 != null) {

        var formData = new FormData();
        for (i = 0; i < File1.length; i++) {
            formData.append('Name1', File1[i]);
            formData.append('vouchername', "DESPATCHED_ORDER");
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
                        title: 'File is Uploaded!'
                    })
                    datatable2.ajax.reload();
                    counter();
                    closemodel();
                }
                else {
                    toastr.error(data.message);
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
            var vouchername = "DESPATCHED_ORDER";
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
                        counter();
                        closemodel();
                    }
                    else {
                        Swal.fire(data.message, '', 'error')

                    }
                }
            })
        }
    })
}



function counter() {

    var voucherno = document.getElementById("donumber").value;
    var vouchername = "DESPATCHED_ORDER";
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
function BalanceQty() {
    var DespQty = document.getElementById("DespQuantity").value;
    var orderqty = document.getElementById("BalqtyOrderValue").value;
    var balqty = orderqty - DespQty;
    var unit = document.getElementById("desquantityunit").value;
    document.getElementById("BalqtyOrder").value = balqty.toFixed(2) + " " + unit;
    if (DespQty == "") {
        document.getElementById("DespQuantity").style.borderColor = "red";
    } else {
        document.getElementById("DespQuantity").style.borderColor = "black";
    }
}
function deletedo() {
    var dono = document.getElementById("donumber").value;
    $.ajax({
        type: 'Post',
        url: "api/DO/DeleteDO",
        data: {
            dono: dono,
        },
        success: function (data) {
            if (data.success) {
                window.location.href = "ViewDispachtedOrder";
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
function viewperiod() {
    var periodCheck = document.getElementById("periodcheck").checked;
    if (periodCheck == true) {
        document.getElementById("periodDiv").style.display = "block";
        document.getElementById("SearchDiv").style.display = "none";
    } else {
        document.getElementById("SearchDiv").style.display = "block";
        document.getElementById("periodDiv").style.display = "none";
    }
}
function searchingReport() {
    $("#searchReportDiv").show(150);
    var partynamecheck = document.getElementById("partynamecheck").checked;
    var ponocheck = document.getElementById("ponocheck").checked;
    var grnocheck = document.getElementById("grnocheck").checked;
    var donocheck = document.getElementById("donocheck").checked;
    var heatnocheck = document.getElementById("heatnocheck").checked;
    var vechilecheck = document.getElementById("vechilecheck").checked;
    var periodCheck = document.getElementById("periodcheck").checked;
   


    if (partynamecheck == true) {
        var searchtype = "PARTY";
    }
    else if (ponocheck == true) {
        var searchtype = "PONO";
    }
    else if (grnocheck == true) {
        var searchtype = "GRNO";
    }
    else if (donocheck == true) {
        var searchtype = "DONO";
    } else if (heatnocheck == true) {
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
            'url': "api/DO/SearchDo",
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
                    'data': 'doDate', 'render': function (data) {
                        var date = data;
                        var now = date.toString().replace('T', ' ');
                        var dateStringWithTime = moment(now).format('DD/MMM/YYYY');
                        return `<span>${dateStringWithTime}</span>`;
                    }, 'width': '5%', 'font-size': '6px'
                },
                { 'data': 'doNo', 'defaultContent': '', 'width': '10%' },
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
function hideSearchReport() {
    $("#searchReportDiv").hide(150);
}


function SOattachments() {
   
    var soattachments = document.getElementById("invoiceno").value;
    document.getElementById("attachmentlabel").innerHTML = soattachments
    var vouchername = "SALE_ORDER";
    Attachmentsdatatable = $("#soattachmentsTable").DataTable({
        ajax: {
            'url': '/api/Attachments/getFiledetail',
            'type': 'GET',
            'contentType': 'application/json',
            'data': {
                voucherno: soattachments,
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
    Attachmentsdatatable.on('order.dt ', function () {
        Attachmentsdatatable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}