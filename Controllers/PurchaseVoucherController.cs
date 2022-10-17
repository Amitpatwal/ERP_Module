using SALES_ERP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace SALES_ERP.Controllers
{
    [Route("api/Voucher")]
    public class PurchaseVoucherController : Controller
    {
        private readonly ApplicationDBContext _db;
        public PurchaseVoucherController(ApplicationDBContext db)
        {
            _db = db;
        }

       
        [Route("PVNO")]
        public IActionResult PVNO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var PVNO = _db.Purchase.Where(a => a.Companyid == comapnyid).Select(p => p.PRnodigit).DefaultIfEmpty().Max();
                PVNO++;
                var prefix = _db.Prefix.Where(a => a.Type == "PurchaseVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var pvno = prefix + PVNO;
                return Json(new { success = true, data = pvno });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("AddPurchaseVoucher")]
        public IActionResult AddPurchaseVoucher(string type, Purchase pr)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var userid = Convert.ToInt32(Request.Cookies["id"]);
                if (type == "Save")
                {
                    var pvnodigit = _db.Purchase.Where(a => a.Companyid == companyid).Select(p => p.PRnodigit).DefaultIfEmpty().Max();
                    pvnodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "PurchaseVoucher" && a.Companyid == companyid).Select(a => a.Prefixname).FirstOrDefault();
                    var pvno =
                    pr.PrNO = prefix + pvnodigit;
                    pr.PRnodigit = pvnodigit;
                    pr.Companyid = companyid;
                    pr.Userid = Request.Cookies["username"];
                    _db.Purchase.Add(pr);
                    _db.SaveChanges();

                }
                else
                {
                    var upi = _db.Purchase.Where(x => x.PrNO == pr.PrNO && x.Companyid == companyid).FirstOrDefault();
                    if (upi != null)
                    {
                        upi.Date = pr.Date;
                        upi.Companyid = companyid;
                        upi.Ccode = pr.Ccode;
                        upi.Companyname = pr.Companyname;
                        upi.PurchaseDate = pr.PurchaseDate;
                        upi.PurchaseNo = pr.PurchaseNo;
                        upi.Pterm = pr.Pterm;
                        upi.Debit = pr.Debit;
                        upi.Credit = pr.Credit;
                        upi.Userid = Request.Cookies["username"];
                        _db.SaveChanges();
                    }
                    return Json(new { success = true, data = pr.PrNO, message = "Successfully Updated" });





                }



                return Json(new { success = true, data= pr.PrNO, message = "Purchase Voucher Created successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("PRTable")]
        public IActionResult PRTable(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Purchase.Where(a => a.Companyid == comapnyid && a.Date.Date>=fromdate.Date && a.Date.Date<=todate.Date ).ToList().OrderByDescending(s => s.PRnodigit);
               
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [HttpDelete]
        [Route("DeleteData")]
        public IActionResult DeleteData(string Id)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var usreid = Convert.ToInt32(Request.Cookies["id"]);
                var data = _db.Purchase.Where(a => a.PrNO == Id && a.Companyid == companyid).FirstOrDefault();
                _db.Purchase.Remove(data);
                _db.SaveChanges();
                 
                 return Json(new { success = true, message = "Company deleted successfully" });
               
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error while deleting:" + ex });
            }
        }

        [Route("getData")]
        public IActionResult getData(string id)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.Purchase.Where(a => a.PrNO == id && a.Companyid == companyid).FirstOrDefault();
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


    }
}
