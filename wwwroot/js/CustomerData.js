$(document).ready(function () {
    LoadDatatable()
    print_state("STATE");
    fillcompany1('transportname', 'Transporter');
    $(document).on('keydown', '.custom-dropdown .select2-search__field', function (ev) {
        var self = $(this);
        if (self.val().length > 5) {
            console.log(self.val());
        }
    });
});

function LoadDatatable() {

    var updatePermission = false;
    var deletePermission = false;
    
    $.ajax({
        url: '/api/SO/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "CUSTOMER_DATA",
        },
        success: function (data) {
            if (data.data[1].operations == "CREATE") {
                if (data.data[1].permission == true) {
                    document.getElementById('validation').style.display = "block";
                } else {
                    document.getElementById('validation').style.display = "none";
                }
            }
            if (data.data[2].operations == "UPDATE") {
                if (data.data[2].permission == true) {
                    updatePermission = true;
                } else {
                    updatePermission = false;
                }
            }
            if (data.data[0].operations == "VIEW") {
                if (data.data[0].permission == true) {
                    ViewPermission = true;
                } else {
                    ViewPermission = false;
                }
            }
            if (data.data[3].operations == "DELETE") {
                if (data.data[3].permission == true) {
                    deletePermission = true;
                } else {
                    deletePermission = false;
                }
            }
            dataTable = $("#companylistTable").DataTable({
                ajax: {
                    'url': '/api/Client/Filldatatable',
                    'type': 'GET',
                    'contentType': 'application/json'
                },
                columns: [
                    { 'data': null, 'defaultContent': '-', 'width': '.5%' },
                    { 'data': 'companyname', 'defaultContent': '-', 'width': '10%' },
                    { 'data': 'contactPerson', 'defaultContent': '-', 'width': '10%' },
                    { 'data': 'dealingPerson', 'defaultContent': '-', 'width': '10%' },
                    { 'data': 'city', 'defaultContent': '-', 'width': '5%' },
                    { 'data': 'state', 'defaultContent': '-', 'width': '5%' },
                    { 'data': 'type', 'defaultContent': '-', 'width': '5%' },


                /*    {
                        'data': 'customerid', 'render': function (data) {
                            if (updatePermission == true && deletePermission == true) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal1" onclick=fetchClient(${data})><i class="fas fa-pencil-alt"></i>Edit</a>
                              <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteClient(${data})> <i class="fas fa-trash"></i>Delete</a>
                              <a class="btn btn-success btn-sm" style="color:white" data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"LEDGER","",1)> <i class="fa fa-history"></i>Logs</a>`;
                            }
                            else if (updatePermission == true && deletePermission == false) {
                                return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal1" onclick=fetchClient(${data})><i class="fas fa-pencil-alt"></i>Edit</a>
                                        <a class="btn btn-success btn-sm" style="color:white" data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"LEDGER","",1)> <i class="fa fa-history"></i>Logs</a>`;
                            }
                            else if (updatePermission == false && deletePermission == true) {
                                return ` <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteClient(${data})> <i class="fas fa-trash"> </i>Delete</a>
                                        <a class="btn btn-success btn-sm" style="color:white" data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"LEDGER","",1)> <i class="fa fa-history"></i>Logs</a>`;
                            }
                            else {
                                return ``;
                            }
                        }, 'width': '10%'
                    },*/


                    {
                        'data': 'customerid', 'render': function (data, type, row) {

                            if (updatePermission == true && deletePermission == true) {

                                return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a href="" class="dropdown-item" data-toggle="modal" data-target="#exampleModal1" onclick=fetchClient(${data})> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a href="" class="dropdown-item"  onclick=deleteClient(${data})> <i class="fas fa-trash"></i> &nbsp;Delete</a>
                                              <a href="" class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"LEDGER","",1)> <i class="fa fa-history"></i> &nbsp;Logs</a>
                                            </div> </div>
                                        `;


                            }
                            else if (updatePermission == true && deletePermission == false) {
                                return ` <div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a href="" class="dropdown-item" data-toggle="modal" data-target="#exampleModal1" onclick=fetchClient(${data})> <i class="fas fa-pencil-alt" ></i> &nbsp; Edit</a>
                                              <a href="" class="dropdown-item"  data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"LEDGER","",1)> <i class="fa fa-history"></i> &nbsp;Logs</a>
                                            </div> </div>
                                        `;
                            }
                            else if (updatePermission == false && deletePermission == true) {
                                return `<div class="btn-group">
                                            <button type="button" class="btn btn-info">Action</button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                              <span class="sr-only">Toggle Dropdown</span>
                                            </button>
                                            <div class="dropdown-menu" role="menu">
                                              <a href="" class="dropdown-item" data-toggle="modal" data-target="#logsDetails" onclick=LogsDetails("${data}",this,"LEDGER","",1)> <i class="fa fa-history"></i> &nbsp;Logs</a>
                                            </div>
                                          </div>
                                        `;
                            }
                            else {
                                return ``
                            }


                        }, 'width': '3%', 'className': "text-right", 'font-size': '6px'
                    },


                ],
                "scrollX": true,
                "scrollY": true,
                "paging":false,
                language: {
                    searchPlaceholder: "Search records",
                    emptyTable: "No data found",
                    width: '100%',
                },
            });
            dataTable.on('order.dt search.dt', function () {
                dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();
            
        }
    });
}
function LoadDatatableWithout() {
    dataTable = $("#companylistTable").DataTable({
        ajax: {
            'url': '/api/Client/Filldatatable',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'companyname', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'contactPerson', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'dealingPerson', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'city', 'defaultContent': '-', 'width': '5%' },
            { 'data': 'state', 'defaultContent': '-', 'width': '5%' },
            { 'data': 'type', 'defaultContent': '-', 'width': '5%' },
            {
                'data': 'customerid', 'render': function (data) {
                    return `<a class="btn btn-info btn-sm" style="color:white" data-toggle="modal" data-target="#exampleModal1" onclick=fetchClient(${data})><i class="fas fa-pencil-alt">
                              </i>Edit</a>
                            
                              <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteClient(${data})> <i class="fas fa-trash">
                              </i>Delete</a>`;
                }, 'width': '10%'
            },

        ],
        "scrollX": true,
        "scrollY": true,
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '100%',
        },
    });
    dataTable.on('order.dt search.dt', function () {
        dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
}
function resetdata() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('crdrdate').value = dateStringWithTime;
    document.getElementById("CompanyName").value = "";
    document.getElementById("CustomerName").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("PhoneNo").value = "";
    document.getElementById("PAN").value = "";
    document.getElementById("GST").value = "";
    document.getElementById("STATE").value = "";
    document.getElementById("STATE").selectedIndex = "";
    document.getElementById("CITY").value = "";
    document.getElementById("Address").value = "";
    document.getElementById("customerid").value = "";
    document.getElementById("openingbalance").value = "";
    document.getElementById("saveebutton").innerHTML = "Save";

    document.getElementById("statelabel").style.color = "black";
    document.getElementById("STATE").style.borderColor = "lightgrey";
    document.getElementById("CITY").style.borderColor = "lightgrey";
    document.getElementById("citylabel").style.color = "black";
    document.getElementById("companynamelabel").style.color = "black";
    document.getElementById("CompanyName").style.borderColor = "lightgrey";
    document.getElementById("opningbalancebutton").style.display = "none";
}
function addcompany() {
    var CompanyName = document.getElementById("CompanyName").value;
    var CustomerName = document.getElementById("CustomerName").value;
    var DealingPerson = document.getElementById("dealingPerson").value;
    var Email = document.getElementById("Email").value;
    var PhoneNo = document.getElementById("PhoneNo").value;

    var GST = document.getElementById("GST").value;
    var STATE = document.getElementById("STATE").value;
    var statecode = document.getElementById("STATE").selectedIndex;
    var CITY = document.getElementById("CITY").value;
    var Type = document.getElementById("type").value;
    var Address = document.getElementById("Address").value;
    var customerid = document.getElementById("customerid").value;
    var openingBalance = document.getElementById("openingbalance").value;
    var Crdr = document.getElementById("crdr").value;
    var crdrdate = document.getElementById("crdrdate").value;

    var counter = 0;
    var PAN = document.getElementById("PAN").value;
    var now = new Date();
    var ddate = moment(now).format('YYYY-MM-DDTHH:mm:ss');
    if (STATE == "") {
        counter = counter + 1;
        document.getElementById("statelabel").style.color = "red";
        document.getElementById("STATE").style.borderColor = "red";
    } else {
        document.getElementById("statelabel").style.color = "lightgrey";
        document.getElementById("STATE").style.borderColor = "black";
    }
    if (CITY == "") {
        counter = counter + 1;
        document.getElementById("citylabel").style.color = "red";
        document.getElementById("CITY").style.borderColor = "red";
    }
    else {
        document.getElementById("citylabel").style.color = "lightgrey";
        document.getElementById("CITY").style.borderColor = "black";
    }
    if (CompanyName == "" ) {
        counter = counter + 1;
        document.getElementById("CompanyName").placeholder = "Company Name is Missing";
        document.getElementById("companynamelabel").style.color = "red";
        document.getElementById("CompanyName").style.borderColor = "red";
    }
    else {
        document.getElementById("companynamelabel").style.color = "lightgrey";
        document.getElementById("CompanyName").style.borderColor = "black";

    }

    if (DealingPerson == "") {
        counter = counter + 1;
        document.getElementById("dealingPerson").placeholder = "Dealing Person is Missing";
        document.getElementById("dealingPersonlabel").style.color = "red";
        document.getElementById("dealingPerson").style.borderColor = "red";
    }
    else {
        document.getElementById("dealingPersonlabel").style.color = "lightgrey";
        document.getElementById("dealingPerson").style.borderColor = "black";

    }


    if (Email == "") {
        counter = counter + 1;
        document.getElementById("Email").placeholder = "E-mail Name is Missing";
        document.getElementById("emaillabel").style.color = "red";
        document.getElementById("Email").style.borderColor = "red";
    }
    else {
        document.getElementById("emaillabel").style.color = "back";
        document.getElementById("Email").style.borderColor = "black";
    }



    if (PhoneNo == "") {
        counter = counter + 1;
        document.getElementById("PhoneNo").placeholder = "Phone No is Missing";
        document.getElementById("phonelabel").style.color = "red";
        document.getElementById("PhoneNo").style.borderColor = "red";
    }
    else {
        document.getElementById("phonelabel").style.color = "lightgrey";
        document.getElementById("PhoneNo").style.borderColor = "black";
    }



    if (counter > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Required Information is Missing`,
        })
    }
    else {
        var buttonname = document.getElementById("saveebutton").innerHTML;
        if (buttonname == "Save") {
            var url = "api/Client/AddClient";
        }
        else {

            var url = "api/Client/UpdateClient";
            
        }
        $.ajax({
            type: 'Post',
            url: url,
            data: {
                Companyname: CompanyName,
                ContactPerson: CustomerName,
                DealingPerson:DealingPerson,
                Address: Address,
                City: CITY,
                Email: Email,
                Phone: PhoneNo,
                GSt: GST,
                PAN: PAN,
                State: STATE,
                Customerid: customerid,
                Statecode: statecode,
                Type: Type,
                date: ddate,
                openingAmount  :openingBalance,
                CrDr :Crdr,
                openingDate :crdrdate,
            },
            success: function (data) {
                if (data.success) {
                    swal.fire({
                        text: data.message,
                        icon: "success",
                        buttons: true,
                    }).then((value) => {

                        $('#companylistTable').DataTable().ajax.reload();
                    });

                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message,
                    })
                }
            }
        });
    }


}
function fetchClient(url) {
    document.getElementById("Salebalancebutton").style.display = "block";

    $.ajax({
        'url': '/api/Client/getClient?id=' + url,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            $("#CustomerName").val(data.data.contactPerson);
            $("#dealingPerson").val(data.data.dealingPerson);
            $("#CompanyName").val(data.data.companyname);
            $("#Email").val(data.data.email);
            $("#PhoneNo").val(data.data.phone);
            $("#GST").val(data.data.gSt);
            $("#Address").val(data.data.address);
            $("#PAN").val(data.data.pan);
            $("#customerid").val(data.data.customerid);
            $("#STATE").val(data.data.state);
            print_city('CITY', data.data.statecode);
            $("#CITY").val(data.data.city);
            var now = data.data.openingDate;
            var dateStringWithTime = moment(now).format('YYYY-MM-DD');
            document.getElementById("crdrdate").value = dateStringWithTime;
            $("#type").val(data.data.type);
            $("#openingbalance").val(data.data.openingAmount);
            $("#crdr").val(data.data.crDr);
          
          
            document.getElementById("companyname").innerHTML = data.data.companyname;
            document.getElementById("opningAmount").innerHTML = "₹" + data.data.openingAmount + "";
           
        }
    })
    document.getElementById("saveebutton").innerHTML = "Update";
   
};
function deleteClient(url) {
    // Delete Query
    console.log(url);
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var now = new Date();
            var ddate = moment(now).format('YYYY-MM-DDTHH:mm:ss');
            $.ajax({
                type: 'Delete',
                url: "api/Client/DeleteClient",
                data: {
                    Id: url,
                    date:ddate,
                },
                success: function (data) {
                    if (data.success) {
                        Swal.fire(
                            'Deleted!',
                            'Your Company has been deleted.',
                            'success'
                        )
                        /* toastr.success(data.message);*/
                        dataTable.ajax.reload();
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: data.message,
                        })

                    }
                }
            });

        };
    })
};
function addOpeningBalance() {
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
    var Customerid = document.getElementById("customerid").value;
    var transporterid = document.getElementById("transportname").value;
    var transportname = document.getElementById("transportname").selectedOptions[0].text;
    var duedate = document.getElementById("duedate").value;
    var invoiceno = document.getElementById("invoiceno").value;
    var pono = document.getElementById("pono").value;
    var invoiceDate = document.getElementById("datetime").value;
    var podate = document.getElementById("podate").value;
    var grno = document.getElementById("grno").value;
    var Pterm = document.getElementById("Pterm").value;
    var amount = document.getElementById("openingAmount").value;
    var type = document.getElementById('crdrType').value;
    if (type == "") {
        type = "Select";
    }
    if (type != "Select") {
        document.getElementById("crdrType").style.borderColor = "grey";
        var debit = 0.0;
        var credit = 0.0;

        if (type == "Cr") {
            credit = amount;
        } else {
            debit = amount;
        }
        var buttonname = document.getElementById("buttonid").innerHTML;
        if (buttonname == "Save") {
            var url = "api/Client/AddOpeningBalance";
        }
        else {
            var opid = document.getElementById("opid").innerHTML;
            var url = "api/Client/UpdateOB?opid=" + opid;
        }

        $.ajax({
            type: 'Post',
            url: url,
            data:
            {
                opid: opid,
                invoiceno: invoiceno,
                invoiceDate: invoiceDate,
                pono: pono,
                podate: podate,
                transportid: transporterid,
                transportname: transportname,
                pterm: Pterm,
                grno: grno,
                customerid: Customerid,
                DueDate: duedate,
                debit: debit,
                credit: credit,
                CrDr: type,

            },
            success: function (data) {
                if (data.success) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully saved'
                    })

                    $('#opDatatable').DataTable().ajax.reload();
                    document.getElementById("buttonid").innerHTML = "Save"
                    resetData();

                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: data.message,
                    })
                }
            }
        });
    } else {
        document.getElementById("crdrType").style.borderColor = "red";
        Toast.fire({
            icon: 'error',
            title: 'Complete the details'
        })

    }
}
function resetData() {
    document.getElementById("invoiceno").value = "";
    document.getElementById("pono").value = "";
    document.getElementById("grno").value = "";
    document.getElementById("Pterm").value = "";
    document.getElementById("openingAmount").value = "0.0";
    document.getElementById("transportname").value = '';
    $('#transportname').trigger('change');

}
function fecthOpeningBalance() {
    document.getElementById("billwisecompanyname").innerHTML = document.getElementById("companyname").innerHTML;
    document.getElementById("uptoAmount").innerHTML = "₹" + document.getElementById("openingbalance").value + " " + document.getElementById("crdr").value;
    var customerid = document.getElementById("customerid").value;
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('duedate').value = dateStringWithTime;
    document.getElementById('creditdate').value = dateStringWithTime;

            dataTable = $("#opDatatable").DataTable({
                ajax: {
                    'url': '/api/Client/fecthOpeningBalance?id=' + customerid,
                    'type': 'GET',
                    'contentType': 'application/json'
                },
                columns: [
                    { 'data': null, 'defaultContent': '-', 'width': '.5%' },
                    {
                        'data': 'customerid', 'render': function (data, type, row) {
                            return `<a class="btn btn-info btn-sm" style="color:white" onclick=editOpeningBalance(${data},${row.opid})><i class="fas fa-pencil-alt">
                              </i>Edit</a>
                            
                              <a class="btn btn-danger btn-sm" style="color:white" onclick=deleteOpeningBalance(${data},${row.opid})> <i class="fas fa-trash">
                              </i>Delete</a>`;
                        }, 'width': '10%'
                    },
                   
                    {
                        'data': 'dueDate', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('DD-MMM-YYYY');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '8%', 'font-size': '10%'
                    },
                    {
                        'data': 'creditDate', 'render': function (data) {
                            var date = data;
                            var now = date.toString().replace('T', ' ');
                            var dateStringWithTime = moment(now).format('DD-MMM-YYYY');
                            return `<span>${dateStringWithTime}</span>`;
                        }, 'width': '8%', 'font-size': '10%'
                    },

                    { 'data': 'description', 'defaultContent': '-', 'width': '10%' },

                    {
                        'data': 'amount', 'render': function (data, type, row) {
                            return `<a>${row.amount} (${row.crDr})</a>`;
                        }, 'width': '5%', 'font-size': '5px', 'className': "text-right",
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
            dataTable.on('order.dt search.dt', function () {
                dataTable.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                    cell.innerHTML = i + 1;
                });
            }).draw();

    
}
function editOpeningBalance(customerid, opid) {

    $.ajax({
        url: "/api/Client/UpdateOpeningBalance",
        'type': 'GET',
        data: {
            customerid: customerid,
            opid: opid
        },
        'contentType': 'application/json',
        success: function (data) {
            $("#crdrType").val(data.data.crDr);
            document.getElementById("transportname").value = data.data.transportid;
            $('#transportname').trigger('change');
            document.getElementById("duedate").value = moment(data.data.dueDate).format('YYYY-MM-DD');
            document.getElementById("invoiceno").value = data.data.invoiceno;
            document.getElementById("pono").value = data.data.pono;
            document.getElementById("datetime").value = moment(data.data.invoiceDate).format('YYYY-MM-DD');
            document.getElementById("podate").value = moment(data.data.podate).format('YYYY-MM-DD');
            document.getElementById("grno").value = data.data.grno;
            document.getElementById("Pterm").value = data.data.pterm;
            document.getElementById("buttonid").innerHTML = "Update"
            document.getElementById("opid").innerHTML = data.data.opid;
            if (data.data.crDr == "Cr") {
                document.getElementById("openingAmount").value = data.data.credit;
            }
            else {
                document.getElementById("openingAmount").value = data.data.credit;
            }

        }
    })
}
function deleteOpeningBalance(customerid, opid) {
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
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'Delete',
                url: "/api/Client/DeleteOpeningBalance",
                data: {
                    customerid: customerid,
                    opid: opid
                },
                success: function (data) {
                    if (data.success) {
                       
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Deleted'
                        })
                        $('#opDatatable').DataTable().ajax.reload();
                        document.getElementById("buttonid").innerHTML = "Save"
                        resetData();
                    }
                    else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Something Went Wrong'
                        })

                    }
                }
            });

        };
    })
};

