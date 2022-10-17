
var editor;
var summary = false;
$(document).ready(function () {
    getinitialdate()
    LoadDatatable()

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            goback()
        }
    };
    $('#productdetailstable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var rowData = row.data();

        //get index to use for child table ID
        var index = row.index();
        console.log(index);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(
                '<table class="child_table" id = "child_details' + index + '" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                '<thead><tr><th></th><th>Name</th><th>Position</th><th>Extn</th></tr></thead><tbody>' +
                '</tbody></table>').show();

            var childTable = $('#child_details' + index).DataTable({
                ajax: function (data, callback, settings) {
                    $.ajax({
                        url: "/ajax/objects.txt",
                    }).then(function (json) {
                        var data = JSON.parse(json);
                        data = data.data;

                        var display = [];
                        for (d = 0; d < data.length; d++) {
                            if (data[d].position == rowData.position) {
                                display.push(data[d]);
                            }
                        }
                        callback({ data: display });

                    });
                },
                columns: [
                    {
                        "className": 'details-control1',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },
                    { "data": "name" },
                    { "data": "position" },
                    { "data": "extn" },
                ],
                destroy: true,
                scrollY: '100px'
            });
            tr.addClass('shown');
        }

        // Add event listener for opening and closing second level child details
        $('.child_table tbody').off().on('click', 'td.details-control1', function () {
            var c_tr = $(this).closest('tr');
            var c_row = childTable.row(c_tr);

            if (c_row.child.isShown()) {
                // This row is already open - close it
                c_row.child.hide();
                c_tr.removeClass('shown');
            }
            else {
                // Open this row
                c_row.child(
                    '<table id = "child_details_2" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
                    '<thead><tr><th>Name</th><th>Start Date</th></tr></thead><tbody>' +
                    '</tbody></table>').show();

                $('#child_details_2').DataTable({
                    ajax: function (data, callback, settings) {
                        $.ajax({
                            url: "/ajax/objects.txt",
                        }).then(function (json) {
                            var data = JSON.parse(json);
                            data = data.data;

                            var display = [];
                            for (d = 0; d < data.length; d++) {
                                if (data[d].name == rowData.name) {
                                    display.push(data[d]);
                                }
                            }
                            callback({ data: display });

                        });
                    },
                    columns: [
                        { "data": "name" },
                        { "data": "start_date" },
                    ],
                    destroy: true,
                    scrollY: '100px'
                });
                c_tr.addClass('shown');
            }
        });

    });
});

function getinitialdate() {
    var now = new Date();
    document.getElementById("todate").innerHTML = moment(now).format('DD/MM/YYYY');
    document.getElementById("todate1").value = moment(now).format('YYYY-MM-DD');
    $.ajax({
        'url': '/api/stockreport/getinitialdate?',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("frmdate").innerHTML = moment(data.data).format('DD/MM/YYYY');
                document.getElementById("fromdate").value = moment(data.data).format('YYYY-MM-DD');
            }
        }
    });
}

function viewReport() {
    var frmdate = document.getElementById("fromdate").value;
    frmdate = moment(frmdate).format('DD/MM/YYYY');
    document.getElementById("frmdate").innerHTML = frmdate;

    var todate = document.getElementById("todate1").value;
    todate = moment(todate).format('DD/MM/YYYY');
    document.getElementById("todate").innerHTML = todate;

    if (document.getElementById("MonthWiseDetilasTablediv").style.display == "block") {
        MonthWiseDetailsStockDIv1();
    }
    else if (document.getElementById("productdetailstablediv").style.display == "block") {
        var pnameid = document.getElementById("pnameid").innerHTML;
        ProductDetailsDiv(pnameid, "");
    } else if (document.getElementById("MonthWiseTablediv").style.display == "block") {

        var psize = document.getElementById("ProductSize").innerHTML;
        var pclass = document.getElementById("ProductClass").innerHTML;
        var pmake = document.getElementById("ProductMake").innerHTML;
        MonthWiseStockDIv("", psize, pclass, pmake)
    } else if (document.getElementById("productnametablediv").style.display == "block") {
        var id = document.getElementById("godownid").innerHTML;
        ProductNameDiv(id);
    }

}

function filldetails() {
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/GetTableByData",
        data: { type: "pname" },
        success: function (data) {
            if (data.success) {
                $('#txtName').empty();
                $('#txtName').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $('#txtName').append($("<option></option>").val(value.id).html(value.desc));
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
                $('#txtMake1').empty();
                $('#txtMake').append("<option value='0'>--Select--</option>");
                $('#txtMake1').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $('#txtMake').append($("<option></option>").val(value.desc).html(value.desc));
                    $('#txtMake1').append($("<option></option>").val(value.desc).html(value.desc));
                });
            }
            $("#txtMake").select2();
            $("#txtMake1").select2();
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
                $.each(data.data, function (key, value) {
                    $('#txtWarehouse').append($("<option></option>").val(value.id).html(value.desc));
                });
            }
            $("#txtWarehouse").select2();
        }
    })
}

