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
    [Route("api/Quotation")]
    public class QuotationController : Controller
    {
        public readonly ApplicationDBContext _db;
        public QuotationController(ApplicationDBContext db)
        {
            _db = db;

        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        [Route("Addtempcompanydetails")]
        public IActionResult Addtempcompanydetails(string type, TempSalesqDetails dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type == "Save")
                {
                    var Quotnodigit = _db.TempSalesqDetails.Where(a => a.Companyid == comapnyid).Select(p => p.Quotnodigit).DefaultIfEmpty().Max();
                    Quotnodigit++;

                    var id = "";
                    StringBuilder builder = new StringBuilder();
                    Enumerable
                       .Range(65, 26)
                        .Select(e => ((char)e).ToString())
                        .Concat(Enumerable.Range(97, 26).Select(e => ((char)e).ToString()))
                        .Concat(Enumerable.Range(0, 10).Select(e => e.ToString()))
                        .OrderBy(e => Guid.NewGuid())
                        .Take(11)
                        .ToList().ForEach(e => builder.Append(e));

                    id = builder.ToString();
                    dt.Quotnodigit = Quotnodigit;
                    dt.Unique = id;
                    dt.Userid = username;
                    dt.Companyid = comapnyid;
                    _db.TempSalesqDetails.Add(dt);
                    _db.SaveChanges();
                    return Json(new { success = true, data = Quotnodigit });
                }
                else
                {
                    var data = _db.TempSalesqDetails.Where(a => a.Quotnodigit == dt.Quotnodigit && a.Companyid == comapnyid).FirstOrDefault();
                    if (data != null)
                    {
                        data.Remarks = dt.Remarks;
                        data.Phone = dt.Phone;
                        data.Ccode = dt.Ccode;
                        data.Companyname = dt.Companyname;
                        data.Contactperson = dt.Contactperson;
                        data.DealingPerson = dt.DealingPerson;
                        data.Email = dt.Email;
                        data.Enqno = dt.Enqno;
                        data.Enqdate = dt.Enqdate;
                        data.Companyid = comapnyid;
                        _db.SaveChanges();

                    }
                    return Json(new { success = true, data = dt.Quotnodigit });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("Updatecompanydetails")]
        public IActionResult Updatecompanydetails(SalesqDetails details)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var ud = _db.SalesqDetails.Where(s => s.Quotno == details.Quotno && s.Companyid == comapnyid).FirstOrDefault();
                ud.Companyname = details.Companyname;
                ud.Ccode = details.Ccode;
                ud.Contactperson = details.Contactperson;
                ud.DealingPerson = details.DealingPerson;
                ud.Date = details.Date;
                ud.Email = details.Email;
                ud.Enqdate = details.Enqdate;
                ud.Enqno = details.Enqno;
                ud.Phone = details.Phone;
                ud.Remarks = details.Remarks;
                ud.Companyid = comapnyid;
                _db.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("checking")]
        public IActionResult Checking()
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempSalesqDetails.Where(x => x.Userid == username && x.Companyid == comapnyid);
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
        [Route("duplicate")]
        public IActionResult duplicate(string Quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                var salesdetail = _db.TempSalesqDetails.Where(a => a.Companyid == comapnyid && a.Userid == userid).ToList();
                foreach (var tmp in salesdetail)
                {

                    var tempquotationitem = _db.TempQuotationItem.Where(a => a.Companyid == comapnyid && a.Quotnodigit == tmp.Quotnodigit).ToList();
                    if (tempquotationitem != null)
                    {
                        _db.TempQuotationItem.RemoveRange(tempquotationitem);
                        _db.SaveChanges();
                    }
                }

                if (salesdetail != null)
                {
                    _db.TempSalesqDetails.RemoveRange(salesdetail);
                    _db.SaveChanges();
                }


                var data = _db.SalesqDetails.Where(a => a.Quotno == Quotno && a.Companyid == comapnyid).FirstOrDefault();
                var qtnodigit = _db.TempSalesqDetails.Where(a => a.Companyid == comapnyid).Select(p => p.Quotnodigit).DefaultIfEmpty().Max();
                qtnodigit++;
                var Tpi = new TempSalesqDetails();
                if (data != null)
                {
                    Tpi.Remarks = data.Remarks;
                    Tpi.Phone = data.Phone;
                    Tpi.Ccode = data.Ccode;
                    Tpi.Companyid = data.Companyid;
                    Tpi.Companyname = data.Companyname;
                    Tpi.Contactperson = data.Contactperson;
                    Tpi.DealingPerson = data.DealingPerson;
                    Tpi.Enqdate = data.Enqdate;
                    Tpi.Email = data.Email;
                    Tpi.Phone = data.Phone;
                    Tpi.Amount = data.Amount;
                }
                Tpi.Quotno = "";
                Tpi.Quotnodigit = qtnodigit;
                Tpi.Userid = Request.Cookies["username"];
                Tpi.Companyid = comapnyid;
                _db.TempSalesqDetails.Add(Tpi);
                _db.SaveChanges();

                var item = _db.QuotationItem.Where(a => a.Quotno == Quotno && a.Companyid == comapnyid).ToList();
                foreach (var tempitem in item)
                {
                    var Tpii = new TempQuotationItem();
                    Tpii.Quotnodigit = qtnodigit;
                    Tpii.Companyid = comapnyid;
                    Tpii.Itemid = tempitem.Itemid;
                    Tpii.Quotno = "";
                    Tpii.Pname = tempitem.Pname;
                    Tpii.Altpname = tempitem.Altpname;
                    Tpii.Psize = tempitem.Psize;
                    Tpii.Altpsize = tempitem.Altpsize;
                    Tpii.Pclass = tempitem.Pclass;
                    Tpii.Altpclass = tempitem.Altpclass;
                    Tpii.Pmake = tempitem.Pmake;
                    Tpii.Qty = tempitem.Qty;
                    Tpii.Qtyunit = tempitem.Qtyunit;
                    Tpii.Rate = tempitem.Rate;
                    Tpii.Rateunit = tempitem.Rateunit;
                    Tpii.Remarks = tempitem.Remarks;
                    Tpii.Discount = tempitem.Discount;
                    Tpii.Discountrate = tempitem.Discountrate;
                    Tpii.Hsncode = tempitem.Hsncode;
                    Tpii.Userid = Request.Cookies["username"];
                    Tpii.Amount = tempitem.Amount;
                    _db.Add(Tpii);
                    _db.SaveChanges();
                }

                return Json(new { success = true, data = qtnodigit });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
        [Route("viewquotation")]
        public IActionResult Viewquotation(string Quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SalesqDetails.Where(x => x.Quotno == Quotno && x.Companyid == comapnyid);
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
        [Route("getitem")]
        public IActionResult Getitem(int Quotnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                var data = _db.TempQuotationItem.Where(x => x.Quotnodigit == Quotnodigit && x.Companyid == comapnyid && x.Userid == userid).ToList().OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [Route("getitembyid")]
        public IActionResult Getitembyid(int tempqtno, int Itemid, string type, string Quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                QuotationItem1 qt = new QuotationItem1();
                if (type == "temp")
                {
                    var dt = _db.TempQuotationItem.Where(x => x.Quotnodigit == tempqtno && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Pnameid = _db.Productname.Where(x => x.productname == dt.Pname && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Psize = dt.Psize;
                    qt.Psizeid = _db.Productsize.Where(x => x.productsize == dt.Psize && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pclass = dt.Pclass;
                    qt.Pclassid = _db.Productclass.Where(x => x.productclass == dt.Pclass && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pmake = dt.Pmake;
                    qt.Qty = dt.Qty;
                    qt.Qtyunit = dt.Rateunit;
                    qt.unitid = _db.Productunit.Where(x => x.productunit == dt.Rateunit && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Rate = dt.Rate;
                    qt.Discount = dt.Discount;
                    qt.Discountrate = dt.Discountrate;
                    qt.Remarks = dt.Remarks;
                    qt.Amount = dt.Amount;
                    qt.unitType = dt.unitType;

                    return Json(new { success = true, data = qt });
                }
                else
                {
                    var dt = _db.QuotationItem.Where(x => x.Quotno == Quotno && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Pnameid = _db.Productname.Where(x => x.productname == dt.Pname && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Psize = dt.Psize;
                    qt.Psizeid = _db.Productsize.Where(x => x.productsize == dt.Psize && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pclass = dt.Pclass;
                    qt.Pclassid = _db.Productclass.Where(x => x.productclass == dt.Pclass && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pmake = dt.Pmake;
                    qt.Qty = dt.Qty;
                    qt.Qtyunit = dt.Rateunit;
                    qt.unitid = _db.Productunit.Where(x => x.productunit == dt.Rateunit && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Rate = dt.Rate;
                    qt.Discount = dt.Discount;
                    qt.Discountrate = dt.Discountrate;
                    qt.Remarks = dt.Remarks;
                    qt.Amount = dt.Amount;
                    qt.unitType = dt.unitType;
                    return Json(new { success = true, data = qt });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getQuotationitem")]
        public IActionResult GetQuotationitem(string Quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.QuotationItem.Where(x => x.Quotno == Quotno && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [HttpDelete]
        [Route("DeleteTempQuotation")]
        public IActionResult DeleteTempQuotation(int Quotnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                var tempquotationitem = _db.TempQuotationItem.Where(u => u.Quotnodigit == Quotnodigit && u.Companyid == comapnyid).ToList();
                if (tempquotationitem != null)
                {
                    _db.TempQuotationItem.RemoveRange(tempquotationitem);
                    _db.SaveChanges();
                }

                var ClientFromDB = _db.TempSalesqDetails.Where(u => u.Quotnodigit == Quotnodigit && u.Companyid == comapnyid).ToList();
                if (ClientFromDB != null)
                {
                    _db.TempSalesqDetails.RemoveRange(ClientFromDB);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("UpDateTempItem")]
        public JsonResult UpDateTempItem(int tempquotno, TempQuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var checker = _db.TempQuotationItem.Where(s => s.Quotnodigit == tempquotno && s.Itemid == itemmaster.Itemid && s.Companyid == comapnyid).FirstOrDefault();
                if (checker != null)
                {
                    checker.Pname = itemmaster.Pname;
                    checker.Altpname = itemmaster.Altpname;
                    checker.Altpsize = itemmaster.Altpsize;
                    checker.Altpclass = itemmaster.Altpclass;
                    checker.Itemid = itemmaster.Itemid;
                    checker.Rate = itemmaster.Rate;
                    checker.Amount = itemmaster.Amount;
                    checker.Remarks = itemmaster.Remarks;
                    checker.Altpname = itemmaster.Altpname;
                    checker.Rateunit = itemmaster.Rateunit;
                    checker.Psize = itemmaster.Psize;
                    checker.Pclass = itemmaster.Pclass;
                    checker.Pmake = itemmaster.Pmake;
                    checker.Discount = itemmaster.Discount;
                    checker.Discountrate = Math.Round(itemmaster.Discountrate, 2);
                    checker.Qty = itemmaster.Qty;
                    checker.Amount = Math.Round(itemmaster.Amount, 2);
                    checker.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                    checker.Qtyunit = itemmaster.Qtyunit;
                    checker.unitType = itemmaster.unitType;
                    checker.Companyid = comapnyid;
                    checker.Userid = Request.Cookies["username"];
                    _db.SaveChanges();

                    var amount = _db.TempQuotationItem.Where(u => u.Quotnodigit == tempquotno && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    var data = _db.TempSalesqDetails.Where(u => u.Quotnodigit == tempquotno && u.Companyid == comapnyid).FirstOrDefault();
                    data.Amount = amount;
                    _db.SaveChanges();
                    return Json(new { success = true, data = amount });
                }
                else
                {
                    return Json(new { success = false });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("UpDateItem")]
        public JsonResult UpDateItem(QuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var item = _db.QuotationItem.Where(s => s.Quotno == itemmaster.Quotno && s.Itemid == itemmaster.Itemid && s.Companyid == comapnyid).FirstOrDefault();
                item.Pname = itemmaster.Pname;
                item.Altpname = itemmaster.Altpname;
                item.Altpsize = itemmaster.Altpsize;
                item.Altpclass = itemmaster.Altpclass;
                item.Rate = itemmaster.Rate;
                item.Remarks = itemmaster.Remarks;
                item.Rateunit = itemmaster.Rateunit;
                item.Psize = itemmaster.Psize;
                item.Pclass = itemmaster.Pclass;
                item.Pmake = itemmaster.Pmake;
                item.Discount = itemmaster.Discount;
                item.Discountrate = itemmaster.Discountrate;
                item.Qty = itemmaster.Qty;
                item.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                item.Qtyunit = itemmaster.Qtyunit;
                item.unitType = itemmaster.unitType;
                item.Amount = itemmaster.Amount;
                item.Companyid = comapnyid;
                _db.SaveChanges();

                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "UPDATE ITEM";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "QUOTATION";
                log.VoucherId = itemmaster.Quotno;
                _db.Logs.Add(log);
                _db.SaveChanges();
                var amount = _db.QuotationItem.Where(u => u.Quotno == itemmaster.Quotno && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data = _db.SalesqDetails.Where(u => u.Quotno == itemmaster.Quotno && u.Companyid == comapnyid).FirstOrDefault();
                data.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("AddNewTempItem")]
        public JsonResult AddNewTempItem(int tempquotno, TempQuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.TempQuotationItem.Where(a => a.Quotnodigit == tempquotno && a.Companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                itemmaster.Itemid = itemid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Quotnodigit = tempquotno;
                itemmaster.Companyid = comapnyid;
                itemmaster.Userid = Request.Cookies["username"];
                _db.TempQuotationItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.TempQuotationItem.Where(u => u.Quotnodigit == tempquotno && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data = _db.TempSalesqDetails.Where(u => u.Quotnodigit == tempquotno && u.Companyid == comapnyid).FirstOrDefault();
                data.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("AddNewItem")]
        public JsonResult AddNewItem(QuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.QuotationItem.Where(a => a.Quotno == itemmaster.Quotno && a.Companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                itemmaster.Itemid = itemid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Companyid = comapnyid;
                _db.QuotationItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.QuotationItem.Where(u => u.Quotno == itemmaster.Quotno && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data = _db.SalesqDetails.Where(u => u.Quotno == itemmaster.Quotno && u.Companyid == comapnyid).FirstOrDefault();
                data.Amount = amount;
                _db.SaveChanges();

                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "ADD NEW ITEM";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "QUOTATION";
                log.VoucherId = itemmaster.Quotno;
                _db.Logs.Add(log);
                _db.SaveChanges();

                return Json(new { success = true, data = amount });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("InsertItem")]
        public JsonResult InsertItem(QuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.QuotationItem.Where(u => u.Quotno == itemmaster.Quotno && u.Companyid == comapnyid && u.Itemid >= itemmaster.Itemid).ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.QuotationItem.Where(k => k.Sr == itemm.Sr && k.Companyid == comapnyid && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }

                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Companyid = comapnyid;
                _db.QuotationItem.Add(itemmaster);
                _db.SaveChanges();

                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "INSERT NEW ITEM";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "QUOTATION";
                log.VoucherId = itemmaster.Quotno;
                _db.Logs.Add(log);
                _db.SaveChanges();

                var amount = _db.QuotationItem.Where(u => u.Quotno == itemmaster.Quotno && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.SalesqDetails.Where(u => u.Quotno == itemmaster.Quotno && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("InsertTempItem")]
        public JsonResult InsertTempItem(int tempquotno, TempQuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempQuotationItem.Where(u => u.Quotnodigit == tempquotno && u.Itemid >= itemmaster.Itemid && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.TempQuotationItem.Where(k => k.Sr == itemm.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }

                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Qtyunit = itemmaster.Qtyunit;
                itemmaster.Companyid = comapnyid;
                itemmaster.Userid = Request.Cookies["username"];
                itemmaster.Quotnodigit = tempquotno;
                _db.TempQuotationItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.TempQuotationItem.Where(u => u.Quotnodigit == tempquotno && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.TempSalesqDetails.Where(u => u.Quotnodigit == tempquotno && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteTempQuotationIT")]
        public IActionResult DeleteTempQuotationIT(int Quotnodigit, int itmno, string Quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var tempquotationitem = _db.TempQuotationItem.FirstOrDefault(u => u.Quotnodigit == Quotnodigit && u.Itemid == itmno && u.Companyid == comapnyid && u.Userid == username);
                _db.TempQuotationItem.Remove(tempquotationitem);
                _db.SaveChanges();

                var data = _db.TempQuotationItem.Where(u => u.Quotnodigit == Quotnodigit && u.Itemid > itmno && u.Companyid == comapnyid && u.Userid == username).ToList().OrderBy(k => k.Itemid);
                foreach (var item in data)
                {
                    var temp = _db.TempQuotationItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid && k.Userid == username).FirstOrDefault();
                    temp.Itemid = item.Itemid - 1;
                    _db.SaveChanges();
                }
                var amount = _db.TempQuotationItem.Where(u => u.Quotnodigit == Quotnodigit && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.TempSalesqDetails.Where(u => u.Quotnodigit == Quotnodigit && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteQuotationIT")]
        public IActionResult DeleteQuotationIT(int Quotnodigit, int itmno, string Quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var quotationitem = _db.QuotationItem.Where(u => u.Quotno == Quotno && u.Itemid == itmno && u.Companyid == comapnyid).FirstOrDefault();
                _db.QuotationItem.Remove(quotationitem);
                _db.SaveChanges();

                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "DELETE ITEM";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "QUOTATION";
                log.VoucherId = Quotno;
                _db.Logs.Add(log);
                _db.SaveChanges();
                var data = _db.QuotationItem.Where(u => u.Quotno == Quotno && u.Itemid > itmno && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                foreach (var item in data)
                {
                    var temp = _db.QuotationItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = item.Itemid - 1;
                    _db.SaveChanges();
                }
                var amount = _db.QuotationItem.Where(u => u.Quotno == Quotno && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.SalesqDetails.Where(u => u.Quotno == Quotno && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();

                return Json(new { success = true, data = amount });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("getnos")]
        public IActionResult Getnos(int Quotnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempQuotationItem.Where(x => x.Quotnodigit == Quotnodigit && x.Companyid == comapnyid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("PermanantSave")]
        public IActionResult PermanantSave(int tempquotno, SalesqDetails sd)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                var Quotnodigit = _db.SalesqDetails.Where(a => a.Companyid == comapnyid).Select(p => p.Quotnodigit).DefaultIfEmpty().Max();
                Quotnodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "quotationVocher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var quotno = prefix + Quotnodigit;

                sd.Quotno = quotno;
                sd.Quotnodigit = Quotnodigit;
                sd.Address = _db.CustomerData.Where(x => x.Customerid == sd.Ccode && x.Companyid == comapnyid).Select(u => u.Address).SingleOrDefault();
                sd.Userid = Request.Cookies["username"];
                sd.Companyid = comapnyid;
                _db.SalesqDetails.Add(sd);
                _db.SaveChanges();


                var data = _db.TempQuotationItem.Where(u => u.Quotnodigit == tempquotno && u.Companyid == comapnyid && u.Userid == userid).ToList().OrderBy(a => a.Itemid);
                foreach (var tempitem in data)
                {
                    QuotationItem item = new QuotationItem();
                    item.Quotnodigit = Quotnodigit;
                    item.Quotno = quotno;
                    item.Itemid = tempitem.Itemid;
                    item.Pname = tempitem.Pname;
                    item.Altpname = tempitem.Altpname;
                    item.Psize = tempitem.Psize;
                    item.Altpsize = tempitem.Altpsize;
                    item.Pclass = tempitem.Pclass;
                    item.Altpclass = tempitem.Altpclass;
                    item.Pmake = tempitem.Pmake;
                    item.Qtyunit = tempitem.Qtyunit;
                    item.Rate = tempitem.Rate;
                    item.Rateunit = tempitem.Rateunit;
                    item.Discount = tempitem.Discount;
                    item.Discountrate = tempitem.Discountrate;
                    item.Qty = tempitem.Qty;
                    item.Amount = tempitem.Amount;
                    item.Remarks = tempitem.Remarks;
                    item.Hsncode = tempitem.Hsncode;
                    item.Companyid = comapnyid;
                    item.unitType = tempitem.unitType;

                    _db.QuotationItem.Add(item);
                    _db.SaveChanges();
                }
                var amount = _db.QuotationItem.Where(u => u.Quotno == quotno && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.SalesqDetails.Where(u => u.Quotno == quotno && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();

                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "CREATE";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "QUOTATION";
                log.VoucherId = sd.Quotno;
                _db.Logs.Add(log);
                _db.SaveChanges();
                DeleteTempQuotation(tempquotno);
                return Json(new { success = true, data = sd.Quotno });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [HttpPost]
        [Route("PermanantUpdate")]
        public IActionResult PermanantUpdate(SalesqDetails sd)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var checker = _db.SalesqDetails.Where(x => x.Quotno == sd.Quotno && x.Companyid == comapnyid).FirstOrDefault();
                checker.Companyname = sd.Companyname;
                checker.Ccode = sd.Ccode;
                checker.Contactperson = sd.Contactperson;
                checker.DealingPerson = sd.DealingPerson;
                checker.Email = sd.Email;
                checker.Phone = sd.Phone;
                checker.Enqdate = sd.Enqdate;
                checker.Date = sd.Date;
                checker.Enqno = sd.Enqno;
                checker.Userid = username;
                checker.Address = _db.CustomerData.Where(x => x.Customerid == sd.Ccode && x.Companyid == comapnyid).Select(u => u.Address).SingleOrDefault();
                checker.Remarks = sd.Remarks;
                checker.Category = sd.Category;
                checker.Companyid = comapnyid;
                _db.SaveChanges();

                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "UPDATE";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "QUOTATION";
                log.VoucherId = sd.Quotno;
                _db.Logs.Add(log);
                _db.SaveChanges();
                return Json(new { success = true, data = sd.Quotno });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("SaveCondition")]
        public IActionResult SaveCondition(Conditionn cd)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Quotationcondition.Where(x => x.Quotno == cd.Quotno && x.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    _db.Quotationcondition.RemoveRange(_db.Quotationcondition.Where(x => x.Quotno == cd.Quotno && x.Companyid == comapnyid));
                    _db.SaveChanges();
                }
                for (var i = 0; i < 7; i++)
                {
                    Quotationcondition Dt = new Quotationcondition();
                    Dt.Quotno = cd.Quotno;
                    Dt.Id = cd.Conditionno[i];
                    Dt.Conditionno = i + 1;
                    Dt.Companyid = comapnyid;
                    Dt.Quotnodigit = _db.SalesqDetails.Where(x => x.Quotno == cd.Quotno && x.Companyid == comapnyid).Distinct().Select(u => u.Quotnodigit).FirstOrDefault();
                    _db.Quotationcondition.Add(Dt);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Added successfully" });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("Quotno")]
        public IActionResult Quotno()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var Quotnodigit = _db.SalesqDetails.Where(a => a.Companyid == comapnyid).Select(p => p.Quotnodigit).DefaultIfEmpty().Max();
                Quotnodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "quotationVocher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var quotno = prefix + Quotnodigit;
                return Json(new { success = true, data = quotno });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("TempQuotno")]
        public IActionResult TempQuotno()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var Quotnodigit = _db.TempSalesqDetails.Where(a => a.Companyid == comapnyid).Select(p => p.Quotnodigit).DefaultIfEmpty().Max();
                Quotnodigit++;
                return Json(new { success = true, data = Quotnodigit });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("printquotation")]
        public IActionResult Printquotation(string qtono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SalesqDetails.Where(x => x.Quotno == qtono && x.Companyid == comapnyid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("printcondition")]
        public IActionResult Printcondition(string qutono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                List<int> conditionNo = new List<int>();
                var i = 0;
                var data = _db.Quotationcondition.Where(x => x.Quotno == qutono && x.Companyid == comapnyid).ToList();
                foreach (var tempitem in data)
                {
                    conditionNo.Add(tempitem.Id);

                }
                List<Conditions> cond = new List<Conditions>();
                for (i = 0; i < 7; i++)
                {
                    var condi = conditionNo[i];
                    var data1 = _db.Conditions.Where(x => x.Conditionno == i + 1 && x.Id == condi && x.Companyid == comapnyid).FirstOrDefault();
                    if (data1 != null)
                    {
                        Conditions condition = new Conditions();
                        condition.Condition = data1.Condition;
                        condition.Id = data1.Id;
                        condition.Conditionno = data1.Conditionno;
                        cond.Add(condition);
                    }
                }
                return Json(new { success = true, data = cond });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("printquotationitem")]
        public IActionResult Printquotationitem(string Quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.QuotationItem.Where(x => x.Quotno == Quotno && x.Companyid == comapnyid).OrderBy(a => a.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("Addcondition")]
        public IActionResult Addcondition(string condition, int idd)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Conditions.Where(x => x.Condition == condition && x.Companyid == comapnyid).DefaultIfEmpty();
                if (data != null)
                {
                    var conditionno = _db.Conditions.Where(p => p.Conditionno == idd && p.Companyid == comapnyid).Select(p => p.Id).DefaultIfEmpty().Max();
                    conditionno++;
                    Conditions dt = new Conditions();
                    dt.Condition = condition;
                    dt.Id = conditionno;
                    dt.Companyid = comapnyid;
                    if (conditionno == 1)
                    {
                        dt.Defaultcondition = true;
                    }
                    else
                    {
                        dt.Defaultcondition = false;
                    }
                    dt.Conditionno = idd;
                    _db.Conditions.Add(dt);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Added successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Condition Already Exist" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("Getconditions")]
        public IActionResult Getconditions(int conditionno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Conditions.Where(x => x.Conditionno == conditionno && x.Companyid == comapnyid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("GetconditionbySR")]
        public IActionResult GetconditionbySR(int sr)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Conditions.Where(x => x.Sr == sr && x.Companyid == comapnyid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [HttpDelete]
        [Route("Deletecondition")]
        public IActionResult Deletecondition(int sr)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var condition = _db.Conditions.FirstOrDefault(u => u.Sr == sr && u.Companyid == comapnyid);
                var data = _db.Quotationcondition.FirstOrDefault(u => u.Id == condition.Id && u.Conditionno == condition.Conditionno && u.Companyid == comapnyid);
                if (data == null)
                {
                    _db.Conditions.Remove(condition);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Deleted successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Condition is in used" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("upDatecondition")]
        public IActionResult UpDatecondition(string condition, int sr)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var temp = _db.Conditions.Where(a => a.Sr == sr && a.Companyid == comapnyid).FirstOrDefault();
                temp.Condition = condition;
                temp.Companyid = comapnyid;
                _db.SaveChanges();
                return Json(new { success = true, message = "UpDate successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("defaultcondition")]
        public IActionResult Defaultcondition(int idd, int conditionno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var temp = _db.Conditions.Where(x => x.Conditionno == conditionno && x.Companyid == comapnyid).ToList();
                temp.ForEach(a => a.Defaultcondition = false);
                _db.SaveChanges();

                var temp1 = _db.Conditions.Where(x => x.Conditionno == conditionno && x.Id == idd && x.Companyid == comapnyid).FirstOrDefault();
                temp1.Defaultcondition = true;
                _db.SaveChanges();
                return Json(new { success = true, message = "UpDate successfully" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("GetQuotationTable")]
        public IActionResult GetQuotationTable(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];

                var data = _db.SalesqDetails.Where(a => a.Companyid == comapnyid && a.Date.Date >= fromdate.Date && a.Date.Date <= todate.Date).Select(a => new {
                    Quotno = a.Quotno, Date = a.Date, Companyname = a.Companyname, Contactperson = a.Contactperson, Amount = a.Amount,
                    Userid = a.Userid, Category = a.Category, DealingPerson = a.DealingPerson, pino = _db.PIdetails.Where(b => b.Quotno == a.Quotno && b.Companyid == comapnyid).Select(a => a.PINo).FirstOrDefault()
                }).ToList().OrderByDescending(s => s.Date);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }




        [Route("ALLQuotationTable")]
        public IActionResult ALLQuotationTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SalesqDetails.Where(a => a.Companyid == comapnyid).Select(a => new {
                    Quotno = a.Quotno, Date = a.Date, Companyname = a.Companyname, Contactperson = a.Contactperson, Amount = a.Amount,
                    Userid = a.Userid, Category = a.Category, DealingPerson = a.DealingPerson, pino = _db.PIdetails.Where(b => b.Quotno == a.Quotno && b.Companyid == comapnyid).Select(a => a.PINo).FirstOrDefault()
                }).ToList().OrderByDescending(s => s.Date);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }
        [Route("jumptoPrevious")]
        public IActionResult jumptoPrevious(int quotnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var quotnod = _db.SalesqDetails.Where(a => a.Quotnodigit < quotnodigit && a.Companyid == comapnyid).OrderByDescending(a => a.Quotnodigit).Select(a => a.Quotno).FirstOrDefault();

                if (quotnod != null)
                {
                    return Json(new { success = true, data = quotnod });
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
        public IActionResult jumptoNext(int quotnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var quotnod = _db.SalesqDetails.Where(a => a.Quotnodigit > quotnodigit && a.Companyid == comapnyid).Select(a => a.Quotno).FirstOrDefault();
                if (quotnod != null)
                {
                    return Json(new { success = true, data = quotnod });
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

        [Route("SearchQuotation")]
        public IActionResult SearchQuotation(string searchtype, string searchValue, DateTime frmdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (searchtype == "PARTY")
                {
                    var data = _db.SalesqDetails.Where(x => x.Companyname.Contains(searchValue) && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }
                else if (searchtype == "QUOTNO")
                {
                    var data = _db.SalesqDetails.Where(x => x.Quotno.Contains(searchValue) && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }
                else
                {
                    var data = _db.SalesqDetails.Where(x => x.Date.Date >= frmdate.Date && x.Date.Date <= todate.Date && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [HttpDelete]
        [Route("DeleteQuotation")]
        public IActionResult DeleteQuotation(string Quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var quotation = _db.SalesqDetails.Where(u => u.Quotno == Quotno && u.Companyid == comapnyid).ToList();
                if (quotation != null)
                {
                    _db.SalesqDetails.RemoveRange(quotation);
                    _db.SaveChanges();
                }

                var quotationItem = _db.QuotationItem.Where(u => u.Quotno == Quotno && u.Companyid == comapnyid).ToList();
                if (quotationItem != null)
                {
                    _db.QuotationItem.RemoveRange(quotationItem);
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
