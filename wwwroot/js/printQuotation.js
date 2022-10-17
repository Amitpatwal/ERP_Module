$(document).ready(function () {
    let url = new URLSearchParams(window.location.search);
    let idd = url.get('idd');

   
    $.ajax({
        'url': '/api/QuotationPrint/Addtempcompanydetails?idd=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
                $("#iframe1").attr(data);
        }
    });
});
