using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SALES_ERP.Models;
using System.Text;


namespace SALES_ERP.Controllers
{

    [Route("api/DO")]
    public class DispachtedOrderController : Controller
    {

        public readonly ApplicationDBContext _db;

        public DispachtedOrderController(ApplicationDBContext db)
        {
            _db = db;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Route("DispacthedPlanningTable")]
        public IActionResult DispacthedPlanningTable(DateTime currentdate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                /*var dt1 = new List<DispatchedDetail>();*/
                var data = _db.DispatchedDetail.Where(a => a.dpstatus == false && a.Status == "dispatch" && a.Companyid == comapnyid && a.DPDate.Date==currentdate.Date)
                  .Select(a => new
                  {
                      DPNo = a.DPNo,
                      SONO = a.SONO,
                      CustomerName = a.CustomerName,
                      PONO = a.PONO,
                      lostatus = _db.LODetials.Where(b => b.Dpno == a.DPNo && b.Companyid == comapnyid).Select(a => a.Lono).FirstOrDefault(),
                  }).ToList();

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("DONO")]
        public IActionResult DONO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var DONodigit = _db.DODetials.Where(a => a.Companyid == comapnyid && a.VoucherType == "DO").Select(p => p.DoNodigit).DefaultIfEmpty().Max();

                var prefix = _db.Prefix.Where(a => a.Type == "dispachtedorder" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                DONodigit++;
                var dono = prefix + DONodigit;

                return Json(new { success = true, data = dono });
            }
            catch (Exception)
            {
                return Json(new { success = false });
            }
        }



        [Route("viewDispachtedOrder")]
        public IActionResult viewDispachtedOrder(string DONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var usid = Request.Cookies["username"];
                var data = _db.DODetials.Where(x => x.DoNo == DONO && x.Companyid == comapnyid && x.VoucherType == "DO").FirstOrDefault();
                if (data != null)
                {
                    return Json(new { success = true, data = data ,username =usid });
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

        [Route("viewTempDispachtedOrder")]
        public IActionResult viewTempDispachtedOrder(int DoNodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempDODetials.Where(x => x.DoNodigit == DoNodigit && x.Companyid == comapnyid).FirstOrDefault();
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
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempDODetials.Where(x => x.Userid == username && x.Companyid == comapnyid).FirstOrDefault();
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
        [Route("reservationChecking")]
        public IActionResult reservationChecking(string dpno, DateTime CurrentTime, string tp, string oldDono)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = new TempDODetials();
                if (tp == "DP")
                {
                    data = _db.TempDODetials.Where(x => x.Companyid == comapnyid && x.Dpno == dpno).FirstOrDefault();

                }
                else
                {
                    data = _db.TempDODetials.Where(x => x.Companyid == comapnyid && x.OldDoNo == oldDono).FirstOrDefault();
                }

                if (data != null)
                {
                    var reservTime = data.ReservationTime.Minute + 5.0;
                    if (data.ReservedStatus == true)
                    {
                        if (data.Userid == username)
                        {
                            return Json(new { success = true, frm = "TEMPORARY", status = "NOT", data = data });
                        }
                        else
                        {
                            if (reservTime <= CurrentTime.Minute && data.ReservationTime.Date == CurrentTime.Date && data.ReservationTime.Hour == CurrentTime.Hour)
                            {
                                data.ReservationTime = CurrentTime;
                                data.ReservedStatus = true;
                                data.Userid = username;
                                _db.SaveChanges();
                                return Json(new { success = true, frm = "TEMPORARY", status = "NOT", data = data });
                            }
                            else
                            {
                                return Json(new { success = true, frm = "TEMPORARY", status = "RESERVED", data = data });
                            }
                        }


                    }
                    else
                    {
                        data.ReservationTime = CurrentTime;
                        data.ReservedStatus = true;
                        data.Userid = username;
                        _db.SaveChanges();
                        return Json(new { success = true, frm = "TEMPORARY", status = "NOT", data = data });
                    }

                }
                else
                {
                    var data1 = new DODetials();
                    if (tp == "DP")
                    {
                        data1 = _db.DODetials.Where(x => x.Companyid == comapnyid && x.VoucherType == "DO" && x.Dpno == dpno).FirstOrDefault();
                    }
                    else
                    {
                        data1 = _db.DODetials.Where(x => x.Companyid == comapnyid && x.VoucherType == "DO" && x.Dpno == oldDono).FirstOrDefault();
                    }
                    if (data1 != null)
                    {
                        var reservTime = data1.ReservationTime.Minute + 5.0;
                        if (data1.ReservedStatus == true)
                        {
                            if (reservTime <= CurrentTime.Minute && data1.ReservationTime.Date == CurrentTime.Date && data1.ReservationTime.Hour == CurrentTime.Hour)
                            {
                                data1.ReservationTime = CurrentTime;
                                data1.Userid = username;
                                _db.SaveChanges();
                                return Json(new { success = true, frm = "PERMANANT", status = "NOT", data = data1 });
                            }
                            else
                            {
                                if (data1.Userid == username)
                                {
                                    return Json(new { success = true, frm = "PERMANANT", status = "NOT", data = data1 });
                                }
                                else
                                {
                                    return Json(new { success = true, frm = "PERMANANT", status = "RESERVED", data = data1 });
                                }
                            }
                        }
                        else
                        {
                            data1.ReservationTime = CurrentTime;
                            data1.Userid = username;
                            _db.SaveChanges();
                            return Json(new { success = true, frm = "PERMANANT", status = "NOT", data = data1 });
                        }
                    }
                    else
                    {
                        return Json(new { success = false });
                    }
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("ConvertToDO")]
        public IActionResult ConvertToDO(string dpno, DateTime currentTime)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];

                var tempDOdata = _db.TempDODetials.Where(u => u.Userid == username && u.Companyid == comapnyid).ToList(); ;
                foreach (var dt in tempDOdata)
                {
                    var tempDOItem = _db.TempDOItem.Where(u => u.DoNodigit == dt.DoNodigit && u.Companyid == comapnyid).ToList();
                    if (tempDOItem != null)
                    {
                        _db.TempDOItem.RemoveRange(tempDOItem);
                        _db.SaveChanges();
                    }
                    var tempDOItem1 = _db.TempDODespatchItem.Where(a => a.DoNodigit == dt.DoNodigit && a.Companyid == comapnyid).ToList();
                    if (tempDOItem1 != null)
                    {
                        _db.TempDODespatchItem.RemoveRange(tempDOItem1);
                        _db.SaveChanges();
                    }

                }
                if (tempDOdata != null)
                {
                    _db.TempDODetials.RemoveRange(tempDOdata);
                    _db.SaveChanges();
                }


                var data = _db.DispatchedDetail.Where(a => a.DPNo == dpno && a.Companyid == comapnyid).FirstOrDefault();
                var donodigit = _db.TempDODetials.Where(a => a.Companyid == comapnyid).Select(p => p.DoNodigit).DefaultIfEmpty().Max();
                donodigit++;
                if (data != null)
                {

                    TempDODetials Tdo = new TempDODetials();
                    Tdo.PoNo = data.PONO;
                    Tdo.SoNo = data.SONO;
                    Tdo.DoNodigit = donodigit;
                    Tdo.Dpno = data.DPNo;
                    Tdo.SODate = _db.SOdetails.Where(a => a.SONo == data.SONO && a.Companyid == comapnyid).Select(a => a.SODate).FirstOrDefault();

                    Tdo.PoDate = _db.SOdetails.Where(a => a.SONo == data.SONO && a.Companyid == comapnyid).Select(a => a.PODate).FirstOrDefault();
                    Tdo.SupplierCompanyname = data.CustomerName;
                    Tdo.SupplierCCode = data.Customerid;
                    Tdo.SupplierAddress = _db.SOdetails.Where(a => a.SONo == data.SONO && a.Companyid == comapnyid).Select(a => a.BillAddress).FirstOrDefault();
                    Tdo.Companyid = comapnyid;
                    Tdo.Userid = username;
                    Tdo.ReservationTime = currentTime;
                    _db.TempDODetials.Add(Tdo);
                    _db.SaveChanges();
                }

                var item = _db.DispatchMaterial.Where(a => a.DPNO == dpno && a.Companyid == comapnyid).ToList();
                if (item != null)
                {
                    foreach (var tempitem in item)
                    {
                        TempDOItem Tpi = new TempDOItem();


                        Tpi.DoNodigit = donodigit;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Altpname = tempitem.Altpname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Altpsize = tempitem.Altpsize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Altpclass = tempitem.Altpclass;
                        Tpi.Pmake = tempitem.Pmake;
                        Tpi.Qty = 0;
                        Tpi.Qtyunit = tempitem.Rateunit;
                        Tpi.orderqty = tempitem.Qty;
                        Tpi.Balanceqty = tempitem.Qty;
                        Tpi.Companyid = comapnyid;
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }
                }
                return Json(new { success = true, data = donodigit });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("ConvertToDO1")]
        public IActionResult ConvertToDO1(string dono)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var tempDOdata = _db.TempDODetials.Where(u => u.Userid == username && u.Companyid == comapnyid).ToList(); ;
                foreach (var dt in tempDOdata)
                {
                    var tempDOItem = _db.TempDOItem.Where(u => u.DoNodigit == dt.DoNodigit && u.Companyid == comapnyid).ToList();
                    if (tempDOItem != null)
                    {
                        _db.TempDOItem.RemoveRange(tempDOItem);
                        _db.SaveChanges();
                    }
                    var tempDOItem1 = _db.TempDODespatchItem.Where(a => a.DoNodigit == dt.DoNodigit && a.Companyid == comapnyid).ToList();
                    if (tempDOItem1 != null)
                    {
                        _db.TempDODespatchItem.RemoveRange(tempDOItem1);
                        _db.SaveChanges();
                    }

                }
                if (tempDOdata != null)
                {
                    _db.TempDODetials.RemoveRange(tempDOdata);
                    _db.SaveChanges();
                }

                var dpno = "";
                var donodigit = _db.TempDODetials.Where(a => a.Companyid == comapnyid).Select(p => p.DoNodigit).DefaultIfEmpty().Max();
                donodigit++;
                var item = _db.HoldMaterial.Where(a => a.DONO == dono && a.Companyid == comapnyid).ToList();
                if (item != null)
                {
                    foreach (var tempitem in item)
                    {
                        TempDOItem Tpi = new TempDOItem();
                        Tpi.DoNodigit = donodigit;
                        Tpi.Companyid = comapnyid;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Altpname = tempitem.Altpname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Altpsize = tempitem.Altpsize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Altpclass = tempitem.Altpclass;
                        Tpi.Pmake = tempitem.Pmake;
                        Tpi.Qty = 0;
                        Tpi.Qtyunit = tempitem.Rateunit;
                        Tpi.orderqty = tempitem.Qty;
                        Tpi.Balanceqty = tempitem.Qty;
                        dpno = tempitem.DPNO;
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }
                }

                var data = _db.DispatchedDetail.Where(a => a.DPNo == dpno && a.Companyid == comapnyid).FirstOrDefault();

                if (data != null)
                {

                    TempDODetials Tdo = new TempDODetials();
                    Tdo.PoNo = data.PONO;
                    Tdo.SoNo = data.SONO;
                    Tdo.DoNodigit = donodigit;
                    Tdo.Dpno = data.DPNo;
                    Tdo.SODate = _db.SOdetails.Where(a => a.SONo == data.SONO && a.Companyid == comapnyid).Select(a => a.SODate).FirstOrDefault();

                    Tdo.PoDate = _db.SOdetails.Where(a => a.SONo == data.SONO && a.Companyid == comapnyid).Select(a => a.PODate).FirstOrDefault();
                    Tdo.SupplierCompanyname = data.CustomerName;
                    Tdo.SupplierCCode = data.Customerid;
                    Tdo.Companyid = comapnyid;
                    Tdo.Userid = username;
                    _db.TempDODetials.Add(Tdo);
                    _db.SaveChanges();
                }

                return Json(new { success = true, data = donodigit });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }



