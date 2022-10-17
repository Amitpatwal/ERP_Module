
$(document).ready(function () {

    $("#resetitem").click(function () {
        cleardataitem();
    });

})
function dataitem(itemno) {
    if (itemno != null && itemno != "" && itemno != "0") {
        $('#txtName').empty();
        loadItems()
        fillitemdata(itemno)
    }
    else {
        cleardataitem()
    }
}

function alternate(hid, rename) {
    if (document.getElementById(hid).hidden == true) {
        document.getElementById(hid).hidden = false;
        document.getElementById(rename).innerHTML = '- Alternate';
    }
    else {
        document.getElementById(hid).hidden = true;
        document.getElementById(rename).innerHTML = '+ Alternate';
    }
}

function cleardataitem() {
    $('#txtName').empty();
    $('#txtSize').empty();
    $('#txtClass').empty();
    $('#txtMake').empty();
    $('#txtUnit').empty();
    $('#txtDiscPrice').empty();
    document.getElementById("unitcolor").style.color = "black";
    document.getElementById("namecolor").style.color = "black";
    document.getElementById('txtUnit').value = "";
    document.getElementById('txtPrice').value = "";
    document.getElementById('txtDiscPrice').value = "";
    document.getElementById('txtDisc').value = "";
    document.getElementById('txtReqdQty').value = "";
    document.getElementById('txtRemarks').value = "";
    document.getElementById('txtAmount').value = "";
    document.getElementById('saveebutton1').innerHTML = "Save";
    loadItems();
}

function loadItems() {
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
            document.getElementById("txtName").focus();
        }
    })
    /* $.ajax({
         type: 'Post',
         url: "api/itemdatatable/GetTable",
         data: { type: "unit" },
         success: function (data) {
             if (data.success) {
                 $('#txtUnit').empty();
                 $('#txtUnit').append("<option value='0'>Select</option>");
                 $.each(data.data, function (key, value) {
                     $('#txtUnit').append($("<option></option>").val(value.id).html(value.desc));
                 });
             }
             $("#txtUnit").select2();
            
         }
     })*/
    document.getElementById("txtName").focus();
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/GetTable",
        data: { type: "godown" },
        success: function (data) {
            if (data.success) {
                $('#txtWarehouse').empty();
                $('#txtWarehouse').append("<option value='0'>Select</option>");
                $.each(data.data, function (key, value) {
                    $('#txtWarehouse').append($("<option></option>").val(value.id).html(value.desc));
                });
            }
            $("#txtUnit").select2();
            document.getElementById("txtName").focus();
        }
    })
    document.getElementById("txtName").focus();
}

function nextfocus(event, nextfocus) {
    let key = event.which;
    if (key == 13) {
        document.getElementById(nextfocus).focus();

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
                document.getElementById("quantityunit").value = data.data.unit;
                if (data.category.altunit != null) {
                    document.getElementById("altqtyy").style.display = "block";
                    document.getElementById("altquantityunit").value = data.category.altunit;
                    var were = data.data.where;
                    var frm = data.data.from
                    var altvalue = frm / were;
                    document.getElementById("altvalue").value = altvalue;

                }
                else {
                    document.getElementById("altqtyy").style.display = "none";
                    document.getElementById("altquantityunit").value = "";
                    document.getElementById("altvalue").value = "";
                }
                if (data.category.weightunit != null) {
                    document.getElementById("itemweight").style.display = "block";
                    document.getElementById("weightunit").value = data.category.weightunit;
                    document.getElementById("weightt").value = data.data.weight;
                }
                else {
                    document.getElementById("itemweight").style.display = "none";
                    document.getElementById("weightunit").value = "";
                    document.getElementById("weightt").value = "";
                }

            }
            else {

                document.getElementById("altqtyy").style.display = "none";
                document.getElementById("itemweight").style.display = "none";
                document.getElementById("weightunit").value = "";
                document.getElementById("altquantityunit").value = "";
                document.getElementById("weightt").value = "";

            }
        }
    })


}
function checkalternateunit1() {
    var pname = document.getElementById("txtName").value;
    var psize = document.getElementById("txtSize").value;
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
                document.getElementById("quantityunit").value = data.category.unit;
                if (data.category.altunit != null) {
                    document.getElementById("altqtyy").style.display = "block";
                    document.getElementById("altquantityunit").value = data.category.altunit;
                    var were = data.data.where;
                    var frm = data.data.from
                    var altvalue = frm / were;
                    document.getElementById("altvalue").value = altvalue;

                }
                else {
                    document.getElementById("altqtyy").style.display = "none";
                    document.getElementById("altquantityunit").value = "";
                    document.getElementById("altvalue").value = "";
                }
                if (data.category.weightunit != null) {
                    document.getElementById("itemweight").style.display = "block";
                    document.getElementById("weightunit").value = data.category.weightunit;
                    document.getElementById("weightt").value = data.data.weight;
                }
                else {
                    document.getElementById("itemweight").style.display = "none";
                    document.getElementById("weightunit").value = "";
                    document.getElementById("weightt").value = "";
                }

            }
            else {

                document.getElementById("altqtyy").style.display = "none";
                document.getElementById("itemweight").style.display = "none";
                document.getElementById("weightunit").value = "";
                document.getElementById("altquantityunit").value = "";

            }
        }
    })


}

