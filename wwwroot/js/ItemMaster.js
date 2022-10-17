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
$(document).ready(function () {
    loaddata();
    $("#pname").select2();
    $("#size").select2();
    $("#Class").select2();
    $("#category").select2();
    $("#brand").select2();
    $("#location").select2();

});

function hideshowunit() {
    $("#altunitdiv").collapse('toggle');
}

function hideshowweight() {
    $("#weightunitdiv").collapse('toggle');
}

function WarningUnit() {


   
}

function hideshowlow() {
    $("#multiCollapseExample13").collapse('toggle');
}
function viewaddbutton() {
    var qty = document.getElementById('opQty').value;
    if (qty > 0) {
        document.getElementById("addbutton").style.display = "block";

    } else {
        document.getElementById("addbutton").style.display = "none";
    }
}

function stockfill() {
    document.getElementById("stockadd").innerHTML = "Save";
    var pname = document.getElementById("pname").selectedOptions[0].text;
    if (pname == 0 || pname == null || pname == "--Select--") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please input the required fields!',
        })

        document.getElementById("qty").innerHTML = "";
        document.getElementById("lowstocksuffix").innerHTML = "";
        document.getElementById("highstocksuffix").innerHTML = "";
        document.getElementById("namecolor").style.color = "red";
        document.getElementById("pname").style.borderColor = "red";
    }
    else {

        $.ajax({
            type: 'Post',
            url: "api/itemdatatable/GetTable",
            data: { type: "make" },
            success: function (data) {
                if (data.success) {
                    $('#brand').empty();
                    $('#brand').append("<option value='0'>--Select--</option>");
                    $.each(data.data, function (key, value) {
                        $('#brand').append($("<option></option>").val(value.id).html(value.desc));
                    });
                }
                $.ajax({
                    type: 'Post',
                    url: "api/itemdatatable/GetTable",
                    data: { type: "godown" },
                    success: function (data) {
                        if (data.success) {
                            $('#location').empty();
                            $('#location').append("<option value='0'>--Select--</option>");
                            $.each(data.data, function (key, value) {
                                $('#location').append($("<option></option>").val(value.id).html(value.desc));
                            });
                        }
                    }
                });
            }
        });
        $.ajax({
            url: '/api/UserManagement/permissioncheck',
            type: 'GET',
            contentType: 'application/json',
            data: {
                formName: "OPENING_STOCK",
                operation: "CREATE",
            },
            success: function (data) {
                if (data.data.permission == true) {
                    document.getElementById("addstc").style.display = "block";

                } else {
                    document.getElementById("addstc").style.display = "none";

                }
            }
        });
        document.getElementById("unit1").value = document.getElementById("unit").value;
        document.getElementById("altunit1").value = document.getElementById("altunit").value;
        document.getElementById("lowstocksuffix").value = document.getElementById("unit").value;
        document.getElementById("highstocksuffix").value = document.getElementById("unit").value;
        var psize = document.getElementById("size").selectedOptions[0].text;
        var pclass = document.getElementById("Class").selectedOptions[0].text;

        document.getElementById("productname").innerHTML = pname + " '" + psize + "' '" + pclass + "'";
        var altunit = document.getElementById("togBtnunit").checked;
        if (altunit == true) {
            document.getElementById("secondarydiv").style.display = "block";
        }
        else {
            document.getElementById("secondarydiv").style.display = "none";
        }

    }

}

