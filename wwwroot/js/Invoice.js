
var subTotal = 0.0;
$(document).ready(function () {
    fillcompany1('consigncompanyname', 'Customer');
    fillcompany1('billcompanyname', 'Customer');

   $(".dd").hide();
    let url = new URLSearchParams(window.location.search);
    let dono = url.get('doNo');
    let ivNo = url.get('ivNo');
    if (dono != null) {
        convertToInvoice(dono);
        inVoiceNo();
        currentTime()
    }
    else {
        viewInvoice(ivNo)
    }
    $("#printbutton").click(function () {
        var idd = document.getElementById('ivNo').value;
        window.location.href = "../PerformaInvoicePrint?PINO=" + idd;

    });
});


function refreshtable(invoiceNodigit) {
    var savebutton = document.getElementById("saveSO").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/INVOICE/viewTempitem?ivnodigit=' + invoiceNodigit;
    }
    else {
        var url = '/api/INVOICE/viewInvoiceItem?ivnodigit=' + invoiceNodigit;
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
                { 'data': 'pname', 'defaultContent': '', 'width': '30%' },
                { 'data': 'psize', 'defaultContent': '', 'width': '.1%' },
                { 'data': 'pclass', 'defaultContent': '', 'width': '.1%' },
                { 'data': 'pmake', 'defaultContent': '', 'width': '.1%' },
                { 'data': 'qty', 'defaultContent': '', 'width': '5px' },
                { 'data': 'qtyunit', 'defaultContent': '', 'width': '5px' },
                { 'data': 'price', 'defaultContent': '', 'width': '20px' },
                {
                    'data': 'discount', 'render': function (data, type, row) {
                        var discount = row.discount;

                        return `<a>${discount} %</a>`;
                    }, 'width': '5%', 'className': "text-right", 'font-size': '5px'
                },
                

                {
                    'data': 'discountrate', 'render': function (data, type, row) {
                        return `<a>${row.discountPrice.toFixed(2)}</a>`;
                    }, 'width': '6%', 'font-size': '30px',
                },
                {
                    'data': 'amount', 'render': function (data, type, row) {
                        return `<a>${row.amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</a>`;
                    }, 'width': '5%', 'className': "text-right", 'font-size': '30px'
                },
               
            ],
        "autoWidth": false,
        /*  "dom": '<"top"i>rt<"bottom"flp><"clear">',*/
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'ITEM REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                },

            },

        ],

        "paging": false,
        "ordering": false,
        "info": false,
        "searching": false,
        "bAutoWidth": false,
        "bDestroy": true,




    })
}

function saveed(event) {
    let key = event.which;
    if (key == 13) {
        addcompanydetails();
    }
}