function Duedate() {
    var days = document.getElementById('Pterm').value;
    var invoicedate = document.getElementById('datetime').value;
    if (days == "") {
        days = 0;
    }
    days = parseInt(days);

    invoicedate = moment(invoicedate).format('YYYY-MM-DDT00:00:00');
    const d = new Date(invoicedate);
    d.setDate(d.getDate() + days);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    document.getElementById('duedate').value = moment(d).format('YYYY-MM-DD');
}
function OpeningSaleModel() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('datetime').value = dateStringWithTime;
    document.getElementById('podate').value = dateStringWithTime;
    document.getElementById('duedate').value = dateStringWithTime;
    document.getElementById("billwisecompanyname").innerHTML = document.getElementById("companyname").innerHTML;
    document.getElementById("uptoAmount").innerHTML = "₹" + document.getElementById("openingbalance").value + " " + document.getElementById("crdr").value;
    var customerid = document.getElementById("customerid").value;
    dataTable = $("#opDatatable").DataTable({
        ajax: {
            'url': '/api/Client/fecthOpeningBalance?id=' + customerid,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            {
                'data': 'customerid', 'render': function (data, type, row) {
                    return `<a onclick=editOpeningBalance(${data},${row.opid})><i class="fas fa-pencil-alt">
                            </i></a>
                            <a style="color:red" onclick=deleteOpeningBalance(${data},${row.opid})><i class="fas fa-trash">
                            </i></a>`;
                }, 'width': '10%'
            },
            { 'data': 'invoiceno', 'defaultContent': '-', 'width': '20%' },
            {
                'data': 'invoiceDate', 'render': function (data, type, row) {
                    return `<span>${moment(data).format('DD-MMM-YYYY')}</span>`;
                }, 'width': '20%', 'font-size': '10%'
            },
            {
                'data': 'dueDate', 'render': function (data) {
                    return `<span>${moment(data).format('DD-MMM-YYYY')}</span>`;
                }, 'width': '20%', 'font-size': '10%'
            },

            {
                'data': 'amount', 'render': function (data, type, row) {
                    if (row.crDr == "Dr") {
                        return `<a>${row.debit.toFixed(2)} (${row.crDr})</a>`;
                    }
                    else {
                        return `<a>${row.credit.toFixed(2)} (${row.crDr})</a>`;
                    }
                }, 'width': '20%', 'font-size': '5px', 'className': "text-right",
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

function nextfocus(event, nextfocus) {
    let key = event.which;
    if (key == 13) {
        document.getElementById(nextfocus).focus();
    }
}