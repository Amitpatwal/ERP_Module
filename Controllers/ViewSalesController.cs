using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SALES_ERP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SALES_ERP.Controllers

{
    [Route("api/SALES")]
    public class ViewSalesController : Controller
    {
        public readonly ApplicationDBContext _db;
        public ViewSalesController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("SalesNO")]
        public IActionResult SalesNO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var salesnodigit = _db.Sale.Where(a => a.Companyid == comapnyid).Select(a => a.InvoiceNoDigit).DefaultIfEmpty().Max();
                salesnodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "SalesVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var salesno = prefix + salesnodigit;
                return Json(new { success = true, data = salesno, });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
     
        [Route("viewSales")]
        public IActionResult viewSales(string InvoiceNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Sale.Where(x => x.InvoiceNO == InvoiceNO && x.Companyid == comapnyid).FirstOrDefault();
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("SalesList")]
        public IActionResult SalesList(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Sale.Where(x => x.Date.Date>= fromdate.Date && x.Date<=todate.Date && x.Companyid == comapnyid).ToList().OrderBy(a=>a.Date);
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [HttpPost]
        [Route("AddVoucher")]
        public IActionResult AddVoucher(string type, Sale data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type == "Update")
                {
                    var Tpi = _db.Sale.Where(x => x.InvoiceNO == data.InvoiceNO && x.Companyid == comapnyid).FirstOrDefault();
                    if (Tpi != null)
                    {
                        Tpi.Date = data.Date;
                        Tpi.Companyid = comapnyid;
                        Tpi.Ccode = data.Ccode;
                        Tpi.Companyname = data.Companyname;
                        Tpi.POdate = data.POdate;
                        Tpi.Pono = data.Pono;
                        Tpi.TransportName = data.TransportName;
                        Tpi.Tcode = data.Tcode;
                        Tpi.Pterm = data.Pterm;
                        Tpi.Debit = data.Debit;
                        Tpi.Credit = data.Credit;
                        Tpi.Userid = Request.Cookies["username"];
                        _db.SaveChanges();
                    }
                    return Json(new { success = true, data = data.InvoiceNO,message="Successfully Updated" });
                }
                else
                {
                    var salesnodigit = _db.Sale.Where(a => a.Companyid == comapnyid).Select(p => p.InvoiceNoDigit).DefaultIfEmpty().Max();
                    salesnodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "SalesVoucher" && a.Companyid == comapnyid).Select(a=>a.Prefixname).FirstOrDefault();
                    data.InvoiceNO =  prefix+ salesnodigit ;
                    data.InvoiceNoDigit = salesnodigit;
                    data.Companyid = comapnyid;
                    data.Userid = username;
                    _db.Sale.Add(data);
                    _db.SaveChanges();

                    return Json(new { success = true, data = data.InvoiceNO, message = "Successfully Saved" });
                    }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteSales")]
        public IActionResult DeleteSales(string InvoiceNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var salesInvoice = _db.Sale.Where(u => u.InvoiceNO == InvoiceNO && u.Companyid == comapnyid).ToList();
                if (salesInvoice != null)
                {
                    _db.Sale.RemoveRange(salesInvoice);
                    _db.SaveChanges();
                }

               
                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }



        [Route("jumptoPrevious")]
        public IActionResult jumptoPrevious(int sonodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var sonod = _db.SOdetails.Where(a => a.SONodigit < sonodigit && a.Companyid == comapnyid).OrderByDescending(a => a.SONodigit).Select(a => a.SONo).FirstOrDefault();

                if (sonod != null)
                {
                    return Json(new { success = true, data = sonod });
                }
                else
                {
                    return Json(new { success = false });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }
        [Route("jumptoNext")]
        public IActionResult jumptoNext(int sonodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var sonod = _db.SOdetails.Where(a => a.SONodigit > sonodigit && a.Companyid == comapnyid).Select(a => a.SONo).FirstOrDefault();
                if (sonod != null)
                {
                    return Json(new { success = true, data = sonod });
                }
                else
                {
                    return Json(new { success = false });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        }
    
}
