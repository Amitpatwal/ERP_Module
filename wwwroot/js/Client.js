var dataTable;
$(document).ready(function () {
    LoadDatatable();  
})
function LoadDatatable() {
    $.ajax({
        'url': '/api/Client/getClients',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            console.log(data);
        }
    });
    dataTable = $("#dataTable").DataTable({
        ajax: {
            'url': '/api/Client/getClients',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': 'srNo', 'defaultContent': '-', 'width': '5%' },
            { 'data': 'clientName', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'companyName', 'defaultContent': '-', 'width': '20%' },
            {
                'data': 'isactive', 'render': function (data) {
                    if (data == true) {
                        return `<div class="row"><div class="text-center col-md-3">
                                <a class="btn bt-sm btn-success" style="color:white;">Active</a ></div></div>`
                    } else {
                        return `<div class="row"><div class="text-center col-md-3">
                                <a class="btn bt-sm btn-danger" style="color:white;">Inactive</a ></div></div>`
                    }

                }, 'width': '5%'
            },
            { 'data': 'totalFiles', 'defaultContent': '-', 'width': '5%' },
            { 'data': 'totalFolders', 'defaultContent': '-', 'width': '5%' },
            {
                'data': 'srNo', 'render': function (data) {

                    return `<div class="row"><div class="text-center col-md-3">
                                <a href=Files?Id=${data}&ParentFolder=0 class="btn bt-sm btn-primary" >
                                Open
                                </a ></div>
                                &nbsp;
                                <div class="text-center col-md-3"><a class='btn bt-sm btn-primary' style="color:white;" onclick=fetchClient(${data})>Edit
                                </a></div>
                                <div class="text-center"><a class='btn bt-sm btn-primary' style="color:white;" onclick=changeStatus(${data})>Change Status
                                </a></div>
                                </div>`;
                }, 'width': '30%'
            },

        ],
        'language': {
            'emptyTable': "No data found",
            'width': '100%'
        },
    });
}
function SendMail() {
    console.log('send mail');
    $.ajax({
        type: "post",
        url: "api/Email/SendMailToUser",
        success: function (data) {

            if (data.success) {
                Swal.fire(
                    'Changed!',
                    'Mail has been changed.',
                    'success'
                )
                dataTable.ajax.reload();
            }
            else {
                toastr.error(data.message);
            }
        }

    });

}
function fetchClient(url) {
    $.ajax({
        'url': '/api/Client/getClient?id=' + url,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            console.log(data.data.clientName);
            $("#ClientName3").val(data.data.clientName);
            $("#CompanyName2").val(data.data.companyName);
            $("#Email2").val(data.data.email);
            $("#PhoneNo2").val(data.data.phoneNo);
            $("#GST2").val(data.data.gst);
            $("#PhoneNo2").val(data.data.phoneNo);
            $("#SrNo2").val(data.data.srNo);
        }
    })
    Swal.fire({
        title: 'Update Client',
        html: ` <input type="hidden" id="SrNo2" class="swal2-input">
                    <i class='far fa-building' style='font-size:25px'></i>
                    <input type="text" id="CompanyName2" class="swal2-input" placeholder="Company Name"><br>
                    <i class='fas fa-user-alt' style='font-size:25px'></i>
                    <input type="text" id="ClientName3" class="swal2-input" placeholder="Client Name"><br>                   
                    <i class='fas fa-envelope' style='font-size:25px'></i>
                    <input type="text" id="Email2" class="swal2-input" placeholder="Email"><br>
                    <i class='fas fa-phone' style='font-size:25px'></i>
                    <input type="text" id="PhoneNo2" class="swal2-input" placeholder="PhoneNo"><br>
                    <input type="text" id="GST2" class="swal2-input" placeholder="GST">`,
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: `Delete`,
        showUpdateButton: true,
        //button
        /*cancelButtonText: `Change Password`,*/
        confirmButtonText: `Update`,
        focusConfirm: false,
        preConfirm: () => {
            const ClientName = Swal.getPopup().querySelector("#ClientName3").value;
            const CompanyName = Swal.getPopup().querySelector("#CompanyName2").value;
            const Email = Swal.getPopup().querySelector("#Email2").value;
            const PhoneNo = Swal.getPopup().querySelector("#PhoneNo2").value;
            const GST = Swal.getPopup().querySelector("#GST2").value;
            const SRNO = Swal.getPopup().querySelector("#SrNo2").value;

            if (!ClientName || !Email) {
                Swal.showValidationMessage(`Client Name & Email is required `)
            }
            return {
                CompanyName: CompanyName, ClientName: ClientName, Email: Email, PhoneNo: PhoneNo,
                GST: GST, SrNo: SRNO,

            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const CompanyName = `${result.value.CompanyName}`;
            const ClientName = `${result.value.ClientName}`;
            const Email = `${result.value.Email}`;
            const PhoneNo = `${result.value.PhoneNo}`;
            const GST = `${result.value.GST}`;
            const SRNO = `${result.value.SrNo}`;
            Swal.fire({
                title: 'Do you want to save the changes?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Save',
                denyButtonText: `Don't save`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $.ajax({
                        type: 'Post',
                        url: "api/Client/UpdateClient",
                        data: {
                            ClientName: ClientName, CompanyName: CompanyName, Email: Email, PhoneNo: PhoneNo,
                            GST: GST, SrNo: SRNO,
                        },
                        success: function (data) {
                            if (data.success) {
                                Swal.fire('Updated!', '', 'success')
                                dataTable.ajax.reload();
                            }
                            else {
                                Swal.fire('Updates are not saved', '', 'info')
                            }
                        }
                    });

                } else if (result.isDenied) {
                    Swal.fire('Updates are not saved', '', 'info')
                }
            })

        }
        else if (result.isDenied) {
            const SRNO = Swal.getPopup().querySelector("#SrNo2").value;
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
                        url: "api/Client/DeleteClient",
                        data: {
                            Id: SRNO,
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
                                toastr.error(data.message);
                            }
                        }
                    });
                }
            })
        }
        else if (result.dismiss=="cancel") {
            //update password
            const SRNO = Swal.getPopup().querySelector("#SrNo2").value;
            $("#SrNo3").val(SRNO);
            Swal.fire({
                title: 'Change Password',
                inputLabel: SRNO,
                html: `<input type="hidden" id="SrNo3" class="swal2-input">
                     <i class="fa fa-lock" style="font-size:24px"></i>
                    <input type="text" id="Password" class="swal2-input" placeholder="Password"><br>
                    <i class="fa fa-lock" style="font-size:24px"></i>
                    <input type="text" id="RetypePassword" class="swal2-input" placeholder="Retype Password">`,
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonText: `Cancel`,
                confirmButtonText: `Update`,
                focusConfirm: false,
                preConfirm: () => {
                    const Password = Swal.getPopup().querySelector("#Password").value;
                    const RetypePassword = Swal.getPopup().querySelector("#RetypePassword").value;
                   if (!Password || !RetypePassword) {
                        Swal.showValidationMessage(`Password Cannot be blank`)
                    }
                    else if (Password != RetypePassword) {
                        Swal.showValidationMessage(`Password not matched`)
                    }
                    return {
                        password: Password,
                    };
                }
            }).then((result) => {
                const PASSWORD = `${result.value.password}`;
            $.ajax({
                type: 'Post',
                url: "api/Client/UpdateClientPassword",
                data: {
                    SrNo: SRNO, Password: PASSWORD,
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire({
                             icon: 'success',
                            title: 'Changes Successfully',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        dataTable.ajax.reload();
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            });
        })
            }
        });
};
function addClient() {
    Swal.fire({
        title: 'Add new Client',
        html: `     <i class='far fa-building' style='font-size:25px'></i>
                    <input type="text" id="CompanyName" class="swal2-input" placeholder="Company Name"><br>
                    <i class='fas fa-user-alt' style='font-size:25px'></i>
                    <input type="text" id="ClientName" class="swal2-input" placeholder="Client Name"><br>
                    <i class='fas fa-envelope' style='font-size:25px'></i>
                    <input type="text" id="Email" class="swal2-input" placeholder="Email"><br>
                    <i class='fas fa-phone' style='font-size:25px'></i>
                    <input type="text" id="PhoneNo" class="swal2-input" placeholder="PhoneNo"><br>
                    <input type="text" id="GST" class="swal2-input" placeholder="GST"><br>
                    
                    <input type="hidden" id="Password" value="1234" class="swal2-input" placeholder="Password">`,
        confirmButtonText: 'Add',
        focusConfirm: false,
        preConfirm: () => {
            const ClientName = Swal.getPopup().querySelector("#ClientName").value;
            const CompanyName = Swal.getPopup().querySelector("#CompanyName").value;
            const Email = Swal.getPopup().querySelector("#Email").value;
            const PhoneNo = Swal.getPopup().querySelector("#PhoneNo").value;
            const GST = Swal.getPopup().querySelector("#GST").value;
            const Password = Swal.getPopup().querySelector("#Password").value;
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email)) {

            } else {
                Swal.showValidationMessage(`You have entered an invalid email address!`)
            }
            if (!ClientName || !Email) {
                Swal.showValidationMessage(`Client Name & Email is required `)
            }
            return {
                CompanyName: CompanyName, ClientName: ClientName, Email: Email, PhoneNo: PhoneNo,
                GST: GST, Password: Password

            };
        }
    }).then((result) => {
        console.log(result);
        const CompanyName = `${result.value.CompanyName}`;
        const ClientName = `${result.value.ClientName}`;
        const Email = `${result.value.Email}`;
        const PhoneNo = `${result.value.PhoneNo}`;
        const GST = `${result.value.GST}`;
        const Password = `${result.value.Password}`;
        $.ajax({
            type: 'Post',
            url: "api/Client/AddClient",
            data: {
                ClientName: ClientName, CompanyName: CompanyName, Email: Email, PhoneNo: PhoneNo,
                GST: GST, Password: Password
            },
            success: function (data) {
                if (data.success) {
                    Swal.fire('Saved!', '', 'success')
                    dataTable.ajax.reload();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });
}
function changeStatus(SRNO) {
 Swal.fire({
        title: 'Are you sure?',
        text: "You want to change the status!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                type: 'Post',
                url: "api/Client/changestatus",
                data: {
                    Id: SRNO,
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire(
                            'Changed!',
                            'Company status has been changed.',
                            'success'
                        )
                        dataTable.ajax.reload();
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            });
        }
    })

}
function Logout() {
    console.log('Log out');
    $.ajax({
        type: "post",
        url: "api/Email/Logout",
        success: function (data) {
            if (data.success) {
                
            }
            else {
                toastr.error(data.message);
            }
        }

    });
   
}
  


