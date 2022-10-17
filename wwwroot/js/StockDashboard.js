

$(document).ready(function () {
     TotalStockInNos()
   
    BarChart()
    stockTable()
    PieChart()
   
});



function noStockMovement() {

    var fromdate = document.getElementById('fromdate').value;
    var todate = document.getElementById('todate').value;
    var dateStringWithTime1 = moment(fromdate).format('DD-MMM-YY');
    var dateStringWithTime2 = moment(todate).format('DD-MMM-YY');
    document.getElementById('daterange').value = dateStringWithTime1 + " to " + dateStringWithTime2;


    dataTable = $("#noStockMovement").DataTable({
        ajax: {
            'url': '/api/StockDashboard/NOStockMovement',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                ddate: fromdate,
                lastdate: todate,
            }
        },
        columns: [

            { 'data': 'date', 'defaultContent': '-', 'width': '10%', 'font-size': '6px' },
            { 'data': 'pname', 'defaultContent': '-', 'width': '30%', 'font-size': '6px' },
            { 'data': 'psize', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            { 'data': 'pclass', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            { 'data': 'pmake', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            { 'data': 'pmake', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            {
                'data': 'qty', 'render': function (data, type, row) {
                    return `<a>${row.qty}  ${row.unit}   </a>`;
                }, 'width': '3%', 'className': "text-right", 'font-size': '6px'
            },
            {
                'data': 'altqty', 'render': function (data, type, row) {
                    return `<a>${row.altqty}  ${row.altunit}   </a>`;
                }, 'width': '8%', 'className': "text-right", 'font-size': '6px'
            },
        ],
        "font- size": '1em',
        dom: 'lBfrtip',

        "bDestroy": true,
        "paging": true,
        "searching": true,
        "ordering": false,
        "info": true,
        "scrollX": true,
        "scrollY": true,
        "responsive": true,



        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },

    });



}

/*function InsertQTy() {
    $.ajax({
        type: 'Post',
        url: '/api/StockDashboard/upd',
        success: function (data) {
            if (data.success) {
                Swal.fire(data.message, '', 'info')
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
  

}*/


function BarChart() {
    var ctxB = document.getElementById("barChart").getContext('2d');

    $.ajax({
        'url': '/api/StockDashboard/BarChart',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                var pieValues = [];
                var pieLabels = [];
                for (var i = 0; i < data.data.length; i++) {

                    pieValues.push(data.data[i].qty);
                    pieLabels.push(data.data[i].pmake + "(" + data.data[i].altqty.toLocaleString() + `-` + "NOS)");

                }
                var myBarChart = new Chart(ctxB, {
                    type: 'bar',
                    data: {
                        labels: pieLabels,
                        datasets: [{
                            label: 'Pipes',
                            data:
                                pieValues,

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

                }
                );





            }
            else {
                Swal.fire(
                    data.messages
                )
            }
        }
    })

}


function PieChart() {
    var ctxP = document.getElementById("labelChart").getContext('2d');
    $.ajax({
        'url': '/api/StockDashboard/BarChart',
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {

                var pieValues = [];
                var pieLabels = [];
                for (var i = 0; i < data.data.length; i++) {

                    pieValues.push(data.data[i].qty);
                    pieLabels.push(data.data[i].pmake);

                }
                var myPieChart = new Chart(ctxP, {
                    plugins: [ChartDataLabels],
                    type: 'pie',
                    data: {
                        labels: pieLabels,
                        datasets: [{
                            data: pieValues,
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




function stockTable() {
    dataTable = $("#stockTable").DataTable({

        ajax: {
            'url': '/api/StockDashboard/StockTable',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [


            { 'data': 'pname', 'defaultContent': '-', 'width': '30%', 'font-size': '6px' },
            { 'data': 'psize', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            { 'data': 'pclass', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },
            { 'data': 'pmake', 'defaultContent': '-', 'width': '5%', 'font-size': '6px' },


            {
                'data': 'status', 'render': function (data, type, row) {

                    if (row.status > row.qty) {
                        return `
                                <button type="button" class="btn btn-danger">Low Stock</button>
                                `;
                    }
                    else {
                        return `
                            <button type="button" class="btn btn-success">In Stock</button>
                            `;
                    }

                }, 'width': '10%', 'className': "text-center", 'font-size': '6px'
            },



            {
                'data': 'qty', 'render': function (data, type, row) {
                    return `<a>${row.qty}  ${row.unit}   </a>`;
                }, 'width': '3%', 'className': "text-right", 'font-size': '6px'
            },

            {
                'data': 'altqty', 'render': function (data, type, row) {
                    return `<a>${row.altqty}  ${row.altunit}   </a>`;
                }, 'width': '8%', 'className': "text-right", 'font-size': '6px'
            },





        ],
        "font- size": '1em',
        dom: 'lBfrtip',

        "bDestroy": true,
        "paging": true,
        "searching": true,
        "ordering": false,
        "info": true,
        "scrollX": true,
        "scrollY": true,
        "responsive": true,



        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },

    });
}



function TotalStockInNos(datadiv) {
    var datatable = "";
    var type = "";
    if (datadiv == "totalstock") {

        datatable = "#opningTable",
            type = "OPENING";

    }
    if (datadiv == "totalpurchase") {
        datatable = "#purchaseTable",
            type = "PURCHASE";
    }
    if (datadiv == "totalsale") {
        datatable = "#saleTable",
            type = "SALE";
    }
    if (datadiv == "currentstock") {
        datatable = "#currentstockTable",
        type = "CURRENT_STOCK";
    }

    dataTable = $(datatable).DataTable({

        ajax: {
            'url': '/api/StockDashboard/TotalStockInNos',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                Type: type
            }
        },
        columns: [
            { 'data': 'category', 'defaultContent': '-', 'width': '30%', 'font-size': '6px' },
            {
                'data': 'altqty', 'render': function (data, type, row)
                {
                    if (row.altqty != 0) {
                        return `<a>${row.qty.toFixed(2)} ${row.unit} ${row.altqty.toFixed(2)} ${row.altunit}</a>`;
                    } else {
                        return `<a>${row.qty.toFixed(2)} ${row.unit}</a>`;
                    }
                }, 'width': '70%', 'font-size': '6px'
            },
        ],
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": false,
        "autoWidth": false,
        


        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },

    });

}