function showstock() {
    var Itemid = document.getElementById("ItemId").value;
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "OPENING_STOCK",
            operation: "CREATE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                dataTable = $("#ItemTable").DataTable({
                    ajax: {
                        'url': '/api/itemdatatable/ShowStock?Itemid=' + Itemid,
                        'contentType': 'application/json'
                    },
                    columns: [
                        { 'data': 'qty', 'defaultContent': '-', 'width': '10%' },
                        { 'data': 'altQty', 'defaultContent': '-', 'width': '10%' },
                        { 'data': 'itemBrand', 'defaultContent': '', 'width': '20%' },
                        { 'data': 'godownLocation', 'defaultContent': '-', 'width': '30%' },
                        {
                            'data': 'id', 'render': function (data) {
                                return `<a class="btn btn-info btn-sm" style="color:white" onclick=editStockItem(${data})> <i class="fas fa-pencil-alt"></i> Edit</a>
                             <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteStockitem(${data})> <i class="fas fa-trash"></i>Delete</a>`;
                            }, 'width': '30%'
                        },

                    ],
                    "autoWidth": false,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    "searching": false,
                    language: {
                        searchPlaceholder: "Search records",
                        emptyTable: "No data found",
                        width: '100%',
                    },
                });
                dataTable.on('order.dt search.dt', function () {
                    dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
                }).draw();
            } else {
                dataTable = $("#ItemTable").DataTable({
                    ajax: {
                        'url': '/api/itemdatatable/ShowStock?Itemid=' + Itemid,
                        'contentType': 'application/json'
                    },
                    columns: [
                        { 'data': 'qty', 'defaultContent': '-', 'width': '10%' },
                        { 'data': 'altQty', 'defaultContent': '-', 'width': '10%' },
                        { 'data': 'itemBrand', 'defaultContent': '', 'width': '20%' },
                        { 'data': 'godownLocation', 'defaultContent': '-', 'width': '30%' },
                        {
                            'data': 'id', 'render': function (data) {
                                return `<a class="btn btn-info btn-sm" style="color:white" onclick=editStockItem(${data})> <i class="fas fa-pencil-alt"></i> Edit</a>
                             <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteStockitem(${data})> <i class="fas fa-trash"></i>Delete</a>`;
                            }, 'width': '30%', "visible": false
                        },

                    ],
                    "autoWidth": false,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    "searching": false,
                    language: {
                        searchPlaceholder: "Search records",
                        emptyTable: "No data found",
                        width: '100%',
                    },
                });
                dataTable.on('order.dt search.dt', function () {
                    dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
                }).draw();
            }
        }
    });


}
function editStockItem(stockid) {

    $.ajax({
        type: 'Get',
        url: "api/itemdatatable/viewStockBYid?stockid=" + stockid,
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("qty").value = data.data.qty;
                document.getElementById("altqty").value = data.data.altQty;
                $("#brand option[value=" + data.data.brandid + "]").remove();
                $('#brand').append($("<option selected></option>").val(data.data.brandid).html(data.data.itemBrand));
                $("#location option[value=" + data.data.locationid + "]").remove();
                $('#location').append($("<option selected></option>").val(data.data.locationid).html(data.data.godownLocation));
                document.getElementById("stockid").value = data.data.id;
                document.getElementById("stockadd").innerHTML = "Update";

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
                    title: data.message,
                })
            }
        }
    });
}

