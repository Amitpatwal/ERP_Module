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
    [Route("api/MaterialShifting")]
    public class MaterialShiftingController : Controller
    {
        public readonly ApplicationDBContext _db;
        public MaterialShiftingController(ApplicationDBContext db)
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
                var salesnodigit = _db.PRDetials.Where(a => a.Companyid == comapnyid && a.voucherType=="SHIFTING").Select(a => a.PrNodigit).DefaultIfEmpty().Max();
                salesnodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "MaterialVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var salesno = prefix + salesnodigit;
                return Json(new { success = true, data = salesno, });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("Currentstock")]
        public IActionResult Currentstock(currentstock cst, string typee, string itemtype)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var opQty = 0.0;
                var opAltQty = 0.0;
                var itemid = _db.ItemMaster.Where(a => a.pname == cst.Pname && a.size == cst.Psize && a.Class == cst.Pclass && a.Companyid == comapnyid).Select(a => a.ItemId).FirstOrDefault();
                var openingdata = _db.OpeningStock.Where(a => a.GodownLocation == cst.GodownLocation && a.ItemBrand == cst.Pmake && a.ItemId == itemid && a.Companyid == comapnyid).FirstOrDefault();
                if (openingdata != null)
                {
                    opQty = openingdata.qty;
                    opAltQty = openingdata.altQty;
                }
                else
                {
                    opQty = 0.0;
                    opAltQty = 0.0;
                }
                var outQTy = 0.0;
                var outAltQty = 0.0;

                var inQTy = (from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.PrDate.Date <= cst.ddate && dtl.status == true select itm.Qty).Sum();
                var inAltQty = (from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.PrDate.Date <= cst.ddate && dtl.status == true select itm.AltQty).Sum();

                outQTy = (from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.DoDate.Date <= cst.ddate select itm.Qty).Sum();
                outAltQty = (from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.DoDate.Date <= cst.ddate select itm.AltQty).Sum();

                if (itemtype == "Update")/* DO Item Save*/
                {
                    if (typee == "Save")/* DO Save*/
                    {
                        var outQTy1 = (from itm in _db.TempDODespatchItem join dtl in _db.TempDODetials on itm.DoNodigit equals dtl.DoNodigit where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.DoNodigit == cst.donodigit && itm.itemsrno == cst.itemsrno && itm.Itemid == cst.itemid select itm.Qty).Sum();
                        outQTy = outQTy - outQTy1;
                        var outAltQty1 = (from itm in _db.TempDODespatchItem join dtl in _db.TempDODetials on itm.DoNodigit equals dtl.DoNodigit where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.DoNodigit == cst.donodigit && itm.itemsrno == cst.itemsrno && itm.Itemid == cst.itemid select itm.AltQty).Sum();
                        outAltQty = outAltQty - outAltQty1;
                    }
                    else
                    {
                        var outQTy1 = (from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.DoNo == cst.dono && itm.itemsrno == cst.itemsrno && itm.Itemid == cst.itemid select itm.Qty).Sum();
                        outQTy = outQTy + outQTy1;
                        var outAltQty1 = (from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.DoNo == cst.dono && itm.itemsrno == cst.itemsrno && itm.Itemid == cst.itemid select itm.AltQty).Sum();
                        outAltQty = outAltQty + outAltQty1;

                    }
                }

                if (typee == "Save")
                {     /* Value from temporary database*/
                    var tempoutqty = (from itm in _db.TempDODespatchItem join dtl in _db.TempDODetials on itm.DoNodigit equals dtl.DoNodigit where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.DoDate.Date <= cst.ddate select itm.Qty).Sum();
                    var tempoutAltQty = (from itm in _db.TempDODespatchItem join dtl in _db.TempDODetials on itm.DoNodigit equals dtl.DoNodigit where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation && dtl.DoDate.Date <= cst.ddate select itm.AltQty).Sum();
                    outQTy = tempoutqty + outQTy;
                    outAltQty = outAltQty + tempoutAltQty;
                }

                var qty = opQty + inQTy;
                qty = qty - outQTy;
                var altqty = opAltQty + inAltQty;
                altqty = altqty - outAltQty;
                return Json(new { success = true, qty = qty, altqty = altqty });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("AddtempmaterialShiftdetails")]
        public IActionResult AddtempmaterialShiftdetails(string type, TempMaterialShiftingDetails dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type == "Save")
                {
                    var msnodigit = _db.TempMaterialShiftingDetails.Where(a => a.companyid == comapnyid).Select(p => p.msnodigit).DefaultIfEmpty().Max();
                    msnodigit++;

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
                    dt.msnodigit = msnodigit;
                    dt.Unique = id;
                    dt.userid = username;
                    dt.companyid = comapnyid;
                    _db.TempMaterialShiftingDetails.Add(dt);
                    _db.SaveChanges();
                    return Json(new { success = true, data = msnodigit });
                }
                else
                {
                    var data = _db.TempMaterialShiftingDetails.Where(a => a.msnodigit == dt.msnodigit && a.companyid == comapnyid).FirstOrDefault();
                    if (data != null)
                    {
                        data.remarks = dt.remarks;
                        data.loadingInchrage = dt.loadingInchrage;
                        data.transportName = dt.transportName;
                        data.driverName = dt.driverName;
                        data.vechileno = dt.vechileno;
                        data.Date = dt.Date;
                        data.userid = dt.userid;
                        data.companyid = comapnyid;
                        _db.SaveChanges();
                    }
                    return Json(new { success = true, data = dt.msnodigit });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [HttpPost]
        [Route("Updatedetails")]
        public IActionResult Updatedetails(MaterialShiftingDetails details)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var ud = _db.MaterialShiftingDetails.Where(s => s.msno == details.msno && s.companyid == comapnyid).FirstOrDefault();
                ud.loadingInchrage = details.loadingInchrage;
                ud.transportName = details.transportName;
                ud.driverName = details.driverName;
                ud.vechileno = details.vechileno;
                ud.Date = details.Date;
                ud.remarks = details.remarks;
                ud.userid = details.userid;
                ud.companyid = comapnyid;
                _db.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [HttpPost]
        [Route("AddNewTempItem")]
        public JsonResult AddNewTempItem(int tempmsno, TempItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.TempItem.Where(a => a.msnodigit == tempmsno && a.companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                itemmaster.Itemid = itemid;
                itemmaster.msnodigit = tempmsno;
                itemmaster.companyid = comapnyid;
                itemmaster.userid = Request.Cookies["username"];
                _db.TempItem.Add(itemmaster);
                _db.SaveChanges();
                return Json(new { success = true,  });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("AddNewItem")]
        public JsonResult AddNewItem(MaterialShiftinngItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.MaterialShiftinngItem.Where(a => a.msno == itemmaster.msno && a.companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                itemmaster.Itemid = itemid;
                itemmaster.companyid = comapnyid;
                _db.MaterialShiftinngItem.Add(itemmaster);
                _db.SaveChanges();

                return Json(new { success = true,  });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("UpDateItem")]
        public JsonResult UpDateItem(MaterialShiftinngItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var item = _db.MaterialShiftinngItem.Where(s => s.msno == itemmaster.msno && s.Itemid == itemmaster.Itemid && s.companyid == comapnyid).FirstOrDefault();
                item.Pname = itemmaster.Pname;
                item.Psize = itemmaster.Psize;
                item.Pclass = itemmaster.Pclass;
                item.Pmake = itemmaster.Pmake;
                item.qty = itemmaster.qty;
                item.qtyUnit = itemmaster.qtyUnit;
                item.altqty = itemmaster.altqty;
                item.altqtyUnit = itemmaster.altqtyUnit;
                item.fromGodown = itemmaster.fromGodown;
                item.toGodown = itemmaster.toGodown;
                item.companyid = comapnyid;
                item.userid = Request.Cookies["username"];
                _db.SaveChanges();
                return Json(new { success = true,  });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
        [Route("viewMaterialShifting")]
        public IActionResult viewMaterialShifting(string msno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.MaterialShiftingDetails.Where(x => x.msno == msno && x.companyid == comapnyid);
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

        [HttpPost]
        [Route("UpDateTempItem")]
        public JsonResult UpDateTempItem(int tempmsno, TempItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                var checker = _db.TempItem.Where(s => s.msnodigit == tempmsno && s.Itemid == itemmaster.Itemid && s.companyid == comapnyid).FirstOrDefault();
                if (checker != null)
                {
                    checker.Itemid = itemmaster.Itemid;
                    checker.Pname = itemmaster.Pname;
                    checker.Psize = itemmaster.Psize;
                    checker.Pclass = itemmaster.Pclass;
                    checker.Pmake = itemmaster.Pmake;
                    checker.fromGodown = itemmaster.fromGodown;
                    checker.toGodown = itemmaster.toGodown;
                    checker.qty = itemmaster.qty;
                    checker.qtyUnit = itemmaster.qtyUnit;
                    checker.altqty = itemmaster.altqty;
                    checker.altqtyUnit = itemmaster.altqtyUnit;
                    checker.companyid = comapnyid;
                    checker.userid = Request.Cookies["username"];
                    _db.SaveChanges();
                    return Json(new { success = true,});
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


        [Route("getitem")]
        public IActionResult Getitem(int msnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                var data = _db.TempItem.Where(x => x.msnodigit == msnodigit && x.companyid == comapnyid && x.userid == userid).ToList().OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getmaterialShiftingitem")]
        public IActionResult getmaterialShiftingitem(string msno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.MaterialShiftinngItem.Where(x => x.msno == msno && x.companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



        [HttpPost]
        [Route("PermanantSave")]
        public IActionResult PermanantSave(int tempmsno, MaterialShiftingDetails sd)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                var msnodigit = _db.PRDetials.Where(a => a.Companyid == comapnyid && a.voucherType == "SHIFTING").Select(a => a.PrNodigit).DefaultIfEmpty().Max();
                msnodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "MaterialVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var msno = prefix + msnodigit;

                sd.msno = msno;
                sd.msnodigit = msnodigit;
                sd.userid = Request.Cookies["username"];
                sd.companyid = comapnyid;
                _db.MaterialShiftingDetails.Add(sd);
                _db.SaveChanges();


                var data = _db.TempItem.Where(u => u.msnodigit == tempmsno && u.companyid == comapnyid && u.userid == userid).ToList().OrderBy(a => a.Itemid);
                foreach (var tempitem in data)
                {
                    MaterialShiftinngItem item = new MaterialShiftinngItem();
                    item.msnodigit = msnodigit;
                    item.msno = msno;
                    item.Itemid = tempitem.Itemid;
                    item.Pname = tempitem.Pname;
                    item.Psize = tempitem.Psize;
                    item.Pclass = tempitem.Pclass;
                    item.Pmake = tempitem.Pmake;
                    item.qty = tempitem.qty;
                    item.qtyUnit = tempitem.qtyUnit;
                    item.altqty = tempitem.altqty;
                    item.altqtyUnit = tempitem.altqtyUnit;
                    item.fromGodown = tempitem.fromGodown;
                    item.toGodown = tempitem.toGodown;
                    item.userid = Request.Cookies["username"];
                    item.companyid = comapnyid;

                    _db.MaterialShiftinngItem.Add(item);
                    _db.SaveChanges();
                }

                DeleteMaterialShifting(tempmsno);
                return Json(new { success = true, data = sd.msno });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("GetMaterialShitingMaterial")]
        public IActionResult GetMaterialShitingMaterial()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];

                var data = _db.MaterialShiftingDetails.Where(a => a.companyid == comapnyid ).Select(a => new {
                    msno = a.msno, Date = a.Date, loadingIncharge = a.loadingInchrage, 
                    Userid = a.userid,  
                }).ToList().OrderByDescending(s => s.Date);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("GetPendingDatatable")]
        public IActionResult GetPendingDatatable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];

                var data = _db.MaterialShiftingDetails.Where(a => a.companyid == comapnyid && a.status =="Submitted").Select(a => new {
                    msno = a.msno, Date = a.Date, loadingIncharge = a.loadingInchrage,
                    Userid = a.userid,
                }).ToList().OrderByDescending(s => s.Date);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("GetApprovedTable")]
        public IActionResult GetApprovedTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.MaterialShiftingDetails.Where(a => a.companyid == comapnyid && a.status == "Approved").Select(a => new {
                    msno = a.msno, Date = a.Date, loadingIncharge = a.loadingInchrage,
                    Userid = a.userid,
                }).ToList().OrderByDescending(s => s.Date);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("GetrejectedTable")]
        public IActionResult GetrejectedTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.MaterialShiftingDetails.Where(a => a.companyid == comapnyid && a.status == "Rejected").Select(a => new {
                    msno = a.msno, Date = a.Date, loadingIncharge = a.loadingInchrage,
                    Userid = a.userid,
                }).ToList().OrderByDescending(s => s.Date);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [HttpPost]
        [Route("PermanantUpdate")]
        public IActionResult PermanantUpdate(MaterialShiftingDetails sd)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var checker = _db.MaterialShiftingDetails.Where(x => x.msno == sd.msno && x.companyid == comapnyid).FirstOrDefault();
                checker.loadingInchrage = sd.loadingInchrage;
                checker.transportName = sd.transportName;
                checker.driverName = sd.driverName;
                checker.vechileno = sd.vechileno;
                checker.remarks = sd.remarks;
                checker.Date = sd.Date;
                checker.userid = username;
                checker.companyid = comapnyid;
                _db.SaveChanges();

              
                return Json(new { success = true, data = sd.msno });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("DeleteMaterialShifting")]
        public IActionResult DeleteMaterialShifting(int msnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                var tempitem = _db.TempItem.Where(u => u.msnodigit == msnodigit && u.companyid == comapnyid).ToList();
                if (tempitem != null)
                {
                    _db.TempItem.RemoveRange(tempitem);
                    _db.SaveChanges();
                }

                var ClientFromDB = _db.TempMaterialShiftingDetails.Where(u => u.msnodigit == msnodigit && u.companyid == comapnyid).ToList();
                if (ClientFromDB != null)
                {
                    _db.TempMaterialShiftingDetails.RemoveRange(ClientFromDB);
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
        [Route("Approved")]
        public JsonResult Approved(string ShiftingNo ,DateTime Shiftingdate)
        {
            try
            {
                    var comapnyid = Request.Cookies["companyid"];
                    var username = Request.Cookies["username"];
                    var prdetails = new PRDetials();
                    var dodetail = new DODetials();

               
                    var salesnodigit = _db.PRDetials.Where(a => a.Companyid == comapnyid && a.voucherType == "SHIFTING").Select(a => a.PrNodigit).DefaultIfEmpty().Max();
                    salesnodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "MaterialVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    var salesno = prefix + salesnodigit;
                
                    prdetails.voucherType = "SHIFTING";
                    prdetails.PrDate = Shiftingdate;
                    prdetails.SupplierCompanyname = "Material Shifting";
                    prdetails.PrNo = ShiftingNo;
                    prdetails.status = true;
                    prdetails.reason = "approved";
                    prdetails.Userid = username;
                    prdetails.Companyid = comapnyid;
                    prdetails.PrNodigit = salesnodigit;
                    _db.PRDetials.Add(prdetails);
                    _db.SaveChanges();

                dodetail.VoucherType = "SHIFTING";
                dodetail.DoDate = Shiftingdate;
                dodetail.SupplierCompanyname = "Material Shifting";
                dodetail.DoNo = ShiftingNo;
                dodetail.DoNodigit = salesnodigit;
                dodetail.status = true;
                dodetail.reason = "approved";
                dodetail.Userid = username;
                dodetail.Companyid = comapnyid;
                _db.DODetials.Add(dodetail);
                _db.SaveChanges();

                var materialShiftingItem = _db.MaterialShiftinngItem.Where(a => a.companyid == comapnyid && a.msno == ShiftingNo).ToList();
                   
                        foreach (var ms in materialShiftingItem)
                        {
                         var pritem = new PurchaseRecievedItem();
                         pritem.PrNo = ms.msno;
                            pritem.PrNodigit = salesnodigit;
                            pritem.Itemid = ms.Itemid;
                            pritem.Pname = ms.Pname;
                            pritem.Psize = ms.Psize;
                            pritem.Pclass = ms.Pclass;
                            pritem.Pmake = ms.Pmake;
                            pritem.Wharehouse = ms.toGodown;
                            pritem.Qty = ms.qty;
                            pritem.Qtyunit = ms.qtyUnit;
                            pritem.AltQty = ms.altqty;
                            pritem.AltQtyunit = ms.altqtyUnit;
                            pritem.VoucherType = "SHIFTING";
                            pritem.Companyid = comapnyid;
                            _db.PurchaseRecievedItem.Add(pritem);
                            _db.SaveChanges();


                    var doitem = new DODespatchItem();

                    doitem.DoNo = ms.msno;
                            doitem.DoNodigit = salesnodigit;
                            doitem.Itemid = ms.Itemid;
                            doitem.Pname = ms.Pname;
                            doitem.Psize = ms.Psize;
                            doitem.Pclass = ms.Pclass;
                            doitem.Pmake = ms.Pmake;
                            doitem.Wharehouse = ms.fromGodown;
                            doitem.Qty = ms.qty;
                            doitem.Qtyunit = ms.qtyUnit;
                            doitem.AltQty = ms.altqty;
                            doitem.AltQtyunit = ms.qtyUnit;
                            doitem.VoucherType = "SHIFTING";
                            doitem.Companyid = comapnyid;
                            _db.DODespatchItem.Add(doitem);
                            _db.SaveChanges();
                        }


                var msshifting = _db.MaterialShiftingDetails.Where(a => a.msno == ShiftingNo && a.companyid == comapnyid).FirstOrDefault();
                msshifting.status = "Approved";
                msshifting.companyid = comapnyid;
                _db.SaveChanges();


                return Json(new { success = true, data = ShiftingNo, message = "Successfully Saved" });
                


                

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("Rejected")]
        public IActionResult Rejected(string voucherno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var PRDetials = _db.PRDetials.Where(u => u.PrNo == voucherno && u.Companyid == comapnyid && u.voucherType == "SHIFTING").FirstOrDefault();
                if (PRDetials != null)
                {
                    _db.PRDetials.RemoveRange(PRDetials);
                    _db.SaveChanges();
                }
                var PRitem = _db.PurchaseRecievedItem.Where(u => u.PrNo == voucherno && u.Companyid == comapnyid && u.VoucherType == "SHIFTING").FirstOrDefault();
                if (PRitem != null)
                {
                    _db.PurchaseRecievedItem.RemoveRange(PRitem);
                    _db.SaveChanges();
                }
                var dodetails = _db.DODetials.Where(u => u.DoNo == voucherno && u.Companyid == comapnyid && u.VoucherType == "SHIFTING").FirstOrDefault();
                if (dodetails != null)
                {
                    _db.DODetials.RemoveRange(dodetails);
                    _db.SaveChanges();
                }
                var doitem = _db.DODespatchItem.Where(u => u.DoNo == voucherno && u.Companyid == comapnyid && u.VoucherType == "SHIFTING").FirstOrDefault();
                if (doitem != null)
                {
                    _db.DODespatchItem.RemoveRange(doitem);
                    _db.SaveChanges();
                }

                var msshifting = _db.MaterialShiftingDetails.Where(a => a.msno == voucherno && a.companyid == comapnyid).FirstOrDefault();
                msshifting.status = "Rejected";
                msshifting.companyid = comapnyid;
                _db.SaveChanges();


                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
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
                    var prdetails = new PRDetials();
                    var pritem = new PurchaseRecievedItem();
                    var dodetail = new DODetials();
                    var doitem = new DODespatchItem();
                    var salesnodigit = _db.PRDetials.Where(a => a.Companyid == comapnyid && a.voucherType == "SHIFTING").Select(a => a.PrNodigit).DefaultIfEmpty().Max();
                    salesnodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "MaterialVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    var salesno = prefix + salesnodigit;
                    item.voucherno = salesno;
                    prdetails.voucherType = "SHIFTING";
                    prdetails.PrDate = item.voucherDate;
                    prdetails.SupplierCompanyname = "Material Shifting";
                    prdetails.PrNo = salesno;
                    prdetails.status = true;
                    prdetails.reason = "approved";
                    prdetails.Userid = username;
                    prdetails.Companyid = comapnyid;
                    prdetails.PrNodigit = salesnodigit;
                    _db.PRDetials.Add(prdetails);
                    _db.SaveChanges();

                    pritem.PrNo = item.voucherno;
                    pritem.PrNodigit = salesnodigit;
                    pritem.Itemid = 1;
                    pritem.Pname = item.pname;
                    pritem.Pnameid = item.pnameid;
                    pritem.Psize = item.size;
                    pritem.Psizeid = item.sizeid;
                    pritem.Pclass = item.Class;
                    pritem.Pclassid = item.classid;
                    pritem.Pmake = item.make;
                    pritem.Pmakeid = item.makeid;
                    pritem.Wharehouse = item.toWhareHouse;
                    pritem.Wharehouseid = item.toWhareHouseid;
                    pritem.Qty = item.Qty;
                    pritem.Qtyunit = item.QtyUnit;
                    pritem.AltQty = item.AltQty;
                    pritem.AltQtyunit = item.AltQtyUnit;
                    pritem.VoucherType = "SHIFTING";
                    pritem.Companyid = comapnyid;
                    _db.PurchaseRecievedItem.Add(pritem);
                    _db.SaveChanges();

                    dodetail.VoucherType = "SHIFTING";
                    dodetail.DoDate = item.voucherDate;
                    dodetail.SupplierCompanyname = "Material Shifting";
                    dodetail.DoNo = salesno;
                    dodetail.DoNodigit = salesnodigit;
                    dodetail.status = true;
                    dodetail.reason = "approved";
                    dodetail.Userid = username;
                    dodetail.Companyid = comapnyid;
                    _db.DODetials.Add(dodetail);
                    _db.SaveChanges();


                    doitem.DoNo = item.voucherno;
                    doitem.DoNodigit = salesnodigit;
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
                    doitem.VoucherType = "SHIFTING";
                    doitem.Companyid = comapnyid;
                    _db.DODespatchItem.Add(doitem);
                    _db.SaveChanges();
                    return Json(new { success = true,data=item.voucherno, message = "Successfully Saved" }); 
                }
                else
                {
                    var prdetails = _db.PRDetials.Where(a => a.PrNo == item.voucherno && a.Companyid == comapnyid && a.voucherType == "SHIFTING").FirstOrDefault();
                    prdetails.PrDate = item.voucherDate;
                    prdetails.status = true;
                    prdetails.reason = "approved";
                    prdetails.Userid = username;
                    _db.SaveChanges();

                    var pritem = _db.PurchaseRecievedItem.Where(a => a.PrNo == item.voucherno && a.VoucherType == "SHIFTING").FirstOrDefault();
                    pritem.Itemid = 1;
                    pritem.Pname = item.pname;
                    pritem.Pnameid = item.pnameid;
                    pritem.Psize = item.size;
                    pritem.Psizeid = item.sizeid;
                    pritem.Pclass = item.Class;
                    pritem.Pclassid = item.classid;
                    pritem.Pmake = item.make;
                    pritem.Pmakeid = item.makeid;
                    pritem.Wharehouse = item.toWhareHouse;
                    pritem.Wharehouseid = item.toWhareHouseid;
                    pritem.Qty = item.Qty;
                    pritem.Qtyunit = item.QtyUnit;
                    pritem.AltQty = item.AltQty;
                    pritem.AltQtyunit = item.AltQtyUnit;
                    _db.SaveChanges();

                    var dodetail = _db.DODetials.Where(a => a.DoNo == item.voucherno && a.VoucherType == "SHIFTING").FirstOrDefault();
                    dodetail.DoDate = item.voucherDate;
                    dodetail.status = true;
                    dodetail.reason = "approved";
                    dodetail.Userid = username;
                    _db.SaveChanges();
                    var doitem = _db.DODespatchItem.Where(a => a.DoNo == item.voucherno && a.VoucherType == "SHIFTING").FirstOrDefault();
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
                    _db.SaveChanges();
                    return Json(new { success = true, data = item.voucherno, message = "Successfully Update" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


       
        [Route("viewvVoucher")]
        public IActionResult viewvVoucher(string InvoiceNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = new MaterialShift();
                var prdetails = _db.PRDetials.Where(x => x.PrNo == InvoiceNO && x.Companyid == comapnyid &&  x.voucherType == "SHIFTING").FirstOrDefault();
                var pritem = _db.PurchaseRecievedItem.Where(x => x.PrNo == InvoiceNO && x.Companyid == comapnyid && x.VoucherType == "SHIFTING").FirstOrDefault();
                var doitem = _db.DODespatchItem.Where(x => x.DoNo == InvoiceNO && x.Companyid == comapnyid && x.VoucherType == "SHIFTING").FirstOrDefault();
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
                data.frmWhareHouse = doitem.Wharehouse;
                data.frmWhareHouseid = doitem.Wharehouseid;
                data.toWhareHouse = pritem.Wharehouse;
                data.toWhareHouseid = pritem.Wharehouseid;
                data.Qty = pritem.Qty;
                data.QtyUnit = pritem.Qtyunit;
                data.AltQty = pritem.AltQty;
                data.AltQtyUnit = pritem.AltQtyunit;
                return Json(new { success = true, data = data });

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
                    var data = (from prd in _db.PRDetials join pri in _db.PurchaseRecievedItem on prd.PrNo equals pri.PrNo where pri.VoucherType == prd.voucherType && pri.Companyid == comapnyid && prd.Companyid == comapnyid && prd.voucherType == "SHIFTING" && prd.PrDate.Date >= fromdate.Date && prd.PrDate <= todate.Date select new {
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
                        username=prd.Userid
                    }).ToList();
                    return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
      



        [HttpDelete]
        [Route("Deletetemprow")]
        public IActionResult DeleteTempQuotationIT(int msnodigit, int itmno, string msno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var tempitem = _db.TempItem.FirstOrDefault(u => u.msnodigit == msnodigit && u.Itemid == itmno && u.companyid == comapnyid && u.userid == username);
                _db.TempItem.Remove(tempitem);
                _db.SaveChanges();

                var data = _db.TempItem.Where(u => u.msnodigit == msnodigit && u.Itemid > itmno && u.companyid == comapnyid && u.userid == username).ToList().OrderBy(k => k.Itemid);
                foreach (var item in data)
                {
                    var temp = _db.TempItem.Where(k => k.Sr == item.Sr && k.companyid == comapnyid && k.userid == username).FirstOrDefault();
                    temp.Itemid = item.Itemid - 1;
                    _db.SaveChanges();
                }
                return Json(new { success = true, });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("Deleterow")]
        public IActionResult DeleteQuotationIT(int msnodigit, int itmno, string msno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var items = _db.MaterialShiftinngItem.Where(u => u.msno == msno && u.Itemid == itmno && u.companyid == comapnyid).FirstOrDefault();
                _db.MaterialShiftinngItem.Remove(items);
                _db.SaveChanges();
              
                var data = _db.MaterialShiftinngItem.Where(u => u.msno == msno && u.Itemid > itmno && u.companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                foreach (var item in data)
                {
                    var temp = _db.MaterialShiftinngItem.Where(k => k.Sr == item.Sr && k.companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = item.Itemid - 1;
                    _db.SaveChanges();
                }

                return Json(new { success = true,});


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("getitembyid")]
        public IActionResult Getitembyid(int tempmsno, int Itemid, string type, string msno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                MaterialShiftinngItem qt = new MaterialShiftinngItem();
                if (type == "temp")
                {
                    var dt = _db.TempItem.Where(x => x.msnodigit == tempmsno && x.Itemid == Itemid && x.companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Psize = dt.Psize;
                    qt.Pclass = dt.Pclass;
                    qt.Pmake = dt.Pmake;
                    qt.qty = dt.qty;
                    qt.qtyUnit = dt.qtyUnit;
                    qt.altqty = dt.altqty;
                    qt.altqtyUnit = dt.altqtyUnit;
                    qt.fromGodown = dt.fromGodown;
                    qt.toGodown = dt.toGodown;

                    return Json(new { success = true, data = qt });
                }
                else
                {
                    var dt = _db.MaterialShiftinngItem.Where(x => x.msno == msno && x.Itemid == Itemid && x.companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Psize = dt.Psize;
                    qt.Pclass = dt.Pclass;
                    qt.Pmake = dt.Pmake;
                    qt.qty = dt.qty;
                    qt.qtyUnit = dt.qtyUnit;
                    qt.altqty = dt.altqty;
                    qt.altqtyUnit = dt.altqtyUnit;
                    qt.fromGodown = dt.fromGodown;
                    qt.toGodown = dt.toGodown;
                    return Json(new { success = true, data = qt });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("finalsubmit")]
        public IActionResult finalsubmit(string msno)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.MaterialShiftingDetails.Where(a => a.msno == msno && a.companyid == comapnyid ).FirstOrDefault();
                data.status = "Submitted";
                data.companyid = comapnyid;
                _db.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("CurrentMaterialstock")]
        public IActionResult CurrentMaterialstock(currentstock cst, string typee, string itemtype)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.ItemMaster.Where(a => a.pname == cst.Pname && a.size == cst.Psize && a.Class == cst.Pclass && a.Companyid == comapnyid).Select(a => a.ItemId).FirstOrDefault();
                var opQty = _db.OpeningStock.Where(a => a.ItemBrand == cst.Pmake && a.ItemId == itemid && a.Companyid == comapnyid).Select(a => a.qty).Sum();
                var inQTy = (from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse ==cst.GodownLocation && dtl.status == true select itm.Qty).Sum();
                var outQTy = (from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == cst.Pname && itm.Psize == cst.Psize && itm.Pclass == cst.Pclass && itm.Pmake == cst.Pmake && itm.Wharehouse == cst.GodownLocation  select itm.Qty).Sum();

                var cs = (opQty + inQTy) - outQTy;

                return Json(new { success = true, currentStock = cs });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

    }

}
