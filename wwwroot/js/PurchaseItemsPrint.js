


onload=  function printDispachtedOrder() {
    var url = new URLSearchParams(window.location.search);
    var idd = url.get('PRNO');
    $.ajax({
        'url': '/api/PR/PrintPR?prno=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data ) {
            if (data.success == true) {

                document.getElementById('suppliername').innerHTML = data.data.supplierCompanyname;
                document.getElementById('supplieraddress').innerHTML = data.data.supplierAddress;
                document.getElementById('prdate').innerHTML = data.data.prDate;
                document.getElementById('prno').innerHTML = data.data.prNo;
                document.getElementById('invoiceno').innerHTML = data.data.piNo;
                document.getElementById('pono').innerHTML = data.data.poNo;
                document.getElementById('transportname').innerHTML = data.data.transportName;
                document.getElementById('vechileno').innerHTML = data.data.vechileNo;

                var Prno = document.getElementById('prno').innerHTML;
                var companyname = document.getElementById('suppliername').innerHTML;
                var title = companyname + '_' + Prno;
                document.getElementById('drivername').innerHTML = data.data.driverName;
                document.getElementById('licenseno').innerHTML = data.data.license;
                document.getElementById('freighttype').innerHTML = data.data.freightType;
                document.getElementById('freightamount').innerHTML = data.data.freightCharge;



                document.getElementById('craneLoadingWeightmt').innerHTML = data.data.craneLoadingWeightmt;
                document.getElementById('craneCharge').innerHTML = data.data.craneCharge;
                document.getElementById('craneTotalCharge').innerHTML = data.data.craneTotalCharge;
           
                document.getElementById('manualLoadingWeightmt').innerHTML = data.data.manualLoadingWeightmt;
                document.getElementById('manualCharge').innerHTML = data.data.manualCharge;
                document.getElementById('manualTotalCharge').innerHTML = data.data.manualTotalCharge;

               
               

                var prno = data.data.prNo;
                datatable = $("#ItemTable").DataTable({
                    ajax: {
                        'url': '/api/PR/PrintItemPR?prno=' + prno,
                        'type': 'GET',
                        'contentType': 'application/json',
                    },
                    columns:
                        [
                            { 'data': 'itemid', 'defaultContent': '', 'width': '2%', 'font-size': '6px' },
                            {
                                'data': 'itemsrno', 'render': function (data, type, row) {

                                    if (row.remarks != null) {
                                        var html1 =
                                            `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   </a> <br>
                                            <a>${row.remarks}<a/>`
                                    }
                                    else {
                                        var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"    </a>`
                                    }
                                    return html1;
                                }, 'width': '70%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                            },
                            { 'data': 'pmake', 'defaultContent': '', 'width': '5%', 'className': "text-center", 'font-size': '6px' },


                            { 'data': 'heatNo', 'defaultContent': '', 'width': '5%', 'font-size': '6px' },

                            {
                                'data': 'qty', 'render': function (data, type, row) {
                                    return `<a>${row.qty} ${row.qtyunit}</a>`;
                                }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
                            },


                            {
                                'data': 'altQty', 'render': function (data, type, row) {
                                    return `<a>${row.altQty} ${row.altQtyunit}</a>`;
                                }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
                            },

                            {
                                'data': 'itemWeight', 'render': function (data, type, row) {
                                    return `<a>${row.itemWeight} ${row.itemWeightUnit}</a>`;
                                }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
                            },


                        ], "autoWidth": false,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    "searching": false,
                    fixedColumns: true,
                    "bAutoWidth": false,
                }); window.addEventListener("load", document.title = title,);
            }
            else {

            }
        }
    });

}