function currentstock() {
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
    var GodownLocation = document.getElementById("txtWarehouse").selectedOptions[0].text;
    var Pmake = document.getElementById("txtMake").selectedOptions[0].text;
    var edate = document.getElementById("prdate").value;
    $.ajax({
        type: 'Post',
        url: "api/DO/Currentstock",
        data: {
            pname: pname,
            Psize: psize,
            Pclass: pclass,
            Pmake: Pmake,
            GodownLocation: GodownLocation,
            ddate: edate,
        },
        success: function (data) {
            if (data.success == true) {
                var unit = document.getElementById("quantityunit").value;
                var altunit = document.getElementById("altquantityunit").value;
                if (altunit != "") {
                    document.getElementById("current").innerHTML = data.qty.toFixed(2) + " " + unit + " " + data.altqty + " " + altunit;
                } else {
                    document.getElementById("current").innerHTML = data.qty.toFixed(2) + " " + unit;
                }
            }
            else {
                var unit = document.getElementById("quantityunit").value;
                var altunit = document.getElementById("altquantityunit").value;
                if (altunit != null) {
                    document.getElementById("current").innerHTML = "0 " + unit + " " + "0 " + altunit;
                }
                else {
                    document.getElementById("current").innerHTML = "0 " + unit;
                }

            }
        }
    })
}

function getsize(from) {
    const Pname = document.getElementById("txtName").selectedOptions[0].text;
    $('#txtClass').empty();
    $('#txtUnit').empty();
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
                    $('#txtUnit').empty();

                }
                if (from == "purchase" || from == "out") {
                    checkalternateunit();
                    if (from == "purchase") {
                        clearData()
                    }
                }
            }
        });
      
    }


}

function getclass(from) {
    const Pname = document.getElementById("txtName").selectedOptions[0].text;
    const size = document.getElementById("txtSize").selectedOptions[0].text;
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
                    getunit()
                }
                $("#txtClass").select2();
                if (from == "purchase" || from == "out") {
                    checkalternateunit();
                }
            }

        });
    }


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
                    $('#Unittype').empty();
                    $('#txtUnit').append("<option value='0'>--Select--</option>");
                    $('#Unittype').append("<option value='0'>--Select--</option>");
                    $.each(data.data, function (key, value) {
                        $('#txtUnit').append($("<option></option>").val(value.id).html(value.desc));
                            $('#Unittype').append($("<option></option>").val(value.id).html(value.unitType));
                    });
                }
                $("#txtUnit").select2();

            }

        });
    }
}

function setunitType() {
    document.getElementById("Unittype").value = document.getElementById("txtUnit").value;
}
function price() {
    discprice();
    finalamount();
}

function discprice() {
    var Disc = document.getElementById("txtDisc").value;
    var Price = document.getElementById("txtPrice").value;
    Disc = +Disc / 100;
   /* price * (100 - discount / 100);*/
   /* const discprice = Price * (100 - Disc / 100);*/
    /* const discprice = Price - (Price * (Disc/100));*/
    var discprice = +Price - (+Price * +Disc);
    document.getElementById('txtDiscPrice').value = discprice.toFixed(2);
    
}

function finalamount() {
    discprice()
    const Discprice = document.getElementById("txtDiscPrice").value;
    const reqdQty = document.getElementById("txtReqdQty").value;
    const amount = Discprice * reqdQty;
    document.getElementById('txtAmount').value = amount.toFixed(2);
}

