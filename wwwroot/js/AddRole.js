$(document).ready(function () {


});

function LoadDatatable() {
    dataTable = $("#listTable").DataTable({
        ajax: {
            'url': '/api/UserManagement/Getrolelist',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '2%' },
            { 'data': 'rolename', 'defaultContent': '_', 'width': '5%' },
            {
                'data': 'roleid', 'render': function (data,type,row) {
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick=updaterole("${row.roleid}","${row.rolename}")> <i class="fas fa-pencil-alt">
                              </i>
                              Edit</a>
                               
                             
                                    <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteitem(${data})>  <i class="fas fa-trash">
                              </i>
                              Delete</a>`;
                }, 'width': '5%'
            },

        ],
        "dom": 'Bfrtip',
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
                url: "api/UserManagement/Deleterole",
                data: {
                    Id: id,
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire(
                            'Deleted!',
                            'Role has been deleted.',
                            'success'
                        )
                        /* toastr.success(data.message);*/
                        dataTable.ajax.reload();
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            });

        };
    })

}
function addrole() {
    Swal.fire({
        html: ` <div class="parent">
                    <img src="../imgs/adduser.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style=" clip-path: circle(); height:80px">
                    <span></span>
                    <h3 style="font-family: Garamond ">Add Role</h3>
                </div> 
                 <input type="text" id="rolename" class="swal2-input" placeholder="RoleName" style="width:70%"> <br>
                  `,
        confirmButtonText: 'Add',
        focusConfirm: false,
        width: "40%",
        preConfirm: () => {
            const rolename = Swal.getPopup().querySelector("#rolename").value;
            return {Rolename: rolename};
        }
    }).then((result) => {
        const roleName = `${result.value.Rolename}`;
        $.ajax({
            type: 'Post',
            url: "api/UserManagement/Addrole",
            data: {
                Rolename: roleName,
            },
            success: function (data) {
                if (data.success) {
                    Swal.fire('Saved!', '', 'success')
                    /*toastr.success(data.message);*/
                    dataTable.ajax.reload();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });
}
function updaterole(idd, desc) {

    Swal.fire({
        html: `    <div class="parent">
                    <img src="../imgs/adduser.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style=" clip-path: circle(); height:80px">
                    <span></span>
                    <h3 style="font-family: Garamond ">Add Role</h3>
                </div>
                <input type="hidden" id="id" class="swal2-input" placeholder="RoleName" style="width:70%" value=${idd}>
                 <input type="text" id="rolename" class="swal2-input" placeholder="RoleName" style="width:70%" value=${desc}> <br>
                  `,
        confirmButtonText: 'Update',
        focusConfirm: false,
        preConfirm: () => {
            const newdesc = Swal.getPopup().querySelector("#rolename").value;
            const id = Swal.getPopup().querySelector("#id").value;
            if (!newdesc) {
                Swal.showValidationMessage(`Value Cannot be null `)
            }
            return {
                newdesc: newdesc, id: id
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const desc = `${result.value.newdesc}`;
            const id = `${result.value.id}`;
            $.ajax({
                type: 'Post',
                url: "api/UserManagement/updaterole",
                data: {
                    rolename: desc, roleid: id
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
    });
}