function deleteStockitem(stockid) {
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
                url: "api/itemdatatable/DeleteStock?stockid=" + stockid,
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
                        $('#ItemTable').DataTable().ajax.reload();

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

function addstock() {
    var qty = document.getElementById("qty").value;
    var altqty = document.getElementById("altqty").value
    var Itemid = document.getElementById("ItemId").value;
    var stockid = document.getElementById("stockid").value;
    var savebutton = document.getElementById("stockadd").innerHTML;
    var counter = 0;
    if (qty == "") {
        document.getElementById("qtylabel").style.color = "red";
        document.getElementById("qty").style.borderColor = "red";
        counter = counter + 1;
    }
    else {
        document.getElementById("qtylabel").style.color = "black";
        document.getElementById("qty").style.borderColor = "black";
    }

    var secdiv = document.getElementById("secondarydiv").style.display;
    if (altqty == "" && secdiv != "none") {
        document.getElementById("secqtylabel").style.color = "red";
        document.getElementById("altqty").style.borderColor = "red";
        counter = counter + 1;
    }
    else {
        document.getElementById("secqtylabel").style.color = "black";
        document.getElementById("altqty").style.borderColor = "black";
    }
    var GodownLocation = document.getElementById("location").value;
    if (GodownLocation == "0" || GodownLocation == "") {
        document.getElementById("locationlabel").style.color = "red";
        document.getElementById("location").style.borderColor = "red";
        counter = counter + 1;
    }
    else {
        document.getElementById("locationlabel").style.color = "black";
        document.getElementById("location").style.borderColor = "black";
    }

    var ItemBrand = document.getElementById("brand").selectedOptions[0].text;
    if (ItemBrand == "--Select--") { ItemBrand = "" }
    var gd = document.getElementById("location").value;
    if (gd != "") {
        var GodownLocation = document.getElementById("location").selectedOptions[0].text;
    }
    else {
        var GodownLocation = "";
    }
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    if (counter == 0) {

        if (savebutton == "Save") {
            var url = "api/itemdatatable/addStock";
        }
        else {
            var url = "api/itemdatatable/updateStock";
        }
        $.ajax({
            type: 'Post',
            url: url,
            data: {
                ItemId: Itemid,
                Id: stockid,
                ItemBrand: ItemBrand,
                GodownLocation: GodownLocation,
                qty: qty,
                altQty: altqty,
            },
            success: function (data) {
                if (data.success == true) {
                    $('#ItemTable').DataTable().ajax.reload();
                    Toast.fire({
                        icon: 'success',
                        title: data.message,
                    })
                    clearstock();
                }
                else {

                    Toast.fire({
                        icon: 'error',
                        title: data.message,
                    })
                    document.getElementById("locationlabel").style.color = "black";
                    document.getElementById("location").style.borderColor = "black";
                    document.getElementById("brandlabel").style.color = "black";
                    document.getElementById("brand").style.borderColor = "black";
                }
            }
        });
    }
    else {
        Toast.fire({
            icon: 'error',
            title: 'Complete the details',
        })

    }
}
function clearstock() {
    document.getElementById("qty").value = "";
    document.getElementById("altqty").value = "";
    document.getElementById("stockid").value = "";

    document.getElementById("qtylabel").style.color = "black";
    document.getElementById("qty").style.borderColor = "black";
    document.getElementById("secqtylabel").style.color = "black";
    document.getElementById("altqty").style.borderColor = "black";
    document.getElementById("locationlabel").style.color = "black";
    document.getElementById("location").style.borderColor = "black";
    document.getElementById("stockadd").innerHTML = "Save";
    stockfill();
}

function conversionrate() {
    var prefix = document.getElementById('unit').selectedOptions[0].text;
    var suffix = document.getElementById('altunit').selectedOptions[0].text;
    if (suffix != 0) {
        document.getElementById('secondaryprefix').value = suffix;
        document.getElementById('secondarysuffix').value = prefix;
    }
    else {

    }
}

function weightconversionrate() {

    var prefix = document.getElementById('unit').selectedOptions[0].text;
    var suffix = document.getElementById('weightunit').selectedOptions[0].text;;
    if (suffix != 0) {
        document.getElementById('weightprefix').value = "1 " + prefix + "=";
        document.getElementById('weightsuffix').value = suffix;
    }
    else {

    }
}

function openingstock() {
    var suffix = document.getElementById('unit').selectedOptions[0].text;
    if (suffix != 0) {
        /*document.getElementById('stocksuffix').value = suffix;*/
        weightconversionrate();
        conversionrate();
        alternateunit();
        WarningUnit();
    }
    else {

    }
}

function alternateunit() {
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/GetTable",
        data: { type: "unit" },
        success: function (data) {
            if (data.success) {
                $('#altunit').empty();
                $('#altunit').append("<option value='0'>Select</option>");
                var unit = document.getElementById("unit").selectedOptions[0].text;
                $.each(data.data, function (key, value) {
                    if (unit != value.desc) {
                        $('#altunit').append($("<option></option>").val(value.desc).html(value.desc));
                    }

                });
            }
        }
    });
}