function currentstck(button) {
    var row = $(button).closest("TR");
    var id = $("TD", row).eq(0).html();
    var pname = $("TD", row).eq(1).html();
    var psize = $("TD", row).eq(2).html();
    var pclass = $("TD", row).eq(3).html();
    var Pmake = $("TD", row).eq(4).html();
    document.getElementById("mtdesc").value = id + ". " + pname + " " + psize + " " + pclass + " " + Pmake;
}
function viewInvoice(ivNo) {
    document.getElementById("saveSO").innerHTML = "Update";
    $.ajax({
        url: '/api/SO/viewSO?sono=' + sono,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('sono').value = data.data.soNo;
                document.getElementById('sonodigit').value = data.data.soNodigit;
                document.getElementById('sodate').value = moment(data.data.soDate).format('yyyy-MM-DDThh:mm');
                $("#billcompanyname option[value=" + data.data.billCCode + "]").remove();
                $('#billcompanyname').append($("<option selected></option>").val(data.data.billCCode).html(data.data.billCompanyname));
                document.getElementById('billGST').value = data.data.billGST;
                document.getElementById('billSTATE').value = data.data.billState;
                print_city('billCITY', data.data.billstatecode);
                $('#billCITY').append($("<option selected></option>").val(data.data.billCity).html(data.data.billCity));
                /*document.getElementById('billCITY').value = data.data.billCity;*/
                /*$("#billCITY").val(data.data.billCity);*/
                document.getElementById('billcp').value = data.data.billContactperson;
                document.getElementById('billaddress').value = data.data.billAddress;
                document.getElementById('billmobile').value = data.data.billPhone;
                document.getElementById('billmail').value = data.data.billEmail;

                $("#consigncompanyname option[value=" + data.data.consignCCode + "]").remove();
                $('#consigncompanyname').append($("<option selected></option>").val(data.data.billCCode).html(data.data.consignCompanyname));
                document.getElementById('consignGST').value = data.data.consignGST;
                document.getElementById('consignSTATE1').value = data.data.consignState;
                print_city('consignCITY1', data.data.consignstatecode);
                $('#consignCITY1').append($("<option selected></option>").val(data.data.consignCity).html(data.data.consignCity));
                document.getElementById('consignCITY1').value = data.data.consignCity;
                document.getElementById('consigncp').value = data.data.consignContactperson;
                document.getElementById('consignaddress').value = data.data.consignAddress;
                document.getElementById('consignmobile').value = data.data.consignPhone;
                document.getElementById('consignmail').value = data.data.consignEmail;

                document.getElementById('quotationno').value = data.data.quotno;

                document.getElementById('pono').value = data.data.poNo;
                document.getElementById('podate').value = moment(data.data.poDate).format('yyyy-MM-DDThh:mm');
                document.getElementById('ordertype').value = data.data.ordertype;
                document.getElementById('tcs').value = data.data.tcs;
                document.getElementById('tax').value = data.data.tax;
                document.getElementById('ld').checked = data.data.ld;
                if (data.data.ld == false) {
                    $(".dd").hide();
                }
                else {
                    $("#ld").click();
                }
                document.getElementById('deliverydate').value = moment(data.data.deliveryDate).format('yyyy-MM-DDThh:mm');
                document.getElementById('pinumber').value = data.data.piNo;
                document.getElementById('pinodigit').innerHTML = data.data.piNodigit;
                document.getElementById('pidate').value = moment(data.data.piDate).format('yyyy-MM-DDThh:mm');
                document.getElementById('quotationno').value = data.data.quotno;
                document.getElementById('quotdate').value = moment(data.data.qtnDate).format('yyyy-MM-DDThh:mm');
                document.getElementById('referencecode').value = data.data.amendno;
                document.getElementById('enqdate').value = moment(data.data.amendDAte).format('yyyy-MM-DDThh:mm');

                document.getElementById('LFLabel').value = data.data.label1;
                document.getElementById('LFCharges').value = data.data.input1;
                document.getElementById('FrieghtLabel').value = data.data.label2;
                document.getElementById('Freightcharges').value = data.data.input2;
                document.getElementById('frieghtTypelabel').value = data.data.label4;
                document.getElementById('frieghttype').value = data.data.input4;
                document.getElementById('balancelabel').value = data.data.label3;
                document.getElementById('balance').value = data.data.input3;
                document.getElementById('note').value = data.data.note;
                document.getElementById("quotdate").value = moment(data.data.qtnDate).format('yyyy-MM-DDThh:mm');

                var finalamt = data.data.amount;
                finalamt = finalamt.toFixed(2);
                finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('finalamt').innerHTML = finalamt;
                document.getElementById('statuss').innerHTML = data.data.status;
                if (data.data.status == true) {
                    $("#viewDiv :input").prop("disabled", true);
                }
                else {
                    $("#viewDiv :input").prop("disabled", false);
                }
            }
            document.getElementById("saveButton").style.display = "block"
            document.getElementById("saveSO").innerHTML = "Update";
            document.getElementById("tempsave").innerHTML = "Update";
            counter();
            document.getElementById("printbton").style.display = "block";
            document.getElementById("attachmentButton").style.display = "block";
            document.getElementById("jumpTo").style.display = "block";
            refreshtable(sono)
        }
    });
}
function inVoiceNo() {
    $.ajax({
        type: 'GET',
        url: "api/INVOICE/IVNO",
        success: function (data) {
            if (data.success) {
                document.getElementById("ivno").value = data.data;
                document.getElementById("ivnodigit").innerHTML = data.data;
            }
        }
    });
}

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('ivdate').value = now.toISOString().slice(0, 16);
}