function intt() {

    document.getElementById('txtUnit').value = "";
    document.getElementById('txtPrice').value = "";
    document.getElementById('txtDisc').value = "";
    document.getElementById('txtDiscPrice').value = "";
    document.getElementById('txtReqdQty').value = "";
    document.getElementById('txtRemarks').value = "";
    document.getElementById('txtAmount').value = "";
    document.getElementById('saveebutton1').innerHTML = "Insert";
    document.getElementById('txtName').focus();

}

function insertRow(button) {
    var row = $(button).closest("TR");
    var itmno = $("TD", row).eq(0).html();
    document.getElementById('itemid').value = itmno;
    loadItems()
    intt();
}

function fillcompany(dropdown, type) {
    $.ajax({
        url: '/api/Client/FilldatatablebyType?type=' + type,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                $(dropdown).empty();
                $(dropdown).append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $(dropdown).append($("<option></option>").val(value.customerid).html(value.companyname));
                });
            }
        }
    });
    $(dropdown).select2();
}

function fillcompany1(dropdown, type) {
    $.ajax({
        url: '/api/Client/FilldatatablebyType?type=' + type,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                var code = document.getElementById(dropdown).value;
                $("#" + dropdown).append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    if (code != value.customerid) {
                        $("#" + dropdown).append($("<option></option>").val(value.customerid).html(value.companyname));
                    }
                    else {
                        var demo = 0;
                        demo = demo + 1;
                    }
                    $("#" + dropdown).select2();
                });
            }
        }
    });

}

function calcy(from) {
    var qty = document.getElementById("quantity").value;
    if (document.getElementById("altqtyy").style.display == "block") {
        var vall = document.getElementById("altvalue").value;

        document.getElementById("altquantity").value = Math.round(qty / vall);
    }
    else {
        document.getElementById("altquantity").value = "";
    }
    if (document.getElementById("itemweight").style.display == "block") {
        var weightt = document.getElementById("weightt").value;
        document.getElementById("weight").value = (qty * weightt).toFixed(2);
    }
    else {
        document.getElementById("weight").value = "";
    }

    if (from == "Purchase") {
        OnvalueChange();
    }
}

function getCurrentPrice()
{
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
    var edate = document.getElementById("Voucherdate").value;
    var unit = document.getElementById("txtUnit").value;
    if (unit != "") {
        unit = document.getElementById("txtUnit").selectedOptions[0].text;
    }
    let count = $("#txtMake")[0].selectedOptions.length;
    var txtMake=[];
    for (i = 0; i < count; i++) {
        txtMake[i]= document.getElementById("txtMake").selectedOptions[i].text;
    }

    if (count <= 1) {
        $.ajax({
            type: 'Post',
            url: "api/SO/CurrentPrice",
            data: {
                pname: pname,
                Psize: psize,
                Pclass: pclass,
                pmake1: txtMake,
                date: edate,
                unit: unit,
            },
            success: function (data) {
                if (data.success == true)
                {
                    document.getElementById("txtPrice").value = data.data.amount;
                    document.getElementById("pricedate").innerHTML = "list As of Date :" + moment(data.data.date).format('DD-MMM-YYYY');
                }
                else
                {
                    document.getElementById("pricedate").innerHTML = "No Price List is found";
                    document.getElementById("pricedate").style.color = "red";

                    document.getElementById("txtPrice").value = "";
                }
            }
        })
    } else
    {

        $('#pricelistbutton')[0].click()

         dataTable = $("#PriceListTable").DataTable({
            ajax: {
                 'url': 'api/SO/CurrentPrice',
                 'type': 'GET',
                 'data': {
                    pname: pname,
                    Psize: psize,
                    Pclass: pclass,
                    pmake1: txtMake,
                    date: edate,
                    unit: unit
                 },
                 'contentType': 'application/json',
            },
            columns: [
                { 'data': null, 'defaultContent': '-', 'width': '.5%' },
                {
                    'data': 'date', 'render': function (data) {
                        var date = moment(data).format('DD-MMM-YYYY');
                        return `<span>${date}</span>`;
                    }, 'width': '5%', 'font-size': '6px'
                },
                { 'data': 'make', 'defaultContent': '-', 'width': '10%' },
                { 'data': 'price', 'defaultContent': '-', 'width': '10%' },
            ],
            "bDestroy": true,
            "paging": false,
            "searching": false,
            "ordering": true,
            "info": false,
            "autoWidth": false,
            language: {
                searchPlaceholder: "Search records",
                emptyTable: "No data found",
                width: '100%',
            },
        });
        dataTable.on('order.dt', function () {
            dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();
    }
    
  
}

