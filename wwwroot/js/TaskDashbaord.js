var img = "";
$(document).ready(function () {
    onloadUser()
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var date = moment(now).format('YYYY-MM-DD');
    counter1(date)

    $.ajax({
        url: '/api/UserManagement/permissioncheck',
        type: 'GET',
        contentType: 'application/json',
        data: {
            formName: "TaskDashboard",
            operation: "VIEW",
        },
        success: function (data) {
            if (data.data.permission == true) {
                document.getElementById("otherDashboard").style.display = "block";
            } else {
                document.getElementById("otherDashboard").style.display = "none";
            }
        }
    });
    const fileInput = document.getElementById("document_attachment_doc");
    window.addEventListener('paste', e => {
        fileInput.files = e.clipboardData.files;
        previewimage()
    });

    img = $.cookie("userimage");
    userImage.src = img

});


function previewimage() {
    const [file] = document_attachment_doc.files
    if (file) {
        blah.src = URL.createObjectURL(file)
        document.getElementById("blah").style.display = "block";
    }
}
function closemodel() {
    document.getElementById("blah").style.display = "none";
    document.getElementById("document_attachment_doc").value = "";
}
function sendAttchments() {
    $('#attachments').toggle();
    let File1 = $("#document_attachment_doc")[0].files;
    if (File1.length == 1) {
        document.getElementById("attachmentsname").innerHTML = File1[0].name;
    } else {
        document.getElementById("attachmentsname").innerHTML = File1.length + " Files Attched";
    }
}
function sendattachmentsbutton() {
    document.getElementById("chatattachmentsbutton").style.display = "none"
    document.getElementById("sendattachmentsbuttton").style.display = "block"
}
function chatattchments() {
    document.getElementById("chatattachmentsbutton").style.display = "block"
    document.getElementById("sendattachmentsbuttton").style.display = "none"
}


function counter1(date) {
    $.ajax({
        'url': '/api/TaskController/counter2?edate=' + date,
        'type': 'GET',
        'contentType': 'application/json',
        success: function (data) {
            if (data.success == true) {
                document.getElementById("dailycounter").innerHTML = "(" + data.data.daily + ")";
                document.getElementById("allcounter").innerHTML = "(" + data.data.total + ")";
                document.getElementById("pendingcounter").innerHTML = "(" + data.data.pending + ")";
                document.getElementById("compltedcounter").innerHTML = "(" + data.data.completed + ")";
                document.getElementById("allcounterByme").innerHTML = "(" + data.data.totalbyme + ")";
                document.getElementById("dailycounterByme").innerHTML = "(" + data.data.dailybyme + ")";
                document.getElementById("compltedcounterByme").innerHTML = "(" + data.data.completedbyme + ")";
                document.getElementById("pendingcounterbyme").innerHTML = "(" + data.data.pendingbyme + ")";
                document.getElementById("closecounter").innerHTML = "(" + data.data.closeReqByOther + ")";
                document.getElementById("closecounterByme").innerHTML = "(" + data.data.closeReqMY + ")";
            }
        }
    })
}


