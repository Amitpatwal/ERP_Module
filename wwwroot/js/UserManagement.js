$(document).ready(function () {
    LoadDatatable();
});

function LoadDatatable() {
    dataTable = $("#listTable").DataTable({
        ajax: {
            'url': '/api/UserManagement/GetUserList',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '2%' },
            { 'data': 'username', 'defaultContent': '_', 'width': '5%' },
            { 'data': 'userid', 'defaultContent': '_', 'width': '5%' },
            {
                'data': 'usid', 'render': function (data) {

                    return `<input type="checkbox" checked data-toggle="toggle" data-size="sm">
`
                },

                'width': '5%'
            },

            {
                'data': 'usid', 'render': function (data, type, row) {
                    return `<a class="btn btn-primary btn-sm" style="color:white" onclick=updateUser(${row.usid})> <i class="fas fa-pencil-alt"></i>Edit</a>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteUser(${row.usid})> <i class="fas fa-trash"></i>Delete </a>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <a class="btn btn-primary btn-sm" style="color:white" onclick=updatePass(${row.usid})>  <i class="fas fa-lock"></i>Update Password</a>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <a class="btn btn-primary btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal" onclick=CompanyPermission(${row.usid})>  <i class="fas fa-lock"></i>Company Permission</a>`;
                }, 'width': '20%'
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
function deleteUser(id) {
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
                url: "api/UserManagement/DeleteUser",
                data: {
                    Id: id,
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire(
                            'Deleted!',
                            'User has been deleted.',
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
function AddUser() {
    Swal.fire({
        html: ` <div class="parent">
                    <img src="../imgs/adduser.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style=" clip-path: circle(); height:80px">
                    <span></span>
                    <h3 style="font-family: Garamond ">Add User</h3>
                </div> 
                 <input type="text" id="username" class="swal2-input" placeholder=" Enter Username" style="width:70%"> <br>
                <input type="text" id="userid" class="swal2-input" placeholder="Enter MailID" style="width:70%"> <br>
                <input type="text" id="password" class="swal2-input" placeholder="Enter Password" style="width:70%"> <br>
                <input type="text" id="retypepassword" class="swal2-input" placeholder="Enter Retype Password" style="width:70%"> <br><br>
                
                  `,
        confirmButtonText: 'Add',
        focusConfirm: false,
        width: "40%",
        preConfirm: () => {
            const unname = Swal.getPopup().querySelector("#username").value;
            const userid = Swal.getPopup().querySelector("#userid").value;
            const pass = Swal.getPopup().querySelector("#password").value;
            const repass = Swal.getPopup().querySelector("#retypepassword").value;
            if (pass == repass) {
                return { username: unname, userid: userid, password: pass, };
            }
            else {
                toastr.error(data.message);

            }

        }
    }).then((result) => {
        const unname = `${result.value.username}`;
        const userid = `${result.value.userid}`;
        const pass = `${result.value.password}`;

        $.ajax({
            type: 'Post',
            url: "api/UserManagement/AddUser",
            data: {
                username: unname,
                userid: userid,
                password: pass,
                IsActive: true,
            },
            success: function (data) {
                if (data.success == true) {
                    Swal.fire('Saved!', '', 'success')
                    dataTable.ajax.reload();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });
    fetchroletype();
}
function fetchroletype() {
    $.ajax({
        url: '/api/UserManagement/Getrolelist',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                $('#roletype').empty();
                $('#roletype').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $('#roletype').append($("<option></option>").val(value.roleid).html(value.rolename));
                });
            }
        }
    });

}
function updateUser(idd) {

    $.ajax({
        'url': '/api/UserManagement/getuserdata?id=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            $("#username").val(data.data.username);
            $("#userid").val(data.data.userid);
            $("#usid").val(data.data.usid);
            $("#roletype option[value=" + data.data.roleId + "]").remove();
            $('#roletype').append($("<option selected></option>").html(data.data.roletype));
            $("#roletype").select2(data.data.roletype);
        }
    })

    Swal.fire({
        html: ` <div class="parent">
                <img src="../imgs/adduser.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style=" clip-path: circle(); height:80px">
                <span></span>
                <h3 style="font-family: Garamond ">Update User</h3>
                </div>
                <input type="hidden" id="usid" class="swal2-input" style="width:70%"> 
                <input type="text" id="username" class="swal2-input" placeholder=" Enter Username" style="width:70%"> <br>
                <input type="text" id="userid" class="swal2-input" placeholder="Enter MailID" style="width:70%"> <br><br>
                  `,
        confirmButtonText: 'Update',
        focusConfirm: false,
        preConfirm: () => {
            const usid = Swal.getPopup().querySelector("#usid").value;
            const username = Swal.getPopup().querySelector("#username").value;
            const userid = Swal.getPopup().querySelector("#userid").value;
            if (!username) {
                Swal.showValidationMessage(`Value Cannot be null `)
            }
            return {
                username: username, userid: userid, usid: usid,
            };
        }


    }).then((result) => {
        if (result.isConfirmed) {
            const username = `${result.value.username}`;
            const userid = `${result.value.userid}`;


            const usid = `${result.value.usid}`;
            $.ajax({
                type: 'Post',
                url: "api/UserManagement/updateUser",
                data: {
                    username: username,
                    userid: userid,
                    usid: usid,
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
function updatePass(idd) {
    Swal.fire({
        html: ` <div class="parent">
                <img src="../imgs/adduser.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style=" clip-path: circle(); height:80px">
                <span></span>
                <h3 style="font-family: Garamond ">Update Password</h3>
                </div>
                <input type="hidden" id="usid" class="swal2-input" style="width:70%" value="${idd}" >              
                <input type="password" id="password" class="swal2-input" placeholder="Enter New Password" style="width:70%">
    <input type="password" id="rtypepassword" class="swal2-input" placeholder="Confirm New Password" style="width:70%"> <br><br>
               
                  `,
        confirmButtonText: 'Update',
        focusConfirm: false,
        preConfirm: () => {
            const usid = Swal.getPopup().querySelector("#usid").value;
            const password = Swal.getPopup().querySelector("#password").value;


            return {
                password: password, usid: usid,
            };
        }


    }).then((result) => {
        if (result.isConfirmed) {


            const password = `${result.value.password}`;

            const usid = `${result.value.usid}`;
            $.ajax({
                type: 'Post',
                url: "api/UserManagement/updatePass",
                data: {

                    password: password,
                    usid: usid,
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
                                title: 'Successfully saved'
                            })
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




function CompanyPermission(usid) {
    $.ajax({
        'url': '/api/UserManagement/getuserdata?id=' + usid,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            document.getElementById("usernameee").innerHTML = data.data.username;
            document.getElementById("usidd").innerHTML = data.data.usid;
            document.getElementById("email").innerHTML = data.data.userid;
        }
    })
    datatable = $("#companylist").DataTable({
        ajax: {
            'url': '/api/UserManagement/getcompanylist?usid=' + usid,
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                { 'data': null, 'defaultContent': '', 'width': '2%' },
                { 'data': 'companyname', 'defaultContent': '', 'width': '80%' },
                {
                    'data': 'id', 'render': function (data, type, row) {
                        if (row.status == true) {
                            return `<a  class="btn btn-info btn-sm" style="background:green;" >Online</a>`;
                        }
                        else {
                            return `<a  class="btn btn-info btn-sm" style="background:red;">Offline</a>`;
                        }

                    }, 'width': '30px', 'className': "text-center"
                },
                { 'data': 'rolename', 'defaultContent': '', 'width': '60%' },
                {
                    'data': 'id', 'render': function (data) {
                        return `<a class="btn btn-info btn-sm" style="color:white" onclick="changePermission(${data})"> <i class="fas fa-pencil-alt"></i>Edit</a> &nbsp;
                        `;
                    }, 'width': '8%'
                },
            ],
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        "bDestroy": true,
    });
    datatable.on('order.dt search.dt', function () {
        datatable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}


function changePermission(perid) {

    $.ajax({
        'url': '/api/UserManagement/CheckPermission?idd=' + perid,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {

            $("#roletype option[value=" + data.data.roleid + "]").remove();
            $('#roletype').append($("<option selected></option>").val(data.data.roleid).html(data.data.rolename));


            if (data.data.permission == true) {
                $("#statuss option[value=True]").remove();
                $('#statuss').append($("<option selected></option>").val("True").html("True"));
            }
            else {
                $("#statuss option[value=False]").remove();
                $('#statuss').append($("<option selected></option>").val("False").html("False"));
            }

        }
    })
    Swal.fire({
        html: ` <div class="parent">
                    <img src="../imgs/adduser.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style=" clip-path: circle(); height:80px">
                    <span></span>
                    <h3 style="font-family: Garamond ">Add User</h3>
                </div>
                    <input type="hidden" id="usid" value="${perid}" class="swal2-input" style="width:70%">
                    <span>Status</span>
                   <select style="width: 70%; alignment:"center" id="statuss">
                        <option value="True">True</option>
                        <option selected value="False">False</option>
                    </select> </br>
                  <span>Role Type</span> <select  id="roletype" placeholder="Select Role" style="width: 70%; alignment:"center"> </select>
                  `,
        confirmButtonText: 'Update',
        focusConfirm: false,
        width: "40%",
        preConfirm: () => {
            const status = Swal.getPopup().querySelector("#statuss").value;
            const perid = Swal.getPopup().querySelector("#usid").value;
            const roletype = Swal.getPopup().querySelector("#roletype").selectedOptions[0].text;;
            const roleid = Swal.getPopup().querySelector("#roletype").value;

            return { status: status, perid: perid, roletype: roletype, roleid: roleid };

        }
    }).then((result) => {
        const status = `${result.value.status}`;
        const perid = `${result.value.perid}`;
        const roletype = `${result.value.roletype}`;
        const roleid = `${result.value.roleid}`;

        $.ajax({
            type: 'Post',
            url: "api/UserManagement/updatepermission",
            data: {
                permission: status,
                id: perid,
                rolename: roletype,
                roleid: roleid,
            },
            success: function (data) {
                if (data.success == true) {
                    Swal.fire('Saved!', '', 'success')
                    datatable.ajax.reload();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });
    fetchroletype();
}