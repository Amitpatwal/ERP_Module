
window.onload =function printpurchaseorder()

{
    var url = new URLSearchParams(window.location.search);
    var idd = url.get('PONO');
    $.ajax({
        'url': '/api/PO/PrintPO?pOno=' + idd, 
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {

                var RecipientCompanyname = data.data.recipientCompanyname;
                document.getElementById('billcompanyname').innerHTML = "M/s  &nbsp;" + RecipientCompanyname;
             
                document.getElementById('billcontactperson').innerHTML = data.data.recipientContactPerson;
                document.getElementById('billemailid').innerHTML = data.data.recipientEmail;
                document.getElementById('billgst').innerHTML = data.data.recipientGST;
                document.getElementById('billAddress').innerHTML = data.data.recipientAddress;
                document.getElementById('billmobile').innerHTML = data.data.recipientMobile;
                document.getElementById('billpan').innerHTML = data.pan.recieptPan;


                var SupplierCompanyname = data.data.supplierCompanyname;
                document.getElementById('supcompanyname').innerHTML = "M/s  &nbsp;" + SupplierCompanyname;

               
                document.getElementById('supAddress').innerHTML = data.data.supplierAddress;
                document.getElementById('supgst').innerHTML = data.data.supplierGST;
                document.getElementById('shipcompanyname').innerHTML = data.data.consignCompanyname;
                document.getElementById('shipcontactperson').innerHTML = data.data.consignContactPerson;
                document.getElementById('shipemailid').innerHTML = data.data.consignEmail;
                document.getElementById('shipgst').innerHTML = data.data.consignGST;
                document.getElementById('shipAddress').innerHTML = data.data.consignAddress;
                document.getElementById('shipcontactNO').innerHTML = data.data.consignMobile;
                document.getElementById('suppan').innerHTML = data.pan.supplierPan



                document.getElementById('cashdiscount').innerHTML = data.data.cash;
                document.getElementById('delivery').innerHTML = data.data.delivery;
                document.getElementById('gst').innerHTML = data.data.gst;
                document.getElementById('mtc').innerHTML = data.data.mtc;
                document.getElementById('not').innerHTML = data.data.nameofTransport;
                document.getElementById('pricebasic').innerHTML = data.data.priceBasis             
                document.getElementById('payementterms').innerHTML = data.data.paymentTerms
                document.getElementById('freightcharges').innerHTML = data.data.freightCharge;
                document.getElementById('shippan').innerHTML = data.pan.consignPan;
                



                document.getElementById('pono').innerHTML = data.data.poNo           
                var podate = data.data.date;
                var now = podate.toString().replace('', ' ');
                var dateStringWithTime = moment(now).format('DD-MMMM-YYYY hh:mm');
                var hours = moment(now).format('hh');
                var x = Number(hours)
                var ampm = x >= 12 ? 'PM' : 'AM';
                dateStringWithTime = dateStringWithTime + " " + ampm;
                document.getElementById("podate").innerHTML = dateStringWithTime.toString();
                document.getElementById("refrenceno").innerHTML = data.data.recipientOrderNo


                var orderdate = data.data.recipientOrderDate;
                var ordernow = orderdate.toString().replace('', ' ');
                var orderdateStringWithTime = moment(ordernow).format('DD-MMMM-YYYY hh:mm');
                var orderhours = moment(ordernow).format('hh');
                var x = Number(orderhours)
                var ampm = x >= 12 ? 'PM' : 'AM';
                orderdateStringWithTime = orderdateStringWithTime + " " + ampm;
                document.getElementById("refrencedate").innerHTML = orderdateStringWithTime.toString();
                var subtotal = data.data.amount;
                subtotal = subtotal.toFixed(2);
                subtotal = subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('subtotal').innerHTML = "₹" + subtotal;

                var pono = data.data.poNo;

                var pONO = document.getElementById('pono').innerHTML;
                var companyname = document.getElementById('billcompanyname').innerHTML;
                var title = companyname + '_' + pONO;
                


                datatable = $("#ItemTable").DataTable({
                    ajax: {
                        'url': '/api/PO/PrintItemPO?pOno=' + pono,
                        'type': 'GET',
                        'contentType': 'application/json',
                    },
                    columns:
                        [
                            { 'data': 'itemid', 'defaultContent': '', 'width': '2%', 'font-size': '6px' },


                            {
                                'data': 'itemid', 'render': function (data, type, row) {
                                    if (row.remarks != null) {
                                        if (row.pmake != null) {
                                            var html1 =
                                                `<a>${row.pname} &nbsp; " <br/> ${row.psize}"  &nbsp"${row.pclass}"  <br/>  &nbsp(${row.pmake}) </a> <br/>
                                            <a>${row.remarks}<a/>`
                                        }
                                        else if (row.pclass != null) {
                                            var html1 = `<a>${row.pname}&nbsp; <br/>  ${row.psize}" &nbsp"${row.pclass}"<br/>
                                            <a>${row.remarks}<a/>`
                                        }
                                        else {
                                            var html1 = `<a>${row.pname} &nbsp;" <br/>  ${row.psize}"  </a><br/>
                                            <a>${row.remarks}<a/>`
                                        }
                                    }
                                    else {
                                        if (row.pmake != null) {
                                            var html1 =
                                                `<a>${row.pname} &nbsp; <br/>  " ${row.psize}"  &nbsp"${row.pclass}" <br/>  &nbsp(${row.pmake}) <br/> </a>`
                                        }
                                        else if (row.pclass != null) {
                                            var html1 = `<a>${row.pname} &nbsp; <br/> " ${row.psize}" &nbsp"${row.pclass}" <br/> </a>`
                                        }
                                        else {
                                            var html1 = `<a>${row.pname} &nbsp; <br/>  "${row.psize}"  </a>`
                                        }
                                    }
                                    return html1;
                                }, 'width': '35%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                            },

                            { 'data': 'hsncode', 'defaultContent': '', 'width': '5%', 'className': "text-center", 'font-size': '6px' },

                            { 'data': 'rateunit', 'defaultContent': '', 'width': '5%', 'font-size': '6px' },
                            {
                                'data': 'rate', 'render': function (data, type, row) {
                                    var rate = row.rate;
                                    rate = rate.toFixed(2);
                                    rate = rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                    return `<a>₹ ${rate}</a>`;
                                }, 'width': '12%', 'className': "text-right", 'font-size': '6px'
                            },
                            {
                                'data': 'discount', 'render': function (data, type, row) {
                                    var discount = row.discount;
                                    return `<a>${discount} %
                                </a>`;
                                }

                                , 'width': '5%', 'className': "text-right", 'font-size': '6px',
                            },

                            {
                                'data': 'discountrate', 'render': function (data, type, row) {
                                    var discountrate = row.discountrate;
                                    discountrate = discountrate.toFixed(2);
                                    discountrate = discountrate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                    return `<a>₹ ${discountrate}</a>`;
                                }, 'width': '12%', 'className': "text-right", 'font-size': '6px'
                            },

                           
                            {
                                'data': 'qty', 'render': function (data, type, row) {
                                    return `<a>${row.qty} ${row.rateunit}</a>`;
                                }, 'width': '10%', 'font-size': '5px', 'font-size': '6px', 'className': "text-center"
                            },

                            {
                                'data': 'amount', 'render': function (data, type, row) {
                                    var amount = row.amount;
                                    amount = amount.toFixed(2);
                                    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                    return `<a>₹ ${amount}</a>`;
                                }, 'width': '10%', 'className': "text-right", 'font-size': '6px'
                            },
                        ],

                    "autoWidth": false,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    "searching": false,
                    fixedColumns: true,
                    "bAutoWidth": false,



                });
                window.addEventListener("load", document.title = title);
                
            }
            else {

            }
        }
    });

}