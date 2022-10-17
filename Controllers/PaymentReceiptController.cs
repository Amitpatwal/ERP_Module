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
    [Route("api/PaymentVoucherController")]
    public class PaymentreceiptController : Controller
    {
        private readonly ApplicationDBContext _db;
        public PaymentreceiptController(ApplicationDBContext db)
        {
            _db = db;
        }

        [Route("FillBank")]
        public IActionResult FillBank()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Bank.Where(a => a.Companyid == comapnyid).ToList().OrderBy(a => a.BankName);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }

        [Route("VoucherNo")]
        public IActionResult VoucherNo(string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var VoucherNo = "";
                if (type == "PAYMENT")
                {
                    var vouchernodigit = _db.PaymentReceipt.Where(a => a.Companyid == comapnyid && a.VoucherType == "PAYMENT").Select(p => p.VoucherNoDigit).DefaultIfEmpty().Max();
                    vouchernodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "PaymentVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    VoucherNo = prefix + vouchernodigit;
                }
                else
                {
                    var vouchernodigit = _db.PaymentReceipt.Where(a => a.Companyid == comapnyid && a.VoucherType == "RECEIPT").Select(p => p.VoucherNoDigit).DefaultIfEmpty().Max();
                    vouchernodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "ReceiptVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    VoucherNo = prefix + vouchernodigit;
                }
                return Json(new { success = true, data = VoucherNo });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("PRTable")]
        public IActionResult PRTable(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Purchase.Where(a => a.Companyid == comapnyid && a.Date.Date >= fromdate.Date && a.Date.Date <= todate.Date).ToList().OrderByDescending(s => s.PRnodigit);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [HttpPost]
        [Route("AddVoucher")]
        public IActionResult AddVoucher(string Savetype, PaymentReceipt data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (Savetype == "Update")
                {
                    var Tpi = _db.PaymentReceipt.Where(x => x.VoucherNo == data.VoucherNo && x.Companyid == comapnyid && x.VoucherType == data.VoucherType).FirstOrDefault();
                    if (Tpi != null)
                    {
                        Tpi.VoucherDate = data.VoucherDate;
                        Tpi.BankName = data.BankName;
                        Tpi.BankId = data.BankId;
                        Tpi.CustomerID = data.CustomerID;
                        Tpi.CustomerName = data.CustomerName;
                        Tpi.Credit = data.Credit;
                        Tpi.Debit = data.Debit;
                        Tpi.SalePurchaseType = data.SalePurchaseType;
                        Tpi.Narration = data.Narration;
                        _db.SaveChanges();
                    }
                    return Json(new { success = true, data = data.VoucherNo, message = "Successfully Updated" });
                }
                else
                {
                    var VoucherNo = "";
                    var vouchernodigit = 0;
                    var prefixx = "";
                    vouchernodigit = _db.PaymentReceipt.Where(a => a.Companyid == comapnyid && a.VoucherType == data.VoucherType).Select(p => p.VoucherNoDigit).DefaultIfEmpty().Max();
                    if (data.VoucherType == "PAYMENT")
                    {
                        prefixx = _db.Prefix.Where(a => a.Type == "PaymentVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    }
                    else
                    {
                        prefixx = _db.Prefix.Where(a => a.Type == "ReceiptVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    }
                    VoucherNo = prefixx + vouchernodigit + 1;
                    data.VoucherNo = VoucherNo;
                    data.VoucherNoDigit = vouchernodigit + 1;
                    data.Companyid = comapnyid;
                    data.Userid = username;
                    _db.PaymentReceipt.Add(data);
                    _db.SaveChanges();

                    return Json(new { success = true, data = data.VoucherNo, message = "Successfully Saved" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("AddAgainst")]
        public IActionResult AddAgainst(string Savetype, PaymentReceiptReference data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (Savetype == "Update")
                {
                    var Tpi = _db.PaymentReceiptReference.Where(x => x.voucherno == data.voucherno && x.companyid == comapnyid && x.voucherType == data.voucherType && x.SrNo == data.SrNo).FirstOrDefault();
                    if (Tpi != null)
                    {
                        Tpi.reference = data.reference;
                        Tpi.Credit = data.Credit;
                        Tpi.Debit = data.Debit;
                        Tpi.type = data.type;
                        _db.SaveChanges();
                    }
                }
                else
                {
                    var srno = _db.PaymentReceiptReference.Where(a => a.companyid == comapnyid && a.voucherType == data.voucherType && a.voucherno == data.voucherno).Select(p => p.SrNo).DefaultIfEmpty().Max();
                    srno++;
                    data.SrNo = srno;
                    data.voucherno = data.voucherno;
                    data.companyid = comapnyid;
                    _db.PaymentReceiptReference.Add(data);
                    _db.SaveChanges();

                }
                if (data.type == "OPENINIG")
                {
                    var dt = _db.OpeningBalance.Where(a => a.invoiceno == data.reference && a.CompanyId == comapnyid).FirstOrDefault();
                    var debit = 0.0;
                    if (dt != null)
                    {
                        debit = dt.debit;
                    }
                    var credit = _db.PaymentReceiptReference.Where(a => a.reference == data.reference && a.companyid == comapnyid).Sum(a => a.Credit);
                    if (debit == credit)
                    {
                        dt.paymentStatus = true;
                        _db.SaveChanges();
                    }
                }
                else
                {
                    if (data.voucherType == "RECEIPT")
                    {
                        var dt = _db.Sale.Where(a => a.InvoiceNO == data.reference && a.Companyid == comapnyid).FirstOrDefault();
                        var debit = 0.0;
                        if (dt != null)
                        {
                            debit = dt.Debit;
                        }
                        var credit = _db.PaymentReceiptReference.Where(a => a.reference == data.reference && a.companyid == comapnyid).Sum(a => a.Credit);
                        if (debit == credit)
                        {
                            dt.paymentStatus = true;
                            _db.SaveChanges();
                        }
                    }
                    else
                    {
                        var dt = _db.Purchase.Where(a => a.PrNO == data.reference && a.Companyid == comapnyid).FirstOrDefault();
                        var credit = 0.0;
                        if (dt != null)
                        {
                            credit = dt.Credit;
                        }
                        var debit = _db.PaymentReceiptReference.Where(a => a.reference == data.reference && a.companyid == comapnyid).Sum(a => a.Debit);
                        if (debit == credit)
                        {
                            dt.paymentStatus = true;
                            _db.SaveChanges();
                        }
                    }
                }
                return Json(new { success = true, data = data.SrNo, message = "Successfully Updated" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("addAmountEntry")]
        public IActionResult addAmountEntry(string Savetype, PaymentReceiptReference data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (Savetype == "Update")
                {
                    var Tpi = _db.PaymentReceiptReference.Where(x => x.voucherno == data.voucherno && x.companyid == comapnyid && x.voucherType == data.voucherType && x.SrNo == data.SrNo).FirstOrDefault();
                    if (Tpi != null)
                    {
                        Tpi.Credit = data.Credit;
                        Tpi.Debit = data.Debit;
                        Tpi.type = data.type;
                        Tpi.companyid = data.companyid;
                        Tpi.reference = Tpi.reference;
                        _db.SaveChanges();
                    }
                    return Json(new { success = true, message = "Successfully Updated" });
                }
                else
                {
                    var srno = _db.PaymentReceiptReference.Where(a => a.type == data.type && a.voucherno == data.voucherno && a.companyid == comapnyid).Select(a => a.SrNo).Max();
                    srno = srno++;
                    data.companyid = comapnyid;
                    data.SrNo = srno;
                    _db.PaymentReceiptReference.Add(data);
                    _db.SaveChanges();

                    return Json(new { success = true, message = "Successfully Saved" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }

        }

        [Route("VouchersList")]
        public IActionResult VouchersList(DateTime fromdate, DateTime todate, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PaymentReceipt.Where(x => x.VoucherDate.Date >= fromdate.Date && x.VoucherDate <= todate.Date && x.VoucherType == type && x.Companyid == comapnyid).ToList().OrderBy(a => a.VoucherDate);
                return Json(new { success = true, data = data });
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
                var data = _db.PaymentReceipt.Where(a => a.VoucherNo == voucher && a.Companyid == comapnyid && a.VoucherType == type).FirstOrDefault();
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

        [Route("FillBillNumbers")]
        public IActionResult FillBillNumbers(string type, int ccode, DateTime date)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var opening = _db.OpeningBalance.Where(a => a.paymentStatus == false && a.customerid == ccode && a.CompanyId == comapnyid).ToList();
                if (type == "RECEIPT")
                {
                    var voucherno = _db.Sale.Where(a => a.Companyid == comapnyid && a.Ccode == ccode && a.paymentStatus == false && a.Date <= date.Date).ToList();
                    return Json(new { success = true, data = voucherno, data1 = opening });
                }
                else
                {
                    var voucherno = _db.Purchase.Where(a => a.Companyid == comapnyid && a.Ccode == ccode && a.paymentStatus == false).ToList();
                    return Json(new { success = true, data = voucherno, data1 = opening });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("GetAgainstTable")]
        public IActionResult GetAgainstTable(string voucherType, string voucherno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PaymentReceiptReference.Where(a => a.companyid == comapnyid && a.voucherno == voucherno && a.voucherType == voucherType).ToList();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }
        [HttpDelete]
        [Route("DeleteReference")]
        public IActionResult DeleteReference(int referenceno, string voucherType, string voucherno, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var salesInvoice = _db.PaymentReceiptReference.Where(u => u.Sr == referenceno && u.companyid == comapnyid).ToList();
                if (salesInvoice != null)
                {
                    if (type == "OPENINIG")
                    {
                        var data = _db.OpeningBalance.Where(a => a.CompanyId == comapnyid && a.invoiceno == voucherno).FirstOrDefault();
                        if (data != null)
                        {
                            data.paymentStatus = false;
                            _db.SaveChanges();
                        }
                    }
                    else
                    {
                        if (voucherType == "RECEIPT")
                        {
                            var data = _db.Sale.Where(a => a.Companyid == comapnyid && a.InvoiceNO == voucherno).FirstOrDefault();
                            if (data != null)
                            {
                                data.paymentStatus = false;
                                _db.SaveChanges();
                            }

                        }
                        else
                        {
                            var data = _db.Purchase.Where(a => a.Companyid == comapnyid && a.PurchaseNo == voucherno).FirstOrDefault();
                            if (data != null)
                            {
                                data.paymentStatus = false;
                                _db.SaveChanges();
                            }
                        }
                    }
                    _db.PaymentReceiptReference.RemoveRange(salesInvoice);
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

        [Route("getAmount")]
        public IActionResult getAmount(string voucherno, string voucherType)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PaymentReceiptReference.Where(a => a.voucherno == voucherno && a.voucherType == voucherType && a.companyid == comapnyid).GroupBy(a => true).Select(a => new { Debit = a.Sum(b => b.Debit), Credit = a.Sum(b => b.Credit) }).FirstOrDefault();
                var data1 = _db.PaymentReceipt.Where(a => a.VoucherNo == voucherno && a.VoucherType == voucherType && a.Companyid == comapnyid).GroupBy(a => true).Select(a => new { Debit = a.Sum(b => b.Debit), Credit = a.Sum(b => b.Credit) }).FirstOrDefault();
                var value = 0.0;
                if (voucherType == "PAYMENT")
                {
                    value = data1.Debit - data.Debit;
                }
                else
                {
                    value = data1.Credit - data.Credit;
                }
                return Json(new { success = true, data = value, data1 = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("getAmount1")]
        public IActionResult getAmount1(string voucherno, string voucherType, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];

                var value = 0.0;
                var Debit = 0.0;
                var Credit = 0.0;
                if (voucherType == "RECEIPT")
                {
                    Credit = _db.PaymentReceiptReference.Where(a => a.reference == voucherno && a.voucherType == voucherType && a.companyid == comapnyid).Sum(a => a.Credit);
                    if (type == "OPENINIG")
                    {
                        Debit = _db.OpeningBalance.Where(a => a.invoiceno == voucherno && a.CompanyId == comapnyid).Sum(a => a.debit);
                    }
                    else
                    {
                        Debit = _db.Sale.Where(a => a.InvoiceNO == voucherno && a.Companyid == comapnyid).Sum(a => a.Debit);
                    }

                    value = Debit - Credit;
                }
                else
                {
                    Debit = _db.PaymentReceiptReference.Where(a => a.reference == voucherno && a.voucherType == voucherType && a.companyid == comapnyid).Sum(a => a.Debit);
                    if (type == "OPENINIG")
                    {
                        Credit = _db.OpeningBalance.Where(a => a.invoiceno == voucherno && a.CompanyId == comapnyid).Sum(a => a.credit);
                    }
                    else
                    {
                        Credit = _db.Purchase.Where(a => a.PrNO == voucherno && a.Companyid == comapnyid).Sum(a => a.Credit);
                    }
                    value = Credit - Debit;
                }
                return Json(new { success = true, data = value });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("openingbalance")]
        public IActionResult openingbalance(DateTime voucherdate, string companyname, int ccode)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var value = 0.0;
                /*  var data = _db.PaymentReceiptReference.Where(a => a.reference == voucherno && a.voucherType == voucherType && a.companyid == comapnyid).GroupBy(a => true).Select(a => new { Debit = a.Sum(b => b.Debit), Credit = a.Sum(b => b.Credit) }).FirstOrDefault();

                  if (voucherType == "RECEIPT")
                  {
                      var data1 = _db.Sale.Where(a => a.InvoiceNO == voucherno && a.Companyid == comapnyid).GroupBy(a => true).Select(a => new { Debit = a.Sum(b => b.Debit), Credit = a.Sum(b => b.Credit) }).FirstOrDefault();
                      value = data1.Debit - data.Credit;
                  }
                  else
                  {
                      var data1 = _db.Purchase.Where(a => a.PrNO == voucherno && a.Companyid == comapnyid).GroupBy(a => true).Select(a => new { Debit = a.Sum(b => b.Debit), Credit = a.Sum(b => b.Credit) }).FirstOrDefault();
                      value = data1.Credit - data.Debit;
                  }*/
                return Json(new { success = true, data = value });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [HttpDelete]
        [Route("DeleteVouchers")]
        public IActionResult DeleteVouchers(string voucherno, string vouchertype)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PaymentReceipt.Where(a => a.VoucherNo == voucherno && a.VoucherType == vouchertype && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    _db.PaymentReceipt.RemoveRange(data);
                    _db.SaveChanges();
                }

                var dataa = _db.PaymentReceiptReference.Where(a => a.voucherno == voucherno && a.voucherType == vouchertype && a.companyid == comapnyid).ToList();
                foreach (var dt in dataa)
                {
                    var dttt = _db.OpeningBalance.Where(a => a.invoiceno == dt.reference && a.CompanyId == comapnyid).FirstOrDefault();
                    if (dttt != null)
                    {
                        dttt.paymentStatus = false;
                        _db.SaveChanges();
                    }
                    if (dt.voucherType == "PAYMENT")
                    {
                        var dtt = _db.Purchase.Where(a => a.PrNO == dt.reference && a.Companyid == comapnyid).FirstOrDefault();
                        if (dtt != null)
                        {
                            dtt.paymentStatus = false;
                            _db.SaveChanges();
                        }
                    }
                    else
                    {
                        var dtt = _db.Sale.Where(a => a.InvoiceNO == dt.reference && a.Companyid == comapnyid).FirstOrDefault();
                        if (dtt != null)
                        {
                            dtt.paymentStatus = false;
                            _db.SaveChanges();
                        }
                    }
                }
                if (dataa != null)
                {
                    _db.PaymentReceiptReference.RemoveRange(dataa);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

    }
}