/*function viewsecondary() {
    var gd = document.getElementById("togBtnunit").checked;
    if (gd == true) {
        document.getElementById("secondaryunit").style.display = "block";
    } else {
        document.getElementById("secondaryunit").style.display = "none";
    }

}*/
function viewItem(itemno) {
    $.ajax({
        url: '/api/itemdatatable/viewitem?itemno=' + itemno,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                $("#pname option[value=" + data.data.pnameid + "]").remove();
                $('#pname').append($("<option selected></option>").val(data.data.pnameid).html(data.data.pname));
                $("#size option[value=" + data.data.sizeid + "]").remove();
                $('#size').append($("<option selected></option>").val(data.data.sizeid).html(data.data.size));
                $("#Class option[value=" + data.data.classid + "]").remove();
                $('#Class').append($("<option selected></option>").val(data.data.classid).html(data.data.class));
                $('#category').append($("<option selected></option>").val(data.data.categoryid).html(data.data.category));
                document.getElementById('hsncode').value = data.data.hsncode;

                document.getElementById('unit').value = data.data.unit;
                document.getElementById('unitid').value = data.data.unitid;
                document.getElementById('altunitid').value = data.data.altunitid;
                document.getElementById('altunit').value = data.data.altunit;

                document.getElementById('togBtnunit').checked = data.data.enableunit;
                if (data.data.enableunit == true) {
                    $("#altunitdiv").collapse('show');
                }


                document.getElementById('where').value = data.data.where;
                document.getElementById('secondaryprefix').value = data.data.altunit;/*where*/
                document.getElementById('from').value = data.data.from;
                document.getElementById('secondarysuffix').value = data.data.unit;/*from*/

                document.getElementById('togBtnweight').checked = data.data.enableweight;

                if (data.data.enableweight == true) {
                    $("#weightunitdiv").collapse('show');
                    document.getElementById('weightunit').value = data.data.weightunit;
                }
                document.getElementById('weightprefix').value = "1" + data.data.unit;
                document.getElementById('weight').value = data.data.weight;
                document.getElementById('weightsuffix').value = data.data.weightunit;

                document.getElementById('togBtnLowStock').checked = data.data.enableLowStock;
                if (data.data.enableLowStock == true) {
                    $("#multiCollapseExample13").collapse('show');
                }

                document.getElementById('togBtnSrUnit').checked = data.data.chooseWarningUnit;
                if (data.data.chooseWarningUnit == true) {
                    document.getElementById('lowstocksuffix').value = data.data.altunit;
                    document.getElementById('highstocksuffix').value = data.data.altunit;
                }
                else {
                    document.getElementById('lowstocksuffix').value = data.data.unit;
                    document.getElementById('highstocksuffix').value = data.data.unit;
                }


                document.getElementById('minimumStock').value = data.data.lowstock;

                document.getElementById('maximumStock').value = data.data.maxStock;


                document.getElementById('purchaseprice').value = data.data.price;
                document.getElementById('hsncode').value = data.data.hsncode;
                document.getElementById('ItemId').value = data.data.itemId;
                document.getElementById('creationdate').value = data.data.createiondate;

                document.getElementById('opstock').style.display = "block";
                document.getElementById('savebutton').innerHTML = "Update";
                var category = data.data.category;
                $.ajax({
                    type: 'Post',
                    url: "api/itemdatatable/FillCategoryy",
                    data: {
                        category: category
                    },
                    success: function (data) {
                        if (data.success) {
                            document.getElementById("unit").value = data.data.unit;
                            document.getElementById("unitid").value = data.data.unitid;
                            var altunit = data.data.altunit;
                            if (altunit == null) {
                                altunit = "";
                            }
                            if (altunit != "") {
                                document.getElementById("altunit").value = data.data.altunit;
                                document.getElementById("altunitid").value = data.data.altunitid;
                                document.getElementById("togBtnunit").checked = true;
                                $("#altunitdiv").collapse('show');

                                document.getElementById("secondaryprefix").value = data.data.altunit;
                                document.getElementById("secondarysuffix").value = data.data.unit;
                            } else {
                                document.getElementById("altunit").value = "";
                                document.getElementById("altunitid").value = "";
                                document.getElementById("secondaryprefix").value = "";
                                document.getElementById("secondarysuffix").value = "";
                                $("#altunitdiv").collapse('hide');
                                document.getElementById("togBtnunit").checked = false;
                            }
                            var weightunit = data.data.weightunit;
                            if (weightunit == null) {
                                weightunit = "";

                            }
                            if (weightunit == "") {
                                document.getElementById("weightunit").value = "";
                                document.getElementById("togBtnweight").checked = false;
                                $("#weightunitdiv").collapse('hide');
                            }
                            else {
                                $("#weightunitdiv").collapse('show');
                                document.getElementById("weightunit").value = data.data.weightunit;
                                document.getElementById("togBtnweight").checked = true;
                            }

                        } else {
                            Toast.fire({
                                icon: 'error',
                                title: data.message,
                            })
                        }



                    }
                });
                /*  document.getElementById('openning').value = data.data.opening;
                  
                 ;*/
                showstock();
            }
            else {

            }
        }
    });
}

