using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Web;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using SALES_ERP.Models;

namespace SALES_ERP.Controllers
{

    [Route("api/Attachments")]
    public class AttachmentsController : Controller
    {

        private readonly ApplicationDBContext _db;
        private IWebHostEnvironment Environment;
        public AttachmentsController(ApplicationDBContext db, IWebHostEnvironment _environment)
        {
            _db = db;
            Environment = _environment;
        }
        public IActionResult Index()
        {
            return View();
        }

       
        [HttpPost]
        [Route("AddFile")]
        public IActionResult AddFile(Attachment file)
        {
            try
            {
                int k;
                var comapnyid = Request.Cookies["companyid"];

                var cid   = _db.CompanyProfile.Where(a => a.uniquecode == comapnyid).Select(a => a.Companyid).FirstOrDefault();
                //Set Key Name
                for (k = 0; k < file.Name1.Count; k++)
                {
                    var file1 = new Attachment();
                    var newPath = "~/files/" + cid+"/"+file.vouchername;
                 
                    List<string> parentList = new List<string>();
                 

                    string uploadsFolder = newPath;
                    if (!Directory.Exists(uploadsFolder))
                    {
                        System.IO.Directory.CreateDirectory(Path.Combine(this.Environment.WebRootPath, uploadsFolder));
                    }
                    
                    string filePath = Path.Combine(uploadsFolder, file.Name1[k].FileName);
                    filePath = Path.Combine(this.Environment.WebRootPath, filePath);
                    /*file.OrigName = file.Name1[k].FileName;*/
                    int temp = 0;
                    bool add = false;
                    var fileName = "";
                    var fileName1 = file.Name1[k].FileName;
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
                    file1.filename = fileName1;
                    file1.companyid = comapnyid;
                    file1.Date = file.Date;
                    file1.vouchername = file.vouchername;
                    file1.voucherno = file.voucherno;
                    file1.URL = file.URL;
                    _db.Attachment.Add(file1);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "File uploaded successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("getFiledetailtc")]
        public IActionResult getFiledetailhjv(string voucherno , string vouchername)
        {
            try
            {

                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Attachment.Where(a => a.companyid == comapnyid && a.voucherno == voucherno && a.vouchername == vouchername).ToList();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }

        }

        [Route("getFiledetail")]
        public IActionResult getFiledetail(string voucherno, string vouchername)
        {

            var comapnyid = Request.Cookies["companyid"];
            var Files = _db.Attachment.Where(a => a.companyid == comapnyid && a.voucherno == voucherno && a.vouchername == vouchername).ToList();
            var cid = _db.CompanyProfile.Where(a => a.uniquecode == comapnyid).Select(a => a.Companyid).FirstOrDefault();
           
            var newPath = "~/files/" + cid + "/" + vouchername;
            
            List<string> parentList = new List<string>();
           

           /* if (ParentFolder != 0)
            {
                while (cont == 0)
                {
                    var ParentId = _db.Folders.Where(x => x.ClientId == ClientId && x.SrNo == childNode).FirstOrDefault();
                    parentList.Add(ParentId.Name);
                    childNode = ParentId.ParentFolder;
                    if (ParentId.ParentFolder == 0)
                        cont = 1;
                }
                for (int i = parentList.Count(); i > 0; i--)
                {
                    newPath += '/' + parentList[i - 1];
                }
            }*/

            foreach (var item in Files)
            {
                /*string uploadsFolder = newPath;
                newPath = Path.Combine(uploadsFolder, item.OrigName);
                item.URL = newPath;*/
                string uploadsFolder = newPath;
                item.URL = uploadsFolder + "/" + item.filename;
            }
            return Json(new { data = Files });
        }



        [HttpDelete]
        [Route("DeleteFile")]
        public IActionResult DeleteFile(int Id, string vouchername)
        {
            try
            {
                var FileFromDB = _db.Attachment.Where(a => a.Sr == Id).FirstOrDefault();
                if (FileFromDB == null)
                {
                    return Json(new { success = false, message = "Error while deleting" });
                }
                else
                {
                    var comapnyid = Request.Cookies["companyid"];
                    var cid = _db.CompanyProfile.Where(a => a.uniquecode == comapnyid).Select(a => a.Companyid).FirstOrDefault();

                    var newPath = "~/files/" + cid + "/" + vouchername;
                
                        newPath += "/" + FileFromDB.filename;
                        newPath = Path.Combine(this.Environment.WebRootPath, newPath);
                        System.IO.File.Delete(newPath);
                    }
                
                _db.Attachment.Remove(FileFromDB);
                _db.SaveChanges();
                return Json(new { success = true, message = "File deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = true, message = "Error while deleting:" + ex });
            }
        }
        [Route("counter")]
        public IActionResult counter(string voucherno, string vouchername)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var ctr = _db.Attachment.Where(a => a.companyid == comapnyid && a.vouchername == vouchername && a.voucherno == voucherno).Count();
                return Json(new { success = true, data=ctr });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

    }
}
