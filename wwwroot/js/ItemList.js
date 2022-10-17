
$(document).ready(function () {
    LoadDatatable()
    $('#listTable').on('click', 'tr', function () {
        $(this).toggleClass('activee');
    });
    
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "ITEM_MASTER",
            operation: "CREATE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                document.getElementById("validation").style.display = "block";
            } else {
                document.getElementById("validation").style.display = "none";
            }
        }
    });
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "OPENING_STOCK",
            operation: "VIEW",
        },
        success: function (data) {
            if (data.data.permission == true) {
                LoadDatatable()
            } else {
              LoadDatatableWithoutDelete()
            }
        }
    });

  
});

function LoadDatatable() {

    document.getElementById("headerlabel").innerHTML = "ITEM LIST";
    document.getElementById("openingstockdiv").style.display = "none";
    document.getElementById("itemlistdiv").style.display = "block";
    document.getElementById("openingstockbutton").style.display = "block";
    document.getElementById("itemlistbuttton").style.display = "none";
    var updatepermission = false;
    var deletepermission = false;
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "ITEM_MASTER",
            operation: "UPDATE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                updatepermission = true;
            } else {
                updatepermission = false;
            }
        }
    });
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "ITEM_MASTER",
            operation: "DELETE",
        },
        success: function (data) {
            if (data.data.permission == true) {
                deletepermission = true;
            } else {
                deletepermission = false;
            }
        }
    });
    dataTable = $("#listTable").DataTable({

        ajax: {
            'url': '/api/itemdatatable/GetItemTable',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'itemId', 'defaultContent': '', 'width': '1%' },
            { 'data': 'pname', 'defaultContent': '', 'width': '20%' },
            { 'data': 'size', 'defaultContent': '', 'width': '3%' },
            { 'data': 'class', 'defaultContent': '', 'width': '3%' },
            { 'data': 'category', 'defaultContent': '', 'width': '3%' },
            { 'data': 'unit', 'defaultContent': '', 'width': '3%' },
            { 'data': 'altunit', 'defaultContent': '', 'width': '3%' },
            { 'data': 'hsncode', 'defaultContent': '', 'width': '3%' },
            {
                'data': 'itemId', 'render': function (data, type, row) {
                var html1 =`<a> Where ${row.where}${row.altunit} = ${row.from}${row.unit} <a/>`
                    return html1;
                }, 'width': '20%', 'min- height': '200px', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },
            {
                'data': 'itemId', 'render': function (data) {
                    if (updatepermission == true && deletepermission == true) {
                        return `<a class="btn btn-info btn-sm" style="color:white" href=ItemMaster?itemno=${data}> <i class="fas fa-pencil-alt"></i>Edit</a>
                                <a class="btn btn-danger btn-sm" style="color:white;" onclick=deleteitem(${data})> <i class="fas fa-trash"></i>Delete</a>
                                <a class="btn btn-info btn-sm" data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"ITEM_MASTER","ITEM_MASTER",1)> <i class="fa fa-history"></i> &nbsp;  Logs</a >`;
                    } else if (updatepermission == false && deletepermission == true) {
                        return `<a class="btn btn-danger btn-sm" style="color:white;" onclick=deleteitem(${data})> <i class="fas fa-trash"></i>Delete</a>`;
                    } else if (updatepermission == true && deletepermission == false) {
                        return `<a class="btn btn-info btn-sm" style="color:white" href=ItemMaster?itemno=${data}> <i class="fas fa-pencil-alt"></i>Edit</a>
                               <a class="btn btn-info btn-sm" data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails(${data},this,"ITEM_MASTER","ITEM_MASTER",1)> <i class="fa fa-history"></i> &nbsp; Logs</a >`;
                    } else {
                        return  ``;
                    }

                }, 'width': '20%'
            },

        ],
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'ITEM REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5],
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'ITEM REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5],
                },
                customize: function (doc) {
                    doc.pageMargins = [10, 10, 10, 10];
                    doc.defaultStyle.fontSize = 7;
                    doc.styles.tableHeader.fontSize = 7;
                    doc.styles.title.fontSize = 9;
                    // Remove spaces around page title
                    doc.content[0].text = doc.content[0].text.trim();
                    var objLayout = {
                    };
                    // Horizontal line thickness
                    objLayout['hLineWidth'] = function (i) { return .5; };
                    // Vertikal line thickness
                    objLayout['vLineWidth'] = function (i) { return .5; };
                    // Horizontal line color
                    objLayout['hLineColor'] = function (i) { return '#aaa'; };
                    // Vertical line color
                    objLayout['vLineColor'] = function (i) { return '#aaa'; };
                    // Left padding of the cell
                    objLayout['paddingLeft'] = function (i) { return 4; };
                    // Right padding of the cell
                    objLayout['paddingRight'] = function (i) { return 4; };
                    // Inject the object in the document
                    doc.content[1].layout = objLayout;
                }
            },

            {
                text: '<i class="fa fa-print"></i> Print',
                extend: 'print', footer: true, autoPrint: true,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                },
                customize: function (list) {
                    $(list.document.body).find('table').css('font-size', '10pt');
                    $(list.document.body).find('table').css('border', '1px solid #000');
                    $(list.document.body).find('table td').css('border-left', '1px solid #000');
                    $(list.document.body).find('table td').css('border-top', '1px solid #000');
                    $(list.document.body).find('table td').css('border-right', '1px solid #000');
                    $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                },
                title: function () {
                    var companyname = document.getElementById('companyname1').innerHTML;
                    return pnsdo()
                    function pnsdo() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">OPENING STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;"><br />${companyname}</div>`

                    }
                }

            },],

        "bDestroy": true,
        "paging": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "scrollX": true,
        "responsive": true,
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
/*function LoadDatatableWithoutEdit() {
    document.getElementById("oper").style.display = "none";
    document.getElementById("headerlabel").innerHTML = "ITEM LIST";
    document.getElementById("openingstockdiv").style.display = "none";
    document.getElementById("itemlistdiv").style.display = "block";
    document.getElementById("openingstockbutton").style.display = "block";
    document.getElementById("itemlistbuttton").style.display = "none";

    dataTable = $("#listTable").DataTable({

        ajax: {
            'url': '/api/itemdatatable/GetItemTable',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'itemId', 'defaultContent': '', 'width': '1%' },
            { 'data': 'pname', 'defaultContent': '', 'width': '20%' },
            { 'data': 'size', 'defaultContent': '', 'width': '3%' },
            { 'data': 'class', 'defaultContent': '', 'width': '3%' },
            { 'data': 'category', 'defaultContent': '', 'width': '3%' },
            { 'data': 'unit', 'defaultContent': '', 'width': '3%' },
            { 'data': 'altunit', 'defaultContent': '', 'width': '3%' },
            { 'data': 'hsncode', 'defaultContent': '', 'width': '3%' },
            {
                'data': 'itemId', 'render': function (data, type, row) {
                    var html1 = `<a> Where ${row.where}${row.altunit} = ${row.from}${row.unit} <a/>`
                    return html1;
                }, 'width': '20%', 'min- height': '200px', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },
            {
                'data': 'itemId', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" href=ItemMaster?itemno=${data}> <i class="fas fa-pencil-alt">
                              </i>
                              Edit</a>
                                    <a class="btn btn-danger btn-sm" style="color:white;" onclick=deleteitem(${data})> <i class="fas fa-trash">
                              </i>
                              Delete</a>`;
                }, 'width': '12%', "visible": false
            },

        ],
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'ITEM REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5],
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'ITEM REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5],
                },
                customize: function (doc) {
                    doc.pageMargins = [10, 10, 10, 10];
                    doc.defaultStyle.fontSize = 7;
                    doc.styles.tableHeader.fontSize = 7;
                    doc.styles.title.fontSize = 9;
                    // Remove spaces around page title
                    doc.content[0].text = doc.content[0].text.trim();
                    var objLayout = {
                    };
                    // Horizontal line thickness
                    objLayout['hLineWidth'] = function (i) { return .5; };
                    // Vertikal line thickness
                    objLayout['vLineWidth'] = function (i) { return .5; };
                    // Horizontal line color
                    objLayout['hLineColor'] = function (i) { return '#aaa'; };
                    // Vertical line color
                    objLayout['vLineColor'] = function (i) { return '#aaa'; };
                    // Left padding of the cell
                    objLayout['paddingLeft'] = function (i) { return 4; };
                    // Right padding of the cell
                    objLayout['paddingRight'] = function (i) { return 4; };
                    // Inject the object in the document
                    doc.content[1].layout = objLayout;
                }
            },

            {
                text: '<i class="fa fa-print"></i> Print',
                extend: 'print', footer: true, autoPrint: true,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                },
                customize: function (list) {
                    $(list.document.body).find('table').css('font-size', '10pt');
                    $(list.document.body).find('table').css('border', '1px solid #000');
                    $(list.document.body).find('table td').css('border-left', '1px solid #000');
                    $(list.document.body).find('table td').css('border-top', '1px solid #000');
                    $(list.document.body).find('table td').css('border-right', '1px solid #000');
                    $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                },
                title: function () {
                    var companyname = document.getElementById('companyname1').innerHTML;
                    return pnsdo()
                    function pnsdo() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">OPENING STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;"><br />${companyname}</div>`

                    }
                }

            },],

        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "scrollX": true,
        "responsive": true,
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
}*/

function deleteitem(id) {
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
                url: "api/itemdatatable/Deleteproduct",
                data: {
                    Id: id,
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                        dataTable.ajax.reload();
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

        };
    })

}


function OpeningStock() {
    document.getElementById("headerlabel").innerHTML = "OPENING STOCK LIST";
    document.getElementById("openingstockdiv").style.display = "block";
    document.getElementById("itemlistdiv").style.display = "none";
    document.getElementById("openingstockbutton").style.display = "none";
    document.getElementById("itemlistbuttton").style.display = "block";

    dataTable = $("#openingTable").DataTable({

        ajax: {
            'url': '/api/itemdatatable/OpeningStockReport',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '2%' },

            {
                'data': 'pname', 'render': function (data, type, row) {
                    if (row.pclass != null) {
                        var html1 =
                            `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}" </a> <br>
                                           `
                    }
                    else {
                        var html1 = `<a>${row.pname} &nbsp;" ${row.psize}"  </a>`
                    }
                    return html1;
                }, 'width': '40%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },

            { 'data': 'pmake', 'defaultContent': '', 'width': '20%' },
            { 'data': 'location', 'defaultContent': '', 'width': '20%' },
            {
                'data': 'qty', 'render': function (data, type, row) {
                    return `<a>${row.qty.toFixed(2)} ${row.unit}</a> `;
                }, 'width': '20%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
            },
            {
                'data': 'qty', 'render': function (data, type, row) {
                    return ` <a>${row.altqty} ${row.altunit}</a>`;
                }, 'width': '20%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
            },
        ],
        dom: 'lBfrtip',
        "bDestroy": true,
        "paging": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "scrollX": true,
        "responsive": true,

        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'OPENING STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'OPENING STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4 , 5]
                },
                customize: function (doc) {
                    doc.pageMargins = [10, 10, 10, 10];
                    doc.defaultStyle.fontSize = 7;
                    doc.styles.tableHeader.fontSize = 7;
                    doc.styles.title.fontSize = 9;
                    // Remove spaces around page title
                    doc.content[0].text = doc.content[0].text.trim();
                    var objLayout = {
                    };
                    // Horizontal line thickness
                    objLayout['hLineWidth'] = function (i) { return .5; };
                    // Vertikal line thickness
                    objLayout['vLineWidth'] = function (i) { return .5; };
                    // Horizontal line color
                    objLayout['hLineColor'] = function (i) { return '#aaa'; };
                    // Vertical line color
                    objLayout['vLineColor'] = function (i) { return '#aaa'; };
                    // Left padding of the cell
                    objLayout['paddingLeft'] = function (i) { return 4; };
                    // Right padding of the cell
                    objLayout['paddingRight'] = function (i) { return 4; };
                    // Inject the object in the document
                    doc.content[1].layout = objLayout;
                }
            },

            {
                text: '<i class="fa fa-print"></i> Print',
                extend: 'print', footer: true, autoPrint: true,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                },
                customize: function (list) {
                    $(list.document.body).find('table').css('font-size', '10pt');
                    $(list.document.body).find('table').css('border', '1px solid #000');
                    $(list.document.body).find('table td').css('border-left', '1px solid #000');
                    $(list.document.body).find('table td').css('border-top', '1px solid #000');
                    $(list.document.body).find('table td').css('border-right', '1px solid #000');
                    $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                },
                title: function () {
                    var companyname = document.getElementById('companyname1').innerHTML;
                    return pnsdo()
                    function pnsdo() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">OPENING STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;"><br />${companyname}</div>`

                    }
                }
              

            },],

        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    dataTable.on('order.dt ', function () {
        dataTable.column(0, {  order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}


function addGenralEntry() {
  
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var creationdate= now.toISOString().slice(0, 16);

    var Pname = document.getElementById("txtName").selectedOptions[0].text;
    var pnameid = document.getElementById("txtName").value;
    var Size = document.getElementById("txtSize").selectedOptions[0].text;
    var sizeid = document.getElementById("txtSize").value;
    var Classs = document.getElementById("txtClass").selectedOptions[0].text;
    var classid = document.getElementById("txtClass").value;
    var Category = document.getElementById("txtMake").selectedOptions[0].text;
    var categoryid = document.getElementById("txtMake").value;
    var Unit = document.getElementById("txtUnit").selectedOptions[0].text;
    var unitid = document.getElementById("txtUnit").value;
    var AltUnit = document.getElementById("alttxtUnit").selectedOptions[0].text;
    var Altunitid = document.getElementById("alttxtUnit").value;
    var whareHouse = document.getElementById("txtWarehouse").selectedOptions[0].text;
    var whareHouseid = document.getElementById("txtWarehouse").value;
    var qty = document.getElementById("qty").value;
    var altqty = document.getElementById("altqty").value;
    var description = document.getElementById("txtRemarks").value;
    var ShortAccess = document.getElementById("shortAccess").value;
    var counter = 0;

  
    if (ShortAccess == "--Select--") {
        counter = counter + 1
        document.getElementById("shortAccess").style.borderColor = 'red';
    }
    else {
        document.getElementById("shortAccess").style.borderColor = 'grey';
    }
    if (description == "") {
        counter = counter + 1
        document.getElementById("txtRemarks").style.borderColor = 'red';
    }
    else {
        document.getElementById("txtRemarks").style.borderColor = 'grey';
    }

    if (counter > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Required Information is Missing`,
        })
    }
    else {


        $.ajax({
            type: 'Post',
            url: "api/itemdatatable/AddGenralEntry",
            data: {
                creationdate: creationdate,
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
                altunit: AltUnit,
                altunitid: Altunitid,
                whareHouse: whareHouse,
                whareHouseid: whareHouseid,
                qty: qty,
                altqty: altqty,
                Description: description,
                ShortType: ShortAccess

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
                    resetItem()

                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: data.message,
                    })
                }
            }
        });
    } }

function generalEntry() {
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
    $.ajax({
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
            document.getElementById("txtName").focus();
        }
    })
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/GetTable",
        data: { type: "unit" },
        success: function (data) {
            if (data.success) {
                $('#alttxtUnit').empty();
                $('#alttxtUnit').append("<option value='0'>Select</option>");
                $.each(data.data, function (key, value) {
                    $('#alttxtUnit').append($("<option></option>").val(value.id).html(value.desc));
                });
            }
            $("#alttxtUnit").select2();
            document.getElementById("txtName").focus();
        }
    })

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

function resetItem() {
    $('#txtName').empty();
    $('#txtSize').empty();
    $('#txtClass').empty();
    $('#txtMake').empty();
    $('#txtUnit').empty();
    $('#txtWarehouse').empty();
    document.getElementById('qty').value = "";
    document.getElementById('altqty').value = "";
    document.getElementById('txtRemarks').value = "";
    generalEntry()
}

function generalEntryDiv() {

    document.getElementById("headerlabel").innerHTML = "GENERAL ENTRY LIST";
    document.getElementById("openingstockdiv").style.display = "none";
    document.getElementById("itemlistdiv").style.display = "none";
    document.getElementById("openingstockbutton").style.display = "none";
    document.getElementById("generalEntrydiv").style.display = "block";
    document.getElementById("geTable").style.display = "block";

    dataTable = $("#geTable").DataTable({

        ajax: {
            'url': '/api/itemdatatable/GetGenralEntryTable',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '2%' },
            {
                'data': 'creationdate', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MM-YYYY');
                    var hours = moment(now).format('hh');
                    var x = Number(hours)
                    var ampm = x >= 12 ? 'PM' : 'AM';
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '8%', 'font-size': '6px'
            },
           
            {
                'data': 'pname', 'render': function (data, type, row) {
                    if (row.pclass != null) {
                        var html1 =
                            `<a>${row.pname} &nbsp;" ${row.size}" &nbsp"${row.class}" </a> <br>
                                           `
                    }
                    else {
                        var html1 = `<a>${row.pname} &nbsp;" ${row.size}"  </a>`
                    }
                    return html1;
                }, 'width': '30%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
            },

            
            { 'data': 'category', 'defaultContent': '', 'width': '10%' },
            { 'data': 'unit', 'defaultContent': '', 'width': '5%' },
            { 'data': 'altunit', 'defaultContent': '', 'width': '5%' },
            { 'data': 'whareHouse', 'defaultContent': '', 'width': '10%' },
            {
                'data': 'qty', 'render': function (data, type, row) {
                    return ` <a>${row.qty} ${row.unit}</a>`;
                }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
            },
            {
                'data': 'Altqty', 'render': function (data, type, row) {
                    return ` <a>${row.altqty} ${row.altunit}</a>`;
                }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
            },

            { 'data': 'shortType','defaultContent':'','width':'8%'},
            { 'data': 'description','defaultContent':'','width':'20%'}
        ],
        dom: 'lBfrtip',
        "bDestroy": true,
        "paging": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "scrollX": true,
        "responsive": true,

        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'OPENING STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'OPENING STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                },
                customize: function (doc) {
                    doc.pageMargins = [10, 10, 10, 10];
                    doc.defaultStyle.fontSize = 7;
                    doc.styles.tableHeader.fontSize = 7;
                    doc.styles.title.fontSize = 9;
                    // Remove spaces around page title
                    doc.content[0].text = doc.content[0].text.trim();
                    var objLayout = {
                    };
                    // Horizontal line thickness
                    objLayout['hLineWidth'] = function (i) { return .5; };
                    // Vertikal line thickness
                    objLayout['vLineWidth'] = function (i) { return .5; };
                    // Horizontal line color
                    objLayout['hLineColor'] = function (i) { return '#aaa'; };
                    // Vertical line color
                    objLayout['vLineColor'] = function (i) { return '#aaa'; };
                    // Left padding of the cell
                    objLayout['paddingLeft'] = function (i) { return 4; };
                    // Right padding of the cell
                    objLayout['paddingRight'] = function (i) { return 4; };
                    // Inject the object in the document
                    doc.content[1].layout = objLayout;
                }
            },

            {
                text: '<i class="fa fa-print"></i> Print',
                extend: 'print', footer: true, autoPrint: true,
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                },
                customize: function (list) {
                    $(list.document.body).find('table').css('font-size', '10pt');
                    $(list.document.body).find('table').css('border', '1px solid #000');
                    $(list.document.body).find('table td').css('border-left', '1px solid #000');
                    $(list.document.body).find('table td').css('border-top', '1px solid #000');
                    $(list.document.body).find('table td').css('border-right', '1px solid #000');
                    $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                },
                title: function () {
                    var companyname = document.getElementById('companyname1').innerHTML;
                    return pnsdo()
                    function pnsdo() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">OPENING STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;"><br />${companyname}</div>`

                    }
                }


            },],

        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    dataTable.on('order.dt ', function () {
        dataTable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}