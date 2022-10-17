using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SALES_ERP.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Controllers
{
    [Route("api/Login")]
    public class LoginController : Controller
    {
        private IWebHostEnvironment Environment;
        private readonly ApplicationDBContext _db;
        public LoginController(ApplicationDBContext db, IWebHostEnvironment _environment)
        {
            _db = db;
            Environment = _environment;
        }


        [HttpPost]
        [Route("validationss")]
        public IActionResult validationss(string emailid, string pass)
        {
            try
            {
                var user = _db.user.Where(x => x.userid == emailid).FirstOrDefault();
                if (user == null)
                {
                    return Json(new { success = false, message = "Invalid login attempt." });
                }
                else
                {
                    var useractive = _db.user.Where(s => s.userid == emailid && s.isActive == true).FirstOrDefault();
                    if (useractive == null)
                    {
                       
                        return Json(new { success = false, message = "User Account is disabled." });
                    }
                    else if (pass == user.password)
                    {
                        CookieOptions options = new CookieOptions();
                        options.Expires = DateTime.Now.AddDays(2);
                        Response.Cookies.Append("Emailid", emailid, options);
                        Response.Cookies.Append("usid", user.userid, options);
                        Response.Cookies.Append("id", user.usid.ToString(), options);
                        Response.Cookies.Append("username", user.username, options);
                        var img = "";
                        if (user.filename != null)
                        {
                            img = "~/files/ProfilePhoto/" + user.filename;
                            if (System.IO.File.Exists(img))
                            {
                                img = "dist/img/user1-128x128.jpg";
                            }
                        }
                        else
                        {
                            img = "https://bootdey.com/img/Content/avatar/avatar7.png";
                        }
                        Response.Cookies.Append("userimage", img, options);

                        HttpContext.Session.SetString("Emailid", emailid);
                        HttpContext.Session.SetString("usid", user.userid);
                        HttpContext.Session.SetInt32("id", user.usid);
                        HttpContext.Session.SetString("username", user.username);
                        return Json(new { success = true });
                    }
                    else
                    {
                        /*  ModelState.AddModelError(string.Empty, "Invalid login attempt.");*/
                        return Json(new { success = false, message = "Invalid login attempt." });
                    }
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex });
            }
        }

        [HttpPost]
        [Route("Logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            Response.Cookies.Delete("Emailid");
            Response.Cookies.Delete("usid");
            Response.Cookies.Delete("id");
            Response.Cookies.Delete("roletype");
            Response.Cookies.Delete("username");
            /*  return RedirectToPage("Index");*/
            return Json(new { success = true, message = "Success" });
        }

        [Route("counter")]
        public IActionResult counter()
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                counters4 ct = new counters4();
                DateTime now = DateTime.Now;
                ct.totalQuotation = _db.SalesqDetails.Where(a => a.Companyid == companyid).Sum(a => a.Amount);
                ct.totalPI = _db.PIdetails.Where(a => a.Companyid == companyid).Sum(a => a.Amount);
                ct.OrderConverted = _db.SOdetails.Where(a => a.Companyid == companyid).Sum(a => a.Amount);
                ct.pendingQuotation = ct.totalQuotation - ct.totalPI;
                ct.totalsaleOrder = _db.SOdetails.Where(a => a.Companyid == companyid && a.SODate.Date == now.Date).Sum(a=>a.Amount);
                ct.dailyquotation = _db.SalesqDetails.Where(a => a.Companyid == companyid && a.Date.Date == now.Date).Sum(a=>a.Amount);

                return Json(new { success = true, data = ct });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", Messages = ex });
            }
        }

        [Route("counter2")]
        public IActionResult counter2(DateTime fromdate, DateTime todate)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                counters4 ct = new counters4();
                ct.totalQuotation = _db.SalesqDetails.Where(a => a.Companyid == companyid && a.Date.Date >= fromdate.Date && a.Date <= todate.Date).Sum(a=>a.Amount);
                ct.totalPI = _db.PIdetails.Where(a => a.Companyid == companyid && a.Date.Date >= fromdate.Date && a.Date <= todate.Date).Sum(a=>a.Amount);
                ct.pendingQuotation = ct.totalQuotation - ct.totalPI;
                ct.OrderConverted = _db.SOdetails.Where(a => a.Companyid == companyid && a.SODate.Date >= fromdate.Date && a.SODate <= todate.Date).Sum(a => a.Amount);
              


                return Json(new { success = true, data = ct });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", Messages = ex });
            }
        }



        [Route("Profilecounter")]
        public IActionResult Profilecounter()
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                ProfileCounter ct = new ProfileCounter();
                ct.totalQuotation = _db.SalesqDetails.Where(a => a.Companyid == companyid && a.Userid==userid).Count();
                ct.totalPI = _db.PIdetails.Where(a => a.Companyid == companyid && a.Userid == userid).Count();
                ct.totalsaleOrder = _db.SOdetails.Where(a => a.Companyid == companyid && a.Userid == userid).Count();
                ct.totalPurchase = _db.PODetials.Where(a => a.Companyid == companyid && a.Userid == userid).Count();
                ct.totalPR = _db.PRDetials.Where(a => a.Companyid == companyid && a.Userid == userid).Count();
                ct.totalDO = _db.DODetials.Where(a => a.Companyid == companyid && a.Userid == userid).Count();
               


                return Json(new { success = true, data = ct });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", Messages = ex });
            }
        }






    }
}
