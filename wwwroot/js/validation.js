var dataTable;
$(document).ready(function () {

    var roletype = document.getElementById('roletype').value;
    if (roletype == "Admin") {

        document.getElementById("checkPR").style.display = "block";
        document.getElementById("createPR").style.display = "none";

    }
    if (roletype == "Editor") {
        document.getElementById("checkPR").style.display = "none";
        document.getElementById("createPR").style.display = "block";
    }
    if (roletype == "Super Admin") {

        document.getElementById("checkPR").style.display = "block";
        document.getElementById("createPR").style.display = "block";
    }
    if (roletype == "Stock Maker") {
        document.getElementById("accountfinance").style.display = "block";
        document.getElementById("purchaseitem").style.display = "block";
        document.getElementById("createPR").style.display = "block";
        document.getElementById("dispactedlogistics").style.display = "block";
        document.getElementById("dispatchedorder").style.display = "block";
        document.getElementById("createDO").style.display = "block";

    }
    if (roletype == "Stock Approval") {
        document.getElementById("createDO").style.display = "block";

    }


})
