var dataTable;
$(document).ready(function () {
    $("#login").click(function () {
        login();
    });
    $(".mobile_login img").click(function () {
        $('html, body').animate({
            scrollTop: $(".login-right").offset().top
        }, 1000);
    });

})

function saveed(event) {
    let key = event.which;
    if (key == 13) {
        login();
    }
}
function nextfocus(event, nextfocus) {
    let key = event.which;
    if (key == 13) {
        document.getElementById(nextfocus).focus();
    }
}
function login() {
    const emailid = $("#email").val();
    const pass = $("#pwd").val();
    $.ajax({
        type: "Post",
        url: "api/Login/validationss",
        data: {
            emailid: emailid, pass: pass,
        },
        success: function (data) {
            if (data.success) {
                window.location.replace("Selectcompany");
            }
            else {
                window.location.replace("Selectcompany");
                alert("Please input valid credentials");
            }
        }
    });

    console.log("demo");
}
function SendMail() {
    $.ajax({
        type: "post",
        url: "api/Email/SendMialToUser",
        success: function (data) {
            alert("success");
        }
    });

}
function Logout() {
    console.log('Log out');
    $.ajax({

        type: "post",
        url: "api/Email/Logout",
        success: function (data) {
            if (data.success) {
                window.location.replace("Index");
            }
            else {
                toastr.error(data.message);
            }
        }

    });
}
