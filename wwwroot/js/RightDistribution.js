$(document).ready(function () {
    getRole()

});

function getRole() {
    $.ajax({
        url: '/api/RightDistribution/getRole',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                $('#rolelist').empty();
                $('#rolelist').append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $('#rolelist').append($("<option></option>").val(value.roleid).html(value.rolename));
                });
            }
        }
    });
}
function savepermission() {
    var roleid = document.getElementById("rolelist").value;

    var formData = new FormData();
    /*ITEM MASTER*/
    var view = document.getElementById("imview").checked;
    var write = document.getElementById("imwrite").checked;
    var update = document.getElementById("imupdate").checked;
    var deletee = document.getElementById("impdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "ITEM_MASTER");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "ITEM_MASTER");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "ITEM_MASTER");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "ITEM_MASTER");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /*OPENING STOCK*/
    view = document.getElementById("opsview").checked;
    write = document.getElementById("opswrite").checked;
    update = document.getElementById("opsupdate").checked;
    deletee = document.getElementById("opsdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "OPENING_STOCK");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "OPENING_STOCK");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "OPENING_STOCK");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "OPENING_STOCK");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /*CUSTOMER_DATA*/
    view = document.getElementById("cdview").checked;
    write = document.getElementById("cdcreate").checked;
    update = document.getElementById("cdupdate").checked;
    deletee = document.getElementById("cddelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "CUSTOMER_DATA");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "CUSTOMER_DATA");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "CUSTOMER_DATA");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "CUSTOMER_DATA");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /*SALES_QUOTATION*/
    view = document.getElementById("sqview").checked;
    write = document.getElementById("sqcreate").checked;
    update = document.getElementById("squpdate").checked;
    deletee = document.getElementById("sqdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALES_QUOTATION");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALES_QUOTATION");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALES_QUOTATION");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALES_QUOTATION");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /*PROFORMA_INVOICE*/
    view = document.getElementById("piview").checked;
    write = document.getElementById("picreate").checked;
    update = document.getElementById("piupdate").checked;
    deletee = document.getElementById("pidelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "PROFORMA_INVOICE");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PROFORMA_INVOICE");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PROFORMA_INVOICE");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PROFORMA_INVOICE");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /*DESPATCH_ORDER*/
    view = document.getElementById("doview").checked;
    write = document.getElementById("docreate").checked;
    update = document.getElementById("doupdate").checked;
    deletee = document.getElementById("dodelete").checked;
    var checker = document.getElementById("dochecker").checked;
    var printChecker = document.getElementById("finalprintDoChecker").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_ORDER");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_ORDER");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_ORDER");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_ORDER");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_ORDER");
    formData.append('operations1', "CHECKER");
    formData.append('permission1', checker);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_ORDER");
    formData.append('operations1', "FINAL_PRINT");
    formData.append('permission1', printChecker);

    /*DESPATCH_PLANNING*/
    view = document.getElementById("dpview").checked;
    write = document.getElementById("dpcreate").checked;
    update = document.getElementById("dpupdate").checked;
    deletee = document.getElementById("dpdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_PLANNING");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_PLANNING");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_PLANNING");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DESPATCH_PLANNING");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);


    /*PURCHASE_ORDER*/
    view = document.getElementById("poview").checked;
    write = document.getElementById("pocreate").checked;
    update = document.getElementById("poupdate").checked;
    deletee = document.getElementById("podelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE_ORDER");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE_ORDER");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE_ORDER");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE_ORDER");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);


    /*STOCK_SHIFTING*/
    view = document.getElementById("msView").checked;
    write = document.getElementById("mscreate").checked;
    update = document.getElementById("msupdate").checked;
    deletee = document.getElementById("msdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "MATERIAL_SHIFTING");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "MATERIAL_SHIFTING");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "MATERIAL_SHIFTING");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "MATERIAL_SHIFTING");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);





    /*GENERAL_ENTRY*/
    view = document.getElementById("geView").checked;
    write = document.getElementById("gecreate").checked;
    update = document.getElementById("geupdate").checked;
    deletee = document.getElementById("gedelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "GENERAL_ENTRY");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "GENERAL_ENTRY");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "GENERAL_ENTRY");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "GENERAL_ENTRY");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);


    /*PURCHASE_ITEM*/
    view = document.getElementById("puiview").checked;
    write = document.getElementById("puicreate").checked;
    update = document.getElementById("puiupdate").checked;
    deletee = document.getElementById("puidelete").checked;
    checker = document.getElementById("puichecker").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE_ITEM");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE_ITEM");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE_ITEM");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE_ITEM");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE_ITEM");
    formData.append('operations1', "CHECKER");
    formData.append('permission1', checker);

    var report = document.getElementById("ViewReport").checked;
    formData.append('roleid', roleid);
    formData.append('formsName1', "REPORTS");
    formData.append('operations1', "VIEW");
    formData.append('permission1', report);

    var OpeningBalance = document.getElementById("Viewob").checked;
    formData.append('roleid', roleid);
    formData.append('formsName1', "OPENING_BALANCE");
    formData.append('operations1', "VIEW");
    formData.append('permission1', OpeningBalance);


    view = document.getElementById("adminView").checked;
    formData.append('roleid', roleid);
    formData.append('formsName1', "TaskDashboard");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    /*SALE ORDER*/
    view = document.getElementById("soview").checked;
    write = document.getElementById("socreate").checked;
    update = document.getElementById("soupdate").checked;
    deletee = document.getElementById("sodelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALE_ORDER");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALE_ORDER");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALE_ORDER");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALE_ORDER");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /* -------------------------------------------------------------------------------------*/

    view = document.getElementById("saleview").checked;
    write = document.getElementById("salecreate").checked;
    update = document.getElementById("saleupdate").checked;
    deletee = document.getElementById("saledelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALE");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALE");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALE");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "SALE");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /* -------------------------------------------------------------------------------------*/

    view = document.getElementById("purchaseview").checked;
    write = document.getElementById("purchasecreate").checked;
    update = document.getElementById("purchaseupdate").checked;
    deletee = document.getElementById("purchasedelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PURCHASE");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /* -------------------------------------------------------------------------------------*/

    view = document.getElementById("debitview").checked;
    write = document.getElementById("debitcreate").checked;
    update = document.getElementById("debitupdate").checked;
    deletee = document.getElementById("debitdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "DEBIT_NOTE");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DEBIT_NOTE");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DEBIT_NOTE");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DEBIT_NOTE");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /* -------------------------------------------------------------------------------------*/

    view = document.getElementById("creditview").checked;
    write = document.getElementById("creditcreate").checked;
    update = document.getElementById("creditupdate").checked;
    deletee = document.getElementById("creditdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "CREDIT_NOTE");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "CREDIT_NOTE");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "CREDIT_NOTE");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "CREDIT_NOTE");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);



    /* -------------------------------------PHYSICAL STOCK----------------------------------------*/

    view = document.getElementById("psView").checked;
    write = document.getElementById("pscreate").checked;
    update = document.getElementById("psupdate").checked;
    deletee = document.getElementById("psdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "PHYSICAL_STOCK");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PHYSICAL_STOCK");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PHYSICAL_STOCK");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PHYSICAL_STOCK");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /* -------------------------------------------------------------------------------------*/







    view = document.getElementById("receiptview").checked;
    receiptpaymentview = document.getElementById("paymentreceiptview").checked;
    write = document.getElementById("receiptcreate").checked;
    update = document.getElementById("receiptupdate").checked;
    deletee = document.getElementById("receiptdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "RECEIPTPAYMENT");
    formData.append('operations1', "VIEW");
    formData.append('permission1', receiptpaymentview);

    formData.append('roleid', roleid);
    formData.append('formsName1', "RECEIPT");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "RECEIPT");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "RECEIPT");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "RECEIPT");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /* -------------------------------------------------------------------------------------*/

    view = document.getElementById("paymentView").checked;
    write = document.getElementById("paymentcreate").checked;
    update = document.getElementById("paymentupdate").checked;
    deletee = document.getElementById("paymentdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "PAYMENT");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PAYMENT");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PAYMENT");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "PAYMENT");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);
    /* -------------------------------------------------------------------------------------*/

    view = document.getElementById("debitview").checked;
    write = document.getElementById("debitcreate").checked;
    update = document.getElementById("debitupdate").checked;
    deletee = document.getElementById("debitdelete").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "DEBIT_NOTE");
    formData.append('operations1', "VIEW");
    formData.append('permission1', view);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DEBIT_NOTE");
    formData.append('operations1', "CREATE");
    formData.append('permission1', write);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DEBIT_NOTE");
    formData.append('operations1', "UPDATE");
    formData.append('permission1', update);

    formData.append('roleid', roleid);
    formData.append('formsName1', "DEBIT_NOTE");
    formData.append('operations1', "DELETE");
    formData.append('permission1', deletee);

    /*VOUCHERS*/
    var vch = document.getElementById("Voucherview").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "VOUCHERS");
    formData.append('operations1', "VIEW");
    formData.append('permission1', vch);

    /*SETTINGS*/
    var setting = document.getElementById("csetting").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "SETTINGS");
    formData.append('operations1', "SETTING");
    formData.append('permission1', setting);

    /*USER MANAGEMENT*/
    setting = document.getElementById("usmanagement").checked;

    formData.append('roleid', roleid);
    formData.append('formsName1', "USER_MANAGEMENT");
    formData.append('operations1', "SETTING");
    formData.append('permission1', setting);

    var type = document.getElementById("savepermision").innerHTML;
    $.ajax({
        type: 'Post',
        url: "api/RightDistribution/permission?type=" + type,
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
                var savebutton = document.getElementById("savepermision").innerHTML;
                if (savebutton == "Save") {
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully saved'
                    })
                    document.getElementById("savepermision").innerHTML = "Update";
                } else {
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully Updated'
                    })
                }
            }
            else {
                toastr.error(data.message);
            }
        }
    });

}
function fillcomplete() {
    var roleid = document.getElementById("rolelist").value;
    $.ajax({
        url: '/api/RightDistribution/fillpermission?roleid=' + roleid,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.data.length > 0) {
                for (let i = 0; i < data.data.length; i++) {
                    switch (data.data[i].formsName) {
                        case "ITEM_MASTER":
                            // code block
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("imview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("imwrite").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("imupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("impdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "OPENING_STOCK":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("opsview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("opswrite").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("opsupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("opsdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "CUSTOMER_DATA":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("cdview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("cdcreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("cdupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("cddelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "SALES_QUOTATION":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("sqview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("sqcreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("squpdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("sqdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "PROFORMA_INVOICE":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("piview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("picreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("piupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("pidelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "DESPATCH_ORDER":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("doview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("docreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("doupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("dodelete").checked = data.data[i].permission;
                                    break;
                                case "CHECKER":
                                    document.getElementById("dochecker").checked = data.data[i].permission;
                                    break;
                                case "FINAL_PRINT":
                                    document.getElementById("finalprintDoChecker").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "DESPATCH_PLANNING":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("dpview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("dpcreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("dpupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("dpdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "PURCHASE_ORDER":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("poview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("pocreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("poupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("podelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "SALE_ORDER":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("soview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("socreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("soupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("sodelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "SALE":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("saleview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("salecreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("saleupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("saledelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "PURCHASE":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("purchaseview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("purchasecreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("purchaseupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("purchasedelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;

                        case "MATERIAL_SHIFTING":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("msView").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("mscreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("msupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("msdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;


                        case "GENERAL_ENTRY":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("geView").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("gecreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("geupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("gedelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;

                        case "DEBIT_NOTE":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("debitview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("debitcreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("debitupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("debitdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "CREDIT_NOTE":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("creditview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("creditcreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("creditupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("creditdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "RECEIPT":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("receiptview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("receiptcreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("receiptupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("receiptdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "PHYSICAL_STOCK":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("psView").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("pscreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("psupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("psdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "RECEIPTPAYMENT":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("paymentreceiptview").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "PAYMENT":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("paymentView").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("paymentcreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("paymentupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("paymentdelete").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "PURCHASE_ITEM":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("puiview").checked = data.data[i].permission;
                                    break;
                                case "CREATE":
                                    document.getElementById("puicreate").checked = data.data[i].permission;
                                    break
                                case "UPDATE":
                                    document.getElementById("puiupdate").checked = data.data[i].permission;
                                    break;
                                case "DELETE":
                                    document.getElementById("puidelete").checked = data.data[i].permission;
                                    break;
                                case "CHECKER":
                                    document.getElementById("puichecker").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "REPORTS":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("ViewReport").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;

                        case "OPENING_BALANCE":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("Viewob").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "VOUCHERS":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("Voucherview").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "TaskDashboard":
                            switch (data.data[i].operations) {
                                case "VIEW":
                                    document.getElementById("adminView").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "USER_MANAGEMENT":
                            switch (data.data[i].operations) {
                                case "SETTING":
                                    document.getElementById("usmanagement").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        case "SETTINGS":
                            switch (data.data[i].operations) {
                                case "SETTING":
                                    document.getElementById("csetting").checked = data.data[i].permission;
                                    break;
                                default:
                            }
                            break;
                        default:
                    }
                }
                document.getElementById("savepermision").innerHTML = "Update";

            } else {

                document.getElementById("savepermision").innerHTML = "Save";
                document.getElementById("imview").checked = false;
                document.getElementById("imwrite").checked = false;
                document.getElementById("imupdate").checked = false;
                document.getElementById("impdelete").checked = false;

                document.getElementById("opsview").checked = false;
                document.getElementById("opswrite").checked = false;
                document.getElementById("opsupdate").checked = false;
                document.getElementById("opsdelete").checked = false;
                document.getElementById("cdview").checked = false;
                document.getElementById("cdcreate").checked = false;
                document.getElementById("cdupdate").checked = false;
                document.getElementById("cddelete").checked = false;
                document.getElementById("sqview").checked = false;
                document.getElementById("sqcreate").checked = false;
                document.getElementById("squpdate").checked = false;
                document.getElementById("sqdelete").checked = false;
                document.getElementById("piview").checked = false;
                document.getElementById("picreate").checked = false;
                document.getElementById("piupdate").checked = false;
                document.getElementById("pidelete").checked = false;
                document.getElementById("doview").checked = false;
                document.getElementById("docreate").checked = false;
                document.getElementById("doupdate").checked = false;
                document.getElementById("dodelete").checked = false;
                document.getElementById("dochecker").checked = false;
                document.getElementById("dpview").checked = false;
                document.getElementById("dpcreate").checked = false;
                document.getElementById("dpupdate").checked = false;
                document.getElementById("dpdelete").checked = false;
                document.getElementById("poview").checked = false;
                document.getElementById("pocreate").checked = false;
                document.getElementById("poupdate").checked = false;
                document.getElementById("podelete").checked = false;
                document.getElementById("puiview").checked = false;
                document.getElementById("puicreate").checked = false;
                document.getElementById("puiupdate").checked = false;
                document.getElementById("puidelete").checked = false;
                document.getElementById("puichecker").checked = false;
                document.getElementById("msView").checked = false;
                document.getElementById("mscreate").checked = false;
                document.getElementById("msupdate").checked = false;
                document.getElementById("msdelete").checked = false;
                document.getElementById("geView").checked = false;
                document.getElementById("gecreate").checked = false;
                document.getElementById("geupdate").checked = false;
                document.getElementById("gedelete").checked = false;
                document.getElementById("psView").checked = false;
                document.getElementById("pscreate").checked = false;
                document.getElementById("psupdate").checked = false;
                document.getElementById("psdelete").checked = false;
                // code block
            }
        }
    });


}