function LoadDatatable() {
    document.getElementById("ComparisonDiv").style.display = "none";
    var now = document.getElementById("todate1").value;
    var ddate = moment(now).format('YYYY-MM-DD');
    dataTable = $("#listTable").DataTable({

        ajax: {
            'url': '/api/stockreport/GodownWise?ddate=' + ddate,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '', 'width': '2%' },
            { 'data': 'location', 'defaultContent': '', 'width': '60%' },
            { 'data': 'name', 'defaultContent': '', 'width': '60%' },
            {
                'data': 'id', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=ProductNameDiv(${data})> <i class="fa fa-cubes"></i>View Stock</a>`;
                }, 'width': '10%'
            },
        ],
        dom: 'Bfrtip',
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "info": false,
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

    document.getElementById("godownHeading").innerHTML = "Godown Stock";
    document.getElementById("listTablediv").style.display = "block";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "none";
    document.getElementById("MonthWiseTablediv").style.display = "none";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
    document.getElementById("productname").style.display = "none";
    document.getElementById("stksmry").style.display = "none";
}

function ProductNameDiv(id) {
    $.ajax({
        'url': '/api/stockreport/GodownName?gdid=' + id,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                var gd = data.gdname;
                document.getElementById("godownHeading").innerHTML = gd;
                document.getElementById("godownid").innerHTML = id;
                var ddate = document.getElementById("todate1").value;

                dataTable = $("#productnametable").DataTable({
                    ajax: {
                        'url': '/api/stockreport/GodownWisePnameList',
                        data: {
                            ddate: ddate,
                            gd: gd,
                        },
                        'type': 'GET',
                        'contentType': 'application/json'
                    },
                    columns: [
                        { 'data': null, 'defaultContent': '', 'width': '2%' },
                        { 'data': 'pname', 'defaultContent': '', 'width': '60%' },
                        {
                            'data': 'id', 'render': function (data) {
                                return `<a class="btn btn-info btn-sm" style="color:white" onclick=ProductDetailsDiv("",this)> <i class="fa fa-cubes">
                              </i>
                              View Stock</a>
                             `;
                            }, 'width': '10%'
                        },

                    ],
                    dom: 'Bfrtip',
                    "bDestroy": true,
                    "paging": false,
                    "searching": true,
                    "ordering": true,
                    "info": false,
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
        }
    });
    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "block";
    document.getElementById("stksmry").style.display = "block";
    document.getElementById("productdetailstablediv").style.display = "none";
    document.getElementById("MonthWiseTablediv").style.display = "none";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
    document.getElementById("productname").style.display = "none";


}

function ProductDetailsDiv(pname, button) {
    if (pname == "") {
        var row = $(button).closest("TR");
        pname = $("TD", row).eq(1).html();
    }

    document.getElementById("summrydiv").style.display = "block";
    document.getElementById("productname").innerHTML = pname;
    var gd = document.getElementById("godownHeading").innerHTML;
    var zerostk = document.getElementById("Zerostk").checked;
    var ddate = document.getElementById("todate1").value;
    dataTable = $("#productdetailstable").DataTable({
        ajax: {
            'url': '/api/stockreport/GodownWisePnameDetailsList',
            data: {
                ddate: ddate,
                gd: gd,
                pname: pname,
                zerostk: zerostk,
            },
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '', 'width': '1%' },
            { 'data': 'pname', 'defaultContent': '', 'width': '30%' },
            { 'data': 'psize', 'defaultContent': '', 'width': '10%' },
            { 'data': 'pclass', 'defaultContent': '', 'width': '10%' },
            { 'data': 'pmake', 'defaultContent': '', 'width': '10%' },
            {
                'data': 'qty', 'render': function (data, type, row) {
                    if (row.unit != null) {
                        return `<span>${row.qty.toFixed(2)} ${row.unit} </span>`;
                    }
                    else {
                        return `<span>${row.qty.toFixed(2)}</span>`;
                    }
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'altqty', 'render': function (data, type, row) {
                    if (row.altunit != null) {
                        return `<span>${row.altqty} ${row.altunit}</span>`;
                    }
                    else {
                        return `<span>${row.altqty}  </span>`;

                    }
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'weight', 'render': function (data) {
                    return `<span>${data.toFixed(2)}  </span>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            /*{ 'data': 'altqty', 'defaultContent': '', 'width': '10%' },*/
            {
                'data': 'null', 'render': function (data, type, row) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=MonthWiseStockDIv(this,"${row.sizeid}","${row.classid}","${row.makeid}")> <i class="fa fa-cubes">
                              </i>View Stock</a>`;
                }, 'width': '12%'
            },
            {
                "className": 'details-control1',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },

        ],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],
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
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
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
                    var frmdt = document.getElementById('frmdate').innerHTML;
                    var todt = document.getElementById('todate').innerHTML;
                    return pnsdo()
                    function pnsdo() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;">${frmdt}-${todt} <br />${companyname}</div>`
                    }
                }

            },],
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "info": false,
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

    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "block";
    document.getElementById("MonthWiseTablediv").style.display = "none";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
    document.getElementById("productname").style.display = "block";
}

function MonthWiseStockDIv(button, sizeid, classid, makeid) {
    var row = $(button).closest("TR");
    var pname = $("TD", row).eq(1).html();
    var psize = $("TD", row).eq(2).html();
    var pclass = $("TD", row).eq(3).html();
    var pmake = $("TD", row).eq(4).html();
    document.getElementById("ProductDescription").style.display = "block";

    document.getElementById("ProductDescription").innerHTML = psize + " " + pclass + " " + pmake;
    document.getElementById("ProductSize").innerHTML = psize;
    document.getElementById("ProductClass").innerHTML = pclass;
    document.getElementById("ProductMake").innerHTML = pmake;
    var sdate = document.getElementById("frmdate").innerHTML;
    var parts = sdate.split('/');
    sdate = new Date(parts[2], parts[1] - 1, parts[0]);
    sdate = moment(sdate).format('YYYY-MM-DD');

    var ddatee = document.getElementById("todate").innerHTML;
    partss = ddatee.split('/');
    var ddatee = new Date(partss[2], partss[1] - 1, partss[0]);
    ddatee = moment(ddatee).format('YYYY-MM-DD');
    var location = document.getElementById("godownHeading").innerHTML;
    var pname = document.getElementById("productname").innerHTML;

    dataTable = $("#MonthWiseTable").DataTable({
        ajax: {
            'url': '/api/stockreport/GodownWiseYerlyReport',
            'type': 'GET',
            'data': {
                sdate: sdate,
                ddate: ddatee,
                location: location,
                pname: pname,
                psize: psize,
                pclass: pclass,
                pmake: pmake,
            },
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '', 'width': '0%' },
            { 'data': 'description', 'defaultContent': '', 'width': '30%' },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span> ${row.inqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '10%', 'className': "text-right table-cell-edit", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    var unit = row.altunit;
                    if (row.altunit == null) {
                        unit = "";
                    }
                    return `<span>${row.inaltqty} ${unit}</span>`;
                }, 'width': '10%', 'className': "text-right table-cell-edit", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.outqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '10%', 'className': "text-right table-cell-grn", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    var unit = row.altunit;
                    if (row.altunit == null) {
                        unit = "";
                    }
                    return `<span>${row.outaltqty} ${unit}</span>`;
                }, 'width': '10%', 'className': "text-right table-cell-grn", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.balqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '10%', 'className': "text-right table-cell-yl", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    var unit = row.altunit;
                    if (row.altunit == null) {
                        unit = "";
                    }
                    return `<span>${row.balaltqty} ${unit}</span>`;
                }, 'width': '10%', 'className': "text-right table-cell-yl", 'font-size': '5px'
            },

            {
                'data': 'null', 'render': function (data, type, row) {
                    if (row.description == "Opening Balance") {
                        return `<a></a>`;
                    }
                    else {
                        return `<a class="btn btn-info btn-sm" style="color:white" onclick=MonthWiseDetailsStockDIv("${row.monthname}",${row.year})> <i class="fa fa-cubes">
                              </i>View Stock</a>`;
                    }

                }, 'width': '10%'
            },

        ],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],
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
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
                },
                customize: function (list) {
                    $(list.document.body).find('table').css('font-size', '10pt');
                    $(list.document.body).find('table').css('border', '1px solid #000');
                    $(list.document.body).find('table td').css('border-left', '1px solid #000');
                    $(list.document.body).find('table td').css('border-top', '1px solid #000');
                    $(list.document.body).find('table td').css('border-right', '1px solid #000');
                    $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                },
                title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

            },],
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "scrollX": true,
        "responsive": true,
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });

    $.ajax({
        'url': '/api/stockreport/totalfooter',
        'type': 'GET',
        'data': {
            sdate: sdate,
            ddate: ddatee,
            location: location,
            pname: pname,
            psize: psize,
            pclass: pclass,
            pmake: pmake,
        },
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                var unitt = data.data.altunit;
                if (unitt == null) {
                    unitt = ""
                }
                $('#MonthWiseTable tfoot tr:first').html(data.data.inqty.toFixed(2) + " " + data.data.unit);
                document.getElementById("grandinqty").innerHTML = data.data.inqty.toFixed(2) + " " + data.data.unit;
                $('#MonthWiseTable tfoot ').html(data.data.outqty.toFixed(2) + " " + data.data.unit);
                document.getElementById("grandinaltqty").innerHTML = data.data.inaltqty + " " + unitt;
                document.getElementById("grandoutqty").innerHTML = data.data.outqty.toFixed(2) + " " + data.data.unit;
                document.getElementById("grandoutaltqty").innerHTML = data.data.outaltqty + " " + unitt;
                document.getElementById("grandbalqty").innerHTML = data.data.balqty.toFixed(2) + " " + data.data.unit;
                document.getElementById("grandbalaltqty").innerHTML = data.data.balaltqty + " " + unitt;
            }

        }
    });

    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "none";
    document.getElementById("MonthWiseTablediv").style.display = "block";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
    document.getElementById("productname").style.display = "block";



}

