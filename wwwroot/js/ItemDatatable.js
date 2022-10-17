var type = "";
$(document).ready(function () {
    LoadDatatable()
});
function LoadDatatable() {
    var url = new URLSearchParams(window.location.search);
    type = url.get('Id');
    if (type == "pname") {
        document.getElementById('tit').innerHTML = 'Product Name';
        document.getElementById('titt').innerHTML = 'Product Name';

    } else if (type == "size") {
        document.getElementById('tit').innerHTML = 'Product Size';
        document.getElementById('titt').innerHTML = 'Product Size';
    }
    else if (type == "class") {
        document.getElementById('tit').innerHTML = 'Product Class';
        document.getElementById('titt').innerHTML = 'Product Class';
    }
    else if (type == "make") {
        document.getElementById('tit').innerHTML = 'Product Make';
        document.getElementById('titt').innerHTML = 'Product Make';
    }
    else if (type == "unit") {
        document.getElementById('tit').innerHTML = 'Product Unit';
        document.getElementById('titt').innerHTML = 'Product Unit';
    }
    else if (type == "category") {
        document.getElementById('tit').innerHTML = 'Product Category';
        document.getElementById('titt').innerHTML = 'Product Category';
    }
    else if (type == "godown") {
        document.getElementById('tit').innerHTML = 'Godown Details';
        document.getElementById('titt').innerHTML = 'Godown Details';
    }
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
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=updatelist("${row.id}","${row.type}")> <i class="fas fa-pencil-alt"></i>Edit</a>
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
    var url = new URLSearchParams(window.location.search);
    var type = url.get('Id');
    Swal.fire({
        html: `     <div style="height:42px;width:42px"></div>
                    <input type="hidden" id="type"  value="${type}"><br>
                   <label>Enter Detailes</label>&nbsp;&nbsp;&nbsp;
                    <input type="text" id="desc"  ><br>
  <div class="form-group">
                    <i class='fa fa-map-marker' style='font-size:25px'></i>
                    <input type="text" id="location" placeholder="Enter Location" /
                    </div>
                  `,
        confirmButtonText: 'Add',
        focusConfirm: false,
        preConfirm: () => {
            const desc = Swal.getPopup().querySelector("#desc").value;
            const location = Swal.getPopup().querySelector("#location").value;
            const type = Swal.getPopup().querySelector("#type").value;
            if (!desc) {
                Swal.showValidationMessage(`Value Cannot be null `)
            }
            return {
                desc: desc, type: type, location: location,

            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const desc = `${result.value.desc}`;
            const type = `${result.value.type}`;
            const location = `${result.value.location}`;
            $.ajax({
                type: 'Post',
                url: "api/itemdatatable/AddItem",
                data: {
                    desc: desc, type: type, location: location
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire('Saved!', '', 'success')
                        dataTable.ajax.reload();
                    }
                    else {
                        Swal.fire(data.message, '', 'info')
                    }
                }
            });




        }
    });
}

function updatelist(idd, type) {
    $.ajax({
        url: '/api/itemdatatable/GetItemById',
        type: 'GET',
        data: {
            id: idd,
            type: type,
        },
        contentType: 'application/json',
        success: function (data) {
            $("#idd").val(data.data.id);
            $("#desc").val(data.data.desc);
            if (type == "godown") {
                document.getElementById("location").style.display = "block";
                $("#location").val(data.data.location);
            }
            else {
                document.getElementById("location").style.display = "none";
            }
        }
    });
    Swal.fire({
        html: `     <div style="height:42px;width:42px"></div>
                    <input type="text" id="idd" hidden />
                    <div class="form-group">
                    <i class='fas fa-user-alt' style='font-size:25px'></i>
                    <input type="text" id="desc" placeholder="Enter Details" />
                    </div>
                    <div class="form-group">
                    <i class='fa fa-map-marker' style='font-size:25px'></i>
                    <input type="text" id="location" placeholder="Enter Location" /
                    </div>`,
        confirmButtonText: 'Update',
        focusConfirm: false,
        preConfirm: () => {
            const newdesc = Swal.getPopup().querySelector("#desc").value;
            const location = Swal.getPopup().querySelector("#location").value;
            const id = Swal.getPopup().querySelector("#idd").value;
            if (!newdesc) {
                Swal.showValidationMessage(`Value Cannot be null `)
            }
            return {
                newdesc: newdesc, id: id, type: type, location: location,
            };
        }
    }).then((result) => {
        if (result.isConfirmed == true) {
            const desc = `${result.value.newdesc}`;
            const location = `${result.value.location}`;
            const id = `${result.value.id}`;
            const type = `${result.value.type}`;
            $.ajax({
                type: 'Post',
                url: "api/itemdatatable/updateItem",
                data: {
                    desc: desc, id: id, type: type, location: location
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire(data.message, '', 'success')
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