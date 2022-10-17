var type = "";
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
$(document).ready(function () {
    LoadDatatable()
    fillunit();
});

function fillunit() {
    $.ajax({
        type: 'Post',
        url: "api/itemdatatable/GetTable",
        data: { type: "unit" },
        success: function (data) {
            if (data.success) {
                $('#unit').empty();
                $('#unit').append("<option value='0'>--Select--</option>");
                $('#altunit').empty();
                $('#altunit').append("<option value='0'>Select</option>");
                $.each(data.data, function (key, value) {
                    $('#unit').append($("<option></option>").val(value.id).html(value.desc));
                    $('#altunit').append($("<option></option>").val(value.id).html(value.desc));

                });
                $("#altunit").select2();
                $("#unit").select2();
            }
        }
    });
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
                        $('#altunit').append($("<option></option>").val(value.id).html(value.desc));
                    }
                });
            }
        }
    });
}

function LoadDatatable() {
    type = "category";


    document.getElementById('tit').innerHTML = 'Product Category';
    document.getElementById('titt').innerHTML = 'Product Category';

    dataTable = $("#companylistTable").DataTable({
        ajax: {
            'url': '/api/itemdatatable/GetTable?type=' + type,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '1%' },
            {
                'data': 'desc', 'render': function (data, typee, row) {
                    if (type == "godown") {
                        return `<a>${row.desc} " ${row.location}"</a>`;
                    }
                    else {
                        return `<a>${row.desc}</a>`;
                    }
                }, 'width': '25%'
            },
            {
                'data': 'id', 'render': function (data, type, row) {
                    return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal" data-backdrop="static" onclick=updatelist("${row.id}","${row.type}")> <i class="fas fa-pencil-alt"></i>Edit</a>
                            <a class="btn btn-danger btn-sm" style="color:white" onclick=deletelist("${row.id}","${row.type}")> <i class="fas fa-trash"></i>Delete</a>`;
                }, 'width': '15%'
            },
        ],
        "dom": 'frtip',

        "paging": true,
        "searching": true,
        "ordering": true,
        "info": true,
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

function addlist() {
    var productcategory = document.getElementById("categoryname").value;
    var unit = document.getElementById("unit").selectedOptions[0].text;
    var unitid = document.getElementById("unit").value;
    var checksecondaryunit = document.getElementById("togBtnunit").checked;
    var altunit = "";
    if (checksecondaryunit == true) {
        altunit = document.getElementById("altunit").selectedOptions[0].text;
        var altunitid = document.getElementById("altunit").value;
    }
    var weightcheck = document.getElementById("togBtnweight").checked;
    var physicalstock = document.getElementById("physicalstock").value;
    var weightunit = "";
    if (weightcheck == true) {
        weightunit = document.getElementById("weightunit").selectedOptions[0].text;
    }
    var id = document.getElementById("itemid").value
    var type = document.getElementById("saveebutton1").innerHTML;
    if ((productcategory == "") || (unit == "")) {
        Toast.fire({
            icon: 'error',
            title: 'Please complete the details'
        })
    } else {
        $.ajax({
            type: 'Post',
            url: "api/itemdatatable/AddCategory",
            data: {
                id: id,
                productcategory: productcategory,
                unit: unit,
                unitid: unitid,
                altunit: altunit,
                altunitid: altunitid,
                weightunit: weightunit,
                type: type,
                physicalstock: physicalstock,
            },
            success: function (data) {
                if (data.success) {
                    Swal.fire(data.message, '', 'success')
                    dataTable.ajax.reload();
                }
                else {
                    Swal.fire(data.message, '', 'info')
                }
            }
        });
    }
}

function updatelist(idd) {
    $.ajax({
        url: '/api/itemdatatable/FillCategory',
        type: 'GET',
        data: {
            id: idd,
        },
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                document.getElementById("itemid").value = data.data.id;
                document.getElementById("categoryname").value = data.data.productcategory;
                $("#unit option[value=" + data.data.unitid + "]").remove();
                $('#unit').append($("<option selected></option>").val(data.data.unitid).html(data.data.unit));
                $("#altunit option[value=" + data.data.altunitid + "]").remove();
                $('#altunit').append($("<option selected></option>").val(data.data.altunitid).html(data.data.altunit));
                document.getElementById("physicalstock").value = data.data.physicalstock;
                document.getElementById("weightunit").value = data.data.weightunit;
                if (data.data.unit == null) {
                    document.getElementById("togBtnunit").checked = false;
                    document.getElementById("altunitdiv").style.display = "none";
                } else {
                    document.getElementById("togBtnunit").checked = true;
                    document.getElementById("altunitdiv").style.display = "block";
                }
                if (data.data.altunit == null) {
                    document.getElementById("togBtnweight").checked = false;
                    document.getElementById("weightdiv").style.display = "none";

                } else {
                    document.getElementById("togBtnweight").checked = true;
                    document.getElementById("weightdiv").style.display = "block";
                }
                document.getElementById("saveebutton1").innerHTML = "Update";
            }
            else {

            }
        }
    });
}

function deletelist(url, type) {
    // Delete Query
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
                url: "api/itemdatatable/Deleteitem",
                data: {
                    Id: url, type: type
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire(
                            'Deleted!',
                            'Your data has been deleted.',
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
        }
    })

}
function hideshowunit() {
    if (document.getElementById("altunitdiv").style.display == "none") {
        document.getElementById("altunitdiv").style.display = "block";
    } else {
        document.getElementById("altunitdiv").style.display = "none";
    }
}

function hideshowweight() {

    if (document.getElementById("weightdiv").style.display == "none") {
        document.getElementById("weightdiv").style.display = "block";
    }
    else {
        document.getElementById("weightdiv").style.display = "none";
    }
}
function resetdata() {
    document.getElementById("itemid").value = "";
    document.getElementById("categoryname").value = "";

    document.getElementById("weightunit").value = "";
    document.getElementById("togBtnunit").checked = false;
    document.getElementById("altunitdiv").style.display = "none";
    document.getElementById("togBtnweight").checked = false;
    document.getElementById("weightdiv").style.display = "none";
    document.getElementById("togBtnweight").checked = false;
    document.getElementById("weightdiv").style.display = "none";
    document.getElementById("saveebutton1").innerHTML = "Save";
    $('#unit').append($("<option selected></option>").val("").html(""));
    $('#altunit').append($("<option selected></option>").val("").html(""));
}