function loaddata() {
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/GetTable",
        data: { type: "pname" },
        success: function (data) {
            if (data.success) {
                $('#pname').empty();
                $('#pname').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $('#pname').append($("<option></option>").val(value.id).html(value.desc));
                });
            }
            $.ajax({
                type: 'Post',
                url: "api/itemdatatable/GetTable",
                data: { type: "size" },
                success: function (data) {
                    if (data.success) {
                        $('#size').empty();
                        $('#size').append("<option value='0'>--Select--</option>");
                        $.each(data.data, function (key, value) {
                            $('#size').append($("<option></option>").val(value.id).html(value.desc));
                        });
                    }
                    $.ajax({
                        type: 'Post',
                        url: "api/itemdatatable/GetTable",
                        data: { type: "class" },
                        success: function (data) {
                            if (data.success) {
                                $('#Classs').empty();
                                $('#Class').append("<option value='0'>--Select--</option>");
                                $.each(data.data, function (key, value) {
                                    $('#Class').append($("<option></option>").val(value.id).html(value.desc));
                                });
                            }

                            $.ajax({
                                type: 'Post',
                                url: "api/itemdatatable/GetTable",
                                data: { type: "category" },
                                success: function (data) {
                                    if (data.success) {
                                        $('#category').empty();
                                        $('#category').append("<option value='0'>--Select--</option>");
                                        $.each(data.data, function (key, value) {
                                            $('#category').append($("<option></option>").val(value.id).html(value.desc));
                                        });
                                    }
                                    let url = new URLSearchParams(window.location.search);
                                    let itemno = url.get('itemno');
                                    if (itemno != null) {
                                        viewItem(itemno);
                                    }
                                }

                            });


                        }
                    });
                }
            });
        }
    });

}

