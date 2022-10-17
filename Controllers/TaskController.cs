using SALES_ERP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace SALES_ERP.Controllers
{
    [Route("api/TaskController")]
    public class TaskController : Controller
    {
        private readonly ApplicationDBContext _db;

        private IWebHostEnvironment Environment;
        public TaskController(ApplicationDBContext db, IWebHostEnvironment _environment)
        {
            _db = db;
            Environment = _environment;

        }

        [HttpPost]
        [Route("CreateTask")]
        public IActionResult CreateTask(SendTask task)
        {
            try
            {

                var username = Request.Cookies["username"];
                var usercode = Request.Cookies["id"];
                var usercode1 = Convert.ToInt32(usercode);
                var taskid = _db.SendTask.Select(a => a.TaskId).DefaultIfEmpty().Max();
                taskid = taskid + 1;
                task.TaskId = taskid;
                task.TaskIdSr = 1;
                task.sendername = username;
                task.sendercode = usercode1;
                var message = task.message;
                task.message = "open";
                task.Status = false;
                task.isReceived = false;
                _db.SendTask.Add(task);
                _db.SaveChanges();
                var chat = new Chat();
                if (task.Name1== null) 
                { 
                chat.Taskid = taskid;
                chat.date = task.currentDate;
                chat.sendername = username;
                chat.type = "CREATER";
                chat.message = message;
                chat.senderid = usercode1;
                chat.Taskidsr = 1;
                _db.Chat.Add(chat);
                _db.SaveChanges();
                }else
                {
                    int k;
                    var userid = Request.Cookies["id"];
                    for (k = 0; k < task.Name1.Count; k++)
                    {
                        var file1 = new Chat();
                        var newPath = "~/files/chatdatabase/";
                        List<string> parentList = new List<string>();
                        string uploadsFolder = newPath;
                        if (!Directory.Exists(uploadsFolder))
                        {
                            System.IO.Directory.CreateDirectory(Path.Combine(this.Environment.WebRootPath, uploadsFolder));
                        }
                        var fileName = "";
                        var taskidsr = _db.Chat.Where(a => a.Taskid == task.TaskId).Select(a => a.Taskidsr).DefaultIfEmpty().Max();
                        file1.Taskidsr = ++taskidsr;
                        string ext = System.IO.Path.GetExtension((task.Name1[k].FileName));
                        var fileName1 = (task.TaskId.ToString() + taskidsr.ToString()).ToString() + ext;
                        string filePath = Path.Combine(uploadsFolder, fileName1);
                        filePath = Path.Combine(this.Environment.WebRootPath, filePath);
                        var orginalName = task.Name1[k].FileName;
                        int temp = 0;
                        bool add = false;

                        while (add == false)
                        {

                            if (System.IO.File.Exists(filePath))
                            {
                                temp++;
                                string extension = System.IO.Path.GetExtension((task.Name1[k].FileName));
                                fileName = task.Name1[k].FileName.Substring(0, (task.Name1[k].FileName.Length - extension.Length));
                                fileName1 = fileName + "-" + temp + extension;
                                filePath = Path.Combine(uploadsFolder, fileName + "-" + temp + extension);
                                filePath = Path.Combine(this.Environment.WebRootPath, filePath);
                                fileName1 = fileName + "-" + temp + extension;
                            }
                            else
                            {
                                add = true;
                            }

                        }
                        filePath = Path.Combine(this.Environment.WebRootPath, filePath);
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            task.Name1[k].CopyTo(fileStream);
                        }
                        file1.orginalName = orginalName;
                        file1.filename = fileName1;
                        file1.type = "CREATER";
                        file1.Taskid = taskid;
                        file1.message = message;
                        file1.sendername = username;
                        file1.filename = fileName1;
                        file1.senderid = Convert.ToInt32(userid);
                        file1.date = task.currentDate;
                        _db.Chat.Add(file1);
                        _db.SaveChanges();
                    }


                }
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }








        [Route("FillUser")]
        public IActionResult FillUser()
        {
            try
            {
                var usercode = Convert.ToInt16(Request.Cookies["id"]);

                var data = _db.user.Where(a => a.usid != usercode).ToList();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }



        [Route("FillTaskList")]
        public IActionResult FillTaskList()
        {
            try
            {


                /*var usercode = Convert.ToInt16(Request.Cookies["id"]);

                var data = _db.user.Where(a => a.usid != usercode).ToList();
                
                return Json(new { success = true, data = data });*/
                var dsList = new List<tasklist>();
                var sendername = Request.Cookies["username"].Trim();
                var data = _db.SendTask.Where(a => a.sendername == sendername && a.TaskIdSr == 1).GroupBy(b => new { b.receivername, b.receivercode }).Select(c => new { receivername = c.Key.receivername, Count = c.Count(), receivercode = c.Key.receivercode }).ToList();

                foreach (var dtt in data)
                {
                    var ds = new tasklist();
                    ds.username = dtt.receivername;
                    ds.completedTask = _db.SendTask.Where(a => a.receivername == dtt.receivername && a.Status == true).GroupBy(a => a.TaskId).Count();
                    ds.PendingTask = _db.SendTask.Where(a => a.receivername == dtt.receivername && a.Status == false).GroupBy(a => a.TaskId).Count();
                    ds.usreid = dtt.receivercode;
                    dsList.Add(ds);
                }

                return Json(new { success = true, data = dsList });
            }
            catch (Exception Ex)
            {
                return Json(new { success = false, message = Ex });

            }
        }

        [Route("counter")]
        public IActionResult counter(DateTime edate)
        {
            try
            {

                var completed = _db.SendTask.Where(a => a.Status == true).Count();
                var pending = _db.SendTask.Where(a => a.Status == false).Count();
                return Json(new { success = true, completed = completed, pending = pending, });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("TaskListView")]
        public IActionResult TaskListView(int usrid)
        {

            try
            {
                var sendername = Request.Cookies["username"].Trim();
                var data = _db.SendTask.Where(a => a.sendername == sendername && a.TaskIdSr == 1 && a.receivercode == usrid).GroupBy(b => new { b.TaskId, b.tasktitle, b.startingdate, b.deadlinedate }).Select(c => new { taskid = c.Key.TaskId, tasktitle = c.Key.tasktitle, startingdate = c.Key.startingdate, deadlinedate = c.Key.deadlinedate }).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }


        [Route("TaskDetails")]
        public IActionResult TaskDetails(int taskid)
        {

            try
            {

                var data = _db.SendTask.Where(a => a.TaskId == taskid).FirstOrDefault();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }



        [Route("TaskchatDetails")]
        public IActionResult TaskchatDetails(int taskid)
        {

            try
            {

                var data = _db.Chat.Where(a => a.Taskid == taskid).ToList().OrderBy(a => a.Taskidsr);
                foreach (var tmp in data)
                {
                    tmp.url = "~/files/chatdatabase/" + tmp.filename;
                    var sender = _db.user.Where(a => a.usid == tmp.senderid).Select(a => a.filename).FirstOrDefault();
                    tmp.imageurl = "~/files/ProfilePhoto/" + sender;
                    if (!Directory.Exists(tmp.imageurl))
                    {
                        tmp.imageurl = "dist/img/user1-128x128.jpg";
                    }
                }
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }
        [HttpPost]
        [Route("SendChat")]
        public IActionResult SendChat(Chat ch)
        {
            try
            {
                var username = Request.Cookies["username"];
                var usercode = Request.Cookies["id"];
                var usercode1 = Convert.ToInt32(usercode);
                var taskidsr = _db.Chat.Where(a => a.Taskid == ch.Taskid).Select(a => a.Taskidsr).DefaultIfEmpty().Max();
                taskidsr = taskidsr + 1;
                ch.Taskidsr = taskidsr;
                ch.sendername = username;
                ch.senderid = usercode1;
                _db.Chat.Add(ch);
                _db.SaveChanges();
                return Json(new { success = true, message = "Task is Created" });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("totalTask")]
        public IActionResult totalTask()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.receivercode == usercode).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }



        [Route("CompletedTask")]
        public IActionResult CompletedTask()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.receivercode == usercode && a.Status == true).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }


        [Route("PendingTask")]
        public IActionResult PendingTask()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.receivercode == usercode && a.Status == false).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }

        [Route("DailyTask")]
        public IActionResult DailyTask(DateTime edate)
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.receivercode == usercode && a.currentDate.Date == edate.Date).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }

        [Route("counter2")]
        public IActionResult counter2(DateTime edate)
        {
            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                counters1 ct = new counters1();
                ct.pending = _db.SendTask.Where(a => a.Status == false && a.receivercode == usercode).Count();
                ct.completed = _db.SendTask.Where(a => a.Status == true && a.receivercode == usercode).Count();
                ct.total = _db.SendTask.Where(a => a.receivercode == usercode).Count();
                ct.daily = _db.SendTask.Where(a => a.currentDate.Date == edate.Date && a.receivercode == usercode).Count();


                ct.pendingbyme = _db.SendTask.Where(a => a.Status == false && a.sendercode == usercode).Count();
                ct.completedbyme = _db.SendTask.Where(a => a.Status == true && a.sendercode == usercode).Count();
                ct.totalbyme = _db.SendTask.Where(a => a.sendercode == usercode).Count();
                ct.dailybyme = _db.SendTask.Where(a => a.currentDate.Date == edate.Date && a.sendercode == usercode).Count();

                ct.closeReqByOther = _db.SendTask.Where(a => a.sendercode == usercode && a.message == "closed1211" && a.Status == false).Count();
                ct.closeReqMY = _db.SendTask.Where(a => a.receivercode == usercode && a.message == "closed1211" && a.Status == false).Count();

                return Json(new { success = true, data = ct });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("totalTaskbyME")]
        public IActionResult totalTaskbyME()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.sendercode == usercode).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }



        [Route("DailyTaskByMe")]
        public IActionResult DailyTaskByMe(DateTime edate)
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.sendercode == usercode && a.currentDate.Date == edate.Date).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }

        [Route("completedTaskBYMe")]
        public IActionResult completedTaskBYMe()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.sendercode == usercode && a.Status == true).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }


        [Route("PendingTaskBYMe")]
        public IActionResult PendingTaskBYMe()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.sendercode == usercode && a.Status == false).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }


        [Route("Notifications")]
        public IActionResult Notifications()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.receivercode == usercode && a.isReceived == false).FirstOrDefault();

                if (data != null)
                {
                    data.isReceived = true;
                    _db.SaveChanges();
                    return Json(new { success = true, data = data });
                }
                else
                {
                    return Json(new { success = false });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }

        [Route("PendingNotifications")]
        public IActionResult PendingNotifications()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.receivercode == usercode && a.Status == false).FirstOrDefault();
                var countt = _db.SendTask.Where(a => a.receivercode == usercode && a.Status == false).Count();
                if (data != null)
                {
                    /* data.isReceived = true;
                     _db.SaveChanges();*/
                    return Json(new { success = true, data = data, countt = countt });
                }
                else
                {
                    return Json(new { success = false });
                }




            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }


        [Route("NotificationsCounter")]
        public IActionResult NotificationsCounter()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var countt = _db.SendTask.Where(a => a.receivercode == usercode && a.Status == false).Count();
                return Json(new { success = true, countt = countt });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }

        [Route("TaskClose")]
        public IActionResult TaskClose(int taskid)
        {
            try
            {

                var data = _db.SendTask.Where(a => a.TaskId == taskid).FirstOrDefault();
                if (data != null)
                {
                    data.Status = true;

                    _db.SaveChanges();
                }

                return Json(new { success = true, });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }



        }


        [Route("TaskCloseRequest")]
        public IActionResult TaskCloseRequest(int taskid)
        {
            try
            {
                var data = _db.SendTask.Where(a => a.TaskId == taskid).FirstOrDefault();
                if (data != null)
                {
                    data.message = "closed1211";

                    _db.SaveChanges();
                }

                return Json(new { success = true, });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }



        }


        [Route("CloseRequestTable")]
        public IActionResult CloseRequestTable(int taskid)
        {
            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.sendercode == usercode && a.message == "closed1211" && a.Status == false).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }


        [Route("MyCloseRequestTable")]
        public IActionResult MyCloseRequestTable(int taskid)
        {
            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.receivercode == usercode && a.message == "closed1211" && a.Status == false).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
        [HttpPost]
        [Route("AddFile")]
        public IActionResult AddFile(Chat file)
        {
            try
            {
                int k;
                var userid = Request.Cookies["id"];
                var username = Request.Cookies["username"];
                for (k = 0; k < file.Name1.Count; k++)
                {
                    var file1 = new Chat();
                    var newPath = "~/files/chatdatabase/";
                    List<string> parentList = new List<string>();
                    string uploadsFolder = newPath;
                    if (!Directory.Exists(uploadsFolder))
                    {
                        System.IO.Directory.CreateDirectory(Path.Combine(this.Environment.WebRootPath, uploadsFolder));
                    }
                    var fileName = "";
                    var taskidsr = _db.Chat.Where(a => a.Taskid == file.Taskid).Select(a => a.Taskidsr).DefaultIfEmpty().Max();
                    file1.Taskidsr = ++taskidsr;
                    string ext = System.IO.Path.GetExtension((file.Name1[k].FileName));
                    var fileName1 = (file.Taskid.ToString() + taskidsr.ToString()).ToString() + ext;
                    string filePath = Path.Combine(uploadsFolder, fileName1);
                    filePath = Path.Combine(this.Environment.WebRootPath, filePath);
                    file.orginalName = file.Name1[k].FileName;
                    int temp = 0;
                    bool add = false;

                    while (add == false)
                    {

                        if (System.IO.File.Exists(filePath))
                        {
                            temp++;
                            string extension = System.IO.Path.GetExtension((file.Name1[k].FileName));
                            fileName = file.Name1[k].FileName.Substring(0, (file.Name1[k].FileName.Length - extension.Length));
                            fileName1 = fileName + "-" + temp + extension;
                            filePath = Path.Combine(uploadsFolder, fileName + "-" + temp + extension);
                            filePath = Path.Combine(this.Environment.WebRootPath, filePath);
                            fileName1 = fileName + "-" + temp + extension;
                        }
                        else
                        {
                            add = true;
                        }

                    }
                    filePath = Path.Combine(this.Environment.WebRootPath, filePath);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        file.Name1[k].CopyTo(fileStream);
                    }
                    file1.orginalName = file.orginalName;
                    file1.filename = fileName1;
                    file1.type = file.type;
                    file1.Taskid = file.Taskid;


                    file1.sendername = username;
                    file1.senderid = Convert.ToInt32(userid);
                    file1.date = file.date;
                    _db.Chat.Add(file1);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "File uploaded successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("TaskDelete")]
        public IActionResult TaskDelete(int Id)
        {
            try
            {
                var taskk = _db.SendTask.Where(a => a.TaskId == Id).FirstOrDefault();
                _db.SendTask.Remove(taskk);
                _db.SaveChanges();

                var FileFromDB = _db.Chat.Where(a => a.Taskid == Id).ToList();
                var newPath = "~/files/chatdatabase/";
                foreach (var data in FileFromDB)
                {
                    if (data.filename != null)
                    {
                        var newPath1 = newPath + data.filename;
                        newPath1 = Path.Combine(this.Environment.WebRootPath, newPath1);
                        System.IO.File.Delete(newPath1);
                    }
                }
                _db.Chat.RemoveRange(FileFromDB);
                _db.SaveChanges();
                return Json(new { success = true, message = "Task deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = true, message = "Error while deleting:" + ex });
            }
        }

        [Route("CloseRequestNotifications")]
        public IActionResult CloseRequestNotifications()
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.sendercode == usercode && a.message == "closed1211" && a.Status == false).FirstOrDefault();

                if (data != null)
                {
                    /* data.isReceived = true;
                     _db.SaveChanges();*/
                    return Json(new { success = true, data = data, });
                }
                else
                {
                    return Json(new { success = false });
                }




            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }

        [Route("TaskRejected")]
        public IActionResult TaskRejected(int Id)
        {

            try
            {
                var username = Request.Cookies["username"];
                var usercode = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.SendTask.Where(a => a.sendercode == usercode && a.TaskId == Id && a.message == "closed1211" && a.Status == false).FirstOrDefault();
                
                if (data != null)
                {
                    data.message = "rejected";
                    _db.SaveChanges(); 
                    /* data.isReceived = true;
                     _db.SaveChanges();*/
                    return Json(new { success = true, data = data, });
                }
                else
                {
                    return Json(new { success = false });
                }




            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }
    }
}
