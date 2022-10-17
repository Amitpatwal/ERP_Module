var dataTable;
var dataTable2;
var dataTable3;
var dataTable4;


$(document).ready(function () {
    console.log('program started');
    $("#goBack").click(function () {
        window.history.back();
    });
    let url = new URLSearchParams(window.location.search);
    let Id = url.get('Id');
    if (Id == null) {
        document.getElementById("goBack").style.visibility = "hidden";
        document.getElementById("goBack").style.display = "none";
    }

    $("#selectAll").click(function () {
        $("#input[type=checkbox]").prop('checked', $(this).prop('checked'));
    });

    $("#input[type=checkbox]").click(function () {
        if (!$("#eachSelect").prop("checked")) {
            $("selectAll").prop("checked", false);
        }
    });
    $("#selectdeletefolder").click(function () {
        if (!$("#eachSelect").prop("checked")) {
            $("selectAll").prop("checked", false);
        }
    });
    $("#saveFile").click(function () {

        let FileName = $("#FileName").val();
        let File1 = $("#File")[0].files;
        let url = new URLSearchParams(window.location.search);
        let ParentId = url.get('ParentFolder');
        let Id = url.get('Id');
        var fu1 = document.getElementById("File").value;
        var fu2 = fu1.substring(fu1.lastIndexOf('/') + 1);
        if (File1 != null ) {
            if (FileName == null || FileName == "") {
                FileName = fu1;
            }
            var formData = new FormData();
            for (i = 0; i < File1.length; i++)
            {
                 
            formData.append('Name1', File1[i]);
            formData.append('Name', FileName);
            formData.append('OrigName', FileName);
            formData.append('ParentFolder', ParentId);
        formData.append('ClientId', Id);
    }
            $.ajax({
                type: 'Post',
                url: "api/File/AddFile",
                async: false,
                cache: false,
                contentType: false,
                enctype: 'multipart/form-data',
                processData: false,
                data: formData,
                success: function (data) {
                    if (data.success) {
                        Swal.fire('File is Uploaded!', '', 'success')
                        dataTable2.ajax.reload();

                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            });
        }
        else {
            toastr.error("Please select the file to upload");
        }
        });
    
    $("#addFolder").click(function () {
        console.log('initialized');
      

        Swal.fire({
            title: 'Add New Folder',
            html: `<input type="text" id="FolderName" class="swal2-input" placeholder="Folder Name">                   
                    <input type = "hidden" id = "CompanyId" class= "swal2-input" > 
                    <input type = "hidden" id = "ParentFolder" class= "swal2-input" >`,
            confirmButtonText: 'Add',
            focusConfirm: false,
            preConfirm: () => {
                const FolderName = Swal.getPopup().querySelector("#FolderName").value;               
                if (!FolderName ) {
                    Swal.showValidationMessage(`Folder Name is required `)
                }
                return {
                    FolderName: FolderName  

                };
            }
        }).then((result) => {
            console.log(result);

            const FolderName = `${result.value.FolderName}`;
            var url = new URLSearchParams(window.location.search);
            var ParentId = url.get('ParentFolder');
            var Id = url.get('Id');
            console.log('parentId' + ParentId + 'Id' + Id);

            $.ajax({
                type: 'Post',
                url: "api/Folder/AddFolder",
                data: {
                    Name: FolderName, ParentFolder: ParentId, ClientId: Id
                },
                success: function (data) {
                    if (data.success) {
                        toastr.success(data.message);
                        dataTable.ajax.reload();
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            });
        });
    })
    function LoadDatatable() {
         var url = new URLSearchParams(window.location.search);
        var ParentId = url.get('ParentFolder');
        var Id = url.get('Id');

        $.ajax({
            'url': '/api/File/GetAllFiles?ClientId=' + Id + '&ParentFolder=' + ParentId,
                'type': 'GET',
            'contentType': 'application/json',
            success: function (data) {
                console.log(data);
            }

        })
        /*admin folder table*/
dataTable = $("#dataTable").DataTable({
           
            ajax : {
                'url': '/api/Folder/GetAllFolders?ClientId='+Id+'&ParentFolder='+ParentId,
                'type': 'GET',
                'contentType': 'application/json'               
            },
           
            columns: [{
                'data': null, 'render': function (data) {
                    return '<div class="row" style="margin-left:30px;"><div class="text-center"><input type="checkbox">'
                        + '</div></div>';
                }, 'width': '.1%'
            },
                {  'data': 'name', 'render': function (data, type, row) {
                        return '<div class="row" ><div class="text-center"><a href="Files?Id=' + Id + '&ParentFolder=' + row.srNo + '" class= "btn btn-warning" style="width:150px;" >' + data +''
                            + '</a></div></div>';
                    }, 'width': '5%'
                },
                {
                    'data': 'name', 'render': function (data, type, row) {
                        return '<div class="row" ><div class="text-center"><a >Folders ' + row.totalFolders + ', Files ' + row.totalFiles +'</a></div></div>';
                    }, 'width': '10%'
                },             
                {
                    'data': 'srNo',
                    'render': function (data) {
                        return '<div class="row">'
                            + '<div class="text-center col-md-3"><a class= "btn btn-sm btn-danger" style="color:white;width:80px;" onclick=DeleteFolder("api/Folder/DeleteFolder?Id='+data+'")>'
                            + '<i class="bi bi-trash"></i>Delete</a></div>'
                            + '<div class="text-center col-md-3"><a class= "btn btn-sm btn-primary" style="color:white;width:80px;" onclick=renameFolder("' + data + '")>'
                            + 'Rename</a></div>'
                            + '<div class="text-center col-md-3"><a class= "btn btn-sm btn-primary" style="color:white;width:80px;" onclick=moveFolder("api/Folder/moveFolder?Id=' + data + '")>'
                            + 'Move</a></div></div > '
                    }, 'width': '20%'
                },
                
            ],
            'language': {
                'emptyTable': "No data found",
                'width': '100%'
            },
        },
            
        )
        
        /*admin file datatable*/
dataTable2 = $("#dataTable2").DataTable({
            ajax: {
                'url': '/api/File/GetAllFiles?ClientId=' + Id + '&ParentFolder=' + ParentId,
                'type': 'GET',
                'contentType': 'application/json'
            },
            columns: [{'data': null, 'render': function (data) {
                return '<div class="row" style="margin-left:10px;"><div class="text-center"><input type="checkbox" id="eachSelect">'
                    + '</div></div>';
            }, 'width': '.1%'
            },
                { 'data': 'origName', 'defaultContent': '-', 'width': '10%' },               
                {
                    'data': 'srNo',
                    'render': function (data,type,row) {
                        return `<div class="text-center"><a href="${row.url}" target=_blank class="btn bt-sm btn-primary" >View </a >
                               <a class="btn bt-sm btn-danger" onclick=deleteFile("api/file/DeleteFile?Id=${data}") style="color:white" >Delete
                                <i class="fa fa-trash-o" style="font-size:24px"></i> </a >
                                <a class="btn bt-sm btn-primary" onclick=renameFile("${data}") style="color:white" >Rename </a >
                                <a class="btn bt-sm btn-primary" onclick=deleteFile("api/file/DeleteFile?Id=${data}") style="color:white" >Move </a > </div>
                                 `;
                    }, 'width': '30%'
                },
                
                
            ],
            'language': {
                'emptyTable': "No data found",
                'width': '100%'
            }
        })

        /*CLIENT FOLDER*/
dataTable3 = $("#dataTableClient").DataTable({
            ajax: {
                'url': '/api/Folder/GetAllFoldersClient?ParentFolder=' + ParentId,
                'type': 'GET',
                'contentType': 'application/json'
            },
            columns: [
                {
                    'data': 'name', 'render': function (data, type, row) {
                        return '<div class="row" style="margin-left:10px;"><div class="text-center"><a href="ClientDashboard?Id=' + row.clientId + '&ParentFolder=' + row.srNo + '" class= "btn btn-warning" style="width:150px;" >' + data + ''
                            + '</a></div></div>';
                    }, 'width': '5%'
                },
                { 'data': 'parentFolder', 'defaultContent': '-', 'width': '10%' },              
            ],
            'language': {
                'emptyTable': "No data found",
                'width': '100%'
            }
        })

        /*CLIENT FILE*/
dataTable4 = $("#dataTableClientFiles").DataTable({
            ajax: {
                'url': '/api/File/GetAllFilesClient?ParentFolder=' + ParentId,
                'type': 'GET',
                'contentType': 'application/json'
            },

            columns: [
                { 'data': 'origName', 'defaultContent': '-', 'width': '10%' },
                { 'data': 'url','render': function (data) {
                        return '<a href="' + data + '" target=_blank class="btn bt-sm btn-primary" >View File</a > ';

                    }, 'width': '20%'
                },
            ],
            'language': {
                'emptyTable': "No data found",
                'width': '100%'
            }
        })
    }

    LoadDatatable();
    function DeleteClient(url) {
        Swl({
            title: "Are your sure?",
            text: "Once deleted, you'll be not able to recover. All related files & folders will also be deleted",
            icon: 'warning',
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                $.ajax({
                    type: 'Delete',
                    url: url,
                    success: function (data) {
                        if (data.success) {
                            toastr.success(data.message);
                        }
                        else {
                            toastr.error(data.message);
                        }
                    }
                })
            }
        })
    }
   
  
})
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
function DeleteFolder(url) {
    Swal.fire({
        title: "Are your sure?",
        text: "Once deleted, you'll be not able to recover. All related files & folders will also be deleted",
        icon: 'warning',
        dangerMode: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed == true) {
            $.ajax({
                type: 'Delete',
                url: url,
                success: function (data) {
                    if (data.success) {
                        Swal.fire('Folder is deleted!', '', 'success')
                        dataTable.ajax.reload();
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            })
        }
    })
}
function deleteFile(url) {
    Swal.fire({
        title: 'Are your sure you want to delete?',
        text: "Once deleted, you'll be not able to recover file.",
        icon: 'warning',
         showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'Delete',
                url: url,
                success: function (data) {
                    if (data.success) {
                       /* Swal.fire('File is deleted!', '', 'success')*/
                        toastr.success(data.message);
                        dataTable2.ajax.reload();
                    }
                    else {
                        toastr.error(data.message);
                    }
                }
            })
        }
    })
}
function renameFolder(id) {
   
    $.ajax({
        'url': '/api/Folder/getFolderdetail?id=' + id,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            $("#FolderName").val(data.data.name);
            $("#FolderName2").val(data.data.name);
            $("#SrNo").val(data.data.srNo);            

        }
    })
    
    Swal.fire({
        title: 'Rename Folder',        
        html: `<input type="hidden" id="FolderName2" class="swal2-input">
                <input type="text" id="FolderName" class="swal2-input" placeholder="New Folder Name">
                   <input type = "hidden" id = "SrNo" class= "swal2-input" >
                    <input type = "hidden" id = "ParentFolder" class= "swal2-input" ><br>`,
        confirmButtonText: 'Rename',
        focusConfirm: false,
        preConfirm: () => {
            const NewFolderName = Swal.getPopup().querySelector("#FolderName").value;
            const oldFolderName = Swal.getPopup().querySelector("#FolderName2").value;
            const SrNo = Swal.getPopup().querySelector("#SrNo").value;

            if (!FolderName) {
                Swal.showValidationMessage(`File Name is required `)
            }
            return {
                NewFolderName: NewFolderName, oldFolderName: oldFolderName, SrNo: SrNo
            };
        }
    }).then((result) => {
        const NewFolderName = `${result.value.NewFolderName}`;        
        const SrNo = `${result.value.SrNo}`;
        var url = new URLSearchParams(window.location.search);
        var ParentId = url.get('ParentFolder');
        var Id = url.get('Id');
      $.ajax({
            type: 'Post',
            url: "api/Folder/renameFolder",
            data: {
                Name: NewFolderName, ParentFolder: ParentId, ClientId: Id, SrNo: SrNo
            },
            success: function (data) {
                if (data.success) {
                    Swal.fire('Folder is renamed!', '', 'success')
                    dataTable.ajax.reload();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });
}
function renameFile(id) {

    $.ajax({
        'url': '/api/File/getFiledetail?id=' + id,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            $("#FileName").val(data.data.origName);           
            $("#SrNo").val(data.data.srNo);
        }
    })
    
    Swal.fire({
        title: 'Rename File',
        html: `<input type="text" id="FileName" class="swal2-input" placeholder="New File Name">
                   <input type = "hidden" id = "SrNo" class= "swal2-input" >
                    <input type = "hidden" id = "ParentFolder" class= "swal2-input" >`,
        confirmButtonText: 'Rename',
        focusConfirm: false,
        preConfirm: () => {
            const FileName = Swal.getPopup().querySelector("#FileName").value;
            const SrNo = Swal.getPopup().querySelector("#SrNo").value;

            if (!FileName) {
                Swal.showValidationMessage(`File Name is required `)
            }
            return {
                FileName: FileName, SrNo: SrNo

            };
        }
    }).then((result) => {
        console.log(result);

        const FileName = `${result.value.FileName}`;
        const SrNo = `${result.value.SrNo}`;
        var url = new URLSearchParams(window.location.search);
        var ParentId = url.get('ParentFolder');
        var Id = url.get('Id');        
        $.ajax({
            type: 'Post',
            url: "api/File/renameFile",
            data: {
                Name: FileName, ParentFolder: ParentId, ClientId: Id, SrNo: SrNo
            },
            success: function (data) {
                if (data.success) {
                    Swal.fire('File is renamed!', '', 'success')
                    dataTable.ajax.reload();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });

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