function saveitem() {
    var Pname = document.getElementById("pname").selectedOptions[0].text;
    var pnameid = document.getElementById("pname").value;
    var Size = document.getElementById("size").selectedOptions[0].text;
    var sizeid = document.getElementById("size").value;
    var Classs = document.getElementById("Class").selectedOptions[0].text;
    var classid = document.getElementById("Class").value;
    var Category = document.getElementById("category").selectedOptions[0].text;
    var categoryid = document.getElementById("category").value;
    var Unit = document.getElementById("unit").value;
    var unitid = document.getElementById("unitid").value;

    var enableunit = document.getElementById("togBtnunit").checked;
    var Altunit = document.getElementById("altunit").value;
    var altunitid = document.getElementById("altunitid").value;

    var where = document.getElementById("where").value;
    var from = document.getElementById("from").value;

    var enableweight = document.getElementById("togBtnweight").checked;
    var weightunit = document.getElementById("weightunit").value;
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
    } else {
        document.getElementById("namecolor").style.color = "black";
    }
    if (Category == "--Select--") {
        counter = counter + 1;
        document.getElementById("categorycolor").style.color = "red";
    } else {
        document.getElementById("categorycolor").style.color = "black";
    }
    
    if (from == "") {
        from = 0;
    }
    if (where == "") {
        where = 0;
    }
    if (from == 0 && enableunit == true) {
        counter = counter + 1;
        document.getElementById("from").style.borderColor = "red";
    }
    else {
        document.getElementById("from").style.borderColor = "black";
    }
    if (where == 0 && enableunit == true) {
        counter = counter + 1;
        document.getElementById("where").style.borderColor = "red";
    }
    else {
        document.getElementById("where").style.borderColor = "black";
    }
    if (counter > 0) {
        Swal.fire(`Complete the details!`, '', 'info')

    }
    else {
        if (Size == "--Select--") { Size = ""; }
        if (Classs == "--Select--") { Classs = ""; }

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
                if (data.success == true) {
                    document.getElementById("ItemId").value = data.data;
                    document.getElementById('opstock').style.display = "block";
                    document.getElementById("savebutton").innerHTML = "Update";
                    if (savebutton == "Save") { showstock(); }

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
function clear() {
    window.location.href = "../ItemMaster";
    document.getElementById("namecolor").style.color = "black";
    document.getElementById("sizecolor").style.color = "black";
    document.getElementById("classcolor").style.color = "black";
    document.getElementById("makecolor").style.color = "black";
    document.getElementById("categorycolor").style.color = "black";
    document.getElementById("hsncolor").style.color = "black";
    document.getElementById("unitcolor").style.color = "black";
    document.getElementById("altcolor").style.color = "black";

}

function fillunit() {
    var category = document.getElementById("category").selectedOptions[0].text;
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/FillCategoryy",
        data: {
            category: category
        },
        success: function (data) {
            if (data.success) {
                document.getElementById("unit").value = data.data.unit;
                document.getElementById("unitid").value = data.data.unitid;
                var altunit = data.data.altunit;
                if (altunit == null) {
                    altunit = "";
                }
                if (altunit != "") {
                    document.getElementById("altunit").value = data.data.altunit;
                    document.getElementById("altunitid").value = data.data.altunitid;
                    document.getElementById("togBtnunit").checked = true;
                    $("#altunitdiv").collapse('show');

                    document.getElementById("secondaryprefix").value = data.data.altunit;
                    document.getElementById("secondarysuffix").value = data.data.unit;
                } else {
                    document.getElementById("altunit").value = "";
                    document.getElementById("altunitid").value = "";
                    document.getElementById("secondaryprefix").value = "";
                    document.getElementById("secondarysuffix").value = "";
                    $("#altunitdiv").collapse('hide');
                    document.getElementById("togBtnunit").checked = false;
                }
                var weightunit = data.data.weightunit;
                if (weightunit == null) {
                    weightunit = "";
                    
                }
                if (weightunit == "") {
                    document.getElementById("weightunit").value = "";
                    document.getElementById("togBtnweight").checked = false;
                    $("#weightunitdiv").collapse('hide');
                }
                else {
                    $("#weightunitdiv").collapse('show');
                    document.getElementById("weightunit").value = data.data.weightunit;
                    document.getElementById("togBtnweight").checked = true;
                }
                var prefix = document.getElementById('unit').value;
                var suffix = document.getElementById('weightunit').value;
                if (suffix != 0) {
                    document.getElementById('weightprefix').value = "1 " + prefix + "=";
                    document.getElementById('weightsuffix').value = suffix;
                }
                else {

                }
                if (document.getElementById('togBtnSrUnit').checked == true)
                {
                    document.getElementById('lowstocksuffix').value = document.getElementById('altunit').value;
                    document.getElementById('lowstockid').value = document.getElementById('altunit').value;
                    document.getElementById('highstocksuffix').value = document.getElementById('altunit').value;
                    document.getElementById('maxstockid').value = document.getElementById('altunit').value;
                }
                else
                {
                    document.getElementById('lowstocksuffix').value = document.getElementById('unit').value;
                    document.getElementById('lowstockid').value = document.getElementById('unit').value;
                    document.getElementById('highstocksuffix').value = document.getElementById('unit').value;
                    document.getElementById('maxstockid').value = document.getElementById('unit').value;
                }

            } else {
                Toast.fire({
                    icon: 'error',
                    title: data.message,
                })
            }



        }
    });
}