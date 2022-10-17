
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

function StockReservation() {
    document.getElementById("itemwise").style.display = "block";
    document.getElementById("customerWise").style.display = "none";
    document.getElementById("itembutton").style.display = "none";
    document.getElementById("customerButton").style.display = "block";

    document.getElementById("label").innerHTML = "Item Wise Reserved List";
    
    var datatable = $("#reservedTable").DataTable({
        ajax: {
           'url': '/api/DP/ReservedItem',
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                { 'data': null, 'defaultContent': '', 'width': '.1%' },

                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   &nbsp(${row.pmake}) </a>`
                        return html1;
                    }, 'width': '30%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },
                { 'data': 'sono', 'defaultContent': '', 'width': '112px' },


                {
                    'data': 'rsdate', 'render': function (data) {
                        var dateStringWithTime = moment(data).format('DD-MM-YYYY');
                        return `<span>${dateStringWithTime}</span>`;
                    }, 'width': '5%', 'font-size': '6px'
                },

                { 'data': 'userid', 'defaultContent': '', 'width': '112px' },
                {
                    'data': 'itemid', 'render': function (data, type, row) {

                        return `<a> ${row.reservationqty} &nbsp; ${row.reservationqtyunit} </a>`
                    }, 'width': '112px'
                      
                },
                {
                    'data': 'Itemid', 'render': function (data, type, row) {
                        return `<button type="button" class="btn btn-danger" onclick=released(${row.id},${row.itemid},"${row.sono}")>Released</button>`;
                    }, 'width': '112px'
                      
                    },
                

            ],
        "language": {
            "emptyTable": "No data found"
        },
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,

    });
    datatable.on('order.dt ', function () {
        datatable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}


$('#checkall').change(function () {
    $('.checkitem').prop("checked", $(this).prop("checked"))
})



function IndentItems() {
 
 
    var datatable = $("#indentItemsTable").DataTable({
        ajax: {
            'url': '/api/DP/IndentItemsList',
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                {
                    'data': 'id', 'render': function (data, type, row) {
                        return `<input type="checkbox" class="checkitem" style="text-align:center" value="${[row.id]}"/>`;
                    }, 'width': '1px'

                },

                {
                    'data': 'id', 'render': function (data, type, row) {
                        var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   &nbsp(${row.pmake}) </a>`
                        return html1;
                    }, 'width': '40%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },
                { 'data': 'customername', 'defaultContent': '', 'width': '60px' },
                { 'data': 'sono', 'defaultContent': '', 'width': '30px' },
                {
                    'data': 'IndentQty', 'render': function (data, type, row) {
                        return `<a>${row.indentQty} &nbsp; ${row.qtyunit}</a>`
                    } , 'width': '40px'
                },
              
            ],





        
        "language": {
            "emptyTable": "No data found"
        },
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,
       

    });
    }

function CreateIndent() {
    var id = $('.checkitem:checked').map(
        function () {
        return $(this).val()
        }).get().join('/')
    const ItemId = id.split("/");

    $.ajax({
        type: 'Post',
        url: "api/SO/Currentstock",
        data: {
            pname: pname,
        },
        success: function (data) {
            if (data.success == true) {
           

            }

        }
    })
   
}


