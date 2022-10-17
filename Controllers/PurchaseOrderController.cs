using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SALES_ERP.Models;
using System.Text;

namespace SALES_ERP.Controllers
{

    [Route("api/PO")]
    public class PurchaseOrderController : Controller
    {

        public readonly ApplicationDBContext _db;
        public PurchaseOrderController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("GetPOTable")]
        public IActionResult GetPOTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PODetials.Where(a => a.Companyid == comapnyid).ToList().OrderByDescending(s => s.Date);
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }



        [Route("DateWiseFilter")]
        public IActionResult DateWiseFilter(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PODetials.Where(a => a.Companyid == comapnyid && a.Date.Date >= fromdate.Date && a.Date.Date <= todate.Date).ToList().OrderByDescending(s => s.Date);
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("PONO")]
        public IActionResult PONO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var PONodigit = _db.PODetials.Where(a => a.Companyid == comapnyid).Select(p => p.PoNodigit).DefaultIfEmpty().Max();
                PONodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "purchaseOrderVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var quotno = prefix + PONodigit;

                var PONodigit1 = _db.TempPODetials.Where(a => a.Companyid == comapnyid).Select(p => p.PoNodigit).DefaultIfEmpty().Max();
                PONodigit1++;

                return Json(new { success = true, data = quotno, data1 = PONodigit1 });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("TempPONO")]
        public IActionResult TempPONO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var PONodigit1 = _db.TempPODetials.Where(a => a.Companyid == comapnyid).Select(p => p.PoNodigit).DefaultIfEmpty().Max();
                PONodigit1++;
                var PONodigit = _db.PODetials.Where(a => a.Companyid == comapnyid).Select(p => p.PoNodigit).DefaultIfEmpty().Max();
                PONodigit++;
                return Json(new { success = true, data = PONodigit1, data1 = PONodigit });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("AddNewItem")]
        public JsonResult AddNewItem(PurchaseOrderItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.PurchaseOrderItem.Where(a => a.PoNo == itemmaster.PoNo).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;

                itemmaster.Itemid = itemid;
                itemmaster.Companyid = comapnyid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                _db.PurchaseOrderItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.PurchaseOrderItem.Where(u => u.PoNo == itemmaster.PoNo && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data = _db.PODetials.Where(u => u.PoNo == itemmaster.PoNo && u.Companyid == comapnyid).FirstOrDefault();
                data.Amount = amount;
                _db.SaveChanges();

                return Json(new { success = true, data = amount });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("AddNewTempItem")]
        public JsonResult AddNewTempItem(TempPurchaseOrderItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.TempPurchaseOrderItem.Where(a => a.PoNodigit == itemmaster.PoNodigit && a.Companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                itemmaster.Itemid = itemid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass && x.Companyid == comapnyid).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Qtyunit = itemmaster.Qtyunit;
                itemmaster.Companyid = comapnyid;
                _db.TempPurchaseOrderItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == itemmaster.PoNodigit && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data = _db.TempPODetials.Where(u => u.PoNodigit == itemmaster.PoNodigit && u.Companyid == comapnyid).FirstOrDefault();
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
        [Route("InsertTempItem")]
        public JsonResult InsertTempItem(TempPurchaseOrderItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == itemmaster.PoNodigit && u.Companyid == comapnyid && u.Itemid >= itemmaster.Itemid).ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.TempPurchaseOrderItem.Where(k => k.Sr == itemm.Sr).FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }
                itemmaster.Companyid = comapnyid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                _db.TempPurchaseOrderItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == itemmaster.PoNodigit && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.TempPODetials.Where(u => u.PoNodigit == itemmaster.PoNodigit && u.Companyid == comapnyid).FirstOrDefault();
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
        [Route("InsertItem")]
        public JsonResult InsertItem(PurchaseOrderItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PurchaseOrderItem.Where(u => u.PoNo == itemmaster.PoNo && u.Companyid == comapnyid && u.Itemid >= itemmaster.Itemid).ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.PurchaseOrderItem.Where(k => k.Sr == itemm.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }
                itemmaster.Companyid = comapnyid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                _db.PurchaseOrderItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.PurchaseOrderItem.Where(u => u.PoNo == itemmaster.PoNo && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.PODetials.Where(u => u.PoNo == itemmaster.PoNo).FirstOrDefault();
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
        [Route("UpDateTempItem")]
        public JsonResult UpDateTempItem(TempPurchaseOrderItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var item = _db.TempPurchaseOrderItem.Where(s => s.PoNodigit == itemmaster.PoNodigit && s.Companyid == comapnyid && s.Itemid == itemmaster.Itemid).FirstOrDefault();
                item.Pname = itemmaster.Pname;
                item.Altpname = itemmaster.Altpname;
                item.Altpsize = itemmaster.Altpsize;
                item.Altpclass = itemmaster.Altpclass;
                item.Itemid = itemmaster.Itemid;
                item.Rate = itemmaster.Rate;
                item.Amount = itemmaster.Amount;
                item.Remarks = itemmaster.Remarks;
                item.Rateunit = itemmaster.Rateunit;
                item.PoNo = itemmaster.PoNo;
                item.Companyid = comapnyid;
                item.PoNodigit = itemmaster.PoNodigit;
                item.Psize = itemmaster.Psize;
                item.Pclass = itemmaster.Pclass;
                item.Pmake = itemmaster.Pmake;
                item.Discount = itemmaster.Discount;
                item.Discountrate = itemmaster.Discountrate;
                item.Qty = itemmaster.Qty;
                item.Amount = itemmaster.Amount;
                item.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                item.Qtyunit = itemmaster.Qtyunit;
                _db.SaveChanges();

                var amount = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == itemmaster.PoNodigit && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.TempPODetials.Where(u => u.PoNodigit == itemmaster.PoNodigit && u.Companyid == comapnyid).FirstOrDefault();
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
        [Route("UpDateItem")]
        public JsonResult UpDateItem(PurchaseOrderItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var checker = _db.PurchaseOrderItem.Where(s => s.PoNo == itemmaster.PoNo && s.Companyid == comapnyid && s.Itemid == itemmaster.Itemid).FirstOrDefault();
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
                checker.PoNodigit = itemmaster.PoNodigit;
                checker.Psize = itemmaster.Psize;
                checker.Pclass = itemmaster.Pclass;
                checker.Pmake = itemmaster.Pmake;
                checker.Discount = itemmaster.Discount;
                checker.Discountrate = Math.Round(itemmaster.Discountrate, 2);
                checker.Qty = itemmaster.Qty;
                checker.Amount = Math.Round(itemmaster.Amount, 2);
                checker.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                checker.Qtyunit = itemmaster.Qtyunit;
                checker.Companyid = comapnyid;
                _db.SaveChanges();


                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "Update ITEM";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "PURCHASE_ORDER";
                log.VoucherId = checker.PoNo;
                _db.Logs.Add(log);
                _db.SaveChanges();


                var amount = _db.PurchaseOrderItem.Where(u => u.PoNo == itemmaster.PoNo && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.PODetials.Where(u => u.PoNo == itemmaster.PoNo && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("getitembyid")]
        public IActionResult Getitembyid(int Itemid, string type, int tempPono, string PONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                QuotationItem1 qt = new QuotationItem1();
                if (type == "temp")
                {

                    var dt = _db.TempPurchaseOrderItem.Where(x => x.PoNodigit == tempPono && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
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
                    qt.Companyid = comapnyid;


                    return Json(new { success = true, data = qt });
                }
                else
                {
                    var dt = _db.PurchaseOrderItem.Where(x => x.PoNo == PONO && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
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
                    qt.Companyid = comapnyid;
                    qt.Discountrate = dt.Discountrate;
                    qt.Remarks = dt.Remarks;
                    qt.Amount = dt.Amount;
                    return Json(new { success = true, data = qt });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("viewPurchaseOrder")]
        public IActionResult viewPurchaseOrder(string PONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PODetials.Where(x => x.PoNo == PONO && x.Companyid == comapnyid).FirstOrDefault();
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

        [Route("viewTempPurchaseOrder")]
        public IActionResult viewTempPurchaseOrder(int ponodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempPODetials.Where(x => x.PoNodigit == ponodigit && x.Companyid == comapnyid).FirstOrDefault();
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


        [Route("checking")]
        public IActionResult Checking()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var data = _db.TempPODetials.Where(x => x.Userid == username && x.Companyid == comapnyid).FirstOrDefault();
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
        public IActionResult Getitem(int PoNodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempPurchaseOrderItem.Where(x => x.PoNodigit == PoNodigit && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getitemByPONO")]
        public IActionResult getitemByPONO(string PONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PurchaseOrderItem.Where(x => x.PoNo == PONO && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("addtemppodetails")]
        public IActionResult addtemppodetails(string type, TempPODetials details)
        {
            try

            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];

                if (type == "Save")
                {
                    var PONodigit = _db.TempPODetials.Where(a => a.Companyid == comapnyid).Select(p => p.PoNodigit).DefaultIfEmpty().Max();
                    PONodigit++;
                    details.PoNodigit = PONodigit;
                    details.Companyid = comapnyid;
                    details.Userid = username;
                    _db.TempPODetials.Add(details);

                    _db.SaveChanges();
                    return Json(new { success = true, data = PONodigit });
                }
                else
                {
                    var data = _db.TempPODetials.Where(x => x.PoNodigit == details.PoNodigit && x.Companyid == comapnyid).FirstOrDefault();
                    data.SupplierCompanyname = details.SupplierCompanyname;
                    data.SupplierCCode = details.SupplierCCode;
                    data.SupplierGST = details.SupplierGST;
                    data.SupplierContactperson = details.SupplierContactperson;
                    data.SupplierPhone = details.SupplierPhone;
                    data.SupplierEmail = details.SupplierEmail;
                    data.SupplierAddress = details.SupplierAddress;
                    data.SupplierState = details.SupplierState;
                    data.SupplierStateCode = details.SupplierStateCode;
                    data.SupplierCity = details.SupplierCity;
                    data.SupplierQuotationNo = details.SupplierQuotationNo;
                    data.SupplierQuotationDate = details.SupplierQuotationDate;

                    data.RecipientCompanyname = details.RecipientCompanyname;
                    data.RecipientCCode = details.RecipientCCode;
                    data.RecipientGST = details.RecipientGST;
                    data.RecipientContactPerson = details.RecipientContactPerson;
                    data.RecipientMobile = details.RecipientMobile;
                    data.RecipientEmail = details.RecipientEmail;
                    data.RecipientState = details.RecipientState;
                    data.RecipientStateCode = details.RecipientStateCode;
                    data.RecipientCity = details.RecipientCity;
                    data.RecipientAddress = details.RecipientAddress;
                    data.RecipientOrderNo = details.RecipientOrderNo;
                    data.RecipientOrderDate = details.RecipientOrderDate;

                    data.ConsignCompanyname = details.ConsignCompanyname;
                    data.ConsignCCode = details.ConsignCCode;
                    data.ConsignGST = details.ConsignGST;
                    data.ConsignContactPerson = details.ConsignContactPerson;
                    data.ConsignMobile = details.ConsignMobile;
                    data.ConsignEmail = details.ConsignCompanyname;
                    data.ConsignState = details.ConsignState;
                    data.ConsignStateCode = details.ConsignStateCode;
                    data.ConsignCity = details.ConsignCity;
                    data.ConsignAddress = details.ConsignAddress;
                    data.ConsignOrderNo = details.ConsignOrderNo;
                    data.ConsignOrderDate = details.ConsignOrderDate;
                    data.Userid = username;
                    data.Companyid = comapnyid;
                    data.Amount = 0;
                    _db.SaveChanges();

                    return Json(new { success = true });
                }



            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("Updatecompanydetails")]
        public IActionResult Updatecompanydetails(PODetials details)
        {
            try

            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var checker = _db.PODetials.Where(s => s.PoNo == details.PoNo && s.Companyid == comapnyid).FirstOrDefault();

                checker.SupplierCompanyname = details.SupplierCompanyname;
                checker.SupplierCCode = details.SupplierCCode;
                checker.SupplierGST = details.SupplierGST;
                checker.SupplierContactperson = details.SupplierContactperson;
                checker.SupplierPhone = details.SupplierPhone;
                checker.SupplierEmail = details.SupplierEmail;
                checker.SupplierQuotationNo = details.SupplierQuotationNo;
                checker.SupplierQuotationDate = details.SupplierQuotationDate;
                checker.Companyid = comapnyid;
                checker.SupplierAddress = details.SupplierAddress;
                checker.RecipientCompanyname = details.RecipientCompanyname;
                checker.RecipientCCode = details.RecipientCCode;
                checker.RecipientGST = details.RecipientGST;
                checker.RecipientContactPerson = details.RecipientContactPerson;
                checker.RecipientMobile = details.RecipientMobile;
                checker.RecipientEmail = details.RecipientEmail;
                checker.RecipientOrderNo = details.RecipientOrderNo;
                checker.RecipientOrderDate = details.RecipientOrderDate;
                checker.RecipientState = details.RecipientState;
                checker.RecipientStateCode = details.RecipientStateCode;
                checker.RecipientAddress = details.RecipientAddress;

                checker.ConsignCompanyname = details.ConsignCompanyname;
                checker.ConsignCCode = details.ConsignCCode;
                checker.ConsignGST = details.ConsignGST;
                checker.ConsignContactPerson = details.ConsignContactPerson;
                checker.ConsignMobile = details.ConsignMobile;
                checker.ConsignEmail = details.ConsignCompanyname;
                checker.ConsignOrderNo = details.ConsignOrderNo;
                checker.ConsignOrderDate = details.ConsignOrderDate;
                checker.ConsignState = details.ConsignState;
                checker.ConsignStateCode = details.ConsignStateCode;
                checker.ConsignAddress = details.ConsignAddress;

                checker.Amount = 0;
                _db.SaveChanges();
                return Json(new { success = true });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("PermanantSave")]
        public IActionResult PermanantSave(string type, PODetials sd)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type != "Save")
                {
                    var checker = _db.PODetials.Where(x => x.PoNo == sd.PoNo && x.Companyid == comapnyid).FirstOrDefault();
                    checker.SupplierCompanyname = sd.SupplierCompanyname;
                    checker.SupplierCCode = sd.SupplierCCode;
                    checker.SupplierGST = sd.SupplierGST;
                    checker.SupplierContactperson = sd.SupplierContactperson;
                    checker.SupplierPhone = sd.SupplierPhone;
                    checker.SupplierEmail = sd.SupplierEmail;
                    checker.SupplierQuotationNo = sd.SupplierQuotationNo;
                    checker.SupplierQuotationDate = sd.SupplierQuotationDate;
                    checker.Companyid = comapnyid;

                    checker.SupplierAddress = sd.SupplierAddress;
                    checker.RecipientCompanyname = sd.RecipientCompanyname;
                    checker.RecipientCCode = sd.RecipientCCode;
                    checker.RecipientGST = sd.RecipientGST;
                    checker.RecipientContactPerson = sd.RecipientContactPerson;
                    checker.RecipientMobile = sd.RecipientMobile;
                    checker.RecipientEmail = sd.RecipientEmail;
                    checker.RecipientOrderNo = sd.RecipientOrderNo;
                    checker.RecipientOrderDate = sd.RecipientOrderDate;
                    checker.RecipientState = sd.RecipientState;
                    checker.RecipientStateCode = sd.RecipientStateCode;
                    checker.RecipientAddress = sd.RecipientAddress;

                    checker.ConsignCompanyname = sd.ConsignCompanyname;
                    checker.ConsignCCode = sd.ConsignCCode;
                    checker.ConsignGST = sd.ConsignGST;
                    checker.ConsignContactPerson = sd.ConsignContactPerson;
                    checker.ConsignMobile = sd.ConsignMobile;
                    checker.ConsignEmail = sd.ConsignEmail;
                    checker.ConsignOrderNo = sd.ConsignOrderNo;
                    checker.ConsignOrderDate = sd.ConsignOrderDate;
                    checker.ConsignState = sd.ConsignState;
                    checker.ConsignStateCode = sd.ConsignStateCode;
                    checker.ConsignAddress = sd.ConsignAddress;

                    checker.Cash = sd.Cash;
                    checker.GST = sd.GST;
                    checker.Delivery = sd.Delivery;
                    checker.MTC = sd.MTC;
                    checker.FreightCharge = sd.FreightCharge;
                    checker.NameofTransport = sd.NameofTransport;
                    checker.PaymentTerms = sd.PaymentTerms;
                    checker.Date = sd.Date;
                    checker.PriceBasis = sd.PriceBasis;
                    checker.Remarks = sd.Remarks;
                    checker.Userid = username;
                    checker.Remarks = sd.Remarks;
                    checker.Amount = _db.PurchaseOrderItem.Where(u => u.PoNo == sd.PoNo && u.Companyid == comapnyid).Select(u => u.Amount).Sum();

                    _db.SaveChanges();



                    DateTime now = DateTime.Now;
                    var log = new Logs();
                    log.companyid = comapnyid;
                    log.date = now;
                    log.Description = "SAVE";
                    log.UsreName = Request.Cookies["username"];
                    log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                    log.VoucherType = "PURCHASE_ORDER";
                    log.VoucherId = sd.PoNo;
                    _db.Logs.Add(log);
                    _db.SaveChanges();


                    return Json(new { success = true, data = sd.PoNo });
                }
                else
                {
                    var tempponodigit = sd.PoNodigit;
                    var ponodigit = _db.PODetials.Where(a => a.Companyid == comapnyid).Select(p => p.PoNodigit).DefaultIfEmpty().Max();
                    ponodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "purchaseOrderVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    var quotno = prefix + ponodigit;
                    var data = _db.TempPODetials.Where(a => a.PoNodigit == tempponodigit).FirstOrDefault();
                    sd.PoNo = quotno;
                    sd.pino = data.pino;
                    sd.PoNodigit = ponodigit;
                    sd.Companyid = comapnyid;
                    sd.Sono = data.Sono;
                    sd.Userid = username;
                    sd.Amount = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == tempponodigit && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    _db.PODetials.Add(sd);
                    _db.SaveChanges();
                    var k = 1;
                    var data1 = _db.TempPurchaseOrderItem.ToList().Where(u => u.PoNodigit == tempponodigit && u.Companyid == comapnyid);
                    foreach (var tempitem in data1)
                    {
                        PurchaseOrderItem item = new PurchaseOrderItem();
                        item.PoNodigit = ponodigit;
                        item.Companyid = comapnyid;
                        item.PoNo = quotno;
                        item.Itemid = k;
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
                        _db.PurchaseOrderItem.Add(item);
                        _db.SaveChanges();
                        k++;
                    }

                    DateTime now = DateTime.Now;
                    var log = new Logs();
                    log.companyid = comapnyid;
                    log.date = now;
                    log.Description = "UPDATE";
                    log.UsreName = Request.Cookies["username"];
                    log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                    log.VoucherType = "PURCHASE_ORDER";
                    log.VoucherId = sd.PoNo;
                    _db.Logs.Add(log);
                    _db.SaveChanges();


                    DeleteTempPO(tempponodigit);

                    return Json(new { success = true, data = sd.PoNo });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteTempPO")]
        public IActionResult DeleteTempPO(int ponodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var tempquotationitem = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == ponodigit && u.Companyid == comapnyid).ToList();
                if (tempquotationitem != null)
                {
                    _db.TempPurchaseOrderItem.RemoveRange(tempquotationitem);
                    _db.SaveChanges();
                }

                var ClientFromDB = _db.TempPODetials.FirstOrDefault(u => u.PoNodigit == ponodigit && u.Companyid == comapnyid);
                if (ClientFromDB != null)
                {
                    _db.TempPODetials.Remove(ClientFromDB);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteTempPOIT")]
        public IActionResult DeleteTempPOIT(int TEMPPONO, int itmno, string PONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var quotationitem = _db.PurchaseOrderItem.FirstOrDefault(u => u.PoNo == PONO && u.Itemid == itmno && u.Companyid == comapnyid);
                if (quotationitem != null)
                {
                    _db.PurchaseOrderItem.Remove(quotationitem);
                    _db.SaveChanges();

                    var data = _db.PurchaseOrderItem.Where(u => u.PoNo == PONO && u.Itemid > itmno && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                    foreach (var item in data)
                    {
                        var temp = _db.PurchaseOrderItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                        temp.Itemid = item.Itemid - 1;
                        _db.SaveChanges();
                    }
                    var amount = _db.PurchaseOrderItem.Where(u => u.PoNo == PONO && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    var data1 = _db.PODetials.Where(u => u.PoNo == PONO && u.Companyid == comapnyid).FirstOrDefault();
                    data1.Amount = amount;
                    _db.SaveChanges();
                    return Json(new { success = true, data = amount });


                }
                var tempquotationitem = _db.TempPurchaseOrderItem.FirstOrDefault(u => u.PoNodigit == TEMPPONO && u.Companyid == comapnyid && u.Itemid == itmno);
                if (tempquotationitem != null)
                {
                    _db.TempPurchaseOrderItem.Remove(tempquotationitem);
                    _db.SaveChanges();

                    var data = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == TEMPPONO && u.Companyid == comapnyid && u.Itemid > itmno).ToList().OrderBy(k => k.Itemid);
                    foreach (var item in data)
                    {
                        var temp = _db.TempPurchaseOrderItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                        temp.Itemid = item.Itemid - 1;
                        _db.SaveChanges();
                    }
                    var amount = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == TEMPPONO && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    var data1 = _db.TempPODetials.Where(u => u.PoNodigit == TEMPPONO && u.Companyid == comapnyid).FirstOrDefault();
                    data1.Amount = amount;
                    _db.SaveChanges();
                    return Json(new { success = true, data = amount });
                }

                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("PrintPO")]
        public IActionResult PrintPO(string pono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PODetials.Where(x => x.PoNo == pono && x.Companyid == comapnyid).FirstOrDefault();

                panno pn = new panno();
                pn.SupplierPan = _db.CustomerData.Where(a => a.Customerid == data.SupplierCCode && a.Companyid == comapnyid).Select(a => a.PAN).FirstOrDefault();
                pn.RecieptPan = _db.CustomerData.Where(a => a.Customerid == data.RecipientCCode && a.Companyid == comapnyid).Select(a => a.PAN).FirstOrDefault();
                pn.ConsignPan = _db.CustomerData.Where(a => a.Customerid == data.ConsignCCode && a.Companyid == comapnyid).Select(a => a.PAN).FirstOrDefault();


                if (data != null) { return Json(new { success = true, data = data, pan = pn }); }
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



        [Route("PrintItemPO")]
        public IActionResult PrintItemPO(string pono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PurchaseOrderItem.Where(x => x.PoNo == pono && x.Companyid == comapnyid).OrderBy(a => a.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("Check")]
        public IActionResult Check(string sono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PODetials.Where(a => a.Sono == sono && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    return Json(new { status = true, data = data.PoNo, datafrom = "permanant" });
                }
                else
                {
                    var username = Request.Cookies["username"];
                    var check = _db.TempPODetials.Where(a => a.Userid == username && a.Companyid == comapnyid).FirstOrDefault();
                    if (check != null)
                    {
                        return Json(new { status = true, data = check, datafrom = "temp" });
                    }
                    else
                    {
                        return Json(new { status = false });
                    }
                }
            }
            catch (Exception ex)
            {
                return (Json(new { status = false, message = ex }));
            }
        }
        [Route("CheckPI")]
        public IActionResult CheckPI(string pino)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PODetials.Where(a => a.pino == pino && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    return Json(new { status = true, data = data.PoNo, datafrom = "permanant" });
                }
                else
                {
                    var username = Request.Cookies["username"];
                    var check = _db.TempPODetials.Where(a => a.Userid == username && a.Companyid == comapnyid).FirstOrDefault();
                    if (check != null)
                    {
                        return Json(new { status = true, data = check, datafrom = "temp" });
                    }
                    else
                    {
                        return Json(new { status = false });
                    }
                }
            }
            catch (Exception ex)
            {
                return (Json(new { status = false, message = ex }));
            }
        }
        [Route("ConvertFromSo")]
        public IActionResult ConvertFromSo(string sono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var PONodigit = _db.TempPODetials.Where(a => a.Companyid == comapnyid).Select(p => p.PoNodigit).DefaultIfEmpty().Max();
                PONodigit++;
                var Tpii = new TempPODetials();
                Tpii.Userid = Request.Cookies["username"];
                Tpii.Sono = sono;
                Tpii.PoNodigit = PONodigit;
                Tpii.Companyid = comapnyid;
                _db.TempPODetials.Add(Tpii);
                _db.SaveChanges();


                var item = _db.SOItem.Where(a => a.Sono == sono && a.Companyid == comapnyid).ToList();
                if (item != null)
                {
                    foreach (var tempitem in item)
                    {
                        var Tpi = new TempPurchaseOrderItem();
                        Tpi.PoNodigit = PONodigit;
                        Tpi.Companyid = comapnyid;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Altpname = tempitem.Altpname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Altpsize = tempitem.Altpsize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Altpclass = tempitem.Altpclass;
                        Tpi.Pmake = tempitem.Pmake;
                        Tpi.Qty = tempitem.Qty;
                        Tpi.Qtyunit = tempitem.Qtyunit;
                        Tpi.Rate = 0.0;
                        Tpi.Rateunit = tempitem.Rateunit;
                        Tpi.Remarks = tempitem.Remarks;
                        Tpi.Discount = 0.0;
                        Tpi.Discountrate = 0.0;
                        Tpi.Hsncode = tempitem.Hsncode;
                        Tpi.Amount = 0.0;
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }
                }
                return Json(new { success = true, data = PONodigit });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("ConvertFromPI")]
        public IActionResult ConvertFromPI(string pino)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var PONodigit = _db.TempPODetials.Where(a => a.Companyid == comapnyid).Select(p => p.PoNodigit).DefaultIfEmpty().Max();
                PONodigit++;
                var Tpii = new TempPODetials();
                Tpii.Userid = Request.Cookies["username"];
                Tpii.pino = pino;
                Tpii.PoNodigit = PONodigit;
                Tpii.Companyid = comapnyid;
                _db.TempPODetials.Add(Tpii);
                _db.SaveChanges();


                var item = _db.PIQuotationItem.Where(a => a.Pino == pino && a.Companyid == comapnyid).ToList();
                if (item != null)
                {
                    foreach (var tempitem in item)
                    {
                        var Tpi = new TempPurchaseOrderItem();
                        Tpi.PoNodigit = PONodigit;
                        Tpi.Companyid = comapnyid;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Altpname = tempitem.Altpname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Altpsize = tempitem.Altpsize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Altpclass = tempitem.Altpclass;
                        Tpi.Pmake = tempitem.Pmake;
                        Tpi.Qty = tempitem.Qty;
                        Tpi.Qtyunit = tempitem.Qtyunit;
                        Tpi.Rate = 0.0;
                        Tpi.Rateunit = tempitem.Rateunit;
                        Tpi.Remarks = tempitem.Remarks;
                        Tpi.Discount = 0.0;
                        Tpi.Discountrate = 0.0;
                        Tpi.Hsncode = tempitem.Hsncode;
                        Tpi.Amount = 0.0;
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }
                }
                return Json(new { success = true, data = PONodigit });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("jumptoPrevious")]
        public IActionResult jumptoPrevious(int ponodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var ponod = _db.PODetials.Where(a => a.PoNodigit < ponodigit && a.Companyid == comapnyid).OrderByDescending(a => a.PoNodigit).Select(a => a.PoNo).FirstOrDefault();

                if (ponod != null)
                {
                    return Json(new { success = true, data = ponod });
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
        public IActionResult jumptoNext(int ponodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var ponod = _db.PODetials.Where(a => a.PoNodigit > ponodigit && a.Companyid == comapnyid).Select(a => a.PoNo).FirstOrDefault();
                if (ponod != null)
                {
                    return Json(new { success = true, data = ponod });
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


        [Route("SearchPO")]
        public IActionResult SearchPO(string searchtype, string searchValue, DateTime frmdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (searchtype == "PARTY")
                {
                    var data = _db.PODetials.Where(x => x.SupplierCompanyname.Contains(searchValue) && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }
                else if (searchtype == "CONSIGNEPARTY")
                {
                    var data = _db.PODetials.Where(x => x.ConsignCompanyname.Contains(searchValue) && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }
                else if (searchtype == "PONO")
                {
                    var data = _db.PODetials.Where(x => x.PoNo.Contains(searchValue) && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }
                else
                {
                    var data = _db.PODetials.Where(x => x.Date.Date >= frmdate.Date && x.Date.Date <= todate.Date && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



    }
}
