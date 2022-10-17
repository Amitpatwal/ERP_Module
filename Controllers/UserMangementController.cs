using SALES_ERP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Hosting;


namespace SALES_ERP.Controllers
{
    [Route("api/UserManagement")]
    public class UserManagementController : Controller
    {
        private readonly ApplicationDBContext _db;
        private IWebHostEnvironment Environment;
        public UserManagementController(ApplicationDBContext db, IWebHostEnvironment _environment)
        {
            _db = db;
            Environment = _environment;
        }

        [HttpPost]
        [Route("Addrole")]
        public IActionResult AddRole(RoleName role)
        {
            try
            {
                _db.RoleName.Add(role);
                _db.SaveChanges();
                return Json(new { success = true, message = "Role added successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("Filldatatable")]
        public IActionResult Filldatatable()
        {
            try
            {
                var data = _db.CustomerData.ToList();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }

        [Route("Getrolelist")]
        public IActionResult Getrolelist()
        {
            try
            {
                var data = _db.RoleName.ToList();
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("CheckPermission")]
        public IActionResult CheckPermission(int idd)
        {
            try
            {
                var data = _db.companypermission.Where(a => a.id == idd).FirstOrDefault();
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [HttpPost]
        [Route("updaterole")]
        public IActionResult UpdateClient(RoleName client)
        {
            try
            {
                var temp = _db.RoleName.Find(client.roleid);
                temp.rolename = client.rolename;
                _db.SaveChanges();
                return Json(new { success = true, message = "Role updated successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("updatepermission")]
        public IActionResult updatepermission(companypermission per)
        {
            try
            {
                var data = _db.companypermission.Where(a => a.id == per.id).FirstOrDefault();
                if (data != null)
                {
                    data.permission = per.permission;
                    data.rolename = per.rolename;
                    data.roleid = per.roleid;
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Role updated successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("Deleterole")]
        public IActionResult DeleteClient(int Id)
        {
            try
            {
                var ClientFromDB = _db.RoleName.FirstOrDefault(u => u.roleid == Id);
                if (ClientFromDB == null)
                {
                    return Json(new { success = false, message = "Error while deleting" });
                }
                _db.RoleName.Remove(ClientFromDB);
                _db.SaveChanges();
                return Json(new { success = true, message = "Client deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = true, message = "Error while deleting:" + ex });
            }
        }

























        [HttpPost]
        [Route("AddUser")]
        public IActionResult AddUser(user User)
        {
            try
            {
                _db.user.Add(User);
                _db.SaveChanges();
                var companylist = _db.CompanyProfile.ToList();
                foreach (var lst in companylist)
                {
                    var cmp = new companypermission();

                    cmp.usid = User.usid;
                    cmp.companyid = lst.uniquecode;
                    cmp.permission = false;
                    cmp.roleid = 0;
                    cmp.rolename = "";
                    _db.companypermission.Add(cmp);
                    _db.SaveChanges();

                }
                return Json(new { success = true, message = "Role added successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("GetUserList")]
        public IActionResult GetUserList()
        {
            try
            {
                var data = _db.user.ToList();
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getuserdata")]
        public IActionResult getuserdata(int id)
        {
            try
            {
                var data = _db.user.FirstOrDefault(u => u.usid == id);
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpDelete]
        [Route("DeleteUser")]
        public IActionResult DeleteUser(int Id)
        {
            try
            {
                var ClientFromDB = _db.user.FirstOrDefault(u => u.usid == Id);
                if (ClientFromDB == null)
                {
                    return Json(new { success = false, message = "Error while deleting" });
                }
                _db.user.Remove(ClientFromDB);
                _db.SaveChanges();
                return Json(new { success = true, message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = true, message = "Error while deleting:" + ex });
            }
        }

        [HttpPost]
        [Route("updateUser")]
        public IActionResult updateUser(user client)
        {
            try
            {
                var data = _db.companypermission.Where(a => a.usid == client.usid).FirstOrDefault();
                if (data == null)
                {
                    var companylist = _db.CompanyProfile.ToList();
                    foreach (var lst in companylist)
                    {
                        var cmp = new companypermission();

                        cmp.usid = client.usid;
                        cmp.companyid = lst.uniquecode;
                        cmp.permission = false;
                        cmp.roleid = 0;
                        cmp.rolename = "";
                        _db.companypermission.Add(cmp);
                        _db.SaveChanges();

                    }
                }
                var temp = _db.user.Find(client.usid);

                temp.username = client.username;
                temp.userid = client.userid;
                temp.roletype = client.roletype;
                _db.SaveChanges();
                return Json(new { success = true, message = "User Data updated successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("updatePass")]
        public IActionResult updatePass(user client)
        {
            try
            {
                var temp = _db.user.Find(client.usid);
                temp.password = client.password;
                _db.SaveChanges();
                return Json(new { success = true, message = "Password updated successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("getcompanylist")]
        public IActionResult getcompanylist(int usid)
        {
            try
            {
                var data = (from cmpn in _db.CompanyProfile join per in _db.companypermission on cmpn.uniquecode equals per.companyid where per.usid == usid select new { companyname = cmpn.Companyname, status = per.permission, rolename = per.rolename, id = per.id }).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("permissioncheck")]
        public IActionResult permissioncheck(string formName, string operation)
        {
            try
            {

                var usidd = Request.Cookies["id"];
                int usid = Convert.ToInt32(usidd);
                var roleidd = Request.Cookies["roleid"];
                int roleid = Convert.ToInt32(roleidd);


                var data = _db.userrights.Where(a => a.roleid == roleid && a.formsName == formName && a.operations == operation).FirstOrDefault();
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("fillpermission")]
        public IActionResult fillpermission()
        {
            try
            {
                var usidd = Request.Cookies["id"];
                int usid = Convert.ToInt32(usidd);
                var roleidd = Request.Cookies["roleid"];
                int roleid = Convert.ToInt32(roleidd);
                var data = _db.userrights.Where(a => a.roleid == roleid).ToList().OrderBy(a=>a.formsName).ThenBy(a=>a.operations);

                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false });

            }
        }



        [HttpPost]
        [Route("uploadImage")]
        public IActionResult AddFile(user file)
        {
            try
            {
                var usidd = Request.Cookies["id"];
                int usid = Convert.ToInt32(usidd);
                var comapnyid = Request.Cookies["companyid"];
                var file1 = _db.user.Where(a => a.usid == usid).FirstOrDefault();
                if (file1 != null)
                {
                    var newPath = "~/files/ProfilePhoto";
                    List<string> parentList = new List<string>();
                    string uploadsFolder = newPath;
                    if (!Directory.Exists(uploadsFolder))
                    {
                        System.IO.Directory.CreateDirectory(Path.Combine(this.Environment.WebRootPath, uploadsFolder));
                    }
                    var exten = System.IO.Path.GetExtension((file.Name1[0].FileName));
                    var newFileName = file1.username + file1.usid + exten;
                    string filePath = Path.Combine(uploadsFolder, newFileName);
                    var filepp = filePath;
                    filePath = Path.Combine(this.Environment.WebRootPath, filePath);
                    bool add = false;
                    var fileName1 = file.Name1[0].FileName;
                    while (add == false)
                    {

                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }
                        else
                        {
                            add = true;
                        }

                    }
                    filePath = Path.Combine(this.Environment.WebRootPath, filePath);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        file.Name1[0].CopyTo(fileStream);
                    }
                    file1.filename = newFileName;
                    _db.SaveChanges();
                    CookieOptions options = new CookieOptions();
                    options.Expires = DateTime.Now.AddDays(2);
                    Response.Cookies.Append("userimage", filepp, options);
                    return Json(new { success = true, data = filepp, message = "File is uploaded successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Something went wrong" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [HttpDelete]
        [Route("DeleteFile")]
        public IActionResult DeleteFile()
        {
            try
            {
                var usidd = Request.Cookies["id"];
                int usid = Convert.ToInt32(usidd);
                var comapnyid = Request.Cookies["companyid"];
                var FileFromDB = _db.user.Where(a => a.usid == usid).FirstOrDefault();
                if (FileFromDB == null)
                {
                    return Json(new { success = false, message = "Error while deleting" });
                }
                else
                {
                    var newPath = "~/files/ProfilePhoto";
                    newPath += "/" + FileFromDB.filename;
                    newPath = Path.Combine(this.Environment.WebRootPath, newPath);
                    System.IO.File.Delete(newPath);
                }
                var img = "https://bootdey.com/img/Content/avatar/avatar7.png";
                CookieOptions options = new CookieOptions();
                options.Expires = DateTime.Now.AddDays(2);
                Response.Cookies.Append("userimage", img, options);
                FileFromDB.filename = "";
                _db.SaveChanges();
                return Json(new { success = true, message = "File deleted successfully", data = img });
            }
            catch (Exception ex)
            {
                return Json(new { success = true, message = "Error while deleting:" + ex });
            }
        }



    }
}
