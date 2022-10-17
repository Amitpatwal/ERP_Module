$(document).ready(function () {
    printquotation();

});



function printquotation() {
    var url = new URLSearchParams(window.location.search);
    var idd = url.get('PINO');
    $.ajax({
        'url': '/api/PI/PrintPI?pino=' + idd,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {

                var Billcompanyname = data.data[0].billCompanyname;
                document.getElementById('billcompanyname').innerHTML = "M/s  &nbsp;" + Billcompanyname;
                document.getElementById('billcontactperson').innerHTML = data.data[0].billContactperson;
                document.getElementById('billemailid').innerHTML = data.data[0].billEmail;
                document.getElementById('billgst').innerHTML = data.data[0].billGST;
                document.getElementById('billAddress').innerHTML = data.data[0].billAddress;



                var ConsignCompanyname = data.data[0].consignCompanyname;

                document.getElementById('consigncompanyname').innerHTML = "M/s  &nbsp;" + ConsignCompanyname;
                
                document.getElementById('consigncontactperson').innerHTML = data.data[0].consignContactperson;
                document.getElementById('consignemailid').innerHTML = data.data[0].consignEmail;
                document.getElementById('consigngst').innerHTML = data.data[0].consignGST;
                document.getElementById('consignaddress').innerHTML = data.data[0].consignAddress;





                document.getElementById('pino').innerHTML = data.data[0].piNo;
                var pidate = data.data[0].date;
                var now = pidate.toString().replace('', ' ');
                var dateStringWithTime = moment(now).format('DD-MMMM-YYYY hh:mm');
                var hours = moment(now).format('hh');
                var x = Number(hours)
                var ampm = x >= 12 ? 'PM' : 'AM';
                dateStringWithTime = dateStringWithTime + " " + ampm;
                document.getElementById("pidate").innerHTML = dateStringWithTime.toString();



                var podate = data.data[0].poDate;
                var now1 = podate.toString().replace('', ' ');
                var dateStringWithTime1 = moment(now1).format('DD-MMMM-YYYY hh:mm');
                var hours1 = moment(now1).format('hh');
                var x1 = Number(hours1)
                var ampm1 = x1 >= 12 ? 'PM' : 'AM';
                dateStringWithTime1 = dateStringWithTime1 + " " + ampm1;
                document.getElementById("podate").innerHTML = dateStringWithTime1.toString();


               
                var pino = document.getElementById('pino').innerHTML;
                var title = Billcompanyname + '_' + pino;


                document.getElementById('pono').innerHTML = data.data[0].poNo;

                document.getElementById('amdno').innerHTML = data.data[0].amendno;
                var amddate = data.data[0].amendDAte;
                var amdnow = amddate.toString().replace('', ' ');
                var amddateStringWithTime = moment(amdnow).format('DD-MMMM-YYYY hh:mm');
                var amdhours = moment(amdnow).format('hh');
                var amdx = Number(amdhours)
                var amdampm = amdx >= 12 ? 'PM' : 'AM';
                amddateStringWithTime = amddateStringWithTime + " " + ampm;
                document.getElementById("amddate").innerHTML = amddateStringWithTime.toString();


                document.getElementById('qtnno').innerHTML = data.data[0].quotno;



                var subtotal = data.data[0].amount;
                subtotal = subtotal.toFixed(2);
                subtotal = subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('subtotal').innerHTML = subtotal;
                const subtotal1 = data.data[0].amount;


                document.getElementById('label1').innerHTML = data.data[0].label1;
                document.getElementById('input1').innerHTML = data.data[0].input1;
                const input1 = data.data[0].input1;


                document.getElementById('label2').innerHTML = data.data[0].label2;
                document.getElementById('input2').innerHTML = data.data[0].input2;
                const input2 = data.data[0].input2;



                const middleamt = (subtotal1 + input1 + input2)
                var md = middleamt;
                md = md.toFixed(2);
                md = md.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                document.getElementById('totalbeforegst').innerHTML = md;


                const tax = data.data[0].tax;

                if (tax == "GST") {
                    const gst = (middleamt * 18) / 100;

                    document.getElementById('TAX').innerHTML = tax + "(18%)";
                    GST = gst.toFixed(2);
                    GST = GST.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    document.getElementById('gst').innerHTML = GST


                    const finaltotal = middleamt + gst;
                    var ft = finaltotal;
                    ft = ft.toFixed(2);
                    ft = ft.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    document.getElementById('finaltotal').innerHTML = ft;




                    document.getElementById('label3').innerHTML = data.data[0].label3;
                    document.getElementById('input3').innerHTML = data.data[0].input3;
                    const previousbalance = data.data[0].input3;



                    const grandtotal = (finaltotal + previousbalance)
                    var GD = grandtotal;
                    GD = GD.toFixed(2);
                    GD = GD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    document.getElementById('grandtotal').innerHTML = '₹ ' + GD;

                    if (data.bk == true) {
                        document.getElementById('bankname').innerHTML = data.bank.bankName;
                        document.getElementById('branch').innerHTML = data.bank.branch;
                        document.getElementById('acno').innerHTML =  "<b> ACC : </b>"+ data.bank.acoountNo;
                        document.getElementById('ifsc').innerHTML = "<b> IFSC :</b>"+ data.bank.isfc;
                    }

                }
                else {
                    const gst = [(middleamt * 0.1) / 100]
                    document.getElementById('TAX').innerHTML = tax
                    document.getElementById('gst').innerHTML = gst
                }









                var pino = data.data[0].piNo;
                var piNO = document.getElementById('pino').innerHTML;
                var companyname = document.getElementById('billcompanyname').innerHTML;
                var title = companyname + '_' + piNO;

                datatable = $("#ItemTable").DataTable({
                    ajax: {
                        'url': '/api/PI/PrintItemPi?pino=' + pino,
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
                                                `<a>${row.pname} &nbsp; "  ${row.psize}"  &nbsp"${row.pclass}" <br/>  &nbsp(${row.pmake}) </a> 
                                            <a>${row.remarks}<a/>`
                                        }
                                        else if (row.pclass != null) {
                                            var html1 = `<a>${row.pname}&nbsp;   ${row.psize}" &nbsp"${row.pclass}"
                                            <a>${row.remarks}<a/>`
                                        }
                                        else {
                                            var html1 = `<a>${row.pname} &nbsp;"  ${row.psize}"  </a>
                                            <a>${row.remarks}<a/>`
                                        }
                                    }
                                    else {
                                        if (row.pmake != null) {

                                            if (row.pclass != null) {
                                                var html1 =
                                                    `<a>${row.pname} &nbsp; </br>  " ${row.psize}"  &nbsp"${row.pclass}" </br>  &nbsp(${row.pmake}) </a>`
                                            }
                                            else {
                                                var html1 =
                                                    `<a>${row.pname} &nbsp; </br>  " ${row.psize}"  </br>  &nbsp(${row.pmake})  </a>`
                                            }
                                        }
                                        else if (row.pclass != null) {
                                            var html1 = `<a>${row.pname} &nbsp; </br>  " ${row.psize}"  &nbsp"${row.pclass}" </br> </a>`
                                        }
                                        else {
                                            var html1 = `<a>${row.pname} &nbsp;  </br> "${row.psize}" </a>`
                                        }
                                    }
                                    return html1;
                                }, 'width': '35%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                            },
                            { 'data': 'hsncode', 'defaultContent': '', 'width': '5%', 'height': '30%', 'className': "text-center", 'font-size': '6px' },
                            {
                                'data': 'rate', 'render': function (data, type, row) {
                                    var rate = row.rate;
                                    rate = rate.toFixed(2);
                                    rate = rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                    return `<a>₹ ${rate}</a>`;
                                }, 'width': '15%', 'height': '30%', 'className': "text-right", 'font-size': '6px'
                            },
                            { 'data': 'rateunit', 'defaultContent': '', 'height': '30%', 'width': '5%', 'font-size': '6px' },
                            {
                                'data': 'discount', 'render': function (data, type, row) {
                                    var discount = row.discount;
                                    return `<a>${discount} %


</a>`;
                                }

                                , 'width': '5%', 'height': '30%', 'className': "text-right", 'font-size': '6px',
                            },

                            {
                                'data': 'discountrate', 'render': function (data, type, row) {
                                    var discountrate = row.discountrate;
                                    discountrate = discountrate.toFixed(2);
                                    qdiscountratety = discountrate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                    return `<a>₹ ${discountrate}</a>`;
                                }, 'width': '10%', 'height': '30%', 'className': "text-right", 'font-size': '6px'
                            },


                            {
                                'data': 'qty', 'render': function (data, type, row) {
                                    var qty = row.qty;

                                    qty = qty.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                    return `<a>${qty} ${row.rateunit}</a>`;
                                }, 'width': '10%', 'height': '30%', 'className': "text-right", 'font-size': '6px'
                            },


                            {
                                'data': 'amount', 'render': function (data, type, row) {
                                    var amount = row.amount;
                                    amount = amount.toFixed(2);
                                    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                    return `<a>₹ ${ amount}</a>`;
                                }, 'width': '15%', 'height': '30%', 'className': "text-right", 'font-size': '6px'
                            },

                            /*{ 'data': 'amount', 'defaultContent': '',  },*/



                        ],

                 
                    "autoWidth": false,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    "searching": false,
                    fixedColumns: false,
                    "bAutoWidth": false,
                },);
                window.addEventListener("load", document.title = title);

            }
            else {

            }
        }
    }

    );

}