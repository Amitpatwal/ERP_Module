$(document).ready(function () {
    Counter();

    document.getElementById("username2").innerHTML = $.cookie("username");
    document.getElementById("username1").innerHTML = $.cookie("username");
    document.getElementById("emailid").innerHTML = $.cookie("Emailid");
    document.getElementById("userid").value = $.cookie("id");

    const fileInput = document.getElementById("document_attachment_doc");
    window.addEventListener('paste', e => {
        fileInput.files = e.clipboardData.files;
        previewimage()
    });
    var img = $.cookie("userimage");
    userImage.src = img;
});

function SaveImage() {
    let File1 = $("#document_attachment_doc")[0].files;
    if (File1.length == 1) {

        var formData = new FormData();

        formData.append('Name1', File1[0]);

        $.ajax({
            type: 'Post',
            url: "api/UserManagement/uploadImage",
            async: false,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            data: formData,
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
                    userImage.src = data.data;
                    userPr.src = data.data;
                    userPr1.src = data.data;
                    Toast.fire({
                        icon: 'success',
                        title: 'File is Uploaded!'
                    })

                }
                else {
                    Swal.fire(data.message, '', 'error')
                }
            }
        });
    }
    else {
        Swal.fire("Please select the file to upload", '', 'error')

    }

}
function previewimage() {
    const [file] = document_attachment_doc.files
    if (file) {
        blah.src = URL.createObjectURL(file)
        document.getElementById("blah").style.display = "block";
    }
}
function closemodel() {
    document.getElementById("blah").style.display = "none";
    document.getElementById("document_attachment_doc").value = "";
}
function deleteProfile() {


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
                url: "api/UserManagement/DeleteFile",
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
                        userImage.src = data.data;
                        userPr.src = data.data;
                        userPr1.src = data.data;
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Deleted'
                        })

                    }
                    else {
                        Swal.fire(data.message, '', 'error')

                    }
                }
            })
        }
    })
}
function updatePass() {

    var idd = document.getElementById("userid").value;
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
            const retypepassword = Swal.getPopup().querySelector("#rtypepassword").value;

            if (password != retypepassword) {
                Swal.showValidationMessage(`Password does not match`)
            }

            return { password: password, usid: usid }
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
function EditImage() {
    var img = $.cookie("userimage");
    blah.src = img;
    document.getElementById("blah").style.display = "block";
    document.getElementById("document_attachment_doc").value = "";

}

function Counter() {
    $.ajax({
        'url': '/api/Login/Profilecounter',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("totalQuotation").innerHTML = data.data.totalQuotation;
                document.getElementById("totalPI").innerHTML = data.data.totalPI ;
                document.getElementById("totalSO").innerHTML = data.data.totalsaleOrder;
                document.getElementById("totalPO").innerHTML = data.data.totalPurchase ;
                document.getElementById("totalPR").innerHTML = data.data.totalPR;
                document.getElementById("totalDO").innerHTML = data.data.totalDO;
               
            }
            else {
                Swal.fire(
                    data.messages
                )
            }
        }
    })
}