function sendTask() {

    var receivername = document.getElementById("username").selectedOptions[0].text;
    var receivercode = document.getElementById("username").value;
    var startingDate = document.getElementById("startingdate").value;
    var deadLineDate = document.getElementById("endingdate").value;
    var message = document.getElementById("description").value;
    var title = document.getElementById("taskTile").value;
    var ddate = document.getElementById("currentdate").value;
    let File1 = $("#document_attachment_doc")[0].files;

    var formData = new FormData();
    for (i = 0; i < File1.length; i++) {
        formData.append('Name1', File1[i]);
        formData.append('receivername', receivername);
        formData.append('receivercode', receivercode);
        formData.append('startingdate', startingDate);
        formData.append('deadlinedate', deadLineDate);
        formData.append('message', message);
        formData.append('tasktitle', title);
        formData.append('currentDate', ddate);
    }
    if (File1.length == 0) {
        formData.append('Name1', "");
        formData.append('receivername', receivername);
        formData.append('receivercode', receivercode);
        formData.append('startingdate', startingDate);
        formData.append('deadlinedate', deadLineDate);
        formData.append('message', message);
        formData.append('tasktitle', title);
        formData.append('currentDate', ddate);
    }
    $.ajax({
        type: 'Post',
        url: "api/TaskController/CreateTask",
        async: false,
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        data: formData,
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
                    title: 'Task craeted SuccessFully!'
                })
                $('#taskDatatable').DataTable().ajax.reload();
                var now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                var date = moment(now).format('YYYY-MM-DD');
                counter1(date)
            }
            else {
                Swal.fire(data.message, '', 'error')
            }
        }
    });


}
function fillUser() {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('startingdate').value = now.toISOString().slice(0, 16);
    document.getElementById("endingdate").value = now.toISOString().slice(0, 16);
    document.getElementById("currentdate").value = now.toISOString().slice(0, 16);
    $.ajax({
        url: '/api/TaskController/FillUser',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                $("#username").empty();
                $("#username").append("<option value='0'>--Select--</option>");
                $.each(data.data, function (key, value) {
                    $("#username").append($("<option></option>").val(value.usid).html(value.username));
                });
            }
        }
    });
    $("#username").select2();
}
function taskList() {

    document.getElementById("usertasklist").style.display = "none";
    document.getElementById("tasklist").style.display = "block";
    document.getElementById("title").innerHTML = "User List";

    dataTable = $("#listTable").DataTable({
        ajax: {
            'url': '/api/TaskController/FillTaskList',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'username', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'completedTask', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'pendingTask', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'pendingTask', 'defaultContent': '-', 'width': '10%' },
            {
                'data': 'usreid', 'render': function (data, type, row) {
                    var dt = row;
                    return `<a class="btn btn-danger btn-sm" style="color:white" onclick=TaskListView("${data}")>  <i class="fa fa-tasks"></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
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
function TaskListView(usreid) {
    document.getElementById("tasklist").style.display = "none";
    document.getElementById("usertasklist").style.display = "block";
    document.getElementById("title").innerHTML = "Task List";
    dataTable = $("#viewuserTaskTable").DataTable({
        ajax: {
            'url': '/api/TaskController/TaskListView?usrid=' + usreid,
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },

            {
                'data': 'startingdate', 'render': function (data) {
                    var date1 = data;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'PM' : 'AM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;
                }, 'width': '10%', 'font-size': '5px',
            },


            {
                'data': 'deadlinedate', 'render': function (data) {
                    var date2 = data;
                    var now2 = date2.toString().replace('T', ' ');
                    var dateStringWithTime2 = moment(now2).format('DD-MMM-YYYY MM:hh');
                    var hours2 = moment(now2).format('hh');
                    var x2 = Number(hours2)
                    var ampm2 = x2 >= 12 ? 'PM' : 'AM';
                    dateStringWithTime2 = dateStringWithTime2 + " (" + ampm2 + ")";
                    return `<span>${dateStringWithTime2}</span>`;
                }, 'width': '10%', 'font-size': '5px',
            },


            {
                'data': 'taskid', 'render': function (data, type, row) {
                    return `<a class="btn btn-danger btn-sm" style="color:white" data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetails("${row.taskid}")  >  <i class="fa fa-tasks"></i> Task Details</a> `;
                }, 'width': '8%'
            },




        ],
        "bDestroy": true,
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
function TaskDetails(taskId, type) {
    document.getElementById("typee").innerHTML = type;
    document.getElementById("taskid").value = taskId;
    $.ajax({
        url: '/api/TaskController/TaskDetails?taskid=' + taskId,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                document.getElementById('tasktitle').value = data.data.tasktitle;
                var date = data.data.startingdate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('DD-MMMM-YYYY hh:mm');
                var hours = moment(now).format('hh');
                var x = Number(hours)
                var ampm = x >= 12 ? 'PM' : 'AM';
                dateStringWithTime = dateStringWithTime + " " + ampm;
                document.getElementById("taskStartingDate").value = dateStringWithTime;

                var date1 = data.data.deadlinedate;
                var now1 = date1.toString().replace('T', ' ');
                var dateStringWithTime1 = moment(now1).format('DD-MMMM-YYYY hh:mm');
                var hours1 = moment(now1).format('hh');
                var x1 = Number(hours1)
                var ampm1 = x1 >= 12 ? 'PM' : 'AM';
                dateStringWithTime1 = dateStringWithTime1 + " " + ampm1;
                document.getElementById("taskDeadlineDate").value = dateStringWithTime1;



                dataTable = $("#taskchatDatatable").DataTable({
                    ajax: {
                        'url': '/api/TaskController/TaskchatDetails?taskid=' + taskId,
                        'type': 'GET',
                        'contentType': 'application/json'
                    },

                    columns: [
                        {
                            'data': 'message', 'render':
                                function (data, type, row) {
                                    var date = row.date;
                                    var now3 = date.toString().replace('T', ' ');
                                    var dateStringWithTime3 = moment(now3).format('DD-MMMM-YYYY hh:mm');
                                    var hours3 = moment(now3).format('hh');
                                    var x3 = Number(hours3)
                                    var ampm3 = x3 >= 12 ? 'PM' : 'AM';
                                    dateStringWithTime3 = dateStringWithTime3 + " " + ampm3;

                                    if (row.type != "CREATER") {
                                        if (row.message != null && row.filename != null) {
                                            return `<div class="direct-chat-msg">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-right">${row.sendername}</span>
                                                        <span class="direct-chat-timestamp float-left">${dateStringWithTime3}</span>
                                                    </div>
                                                    <img class="direct-chat-img" src="${row.imageurl}" >
                                                <div class="direct-chat-text " style="background-color:yellow">
                                                ${row.message}
                                                    <div  href="${row.url}" class="direct-chat-text " style="height:60px; background-color:yellow" >
                                                  <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                  ${row.orginalName}
                                                  &nbsp;&nbsp;
                                                  <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                </div>
                                                    </div>
                                                </div>`;

                                        }
                                        else if (row.message != null && row.filename == null) {
                                            return `<div class="direct-chat-msg">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-right">${row.sendername}</span>
                                                        <span class="direct-chat-timestamp float-left">${dateStringWithTime3}</span>
                                                    </div>
                                                    <img class="direct-chat-img" src="${row.imageurl}" >
                                                <div class="direct-chat-text " style="background-color:yellow">
                                                ${row.message}

                                                    </div>
                                                </div>`;

                                        }
                                        else {
                                            return `<div class="direct-chat-msg">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-right">${row.sendername}</span>
                                                        <span class="direct-chat-timestamp float-left">${dateStringWithTime3}</span>
                                                    </div>
                                                    <img class="direct-chat-img" src="${row.imageurl}" >
                                                
                                                    <div  href="${row.url}" class="direct-chat-text " style="height:60px; background-color:yellow" >
                                                  <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                  ${row.orginalName}
                                                  &nbsp;&nbsp;
                                                  <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                    </div>`;
                                        }
                                    }
                                    else {
                                        if (row.message != null && row.filename != null) {
                                            return `<div class="direct-chat-msg right">
                                                            <div class="direct-chat-infos clearfix">
                                                                    <span class="direct-chat-name float-left">${row.sendername}</span>
                                                                    <span class="direct-chat-timestamp float-right">${dateStringWithTime3}</span>
                                                            </div>
                                                                    <img class="direct-chat-img" src="${img}" >
                                                            <div class="direct-chat-text">${row.message}
                                                            <div  href="${row.url}" class="direct-chat-text " style="height:60px;" >
                                                                    <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                                        ${row.orginalName}&nbsp;&nbsp;
                                                                    <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                             </div>
                                                             </div>
                                                      </div>`;
                                        }
                                        else if (row.message != null && row.filename == null)
                                        {
                                            return `<div class="direct-chat-msg right">
                                                            <div class="direct-chat-infos clearfix">
                                                                            <span class="direct-chat-name float-left">${row.sendername}</span>
                                                                            <span class="direct-chat-timestamp float-right">${dateStringWithTime3}</span>
                                                             </div>
                                                                <img class="direct-chat-img" src="${img}" >
                                                             <div class="direct-chat-text"> ${row.message}</div>
                                                      </div>`;
                                        }
                                        else {
                                            return `<div class="direct-chat-msg right">
                                                        <div class="direct-chat-infos clearfix">
                                                           <span class="direct-chat-name float-left">${row.sendername}</span>
                                                           <span class="direct-chat-timestamp float-right">${dateStringWithTime3}</span>
                                                        </div>
                                                      <img class="direct-chat-img" src="${img}" >
                                                      <div  href="${row.url}" class="direct-chat-text " style="height:60px;" >
                                                            <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                                ${row.orginalName}
                                                                &nbsp;&nbsp;
                                                            <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                       </div>`;
                                                }

                                    }
                                },
                            'width': '100%', 'font-size': '6px'
                            ,
                        }

                    ],
                    "bProcessing": true,
                    "bPaginate": false,
                    "sScrollY": "35vh",
                    "bScrollCollapse": true,
                    "bDestroy": true,
                    "searching": false,
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    "scrollY": $(window).height() / 1.5,
                    "scrollCollapse": true,
                    language: {
                        searchPlaceholder: "Search records",
                        emptyTable: "No data found",
                        width: '100%',
                    },


                });
               
              
                function reloadDatatable() {
                   /* $('#taskchatDatatable').DataTable().draw;

                    // Scroll to the bottom

                    var $scrollBody = $($('#taskchatDatatable').DataTable().table().node()).parent();
                    $scrollBody.scrollTop($scrollBody.get(0).scrollHeight);*/
                    $('#taskchatDatatable').DataTable().ajax.reload();
                };
                setInterval(reloadDatatable, 1000);
            }

        },

    });
   
}
function sensMessageReceiver() {

    var taskid = document.getElementById("taskid").value;
    var message = document.getElementById("messageBox").value;
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var ddate = now.toISOString().slice(0, 16);
    var type = document.getElementById("typee").innerHTML;

    $.ajax({
        type: 'Post',
        url: "api/TaskController/SendChat",
        data: {
            taskid: taskid,
            message: message,
            date: ddate,
            type: type,

        },
        success: function (data) {
            if (data.success) {
                $('#taskchatDatatable').DataTable().ajax.reload();
                document.getElementById("messageBox").value = "";
                enablebutton();
            

                $('#taskchatDatatable').DataTable().draw;
                
                // Scroll to the bottom
              
                var $scrollBody = $($('#taskchatDatatable').DataTable().table().node()).parent();
                $scrollBody.scrollTop($scrollBody.get(0).scrollHeight);
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
/*$(document).ready(function () {
    var table = $('#example').DataTable({
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('id', 'row-' + dataIndex);
            console.log($(row).closest('table').parent());
        },
        "scrollY": $(window).height() / 1.5,
        "scrollCollapse": true,
        "paging": false
    });

    $('#btn-add').click(function () {
        for (var i = 1; i <= 10; i++) {
            table.row.add([
                i,
                i + '.2',
                i + '.3',
                i + '.4',
                i + '.5',
                i + '.6'
            ]);
        }

        table.draw();

        // Scroll to the bottom
        var $scrollBody = $(table.table().node()).parent();
        $scrollBody.scrollTop($scrollBody.get(0).scrollHeight);
    });

    table.rowReordering();
});*/
function sensMessage() {

    var taskid = document.getElementById("taskid").value;
    var message = document.getElementById("messageBox").value;
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var ddate = now.toISOString().slice(0, 16);
    var type = "CREATER";

    $.ajax({
        type: 'Post',
        url: "api/TaskController/SendChat",
        data: {
            taskid: taskid,
            message: message,
            date: ddate,
            type: type,

        },
        success: function (data) {
            if (data.success) {
                $('#taskchatDatatable').DataTable().ajax.reload();
                document.getElementById("messageBox").value = "";
                enablebutton();

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
function TaskDetailsReceiver(taskId,type,message) {
    document.getElementById("taskid").value = taskId;
    document.getElementById("typee").innerHTML = type;
    if (message == "open") {
        document.getElementById("closeRequest").style.display = "block";
        document.getElementById("AlreadyRequest").style.display = "none";
    } else {
        document.getElementById("closeRequest").style.display = "none";
        document.getElementById("AlreadyRequest").style.display = "block";
    }
    $.ajax({
        url: '/api/TaskController/TaskDetails?taskid=' + taskId,
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data.success) {
                document.getElementById('tasktitle').value = data.data.tasktitle;
                var date = data.data.startingdate;
                var now = date.toString().replace('T', ' ');
                var dateStringWithTime = moment(now).format('DD-MMMM-YYYY hh:mm');
                var hours = moment(now).format('hh');
                var x = Number(hours)
                var ampm = x >= 12 ? 'PM' : 'AM';
                dateStringWithTime = dateStringWithTime + " " + ampm;
                document.getElementById("taskStartingDate").value = dateStringWithTime;

                var date1 = data.data.deadlinedate;
                var now1 = date1.toString().replace('T', ' ');
                var dateStringWithTime1 = moment(now1).format('DD-MMMM-YYYY hh:mm');
                var hours1 = moment(now1).format('hh');
                var x1 = Number(hours1)
                var ampm1 = x1 >= 12 ? 'PM' : 'AM';
                dateStringWithTime1 = dateStringWithTime1 + " " + ampm1;
                document.getElementById("taskDeadlineDate").value = dateStringWithTime1;



                dataTable = $("#taskchatDatatable").DataTable({
                    ajax: {
                        'url': '/api/TaskController/TaskchatDetails?taskid=' + taskId,
                        'type': 'GET',
                        'contentType': 'application/json'
                    },

                    columns: [

                        {
                            'data': 'message', 'render':

                                function (data, type, row) {

                                    var date = row.date;
                                    var now3 = date.toString().replace('T', ' ');
                                    var dateStringWithTime3 = moment(now3).format('DD-MMMM-YYYY hh:mm');
                                    var hours3 = moment(now3).format('hh');
                                    var x3 = Number(hours3)
                                    var ampm3 = x3 >= 12 ? 'PM' : 'AM';
                                    dateStringWithTime3 = dateStringWithTime3 + " " + ampm3;

                                    if (row.type == "CREATER") {
                                        if (row.message != null && row.filename != null) {
                                            return `<div class="direct-chat-msg">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-left">${row.sendername}</span><br />
                                                        <span class="direct-chat-timestamp float-left">${dateStringWithTime3}</span>
                                                    </div>
                                                    <img class="direct-chat-img" src="${row.imageurl}" >
                                                <div class="direct-chat-text " style="background-color:yellow">
                                                ${row.message}<br />
                                                  <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                  ${row.orginalName}
                                                  &nbsp;&nbsp;
                                                  <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                    </div>
                                                </div>`;

                                        }
                                        else if (row.message != null && row.filename == null) {
                                            return `<div class="direct-chat-msg">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-right">${row.sendername}</span>
                                                        <span class="direct-chat-timestamp float-left">${dateStringWithTime3}</span>
                                                    </div>
                                                    <img class="direct-chat-img" src="${row.imageurl}" >
                                                <div class="direct-chat-text " style="background-color:yellow">
                                                ${row.message}

                                                    </div>
                                                </div>`;

                                        }
                                        else {
                                            return `<div class="direct-chat-msg">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-right">${row.sendername}</span>
                                                        <span class="direct-chat-timestamp float-left">${dateStringWithTime3}</span>
                                                    </div>
                                                    <img class="direct-chat-img" src="${row.imageurl}" >
                                                
                                                    <div  href="${row.url}" class="direct-chat-text " style="height:60px; background-color:yellow" >
                                                  <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                  ${row.orginalName}
                                                  &nbsp;&nbsp;
                                                  <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                    </div>`;
                                        }
                                    }
                                    else {
                                        if (row.message != null && row.filename != null) {
                                            return `<div class="direct-chat-msg right">
                                                            <div class="direct-chat-infos clearfix">
                                                                    <span class="direct-chat-name float-left">${row.sendername}</span>
                                                                    <span class="direct-chat-timestamp float-right">${dateStringWithTime3}</span>
                                                            </div>
                                                                    <img class="direct-chat-img" src="${img}" >
                                                            <div class="direct-chat-text">${row.message}
                                                            <div  href="${row.url}" class="direct-chat-text " style="height:60px;" >
                                                                    <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                                        ${row.orginalName}&nbsp;&nbsp;
                                                                    <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                             </div>
                                                             </div>
                                                      </div>`;
                                        }
                                        else if (row.message != null && row.filename == null) {
                                            return `<div class="direct-chat-msg right">
                                                            <div class="direct-chat-infos clearfix">
                                                                            <span class="direct-chat-name float-left">${row.sendername}</span>
                                                                            <span class="direct-chat-timestamp float-right">${dateStringWithTime3}</span>
                                                             </div>
                                                                <img class="direct-chat-img" src="${img}" >
                                                             <div class="direct-chat-text"> ${row.message}</div>
                                                      </div>`;
                                        }
                                        else {
                                            return `<div class="direct-chat-msg right">
                                                        <div class="direct-chat-infos clearfix">
                                                           <span class="direct-chat-name float-left">${row.sendername}</span>
                                                           <span class="direct-chat-timestamp float-right">${dateStringWithTime3}</span>
                                                        </div>
                                                      <img class="direct-chat-img" src="${img}" >
                                                      <div  href="${row.url}" class="direct-chat-text " style="height:60px;" >
                                                            <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                                ${row.orginalName}
                                                                &nbsp;&nbsp;
                                                            <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                       </div>`;
                                        }

                                    }

                                    /*if (row.type == "CREATER") {
                                        if (row.message != null) {
                                            return `<div class="direct-chat-msg">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-right">${row.sendername}</span>
                                                        <span class="direct-chat-timestamp float-left">${dateStringWithTime3}</span>
                                                    </div>
                                                    <img class="direct-chat-img"  src="${row.imageurl}" >
                                                <div class="direct-chat-text " style="background-color:yellow">
                                                ${row.message}
                                                    </div>
                                                </div>`;
                                        }
                                        else {
                                            return `<div class="direct-chat-msg">
                                                    <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-right">${row.sendername}</span>
                                                        <span class="direct-chat-timestamp float-left">${dateStringWithTime3}</span>
                                                    </div>
                                                    <img class="direct-chat-img"  src="${img}"  >
                                                   <div  href="${row.url}" class="direct-chat-text " style="height:60px;background-color:yellow" >
                                                  <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                  ${row.orginalName}
                                                  &nbsp;&nbsp;
                                                  <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                </div>
                                                </div>`;

                                        }
                                    }

                                    else {

                                        if (row.message != null) {
                                            return `
                                    <div class="direct-chat-msg right">
                        <div class="direct-chat-infos clearfix">
                          <span class="direct-chat-name float-left">${row.sendername}</span>
                          <span class="direct-chat-timestamp float-right">${dateStringWithTime3}</span>
                        </div>
                        <img class="direct-chat-img" src="${img}"  >
                        <div class="direct-chat-text">
                         ${row.message}
                        </div>
                        <!-- /.direct-chat-text -->
                      </div>
                                               `;
                                        }
                                        else {
                                            return `
                                                        <div class="direct-chat-msg right">
                                                        <div class="direct-chat-infos clearfix">
                                                        <span class="direct-chat-name float-left">${row.sendername}</span>
                                                        <span class="direct-chat-timestamp float-right">${dateStringWithTime3}</span>
                                                        </div>
                                                      <img class="direct-chat-img"  src="${img}" >
                                                <div  href="${row.url}" class="direct-chat-text " style="height:60px" >
                                                  <i class="fa fa-file-pdf-o" style="font-size:24px;color:red"></i>
                                                  ${row.orginalName}
                                                  &nbsp;&nbsp;
                                                  <a target="_blank" href="${row.url}" class="fa fa-download" style="font-size:24px;"></a>
                                                </div>
                                               `;
                                        }

                                    }*/
                                },
                            'width': '100%', 'font-size': '6px'
                            ,
                        }

                    ],


                    "bProcessing": true,
                    "bPaginate": false,
                    "sScrollY": "35vh",
                    "bScrollCollapse": true,
                    "bDestroy": true,
                    "searching": false,
                    "paging": false,
                    "ordering": false,
                    "info": false,
                    "scrollX": false,
                    "scrollCollapse": true,
                    language: {
                        searchPlaceholder: "Search records",
                        emptyTable: "No data found",
                        width: '100%',
                    },
                });

                function reloadDatatable() {
                    $('#taskchatDatatable').DataTable().ajax.reload();
                };
                setInterval(reloadDatatable, 400);
            }
        }

    });
}

function enablebutton() {

    var message = document.getElementById("messageBox").value;
    if (message == "") {

        document.getElementById("sendbutton").disabled = true;
    }
    else {
        document.getElementById("sendbutton").disabled = false;
    }


}
//------------------------FUNCTION FOR TASK FOR ME-----------------------------//

function onloadUser() {
    document.getElementById("col1").innerHTML = "Sending By";
    document.getElementById("col2").innerHTML = "Task Title";
    document.getElementById("col3").innerHTML = "Starting Date";
    document.getElementById("col4").innerHTML = "Deadline Date";
    document.getElementById("col5").innerHTML = "Status";

    document.getElementById("closeRequest").style.display = "block";
    document.getElementById("taskclose").style.display = "none";
    document.getElementById("taskdiv").style.display = "block";
    document.getElementById("taskrequest").style.display = "none";



    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('DailyDate').value = dateStringWithTime;
    document.getElementById("title").innerHTML = "DailyTask";
    document.getElementById("headerColor").style.backgroundColor = "#dc3545";
    document.getElementById("dailytask").style.display = "block";

    var ddate = document.getElementById("DailyDate").value;
    var ddate = moment(ddate).format('YYYY-MM-DDT00:00:00');

    dataTable = $("#taskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/DailyTask',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                edate: ddate,
            },
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'sendername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },

            {
                'data': 'startingdate', 'render': function (data, type, row) {

                    var date = row.startingdate;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MMM-YYYY');
                    var hours = moment(now).format('hh');
                    var x = Number(hours)
                    var ampm = x >= 12 ? 'PM' : 'AM';
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'deadlinedate', 'render': function (data, type, row) {

                    var date = row.deadlinedate;
                    var now = date.toString().replace('T', ' ');
                    var dateStringWithTime = moment(now).format('DD-MMM-YYYY');
                    var hours = moment(now).format('hh');
                    var x = Number(hours)
                    var ampm = x >= 12 ? 'PM' : 'AM';
                    dateStringWithTime = dateStringWithTime;
                    return `<span>${dateStringWithTime}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'status', 'render': function (data, type, row) {
                    if (row.status == true) {
                        return ` <button type="button" class="btn btn-success">Completed</button>`;
                    }
                    else {
                        return ` <button type="button" class="btn btn-warning">Pending</button>`;
                    }

                }, 'width': '10%'

            },
            {
                'data': 'taskid', 'render': function (data, type, row) {
                    return `<a class="btn btn-danger btn-sm" style="color:white" data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetailsReceiver("${row.taskId}","RECEIVER","${row.message}")>  <i class="fa fa-tasks"></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,
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
function totaltask() {

    document.getElementById("col1").innerHTML = "Sending By";
    document.getElementById("col2").innerHTML = "Task Title";
    document.getElementById("col3").innerHTML = "Starting Date";
    document.getElementById("col4").innerHTML = "Deadline Date";
    document.getElementById("col5").innerHTML = "Status";

    document.getElementById("taskdiv").style.display = "block";
    document.getElementById("taskrequest").style.display = "none";
    document.getElementById("closeRequest").style.display = "none";
    document.getElementById("taskclose").style.display = "none";



    document.getElementById("title").innerHTML = "Total Task";
    document.getElementById("headerColor").style.backgroundColor = "#17a2b8";
    document.getElementById("dailytask").style.display = "none";

    dataTable = $("#taskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/totalTask',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'sendername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },


            {
                'data': 'startingdate', 'render': function (data, type, row) {


                    var date1 = row.startingdate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'deadlinedate', 'render': function (data, type, row) {


                    var date1 = row.deadlinedate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },


            {
                'data': 'status', 'render': function (data, type, row) {
                    if (row.status == true) {
                        return ` <button type="button" class="btn btn-success">Completed</button>`;
                    }
                    else {
                        return ` <button type="button" class="btn btn-warning">Pending</button>`;
                    }

                }, 'width': '10%'

            },
            {
                'data': 'taskid', 'render': function (data, type, row) {
                    var dt = row;
                    return `<a class="btn btn-danger btn-sm" style="color:white" data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetailsReceiver("${row.taskId}","RECEIVER","${row.message}")>  <i class="fa fa-tasks"></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,
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
function completedTask() {

    document.getElementById("col1").innerHTML = "Sending By";
    document.getElementById("col2").innerHTML = "Task Title";
    document.getElementById("col3").innerHTML = "Starting Date";
    document.getElementById("col4").innerHTML = "Deadline Date";
    document.getElementById("col5").innerHTML = "Status";
    document.getElementById("closeRequest").style.display = "none";
    document.getElementById("taskclose").style.display = "none";
    document.getElementById("title").innerHTML = "Completed Task";
    document.getElementById("headerColor").style.backgroundColor = "#28a745";
    document.getElementById("dailytask").style.display = "none";
    document.getElementById("taskdiv").style.display = "block";
    document.getElementById("taskrequest").style.display = "none";


    dataTable = $("#taskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/CompletedTask',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'sendername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },

            {
                'data': 'startingdate', 'render': function (data, type, row) {


                    var date1 = row.startingdate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'deadlinedate', 'render': function (data, type, row) {


                    var date1 = row.deadlinedate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'status', 'render': function (data, type, row) {
                    if (row.status == true) {
                        return ` <button type="button" class="btn btn-success">Completed</button>`;
                    }
                    else {
                        return ` <button type="button" class="btn btn-warning">Pending</button>`;
                    }

                }, 'width': '10%'

            },
            {
                'data': 'taskid', 'render': function (data, type, row) {
                    var dt = row;
                    return `<a class="btn btn-danger btn-sm" style="color:white" data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetailsReceiver("${row.taskId}","RECEIVER","${row.message}")>  <i class="fa fa-tasks"></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,
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
function pendingTask() {

    document.getElementById("col1").innerHTML = "Sending By";
    document.getElementById("col2").innerHTML = "Task Title";
    document.getElementById("col3").innerHTML = "Starting Date";
    document.getElementById("col4").innerHTML = "Deadline Date";
    document.getElementById("col5").innerHTML = "Status";
    document.getElementById("closeRequest").style.display = "block";
    document.getElementById("taskclose").style.display = "none";
    document.getElementById("taskdiv").style.display = "block";
    document.getElementById("taskrequest").style.display = "none";

    document.getElementById("title").innerHTML = "Pending Task";
    document.getElementById("headerColor").style.backgroundColor = "#ffc107";
    document.getElementById("dailytask").style.display = "none";



    dataTable = $("#taskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/PendingTask',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'sendername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },

            {
                'data': 'startingdate', 'render': function (data, type, row) {


                    var date1 = row.startingdate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'deadlinedate', 'render': function (data, type, row) {


                    var date1 = row.deadlinedate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'status', 'render': function (data, type, row) {
                    if (row.status == true) {
                        return ` <button type="button" class="btn btn-success">Completed</button>`;
                    }
                    else {
                        return ` <button type="button" class="btn btn-warning">Pending</button>`;
                    }

                }, 'width': '10%'

            },
            {
                'data': 'taskid', 'render': function (data, type, row) {
                    var dt = row;
                    return `<a class="btn btn-danger btn-sm" style="color:white" data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetailsReceiver("${row.taskId}","RECEIVER","${row.message}")>  <i class="fa fa-tasks"></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,
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
function CloseRequestforMe() {
    document.getElementById("title").innerHTML = "Close Request for Me";
    document.getElementById("headerColor").style.backgroundColor = "#ffc107";
    document.getElementById("taskrequest").style.display = "block";
    document.getElementById("taskdiv").style.display = "none";
    document.getElementById("taskclose").style.display = "block";
    document.getElementById("closeRequest").style.display = "none";
    document.getElementById("taskrejected").style.display = "block";




    dataTable = $("#RequesttaskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/CloseRequestTable',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'receivername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },
            { 'data': '', 'defaultContent': 'Please Close The Task', 'width': '10%' },

            {
                'data': 'taskid', 'render': function (data, type, row) {
                    return `<a class="btn btn-danger btn-sm" style="color:white"  data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetails("${row.taskId}","RECEIVER") >  <i class="fa fa-tasks" ></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,
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

//------------------------FUNCTION FOR TASK BY ME-----------------------------//

function totaltaskByMe() {
    document.getElementById("title").innerHTML = "Total Task Created BY Me";
    document.getElementById("headerColor").style.backgroundColor = "#17a2b8";
    document.getElementById("dailytask").style.display = "none";

    document.getElementById("taskdiv").style.display = "block";
    document.getElementById("taskrequest").style.display = "none";
    document.getElementById("closeRequest").style.display = "none";
    document.getElementById("taskclose").style.display = "none";


    document.getElementById("col1").innerHTML = "Created For";
    document.getElementById("col2").innerHTML = "Task Title";
    document.getElementById("col3").innerHTML = "Starting Date";
    document.getElementById("col4").innerHTML = "Deadline Date";
    document.getElementById("col5").innerHTML = "Status";


    dataTable = $("#taskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/totalTaskbyME',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [
            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'receivername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },
            {
                'data': 'startingdate', 'render': function (data, type, row) {
                    var date1 = row.startingdate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },
            {
                'data': 'deadlinedate', 'render': function (data, type, row) {


                    var date1 = row.deadlinedate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },
            {
                'data': 'status', 'render': function (data, type, row) {
                    if (row.status == true) {
                        return ` <button type="button" class="btn btn-success">Completed</button>`;


                    }
                    else {
                        return ` <button type="button" class="btn btn-warning">Pending</button>`;

                    }

                }, 'width': '10%'

            },
            {
                'data': 'taskid', 'render': function (data, type, row) {
                    var dt = row;
                    return `
                      <a class="btn btn-danger btn-sm" style="color:white" data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetails("${row.taskId}","CREATER")>  <i class="fa fa-tasks"></i> View Task</a>
                      <a class="btn btn-danger btn-sm" style="color:white" onclick= deleteTask("${row.taskId}")>  <i class="fa fa-trash"></i> Delete</a>
                        `;
                }, 'width': '14%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,

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
function DailyTaskByMe() {

    document.getElementById("col1").innerHTML = "Created For";
    document.getElementById("col2").innerHTML = "Task Title";
    document.getElementById("col3").innerHTML = "Starting Date";
    document.getElementById("col4").innerHTML = "Deadline Date";
    document.getElementById("col5").innerHTML = "Status";


    document.getElementById("closeRequest").style.display = "none";
    document.getElementById("taskclose").style.display = "block";
    document.getElementById("taskdiv").style.display = "block";
    document.getElementById("taskrequest").style.display = "none";


    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var dateStringWithTime = moment(now).format('YYYY-MM-DD');
    document.getElementById('DailyDate').value = dateStringWithTime;
    document.getElementById("title").innerHTML = "DailyTask Created By Me";
    document.getElementById("headerColor").style.backgroundColor = "#dc3545";
    document.getElementById("dailytask").style.display = "block";

    var ddate = document.getElementById("DailyDate").value;
    var ddate = moment(ddate).format('YYYY-MM-DDT00:00:00');

    dataTable = $("#taskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/DailyTaskByMe',
            'type': 'GET',
            'contentType': 'application/json',
            data: {
                edate: ddate,
            },
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'receivername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },


            {
                'data': 'startingdate', 'render': function (data, type, row) {


                    var date1 = row.startingdate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'deadlinedate', 'render': function (data, type, row) {


                    var date1 = row.deadlinedate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },


            {
                'data': 'status', 'render': function (data, type, row) {
                    if (row.status == true) {
                        return ` <button type="button" class="btn btn-success">Completed</button>`;
                    }
                    else {
                        return ` <button type="button" class="btn btn-warning">Pending</button>`;
                    }

                }, 'width': '10%'

            },
            {
                'data': 'taskid', 'render': function (data, type, row) {
                    return `<a class="btn btn-danger btn-sm" style="color:white" data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetails("${row.taskId}","CREATER")>  <i class="fa fa-tasks"></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,
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
function completedTaskBYMe() {
    document.getElementById("col1").innerHTML = "Created For";
    document.getElementById("col2").innerHTML = "Task Title";
    document.getElementById("col3").innerHTML = "Starting Date";
    document.getElementById("col4").innerHTML = "Deadline Date";
    document.getElementById("col5").innerHTML = "Status";

    document.getElementById("closeRequest").style.display = "none";
    document.getElementById("taskclose").style.display = "none";

    document.getElementById("title").innerHTML = "Completed Task Created By Me";
    document.getElementById("headerColor").style.backgroundColor = "#28a745";
    document.getElementById("dailytask").style.display = "none";
    document.getElementById("taskdiv").style.display = "block";
    document.getElementById("taskrequest").style.display = "none";
    dataTable = $("#taskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/completedTaskBYMe',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [


            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'sendername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },

            {
                'data': 'startingdate', 'render': function (data, type, row) {


                    var date1 = row.startingdate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'deadlinedate', 'render': function (data, type, row) {


                    var date1 = row.deadlinedate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'status', 'render': function (data, type, row) {
                    if (row.status == true) {
                        return ` <button type="button" class="btn btn-success">Completed</button>`;
                    }
                    else {
                        return ` <button type="button" class="btn btn-warning">Pending</button>`;
                    }

                }, 'width': '10%'

            },
            {
                'data': 'taskid', 'render': function (data, type, row) {
                    var dt = row;
                    return `<a class="btn btn-danger btn-sm" style="color:white" data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetails("${row.taskId}")>  <i class="fa fa-tasks"></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,
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
function pendingTaskByMe() {
    document.getElementById("col1").innerHTML = "Created For";
    document.getElementById("col2").innerHTML = "Task Title";
    document.getElementById("col3").innerHTML = "Starting Date";
    document.getElementById("col4").innerHTML = "Deadline Date";
    document.getElementById("col5").innerHTML = "Status";
    document.getElementById("closeRequest").style.display = "none";
    document.getElementById("taskclose").style.display = "block";
    document.getElementById("taskdiv").style.display = "block";
    document.getElementById("taskrequest").style.display = "none";

    document.getElementById("title").innerHTML = "Pending Task Created By Me";
    document.getElementById("headerColor").style.backgroundColor = "#ffc107";
    document.getElementById("dailytask").style.display = "none";


    dataTable = $("#taskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/PendingTaskBYMe',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'receivername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },

            {
                'data': 'startingdate', 'render': function (data, type, row) {


                    var date1 = row.startingdate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },

            {
                'data': 'deadlinedate', 'render': function (data, type, row) {


                    var date1 = row.deadlinedate;
                    var now1 = date1.toString().replace('T', ' ');
                    var dateStringWithTime1 = moment(now1).format('DD-MMM-YYYY MM:hh');
                    var hours1 = moment(now1).format('hh');
                    var x1 = Number(hours1)
                    var ampm1 = x1 >= 12 ? 'AM' : 'PM';
                    dateStringWithTime1 = dateStringWithTime1 + " (" + ampm1 + ")";
                    return `<span>${dateStringWithTime1}</span>`;

                }, 'width': '10%'
            },



            {
                'data': 'status', 'render': function (data, type, row) {
                    if (row.status == true) {
                        return ` <button type="button" class="btn btn-success">Completed</button>`;
                    }
                    else {
                        return ` <button type="button" class="btn btn-warning">Pending</button>`;
                    }

                }, 'width': '10%'

            },
            {
                'data': 'taskid', 'render': function (data, type, row) {
                    var dt = row;
                    return `<a class="btn btn-danger btn-sm" style="color:white" data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetails("${row.taskId}","CREATER")>  <i class="fa fa-tasks"></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,
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
function CloseRequestByMe() {
    document.getElementById("title").innerHTML = "Close Request BY Me";
    document.getElementById("headerColor").style.backgroundColor = "#ffc107";
    document.getElementById("taskrequest").style.display = "block";
    document.getElementById("taskdiv").style.display = "none";
    document.getElementById("taskclose").style.display = "none";
    document.getElementById("closeRequest").style.display = "none";

    dataTable = $("#RequesttaskDatatable").DataTable({
        ajax: {
            'url': '/api/TaskController/MyCloseRequestTable',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '.5%' },
            { 'data': 'receivername', 'defaultContent': '-', 'width': '10%' },
            { 'data': 'tasktitle', 'defaultContent': '-', 'width': '10%' },
            { 'data': '', 'defaultContent': 'Please Close The Task', 'width': '10%' },

            {
                'data': 'taskid', 'render': function (data, type, row) {
                    return `<a class="btn btn-danger btn-sm" style="color:white"  data-toggle="modal" data-target="#taskdetailsModel" onclick=TaskDetailsReceiver("${row.taskId}","RECEIVER","${row.message}") >  <i class="fa fa-tasks" ></i> View Task</a> `;
                }, 'width': '8%'
            },
        ],
        "bDestroy": true,
        "scrollX": true,
        "scrollY": true,
        "paging": false,
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
function otherTaskDashboard() {

    dataTable = $("#otherTaskDashboardTable").DataTable({
        ajax: {
            'url': '/api/TaskController/FillUser',
            'type': 'GET',
            'contentType': 'application/json'
        },
        columns: [

            { 'data': null, 'defaultContent': '-', 'width': '5%' },
            { 'data': 'username', 'defaultContent': '-', 'width': '80%' },

            {
                'data': 'username', 'render': function (data) {
                    ``
                    return `<a class="btn btn-info btn-sm" style="color:white" onclick="ViewDashboard("${data}")"> <i class="fas fa-eye"></i>View Dashboard</a>`
                }, 'width': '20%'
            },

        ],
        "bDestroy": true,
        "paging": true,
        "ordering": false,
        "info": true,
        "paging": false,



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
function ViewDashboard(usid) {
    window.open('../TaskDashboard?usid=' + usid, '_blank');
}
function TaskClose() {
    var taskid = document.getElementById("taskid").value;
    $.ajax({
        type: 'Post',
        url: "api/TaskController/TaskClose",
        data: {
            taskid: taskid,
        },
        success: function (data) {

            if (data.success) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Successfully Close the Task!'

                })
                $('#taskDatatable').DataTable().ajax.reload();
                var now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                var date = moment(now).format('YYYY-MM-DD');
                counter1(date)
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });

}
function CloseRequest() {
    var taskid = document.getElementById("taskid").value;

    $.ajax({
        type: 'Post',
        url: "api/TaskController/TaskCloseRequest",
        data: {
            taskid: taskid,
        },
        success: function (data) {

            if (data.success) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Successfully Close the Task!'

                })
                $('#taskDatatable').DataTable().ajax.reload();
                var now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                var date = moment(now).format('YYYY-MM-DD');
                counter1(date)
                document.getElementById("closeRequest").style.display = "none";
                document.getElementById("AlreadyRequest").style.display = "block";

            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });

}
function finalClosed() {
    var taskid = document.getElementById("taskid").value;

    $.ajax({
        type: 'Post',
        url: "api/TaskController/TaskClose",
        data: {
            taskid: taskid,
        },
        success: function (data) {

            if (data.success) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Successfully Close the Task!'

                })
                $('#taskDatatable').DataTable().ajax.reload();
                var now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                var date = moment(now).format('YYYY-MM-DD');
                counter1(date)
            }
            else {
                Swal.fire(data.message, '', 'info')
            }
        }
    });
}
function uploadFile() {
    let File1 = $("#document_attachment_doc")[0].files;
    var taskid = document.getElementById("taskid").value;
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var ddate = now.toISOString().slice(0, 16);
    var type = document.getElementById("typee").innerHTML;
    if (File1 != null) {

        var formData = new FormData();
        for (i = 0; i < File1.length; i++) {
            formData.append('Name1', File1[i]);
            formData.append('date', ddate);
            formData.append('taskid', taskid);
            formData.append('type', type);
        }
        console.log(formData);
        $.ajax({
            type: 'Post',
            url: "api/TaskController/AddFile",
            async: false,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            data: formData,
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
                        title: 'File is Uploaded!'
                    })
                    dataTable.ajax.reload();
                    $('#attachments').toggle();
                }
                else {
                    Swal.fire(data.message, '', 'error')
                }
            }
        });
    }
    else {
        Swal.fire("Please select the file to upload", '', 'error')

    }
}
function deleteTask(taskId) {

    Swal.fire({
        title: 'Are your sure you want to delete this Task?',
        text: "Once deleted, you'll be not able to recover this Task.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'Delete',
                url: '/api/TaskController/TaskDelete?Id=' + taskId,
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
                            title: 'Successfully Deleted'
                        })

                        $('#taskDatatable').DataTable().ajax.reload();
                        var now = new Date();
                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                        var date = moment(now).format('YYYY-MM-DD');
                        counter1(date)

                    }
                    else {
                        Swal.fire(data.message, '', 'error')

                    }
                }
            })
        }
    })




}

function chatdelete(taskId) {

    Swal.fire({
        title: 'Are your sure you want to delete this Task?',
        text: "Once deleted, you'll be not able to recover this Task.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'Delete',
                url: '/api/TaskController/TaskDelete?Id=' + taskId,
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
                            title: 'Successfully Deleted'
                        })


                    }
                    else {
                        Swal.fire(data.message, '', 'error')

                    }
                }
            })
        }
    })
}


function RejectedTask() {

    var taskId = document.getElementById("taskid").value;
   

    Swal.fire({
        title: 'Are your sure you want to Rejected this Task?',
        text: "Once deleted, The task' ll rejected.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
    }).then(result => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'Delete',
                url: '/api/TaskController/TaskRejected?Id=' + taskId,
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
                            title: 'Successfully Deleted'
                        })


                    }
                    else {
                        Swal.fire(data.message, '', 'error')

                    }
                }
            })
        }
    })

}