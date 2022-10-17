var frm = "";
$(document).ready(function () {

    const fileInput = document.getElementById("document_attachment_doc");
    window.addEventListener('paste', e => {
        fileInput.files = e.clipboardData.files;
        previewimage()
    });
    print_state("billSTATE");
    print_state("consignSTATE1");
    fillcompany1('consigncompanyname', 'Customer');
    fillcompany1('billcompanyname', 'Customer');


    $("#reset").click(function () {
        clearall();
    });
    $(".dd").hide();
    let url = new URLSearchParams(window.location.search);
    let pino = url.get('PINO');
    let sono = url.get('soNo');
    if (pino != null) {
        convertToSO(pino);
        saleOrderNo();
        currentTime()
        frm = "PI";
        document.getElementById("statuss").innerHTML = "false";
    }
    else if (sono != null) {
        viewSO(sono);
    }
    else {
        saleOrderNo();
        currentTime();
        checking();
        frm = "NEW";
        document.getElementById("tempsave").innerHTML = "Save";
        document.getElementById("statuss").innerHTML = "false";
    }
    $("#STATE").select2();
    $("#STATE1").select2();
    $("#CITY").select2();
    $("#CITY1").select2();

    $("#printbutton").click(function () {
        var idd = document.getElementById('pino').value;
        window.location.href = "../PerformaInvoicePrint?PINO=" + idd;

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


function checking() {
    $.ajax({
        url: '/api/SO/checking',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('tempsonumber').value = data.data.soNodigit;
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
                document.getElementById('podate').value = data.data.poDate;
                document.getElementById('ordertype').value = data.data.ordertype;
                document.getElementById('tcs').value = data.data.tcs;
                document.getElementById('tax').value = data.data.tax;
                document.getElementById('ld').checked = data.data.ld;
                document.getElementById('deliverydate').value = data.data.deliveryDate;
                document.getElementById('pinumber').value = data.data.piNo;
                document.getElementById('pinodigit').innerHTML = data.data.piNodigit;
                document.getElementById('pidate').value = data.data.piDate;
                document.getElementById('quotationno').value = data.data.quotno;
                document.getElementById('quotdate').value = data.data.qtnDate;
                document.getElementById('referencecode').value = data.data.amendno;
                document.getElementById('enqdate').value = data.data.amendDAte;


                document.getElementById('LFLabel').value = data.data.label1;
                document.getElementById('LFCharges').value = data.data.input1;
                document.getElementById('FrieghtLabel').value = data.data.label2;
                document.getElementById('Freightcharges').value = data.data.input2;
                document.getElementById('frieghtTypelabel').value = data.data.label4;
                document.getElementById('frieghttype').value = data.data.input4;
                document.getElementById('balancelabel').value = data.data.label3;
                document.getElementById('balance').value = data.data.input3;
                document.getElementById('note').value = data.data.note;
                document.getElementById("quotdate").value = data.data.qtnDate

                var finalamt = data.data.amount;
                finalamt = finalamt.toFixed(2);
                finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('finalamt').innerHTML = finalamt;


                document.getElementById("tempsave").innerHTML = "Update";
                var prnodigit = document.getElementById("tempsonumber").value;
                refreshtable(prnodigit)
            }

        }
    })
}

function refreshtable(sono) {
    var savebutton = document.getElementById("saveSO").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/SO/viewTempitem?sonodigit=' + sono;
    }
    else {
        var url = '/api/SO/viewSoItem?sono=' + sono;
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
                { 'data': 'pname', 'defaultContent': '', 'width': '40%' },
                { 'data': 'psize', 'defaultContent': '', 'width': '.1%' },
                { 'data': 'pclass', 'defaultContent': '', 'width': '.1%' },
                { 'data': 'pmake', 'defaultContent': '', 'width': '.1%' },
                { 'data': 'rateunit', 'defaultContent': '', 'width': '112px' },
                { 'data': 'rate', 'defaultContent': '', 'width': '112px' },
                {
                    'data': 'discount', 'render': function (data, type, row) {
                        var discount = row.discount;

                        return `<a>${discount}</a>`;
                    }, 'width': '5%', 'className': "text-right", 'font-size': '5px'
                },
                {
                    'data': 'qty', 'render': function (data, type, row) {
                        return `<a>${row.qty} ${row.rateunit}</a>`;
                    }, 'width': '6%', 'font-size': '5px',
                },

                {
                    'data': 'discountrate', 'render': function (data, type, row) {
                        return `<a>${row.discountrate.toFixed(2)}</a>`;
                    }, 'width': '6%', 'font-size': '5px',
                },
                {
                    'data': 'amount', 'render': function (data, type, row) {
                        return `<a>${row.amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</a>`;
                    }, 'width': '5%', 'className': "text-right", 'font-size': '5px'
                },
                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        var statuss = document.getElementById("statuss").innerHTML
                        if (statuss != "false") {
                            return ``
                        }
                        else {
                            return `<a class="fa fa-pencil" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=dataitem('${data}')></a>
                                    <a class="fa fa-trash" style="color:red" onclick=Remove(this)> </a>
                                    <a class="fa fa-plus-circle" style="color:green" data-toggle="modal" data-target="#exampleModal" onclick=insertRow(this)> </a>`;
                        }
                    },
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
function viewSO(sono) {
    document.getElementById("saveSO").innerHTML = "Update";
    $.ajax({
        url: '/api/SO/viewSO?sono=' + sono,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById('sono').value = data.data.soNo;
                document.getElementById('sonodigit').value = data.data.soNodigit;
                document.getElementById('Voucherdate').value = moment(data.data.soDate).format('yyyy-MM-DDThh:mm');
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

function saleOrderNo() {
    $.ajax({
        type: 'GET',
        url: "api/SO/SONO",
        success: function (data) {
            if (data.success) {
                document.getElementById("sono").value = data.data;
                document.getElementById("sonodigit").innerHTML = data.data;
            }
        }
    });
}

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('Voucherdate').value = now.toISOString().slice(0, 16);
    document.getElementById('quotdate').value = now.toISOString().slice(0, 16);
    document.getElementById('enqdate').value = now.toISOString().slice(0, 16);
    document.getElementById('podate').value = now.toISOString().slice(0, 16);
    document.getElementById('deliverydate').value = now.toISOString().slice(0, 16);
    document.getElementById('pidate').value = now.toISOString().slice(0, 16);
}

function convertToSO(pino) {
    $.ajax({
        url: '/api/SO/Check?pino=' + pino,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.status == true) {
                if (data.datafrom == "permanant") {
                    viewSO(data.data);
                }
                else {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "A Previous SO is available!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, Resume it!',
                        cancelButtonText: 'New S.O',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            //old pi
                            viewTempSO(data.data.soNodigit)
                        }
                        else {
                            pino = data.data.piNo;
                            //new pi
                            $.ajax({
                                url: '/api/SO/DeleteTempSO?pino=' + pino,
                                type: 'GET',
                                contentType: 'application/json',
                                success: function (data) {
                                    if (data.success == true) {
                                        let url = new URLSearchParams(window.location.search);
                                        let pino = url.get('PINO');
                                        $.ajax({
                                            url: '/api/SO/ConvertToSo?pino=' + pino,
                                            type: 'GET',
                                            contentType: 'application/json',
                                            success: function (data) {
                                                if (data.success == true) {
                                                    viewTempSO(data.data);
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
                    url: '/api/SO/ConvertToSo?pino=' + pino,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data) {
                        viewTempSO(data.data);
                    }
                });
            }

        }
    });

}
function viewTempSO(sonodigit) {
    $.ajax({
        url: '/api/SO/ViewTempSo?sonodigit=' + sonodigit,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                $("#billcompanyname option[value=" + data.data.billCCode + "]").remove();
                $('#billcompanyname').append($("<option selected></option>").val(data.data.billCCode).html(data.data.billCompanyname));
                document.getElementById('billGST').value = data.data.billGST;
                document.getElementById('billSTATE').value = data.data.billState;
                print_city('billCITY', data.data.billstatecode);
                $('#billCITY').append($("<option selected></option>").val(data.data.billCity).html(data.data.billCity));
                document.getElementById('billCITY').value = data.data.billCity;
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
                document.getElementById("quotdate").value = data.data.qtnDate;

                document.getElementById('pono').value = data.data.poNo;
                document.getElementById('podate').value = data.data.poDate;

                document.getElementById('pinumber').value = data.data.piNo;
                document.getElementById('pidate').value = data.data.piDate;

                document.getElementById('referencecode').value = data.data.amendno;
                document.getElementById('enqdate').value = data.data.amendDAte;

                document.getElementById('LFLabel').value = data.data.label1;
                document.getElementById('LFCharges').value = data.data.input1;
                document.getElementById('FrieghtLabel').value = data.data.label2;
                document.getElementById('Freightcharges').value = data.data.input2;
                document.getElementById('frieghtTypelabel').value = data.data.label4;
                document.getElementById('frieghttype').value = data.data.input4;
                document.getElementById('balancelabel').value = data.data.label3;
                document.getElementById('balance').value = data.data.input3;
                document.getElementById('tempsonumber').value = data.data.soNodigit;

                var finalamt = data.data.amount;
                finalamt = finalamt.toFixed(2);
                finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('finalamt').innerHTML = finalamt;
                document.getElementById('tempsave').innerHTML = "Update";


            }
            refreshtable(sonodigit)
        }
    })
}

function filldetails(type, ccode) {
    $.ajax({
        url: '/api/SO/fillcompanydata?ccode=' + ccode,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                if (type == "bill") {
                    if (data.data.gSt == null) {
                        document.getElementById('billGST').value = "";
                        document.getElementById('billSTATE').value = "";
                        print_city('billCITY', data.data.statecode);
                        document.getElementById('billCITY').value = "";
                        document.getElementById('billcp').value = "";
                        document.getElementById('billaddress').value = "";
                        document.getElementById('billmobile').value = "";
                        document.getElementById('billmail').value = "";
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `GST is Missing! Go and Update first in Customer Data`,
                        })

                    }
                    else {
                        document.getElementById('billGST').value = data.data.gSt;
                        document.getElementById('billSTATE').value = data.data.state;
                        print_city('billCITY', data.data.statecode);
                        document.getElementById('billCITY').value = data.data.city;
                        document.getElementById('billcp').value = data.data.contactPerson;
                        document.getElementById('billaddress').value = data.data.address;
                        document.getElementById('billmobile').value = data.data.phone;
                        document.getElementById('billmail').value = data.data.email;
                        document.getElementById("billGST").style.borderColor = "Black";
                        document.getElementById("billCITY").style.borderColor = "Black";
                        document.getElementById("billSTATE").style.borderColor = "Black";
                        document.getElementById("billgstlabel").style.color = "Black";
                        document.getElementById("bcitylabel").style.color = "Black";
                        document.getElementById("bstatelabel").style.color = "Black";


                    }

                }
                else {
                    if (data.data.gSt == null) {
                        document.getElementById('consignGST').value = "";
                        document.getElementById('consignSTATE1').value = "";
                        print_city('consignCITY1', data.data.statecode);
                        document.getElementById('consignCITY1').value = "";
                        document.getElementById('consigncp').value = "";
                        document.getElementById('consignaddress').value = "";
                        document.getElementById('consignmobile').value = "";
                        document.getElementById('consignmail').value = "";

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `GST is Missing! Go and Update first in Customer Data`,
                        })

                    } else {

                        document.getElementById('consignGST').value = data.data.gSt;
                        document.getElementById('consignSTATE1').value = data.data.state;
                        print_city('consignCITY1', data.data.statecode);
                        document.getElementById('consignCITY1').value = data.data.city;
                        document.getElementById('consigncp').value = data.data.contactPerson;
                        document.getElementById('consignaddress').value = data.data.address;
                        document.getElementById('consignmobile').value = data.data.phone;
                        document.getElementById('consignmail').value = data.data.email;

                        document.getElementById("consignGST").style.borderColor = "Black";
                        document.getElementById("consignCITY1").style.borderColor = "Black";
                        document.getElementById("consignSTATE1").style.borderColor = "Black";
                        document.getElementById("consigngstlabel").style.color = "Black";
                        document.getElementById("ccitylabel").style.color = "Black";
                        document.getElementById("cstatelabel").style.color = "Black";
                    }

                }
            }
        }
    });
}