        [Route("getitemtemp")]
        public IActionResult getitemtemp(int DoNodigit)
        {
            try
            {

                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempDODespatchItem.Where(x => x.DoNodigit == DoNodigit && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getdespatchitem")]
        public IActionResult getdespatchitem(string DONO)
        {
            try
            {

                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODespatchItem.Where(x => x.DoNo == DONO && x.Companyid == comapnyid && x.VoucherType == "DO").OrderBy(k => k.Itemid);
               

                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getitem")]
        public IActionResult getitem(int DoNodigit)
        {
            try
            {

                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempDOItem.Where(x => x.DoNodigit == DoNodigit && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getitemList")]
        public IActionResult getitemList(int itemid, int DoNodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempDODespatchItem.Where(x => x.DoNodigit == DoNodigit && x.Itemid == itemid && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getitemListByDONO")]
        public IActionResult getitemByDONO(int itemid, string DONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODespatchItem.Where(x => x.DoNo == DONO && x.Itemid == itemid && x.Companyid == comapnyid && x.VoucherType == "DO").OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getitemByDONO")]
        public IActionResult getitemByDONO(string DONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DOItem.Where(x => x.DoNo == DONO && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [HttpPost]
        [Route("PermanantSave")]
        public IActionResult PermanantSave(int tempdono, DODetials dt, string frm)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var ctr = 0;
                if (frm == "DP")
                {
                    var check = _db.DODetials.Where(a => a.Dpno == dt.Dpno && a.VoucherType == "DO" && a.Companyid==comapnyid).FirstOrDefault();
                    if (check != null)
                    {
                        dt.DoNo = check.DoNo;
                        ctr = ctr + 1;
                    }
                }
                else
                {
                    var check = _db.DODetials.Where(a => a.OldDoNo == dt.OldDoNo && a.VoucherType == "DO" && a.Companyid == comapnyid).FirstOrDefault();
                    if (check != null)
                    {
                        dt.DoNo = check.DoNo;
                        ctr = ctr + 1;
                    }
                }
                if (ctr > 0)
                {
                    DeleteTempDO(tempdono);
                    PermanantUpdate(dt);
                    return Json(new { success = true, data = dt.DoNo });
                }
                else
                {
                    var donodigit = _db.DODetials.Where(a => a.Companyid == comapnyid && a.VoucherType == "DO").Select(p => p.DoNodigit).DefaultIfEmpty().Max();
                    donodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "dispachtedorder" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    dt.DoNo = prefix + donodigit;
                    dt.SupplierAddress = _db.SOdetails.Where(a => a.SONo == dt.SoNo && a.Companyid == comapnyid).Select(a => a.BillAddress).FirstOrDefault();
                    dt.Userid = username;
                    dt.DoNodigit = donodigit;
                    dt.status = false;
                    dt.reason = "incomplete";
                    dt.VoucherType = "DO";
                    dt.Companyid = comapnyid;
                    _db.DODetials.Add(dt);
                    _db.SaveChanges();

                    var data1 = _db.TempDOItem.Where(u => u.DoNodigit == tempdono && u.Companyid == comapnyid).ToList();
                    foreach (var tempitem in data1)
                    {
                        DOItem item = new DOItem();
                        item.DoNodigit = donodigit;
                        item.DoNo = prefix + donodigit;
                        item.Itemid = tempitem.Itemid;
                        item.Pname = tempitem.Pname;
                        item.Altpname = tempitem.Altpname;
                        item.Psize = tempitem.Psize;
                        item.Altpsize = tempitem.Altpsize;
                        item.Pclass = tempitem.Pclass;
                        item.Altpclass = tempitem.Altpclass;
                        item.Pmake = tempitem.Pmake;
                        item.orderqty = tempitem.orderqty;
                        item.orderunit = tempitem.Qtyunit;
                        item.Qty = tempitem.Qty;
                        item.Qtyunit = tempitem.Qtyunit;
                        item.Balanceqty = tempitem.Balanceqty;
                        item.Balanceunit = tempitem.Qtyunit;
                        item.AltQty = tempitem.AltQty;
                        item.AltQtyunit = tempitem.AltQtyunit;
                        item.ItemWeight = tempitem.ItemWeight;
                        item.ItemWeightUnit = tempitem.ItemWeightUnit;
                        item.Companyid = comapnyid;
                        _db.DOItem.Add(item);
                        _db.SaveChanges();

                    }

                    var data2 = _db.TempDODespatchItem.Where(u => u.DoNodigit == tempdono && u.Companyid == comapnyid).ToList();
                    foreach (var tempitem in data2)
                    {
                        DODespatchItem item = new DODespatchItem();
                        item.DoNodigit = donodigit;
                        item.DoNo = prefix + donodigit;
                        item.SrNo = tempitem.SrNo;
                        item.Itemid = tempitem.Itemid;
                        item.itemsrno = tempitem.itemsrno;
                        item.Pname = tempitem.Pname;
                        item.Hashpname = tempitem.Hashpname;
                        item.Altpname = tempitem.Altpname;
                        item.Psize = tempitem.Psize;
                        item.Altpsize = tempitem.Altpsize;
                        item.Pclass = tempitem.Pclass;
                        item.Altpclass = tempitem.Altpclass;
                        item.Pmake = tempitem.Pmake;
                        item.Qty = tempitem.Qty;
                        item.DespQty = tempitem.DespQty;
                        item.Qtyunit = tempitem.Qtyunit;
                        item.AltQty = tempitem.AltQty;
                        item.AltQtyunit = tempitem.AltQtyunit;
                        item.ItemWeight = tempitem.ItemWeight;
                        item.ItemWeightUnit = tempitem.ItemWeightUnit;
                        item.Wharehouse = tempitem.Wharehouse;
                        item.HeatNumber = tempitem.HeatNumber;
                        item.UnloadedBy = tempitem.UnloadedBy;
                        item.Companyid = comapnyid;
                        item.VoucherType = "DO";
                        _db.DODespatchItem.Add(item);
                        _db.SaveChanges();

                    }

                    var hldmaterial = _db.HoldMaterial.Where(u => u.DONO == dt.DoNo && u.Companyid == comapnyid).ToList();
                    _db.HoldMaterial.RemoveRange(hldmaterial);
                    _db.SaveChanges();

                    var data3 = _db.TempDOItem.Where(u => u.DoNodigit == tempdono && u.Balanceqty > 0 && u.Companyid == comapnyid).ToList();
                    foreach (var tempitem in data3)
                    {
                        HoldMaterial item = new HoldMaterial();
                        item.DONO = prefix + donodigit;
                        item.date = dt.DoDate;
                        item.Sono = dt.SoNo;
                        item.DPNO = dt.Dpno;
                        item.DONO = dt.DoNo;
                        item.Itemid = tempitem.Itemid;
                        item.Pname = tempitem.Pname;
                        item.Altpname = tempitem.Altpname;
                        item.Psize = tempitem.Psize;
                        item.Altpsize = tempitem.Altpsize;
                        item.Pclass = tempitem.Pclass;
                        item.Altpclass = tempitem.Altpclass;
                        item.Pmake = tempitem.Pmake;
                        item.Qty = tempitem.Balanceqty;
                        item.Rateunit = tempitem.Qtyunit;
                        item.Rate = _db.SOItem.Where(a => a.Sono == dt.SoNo && a.Itemid == tempitem.Itemid && a.Companyid == comapnyid).Select(a => a.Rate).FirstOrDefault();
                        item.Discount = _db.SOItem.Where(a => a.Sono == dt.SoNo && a.Itemid == tempitem.Itemid && a.Companyid == comapnyid).Select(a => a.Discount).FirstOrDefault();
                        item.Discountrate = _db.SOItem.Where(a => a.Sono == dt.SoNo && a.Itemid == tempitem.Itemid && a.Companyid == comapnyid).Select(a => a.Discountrate).FirstOrDefault();
                        item.Amount = item.Discountrate * item.Qty;
                        item.Qtyunit = tempitem.Qtyunit;
                        item.status = false;
                        item.Companyid = comapnyid;
                        _db.HoldMaterial.Add(item);
                        _db.SaveChanges();
                    }
                    if (frm == "DP")
                    {
                        var dataa = _db.DispatchedDetail.Where(a => a.DPNo == dt.Dpno && a.Companyid == comapnyid).FirstOrDefault();
                        dataa.dpstatus = true;
                        _db.SaveChanges();
                    }
                    else
                    {
                        var dataa1 = _db.HoldMaterial.Where(a => a.DONO == dt.OldDoNo && a.Companyid == comapnyid).ToList();
                        dataa1.ForEach(a => a.status = true);
                        _db.SaveChanges();
                    }
                    DeleteTempDO(tempdono);
                    return Json(new { success = true, data = dt.DoNo });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("PermanantUpdate")]
        public IActionResult PermanantUpdate(DODetials dt)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODetials.Where(a => a.DoNo == dt.DoNo && a.Companyid == comapnyid && a.VoucherType == "DO").FirstOrDefault();
                data.Userid = username;
                data.Contractor = dt.Contractor;
                data.Contratorid = dt.Contratorid;
                data.ManualContractor = dt.ManualContractor;
                data.ManualContratorid = dt.ManualContratorid;
                data.CraneCharge = dt.CraneCharge;
                data.SupplierAddress = _db.SOdetails.Where(a => a.SONo == data.SoNo && a.Companyid == comapnyid).Select(a => a.BillAddress).FirstOrDefault();
                data.CraneLoadingWeightkg = dt.CraneLoadingWeightkg;
                data.CraneLoadingWeightmt = dt.CraneLoadingWeightmt;
                data.CraneTotalCharge = dt.CraneTotalCharge;
                data.DriverName = dt.DriverName;
                data.ForwardingTransportAmount = dt.ForwardingTransportAmount;
                data.FreightCharge = dt.FreightCharge;
                data.FreightType = dt.FreightType;
                data.GrNO = dt.GrNO;
                data.License = dt.License;
                data.ManualCharge = dt.ManualCharge;
                data.ManualLoadingWeightkg = dt.ManualLoadingWeightkg;
                data.ManualLoadingWeightmt = dt.ManualLoadingWeightmt;
                data.ManualTotalCharge = dt.ManualTotalCharge;
                data.Mobileno = dt.Mobileno;
                data.Note = dt.Note;
                data.TransportCCode = dt.TransportCCode;
                data.TransportName = dt.TransportName;
                data.UnloadingIncharge = dt.UnloadingIncharge;
                data.VechileNo = dt.VechileNo;
                data.status = false;
                data.reason = "incomplete";
                data.Companyid = comapnyid;
                data.DoDate = dt.DoDate;
                data.ReservationTime = dt.ReservationTime;
                _db.SaveChanges();

                var tempd = _db.HoldMaterial.Where(u => u.DONO == dt.DoNo && u.Companyid == comapnyid).ToList();
                if (tempd != null)
                {
                    _db.HoldMaterial.RemoveRange(tempd);
                    _db.SaveChanges();
                }

                var data3 = _db.DOItem.Where(u => u.DoNo == dt.DoNo && u.Balanceqty > 0 && u.Companyid == comapnyid).ToList();
                foreach (var tempitem in data3)
                {
                    HoldMaterial item = new HoldMaterial();
                    item.DONO = dt.DoNo;
                    item.date = dt.DoDate;
                    item.Sono = dt.SoNo;
                    item.DPNO = data.Dpno;
                    item.DONO = data.DoNo;
                    item.Itemid = tempitem.Itemid;
                    item.Pname = tempitem.Pname;
                    item.Altpname = tempitem.Altpname;
                    item.Psize = tempitem.Psize;
                    item.Altpsize = tempitem.Altpsize;
                    item.Pclass = tempitem.Pclass;
                    item.Altpclass = tempitem.Altpclass;
                    item.Pmake = tempitem.Pmake;
                    item.Qty = tempitem.Balanceqty;
                    item.Rateunit = tempitem.Qtyunit;
                    item.Rate = _db.SOItem.Where(a => a.Sono == dt.SoNo && a.Itemid == tempitem.Itemid && a.Companyid == comapnyid).Select(a => a.Rate).FirstOrDefault();
                    item.Discount = _db.SOItem.Where(a => a.Sono == dt.SoNo && a.Itemid == tempitem.Itemid && a.Companyid == comapnyid).Select(a => a.Discount).FirstOrDefault();
                    item.Discountrate = _db.SOItem.Where(a => a.Sono == dt.SoNo && a.Itemid == tempitem.Itemid && a.Companyid == comapnyid).Select(a => a.Discountrate).FirstOrDefault();
                    item.Amount = item.Discountrate * item.Qty;
                    item.Qtyunit = tempitem.Qtyunit;
                    item.status = false;
                    item.Companyid = comapnyid;
                    _db.HoldMaterial.Add(item);
                    _db.SaveChanges();

                }

                return Json(new { success = true, data = dt.DoNo });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteTempDO")]
        public IActionResult DeleteTempDO(int donodigit)
        {
            try
            {

                var comapnyid = Request.Cookies["companyid"];
                var tempdoitem = _db.TempDOItem.Where(u => u.DoNodigit == donodigit && u.Companyid == comapnyid).ToList();
                if (tempdoitem != null)
                {
                    _db.TempDOItem.RemoveRange(tempdoitem);
                    _db.SaveChanges();
                }

                var TempDODetials = _db.TempDODetials.Where(u => u.DoNodigit == donodigit && u.Companyid == comapnyid).ToList();
                if (TempDODetials != null)
                {
                    _db.TempDODetials.RemoveRange(TempDODetials);
                    _db.SaveChanges();
                }

                var tempdo = _db.TempDODespatchItem.Where(u => u.DoNodigit == donodigit && u.Companyid == comapnyid).ToList();
                if (tempdo != null)
                {
                    _db.TempDODespatchItem.RemoveRange(tempdo);
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
        [Route("finalsubmit")]
        public IActionResult finalsubmit(string dono)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODetials.Where(a => a.DoNo == dono && a.Companyid == comapnyid && a.VoucherType == "DO").FirstOrDefault();
                data.status = false;
                data.reason = "submitted";
                data.VoucherType = "DO";
                data.Companyid = comapnyid;
                _db.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }



        [Route("GetPRTableApprovalPending")]
        public IActionResult GetPRTableApprovalPending()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODetials.ToList().OrderByDescending(s => s.DoDate).Where(a => a.status == false && a.reason == "submitted" && a.Companyid == comapnyid && a.VoucherType == "DO");
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("counter")]
        public IActionResult counter(DateTime edate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var approved = _db.DODetials.Where(a => a.reason == "approved" && a.Companyid == comapnyid && a.VoucherType == "DO").Count();
                var submitted = _db.DODetials.Where(a => a.reason == "submitted" && a.Companyid == comapnyid && a.VoucherType == "DO").Count();
                var rejected = _db.DODetials.Where(a => a.reason == "rejected" && a.Companyid == comapnyid && a.VoucherType == "DO").Count();
                var incomplete = _db.DODetials.Where(a => a.reason == "incomplete" && a.Companyid == comapnyid && a.VoucherType == "DO").Count();
                var pendingMaterial = _db.HoldMaterial.Where(a => a.date.Date == edate.Date && a.status == false && a.Companyid == comapnyid).Select(a => new { a.DPNO, a.Sono, a.DONO }).ToList().Distinct().Count();
                var pendingDO = _db.DispatchedDetail.Where(a => a.dpstatus == false && a.DPDate.Date == edate.Date && a.Status == "dispatch" && a.Companyid == comapnyid).Count();
                return Json(new { success = true, approved = approved, submitted = submitted, rejected = rejected, incomplete = incomplete, pendingMaterials = pendingMaterial, pendingDO = pendingDO });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("GetPRTableIncomplete")]
        public IActionResult GetPRTableIncomplete()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODetials.ToList().OrderByDescending(s => s.DoDate).Where(a => a.status == false && a.reason == "incomplete" && a.Companyid == comapnyid && a.VoucherType == "DO");
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }



        [Route("GetPendingMaterialsTable")]
        public IActionResult GetPendingMaterialsTable(DateTime edate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                List<DispatchedDetail> dt = new List<DispatchedDetail>();
                var data = _db.HoldMaterial.Where(a => a.date.Date == edate && a.status == false && a.Companyid == comapnyid)
                    .Select(a => new {
                        DPNo= a.DPNO,
                        SONO= a.Sono, 
                        dono= a.DONO,
                        CustomerName= _db.DispatchedDetail.Where(b => b.DPNo == a.DPNO && b.Companyid == comapnyid).Select(a => a.CustomerName).FirstOrDefault(),
                        PONO= _db.DispatchedDetail.Where(b => b.DPNo == a.DPNO && b.Companyid == comapnyid).Select(a => a.PONO).FirstOrDefault()
            }).ToList().Distinct();
           
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("GetPRTableApproved")]
        public IActionResult GetPRTableApproved(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                /*List<DOViewreport> dt = new List<DOViewreport>();*/
                var data = _db.DODetials.Where(a => a.status == true && a.Companyid == comapnyid && a.VoucherType == "DO" && a.DoDate.Date >= fromdate.Date && a.DoDate.Date <= todate.Date)
                    .Select(a=> new 
                    { 
                        doNo =a.DoNo, 
                        piNo =a.SoNo, 
                        poNo =a.PoNo, 
                        doDate =a.DoDate, 
                        Donodigit =a.DoNodigit,
                        supplierCompanyname =a.SupplierCompanyname,
                        created =a.Userid, 
                        rejected= _db.DOReason.Where(b => b.Dono == a.DoNo && b.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault(), 
                        lostatus = _db.LODetials.Where(b => b.Dpno == a.Dpno && b.Companyid == comapnyid).Select(a=>a.Lono).FirstOrDefault(),
                    }).ToList().OrderByDescending(s => s.doDate);
             
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("AllData")]
        public IActionResult AllData()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODetials.Where(a => a.status == true && a.Companyid == comapnyid && a.VoucherType == "DO")
                  .Select(a => new
                  {
                      doNo = a.DoNo,
                      piNo = a.SoNo,
                      poNo = a.PoNo,
                      doDate = a.DoDate,
                      Donodigit = a.DoNodigit,
                      supplierCompanyname = a.SupplierCompanyname,
                      created = a.Userid,
                      rejected = _db.DOReason.Where(b => b.Dono == a.DoNo && b.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault(),
                      lostatus = _db.LODetials.Where(b => b.Dpno == a.Dpno && b.Companyid == comapnyid).Select(a => a.Lono).FirstOrDefault(),
                  }).ToList().OrderByDescending(s => s.doDate);
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("GetPRTableRejected")]
        public IActionResult GetPRTableRejected()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                /* var dt = (from pr in _db.DODetials join rs in _db.DOReason on pr.DoNo equals rs.Dono where pr.status == false && pr.reason == "rejected" && pr.Companyid == comapnyid select new { doNodigit = pr.DoNodigit, dono = pr.DoNo, doDate = pr.DoDate, supplierCompanyname = pr.SupplierCompanyname, created = pr.Userid, rejected = rs.userid, reason = rs.Remarks,pono=pr.PoNo }).ToList();*/

                List<rejectedTable> dt = new List<rejectedTable>();

                var data = _db.DODetials.ToList().OrderByDescending(s => s.DoDate).Where(a => a.status == false && a.Companyid == comapnyid && a.reason == "rejected" && a.VoucherType == "DO");
                foreach (var temp in data)
                {
                    rejectedTable vl = new rejectedTable();

                    vl.Dono = temp.DoNo;
                    vl.PoNo = temp.PoNo;
                    vl.DoDate = temp.DoDate;
                    vl.donodigit = temp.DoNodigit;
                    vl.CustomerName = temp.SupplierCompanyname;
                    vl.CreatedBy = temp.Userid;
                    var dataa = _db.DOReason.Where(a => a.Dono == temp.DoNo && a.Companyid == comapnyid).OrderByDescending(a => a.Sr).FirstOrDefault();
                    vl.RejectedBY = dataa.userid;
                    vl.RejectedReason = dataa.Remarks;
                    dt.Add(vl);


                }
                return Json(new { success = true, data = dt });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }




        [HttpPost]
        [Route("approved")]
        public IActionResult approved(DOReason pr1)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODetials.Where(a => a.DoNo == pr1.Dono && a.Companyid == comapnyid && a.VoucherType == "DO").FirstOrDefault();
                data.status = true;
                data.reason = "approved";
                data.Companyid = comapnyid;
                _db.SaveChanges();

                DOReason pr = new DOReason();
                pr.Date = pr1.Date;
                pr.Dono = pr1.Dono;
                pr.Reason = "approved";
                pr.Remarks = pr1.Remarks;
                pr.userid = username;
                pr.Companyid = comapnyid;
                _db.Add(pr);
                _db.SaveChanges();

                var data1 = _db.HoldMaterial.Where(a => a.DONO == pr1.Dono && a.Companyid == comapnyid).FirstOrDefault();
                if (data1 != null)
                {
                    data1.status = false;
                    _db.SaveChanges();
                }
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("rejected")]
        public IActionResult rejected(DOReason pr1)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODetials.Where(a => a.DoNo == pr1.Dono && a.Companyid == comapnyid && a.VoucherType == "DO").FirstOrDefault();
                data.status = false;
                data.reason = "rejected";
                data.Companyid = comapnyid;
                _db.SaveChanges();

                DOReason pr = new DOReason();
                pr.Date = pr1.Date;
                pr.Dono = pr1.Dono;
                pr.Reason = "rejected";
                pr.Remarks = pr1.Remarks;
                pr.userid = username;
                pr.Companyid = comapnyid;
                _db.Add(pr);
                _db.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("PrintDO")]
        public IActionResult PrintDO(string dono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODetials.Where(x => x.DoNo == dono && x.Companyid == comapnyid && x.VoucherType == "DO").FirstOrDefault();
                if (data != null)
                {
                    var data1 = _db.SOdetails.Where(a => a.SONo == data.SoNo && a.Companyid == comapnyid).FirstOrDefault();
                    return Json(new { success = true, data = data, data1 = data1 });
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



        [Route("PrintItemDO")]
        public IActionResult PrintItemDO(string dono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];

                var data = _db.DODespatchItem.Where(x => x.DoNo == dono && x.Companyid == comapnyid && x.VoucherType == "DO").OrderBy(a => a.Itemid);

                if (data != null)
                {

                    /* var data1 = _db.DODespatchItem.Where(a => a.Itemid == data.Itemid && a.Companyid == comapnyid).FirstOrDefault();*/


                    return Json(new { success = true, data = data, });
                }
                else

                {
                    return Json(new { success = false });
                }


            }
            catch (Exception)
            {
                return Json(new { success = false });
            }
        }


        [Route("getitembyid")]
        public IActionResult Getitembyid(int Itemid, string type, int tempDono, string DONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                QuotationItem1 qt = new QuotationItem1();
                if (type == "temp")
                {

                    var dt = _db.TempDOItem.Where(x => x.DoNodigit == tempDono && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Pnameid = _db.Productname.Where(x => x.productname == dt.Pname && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Psize = dt.Psize;
                    qt.Psizeid = _db.Productsize.Where(x => x.productsize == dt.Psize && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pclass = dt.Pclass;
                    qt.Pclassid = _db.Productclass.Where(x => x.productclass == dt.Pclass && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pmake = dt.Pmake;
                    qt.Pmakeid = _db.Productmake.Where(x => x.productmake == dt.Pmake && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Qty = dt.Qty;
                    qt.Qtyunit = dt.Qtyunit;
                    qt.AltQty = dt.AltQty;
                    qt.AltQtyunit = dt.AltQtyunit;
                    qt.ItemWeight = dt.ItemWeight;
                    qt.ItemWeightUnit = dt.ItemWeightUnit;

                    return Json(new { success = true, data = qt, data1 = dt });
                }
                else
                {
                    var dt = _db.DOItem.Where(x => x.DoNo == DONO && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Pnameid = _db.Productname.Where(x => x.productname == dt.Pname && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Psize = dt.Psize;
                    qt.Psizeid = _db.Productsize.Where(x => x.productsize == dt.Psize && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pclass = dt.Pclass;
                    qt.Pclassid = _db.Productclass.Where(x => x.productclass == dt.Pclass && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pmake = dt.Pmake;
                    qt.Pmakeid = _db.Productmake.Where(x => x.productmake == dt.Pmake && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Qty = dt.Qty;
                    qt.Qtyunit = dt.Qtyunit;
                    qt.AltQty = dt.AltQty;
                    qt.AltQtyunit = dt.AltQtyunit;
                    qt.ItemWeight = dt.ItemWeight;
                    qt.ItemWeightUnit = dt.ItemWeightUnit;

                    qt.Pmake = dt.Pmake;
                    qt.Qty = dt.Qty;

                    return Json(new { success = true, data = qt, data1 = dt });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getitemListbyid")]
        public IActionResult getitemListbyid(int itemidsr, int Itemid, string type, int tempDono, string DONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "temp")
                {
                    var dt = _db.TempDODespatchItem.Where(x => x.DoNodigit == tempDono && x.Itemid == Itemid && x.itemsrno == itemidsr && x.Companyid == comapnyid).FirstOrDefault();
                    var makeid = _db.Productmake.Where(a => a.productmake == dt.Pmake && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    var classid = _db.Productclass.Where(a => a.productclass == dt.Pclass && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    var warehouseid = _db.Godownname.Where(a => a.godownName == dt.Wharehouse && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    return Json(new { success = true, data = dt, data1 = makeid, data2 = classid, data3 = warehouseid });
                }
                else
                {
                    var dt = _db.DODespatchItem.Where(x => x.DoNo == DONO && x.Itemid == Itemid && x.itemsrno == itemidsr && x.Companyid == comapnyid && x.VoucherType == "DO").FirstOrDefault();
                    var makeid = _db.Productmake.Where(a => a.productmake == dt.Pmake && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    var classid = _db.Productclass.Where(a => a.productclass == dt.Pclass && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    var warehouseid = _db.Godownname.Where(a => a.godownName == dt.Wharehouse && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    return Json(new { success = true, data = dt, data1 = makeid, data2 = classid, data3 = warehouseid });

                }
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
        [HttpPost]
        [Route("Addtempcompanydetails")]
        public IActionResult Addtempcompanydetails(TempDODetials dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];

                var data = _db.TempDODetials.Where(a => a.DoNodigit == dt.DoNodigit && a.Companyid == comapnyid).FirstOrDefault();
                data.Userid = username;
                data.TransportCCode = dt.TransportCCode;
                data.TransportName = dt.TransportName;
                data.DriverName = dt.DriverName;
                data.Mobileno = dt.Mobileno;
                data.VechileNo = dt.VechileNo;
                data.License = dt.License;
                data.UnloadingIncharge = dt.UnloadingIncharge;

                data.Contratorid = dt.Contratorid;
                data.Contractor = dt.Contractor;
                data.ManualContratorid = dt.ManualContratorid;
                data.ManualContractor = dt.ManualContractor;
                data.CraneLoadingWeightkg = dt.CraneLoadingWeightkg;
                data.CraneLoadingWeightmt = dt.CraneLoadingWeightmt;
                data.CraneTotalCharge = dt.CraneTotalCharge;
                data.CraneCharge = dt.CraneCharge;

                data.ManualCharge = dt.ManualCharge;
                data.ManualLoadingWeightkg = dt.ManualLoadingWeightkg;
                data.ManualLoadingWeightmt = dt.ManualLoadingWeightmt;
                data.ManualTotalCharge = dt.ManualTotalCharge;

                data.FreightCharge = dt.FreightCharge;
                data.FreightType = dt.FreightType;
                data.Note = dt.Note;
                data.ForwardingTransportAmount = dt.ForwardingTransportAmount;
                data.GrNO = dt.GrNO;

                data.Companyid = comapnyid;

                _db.SaveChanges();
                return Json(new { success = true });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("Updatecompanydetails")]
        public IActionResult Updatecompanydetails(DODetials dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DODetials.Where(s => s.DoNo == dt.DoNo && s.Companyid == comapnyid && s.VoucherType == "DO").FirstOrDefault();

                data.TransportCCode = dt.TransportCCode;
                data.TransportName = dt.TransportName;
                data.DriverName = dt.DriverName;
                data.Mobileno = dt.Mobileno;
                data.VechileNo = dt.VechileNo;
                data.License = dt.License;
                data.UnloadingIncharge = dt.UnloadingIncharge;

                data.Contractor = dt.Contractor;
                data.Contratorid = dt.Contratorid;
                data.ManualContractor = dt.ManualContractor;
                data.ManualContratorid = dt.ManualContratorid;

                data.CraneLoadingWeightkg = dt.CraneLoadingWeightkg;
                data.CraneLoadingWeightmt = dt.CraneLoadingWeightmt;
                data.CraneTotalCharge = dt.CraneTotalCharge;
                data.CraneCharge = dt.CraneCharge;

                data.ManualCharge = dt.ManualCharge;
                data.ManualLoadingWeightkg = dt.ManualLoadingWeightkg;
                data.ManualLoadingWeightmt = dt.ManualLoadingWeightmt;
                data.ManualTotalCharge = dt.ManualTotalCharge;

                data.FreightCharge = dt.FreightCharge;
                data.FreightType = dt.FreightType;
                data.Note = dt.Note;
                data.ForwardingTransportAmount = dt.ForwardingTransportAmount;
                data.GrNO = dt.GrNO;
                data.Companyid = comapnyid;


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
        public JsonResult AddNewTempItem(string type, TempDODespatchItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var itemsr = _db.TempDODespatchItem.Where(a => a.DoNodigit == itemmaster.DoNodigit && a.Companyid == comapnyid && a.Itemid == itemmaster.Itemid).Select(p => p.itemsrno).DefaultIfEmpty().Max();
                    itemsr++;
                    var srno = _db.TempDODespatchItem.Where(a => a.DoNodigit == itemmaster.DoNodigit && a.Companyid == comapnyid).Select(p => p.SrNo).DefaultIfEmpty().Max();
                    srno++;
                    itemmaster.itemsrno = itemsr;
                    itemmaster.SrNo = srno;
                    itemmaster.Companyid = comapnyid;
                    _db.TempDODespatchItem.Add(itemmaster);
                    _db.SaveChanges();
                }
                else if (type == "Update")
                {
                    var data = _db.TempDODespatchItem.Where(a => a.DoNodigit == itemmaster.DoNodigit && a.Companyid == comapnyid && a.Itemid == itemmaster.Itemid && a.itemsrno == itemmaster.itemsrno).FirstOrDefault();
                    data.Altpclass = itemmaster.Altpclass;
                    data.Pclass = itemmaster.Pclass;
                    data.Pmake = itemmaster.Pmake;
                    data.Qty = itemmaster.Qty;
                    data.DespQty = itemmaster.DespQty;
                    data.Qtyunit = itemmaster.Qtyunit;
                    data.AltQty = itemmaster.AltQty;
                    data.AltQtyunit = itemmaster.AltQtyunit;
                    data.Wharehouse = itemmaster.Wharehouse;
                    data.ItemWeight = itemmaster.ItemWeight;
                    data.ItemWeightUnit = itemmaster.ItemWeightUnit;
                    data.UnloadedBy = itemmaster.UnloadedBy;
                    data.HeatNumber = itemmaster.HeatNumber;
                    data.Companyid = comapnyid;
                    _db.SaveChanges();
                }

                /*balance material*/
                var item = _db.TempDOItem.Where(s => s.DoNodigit == itemmaster.DoNodigit && s.Companyid == comapnyid && s.Itemid == itemmaster.Itemid).FirstOrDefault();
                item.Pname = itemmaster.Pname;
                item.Altpname = itemmaster.Altpname;
                item.Altpsize = itemmaster.Altpsize;
                item.Altpclass = itemmaster.Altpclass;
                item.Itemid = itemmaster.Itemid;
                item.Companyid = comapnyid;
                item.Qty = _db.TempDODespatchItem.Where(a => a.DoNodigit == item.DoNodigit && a.Companyid == comapnyid && a.Itemid == itemmaster.Itemid).Select(a => a.DespQty).Sum();
                var balqty = 0.0;
                var orderqty = item.orderqty;
                balqty = orderqty - item.Qty;
                item.Balanceqty = balqty;
                item.AltQty = _db.TempDODespatchItem.Where(a => a.DoNodigit == item.DoNodigit && a.Companyid == comapnyid && a.Itemid == itemmaster.Itemid).Select(a => a.AltQty).Sum();
                item.AltQtyunit = itemmaster.AltQtyunit;
                item.ItemWeight = _db.TempDODespatchItem.Where(a => a.DoNodigit == item.DoNodigit && a.Companyid == comapnyid && a.Itemid == itemmaster.Itemid).Select(a => a.ItemWeight).Sum();
                item.ItemWeightUnit = itemmaster.ItemWeightUnit;
                item.Psize = itemmaster.Psize;
                item.Pclass = itemmaster.Pclass;
                item.Pmake = itemmaster.Pmake;
                _db.SaveChanges();

                var data1 = _db.TempDODetials.Where(a => a.DoNodigit == item.DoNodigit && a.Companyid == comapnyid).FirstOrDefault();
                var clkg = _db.TempDODespatchItem.Where(a => a.DoNodigit == item.DoNodigit && a.UnloadedBy == "Crane" && a.Companyid == comapnyid).Select(a => a.ItemWeight).Sum();
                var mlkg = _db.TempDODespatchItem.Where(a => a.DoNodigit == item.DoNodigit && a.UnloadedBy == "Manual" && a.Companyid == comapnyid).Select(a => a.ItemWeight).Sum();
                var Blkg = _db.TempDODespatchItem.Where(a => a.DoNodigit == item.DoNodigit && a.UnloadedBy == "Crane & Manual" && a.Companyid == comapnyid).Select(a => a.ItemWeight).Sum();
                data1.CraneLoadingWeightkg = clkg + Blkg;
                data1.ManualLoadingWeightkg = mlkg + Blkg;
                data1.CraneLoadingWeightmt = data1.CraneLoadingWeightkg / 1000;
                data1.ManualLoadingWeightmt = data1.ManualLoadingWeightkg / 1000;
                _db.SaveChanges();
                var data12 = _db.TempDOItem.Where(a => a.DoNodigit == item.DoNodigit && a.Companyid == comapnyid).FirstOrDefault();

                return Json(new { success = true, data = data1, data1 = data12 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("AddNewItem")]
        public JsonResult AddNewItem(string type, DODespatchItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var itemsr = _db.DODespatchItem.Where(a => a.DoNo == itemmaster.DoNo && a.Itemid == itemmaster.Itemid && a.Companyid == comapnyid && a.VoucherType == "DO").Select(p => p.itemsrno).DefaultIfEmpty().Max();
                    itemsr++;
                    var srno = _db.DODespatchItem.Where(a => a.DoNo == itemmaster.DoNo && a.Companyid == comapnyid && a.VoucherType == "DO").Select(p => p.SrNo).DefaultIfEmpty().Max();
                    srno++;
                    itemmaster.itemsrno = itemsr;
                    itemmaster.SrNo = srno;
                    itemmaster.VoucherType = "DO";
                    itemmaster.Companyid = comapnyid;
                    _db.DODespatchItem.Add(itemmaster);
                    _db.SaveChanges();
                }
                else if (type == "Update")
                {
                    var data = _db.DODespatchItem.Where(a => a.DoNo == itemmaster.DoNo && a.Companyid == comapnyid && a.Itemid == itemmaster.Itemid && a.itemsrno == itemmaster.itemsrno && a.VoucherType == "DO").FirstOrDefault();
                    if (data != null)
                    {
                        data.Altpclass = itemmaster.Altpclass;
                        data.Pclass = itemmaster.Pclass;
                        data.Pmake = itemmaster.Pmake;
                        data.Qty = itemmaster.Qty;
                        data.DespQty = itemmaster.DespQty;
                        data.AltQty = itemmaster.AltQty;
                        data.DespQty = itemmaster.DespQty;
                        data.AltQtyunit = itemmaster.AltQtyunit;
                        data.Wharehouse = itemmaster.Wharehouse;
                        data.ItemWeight = itemmaster.ItemWeight;
                        data.ItemWeightUnit = itemmaster.ItemWeightUnit;
                        data.UnloadedBy = itemmaster.UnloadedBy;
                        data.HeatNumber = itemmaster.HeatNumber;
                        data.Companyid = comapnyid;
                        _db.SaveChanges();
                    }

                }
                var item = _db.DOItem.Where(s => s.DoNo == itemmaster.DoNo && s.Itemid == itemmaster.Itemid && s.Companyid == comapnyid).FirstOrDefault();
                item.Pname = itemmaster.Pname;
                item.Altpname = itemmaster.Altpname;
                item.Altpsize = itemmaster.Altpsize;
                item.Altpclass = itemmaster.Altpclass;
                item.Itemid = itemmaster.Itemid;
                item.Companyid = comapnyid;
                item.Qty = _db.DODespatchItem.Where(a => a.DoNo == item.DoNo && a.Itemid == itemmaster.Itemid && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.DespQty).Sum();
                var balqty = 0.0;
                var orderqty = item.orderqty;
                balqty = orderqty - item.Qty;
                item.Balanceqty = balqty;
                item.AltQty = _db.DODespatchItem.Where(a => a.DoNo == item.DoNo && a.Itemid == itemmaster.Itemid && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.AltQty).Sum();
                item.AltQtyunit = itemmaster.AltQtyunit;
                item.ItemWeight = _db.DODespatchItem.Where(a => a.DoNo == item.DoNo && a.Itemid == itemmaster.Itemid && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.ItemWeight).Sum();
                item.ItemWeightUnit = itemmaster.ItemWeightUnit;
                item.Psize = itemmaster.Psize;
                item.Pclass = itemmaster.Pclass;
                item.Pmake = itemmaster.Pmake;
                _db.SaveChanges();

                var data1 = _db.DODetials.Where(a => a.DoNo == item.DoNo && a.Companyid == comapnyid && a.VoucherType == "DO").FirstOrDefault();
                var clkg = _db.DODespatchItem.Where(a => a.DoNo == item.DoNo && a.UnloadedBy == "Crane" && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.ItemWeight).Sum();
                var mlkg = _db.DODespatchItem.Where(a => a.DoNo == item.DoNo && a.UnloadedBy == "Manual" && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.ItemWeight).Sum();
                var Blkg = _db.DODespatchItem.Where(a => a.DoNo == item.DoNo && a.UnloadedBy == "Crane & Manual" && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.ItemWeight).Sum();
                data1.CraneLoadingWeightkg = clkg + Blkg;
                data1.ManualLoadingWeightkg = mlkg + Blkg;
                data1.CraneLoadingWeightmt = data1.CraneLoadingWeightkg / 1000;
                data1.ManualLoadingWeightmt = data1.ManualLoadingWeightkg / 1000;
                _db.SaveChanges();

                var data12 = _db.DOItem.Where(a => a.DoNo == item.DoNo && a.Companyid == comapnyid).FirstOrDefault();

                return Json(new { success = true, data = data1, data1 = data12 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [HttpDelete]
        [Route("DeleteIT")]
        public IActionResult DeleteIT(int tempdo, int itmno, string dono, string type, int itemsrno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var data = _db.TempDODespatchItem.FirstOrDefault(u => u.DoNodigit == tempdo && u.Itemid == itmno && u.itemsrno == itemsrno && u.Companyid == comapnyid);
                    _db.TempDODespatchItem.Remove(data);
                    _db.SaveChanges();

                    var data1 = _db.TempDODetials.Where(a => a.DoNodigit == tempdo && a.Companyid == comapnyid).FirstOrDefault();
                    var clkg = _db.TempDODespatchItem.Where(a => a.DoNodigit == tempdo && a.UnloadedBy == "Crane" && a.Companyid == comapnyid).Select(a => a.ItemWeight).Sum();
                    var mlkg = _db.TempDODespatchItem.Where(a => a.DoNodigit == tempdo && a.UnloadedBy == "Manual" && a.Companyid == comapnyid).Select(a => a.ItemWeight).Sum();
                    var Blkg = _db.TempDODespatchItem.Where(a => a.DoNodigit == tempdo && a.UnloadedBy == "Crane & Manual" && a.Companyid == comapnyid).Select(a => a.ItemWeight).Sum();
                    data1.CraneLoadingWeightkg = clkg + Blkg;
                    data1.ManualLoadingWeightkg = mlkg + Blkg;
                    data1.CraneLoadingWeightmt = data1.CraneLoadingWeightkg / 1000;
                    data1.ManualLoadingWeightmt = data1.ManualLoadingWeightkg / 1000;
                    _db.SaveChanges();
                    var item = _db.TempDOItem.Where(s => s.DoNodigit == tempdo && s.Itemid == itmno && s.Companyid == comapnyid).FirstOrDefault();
                    item.Qty = _db.TempDODespatchItem.Where(a => a.DoNodigit == tempdo && a.Itemid == itmno && a.Companyid == comapnyid).Select(a => a.Qty).Sum();
                    var balqty = 0.0;
                    var orderqty = item.orderqty;
                    balqty = orderqty - item.Qty;
                    item.Balanceqty = balqty;
                    item.AltQty = _db.TempDODespatchItem.Where(a => a.DoNodigit == tempdo && a.Itemid == itmno && a.Companyid == comapnyid).Select(a => a.AltQty).Sum();
                    item.ItemWeight = _db.TempDODespatchItem.Where(a => a.DoNodigit == tempdo && a.Itemid == itmno && a.Companyid == comapnyid).Select(a => a.ItemWeight).Sum();
                    _db.SaveChanges();
                    return Json(new { success = true, data = data1, data1 = item });
                }
                else
                {
                    var data = _db.DODespatchItem.FirstOrDefault(u => u.DoNo == dono && u.Itemid == itmno && u.itemsrno == itemsrno && u.Companyid == comapnyid && u.VoucherType == "DO");
                    _db.DODespatchItem.Remove(data);
                    _db.SaveChanges();
                    var data1 = _db.DODetials.Where(a => a.DoNo == dono && a.Companyid == comapnyid && a.VoucherType == "DO").FirstOrDefault();
                    var clkg = _db.DODespatchItem.Where(a => a.DoNo == dono && a.UnloadedBy == "Crane" && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.ItemWeight).Sum();
                    var mlkg = _db.DODespatchItem.Where(a => a.DoNo == dono && a.UnloadedBy == "Manual" && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.ItemWeight).Sum();
                    var Blkg = _db.DODespatchItem.Where(a => a.DoNo == dono && a.UnloadedBy == "Crane & Manual" && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.ItemWeight).Sum();
                    data1.CraneLoadingWeightkg = clkg + Blkg;
                    data1.ManualLoadingWeightkg = mlkg + Blkg;
                    data1.CraneLoadingWeightmt = data1.CraneLoadingWeightkg / 1000;
                    data1.ManualLoadingWeightmt = data1.ManualLoadingWeightkg / 1000;
                    data1.Companyid = comapnyid;
                    _db.SaveChanges();

                    var item = _db.DOItem.Where(s => s.DoNo == dono && s.Itemid == itmno && s.Companyid == comapnyid).FirstOrDefault();
                    item.Qty = _db.DODespatchItem.Where(a => a.DoNo == dono && a.Itemid == itmno && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.Qty).Sum();
                    var balqty = 0.0;
                    var orderqty = item.orderqty;
                    balqty = orderqty - item.Qty;
                    item.Balanceqty = balqty;
                    item.AltQty = _db.DODespatchItem.Where(a => a.DoNo == dono && a.Itemid == itmno && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.AltQty).Sum();
                    item.ItemWeight = _db.DODespatchItem.Where(a => a.DoNo == dono && a.Itemid == itmno && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.ItemWeight).Sum();
                    _db.SaveChanges();
                    return Json(new { success = true, data = data1, data1 = item });

                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
        [Route("checkingLOD")]
        public IActionResult CheckingLOD(string dpno)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.tempLODetials.Where(x => x.Userid == username && x.Companyid == comapnyid && x.Dpno == dpno).FirstOrDefault();
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
        [Route("ConvertToLO")]
        public IActionResult ConvertToLO(string dpno)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var donodigit = _db.tempLODetials.Where(a => a.Userid == username && a.Companyid == comapnyid).Select(a => a.LoNodigit).FirstOrDefault();
                var tempDOdata = _db.tempLODetials.Where(u => u.Userid == username && u.Companyid == comapnyid).ToList(); ;
                if (tempDOdata != null)
                {
                    _db.tempLODetials.RemoveRange(tempDOdata);
                    _db.SaveChanges();
                }

                var tempDOItem = _db.tempLOItem.Where(u => u.LoNodigit == donodigit && u.Companyid == comapnyid).ToList();
                if (tempDOItem != null)
                {
                    _db.tempLOItem.RemoveRange(tempDOItem);
                    _db.SaveChanges();
                }

                var data = _db.DispatchedDetail.Where(a => a.DPNo == dpno && a.Companyid == comapnyid).FirstOrDefault();
                donodigit = _db.tempLODetials.Where(a => a.Companyid == comapnyid).Select(p => p.LoNodigit).DefaultIfEmpty().Max();
                donodigit++;
                if (data != null)
                {
                    var Tdo = new tempLODetials();
                    Tdo.LoNodigit = donodigit;
                    Tdo.Dpno = data.DPNo;
                    Tdo.Companyname = data.CustomerName;
                    Tdo.CompanyCode = data.Customerid;
                    Tdo.Address = _db.SOdetails.Where(a => a.SONo == data.SONO && a.Companyid == comapnyid).Select(a => a.BillAddress).FirstOrDefault();
                    Tdo.Companyid = comapnyid;
                    Tdo.Userid = username;
                    _db.tempLODetials.Add(Tdo);
                    _db.SaveChanges();
                }

                var item = _db.DispatchMaterial.Where(a => a.DPNO == dpno && a.Companyid == comapnyid).ToList();
                if (item != null)
                {
                    foreach (var tempitem in item)
                    {
                        var Tpi = new tempLOItem();
                        Tpi.LoNodigit = donodigit;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Pmake = tempitem.Pmake;
                        Tpi.orderqty = tempitem.Qty;
                        Tpi.orderunit = tempitem.Qtyunit;
                        Tpi.MTRQTy = 0;
                        Tpi.AltQty = 0;
                        Tpi.ItemWeight = 0;
                        Tpi.MaterialSource = "";
                        Tpi.Companyid = comapnyid;
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }
                }
                var data1 = _db.tempLODetials.Where(a => a.LoNodigit == donodigit).FirstOrDefault();
                return Json(new { success = true, data = data1 });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("LODONO")]
        public IActionResult LODONO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var DONodigit = _db.LODetials.Where(a => a.Companyid == comapnyid).Select(p => p.LoNodigit).DefaultIfEmpty().Max();
                var prefix = _db.Prefix.Where(a => a.Type == "dispachtedorder" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                DONodigit++;
                var dono = prefix + DONodigit;

                return Json(new { success = true, data = dono });
            }
            catch (Exception)
            {
                return Json(new { success = false });
            }
        }
        [Route("DeleteDO")]
        public IActionResult DeleteDO(string dono)
        {
            try
            {

                var companyid = Request.Cookies["companyid"];
                var data = _db.DODetials.Where(a => a.DoNo == dono && a.Companyid == companyid && a.VoucherType == "DO").FirstOrDefault();
                if (data != null)
                {
                    var dpno = data.Dpno;
                    var dODetials = _db.DODetials.Where(u => u.DoNo == dono && u.Companyid == companyid && u.VoucherType == "DO").ToList();
                    if (dODetials != null)
                    {
                        _db.DODetials.RemoveRange(dODetials);
                        _db.SaveChanges();
                    }
                    var doitem = _db.DOItem.Where(u => u.DoNo == dono && u.Companyid == companyid).ToList();
                    if (doitem != null)
                    {
                        _db.DOItem.RemoveRange(doitem);
                        _db.SaveChanges();
                    }
                    var dodespatchitem = _db.DODespatchItem.Where(u => u.DoNo == dono && u.Companyid == companyid && u.VoucherType == "DO").ToList();
                    if (dodespatchitem != null)
                    {
                        _db.DODespatchItem.RemoveRange(dodespatchitem);
                        _db.SaveChanges();
                    }
                    var dpstatus = _db.DispatchedDetail.Where(a => a.DPNo == dpno).FirstOrDefault();
                    if (dpstatus != null)
                    {
                        dpstatus.dpstatus = false;
                        _db.SaveChanges();
                    }
                }
                return Json(new { success = true, message = "Successfully deleted :)" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }



        }

        [Route("UpdateReservation")]
        public IActionResult UpdateReservation(string dono, DateTime currentTime, string type, int donodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var data = _db.TempDODetials.Where(a => a.Companyid == comapnyid && a.DoNodigit == donodigit).FirstOrDefault();
                    if (data != null)
                    {
                        data.ReservationTime = currentTime;
                        data.ReservedStatus = true;
                        _db.SaveChanges();
                    }
                }
                else
                {
                    var data = _db.DODetials.Where(a => a.Companyid == comapnyid && a.DoNo == dono && a.VoucherType == "DO").FirstOrDefault();
                    if (data != null)
                    {
                        data.ReservationTime = currentTime;
                        data.ReservedStatus = true;
                        _db.SaveChanges();
                    }
                }
                return Json(new { success = true });
            }
            catch (Exception)
            {
                return Json(new { success = false });
            }
        }

        [Route("RemoveReservation")]
        public IActionResult RemoveReservation(string dono, DateTime currentTime, string type, int donodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var data = _db.TempDODetials.Where(a => a.Companyid == comapnyid && a.DoNodigit == donodigit).FirstOrDefault();
                    if (data != null)
                    {
                        data.ReservationTime = currentTime;
                        data.ReservedStatus = false;
                        _db.SaveChanges();
                    }
                }
                else
                {
                    var data = _db.DODetials.Where(a => a.Companyid == comapnyid && a.DoNo == dono && a.VoucherType == "DO").FirstOrDefault();
                    if (data != null)
                    {
                        data.ReservationTime = currentTime;
                        data.ReservedStatus = false;
                        _db.SaveChanges();
                    }
                }
                return Json(new { success = true });
            }
            catch (Exception)
            {
                return Json(new { success = false });
            }
        }

        [Route("SearchDo")]
        public IActionResult SearchDo(string searchtype, string searchValue, DateTime frmdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (searchtype == "PARTY")
                {
                    var data = _db.DODetials.Where(x => x.SupplierCompanyname.Contains(searchValue) && x.Companyid == comapnyid && x.VoucherType == "DO").ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.DoDate.Date) });
                }
                else if (searchtype == "PONO")
                {
                    var data = _db.DODetials.Where(x => x.PoNo.Contains(searchValue) && x.Companyid == comapnyid && x.VoucherType == "DO").ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.DoDate.Date) });
                }
                else if (searchtype == "GRNO")
                {
                    var data = _db.DODetials.Where(x => x.GrNO.Contains(searchValue) && x.Companyid == comapnyid && x.VoucherType == "DO").ToList();

                    return Json(new { success = true, data = data.OrderBy(a => a.DoDate.Date) });

                }
                else if (searchtype == "DONO")
                {
                    var data = _db.DODetials.Where(x => x.DoNo.Contains(searchValue) && x.Companyid == comapnyid && x.VoucherType == "DO").ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.DoDate.Date) });

                }
                else if (searchtype == "HEAT")
                {
                    var data = (from doitem in _db.DODespatchItem join dtt in _db.DODetials on doitem.DoNo equals dtt.DoNo where doitem.Companyid == comapnyid && doitem.VoucherType == "DO" && dtt.Companyid == comapnyid && doitem.HeatNumber.Contains(searchValue) select new { DoNo = doitem.DoNo, SupplierCompanyname = dtt.SupplierCompanyname, DoDate = dtt.DoDate }).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.DoDate.Date) });

                }
                else if(searchtype == "VECHILE")
                {
                    var data = _db.DODetials.Where(x => x.VechileNo.Contains(searchValue) && x.Companyid == comapnyid && x.VoucherType == "DO").ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.DoDate.Date) });
                }
                else
                {
                    var data = _db.DODetials.Where(x => x.DoDate.Date >= frmdate.Date && x.DoDate.Date <= todate.Date && x.Companyid == comapnyid && x.VoucherType == "DO").ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.DoDate.Date) });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("RangeApprovedTable")]
        public IActionResult RangeApprovedTable(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                List<DOViewreport> dt = new List<DOViewreport>();
                var data = _db.DODetials.Where(a => a.status == true && a.Companyid == comapnyid && a.VoucherType == "DO" && a.DoDate.Date >= fromdate.Date && a.DoDate.Date <= todate.Date).ToList().OrderByDescending(s => s.DoNodigit);
                foreach (var temp in data)
                {
                    DOViewreport vl = new DOViewreport();

                    vl.doNo = temp.DoNo;
                    vl.piNo = temp.SoNo;
                    vl.poNo = temp.PoNo;
                    vl.doDate = temp.DoDate;
                    vl.Donodigit = temp.DoNodigit;
                    vl.supplierCompanyname = temp.SupplierCompanyname;
                    vl.created = temp.Userid;
                    vl.rejected = _db.DOReason.Where(a => a.Dono == temp.DoNo && a.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault();
                    vl.Companyid = comapnyid;
                    dt.Add(vl);
                }
                return Json(new { success = true, data = dt.OrderByDescending(a => a.doDate) });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("jumptoPrevious")]
        public IActionResult jumptoPrevious(int donodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var prnod = _db.DODetials.Where(a => a.DoNodigit < donodigit && a.Companyid == comapnyid && a.VoucherType == "DO").OrderByDescending(a => a.DoNodigit).Select(a => a.DoNo).FirstOrDefault();

                if (prnod != null)
                {
                    return Json(new { success = true, data = prnod });
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
        public IActionResult jumptoNext(int donodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var prnod = _db.DODetials.Where(a => a.DoNodigit > donodigit && a.Companyid == comapnyid && a.VoucherType == "DO").Select(a => a.DoNo).FirstOrDefault();
                if (prnod != null)
                {
                    return Json(new { success = true, data = prnod });
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

        [Route("refreshitem")]
        public IActionResult refreshitem(int donodigit, string dpno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                    var tempDOItem = _db.TempDOItem.Where(u => u.DoNodigit == donodigit && u.Companyid == comapnyid).ToList();
                    if (tempDOItem != null)
                    {
                        _db.TempDOItem.RemoveRange(tempDOItem);
                        _db.SaveChanges();
                    }
                    var tempDOItem1 = _db.TempDODespatchItem.Where(a => a.DoNodigit == donodigit && a.Companyid == comapnyid).ToList();
                    if (tempDOItem1 != null)
                    {
                        _db.TempDODespatchItem.RemoveRange(tempDOItem1);
                        _db.SaveChanges();
                    }
                
                var item = _db.DispatchMaterial.Where(a => a.DPNO == dpno && a.Companyid == comapnyid).ToList();
                if (item != null)
                {
                    foreach (var tempitem in item)
                    {
                        TempDOItem Tpi = new TempDOItem();


                        Tpi.DoNodigit = donodigit;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Altpname = tempitem.Altpname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Altpsize = tempitem.Altpsize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Altpclass = tempitem.Altpclass;
                        Tpi.Pmake = tempitem.Pmake;
                        Tpi.Qty = 0;
                        Tpi.Qtyunit = tempitem.Rateunit;
                        Tpi.orderqty = tempitem.Qty;
                        Tpi.Balanceqty = tempitem.Qty;
                        Tpi.Companyid = comapnyid;
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }
                }
                return Json(new { success = true, data = donodigit });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


    }
}
