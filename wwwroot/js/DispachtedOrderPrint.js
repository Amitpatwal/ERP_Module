


onload=  function printDispachtedOrder() {
    var url = new URLSearchParams(window.location.search);
    var idd = url.get('DONO');
    $.ajax({
        'url': '/api/DO/PrintDO?dono=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data ) {
            if (data.success == true) {

                document.getElementById('customername').innerHTML = data.data1.billCompanyname;
                document.getElementById('customeraddress').innerHTML = data.data1.billAddress;
                document.getElementById('Consignename').innerHTML = data.data1.consignCompanyname;
                document.getElementById('Consigneaddress').innerHTML = data.data1.consignAddress;
                document.getElementById('dodate').innerHTML = data.data.doDate;
                document.getElementById('dono').innerHTML = data.data.doNo;
                document.getElementById('invoiceno').innerHTML = data.data1.soNo;




                document.getElementById('transportname').innerHTML = data.data.transportName;
                document.getElementById('vechileno').innerHTML = data.data.vechileNo;
                document.getElementById('grno').innerHTML = data.data.grNO;
                document.getElementById('drivername').innerHTML = data.data.driverName;
                document.getElementById('licenseno').innerHTML = data.data.license;
                document.getElementById('freighttype').innerHTML = data.data.freightType;
                document.getElementById('freightamount').innerHTML = data.data.freightCharge;
                document.getElementById('forwardingTransportAmount').innerHTML = data.data.forwardingTransportAmount;


                document.getElementById('craneLoadingWeightmt').innerHTML = data.data.craneLoadingWeightmt;
                document.getElementById('craneCharge').innerHTML = data.data.craneCharge;
                document.getElementById('craneTotalCharge').innerHTML = data.data.craneTotalCharge;
           
                document.getElementById('manualLoadingWeightmt').innerHTML = data.data.manualLoadingWeightmt;
                document.getElementById('manualCharge').innerHTML = data.data.manualCharge;
                document.getElementById('manualTotalCharge').innerHTML = data.data.manualTotalCharge;
           
                




                var dono = data.data.doNo;
                datatable = $("#ItemTable").DataTable({
                    ajax: {
                        'url': '/api/DO/PrintItemDO?dOno=' + dono,
                        'type': 'GET',
                        'contentType': 'application/json',
                    },
                    columns:
                        [
                            { 'data': 'itemsrno', 'defaultContent': '', 'width': '2%', 'font-size': '6px' },
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


                            { 'data': 'heatNumber', 'defaultContent': '', 'width': '5%', 'font-size': '6px' },

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
                });
            }
            else {

            }
        }
    });

}