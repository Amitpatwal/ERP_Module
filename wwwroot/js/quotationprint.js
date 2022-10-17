
$(document).ready(function () {

    printquotation()

});


function printquotation() {
    var url = new URLSearchParams(window.location.search);
    var idd = url.get('idd');
    $.ajax({
        'url': '/api/Quotation/printquotation?qtono=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
              
                var quotno = data.data[0].quotno;
                var companyname = data.data[0].companyname;
                var title = companyname + '_' + quotno;
                window.addEventListener("load", document.title = title,);
            }
            else {

            }


        }
    });

}

