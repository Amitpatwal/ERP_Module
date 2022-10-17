using Microsoft.AspNetCore.Mvc;
using SALES_ERP.Models;
using System;
using System.Linq;


namespace SALES_ERP.Controllers

{
    [Route("api/CreditDebitNote")]
    public class CreditDebitNoteController : Controller
    {
        public readonly ApplicationDBContext _db;
        public CreditDebitNoteController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("VoucherNo")]
        public IActionResult VoucherNo(string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var VoucherNo = "";
                if (type == "CREDIT")
                {
                    var vouchernodigit = _db.DebitCreditNote.Where(a => a.companyid == comapnyid && a.vouchertype == "CREDIT").Select(p => p.vouchernodigit).DefaultIfEmpty().Max();
                    vouchernodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "CreditVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    VoucherNo = prefix + vouchernodigit;
                }
                else
                {
                    var vouchernodigit = _db.DebitCreditNote.Where(a => a.companyid == comapnyid && a.vouchertype == "DEBIT").Select(p => p.vouchernodigit).DefaultIfEmpty().Max();
                    vouchernodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "DebitVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    VoucherNo = prefix + vouchernodigit;
                }
                return Json(new { success = true, data = VoucherNo });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("FillBillNumbers")]
        public IActionResult FillBillNumbers(string type, int ccode)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Sale")
                {
                    var voucherno = _db.Sale.Where(a => a.Companyid == comapnyid && a.Ccode == ccode).ToList();
                    return Json(new { success = true, data = voucherno });
                }
                else
                {
                    var voucherno = _db.Purchase.Where(a => a.Companyid == comapnyid && a.Ccode == ccode).ToList();
                    return Json(new { success = true, data = voucherno });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("ViewVoucher")]
        public IActionResult ViewVoucher(string voucher, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DebitCreditNote.Where(a => a.voucherno == voucher && a.companyid == comapnyid && a.vouchertype == type).FirstOrDefault();
                if (data != null)
                {
                    return Json(new { success = true, data = data });
                }
                else
                {
                    return Json(new { success = false });
                }


            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("VouchersList")]
        public IActionResult VouchersList(DateTime fromdate, DateTime todate, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DebitCreditNote.Where(x => x.voucherdate.Date >= fromdate.Date && x.voucherdate <= todate.Date && x.vouchertype == type && x.companyid == comapnyid).ToList().OrderBy(a => a.voucherdate);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [HttpPost]
        [Route("AddVoucher")]
        public IActionResult AddVoucher(string Savetype, DebitCreditNote data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (Savetype == "Update")
                {
                    var Tpi = _db.DebitCreditNote.Where(x => x.voucherno == data.voucherno && x.companyid == comapnyid && x.vouchertype == data.vouchertype).FirstOrDefault();
                    if (Tpi != null)
                    {
                        Tpi.voucherdate = data.voucherdate;
                        Tpi.companyid = comapnyid;
                        Tpi.ccode = data.ccode;
                        Tpi.companyname = data.companyname;
                        Tpi.Credit = data.Credit;
                        Tpi.Debit = data.Debit;
                        Tpi.Userid = username;
                        _db.SaveChanges();
                    }
                    return Json(new { success = true, data = data.voucherno, message = "Successfully Updated" });
                }
                else
                {
                    var VoucherNo = "";
                    var vouchernodigit = 0;
                    if (data.vouchertype == "CREDIT")
                    {
                        vouchernodigit = _db.DebitCreditNote.Where(a => a.companyid == comapnyid && a.vouchertype == "CREDIT").Select(p => p.vouchernodigit).DefaultIfEmpty().Max();
                        vouchernodigit++;
                        var prefixx = _db.Prefix.Where(a => a.Type == "CreditVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                        VoucherNo = prefixx + vouchernodigit;
                    }
                    else
                    {
                        vouchernodigit = _db.DebitCreditNote.Where(a => a.companyid == comapnyid && a.vouchertype == "DEBIT").Select(p => p.vouchernodigit).DefaultIfEmpty().Max();
                        vouchernodigit++;
                        var prefixx = _db.Prefix.Where(a => a.Type == "DebitVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                        VoucherNo = prefixx + vouchernodigit;
                    }

                    var prefix = _db.Prefix.Where(a => a.Type == "SalesVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    data.voucherno = VoucherNo;
                    data.vouchernodigit = vouchernodigit;
                    data.companyid = comapnyid;
                    data.Userid = username;
                    _db.DebitCreditNote.Add(data);
                    _db.SaveChanges();

                    return Json(new { success = true, data = data.voucherno, message = "Successfully Saved" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteVoucher")]
        public IActionResult DeleteVoucher(string voucherno, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var salesInvoice = _db.DebitCreditNote.Where(u => u.voucherno == voucherno && u.companyid == comapnyid && u.vouchertype == type).ToList();
                if (salesInvoice != null)
                {
                    _db.DebitCreditNote.RemoveRange(salesInvoice);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Deleted successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "data not found" });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }




    }
}