function MonthWiseDetailsStockDIv(MonthName, year) {
    document.getElementById("summrydiv").style.display = "block";
    document.getElementById("MonthName").style.display = "block";
    document.getElementById("MonthName").innerHTML = MonthName + " " + year;
    document.getElementById("ProductDescription").style.display = "block";
    var psize = document.getElementById("ProductSize").innerHTML;
    var pclass = document.getElementById("ProductClass").innerHTML;
    var pmake = document.getElementById("ProductMake").innerHTML;
    var sdate = document.getElementById("frmdate").innerHTML;
    var parts = sdate.split('/');
    sdate = new Date(parts[2], parts[1] - 1, parts[0]);
    sdate = moment(sdate).format('YYYY-MM-DD');
    var month1 = MonthName.toLowerCase();
    var months = ["janurary", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    month1 = months.indexOf(month1) + 1;
    var ddatee = document.getElementById("todate").innerHTML;
    partss = ddatee.split('/');
    var ddatee = new Date(partss[2], partss[1] - 1, partss[0]);
    ddatee = moment(ddatee).format('YYYY-MM-DD');
    var location = document.getElementById("godownHeading").innerHTML;
    var pname = document.getElementById("productname").innerHTML;

    dataTable = $("#MonthWiseDetilasTable").DataTable({

        ajax: {
            'url': '/api/stockreport/GodownWiseMonthWiseReport',
            'data': {
                monthh: month1,
                yearr: year,
                sdate: sdate,
                ddate: ddatee,
                location: location,
                pname: pname,
                psize: psize,
                pclass: pclass,
                pmake: pmake,
            },
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns: [
            {
                'data': 'date', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MMM-YY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '10%', 'font-size': '6px'
            },
            { 'data': 'description', 'defaultContent': '', 'width': '15%', 'font-size': '1%' },
            { 'data': 'vchtype', 'defaultContent': '', 'width': '8%' },
            { 'data': 'vchno', 'defaultContent': '', 'width': '10%' },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span> ${row.inqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    var unit = row.altunit;
                    if (unit == null) {
                        unit = "";
                    }
                    return `<span>${row.inaltqty} ${unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.outqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    var unit = row.altunit;
                    if (unit == null) {
                        unit = "";
                    }
                    return `<span>${row.outaltqty} ${unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.balqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    var unit = row.altunit;
                    if (unit == null) {
                        unit = "";
                    }
                    return `<span>${row.balaltqty} ${unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },

            {
                'data': 'null', 'render': function (data, type, row) {
                    if (row.description == "Opening Balance") {
                        return `<a></a>`;
                    }
                    else {
                        return `<a class="btn btn-info btn-sm" style="color:white" onclick=redirectt("${row.vchno}","${row.vchtype}")> <i class="fa fa-cubes">
                              </i></a>`;
                    }
                }, 'width': '2%'
            },

        ],
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                customize: function (list) {
                    $(list.document.body).find('table').css('font-size', '10pt');
                    $(list.document.body).find('table').css('border', '1px solid #000');
                    $(list.document.body).find('table td').css('border-left', '1px solid #000');
                    $(list.document.body).find('table td').css('border-top', '1px solid #000');
                    $(list.document.body).find('table td').css('border-right', '1px solid #000');
                    $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                },
                title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

            },],
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": false,
        "scrollX": true,
        "responsive": true,



        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "none";
    document.getElementById("MonthWiseTablediv").style.display = "none";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "block";
    document.getElementById("productname").style.display = "block";
}

function MonthWiseDetailsStockDIv1() {

    document.getElementById("MonthName").style.display = "block";
    document.getElementById("summrydiv").style.display = "none";

    document.getElementById("ProductDescription").style.display = "block";
    var psize = document.getElementById("ProductSize").innerHTML;
    var pclass = document.getElementById("ProductClass").innerHTML;
    var pmake = document.getElementById("ProductMake").innerHTML;
    var sdate = document.getElementById("fromdate").value;
    var ddatee = document.getElementById("todate1").value;
    document.getElementById("MonthName").innerHTML = moment(sdate).format('DD/MMM/YYYY') + " - " + moment(ddatee).format('DD/MMM/YYYY');
    var location = document.getElementById("godownHeading").innerHTML;
    var pname = document.getElementById("productname").innerHTML;

    dataTable = $("#MonthWiseDetilasTable").DataTable({

        ajax: {
            'url': '/api/stockreport/GodownWiseMonthWiseReport1',
            'data': {
                sdate: sdate,
                ddate: ddatee,
                location: location,
                pname: pname,
                psize: psize,
                pclass: pclass,
                pmake: pmake,
            },
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns: [
            {
                'data': 'date', 'render': function (data) {
                    return `<span>${moment(data).format('DD-MMM-YY')}</span>`;
                }, 'width': '10%', 'font-size': '6px'
            },
            { 'data': 'description', 'defaultContent': '', 'width': '15%', 'font-size': '1%' },
            { 'data': 'vchtype', 'defaultContent': '', 'width': '8%' },
            { 'data': 'vchno', 'defaultContent': '', 'width': '10%' },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span> ${row.inqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.inaltqty} ${row.altunit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.outqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.outaltqty} ${row.altunit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.balqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.balaltqty} ${row.altunit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },

            {
                'data': 'null', 'render': function (data, type, row) {
                    if (row.description == "Opening Balance") {
                        return `<a></a>`;
                    }
                    else {
                        return `<a class="btn btn-info btn-sm" style="color:white" onclick=redirectt("${row.vchno}","${row.vchtype}")> <i class="fa fa-cubes">
                              </i></a>`;
                    }
                }, 'width': '2%'
            },

        ],
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                customize: function (list) {
                    $(list.document.body).find('table').css('font-size', '10pt');
                    $(list.document.body).find('table').css('border', '1px solid #000');
                    $(list.document.body).find('table td').css('border-left', '1px solid #000');
                    $(list.document.body).find('table td').css('border-top', '1px solid #000');
                    $(list.document.body).find('table td').css('border-right', '1px solid #000');
                    $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                },
                title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

            },],
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "scrollX": true,
        "responsive": true,



        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "none";
    document.getElementById("MonthWiseTablediv").style.display = "none";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "block";
    document.getElementById("productname").style.display = "block";
}

function redirectt(vchno, vchtype) {
    if (vchtype == "PURCHASE") {
        window.open('../PurchaseItems?PRNO=' + vchno, '_blank');
    } else {
        window.open('../DispatchedOrder?DONO=' + vchno, '_blank');

    }

}

function goback() {

    if (document.getElementById("listTablediv").style.display == "block") {

    }

    if (document.getElementById("ComparisonDiv").style.display == "block" || document.getElementById("productnametablediv").style.display == "block") {
        LoadDatatable();
    }
    if (document.getElementById("productdetailstablediv").style.display == "block") {
        var gd = document.getElementById("godownid").innerHTML;
        if (document.getElementById("stkwise").innerHTML == "Item Wise") {
            ProductNameDiv(gd);
        } else {
            document.getElementById("stkwise").innerHTML = "Item Wise";
            stockWiseReport();

        }

    }
    if (document.getElementById("MonthWiseTablediv").style.display == "block") {

        var pname = document.getElementById("productname").innerHTML;
        document.getElementById("ProductDescription").style.display = "none";
        if (document.getElementById("stkwise").innerHTML == "Item Wise") {
            ProductDetailsDiv(pname, "");
        } else {
            StockWiseProductDetailsDiv(pname);
        }
    }
    if (document.getElementById("MonthWiseDetilasTablediv").style.display == "block") {

        document.getElementById("MonthWiseTablediv").style.display = "block";
        document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
        document.getElementById("MonthName").style.display = "none";
        document.getElementById("summrydiv").style.display = "block";
    }

}

function viewComparisonReport() {
    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "none";
    document.getElementById("MonthWiseTablediv").style.display = "none";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
    document.getElementById("productname").style.display = "none";
    document.getElementById("ComparisonDiv").style.display = "block";

    var pname = document.getElementById("txtName").selectedOptions[0].text;
    var pmake = document.getElementById("txtMake").selectedOptions[0].text;
    var pmake1 = document.getElementById("txtMake1").selectedOptions[0].text;
    document.getElementById("brandd1").innerHTML = pmake;
    document.getElementById("brandd2").innerHTML = pmake1;
    var sdate = document.getElementById("frmdate").innerHTML;
    var parts = sdate.split('/');
    sdate = new Date(parts[2], parts[1] - 1, parts[0]);
    sdate = moment(sdate).format('YYYY-MM-DD');

    var ddatee = document.getElementById("todate").innerHTML;
    partss = ddatee.split('/');
    var ddatee = new Date(partss[2], partss[1] - 1, partss[0]);
    ddatee = moment(ddatee).format('YYYY-MM-DD');
    var negative = document.getElementById("ngcheck").checked;
    let count = $("#txtWarehouse")[0].selectedOptions.length;

    var formDataa = new FormData();
    formDataa.append('pmake1', pmake1);
    formDataa.append('pmake', pmake);
    formDataa.append('pname', pname);
    formDataa.append('frmdata', sdate);
    formDataa.append('todate', ddatee);
    formDataa.append('negative', negative);
    for (i = 0; i < count; i++) {
        formDataa.append('wharehouse', document.getElementById("txtWarehouse").selectedOptions[i].text);
    }
    $.ajax({
        type: 'Post',
        url: '/api/stockreport/ComparisonReport',
        async: false,
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        data: formDataa,
        success: function (data) {
            if (data.success) {
                dataTable = $("#ComparisonTable").DataTable({
                    ajax: {
                        'url': '/api/stockreport/GetComparisonReport',
                        'type': 'GET',
                        'contentType': 'application/json'
                    },
                    columns: [
                        { 'data': null, 'defaultContent': '', 'width': '2%' },
                        { 'data': 'pname', 'defaultContent': '', 'width': '20%' },
                        { 'data': 'psize', 'defaultContent': '', 'width': '10%' },
                        { 'data': 'pclass', 'defaultContent': '', 'width': '10%' },
                        { 'data': 'location', 'defaultContent': '', 'width': '10%' },
                        {
                            'data': 'id', 'render': function (data, type, row) {
                                return `<span>${row.qty.toFixed(2)} ${row.unit}</span>`;
                            }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
                        },
                        {
                            'data': 'id', 'render': function (data, type, row) {
                                return `<span>${row.altqty} ${row.altunit}</span>`;
                            }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
                        },
                        {
                            'data': 'id', 'render': function (data, type, row) {
                                return `<span>${row.qty1.toFixed(2)} ${row.unit1}</span>`;
                            }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
                        },
                        {
                            'data': 'id', 'render': function (data, type, row) {
                                return `<span>${row.altqty1} ${row.altunit1}</span>`;
                            }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
                        },

                    ],
                    dom: 'Bfrtip',
                    "bDestroy": true,
                    "paging": false,
                    "searching": true,
                    "ordering": true,
                    "info": false,
                    "scrollX": true,
                    "responsive": true,
                    buttons: [
                        {
                            text: 'Print',
                            action: function (e, dt, node, config) {
                                window.open('../ComparisonReportPrint', '_blank');
                            }
                        },
                        {
                            extend: 'excel',
                            text: '<i class="fas fa-file-excel"></i> Excel',
                            title: 'Brand Comparison Report',

                        },
                    ],
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
            else {
                toastr.error(data.message);
            }
        }
    });


}

function selectall() {
    var selectt = document.getElementById("checkall").checked;
    if (selectt == true) {
        $.ajax({
            type: 'Post',
            url: "api/itemdatatable/GetTable",
            data: { type: "godown" },
            success: function (data) {
                if (data.success) {
                    $('#txtWarehouse').empty();
                    $.each(data.data, function (key, value) {
                        $('#txtWarehouse').append($("<option selected></option>").val(value.id).html(value.desc));
                    });
                }
            }
        })
    }
    else {
        documnet.getElementById("txtWarehouse").disabled = false;
    }
}
function stockWiseReport() {

    var ddate = document.getElementById("todate1").value;
    if (summary == true) {
        stkSummary1();
    } else {
        if (document.getElementById("stkwise").innerHTML == "Item Wise") {
            document.getElementById("godownHeading").innerHTML = "Item Wise Record";
            document.getElementById("stkwise").innerHTML = "Godown Wise"
            dataTable = $("#productnametable").DataTable({
                ajax: {
                    'url': '/api/stockreport/StockWisePnameList',
                    data: {
                        ddate: ddate,
                    },
                    'type': 'GET',
                    'contentType': 'application/json'
                },
                columns: [
                    { 'data': null, 'defaultContent': '', 'width': '2%' },
                    { 'data': 'pname', 'defaultContent': '', 'width': '60%' },
                    {
                        'data': 'id', 'render': function (data) {
                            return `<a class="btn btn-info btn-sm" style="color:white" onclick=StockWiseProductDetailsDiv("",this)> <i class="fa fa-cubes">
                              </i>
                              View Stock</a>
                             `;
                        }, 'width': '10%'
                    },

                ],
                dom: 'Bfrtip',
                "bDestroy": true,
                "paging": false,
                "searching": true,
                "ordering": true,
                "info": false,
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
            document.getElementById("listTablediv").style.display = "none";
            document.getElementById("productnametablediv").style.display = "block";
            document.getElementById("productdetailstablediv").style.display = "none";
            document.getElementById("MonthWiseTablediv").style.display = "none";
            document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
            document.getElementById("productname").style.display = "none";
        }
        else {
            document.getElementById("stkwise").innerHTML = "Item Wise";
            LoadDatatable();
        }
    }

}
function StockWiseProductDetailsDiv(pname, button) {
    if (pname == "") {
        var row = $(button).closest("TR");
        pname = $("TD", row).eq(1).html();
    }
    var zerostk = document.getElementById("Zerostk").checked;
    document.getElementById("productname").innerHTML = pname;
    var ddate = document.getElementById("todate1").value;
    dataTable = $("#productdetailstable").DataTable({
        ajax: {
            'url': '/api/stockreport/StockWisePnameDetailsList',
            data: {
                ddate: ddate,
                pname: pname,
                zerostk: zerostk,
            },
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '', 'width': '1%' },
            { 'data': 'pname', 'defaultContent': '', 'width': '30%' },
            { 'data': 'psize', 'defaultContent': '', 'width': '10%' },
            { 'data': 'pclass', 'defaultContent': '', 'width': '10%' },
            { 'data': 'pmake', 'defaultContent': '', 'width': '10%' },
            {
                'data': 'qty', 'render': function (data, type, row) {
                    if (row.unit != null) {
                        return `<span>${row.qty.toFixed(2)} ${row.unit} </span>`;
                    }
                    else {
                        return `<span>${row.qty.toFixed(2)}</span>`;
                    }
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'altqty', 'render': function (data, type, row) {
                    if (row.altunit != null) {
                        return `<span>${row.altqty} ${row.altunit}</span>`;
                    }
                    else {
                        return `<span>${row.altqty}  </span>`;

                    }
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'weight', 'render': function (data, type, row) {
                    return `<span>${data.toFixed(2)}  </span>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'null', 'render': function (data, type, row) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=StockWiseMonthWiseStockDIv(this)> <i class="fa fa-cubes">
                              </i>View Stock</a>`;
                }, 'width': '12%'
            },
            {
                "className": 'details-control1',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },

        ],
        order: [[9, 'asc']],
        initComplete: function () {
            init = false;
        },
        createdRow: function (row, data, index) {
            if (data.extn === '') {
                var td = $(row).find("td:first");
                td.removeClass('details-control');
            }
        },
        rowCallback: function (row, data, index) {
        },
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6],
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6],
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
                    columns: [0, 1, 2, 3, 4, 5, 6]
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
                    var frmdt = document.getElementById('frmdate').innerHTML;
                    var todt = document.getElementById('todate').innerHTML;
                    return pnsdo()
                    function pnsdo() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;">${frmdt}-${todt} <br />${companyname}</div>`
                    }
                }

            },],
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "info": false,
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
    document.getElementById("summrydiv").style.display = "block";
    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "block";
    document.getElementById("MonthWiseTablediv").style.display = "none";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
    document.getElementById("productname").style.display = "block";
}
function StockWiseMonthWiseStockDIv(button) {

    var row = $(button).closest("TR");
    var psize = $("TD", row).eq(2).html();
    var pclass = $("TD", row).eq(3).html();
    var pmake = $("TD", row).eq(4).html();
    document.getElementById("ProductDescription").style.display = "block";

    document.getElementById("ProductDescription").innerHTML = psize + " " + pclass + " " + pmake;
    document.getElementById("ProductSize").innerHTML = psize;
    document.getElementById("ProductClass").innerHTML = pclass;
    document.getElementById("ProductMake").innerHTML = pmake;
    var sdate = document.getElementById("frmdate").innerHTML;
    var parts = sdate.split('/');
    sdate = new Date(parts[2], parts[1] - 1, parts[0]);
    sdate = moment(sdate).format('YYYY-MM-DD');

    var ddatee = document.getElementById("todate").innerHTML;
    partss = ddatee.split('/');
    var ddatee = new Date(partss[2], partss[1] - 1, partss[0]);
    ddatee = moment(ddatee).format('YYYY-MM-DD');
    var location = document.getElementById("godownHeading").innerHTML;
    var pname = document.getElementById("productname").innerHTML;

    dataTable = $("#MonthWiseTable").DataTable({
        ajax: {
            'url': '/api/stockreport/StockWiseMonthReport',
            'type': 'GET',
            'data': {
                sdate: sdate,
                ddate: ddatee,
                pname: pname,
                psize: psize,
                pclass: pclass,
                pmake: pmake,
            },
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '', 'width': '0%' },
            { 'data': 'description', 'defaultContent': '', 'width': '30%' },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span> ${row.inqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.inaltqty} ${row.altunit}</span>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.outqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.outaltqty} ${row.altunit}</span>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.balqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.balaltqty} ${row.altunit}</span>`;
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },

            {
                'data': 'null', 'render': function (data, type, row) {
                    if (row.description == "Opening Balance") {
                        return `<a></a>`;
                    }
                    else {
                        return `<a class="btn btn-info btn-sm" style="color:white" onclick=StockWiseMonthWiseDetailsStockDIv("${row.monthname}",${row.year})> <i class="fa fa-cubes">
                              </i>View Stock</a>`;
                    }

                }, 'width': '10%'
            },

        ],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7],
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
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
                },
                customize: function (list) {
                    $(list.document.body).find('table').css('font-size', '10pt');
                    $(list.document.body).find('table').css('border', '1px solid #000');
                    $(list.document.body).find('table td').css('border-left', '1px solid #000');
                    $(list.document.body).find('table td').css('border-top', '1px solid #000');
                    $(list.document.body).find('table td').css('border-right', '1px solid #000');
                    $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                },
                title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

            },],
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": false,
        "scrollX": true,
        "responsive": true,
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });

    $.ajax({
        'url': '/api/stockreport/totalfooter',
        'type': 'GET',
        'data': {
            sdate: sdate,
            ddate: ddatee,
            location: location,
            pname: pname,
            psize: psize,
            pclass: pclass,
            pmake: pmake,
        },
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                var unit = data.data.altunit;
                if (unit == null) {
                    unit = "";
                }
                $('#MonthWiseTable tfoot tr:first').html(data.data.inqty.toFixed(2) + " " + data.data.unit);
                document.getElementById("grandinqty").innerHTML = data.data.inqty.toFixed(2) + " " + data.data.unit;
                $('#MonthWiseTable tfoot ').html(data.data.outqty.toFixed(2) + " " + data.data.unit);
                document.getElementById("grandinaltqty").innerHTML = data.data.inaltqty + " " + unit;
                document.getElementById("grandoutqty").innerHTML = data.data.outqty.toFixed(2) + " " + data.data.unit;
                document.getElementById("grandoutaltqty").innerHTML = data.data.outaltqty + " " + unit;
                document.getElementById("grandbalqty").innerHTML = data.data.balqty.toFixed(2) + " " + data.data.unit;
                document.getElementById("grandbalaltqty").innerHTML = data.data.balaltqty + " " + unit;
            }

        }
    });

    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "none";
    document.getElementById("MonthWiseTablediv").style.display = "block";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
    document.getElementById("productname").style.display = "block";



}
function StockWiseMonthWiseDetailsStockDIv(MonthName, year) {
    document.getElementById("summrydiv").style.display = "block";
    document.getElementById("MonthName").style.display = "block";
    document.getElementById("MonthName").innerHTML = MonthName + " " + year;
    document.getElementById("ProductDescription").style.display = "block";
    var psize = document.getElementById("ProductSize").innerHTML;
    var pclass = document.getElementById("ProductClass").innerHTML;
    var pmake = document.getElementById("ProductMake").innerHTML;
    var sdate = document.getElementById("frmdate").innerHTML;
    var parts = sdate.split('/');
    sdate = new Date(parts[2], parts[1] - 1, parts[0]);
    sdate = moment(sdate).format('YYYY-MM-DD');
    var month1 = MonthName.toLowerCase();
    var months = ["janurary", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    month1 = months.indexOf(month1) + 1;
    var ddatee = document.getElementById("todate").innerHTML;
    partss = ddatee.split('/');
    var ddatee = new Date(partss[2], partss[1] - 1, partss[0]);
    ddatee = moment(ddatee).format('YYYY-MM-DD');
    var pname = document.getElementById("productname").innerHTML;

    dataTable = $("#MonthWiseDetilasTable").DataTable({

        ajax: {
            'url': '/api/stockreport/StockWiseMonthWiseReport',
            'data': {
                monthh: month1,
                yearr: year,
                sdate: sdate,
                ddate: ddatee,
                pname: pname,
                psize: psize,
                pclass: pclass,
                pmake: pmake,
            },
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns: [
            {
                'data': 'date', 'render': function (data) {
                    var date = data;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MMM-YY');
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;
                }, 'width': '10%', 'font-size': '6px'
            },
            { 'data': 'description', 'defaultContent': '', 'width': '15%', 'font-size': '1%' },
            { 'data': 'vchtype', 'defaultContent': '', 'width': '8%' },
            { 'data': 'vchno', 'defaultContent': '', 'width': '10%' },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span> ${row.inqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.inaltqty} ${row.altunit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.outqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.outaltqty} ${row.altunit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.balqty.toFixed(2)} ${row.unit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<span>${row.balaltqty} ${row.altunit}</span>`;
                }, 'width': '9%', 'className': "text-right", 'font-size': '5px'
            },

            {
                'data': 'null', 'render': function (data, type, row) {
                    if (row.description == "Opening Balance") {
                        return `<a></a>`;
                    }
                    else {
                        return `<a class="btn btn-info btn-sm" style="color:white" onclick=redirectt("${row.vchno}","${row.vchtype}")> <i class="fa fa-cubes">
                              </i></a>`;
                    }
                }, 'width': '2%'
            },

        ],
        dom: 'lBfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                },
                customize: function (list) {
                    $(list.document.body).find('table').css('font-size', '10pt');
                    $(list.document.body).find('table').css('border', '1px solid #000');
                    $(list.document.body).find('table td').css('border-left', '1px solid #000');
                    $(list.document.body).find('table td').css('border-top', '1px solid #000');
                    $(list.document.body).find('table td').css('border-right', '1px solid #000');
                    $(list.document.body).find('table td').css('border-bottom', '1px solid #000');
                },
                title: '<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;">27-01-2022<br />PIPE & SECTIONS PVT. LTD</div>',

            },],
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": false,
        "scrollX": true,
        "responsive": true,



        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "none";
    document.getElementById("MonthWiseTablediv").style.display = "none";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "block";
    document.getElementById("productname").style.display = "block";
}
function stkSummary() {
    var now = document.getElementById("todate1").value;
    var ddate = moment(now).format('YYYY-MM-DD');
    conditiontable = $("#GodownlistTable").DataTable({
        ajax: {
            'url': '/api/stockreport/GodownWise?ddate=' + ddate,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'location', 'defaultContent': '', 'width': '60%' },
            { 'data': 'name', 'defaultContent': '', 'width': '60%' },
            {
                'data': 'id', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=findgodownname(${data})> <i class="fa fa-cubes"></i>View Stock</a>`;
                }, 'width': '10%'
            },
        ],
        dom: 'frtip',
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": false,
        "scrollX": true,
        "responsive": true,

        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
}

function ViewGodownList() {
    Swal.fire({
        html: `<div class="card">
                     <div class="card-body">
                                    <div id="GodownlistTablediv">
                                        <table id="GodownlistTable" class="table table-bordered table-hover display">
                                            <thead>
                                                <tr>
                                                    <th style="font-family: 'sans-serif'; font-weight: normal;">WhareHouse Location</th>
                                                    <th style="font-family: 'sans-serif';  font-weight: normal;">Actions</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
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
    var now = document.getElementById("todate1").value;
    var ddate = moment(now).format('YYYY-MM-DD');
    conditiontable = $("#GodownlistTable").DataTable({
        ajax: {
            'url': '/api/stockreport/GodownWise?ddate=' + ddate,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'location', 'defaultContent': '', 'width': '60%' },
            {
                'data': 'id', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=findgodownname(${data})> <i class="fa fa-cubes"></i>View Stock</a>`;
                }, 'width': '10%'
            },
        ],
        dom: 'frtip',
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": false,
        "scrollX": true,
        "responsive": true,

        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });

}
function stkSummary1() {
    var gdbutton = document.getElementById("stkwise").innerHTML;
    if (gdbutton == "Godown Wise") {
        var gd = "";
        stkSummary11(gd);
    }
    else {
        ViewGodownList();
    }

}
function findgodownname(id) {
    $.ajax({
        'url': '/api/stockreport/GodownName?gdid=' + id,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                stkSummary11(data.gdname);
                document.getElementById("godownHeading").innerHTML = data.gdname;
            }
        }
    });

}
function stkSummary11(gd) {
    /*STOCK SUMMARY*/
    document.getElementById("summrydiv").style.display = "block";
    var ddate = document.getElementById("todate1").value;
    var url = "";
    if (gd == "jk") {
        url = '/api/stockreport/StockWisePnameDetailsListStkSmry';
    }
    else {
        url = '/api/stockreport/GodownWisePnameDetailsListStkSmry';

    }
    dataTable = $("#productdetailstable").DataTable({
        ajax: {
            'url': url,
            data: {
                ddate: ddate,
                gd: gd,
            },
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'sr', 'defaultContent': '', 'width': '1%' },
            { 'data': 'pname', 'defaultContent': '', 'width': '30%' },
            { 'data': 'psize', 'defaultContent': '', 'width': '10%' },
            { 'data': 'pclass', 'defaultContent': '', 'width': '10%' },
            { 'data': 'pmake', 'defaultContent': '', 'width': '10%' },

            {
                'data': 'qty', 'render': function (data, type, row) {
                    if (row.unit != null) {
                        return `<span>${row.qty.toFixed(2)} ${row.unit} </span>`;
                    }
                    else {
                        return `<span>${row.qty.toFixed(2)}</span>`;
                    }
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'altqty', 'render': function (data, type, row) {
                    if (row.altunit != null) {
                        return `<span>${row.altqty} ${row.altunit}</span>`;
                    }
                    else {
                        return `<span>${row.altqty}  </span>`;

                    }
                }, 'width': '10%', 'className': "text-right", 'font-size': '5px'
            },
            {
                'data': 'weight', 'render': function (data) {
                    return `<a>${data.toFixed(2)}</a>`;
                }, 'width': '10%', 'className': "text-right",
            },
            {
                'data': 'null', 'render': function (data, type, row) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=MonthWiseStockDIv(this,"${row.sizeid}","${row.classid}","${row.makeid}")> <i class="fa fa-cubes">
                              </i>View Stock</a>`;
                }, 'width': '12%'
            },

        ],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Excel',
                title: 'STOCK REPORT',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6],
                },

            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                message: '',
                orientation: 'portrait',
                title: 'STOCK REPORT',

                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6],
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
                    columns: [0, 1, 2, 3, 4, 5, 6]
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
                    var frmdt = document.getElementById('frmdate').innerHTML;
                    var todt = document.getElementById('todate').innerHTML;
                    return pnsdo()
                    function pnsdo() {
                        return `<div style="text-align:center;"><h3 style="font-size:25px; font-family: "Times New Roman", Times, serif;">STOCK REPORT</h3></div><div style="text-align:center;font-size:13px;">${frmdt}-${todt} <br />${companyname}</div>`
                    }
                }

            },],
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "info": false,
        "scrollX": true,
        "responsive": true,


        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });

    document.getElementById("listTablediv").style.display = "none";
    document.getElementById("productnametablediv").style.display = "none";
    document.getElementById("productdetailstablediv").style.display = "block";
    document.getElementById("MonthWiseTablediv").style.display = "none";
    document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
    document.getElementById("productname").style.display = "block";
    document.getElementById("productname").innerHTML = "Stock Summery";

}
function AllItem() {



}