function customerWiseReservedList() {
    document.getElementById("itemwise").style.display = "none";
    document.getElementById("customerWise").style.display = "block";
    document.getElementById("itembutton").style.display = "block";
    document.getElementById("customerButton").style.display = "none";
    document.getElementById("label").innerHTML = "Customer Wise Reserved List";

    var datatable = $("#CustomerTable").DataTable({
        ajax: {
            'url': '/api/DP/ReservedItemCustomerWise',
            'type': 'GET',
            'contentType': 'application/json',
        },
        columns:
            [
                { 'data': null, 'defaultContent': '', 'width': '.1%' },

                
                { 'data': 'customername', 'defaultContent': '', 'width': '112px' },
                { 'data': 'sono', 'defaultContent': '', 'width': '112px' },


                {
                    'data': 'reservationdate', 'render': function (data) {
                        var dateStringWithTime = moment(data).format('DD-MM-YYYY');
                        return `<span>${dateStringWithTime}</span>`;
                    }, 'width': '5%', 'font-size': '6px'
                },

                { 'data': 'userid', 'defaultContent': '', 'width': '112px' },
               
                {
                    'data': 'sono', 'render': function (data, type, row) {
                        return `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#customerItemWise" onclick=ViewItem(this)>View Item</button>`;
                    }, 'width': '112px'

                },


            ],
        "language": {
            "emptyTable": "No data found"
        },
        "autoWidth": false,
        "dom": '<"top"i>rt<"bottom"flp><"clear">',
        "paging": false,
        "ordering": true,
        "info": false,
        "searching": false,
        fixedColumns: true,
        "bAutoWidth": false,
        "bDestroy": true,

    });
    datatable.on('order.dt ', function () {
        datatable.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}




function ViewItem(button) {
    var row = $(button).closest("TR");
    var Sono = $("TD", row).eq(2).html();
    var customerName = $("TD", row).eq(1).html();
    document.getElementById("Sono").innerHTML = Sono;
    document.getElementById("customerName").innerHTML = customerName;
   


    datatable2 = $("#CustomerItemTable").DataTable({
        ajax: {
            'url': '/api/DP/ReservedItemPartyWise',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                sono: Sono,
            },
        },
        columns:
            [
                { 'data': null, 'defaultContent': '', 'width': '.1%' },

                {
                    'data': 'itemid', 'render': function (data, type, row) {
                        var html1 = `<a>${row.pname} &nbsp;" ${row.psize}" &nbsp"${row.pclass}"   &nbsp(${row.pmake}) </a>`
                        return html1;
                    }, 'width': '30%', 'font-size': '10px', 'font-size': '90%', 'font-family': 'Tahoma',
                },


                {
                    'data': 'rsdate', 'render': function (data) {
                        var dateStringWithTime = moment(data).format('DD-MM-YYYY');
                        return `<span>${dateStringWithTime}</span>`;
                    }, 'width': '10%', 'font-size': '6px'
                },

                { 'data': 'userid', 'defaultContent': '', 'width': '60px' },
                {
                    'data': 'itemid', 'render': function (data, type, row) {

                        return `<a> ${row.reservationqty} &nbsp; ${row.reservationqtyunit} </a>`
                    }, 'width': '60px'

                },
                {
                    'data': 'Itemid', 'render': function (data, type, row) {
                        return `<button type="button" class="btn btn-danger" onclick=released(${row.id},${row.itemid},"${row.sono}")>Released</button>`;
                    }, 'width': '60px'

                },


            ],
        "language": {
            "emptyTable": "No data found"
        },
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "ordering": true,
        "info": false,
        "autoWidth": false,

    });
    datatable2.on('order.dt ', function () {
        datatable2.column(0, { order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}


function released(id, itemid ,sono) {
    Swal.fire({
        title: 'Are your sure you want to Released this Item?',
        text: "Once Released, The stock Will be Free.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'Delete',
                url: "api/DP/DeleteRealesd",
                data: {
                    ID: id,
                    Itemid: itemid,
                    Sono: sono,

                },
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

                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Released This Item'
                        })
                        $('#reservedTable').DataTable().ajax.reload();
                    }
                    else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Something Went Wrong'
                        })

                    }
                }
            })
        }
    })

}


function ReleasedSo(data) {
    var sono = document.getElementById("Sono").innerHTML;

    if (data != 'Cancel') {
        var Url = "api/DP/ReleasedSO"
    }
    else {
        var Url = "api/DP/CancelSO"
    }

    Swal.fire({
        title: 'Are your sure you want to Released this S.O?',
        text: "Once Released, The Item  Will be Free.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'Delete',
                url: Url,
                data: {
                    Sono: sono,
                },
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

                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Released This Item'
                        })
                        $('#CustomerTable').DataTable().ajax.reload();
                    }
                    else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Something Went Wrong'
                        })

                    }
                }
            })
        }
    })


    
}



