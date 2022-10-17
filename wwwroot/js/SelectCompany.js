
$(document).ready(function () {
    LoadDatatable();
    $("#logout").click(function () {
        logout();
    });
   
    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "USER_MANAGEMENT",
            operation: "SETTING",
        },
        success: function (data) {
            if (data.data.permission == true) {
                document.getElementById('usermanagement').style.display = "block";
            } else {
                document.getElementById('usermanagement').style.display = "none";
            }
        }
    });

    $(window).load(function () {
        $('#loading').hide();
    });


});

function logout() {
    $.ajax({
        type: "post",
        url: "api/Login/Logout",
        success: function (data) {
            if (data.success) {
                window.location.replace("Index");
            }
            else {
                toastr.error(data.message);
            }
        }

    });
}



function LoadDatatable() {
    dataTable = $("#companylist").DataTable({
        ajax: {
            'url': '/api/Client/FetchCompanyList',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            {
                'data': 'companyname', 'className': "special", 'render': function (data, type, row) {
                    return `<a  onclick=redirect("${row.uniquecode}")>${data}</a>`;
                }, 'width': '60%',
            },
            { 'data': 'financialYear', 'defaultContent': '', 'width': '70%' },
        ],

        "paging": false,
        "searching": false,
        "ordering": false,
        "info": false,
        "scrollX": false,
        "responsive": true,
        language: {
            searchPlaceholder: "Search records",
            emptyTable: "No data found",
            width: '30%',
        },
    });
}

