var myPieChart = "";
var myBarChart = "";
$(document).ready(function () {

    PieChart()
    counter()
    BarChart()
    document.getElementById("ddashboard").style.background = "red";


});
function PieChart() {
    var ctxP = document.getElementById("labelChart").getContext('2d');
    $.ajax({
        'url': '/api/Login/counter',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {

                myPieChart = new Chart(ctxP, {
                    plugins: [ChartDataLabels],
                    type: 'pie',
                    data: {
                        labels: ["Pending Quotation", "Total PI", "Order Converted",],
                        datasets: [{
                            data: [
                                data.data.pendingQuotation,
                                data.data.totalPI,
                                data.data.orderConverted,
                              
                            ],
                            backgroundColor: ["#F7464A", "#46BFBD", "#949FB1", "#4D5360"],
                            hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#A8B3C5", "#616774"]
                        }]
                    },
                    options: {
                        responsive: true,

                        plugins: {
                            datalabels: {
                                formatter: (value, ctx) => {
                                    let sum = 0;
                                    let dataArr = ctx.chart.data.datasets[0].data;
                                    dataArr.map(data => {
                                        sum += data;
                                    });
                                    let percentage = (value * 100 / sum).toFixed(2) + "%";
                                    return percentage;
                                },
                                color: 'white',
                                labels: {
                                    title: {
                                        font: {
                                            size: '16'
                                        }
                                    }
                                }
                            }
                        }
                    }
                });


            }


            else {
                Swal.fire(
                    data.messages
                )
            }
        }
    })
}

function BarChart() {
    var ctxB = document.getElementById("barChart").getContext('2d');

    $.ajax({
        'url': '/api/Login/counter',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                myBarChart = new Chart(ctxB, {
                    type: 'bar',
                    data: {
                        labels: ["Sales Quotation", "Pending Quotation", "Performa Invoice", "Sale Order", ],
                        datasets: [{
                            label: '# of Sales',
                            data: [
                                data.data.totalQuotation,
                                data.data.pendingQuotation,
                                data.data.totalPI,
                                data.data.orderConverted,
                                
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 400, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',

                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',

                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });


            }
            else {
                Swal.fire(
                    data.messages
                )
            }
        }
    })

}
function counter() {
    $.ajax({
        'url': '/api/Login/counter',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("Totalquotation").innerHTML = "(₹" + data.data.totalQuotation.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ")";
                document.getElementById("pendingQuotation").innerHTML = "(₹" + data.data.pendingQuotation.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ")";
                document.getElementById("totalPI").innerHTML = "(₹" + data.data.totalPI.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ")";
                document.getElementById("OrderConverted").innerHTML = "(₹" + data.data.orderConverted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ")";
                document.getElementById("pendingOrder").innerHTML =  "₹" +data.data.pendingQuotation.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                document.getElementById("dailyquotation").innerHTML = "₹" +data.data.dailyquotation.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                document.getElementById("totalsaleOrder").innerHTML = "₹" +data.data.totalsaleOrder.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                
              /*  document.getElementById("dailyquotation").innerHTML = data.data.dailyquotation.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                document.getElementById("totalsaleOrder").innerHTML = data.data.pendingQuotation.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
*/
                
            }
            else {
                Swal.fire(
                    data.messages
                )
            }
        }
    })
}

function viewReport() {

    myPieChart.destroy();

    var ctxP = document.getElementById("labelChart").getContext('2d');
    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;


    $.ajax({
        'url': '/api/Login/counter2',
        'type': 'GET',
        'contentType': 'application/json',
        data: {
            fromdate: fromdate,
            todate: todate,
        },
        success: function (data) {
            if (data.success == true) {
                myPieChart = new Chart(ctxP, {
                    plugins: [ChartDataLabels],
                    type: 'pie',
                    data: {
                        labels: ["Pending Quotation", "Total PI", "Order Converted",],
                        datasets: [{
                            data: [
                                data.data.pendingQuotation,
                                data.data.totalPI,
                                data.data.orderConverted,

                            ],
                            backgroundColor: ["#F7464A", "#46BFBD", "#949FB1", ],
                            hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#A8B3C5", ]
                        }]
                    },
                    options: {
                        responsive: true,

                        plugins: {
                            datalabels: {
                                formatter: (value, ctx) => {
                                    let sum = 0;
                                    let dataArr = ctx.chart.data.datasets[0].data;
                                    dataArr.map(data => {
                                        sum += data;
                                    });
                                    let percentage = (value * 100 / sum).toFixed(2) + "%";
                                    return percentage;
                                },
                                color: 'white',
                                labels: {
                                    title: {
                                        font: {
                                            size: '16'
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                document.getElementById("Totalquotation").innerHTML = "(" + data.data.totalQuotation.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ")";
                document.getElementById("pendingQuotation").innerHTML = "(" + data.data.pendingQuotation.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ")";
                document.getElementById("totalPI").innerHTML = "(" + data.data.totalPI.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ")";
                document.getElementById("OrderConverted").innerHTML = "(" + data.data.orderConverted.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ")";
                document.getElementById("datelabel").style.display = "block";
                document.getElementById("recordfrom").innerHTML = fromdate;
                document.getElementById("recordto").innerHTML = todate;
            }


            else {
                Swal.fire(
                    data.messages
                )
            }
        }
    })
}
function resestData() {

    document.getElementById("totalQuotation").innerHTML = "";
    document.getElementById("pendingQuotation").innerHTML = "";
    document.getElementById("CancelQuotation").innerHTML = "";
    document.getElementById("OrderConverted").innerHTML = "";
    document.getElementById("InvoiceCreated").innerHTML = "";


}
function salesviewReport() {
    myBarChart.destroy();
    var ctxB = document.getElementById("barChart").getContext('2d');
    var fromdate = document.getElementById('salesfromdate').value;
    var todate = document.getElementById('salestodate').value;


    $.ajax({
        'url': '/api/Login/counter2',
        'type': 'GET',
        'contentType': 'application/json',
        data: {
            fromdate: fromdate,
            todate: todate,
        },
        success: function (data) {
            if (data.success == true) {

                myBarChart = new Chart(ctxB, {
                    type: 'bar',
                    data: {
                        labels: ["Sales Quotation", "Pending Quotation", "Performa Invoice", "Sale Order",],
                        datasets: [{
                            label: '# of Votes',
                            data: [
                                data.data.totalQuotation,
                                data.data.pendingQuotation,
                                data.data.totalPI,
                                data.data.orderConverted,
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 400, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',

                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',

                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });

                document.getElementById("salesdatelabel").style.display = "block";
                document.getElementById("salesrecordfrom").innerHTML = fromdate;
                document.getElementById("salesrecordto").innerHTML = todate;


            }


            else {
                Swal.fire(
                    data.messages
                )
            }
        }
    })
}
