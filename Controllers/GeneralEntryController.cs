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
    [Route("api/GeneralEntry")]
    public class GeneralEntryController : Controller
    {
        public readonly ApplicationDBContext _db;
        public GeneralEntryController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("VoucherNo")]
        public IActionResult VoucherNo()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var vouchernodigit = _db.GeneralEntry.Where(a => a.Companyid == comapnyid).Select(a => a.vouchernodigit).DefaultIfEmpty().Max();
                vouchernodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "GeneralEntryVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var voucherno = prefix + vouchernodigit;
                return Json(new { success = true, data = voucherno, });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("RRVoucherNo")]
        public IActionResult RRVoucherNo()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var vouchernodigit = _db.GeneralEntry.Where(a => a.Companyid == comapnyid).Select(a => a.vouchernodigit).DefaultIfEmpty().Max();
                vouchernodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "RRVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var voucherno = prefix + vouchernodigit;
                return Json(new { success = true, data = voucherno, });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [HttpPost]
        [Route("addVoucher")]
        public JsonResult addVoucher(MaterialShift item, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type == "Save")
                {
                    var vouchernodigit = _db.GeneralEntry.Where(a => a.Companyid == comapnyid).Select(a => a.vouchernodigit).DefaultIfEmpty().Max();
                    vouchernodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "GeneralEntryVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    var voucherno = prefix + vouchernodigit;
                    item.voucherno = voucherno;
                    var gen = new GeneralEntry();
                    gen.Companyid = comapnyid;
                    gen.voucherno = item.voucherno;
                    gen.vouchernodigit = vouchernodigit;
                    gen.vouchertype = item.toWhareHouse;
                    _db.GeneralEntry.Add(gen);
                    _db.SaveChanges();

                    if (item.toWhareHouse == "Short")
                    {
                        var dodetail = new DODetials();
                        var doitem = new DODespatchItem();

                        dodetail.VoucherType = "GENRAL_ENTRY";
                        dodetail.DoDate = item.voucherDate;
                        dodetail.SupplierCompanyname = "GENRAL_ENTRY_SHORT";
                        dodetail.DoNo = item.voucherno;
                        dodetail.DoNodigit = vouchernodigit;
                        dodetail.status = true;
                        dodetail.reason = "approved";
                        dodetail.Userid = username;
                        dodetail.Companyid = comapnyid;
                        _db.DODetials.Add(dodetail);
                        _db.SaveChanges();

                        doitem.DoNo = item.voucherno;
                        doitem.DoNodigit = vouchernodigit;
                        doitem.Itemid = 1;
                        doitem.Pname = item.pname;
                        doitem.Pnameid = item.pnameid;
                        doitem.Psize = item.size;
                        doitem.Psizeid = item.sizeid;
                        doitem.Pclass = item.Class;
                        doitem.Pclassid = item.classid;
                        doitem.Pmake = item.make;
                        doitem.Pmakeid = item.makeid;
                        doitem.Wharehouse = item.frmWhareHouse;
                        doitem.Wharehouseid = item.frmWhareHouseid;
                        doitem.Qty = item.Qty;
                        doitem.Qtyunit = item.QtyUnit;
                        doitem.AltQty = item.AltQty;
                        doitem.AltQtyunit = item.AltQtyUnit;
                        doitem.VoucherType = "GENRAL_ENTRY";
                        doitem.Companyid = comapnyid;
                        _db.DODespatchItem.Add(doitem);
                        _db.SaveChanges();
                        return Json(new { success = true, data = item.voucherno, message = "Successfully Saved" });
                    }
                    else if(item.toWhareHouse == "Excess")
                    {
                        var prdetails = new PRDetials();
                        var pritem = new PurchaseRecievedItem();
                        
                        prdetails.voucherType = "GENRAL_ENTRY";
                        prdetails.PrDate = item.voucherDate;
                        prdetails.SupplierCompanyname = "GENERAL_ENTRY_EXCESS";
                        prdetails.PrNo = item.voucherno;
                        prdetails.status = true;
                        prdetails.reason = "approved";
                        prdetails.Userid = username;
                        prdetails.Companyid = comapnyid;
                        prdetails.PrNodigit = vouchernodigit;
                        _db.PRDetials.Add(prdetails);
                        _db.SaveChanges();

                        pritem.PrNo = item.voucherno;
                        pritem.PrNodigit = vouchernodigit;
                        pritem.Itemid = 1;
                        pritem.Pname = item.pname;
                        pritem.Pnameid = item.pnameid;
                        pritem.Psize = item.size;
                        pritem.Psizeid = item.sizeid;
                        pritem.Pclass = item.Class;
                        pritem.Pclassid = item.classid;
                        pritem.Pmake = item.make;
                        pritem.Pmakeid = item.makeid;
                        pritem.Wharehouse = item.frmWhareHouse;
                        pritem.Wharehouseid = item.frmWhareHouseid;
                        pritem.Qty = item.Qty;
                        pritem.Qtyunit = item.QtyUnit;
                        pritem.AltQty = item.AltQty;
                        pritem.AltQtyunit = item.AltQtyUnit;
                        pritem.VoucherType = "GENRAL_ENTRY";
                        pritem.Companyid = comapnyid;
                        _db.PurchaseRecievedItem.Add(pritem);
                        _db.SaveChanges();
                        return Json(new { success = true, data = item.voucherno, message = "Successfully Saved" });

                    }
                    else
                    {
                        var dodetail = new DODetials();
                        var doitem = new DODespatchItem();

                        dodetail.VoucherType = "GENRAL_ENTRY";
                        dodetail.DoDate = item.voucherDate;
                        dodetail.SupplierCompanyname = "MATERIAL_REJECTION";
                        dodetail.DoNo = item.voucherno;
                        dodetail.DoNodigit = vouchernodigit;
                        dodetail.status = true;
                        dodetail.reason = "approved";
                        dodetail.Userid = username;
                        dodetail.Companyid = comapnyid;
                        _db.DODetials.Add(dodetail);
                        _db.SaveChanges();

                        doitem.DoNo = item.voucherno;
                        doitem.DoNodigit = vouchernodigit;
                        doitem.Itemid = 1;
                        doitem.Pname = item.pname;
                        doitem.Pnameid = item.pnameid;
                        doitem.Psize = item.size;
                        doitem.Psizeid = item.sizeid;
                        doitem.Pclass = item.Class;
                        doitem.Pclassid = item.classid;
                        doitem.Pmake = item.make;
                        doitem.Pmakeid = item.makeid;
                        doitem.Wharehouse = item.frmWhareHouse;
                        doitem.Wharehouseid = item.frmWhareHouseid;
                        doitem.Qty = item.Qty;
                        doitem.Qtyunit = item.QtyUnit;
                        doitem.AltQty = item.AltQty;
                        doitem.AltQtyunit = item.AltQtyUnit;
                        doitem.VoucherType = "GENRAL_ENTRY";
                        doitem.Companyid = comapnyid;
                        _db.DODespatchItem.Add(doitem);
                        _db.SaveChanges();
                        return Json(new { success = true, data = item.voucherno, message = "Successfully Saved" });


                    }
                }
                else
                {
                    if (item.toWhareHouse == "Short")
                    {
                        var doitem = _db.DODespatchItem.Where(a => a.DoNo == item.voucherno && a.Companyid == comapnyid).FirstOrDefault();
                        doitem.Pname = item.pname;
                        doitem.Pnameid = item.pnameid;
                        doitem.Psize = item.size;
                        doitem.Psizeid = item.sizeid;
                        doitem.Pclass = item.Class;
                        doitem.Pclassid = item.classid;
                        doitem.Pmake = item.make;
                        doitem.Pmakeid = item.makeid;
                        doitem.Wharehouse = item.frmWhareHouse;
                        doitem.Wharehouseid = item.frmWhareHouseid;
                        doitem.Qty = item.Qty;
                        doitem.Qtyunit = item.QtyUnit;
                        doitem.AltQty = item.AltQty;
                        doitem.AltQtyunit = item.AltQtyUnit;
                        _db.SaveChanges();
                        return Json(new { success = true, data = item.voucherno, message = "Successfully Saved" });
                    }
                    else if(item.toWhareHouse == "Excess")
                    {
                        var pritem = _db.PurchaseRecievedItem.Where(a => a.PrNo == item.voucherno && a.Companyid == comapnyid).FirstOrDefault();
                        pritem.Pname = item.pname;
                        pritem.Pnameid = item.pnameid;
                        pritem.Psize = item.size;
                        pritem.Psizeid = item.sizeid;
                        pritem.Pclass = item.Class;
                        pritem.Pclassid = item.classid;
                        pritem.Pmake = item.make;
                        pritem.Pmakeid = item.makeid;
                        pritem.Wharehouse = item.frmWhareHouse;
                        pritem.Wharehouseid = item.frmWhareHouseid;
                        pritem.Qty = item.Qty;
                        pritem.Qtyunit = item.QtyUnit;
                        pritem.AltQty = item.AltQty;
                        pritem.AltQtyunit = item.AltQtyUnit;
                        _db.SaveChanges();
                    }
                    else
                    {
                        var doitem = _db.DODespatchItem.Where(a => a.DoNo == item.voucherno && a.Companyid == comapnyid).FirstOrDefault();
                        doitem.Pname = item.pname;
                        doitem.Pnameid = item.pnameid;
                        doitem.Psize = item.size;
                        doitem.Psizeid = item.sizeid;
                        doitem.Pclass = item.Class;
                        doitem.Pclassid = item.classid;
                        doitem.Pmake = item.make;
                        doitem.Pmakeid = item.makeid;
                        doitem.Wharehouse = item.frmWhareHouse;
                        doitem.Wharehouseid = item.frmWhareHouseid;
                        doitem.Qty = item.Qty;
                        doitem.Qtyunit = item.QtyUnit;
                        doitem.AltQty = item.AltQty;
                        doitem.AltQtyunit = item.AltQtyUnit;
                        _db.SaveChanges();
                        return Json(new { success = true, data = item.voucherno, message = "Successfully Saved" });


                    }

                    return Json(new { success = true, data = item.voucherno, message = "Successfully Update" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }






        [Route("Billno")]
        public IActionResult Billno(string voucherType, string companyname)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (voucherType == "Return")
                {
                    var data = _db.DODetials.Where(x =>  x.Companyid == comapnyid && x.SupplierCompanyname == companyname).ToList();
                    return Json(new { success = true, data = data });
                }
                else
                {
                    var data = _db.PRDetials.Where(x => x.Companyid == comapnyid && x.SupplierCompanyname == companyname ).ToList();
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



        [Route("viewvVoucher")]
        public IActionResult viewvVoucher(string InvoiceNO ,string Type)
        {
            try
            {

                var comapnyid = Request.Cookies["companyid"];
                var data = new MaterialShift();

                if (Type == "EXCESS")
                {
                    var prdetails = _db.PRDetials.Where(x => x.PrNo == InvoiceNO && x.Companyid == comapnyid && x.voucherType == "GENRAL_ENTRY").FirstOrDefault();
                    var pritem = _db.PurchaseRecievedItem.Where(x => x.PrNo == InvoiceNO && x.Companyid == comapnyid && x.VoucherType == "GENRAL_ENTRY").FirstOrDefault();
                    data.voucherDate = prdetails.PrDate;
                    data.voucherno = prdetails.PrNo;
                    data.pname = pritem.Pname;
                    data.pnameid = pritem.Pnameid;
                    data.size = pritem.Psize;
                    data.sizeid = pritem.Psizeid;
                    data.Class = pritem.Pclass;
                    data.classid = pritem.Pclassid;
                    data.make = pritem.Pmake;
                    data.makeid = pritem.Pmakeid;
                    data.frmWhareHouse = "Excess";
                    data.toWhareHouse = pritem.Wharehouse;
                    data.toWhareHouseid = pritem.Wharehouseid;
                    
                    data.Qty = pritem.Qty;
                    data.QtyUnit = pritem.Qtyunit;
                    data.AltQty = pritem.AltQty;
                    data.AltQtyUnit = pritem.AltQtyunit;
                    return Json(new { success = true, data = data });
                }
                else
                {
                    var dodetails = _db.DODetials.Where(x => x.DoNo == InvoiceNO && x.Companyid == comapnyid && x.VoucherType == "GENRAL_ENTRY").FirstOrDefault();
                    var doitem = _db.DODespatchItem.Where(x => x.DoNo == InvoiceNO && x.Companyid == comapnyid && x.VoucherType == "GENRAL_ENTRY").FirstOrDefault();
                    data.voucherDate = dodetails.DoDate;
                    data.voucherno = dodetails.DoNo;
                    data.pname = doitem.Pname;
                    data.pnameid = doitem.Pnameid;
                    data.size = doitem.Psize;
                    data.sizeid = doitem.Psizeid;
                    data.Class = doitem.Pclass;
                    data.classid = doitem.Pclassid;
                    data.make = doitem.Pmake;
                    data.makeid = doitem.Pmakeid;
                    data.frmWhareHouse = "Short";
                    data.toWhareHouse = doitem.Wharehouse;
                    data.toWhareHouseid = doitem.Wharehouseid;
                    data.Qty = doitem.Qty;
                    data.QtyUnit = doitem.Qtyunit;
                    data.AltQty = doitem.AltQty;
                    data.AltQtyUnit = doitem.AltQtyunit;
                    return Json(new { success = true, data = data });
                }

              

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("VoucherList")]
        public IActionResult VoucherList(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = (from prd in _db.PRDetials join pri in _db.PurchaseRecievedItem on prd.PrNo equals pri.PrNo where pri.VoucherType == prd.voucherType && pri.Companyid == comapnyid && prd.Companyid == comapnyid && prd.voucherType == "GENRAL_ENTRY" && prd.PrDate.Date >= fromdate.Date && prd.PrDate <= todate.Date select new {
                        voucherno = prd.PrNo,
                        voucherdate = prd.PrDate,
                        pname = pri.Pname,
                        pclass = pri.Pclass,
                        pmake = pri.Pmake,
                        psize = pri.Psize,
                        qty = pri.Qty,
                        qtyunit = pri.Qtyunit,
                        altqty=pri.AltQty,
                        altunit=pri.AltQtyunit,
                        username=prd.Userid,
                        godown =pri.Wharehouse,
                        type="EXCESS",
                }).ToList().Union((from prd in _db.DODetials
                            join pri in _db.DODespatchItem on prd.DoNo equals pri.DoNo
                            where pri.VoucherType == prd.VoucherType && pri.Companyid == comapnyid && prd.Companyid == comapnyid && prd.VoucherType == "GENRAL_ENTRY" && prd.DoDate.Date >= fromdate.Date && prd.DoDate <= todate.Date
                            select new
                            {
                                voucherno = prd.DoNo,
                                voucherdate = prd.DoDate,
                                pname = pri.Pname,
                                pclass = pri.Pclass,
                                pmake = pri.Pmake,
                                psize = pri.Psize,
                                qty = pri.Qty,
                                qtyunit = pri.Qtyunit,
                                altqty = pri.AltQty,
                                altunit = pri.AltQtyunit,
                                username = prd.Userid,
                                godown = pri.Wharehouse,
                                type = "SHORT",
                            }).ToList()).ToList();
                
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [HttpDelete]
        [Route("DeleteVoucher")]
        public IActionResult DeleteVoucher(string voucherno,string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.GeneralEntry.Where(u => u.voucherno == voucherno && u.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    _db.GeneralEntry.RemoveRange(data);
                    _db.SaveChanges();
                }
                if (type == "EXCESS")
                {
                    var PRDetials = _db.PRDetials.Where(u => u.PrNo == voucherno && u.Companyid == comapnyid && u.voucherType == "GENRAL_ENTRY").FirstOrDefault();
                    if (PRDetials != null)
                    {
                        _db.PRDetials.RemoveRange(PRDetials);
                        _db.SaveChanges();
                    }
                    var PRitem = _db.PurchaseRecievedItem.Where(u => u.PrNo == voucherno && u.Companyid == comapnyid && u.VoucherType == "GENRAL_ENTRY").FirstOrDefault();
                    if (PRitem != null)
                    {
                        _db.PurchaseRecievedItem.RemoveRange(PRitem);
                        _db.SaveChanges();
                    }
                }
                else
                {
                    var dodetails = _db.DODetials.Where(u => u.DoNo == voucherno && u.Companyid == comapnyid && u.VoucherType == "GENRAL_ENTRY").FirstOrDefault();
                    if (dodetails != null)
                    {
                        _db.DODetials.RemoveRange(dodetails);
                        _db.SaveChanges();
                    }
                    var doitem = _db.DODespatchItem.Where(u => u.DoNo == voucherno && u.Companyid == comapnyid && u.VoucherType == "GENRAL_ENTRY").FirstOrDefault();
                    if (doitem != null)
                    {
                        _db.DODespatchItem.RemoveRange(doitem);
                        _db.SaveChanges();
                    }
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