function redirect(companyid) {
    $.ajax({
        url: '/api/Client/SaveCompanyid?companyid=' + companyid,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success == true) {
                window.location.href = "../Dashboard";
            }
        }
    });
}
function adduser() {
    Swal.fire({
        html: ` <div class="parent">

        <img src="../imgs/adduser.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style=" clip-path: circle(); height:80px">
        <span></span>
 <h3 style="font-family: Garamond ">Add User</h3>
</div> 
                 <input type="text" id="CompanyName" class="swal2-input" placeholder="Username" style="width:70%"> <br>
                   <input type="password" id="CompanyName" class="swal2-input" placeholder="Password" style="width:70%"><br>
                   <input type="mail" id="CompanyName" class="swal2-input" placeholder="E-Mail" style="width:70%">

 
                  `,
        confirmButtonText: 'Add',
        focusConfirm: false,
        width: "40%",
        preConfirm: () => {
            const CompanyName = Swal.getPopup().querySelector("#CompanyName").value;
            const CustomerName = Swal.getPopup().querySelector("#CustomerName").value;
            const Email = Swal.getPopup().querySelector("#Email").value;
            const PhoneNo = Swal.getPopup().querySelector("#PhoneNo").value;
            const GST = Swal.getPopup().querySelector("#GST").value;
            const Address = Swal.getPopup().querySelector("#Address").value;
            const CITY = Swal.getPopup().querySelector("#CITY").value;
            const STATE = Swal.getPopup().querySelector("#STATE").value;
            const PAN = Swal.getPopup().querySelector("#PAN").value;

            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email)) {

            } else {
                Swal.showValidationMessage(`You have entered an invalid email address!`)
            }
            if (!CompanyName || !Email) {
                Swal.showValidationMessage(`Client Name & Email is required `)
            }
            return {
                CompanyName: CompanyName, CustomerName: CustomerName, Email: Email, PhoneNo: PhoneNo,
                GST: GST, Address: Address, CITY: CITY, STATE: STATE, PAN: PAN,
            };
        }
    }).then((result) => {
        const companyName = `${result.value.CompanyName}`;
        const customerName = `${result.value.CustomerName}`;
        const email = `${result.value.Email}`;
        const phoneNo = `${result.value.PhoneNo}`;
        const gST = `${result.value.GST}`;
        const address = `${result.value.Address}`;
        const cITY = `${result.value.CITY}`;
        const sTATE = `${result.value.STATE}`;
        const pAN = `${result.value.PAN}`;

        $.ajax({
            type: 'Post',
            url: "api/Client/AddClient",
            data: {
                Address: address, City: cITY, Companyname: companyName, ContactPerson: customerName, Email: email, Phone: phoneNo,
                GSt: gST, PAN: pAN, State: sTATE
            },
            success: function (data) {
                if (data.success) {
                    Swal.fire('Saved!', '', 'success')
                    /*toastr.success(data.message);*/
                    dataTable.ajax.reload();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });
}

function addCompany() {
    Swal.fire({

        html: ` <div class="parent">
        <img src="../imgs/companylogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style=" clip-path: circle(); height:80px">
        <span></span>
        <h3 style="font-family: Garamond ">Company Details</h3>

 <div class="col-md-4 mt-5">
        <div class="textOnInput" style="width:450px">
            <label for="inputText">Financial Year</label>
            <input class="form-control" type="text" id="FinancialYear" value="2021-2022">
        </div>
    </div>




 <div class="col-md-4 mt-5">
        <div class="textOnInput" style="width:450px">
            <label for="inputText">Company Name </label>
            <input class="form-control" type="text"id="CompanyName">
        </div>
    </div>





 <div class="col-md-4 mt-5">
        <div class="textOnInput" style="width:450px">
            <label for="inputText">Company Mailing Name </label>
            <input class="form-control" type="mail" id="Companymailingname">
        </div>
    </div>





 <div class="col-md-4 mt-5">
        <div class="textOnInput" style="width:450px">
            <label for="inputText">Phone No.</label>
            <input class="form-control" type="number"  id="phone">
        </div>
    </div>



 <div class="col-md-4 mt-5">
        <div class="textOnInput" style="width:450px">
            <label for="inputText">E-Mail</label>
            <input class="form-control" type="mail" id="mail">
        </div>
    </div>



 <div class="col-md-4 mt-5">
        <div class="textOnInput" style="width:450px">
            <label for="inputText">GST</label>
            <input class="form-control" type="text" id="gst">
        </div>
    </div>




 <div class="col-md-4 mt-5">
        <div class="textOnInput" style="width:450px">
            <label for="inputText">PAN No</label>
            <input class="form-control" type="text" id="pan">
        </div>
    </div>




 <div class="col-md-4 mt-5">
        <div class="textOnInput" style="width:450px">
            <label for="inputText">Address</label>
            <input class="form-control"   style="height:100px " type="textarea" id="address" >
        </div>
    </div>




























       

  `,
        confirmButtonText: 'Add',
        focusConfirm: false,
        width: "35%",
        preConfirm: () => {
            const financialYear = Swal.getPopup().querySelector("#FinancialYear").value;
            const CompanyName = Swal.getPopup().querySelector("#CompanyName").value;
            const MailingName = Swal.getPopup().querySelector("#Companymailingname").value;
            const Email = Swal.getPopup().querySelector("#mail").value;
            const PhoneNo = Swal.getPopup().querySelector("#phone").value;
            const GST = Swal.getPopup().querySelector("#gst").value;
            const PAN = Swal.getPopup().querySelector("#pan").value;
            const Address = Swal.getPopup().querySelector("#address").value;


            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email)) {

            } else {
                Swal.showValidationMessage(`You have entered an invalid email address!`)
            }
            if (!CompanyName || !Email) {
                Swal.showValidationMessage(`Company Name & Email is required `)
            }
            return {
                FinancialYear: financialYear, CompanyName: CompanyName, Companymailingname: MailingName, mail: Email, phone: PhoneNo,
                gst: GST, address: Address, pan: PAN,
            };
        }
    }).then((result) => {
        const financialYear = `${result.value.FinancialYear}`;
        const companyname = `${result.value.CompanyName}`;
        const companymailingname = `${result.value.Companymailingname}`;
        const email = `${result.value.mail}`;
        const phoneNo = `${result.value.phone}`;
        const gST = `${result.value.gst}`;
        const address = `${result.value.address}`;
        const Pan = `${result.value.pan}`;


        $.ajax({
            type: 'Post',
            url: "api/Client/AddCompany",
            data: {
                FinancialYear: financialYear, Companyname: companyname, MailingName: companymailingname, Email: email, Phone: phoneNo, GST: gST, Address: address,
                PAN: Pan,
            },
            success: function (data) {
                if (data.success) {
                    Swal.fire('Saved!', '', 'success')
                    /*toastr.success(data.message);*/
                    dataTable.ajax.reload();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });
}

function addDetails() {
    Swal.fire({

        html: ` <div class="parent">
        <img src="../imgs/companylogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style=" clip-path: circle(); height:80px">
        <span></span>
 <h3 style="font-family: Garamond ">Company Details</h3>
</div>
                  `,
        confirmButtonText: 'Add',
        focusConfirm: false,
        width: "40%",
        preConfirm: () => {
            const CompanyName = Swal.getPopup().querySelector("#CompanyName").value;
            const CustomerName = Swal.getPopup().querySelector("#CustomerName").value;
            const Email = Swal.getPopup().querySelector("#Email").value;
            const PhoneNo = Swal.getPopup().querySelector("#PhoneNo").value;
            const GST = Swal.getPopup().querySelector("#GST").value;
            const Address = Swal.getPopup().querySelector("#Address").value;
            const CITY = Swal.getPopup().querySelector("#CITY").value;
            const STATE = Swal.getPopup().querySelector("#STATE").value;
            const PAN = Swal.getPopup().querySelector("#PAN").value;

            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email)) {

            } else {
                Swal.showValidationMessage(`You have entered an invalid email address!`)
            }
            if (!CompanyName || !Email) {
                Swal.showValidationMessage(`Client Name & Email is required `)
            }
            return {
                CompanyName: CompanyName, CustomerName: CustomerName, Email: Email, PhoneNo: PhoneNo,
                GST: GST, Address: Address, CITY: CITY, STATE: STATE, PAN: PAN,
            };
        }
    }).then((result) => {
        const companyName = `${result.value.CompanyName}`;
        const customerName = `${result.value.CustomerName}`;
        const email = `${result.value.Email}`;
        const phoneNo = `${result.value.PhoneNo}`;
        const gST = `${result.value.GST}`;
        const address = `${result.value.Address}`;
        const cITY = `${result.value.CITY}`;
        const sTATE = `${result.value.STATE}`;
        const pAN = `${result.value.PAN}`;

        $.ajax({
            type: 'Post',
            url: "api/Client/AddClient",
            data: {
                Address: address, City: cITY, Companyname: companyName, ContactPerson: customerName, Email: email, Phone: phoneNo,
                GSt: gST, PAN: pAN, State: sTATE
            },
            success: function (data) {
                if (data.success) {
                    Swal.fire('Saved!', '', 'success')
                    /*toastr.success(data.message);*/
                    dataTable.ajax.reload();
                }
                else {
                    toastr.error(data.message);
                }
            }
        });
    });
}




