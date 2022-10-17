var datatable;
var frm = "";
$(document).ready(function () {
    document.title = "Performa Invoice";
    $('#loading').hide();
    SearchFunction()
    fillcompany1('consigncompanyname', 'Customer');
    fillcompany1('billcompanyname', 'Customer');
    print_state("billSTATE");
    print_state("consignSTATE1");
    let url = new URLSearchParams(window.location.search);
    let quotno = url.get('quotno');
    let pino = url.get('pino');
    currentTime()
    $(".dd").hide();
    if (quotno != null) {
        convertToPI(quotno);
        frm = "SQ";
        performaInvoiceNo();
    }
    else if (pino != null) {
        viewPI(pino);
    }
    else {
        frm = "NEW";
        checking();
        performaInvoiceNo();
    }
    $("#STATE").select2();
    $("#STATE1").select2();
    $("#CITY").select2();
    $("#CITY1").select2();

    $("#printbutton").click(function () {
        var idd = document.getElementById('pino').value;
        window.open('../PerformaInvoicePrint?idd=' + idd, '_blank');
    });
});
function saveed(event) {
    let key = event.which;
    if (key == 13) {
        addcompanydetails();
    }
}

function checking() {
    $.ajax({
        url: '/api/PI/Checkbyuser',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.status == true) {
                var quotno = data.data.quotno;
                viewTempPi(quotno);
            }
        }
    })
}