function samedata() {
    var x = $("#datacheck").is(":checked");
    if (x == true) {

        $("#consigncompanyname option[value=" + document.getElementById('billcompanyname').value + "]").remove();
        $('#consigncompanyname').append($("<option selected></option>").val(document.getElementById('billcompanyname').value).html(document.getElementById('billcompanyname').selectedOptions[0].text));
        document.getElementById('consigncompanyname').value = document.getElementById('billcompanyname').value
        document.getElementById('consignGST').value = document.getElementById('billGST').value;
        document.getElementById('consignSTATE1').value = document.getElementById('billSTATE').value;
        var indess = document.getElementById("consignSTATE1").selectedIndex;
        print_city('consignCITY1', indess);
        document.getElementById('consignCITY1').value = document.getElementById('billCITY').value;
        document.getElementById('consigncp').value = document.getElementById('billcp').value;
        document.getElementById('consignaddress').value = document.getElementById('billaddress').value;
        document.getElementById('consignmobile').value = document.getElementById('billmobile').value;
        document.getElementById('consignmail').value = document.getElementById('billmail').value;
        $('consigndata *').prop('disabled', true);


    }
    else {

    }
}

function fillitemdata(itemno) {
    var savebutton = document.getElementById("saveSO").innerHTML;
    var pino = document.getElementById("pinumber").value;
    var sono = document.getElementById("sono").value;
    if (savebutton == "Save") {
        var type = "temp";
    }
    else {
        var type = "permanant";
    }
    $.ajax({
        'url': '/api/SO/getitembyid',
        'type': 'GET',
        'contentType': 'application/json',
        data:
        {
            itemid: itemno,
            type: type,
            pino: pino,
            sono: sono,
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
                                                if (text != null) {
                                                    const myArray = text.split("/");
                                                    $('#txtMake').val(myArray);
                                                }
                                                $("#txtMake").select2();

                                            }
                                        }
                                    });
                                    /*$("#txtClass").select2();*/
                                    $("#txtName").select2();
                                    /*$("#txtClass").attr("size", "4");*/
                                }
                            }
                        }

                    });
                    $("#txtSize").select2();
                }
                $("#txtUnit option[value=" + data.data.unitid + "]").remove();
                $('#txtUnit').append($("<option selected></option>").val(data.data.unitid).html(data.data.qtyunit));
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