function categorywisePnamelist(id, button) {

    document.getElementById("godownHeading").innerHTML = "Stock Report at a Glance";
    document.getElementById("godownid").innerHTML = id;
    var ddate = document.getElementById("todate1").value;
    if (id == "") {
        var url = '/api/stockreport/categorywisePnamelist';

    } else {
        var url = '/api/stockreport/categorywisePnamelist';
    }

    $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        data: {
            ddate: ddate,
            id: id,
        },
        success: function (data) {

            results = data.data;
            cols = [
                {
                    "mDataProp": "pname", sTitle: "Product Name", 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data}</a>`;
                    }, sType: "string",
                },
                {
                    "mDataProp": "psize", sTitle: "Size", 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data}</a>`;
                    }, sType: "string",
                },
                {
                    "mDataProp": "pclass", sTitle: "Class", 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data}</a>`;
                    }, sType: "string",
                },
                {
                    "mDataProp": "pmake", sTitle: "Make", 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data}</a>`;
                    }, sType: "string",
                },

                {
                    "mDataProp": "qty1", sTitle: "Qty", 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data} ${row.unit}</a>`;
                    }, sType: "string", 'className': "text-right"
                },
                {
                    "mDataProp": "altQty1", sTitle: "AltQty", 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data} ${row.altunit}</a>`;
                    }, sType: "string", 'className': "text-right"
                },
                {
                    "mDataProp": "weight1", sTitle: "Weight", 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data}</a>`;
                    }, sType: "string", 'className': "text-right"
                },

            ];
            var col_num = 7;
            for (let i = 1; i < data.ct.length; i++) {
                let k = 2;
                cols.splice(col_num + 1, 1, {
                    "mDataProp": "qty" + k, 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data} ${row.unit}</a>`;
                    }, sTitle: "Qty", sType: "string", 'className': "text-right table-cell-grn"
                });
                cols.splice(col_num + 2, 1, {
                    "mDataProp": "altQty" + k, 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data} ${row.altunit}</a>`;
                    }, sTitle: "AltQty", sType: "string", 'className': "text-right table-cell-grn"
                });
                cols.splice(col_num + 3, 1, {
                    "mDataProp": "weight" + k, 'render': function (data, type, row) {
                        return `<a style='font-size:12px;'>${data}</a>`;
                    }, sTitle: "Weight", sType: "string", 'className': "text-right table-cell-grn"
                });

                col_num = col_num + 3;
                k = k + 1;
            }

            cols.splice(col_num + 1, 1, {
                "mDataProp": "totalqty", 'render': function (data, type, row) {
                    return `<a style='font-weight: 500; font-size:12px;'>${data} ${row.unit}</a>`;
                }, sTitle: "Total Qty", sType: "string", 'className': "text-right table-cell-yl"
            });
            cols.splice(col_num + 2, 1, {
                "mDataProp": "totalAltQty", 'render': function (data, type, row) {
                    return `<a style='font-weight: 500; font-size:12px;'>${data} ${row.altunit}</a>`;
                }, sTitle: "Total Alt Qty", sType: "string", 'className': "text-right table-cell-yl"
            });
            cols.splice(col_num + 2, 1, {
                "mDataProp": "totalweight", 'render': function (data, type, row) {
                    return `<a style='font-weight: 500; font-size:12px;'>${data}</a>`;
                }, sTitle: "Total Weight", sType: "string", 'className': "text-right table-cell-yl"
            });


            data_table = $('#GlanceTable').dataTable({
                "bJQueryUI": true,
                "bDeferRender": true,
                "bInfo": false,
                "bSort": false,
                "bDestroy": true,
                "bFilter": false,
                "bPagination": false,
                "aaData": results,
                "aoColumns": cols,
                "paging": false,
            });
            let l = 3;
            data_table.fnDestroy();
            /*  for (let i = 0; i < data.ct.length; i++) {
                  $("#GlanceTable thead tr th").eq(l).after('<th colspan="3">' + data.ct[i] + '</th>');
                  l=l+1
              }
              $("#GlanceTable thead tr th").eq(l).after('<th colspan="3">Total Qty</th>');*/
        }
    });


    /* document.getElementById("listTablediv").style.display = "none";
     document.getElementById("productnametablediv").style.display = "block";
     document.getElementById("stksmry").style.display = "block";
     document.getElementById("productdetailstablediv").style.display = "none";
     document.getElementById("MonthWiseTablediv").style.display = "none";
     document.getElementById("MonthWiseDetilasTablediv").style.display = "none";
     document.getElementById("productname").style.display = "none";*/

}

function fillcategory() {
    dataTable2 = $("#CategorylistTable").DataTable({
        ajax: {
            'url': '/api/stockreport/fillcategory',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'productcategory', 'defaultContent': '', 'width': '60%' },
            {
                'data': 'id', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=categorywisePnamelist(${data},'category') data-toggle="modal" data-target="#CategoryListModel"> <i class="fa fa-cubes"></i>View Stock</a>`;
                }, 'width': '10%'
            },
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
}
function itemwisedata() {
    var ddate = document.getElementById("todate1").value;
    dataTable1 = $("#ItemlistTable").DataTable({
        ajax: {
            'url': '/api/stockreport/StockWisePnameList',
            data: {
                ddate: ddate,
            },
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '', 'width': '2%' },
            { 'data': 'pname', 'defaultContent': '', 'width': '60%' },
            {
                'data': 'id', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=categorywisePnamelist("",this)> <i class="fa fa-cubes">
                              </i>
                              View Stock</a>
                             `;
                }, 'width': '10%'
            },

        ],
        dom: 'frtip',
        "bDestroy": true,
        "paging": false,
        "searching": true,
        "ordering": true,
        "info": false,
        "scrollX": true,
        "responsive": true,


        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    dataTable1.on('order.dt search.dt', function () {
        dataTable1.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}


var data_table, row_num = 1, col_num = 3, row_cell = 1, col_cell = 0, iter = 0;
var cols = [/*
    { "mDataProp": "Field1", sTitle: "Date", sType: "date" },
    { "mDataProp": "Field2", sTitle: "Number", sType: "numeric" },
    { "mDataProp": "Field3", "sTitle": "FName", sType: "string" },
    { "mDataProp": "Field4", sTitle: "LName", sType: "string" }*/
];


//Get stored data from HTML table element
var results = [];

function initDT() {
    //Construct the measurement table
    data_table = $('#GlanceTable').dataTable({
        "bJQueryUI": true,
        "bDeferRender": true,
        "bInfo": false,
        "bSort": false,
        "bDestroy": true,
        "bFilter": false,
        "bPagination": false,
        "aaData": results,
        "aoColumns": cols,
    });
    attachTableClickEventHandlers();
}

/*initDT();*/

function attachTableClickEventHandlers() {
    //row/column indexing is zero based
    $("#GlanceTable thead tr th").click(function () {
        col_num = parseInt($(this).index());
        console.log("column_num =" + col_num);
    });
    $("#GlanceTable tbody tr td").click(function () {
        col_cell = parseInt($(this).index());
        row_cell = parseInt($(this).parent().index());
        console.log("Row_num =" + row_cell + "  ,  column_num =" + col_cell);
    });
};


$("#btnAddRow").click(function () {
    //adding/removing row from datatable datasource
    //create test new record
    var aoCols = data_table.fnSettings().aoColumns;
    var newRow = new Object();
    for (var iRec = 0; iRec < aoCols.length; iRec++) {

        if (aoCols[iRec]._sManualType === "date") {
            newRow[aoCols[iRec].mDataProp] = "2011/03/25";
        } else if (aoCols[iRec]._sManualType === "numeric") {
            newRow[aoCols[iRec].mDataProp] = 10;
        } else if (aoCols[iRec]._sManualType === "string") {
            newRow[aoCols[iRec].mDataProp] = 'testStr';
        }
    }
    results.splice(row_cell + 1, 0, newRow);
    data_table.fnDestroy();
    initDT();
    addDBClikHandler();
});

$('#btnAddCol').click(function () {

    //new column information
    //row's new field(for new column)
    //cols must be updated
    cols.splice(col_num + 1, 0, { "mDataProp": "newField" + iter, sTitle: "Col-" + iter, sType: "string" });
    //update the result, actual data to be displayed
    for (var iRes = 0; iRes < results.length; iRes++) {
        results[iRes]["newField" + iter] = "data-" + iter;
    }
    //destroy the table
    data_table.fnDestroy();
    $("#GlanceTable thead tr th").eq(col_num).after('<th>Col-' + iter + '</th>');
    //init again
    initDT();
    iter++;
    col_num++;
    /* addDBClikHandler();*/
});



var type1 = ["anil", "amit", "cd", "vvv", "vvvvvv", "99", "999", "1", "1111", "hhh", "ttt"];

function restoreRow(oTable, nRow) {
    var aData = oTable.fnGetData(nRow);
    var jqTds = $('>td', nRow);

    for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
        oTable.fnUpdate(aData[i], nRow, i, false);
    }
};

function editRow(oTable, nRow) {
    var aData = oTable.fnGetData(nRow);
    var jqTds = $('>td', nRow);
    jqTds[col_cell].innerHTML = '<input type="text" id ="typ" value="' + aData[cols[col_cell].mData] + '"/>';
    $("#typ").autocomplete({ source: type1 });
};

function saveRow(oTable, nRow) {
    var jqInputs = $('input', nRow);
    oTable.fnUpdate(jqInputs[0].value, row_cell, col_cell, false);
};

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "date-uk-pre": function (a) {
        var ukDatea = a.split('/');
        return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1
    },

    "date-uk-asc": function (a, b) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "date-uk-desc": function (a, b) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

/* Get the rows which are currently selected */
function fnGetSelected(oTableLocal) {
    var aReturn = new Array();
    var aTrs = oTableLocal.fnGetNodes();

    for (var i = 0; i < aTrs.length; i++) {
        if ($(aTrs[i]).hasClass('row_selected')) {
            aReturn.push(aTrs[i]);
        }
    }
    return aReturn;
};

function addDBClikHandler() {
    $('#GlanceTable tbody tr').on('dblclick', function (e) {
        e.preventDefault();

        var nRow = $(this)[0];

        var jqTds = $('>td', nRow);
        if ($.trim(jqTds[0].innerHTML.substr(0, 6)) != '<input') {
            if (nEditing !== null && nEditing != nRow) {
                /* Currently editing - but not this row - restore the old before continuing to edit mode */
                restoreRow(oTable, nEditing);
                nEditing = nRow;
                editRow(oTable, nRow);

            }
            else {
                /* No edit in progress - let's start one */
                nEditing = nRow;
                editRow(oTable, nRow);

            }
        }


    });

    $('#GlanceTable tbody tr').keydown(function (event) {

        if (event.keyCode == 13) {
            event.preventDefault();

            if (nEditing == null)
                alert("Select Row");
            else
                saveRow(oTable, nEditing);
            nEditing = null;
        }
        /* Editing this row and want to save it */

    });


};

var nEditing = null;

var oTable = null;