function SearchFunction() {
    $('#searchList').on('dblclick', 'tr', function () {
        $(this).toggleClass('activee');
        var row = $(this).closest("TR");
        var dono = $("TD", row).eq(2).html();
        viewPI(dono)
    });
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('fromdate').value = dateStringWithTime;
    document.getElementById('todate').value = dateStringWithTime;
    /* window.onbeforeunload = function (e) {
         if (document.getElementById("permanantbt").style.display == "block") {
             var e = e || window.event;
             if (e) e.returnValue = 'Browser is being closed, is it okay?';//for IE & Firefox
             return 'Browser is being closed, is it okay?';// for Safari and Chrome
         }
     };*/

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

function convertToPI(quotno) {

    $.ajax({
        url: '/api/PI/Check?quotno=' + quotno,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.status == true) {
                if (data.datafrom == "permanant") {
                    var pino = data.data;
                    document.getElementById("savePI").innerHTML = "Update";
                    viewPI(pino);
                }
                else {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "A Previous PI is available!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, Resume it!',
                        cancelButtonText: 'New P.I',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            //old pi
                            var quotno = data.data.pinodigit;
                            viewTempPi(quotno);
                        }
                        else {
                            quotno = data.data.pinodigit;
                            //new pi
                            $.ajax({
                                url: '/api/PI/DeleteTempPI?quotno=' + quotno,
                                type: 'GET',
                                contentType: 'application/json',
                                success: function (data) {
                                    if (data.success == true) {
                                        let url = new URLSearchParams(window.location.search);
                                        let quotno = url.get('quotno');
                                        $.ajax({
                                            url: '/api/PI/ConvertToPi?quotno=' + quotno,
                                            type: 'GET',
                                            contentType: 'application/json',
                                            success: function (data) {
                                                if (data.success == true) {
                                                    document.getElementById("temppinumber").value = data.data;
                                                    document.getElementById("tempsave").innerHTML = "Update";
                                                    viewTempPi(data.data);
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }

            }
            else {
                $.ajax({
                    url: '/api/PI/ConvertToPi?quotno=' + quotno,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.success == true) {
                            document.getElementById("temppinumber").value = data.data;
                            document.getElementById("tempsave").innerHTML = "Update";
                            viewTempPi(data.data);


                        }

                    }

                })
            }
        }
    });
}

function viewPI(pino) {
    document.getElementById("savePI").innerHTML = "Update";
    $.ajax({
        url: '/api/PI/viewPI?pino=' + pino,
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
                /*document.getElementById('billCITY').value = data.data.billCity;*/
                /*$("#billCITY").val(data.data.billCity);*/
                document.getElementById('billcp').value = data.data.billContactperson;
                document.getElementById('billaddress').value = data.data.billAddress;
                document.getElementById('billmobile').value = data.data.billPhone;
                document.getElementById('billmail').value = data.data.billEmail;
                document.getElementById('Note').value = data.data.note;

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
                document.getElementById('podate').value = moment(data.data.poDate).format('yyyy-MM-DDThh:mm');
                document.getElementById('enqdate').value = moment(data.data.amendDAte).format('yyyy-MM-DDThh:mm');
                document.getElementById("quotdate").value = moment(data.data.qtnDate).format('yyyy-MM-DDThh:mm');
                document.getElementById('pidate').value = moment(data.data.date).format('yyyy-MM-DDThh:mm');
                document.getElementById('quotdate').value = moment(data.data.qtnDate).format('yyyy-MM-DDThh:mm');

                document.getElementById('pino').value = data.data.piNo;
                document.getElementById('pinodigit').value = data.data.piNodigit;
                document.getElementById('quotationno').value = data.data.quotno;

                document.getElementById('referencecode').value = data.data.amendno;



                document.getElementById('LFLabel').value = data.data.label1;
                document.getElementById('LFCharges').value = data.data.input1;
                document.getElementById('FrieghtLabel').value = data.data.label2;
                document.getElementById('Freightcharges').value = data.data.input2;
                document.getElementById('frieghtTypelabel').value = data.data.label4;
                document.getElementById('frieghttype').value = data.data.input4;
                document.getElementById('balancelabel').value = data.data.label3;
                document.getElementById('balance').value = data.data.input3;


                var finalamt = data.data.amount;
                finalamt = finalamt.toFixed(2);
                finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('Totalamount').innerHTML = finalamt;
                document.getElementById("printbton").style.display = "block";
                refreshtable(pino)
            } else {

            }

        }
    })


}

function viewTempPi(pinodigit) {
    $.ajax({
        url: '/api/PI/ViewTempPi?pinodigit=' + pinodigit,
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

                var finalamt = data.data.amount;
                finalamt = finalamt.toFixed(2);
                finalamt = finalamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('Totalamount').innerHTML = finalamt;
                document.getElementById("temppinumber").value = data.data.pinodigit
                document.getElementById("tempsave").innerHTML = "Update";
            }
            refreshtable(pinodigit);
        }
    })
}

function refreshtable(quotno) {

    var savebutton = document.getElementById("savePI").innerHTML;
    if (savebutton == "Save") {
        var url = '/api/PI/viewTempitem?pinodigit=' + quotno;
    }
    else {
        var url = '/api/PI/viewPiItem?pino=' + quotno;
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
                                if (row.pclass == null) {
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
                    }, 'width': '50%', 'font-size': '10px', 'font-size': '90% ', 'font-family': 'Tahoma',
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
                { 'data': 'discountrate', 'defaultContent': '', 'width': '10%', 'className': "text-right" },
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

function performaInvoiceNo() {
    $.ajax({
        type: 'GET',
        url: "api/PI/PINO",
        success: function (data) {
            if (data.success) {
                document.getElementById("pino").value = data.data;
                document.getElementById("temppinumber").value = data.data1;
            }
        }
    });
}

function currentTime() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('pidate').value = now.toISOString().slice(0, 16);
    document.getElementById('enqdate').value = now.toISOString().slice(0, 16);
    document.getElementById('podate').value = now.toISOString().slice(0, 16);
    document.getElementById('deliverydate').value = now.toISOString().slice(0, 16);
}

function filldetails(type, ccode) {
    $.ajax({
        url: '/api/PI/fillcompanydata?ccode=' + ccode,
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
    var savebutton = document.getElementById("savePI").innerHTML;
    var quotno = document.getElementById("quotationno").value;
    var pino = document.getElementById("pino").value;
    if (savebutton == "Save") {
        var type = "temp";
    }
    else {
        var type = "permanant";
    }
    $.ajax({
        'url': '/api/PI/getitembyid',
        'type': 'GET',
        'contentType': 'application/json',
        data:
        {
            itemid: itemno,
            type: type,
            quotno: quotno,
            pino: pino,
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
                                                const myArray = text.split("/");
                                                $('#txtMake').val(myArray);
                                                $("#txtMake").select2();

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


function addcompanydetails() {

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

    var bcity = document.getElementById("billCITY").value;
    if (bcity != "") {
        var bcity = document.getElementById("billCITY").selectedOptions[0].text;
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
    var pino = document.getElementById("pino").value;

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
    var amount = document.getElementById("Totalamount").innerHTML;

    var savebutton = document.getElementById("savePI").innerHTML;
    var tempsave = document.getElementById("tempsave").innerHTML;
    if (savebutton == "Save") {
        var url = "api/PI/Addtempcompanydetails?type=" + tempsave;
        var pinodigit = document.getElementById("temppinumber").value;
    }
    else {
        var url = "api/PI/Updatecompanydetails";
        var pinodigit = document.getElementById("pinodigit").value;
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
            date: pidate,
            Pinodigit: pinodigit,

            PONo: pono,
            PODate: podate,
            Tcs: tcs,
            Tax: tax,
            LD: ld,
            ordertype: ordertype,
            DeliveryDate: deliverydate,

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

                document.getElementById('temppinumber').value = data.data;
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
        var pino = document.getElementById("pino").value;

        var savebutton = document.getElementById("saveebutton1").innerHTML;
        var savePI = document.getElementById("savePI").innerHTML;
        if (savePI == "Save") {
            var pinodigit = document.getElementById("temppinumber").value;
        }
        else {
            var pinodigit = document.getElementById("pinodigit").value;
        }

        if (savebutton == "Save") {
            var itemno = 0;
            if (savePI == "Save") {
                var url = "api/PI/AddNewTempItem";
            }
            else {
                var url = "api/PI/AddNewItem";
            }
        }
        else if (savebutton == "Insert") {
            var itemno = document.getElementById("itemid").value;
            if (savePI == "Save") {
                var url = "api/PI/InsertTempItem";
            }
            else {
                var url = "api/PI/InsertItem";
            }
        }
        else {
            var itemno = document.getElementById("itemid").value;
            if (savePI == "Save") {
                var url = "api/PI/UpdateTempItem";
            }
            else {
                var url = "api/PI/UpdateItem";
            }
        }
        $.ajax({
            type: 'Post',
            url: url,
            data:
            {
                Pino: pino,
                Pinodigit: pinodigit,
                quotno: quotno,
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
                    document.getElementById('Totalamount').innerHTML = finalamt;
                    $('#ItemTable').DataTable().ajax.reload();

                  /*  datatable.ajax.reload();*/

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

function permanentsave() {
    var pinodigit = document.getElementById("pinodigit").value;
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
    var pino = document.getElementById("pino").value;

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
    var amount = document.getElementById("Totalamount").innerHTML;
    var temppino = document.getElementById("temppinumber").value;
    var note = document.getElementById("Note").value;
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

        var savebutton = document.getElementById("savePI").innerHTML;
        if (savebutton == "Save") {
            url = "api/PI/PermanantSave?temppino=" + temppino;
        }
        else {
            url = "api/PI/PermanantUpdate";
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
                date: pidate,
                Pinodigit: pinodigit,

                PONo: pono,
                PODate: podate,
                Tcs: tcs,
                Tax: tax,
                LD: ld,
                Note: note,
                ordertype: ordertype,
                DeliveryDate: deliverydate,

                Label1: lfchargeslabel,
                Input1: lfcharges,
                Label2: frieghtchargeslabel,
                Input2: freightcharges,
                Label3: previousbalancelabel,
                Input3: previousbalance,
                Label4: freighttypelabel,
                Input4: frieghttype,
                Amount: amount,
                frm: frm,

            },
            success: function (data) {
                if (data.success == true) {
                    var savebutton = document.getElementById("savePI").innerHTML;
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

                    if (savebutton == "Save") {
                        document.getElementById("pino").value = data.data;
                        document.getElementById("savePI").innerHTML = "Update";
                        document.getElementById("printbton").style.display = "block";
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

                }
                else {
                    Swal.fire(data.message, '', 'info')
                }
            }
        });

    }



}

function Remove(button) {
    var row = $(button).closest("TR");
    var itmno = $("TD", row).eq(0).html();
    if (confirm("Do you want to delete: " + itmno)) {
        var pino = document.getElementById("pino").value;
        var quotno = document.getElementById("quotationno").value;
        var pinodigit = document.getElementById("temppinumber").value;
        var type = document.getElementById("savePI").innerHTML;
        $.ajax({
            type: 'Delete',
            url: "api/PI/DeleteItem",
            data:
            {
                type: type,
                pino: pino,
                itmno: itmno,
                quotno: quotno,
                pinodigit: pinodigit,
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
};
function jumptoPrevious() {
    var pinodigit = document.getElementById("pinodigit").value;
    $.ajax({
        url: '/api/PI/jumptoPrevious?pinodigit=' + pinodigit,
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
                viewPI(data.data);
            }
        }
    });
}
function jumptoNext() {
    var pinodigit = document.getElementById("pinodigit").value;
    $.ajax({
        url: '/api/PI/jumptoNext?pinodigit=' + pinodigit,
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
                viewPI(data.data);
            }


        }
    });
}
function searchingReport() {
    $("#searchReportDiv").show(150);
    var partynamecheck = document.getElementById("partynamecheck").checked;
    var QTNO = document.getElementById("QuotNoO").checked;
    var consignnamecheck = document.getElementById("consignnamecheck").checked;
    var pinoCheck = document.getElementById("pinoCheck").checked;
    var periodCheck = document.getElementById("periodcheck").checked;


    if (partynamecheck == true) {
        var searchtype = "RECEINTPARTY";
    }
    else if (QTNO == true) {
        var searchtype = "QUOTNO";
    }
    else if (consignnamecheck == true) {
        var searchtype = "CONSIGNPARTY";
    }
    else if (pinoCheck == true) {
        var searchtype = "PINO";
    }
    else {
        var searchtype = "PERIOD";
    }

    var frmdate = document.getElementById("fromdate").value;
    var todate = document.getElementById("todate").value;
    var searchValue = document.getElementById("SearchRecordInput").value;

    datatable = $("#searchList").DataTable({
        ajax: {
            'url': "api/PI/SearchPI",
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
                { 'data': 'piNo', 'defaultContent': '', 'width': '10%' },
                { 'data': 'billCompanyname', 'defaultContent': '', 'width': '80%' },

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

function showhideDD() {
    $(".dd").toggle();
}