function AddNewitem() {
    var txtName = document.getElementById("txtName").selectedOptions[0].text;
    if (txtName == 0) txtName = "";

    var txtUnit = document.getElementById("txtUnit").selectedOptions[0].text;
    var unitType = document.getElementById("Unittype").selectedOptions[0].text;
    var unitid = document.getElementById("txtUnit").value;



    if (txtName != "" && txtUnit != "Select") {
        /* var altname = document.getElementById("alternatename").value;*/
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

        /*var altlass = document.getElementById("alternateclass").value;*/
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
        var pino = document.getElementById('pinumber').value;

        var sono = document.getElementById("sono").value;
        var sonodigit = document.getElementById("sonodigit").innerHTML;
        var saveSO = document.getElementById("saveSO").innerHTML;
        if (saveSO == "Save") {
            var sonodigit = document.getElementById("tempsonumber").value;
        }
        else {
            var sonodigit = document.getElementById("sonodigit").value;
        }
        if (txtMake == "--Select--") {
            txtMake = "";
        }
        if (txtMake != "") {
            var savebutton = document.getElementById("saveebutton1").innerHTML;
            if (savebutton == "Save") {
                var itemno = 0;
                if (saveSO == "Save") {
                    var url = "api/SO/AddNewTempItem";
                }
                else {
                    var url = "api/SO/AddNewItem";
                }
            }
            else if (savebutton == "Insert") {
                var itemno = document.getElementById("itemid").value;
                if (saveSO == "Save") {
                    var url = "api/SO/InsertTempItem";
                }
                else {
                    var url = "api/SO/InsertItem";
                }
            }
            else {
                var itemno = document.getElementById("itemid").value;
                if (saveSO == "Save") {
                    var url = "api/SO/UpdateTempItem";
                }
                else {
                    var url = "api/SO/UpdateItem";
                }
            }
            $.ajax({
                type: 'Post',
                url: url,
                data:
                {
                    Sono: sono,
                    Sonodigit: sonodigit,
                    pino: pino,
                    itemid: itemno,
                    pname: txtName,
                    psize: txtSize,
                    pclass: txtClass,
                    pmake: txttmake,
                    rate: txtPrice,
                    rateunit: txtUnit,
                    discount: txtDisc,
                    discountrate: txtDiscPrice,
                    qty: txtReqdQty,
                    amount: txtAmount,
                    remarks: txtRemarks,
                    unitType: unitType

                },
                success: function (data) {
                    if (data.success) {
                        var finalamt = data.data;
                        finalamt = finalamt.toFixed(2);
                        finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        document.getElementById('finalamt').innerHTML = finalamt;
                        var tempbutton = document.getElementById('tempsave').innerHTML;
                        if (tempbutton == "Save") {
                            refreshtable(sonodigit);
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
            document.getElementById('currentStock').innerHTML = "";
            document.getElementById('saveebutton1').innerHTML = "Save";
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Make is Missing!',
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

function addcompanydetails() {

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
    var sodate = document.getElementById("Voucherdate").value;
    var sono = document.getElementById("sono").value;

    var pono = document.getElementById("pono").value;
    var podate = document.getElementById("podate").value;
    var tcs = document.getElementById("tcs").value;
    var tax = document.getElementById("tax").value;
    var ld = document.getElementById("ld").checked;
    var deliverydate = document.getElementById("deliverydate").value;

    var lfchargeslabel = document.getElementById("LFLabel").value;
    var lfcharges = document.getElementById("LFCharges").value;
    var frieghtchargeslabel = document.getElementById("FrieghtLabel").value;
    var freightcharges = document.getElementById("Freightcharges").value;
    var previousbalancelabel = document.getElementById("balancelabel").value;
    var previousbalance = document.getElementById("balance").value;
    var freighttypelabel = document.getElementById("frieghtTypelabel").value;
    var frieghttype = document.getElementById("frieghttype").value;
    var ordertype = document.getElementById("ordertype").value;
    var note = document.getElementById("note").value;
    var sodate = document.getElementById("Voucherdate").value;
    var amount = document.getElementById("finalamt").innerHTML;

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
    var tempsavebutton = document.getElementById('tempsave').innerHTML;
    var savebutton = document.getElementById('saveSO').innerHTML;
    if (savebutton == "Save") {
        url = "api/SO/Addtempcompanydetails?type=" + tempsavebutton;
        var sonodigit = document.getElementById("tempsonumber").value;
    }
    else {
        url = "api/SO/Updatecompanydetails";
        var sonodigit = document.getElementById("sonodigit").innerHTML;
    }
    $.ajax({
        type: 'Post',
        url: url,
        data: {
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

            SONo: sono,
            SONodigit: sonodigit,
            SODate: sodate,

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

        },
        success: function (data) {
            if (data.success) {
                var tempsave = document.getElementById('tempsave').innerHTML;
                if (tempsave == "Save") {
                    document.getElementById('tempsonumber').value = data.data;
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
        var sodate = document.getElementById("Voucherdate").value;
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
        var sodate = document.getElementById("Voucherdate").value;
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

function Remove(button) {
    var row = $(button).closest("TR");
    var itmno = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete: " + itmno)) {
        var sono = document.getElementById("sono").value;
        var pino = document.getElementById("pinumber").value;
        var savebutton = document.getElementById("saveSO").innerHTML;
        var sonodigit = document.getElementById('tempsonumber').value;
        if (savebutton == "Save") {
            url = "api/SO/DeleteTempItem";
        }
        else {
            url = "api/SO/DeleteItem";
        }

        $.ajax({
            type: 'Delete',
            url: url,
            data:
            {
                sono: sono,
                itmno: itmno,
                pino: pino,
                sonodigit: sonodigit,
            },
            success: function (data) {
                if (data.success == true) {
                    var finalamt = data.data;
                    finalamt = finalamt.toFixed(2);
                    finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    document.getElementById('finalamt').innerHTML = finalamt;
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

function clearall() {
    var quotnodigit = document.getElementById("tempqtno").value;
    deletetempquotation(quotnodigit);
    window.location.href = "../Salesquotation";
}

function newSO() {

    $.ajax({
        url: '/api/SO/NewSO',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("statuss").innerHTML = "false";
                window.location.href = "../SaleOrder";
            }
        }
    });


}

function jumptoPrevious() {
    var sonodigit = document.getElementById("sonodigit").value;
    $.ajax({
        url: '/api/SO/jumptoPrevious?sonodigit=' + sonodigit,
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
                viewSO(data.data);
            }
        }
    });
}
function jumptoNext() {
    var sonodigit = document.getElementById("sonodigit").value;
    $.ajax({
        url: '/api/SO/jumptoNext?sonodigit=' + sonodigit,
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
                viewSO(data.data);
            }


        }
    });
}

function attachments() {

    var voucherno = document.getElementById("sono").value;
    var vouchername = "SALE_ORDER";
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
    var voucherno = document.getElementById('sono').value;
    var datetime = document.getElementById('Voucherdate').value;
    if (File1 != null) {

        var formData = new FormData();
        for (i = 0; i < File1.length; i++) {
            formData.append('Name1', File1[i]);
            formData.append('vouchername', "SALE_ORDER");
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
            var vouchername = "SALE_ORDER";
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
                        counter();
                        datatable2.ajax.reload();
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

    var voucherno = document.getElementById("sono").value;
    var vouchername = "SALE_ORDER";
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
function printSaleOrder() {
    var idd = document.getElementById("sono").value;
    window.open('../SaleOrderPrint?idd=' + idd, '_blank');
}

function QAPSave() {
    var type = document.getElementById("saveSO").innerHTML;


    if (type == "Save") {
        Swal.fire({
            title: `QAP/INSPECTION REQUIRED`,

            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                '<a class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" style="color: black; background-color: white;"  data-toggle="modal" data-target="#QAPModel">YES</a>',
            cancelButtonText:
                '<a class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" style="color: black; background-color: white;" onclick="QAPNO()">NO</a>',

        })
    }
    else {
        var bt = document.getElementById("hiddenbtn");
        bt.click();
        fetchQAPDetails()
    }
}

function QAPNO() {
    document.getElementById("saveButton").style.display = "block"
    document.getElementById("qapInspection").style.display = "none"

    document.getElementById("ispectionClause").value = "";
    document.getElementById("epRequired").value = "";
    document.getElementById("ecbSide").value = "";
    document.getElementById("caliCertificate").value = "";
    document.getElementById("varnshingUnvarshing").value = "";
    document.getElementById("mtcno").value = "";
    document.getElementById("qacRemarks").value = "";
}

function QAPInspectionSave() {
    var caliCertificate = document.getElementById("caliCertificate").value;
    if (caliCertificate != "") {
        permanentsave()

        /*$(".close").click();*/
    }
    else {
        swal.fire("Calibration Certficate is Required!")
    }
}

function fetchQAPDetails() {
    var sono = document.getElementById("sono").value;
    $.ajax({
        'url': '/api/SO/FetchQapDetails?SONO=' + sono,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            $("#ispectionClause").val(data.data.inspectionClause);
            $("#epRequired").val(data.data.endProtectionRequired);
            $("#ecbSide").val(data.data.endCapBothSide);
            $("#caliCertificate").val(data.data.calibrationCertificate);
            $("#varnshingUnvarshing").val(data.data.endFinshingRequired);
            $("#mtcno").val(data.data.mtc);
            $("#qacRemarks").val(data.data.qacRemarks);
            document.getElementById("qapAttchmentsdiv").style.display = "block";
            document.getElementById("QapSavebtn").innerHTML = "Update"
        }
    })
}

function QapAttachments() {
    let File1 = $("#QapFile")[0].files;
    let url = new URLSearchParams(window.location.search);
    var fu1 = document.getElementById("QapFile").value;
    var fu2 = fu1.substring(fu1.lastIndexOf('/') + 1);
    var voucherno = document.getElementById('sono').value;
    var datetime = document.getElementById('Voucherdate').value;
    if (File1 != null) {

        var formData = new FormData();
        for (i = 0; i < File1.length; i++) {
            formData.append('Name1', File1[i]);
            formData.append('vouchername', "SALE_ORDER_QAP");
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
                    document.getElementById("QapFile").value = "";


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


function QapAttachmentsList() {

    var voucherno = document.getElementById("sono").value;
    var vouchername = "SALE_ORDER_QAP";
    datatable = $("#QAPattachmentsTable").DataTable({
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
                            <a class="btn btn-danger btn-sm" style="color:white" onclick=DeleteQapAttachments("${row.sr}")> <i class="fa fa-trash"></i>Delete</a>
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
    datatable.on('order.dt ', function () {
        datatable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}


function DeleteQapAttachments(id) {
    Swal.fire({
        title: 'Are your sure you want to delete?',
        text: "Once deleted, you'll be not able to recover file.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            var vouchername = "SALE_ORDER_QAP";
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

                        $('#QAPattachmentsTable').DataTable().ajax.reload();

                    }
                    else {
                        Swal.fire(data.message, '', 'error')

                    }
                }
            })
        }
    })
}


function showhideDD() {
    $(".dd").toggle();
}

function getsaleOrderStock() {

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

    var edate = document.getElementById("Voucherdate").value;
    $.ajax({
        type: 'Post',
        url: "api/SO/Currentstock",
        data: {
            pname: pname,
            Psize: psize,
            Pclass: pclass,
            Pmake: Pmake,
            ddate: edate,
        },
        success: function (data) {
            if (data.success == true) {
                var unit = document.getElementById("txtUnit").selectedOptions[0].text;
                document.getElementById("currentStock").innerHTML = data.currentStock.toFixed(2) + "  " + unit;
            }
            else {

            }
        }
    })
}