function convertToInvoice(dono) {
    $.ajax({
        url: '/api/Invoice/InvoiceCheck?dono=' + dono,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.status == true) {
                if (data.datafrom == "permanant") {
                    viewInvoice(data.data);
                }
                else {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "A Previous Invoice is available!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, Resume it!',
                        cancelButtonText: 'New Invoice',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            //old pi
                            ViewTempInvoice(data.data.invoiceNodigit);
                        }
                        else {
                            dono = data.data.dono;
                            //new pi
                            $.ajax({
                                url: '/api/Invoice/DeleteTempInvoice?dono=' + dono,
                                type: 'GET',
                                contentType: 'application/json',
                                success: function (data) {
                                    if (data.success == true) {
                                        let url = new URLSearchParams(window.location.search);
                                        let dono = url.get('doNo');
                                        $.ajax({
                                            url: '/api/Invoice/ConvertToInvoice?dono=' + dono,
                                            type: 'GET',
                                            contentType: 'application/json',
                                            success: function (data) {
                                                if (data.success == true) {
                                                    ViewTempInvoice(data.data);
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
                    url: '/api/Invoice/ConvertToInvoice?dono=' + dono,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data) {
                        ViewTempInvoice(data.data);
                    }
                });
            }
        }
    });
}
function ViewTempInvoice(invoiceNodigit) {
    $.ajax({
        url: '/api/INVOICE/ViewTempInvoice?ivnodigit=' + invoiceNodigit,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                $("#billcompanyname option[value=" + data.data.billingCCode + "]").remove();
                $('#billcompanyname').append($("<option selected></option>").val(data.data.billingCCode).html(data.data.billingname));
                document.getElementById('billGST').value = data.data.billingGST;
                document.getElementById('billSTATE').value = data.data.billingState;
                document.getElementById('billCITY').value = data.data.billingCity;
                document.getElementById('billcp').value = data.data.billingContactPerson;
                document.getElementById('billaddress').value = data.data.billingAddress;
                document.getElementById('billmobile').value = data.data.billingMobile;
                document.getElementById('billmail').value = data.data.billingEmail;

                $("#consigncompanyname option[value=" + data.data.consginCCode + "]").remove();
                $('#consigncompanyname').append($("<option selected></option>").val(data.data.consginCCode).html(data.data.consginname));
                document.getElementById('consignGST').value = data.data.consginGST;
                document.getElementById('consignSTATE1').value = data.data.consginState;
                document.getElementById('consignCITY1').value = data.data.consginCity;
                document.getElementById('consigncp').value = data.data.consignContactPerson;
                document.getElementById('consignaddress').value = data.data.consginAddress;
                document.getElementById('consignmobile').value = data.data.consignMobile;
                document.getElementById('consignmail').value = data.data.consignEmail;


                document.getElementById('dono').value = data.data.dono;
                document.getElementById("dodate").value = data.data.dodate;

                document.getElementById('sono').value = data.data.soNo;
                document.getElementById('sodate').value = data.data.soDate;

                document.getElementById('pono').value = data.data.poNo;
                document.getElementById('podate').value = data.data.poDate;

                


                document.getElementById('LFLabel').value = data.data.label1;
                document.getElementById('LFCharges').value = data.data.input1;
                document.getElementById('FrieghtLabel').value = data.data.label2;
                document.getElementById('Freightcharges').value = data.data.input2;
                document.getElementById('frieghtTypelabel').value = data.data.label4;
                document.getElementById('frieghttype').value = data.data.input4;
                document.getElementById('balancelabel').value = data.data.label3;
                document.getElementById('balance').value = data.data.input3;
                document.getElementById('tempsonumber').value = data.data.invoiceNodigit;

                var finalamt = data.data.amount.toFixed(2);
                finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('finalamt').innerHTML = finalamt;


            }
            refreshtable(invoiceNodigit)
        }
    })
}

function permanentsave() {
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
    if (document.getElementById("statuss").innerHTML == "false") {

        var sonodigit = document.getElementById("tempsonumber").value;
        var counter = 0;
        var ccompanyname = document.getElementById("consigncompanyname").selectedOptions[0].text;
        var ccodee = document.getElementById("consigncompanyname").value;
        var cstate = document.getElementById("consignSTATE1").value;
        if (cstate != "") {
            cstate = document.getElementById("consignSTATE1").selectedOptions[0].text;
        }
        var ccity = document.getElementById("consignCITY1").value;
        if (ccity != "") {
            ccity = document.getElementById("consignCITY1").selectedOptions[0].text;
        }

        var cstatecode = document.getElementById("consignSTATE1").selectedIndex;
        if (cstate == "" || bstate == "Select State" || cstate == null) {
            counter = counter + 1;
            document.getElementById("cstatelabel").style.color = "red";
            document.getElementById("consignSTATE1").style.borderColor = "red";
            document.getElementById("consignSTATE1").placeholder = "State is Missing";
        }

        if (ccity == "" || ccity == "Select City" || ccity == null) {
            counter = counter + 1;
            document.getElementById("ccitylabel").style.color = "red";
            document.getElementById("consignCITY1").style.borderColor = "red";
            document.getElementById("consignCITY1").placeholder = "City is Missing";
        }

        var caddress = document.getElementById("consignaddress").value;
        var ccontactperson = document.getElementById("consigncp").value;
        var cmobile = document.getElementById("consignmobile").value;
        var cemail = document.getElementById("consignmail").value;
        var cgst = document.getElementById("consignGST").value;

        var bcompanyname = document.getElementById("billcompanyname").selectedOptions[0].text;
        var bcodee = document.getElementById("billcompanyname").value;
        var bstate = document.getElementById("billSTATE").value;
        if (bstate != "") {
            bstate = document.getElementById("billSTATE").selectedOptions[0].text;
        }
        if (bstate == "" || bstate == "Select State" || bstate == null) {
            counter = counter + 1;
            document.getElementById("bstatelabel").style.color = "red";
            document.getElementById("billSTATE").style.borderColor = "red";
            document.getElementById("billSTATE").placeholder = "State is Missing";
        }

        var bcity = document.getElementById("billCITY").value;
        if (bcity != "") {
            var bcity = document.getElementById("billCITY").selectedOptions[0].text;
        }
        if (bcity == "" || bcity == "Select City" || bcity == null) {
            counter = counter + 1;
            document.getElementById("bcitylabel").style.color = "red";
            document.getElementById("billCITY").style.borderColor = "red";
            document.getElementById("billCITY").placeholder = "City is Missing";
        }

        var baddress = document.getElementById("billaddress").value;
        var bstatecode = document.getElementById("billSTATE").selectedIndex;
        var bcontactperson = document.getElementById("billcp").value;
        var bmobile = document.getElementById("billmobile").value;
        var bemail = document.getElementById("billmail").value;
        var bgst = document.getElementById("billGST").value;

        var quotno = document.getElementById("quotationno").value;
        var quotdate = document.getElementById("quotdate").value;
        var amendno = document.getElementById("referencecode").value;
        var amdDate = document.getElementById("enqdate").value;
        var pidate = document.getElementById("pidate").value;
        var pino = document.getElementById("pinumber").value;
        var sodate = document.getElementById("sodate").value;
        var sono = document.getElementById("sono").value;

        var pono = document.getElementById("pono").value;
        var podate = document.getElementById("podate").value;
        var tcs = document.getElementById("tcs").value;
        var tax = document.getElementById("tax").value;
        var ld = document.getElementById("ld").checked;
        var deliverydate = document.getElementById("deliverydate").value;
        var note = document.getElementById("note").value;
        var lfchargeslabel = document.getElementById("LFLabel").value;
        var lfcharges = document.getElementById("LFCharges").value;
        var frieghtchargeslabel = document.getElementById("FrieghtLabel").value;
        var freightcharges = document.getElementById("Freightcharges").value;
        var previousbalancelabel = document.getElementById("balancelabel").value;
        var previousbalance = document.getElementById("balance").value;
        var freighttypelabel = document.getElementById("frieghtTypelabel").value;
        var frieghttype = document.getElementById("frieghttype").value;
        var ordertype = document.getElementById("ordertype").value;
        var sodate = document.getElementById("sodate").value;
        var amount = document.getElementById("finalamt").innerHTML;



        var ispectionClause = document.getElementById("ispectionClause").value;
        var epRequired = document.getElementById("epRequired").value;
        var ecbSide = document.getElementById("ecbSide").value;
        var caliCertificate = document.getElementById("caliCertificate").value;
        var varnshingUnvarshing = document.getElementById("varnshingUnvarshing").value;
        var mtcno = document.getElementById("mtcno").value;
        var qacRemarks = document.getElementById("qacRemarks").value;






        if (cgst == "") {
            counter = counter + 1;
            document.getElementById("consigngstlabel").style.color = "red";
            document.getElementById("consignGST").style.borderColor = "red";
            document.getElementById("consignGST").placeholder = "GST No. is required";
        } else {
            document.getElementById("consigngstlabel").style.color = "black";
            document.getElementById("consignGST").style.borderColor = "black";
        }
        if (bgst == "") {
            counter = counter + 1;
            document.getElementById("billgstlabel").style.color = "red";
            document.getElementById("billGST").style.borderColor = "red";
            document.getElementById("billGST").placeholder = "GST No. is required";
        }
        else {
            document.getElementById("billgstlabel").style.color = "black";
            document.getElementById("billGST").style.borderColor = "black";
        }
        if (pono == null || pono == "") {
            counter = counter + 1;
            document.getElementById("ponolabel").style.color = "red";
            document.getElementById("pono").style.borderColor = "red";
            document.getElementById("pono").placeholder = "P.O. Number is required";
        } else {
            document.getElementById("ponolabel").style.color = "black";
            document.getElementById("pono").style.borderColor = "black";
        }

        if (counter > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Something is missing ! Please fill the required fields`,
            })
        }
        else {
            var type = document.getElementById("saveSO").innerHTML;
            $.ajax({
                type: 'Post',
                url: "api/SO/PermanantSave?type=" + type,
                data: {
                    SONo: sono,
                    SONodigit: sonodigit,
                    SODate: sodate,

                    ConsignCompanyname: ccompanyname,
                    ConsignCCode: ccodee,
                    ConsignState: cstate,
                    ConsignCity: ccity,
                    ConsignAddress: caddress,
                    ConsignContactperson: ccontactperson,
                    ConsignPhone: cmobile,
                    ConsignEmail: cemail,
                    ConsignGST: cgst,
                    Consignstatecode: cstatecode,

                    BillCompanyname: bcompanyname,
                    BillCCode: bcodee,
                    BillState: bstate,
                    BillCity: bcity,
                    BillAddress: baddress,
                    BillContactperson: bcontactperson,
                    BillPhone: bmobile,
                    BillEmail: bemail,
                    BillGST: bgst,
                    Billstatecode: bstatecode,

                    quotno: quotno,
                    QtnDate: quotdate,
                    Amendno: amendno,
                    AmendDAte: amdDate,
                    Pino: pino,
                    PIDate: pidate,



                    PONo: pono,
                    PODate: podate,
                    Tcs: tcs,
                    Tax: tax,
                    LD: ld,
                    ordertype: ordertype,
                    DeliveryDate: deliverydate,
                    Note: note,

                    Label1: lfchargeslabel,
                    Input1: lfcharges,
                    Label2: frieghtchargeslabel,
                    Input2: freightcharges,
                    Label3: previousbalancelabel,
                    Input3: previousbalance,
                    Label4: freighttypelabel,
                    Input4: frieghttype,
                    Amount: amount,


                    InspectionClause: ispectionClause,
                    EndProtectionRequired: epRequired,
                    EndCapBothSide: ecbSide,
                    CalibrationCertificate: caliCertificate,
                    EndFinshingRequired: varnshingUnvarshing,
                    MTC: mtcno,
                    QacRemarks: qacRemarks,
                    frm: frm,

                },
                success: function (data) {
                    if (data.success == true) {



                        document.getElementById("saveButton").style.display = "block"

                        var savebutton = document.getElementById("saveSO").innerHTML;
                        document.getElementById("qapInspection").style.display = "block";
                        document.getElementById("sono").value = data.data;
                        if (savebutton == "Save") {
                            document.getElementById("saveSO").innerHTML = "Update";
                            Toast.fire({
                                icon: 'success',
                                title: 'Successfully saved'

                            })
                            document.getElementById("qapAttchmentsdiv").style.display = "block";
                            document.getElementById("printbton").style.display = "block";
                            document.getElementById("attachmentButton").style.display = "block";
                            document.getElementById("jumpTo").style.display = "block";
                            counter();
                        }
                        else {
                            Toast.fire({
                                icon: 'success',
                                title: 'Successfully updated'
                            })
                            counter();
                        }

                    }
                    else {
                        Swal.fire(data.message, '', 'info')
                    }
                }
            });

        }
    }
    else {
        Toast.fire({
            icon: 'error',
            title: "Cannot be updated because it's already in Planned "
        })
    }



}



function printSaleOrder() {
    var idd = document.getElementById("sono").value;
    window.open('../SaleOrderPrint?idd=' + idd, '_blank');
}

function taxTypeChange() {
    var taxType = document.getElementById("taxtype").value; 
    var freightCharge = document.getElementById("Freightcharges").value;
    var loadingForwarding = document.getElementById("LFCharges").value;
    var Amountt = document.getElementById("finalamt").innerHTML;
    var Amount = Amountt.split(',').join('')
    var charge = (+Amount + +freightCharge + +loadingForwarding);
    var taxableAmount = parseFloat(charge);
    var CGST = ""; 
    var SGST = "";
    var IGST = "";
    var FinalAmount =""
    if (taxType == "exportSale") {
        FinalAmount = taxableAmount;
        document.getElementById("igstdiv").style.display ="none"
        document.getElementById("sgstdiv").style.display ="none"
        document.getElementById("cgstdiv").style.display = "none" 
        document.getElementById("taxableAmount").value = FinalAmount.toFixed(2);
        document.getElementById("finalAmount").value = FinalAmount.toFixed(2);
    }
    else if (taxType == "igstSale") {
        IGST = (taxableAmount * 18) / 100
        FinalAmount = taxableAmount + IGST;
        document.getElementById("igstdiv").style.display = "block"
        document.getElementById("sgstdiv").style.display = "none"
        document.getElementById("cgstdiv").style.display = "none"
        document.getElementById("igst").value = IGST.toFixed(2);
        document.getElementById("taxableAmount").value = FinalAmount.toFixed(2);
        document.getElementById("finalAmount").value = FinalAmount.toFixed(2);
    }
    else if (taxType == "localSale") {
        CGST = (taxableAmount * 9) / 100
        SGST = (taxableAmount * 9) / 100
        FinalAmount = taxableAmount + CGST + SGST;
        document.getElementById("igstdiv").style.display = "none"
        document.getElementById("sgstdiv").style.display = "block"
        document.getElementById("cgstdiv").style.display = "block"
        document.getElementById("cgst").value = CGST.toFixed(2);
        document.getElementById("sgst").value = SGST.toFixed(2);
        document.getElementById("taxableAmount").value = FinalAmount.toFixed(2);
        document.getElementById("finalAmount").value = FinalAmount.toFixed(2);


    }
    else if (taxType == "lutSaleLocal") {
        CGST = (taxableAmount * 0.5) / 100
        SGST = (taxableAmount * 0.5) / 100
        FinalAmount = taxableAmount + CGST + SGST;
        document.getElementById("igstdiv").style.display = "none"
        document.getElementById("sgstdiv").style.display = "block"
        document.getElementById("cgstdiv").style.display = "block"
        document.getElementById("cgst").value = CGST.toFixed(2);
        document.getElementById("sgst").value = SGST.toFixed(2);
        document.getElementById("taxableAmount").value = FinalAmount.toFixed(2);
        document.getElementById("finalAmount").value = FinalAmount.toFixed(2);
    }
    else if (taxType == "lutSale") {
        IGST = (taxableAmount * 0.1) / 100
        FinalAmount = taxableAmount + IGST;
        document.getElementById("igstdiv").style.display = "block"
        document.getElementById("sgstdiv").style.display = "none"
        document.getElementById("cgstdiv").style.display = "none"
        document.getElementById("igst").value = IGST.toFixed(2);
        document.getElementById("taxableAmount").value = FinalAmount.toFixed(2);
        document.getElementById("finalAmount").value = FinalAmount.toFixed(2);
    }
    else if (taxType == "nilSale") {
        FinalAmount = taxableAmount;
        document.getElementById("igstdiv").style.display = "none"
        document.getElementById("sgstdiv").style.display = "none"
        document.getElementById("cgstdiv").style.display = "none"
        document.getElementById("taxableAmount").value = FinalAmount.toFixed(2);
        document.getElementById("finalAmount").value = FinalAmount.toFixed(2);
    }

}

function tcsonSale() {
    var type = document.getElementById("tcsonsale").value;
    var taxableAmount = document.getElementById("taxableAmount").value;
    var tcsRate = "";
    var finalAmount = "";
    if (type == "yes") {
        tcsRate = (taxableAmount * 0.1) / 100
        var TCSRATE = parseFloat(tcsRate)
        const rate = TCSRATE.toFixed(2)
        document.getElementById("tcsrate").value = rate;
        finalAmount = (+ taxableAmount + + rate);
        document.getElementById("finalAmount").value = finalAmount.toFixed(2);
        document.getElementById("tcsratediv").style.display = "block";
    }
    else {
        document.getElementById("tcsratediv").style.display = "none";
        document.getElementById("finalAmount").value = taxableAmount;
    }
}




