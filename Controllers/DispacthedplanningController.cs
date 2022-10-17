using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SALES_ERP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Controllers
{
    [Route("api/DP")]
    public class DispacthedplanningController : Controller
    {
        public readonly ApplicationDBContext _db;
        public DispacthedplanningController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }
        [Route("GetSOTable")]
        public IActionResult GetSOTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SOdetails.ToList().OrderByDescending(s => s.SONodigit).Where(a => a.Status == false && a.Companyid == comapnyid);
                foreach (var dt in data)
                {
                    dt.counter = _db.Attachment.Where(a => a.voucherno == dt.SONo && a.companyid == comapnyid && a.vouchername == "SALE_ORDER").Count();
                }
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("GetHoldTable")]
        public IActionResult GetHoldTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                List<dp> cond = new List<dp>();
                var data = _db.DispatchedDetail.Where(a => a.Status == "hold" && a.Companyid == comapnyid).ToList().OrderBy(a => a.CustomerName);
                var counter = 0;
                foreach (var tempitem in data)
                {
                    var sodt = _db.SOdetails.Where(a => a.SONo == tempitem.SONO && a.Companyid == comapnyid).FirstOrDefault();
                    if (sodt != null)
                    {
                        dp dp1 = new dp();
                        dp1.Sr = ++counter;
                        dp1.DPDate = tempitem.DPDate;
                        dp1.DPNo = tempitem.DPNo;
                        dp1.DPNodigit = tempitem.DPNodigit;
                        dp1.Amount = tempitem.amount;
                        dp1.dldate = sodt.DeliveryDate;
                        dp1.PODate = sodt.PODate;
                        dp1.PONO = sodt.PONo;
                        dp1.CustomerName = tempitem.CustomerName;
                        dp1.destination = sodt.ConsignCity + ", " + sodt.ConsignState;
                        dp1.SupplierName = tempitem.SupplierName;
                        dp1.materialsource = tempitem.DispachtedLocation;
                        dp1.Incharge = tempitem.Incharge;
                        dp1.Remarks = tempitem.Remarks;
                        cond.Add(dp1);
                    }
                    else
                    {
                    }
                }
                var data1 = cond.OrderBy(a => a.Sr);

                return Json(new { success = true, data = data1 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("GetCancelTable")]
        public IActionResult GetCancelTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                List<dp> cond = new List<dp>();
                var data = _db.DispatchedDetail.Where(a => a.Status == "cancel" && a.Companyid == comapnyid).ToList();
                foreach (var tempitem in data)
                {
                    dp dp1 = new dp();
                    dp1.DPDate = tempitem.DPDate;
                    dp1.DPNo = tempitem.DPNo;
                    dp1.DPNodigit = tempitem.DPNodigit;
                    dp1.Amount = 0;
                }

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("GetDailyDispatchTable")]
        public IActionResult GetDailyDispatchTable(DateTime edate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data2 = new List<DispatchedDetail>();
                var data = _db.DispatchedDetail.ToList().OrderBy(s => s.CustomerName).Where(a => a.Status == "dispatch" && a.DPDate.Date == edate && a.Companyid == comapnyid);
                foreach (var dt1 in data)
                {
                    var dt = new DispatchedDetail();
                    dt.amount = dt1.amount;
                    dt.Companyid = dt1.Companyid;
                    dt.Customerid = dt1.Customerid;
                    dt.CustomerName = dt1.CustomerName;
                    dt.deliveryaddress = _db.SOdetails.Where(a => a.SONo == dt1.SONO).Select(a => a.ConsignAddress).FirstOrDefault();
                    dt.DispachtedLocation = dt1.DispachtedLocation;
                    dt.dono = dt1.dono;
                    dt.DPDate = dt1.DPDate;
                    dt.DPNo = dt1.DPNo;
                    dt.DPNodigit = dt1.DPNodigit;
                    dt.dpstatus = dt1.dpstatus;
                    dt.Fromm = dt1.Fromm;
                    dt.HoldReason = dt1.HoldReason;
                    dt.Incharge = dt1.Incharge;
                    dt.PONO = dt1.PONO;
                    dt.Remarks = dt1.Remarks;
                    dt.SONO = dt1.SONO;
                    dt.Status = dt1.Status;
                    dt.SupplierId = dt1.SupplierId;
                    dt.SupplierName = dt1.SupplierName;
                    data2.Add(dt);
                }
                return Json(new { success = true, data = data2 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("WaitingDespatchReport")]
        public IActionResult WaitingDespatchReport()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data2 = new List<DispatchedDetail>();
                var data = _db.DispatchedDetail.ToList().OrderByDescending(s => s.CustomerName).Where(a => a.dpstatus == false && a.Status == "dispatch" && a.Companyid == comapnyid);
                foreach (var dt1 in data)
                {
                    var dt = new DispatchedDetail();
                    dt.amount = dt1.amount;
                    dt.Companyid = dt1.Companyid;
                    dt.Customerid = dt1.Customerid;
                    dt.CustomerName = dt1.CustomerName;
                    dt.deliveryaddress = _db.SOdetails.Where(a => a.SONo == dt1.SONO).Select(a => a.ConsignAddress).FirstOrDefault();
                    dt.DispachtedLocation = dt1.DispachtedLocation;
                    dt.dono = dt1.dono;
                    dt.DPDate = dt1.DPDate;
                    dt.DPNo = dt1.DPNo;
                    dt.DPNodigit = dt1.DPNodigit;
                    dt.dpstatus = dt1.dpstatus;
                    dt.Fromm = dt1.Fromm;
                    dt.HoldReason = dt1.HoldReason;
                    dt.Incharge = dt1.Incharge;
                    dt.PONO = dt1.PONO;
                    dt.Remarks = dt1.Remarks;
                    dt.SONO = dt1.SONO;
                    dt.Status = dt1.Status;
                    dt.SupplierId = dt1.SupplierId;
                    dt.SupplierName = dt1.SupplierName;
                    data2.Add(dt);
                }

                return Json(new { success = true, data = data2 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("DPNO")]
        public IActionResult DPNO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var dpnodigit = _db.DispatchedDetail.Where(a => a.Companyid == comapnyid).Select(a => a.DPNodigit).DefaultIfEmpty().Max();
                dpnodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "dispachtedPlanningVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var quotno = prefix + dpnodigit;
                return Json(new { success = true, data = quotno });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [HttpPost]
        [Route("saveplanning")]
        public IActionResult saveplanning(DispatchedDetail sd, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var dpnodigit = _db.DispatchedDetail.Where(a => a.Companyid == comapnyid).Select(p => p.DPNodigit).DefaultIfEmpty().Max();
                    dpnodigit++;

                    var prefix = _db.Prefix.Where(a => a.Type == "dispachtedPlanningVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    sd.DPNodigit = dpnodigit;
                    sd.Companyid = comapnyid;
                    var quotno = prefix + dpnodigit;
                    sd.DPNo = quotno;

                    sd.amount = _db.SOdetails.Where(a => a.SONo == sd.SONO && a.Companyid == comapnyid).Select(a => a.Amount).FirstOrDefault();
                    _db.DispatchedDetail.Add(sd);
                    _db.SaveChanges();


                    var data = _db.SOItem.Where(u => u.Sono == sd.SONO && u.Companyid == comapnyid).ToList().OrderBy(a => a.Itemid);
                    foreach (var tempitem in data)
                    {
                        DispatchMaterial item = new DispatchMaterial();
                        item.DPNO = quotno;
                        item.Sono = sd.SONO;
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
                        item.Companyid = comapnyid;
                        item.status = true;
                        _db.DispatchMaterial.Add(item);
                        _db.SaveChanges();
                    }
                    var data1 = _db.SOdetails.Where(s => s.SONo == sd.SONO && s.Companyid == comapnyid).FirstOrDefault();
                    data1.Status = true;
                    _db.SaveChanges();


                    return Json(new { success = true, data = sd.DPNo });
                }
                else
                {
                    var data = _db.DispatchedDetail.Where(a => a.DPNo == sd.DPNo && a.Companyid == comapnyid).FirstOrDefault();
                    data.SupplierName = sd.SupplierName;
                    data.SupplierId = sd.SupplierId;
                    data.Status = sd.Status;
                    data.Remarks = sd.Remarks;
                    data.HoldReason = sd.HoldReason;
                    data.Incharge = sd.Incharge;
                    data.DispachtedLocation = sd.DispachtedLocation;
                    data.Companyid = comapnyid;
                    data.DPDate = sd.DPDate;
                    _db.SaveChanges();
                    return Json(new { success = true, data = sd.DPNo });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("saveplanningPending")]
        public IActionResult saveplanningPending(DispatchedDetail sd, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var dpnodigit = _db.DispatchedDetail.Where(a => a.Companyid == comapnyid).Select(p => p.DPNodigit).DefaultIfEmpty().Max();
                    dpnodigit++;

                    var prefix = _db.Prefix.Where(a => a.Type == "dispachtedPlanningVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    sd.DPNodigit = dpnodigit;
                    sd.Companyid = comapnyid;
                    var quotno = prefix + dpnodigit;
                    sd.DPNo = quotno;
                    sd.amount = _db.HoldMaterial.Where(a => a.DONO == sd.dono && a.Companyid == comapnyid).Select(a => a.Amount).Sum();
                    _db.DispatchedDetail.Add(sd);
                    _db.SaveChanges();


                    var data = _db.HoldMaterial.Where(u => u.DONO == sd.dono && u.Companyid == comapnyid).ToList().OrderBy(a => a.Itemid);
                    foreach (var tempitem in data)
                    {
                        DispatchMaterial item = new DispatchMaterial();
                        item.DPNO = quotno;
                        item.Sono = sd.SONO;
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
                        item.Companyid = comapnyid;
                        item.status = true;
                        _db.DispatchMaterial.Add(item);
                        _db.SaveChanges();
                    }
                    var dat = _db.HoldMaterial.Where(a => a.DONO == sd.dono && a.Companyid == comapnyid).ToList();
                    dat.ForEach(a => a.status = true);
                    _db.SaveChanges();
                    return Json(new { success = true, data = sd.DPNo });
                }
                else
                {
                    var data = _db.DispatchedDetail.Where(a => a.DPNo == sd.DPNo && a.Companyid == comapnyid).FirstOrDefault();
                    data.SupplierName = sd.SupplierName;
                    data.SupplierId = sd.SupplierId;
                    data.Status = sd.Status;
                    data.Remarks = sd.Remarks;
                    data.HoldReason = sd.HoldReason;
                    data.Incharge = sd.Incharge;
                    data.DispachtedLocation = sd.DispachtedLocation;
                    data.Companyid = comapnyid;
                    data.DPDate = sd.DPDate;
                    _db.SaveChanges();
                    return Json(new { success = true, data = sd.DPNo });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("GetDispatchMaterial")]
        public IActionResult GetDispatchMaterial(string DPNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DispatchMaterial.ToList().OrderBy(s => s.Itemid).Where(a => a.DPNO == DPNO && a.Companyid == comapnyid && a.status == true);
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("GetHoldMaterial")]
        public IActionResult GetHoldMaterial(string DPNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DispatchMaterial.ToList().OrderByDescending(s => s.Itemid).Where(a => a.DPNO == DPNO && a.Companyid == comapnyid && a.status == false);
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("GetHoldMateriall")]
        public IActionResult GetHoldMateriall()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var vd = _db.DispatchedDetail.Where(a => a.Companyid == comapnyid && a.Status == "hold").ToList();
                List<HoldMaterial> hm = new List<HoldMaterial>();
                foreach (var tmp in vd)
                {
                    var data = _db.DispatchMaterial.Where(a => a.Companyid == comapnyid &&  a.DPNO==tmp.DPNo).ToList().OrderByDescending(s => s.Itemid);
                    foreach(var dt in data)
                    {
                        HoldMaterial hmm = new HoldMaterial();
                        hmm.Pname = dt.Pname;
                        hmm.Psize = dt.Psize;
                        hmm.Pclass = dt.Pclass;
                        hmm.Pmake = dt.Pmake;
                        hmm.Qty = Math.Round(dt.Qty,2);
                        hmm.Qtyunit = dt.Rateunit;
                        hmm.pono = tmp.PONO;
                        hmm.companyname = tmp.CustomerName;
                        hm.Add(hmm);
                    }
                }
                
                return Json(new { success = true, data = hm });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("holditem")]
        public IActionResult holditem(string dpno, int itemid)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DispatchMaterial.Where(a => a.DPNO == dpno && a.Itemid == itemid && a.Companyid == comapnyid).FirstOrDefault();
                data.status = false;
                _db.SaveChanges();

                var data1 = _db.DispatchedDetail.Where(a => a.DPNo == dpno && a.Companyid == comapnyid).FirstOrDefault();
                data1.amount = _db.DispatchMaterial.Where(u => u.DPNO == dpno && u.status == true && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                _db.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("Unholditem")]
        public IActionResult Unholditem(string dpno, int itemid)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DispatchMaterial.Where(a => a.DPNO == dpno && a.Itemid == itemid && a.Companyid == comapnyid).FirstOrDefault();
                data.status = true;
                _db.SaveChanges();
                var data1 = _db.DispatchedDetail.Where(a => a.DPNo == dpno && a.Companyid == comapnyid).FirstOrDefault();
                data1.amount = _db.DispatchMaterial.Where(u => u.DPNO == dpno && u.status == true && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                _db.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("viewDP")]
        public IActionResult viewDP(string DPNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DispatchedDetail.Where(a => a.DPNo == DPNO && a.Companyid == comapnyid).FirstOrDefault();
                data.dono = _db.HoldMaterial.Where(a => a.DPNO == DPNO && a.status == false).Select(a => a.DONO).FirstOrDefault();
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("viewDPItem")]
        public IActionResult viewDPItem(string DPNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DispatchMaterial.ToList().OrderBy(s => s.Itemid).Where(a => a.DPNO == DPNO && a.Companyid == comapnyid);
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("viewDPItem1")]
        public IActionResult viewDPItem1(string DPNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.HoldMaterial.ToList().OrderBy(s => s.Itemid).Where(a => a.DPNO == DPNO && a.Companyid == comapnyid && a.status == false);
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
                counters ct = new counters();
                ct.saleorder = _db.SOdetails.Where(a => a.Status == false && a.Companyid == comapnyid).Count();
                ct.waiting = _db.DispatchedDetail.Where(a => a.dpstatus == false && a.Status == "dispatch" && a.Companyid == comapnyid).Count();
                ct.cancelled = _db.DispatchedDetail.Where(a => a.Status == "cancel" && a.Companyid == comapnyid).Count();
                ct.holdorder = _db.DispatchedDetail.Where(a => a.Status == "hold" && a.Companyid == comapnyid).Count();
                ct.dailyplanning = _db.DispatchedDetail.Where(a => a.Status == "dispatch" && a.DPDate.Date == edate && a.Companyid == comapnyid).Count();
                ct.pendingMaterial = _db.HoldMaterial.Where(a => a.date.Date < edate && a.status == false && a.Companyid == comapnyid).Select(a => new { a.DPNO, a.Sono, a.DONO }).ToList().Distinct().Count();
                return Json(new { success = true, data = ct });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("GetPendingMaterial")]
        public IActionResult GetPendingMaterial(DateTime edate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data2 = new List<DispatchedDetail>();
                var data = (from itm in _db.HoldMaterial join dp in _db.DispatchedDetail on itm.DPNO equals dp.DPNo where itm.Companyid == comapnyid && dp.Companyid == comapnyid && itm.date.Date < edate && itm.status == false group new { dp, itm } by new { dp.SONO, dp.DPNo, itm.DONO, dp.CustomerName, dp.PONO, dp.DPDate, dp.SupplierName, dp.Incharge, dp.DispachtedLocation } into gr select new { amount = gr.Sum(a => a.itm.Amount), SONO = gr.Key.SONO, DPNo = gr.Key.DPNo, DONO = gr.Key.DONO, CustomerName = gr.Key.CustomerName, PONO = gr.Key.PONO, DPDate = gr.Key.DPDate, SupplierName = gr.Key.SupplierName }).ToList().OrderByDescending(a => a.DPDate);
                foreach (var dt1 in data)
                {
                    var dt = new DispatchedDetail();
                    dt.amount = dt1.amount;
                    dt.Companyid = comapnyid;
                    dt.CustomerName = dt1.CustomerName;
                    dt.deliveryaddress = _db.SOdetails.Where(a => a.SONo == dt1.SONO).Select(a => a.ConsignAddress).FirstOrDefault();
                    dt.DispachtedLocation = _db.DispatchedDetail.Where(a => a.DPNo == dt1.DPNo).Select(a => a.DispachtedLocation).FirstOrDefault();
                    dt.DPDate = dt1.DPDate;
                    dt.DPNo = dt1.DPNo;
                    dt.Incharge = _db.DispatchedDetail.Where(a => a.DPNo == dt1.DPNo).Select(a => a.Incharge).FirstOrDefault();
                    dt.PONO = dt1.PONO;
                    dt.Remarks = _db.DispatchedDetail.Where(a => a.DPNo == dt1.DPNo).Select(a => a.Remarks).FirstOrDefault();
                    dt.SONO = dt1.SONO;
                    dt.SupplierId = _db.DispatchedDetail.Where(a => a.DPNo == dt1.DPNo).Select(a => a.SupplierId).FirstOrDefault();
                    dt.SupplierName = dt1.SupplierName;
                    data2.Add(dt);
                }

                return Json(new { success = true, data = data2 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("viewDP1")]
        public IActionResult viewDP1(string DPNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.DispatchedDetail.Where(a => a.DPNo == DPNO && a.Companyid == comapnyid).FirstOrDefault();
                data.amount = _db.HoldMaterial.Where(a => a.DPNO == DPNO && a.Companyid == comapnyid).Select(a => a.Amount).Sum();
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [HttpDelete]
        [Route("deletePlannings")]
        public IActionResult deletePlannings(string frm, string DPNO, string sono, string dono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var dpdetails = _db.DispatchedDetail.Where(a => a.Companyid == comapnyid && a.DPNo == DPNO).ToList();
                if (dpdetails != null)
                {
                    _db.DispatchedDetail.RemoveRange(dpdetails);
                    _db.SaveChanges();
                }

                var dpitem = _db.DispatchMaterial.Where(a => a.Companyid == comapnyid && a.DPNO == DPNO).ToList();
                if (dpitem != null)
                {
                    _db.DispatchMaterial.RemoveRange(dpitem);
                    _db.SaveChanges();
                }
                var dpholditem = _db.HoldMaterial.Where(a => a.Companyid == comapnyid && a.DPNO == DPNO).ToList();
                if (dpholditem != null)
                {
                    _db.HoldMaterial.RemoveRange(dpholditem);
                    _db.SaveChanges();
                }
                if (frm == "SO")
                {
                    var sodetails = _db.SOdetails.Where(a => a.SONo == sono && a.Companyid == comapnyid).FirstOrDefault();
                    if (sodetails != null)
                    {
                        sodetails.Status = false;
                        _db.SaveChanges();
                    }
                }
                else if (frm == "PENDING")
                {
                    var pendingdetail = _db.HoldMaterial.Where(a => a.Companyid == comapnyid && a.DONO == dono).ToList();
                    pendingdetail.ForEach(a => a.status = false);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
        [Route("GetSearchTable")]
        public IActionResult GetSearchTable(string searchby, string searchvalue)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var dplist = new List<dp>();
                var counter = 0;
                if (searchby == "customerName")
                {
                    var data = _db.DispatchedDetail.Where(a => a.CustomerName.Contains(searchvalue) && a.Companyid == comapnyid).ToList().OrderBy(a => a.CustomerName);
                    foreach (var tempitem in data)
                    {
                        var sodt = _db.SOdetails.Where(a => a.SONo == tempitem.SONO).FirstOrDefault();
                        dp dp1 = new dp();

                        dp1.Sr = ++counter;
                        dp1.DPDate = tempitem.DPDate;
                        dp1.DPNo = tempitem.DPNo;
                        dp1.DPNodigit = tempitem.DPNodigit;
                        dp1.Amount = tempitem.amount;
                        dp1.dldate = sodt.DeliveryDate;
                        dp1.PODate = sodt.PODate;
                        dp1.PONO = sodt.PONo;
                        dp1.SONO = sodt.SONo;
                        dp1.CustomerName = tempitem.CustomerName;
                        dp1.destination = sodt.ConsignCity + ", " + sodt.ConsignState;
                        dp1.SupplierName = tempitem.SupplierName;
                        dp1.materialsource = tempitem.DispachtedLocation;
                        dp1.Incharge = tempitem.Incharge;
                        dp1.Remarks = tempitem.Remarks;
                        dp1.orderstatus = tempitem.Status;
                        dplist.Add(dp1);
                    }

                    /*   var data1 = from itm in _db.HoldMaterial
                                   join det in _db.SOdetails on itm.Sono equals det.SONo
                                   where det.BillCompanyname.Contains(searchvalue) && itm.Companyid == comapnyid && det.Companyid == comapnyid && itm.status == false 
                                   select new { SONO = itm.Sono, PONO = det.PONo, CustomerName = det.BillCompanyname };
                       foreach (var tempitem1 in data1)
                       {
                           var sodt1 = _db.SOdetails.Where(a=> a.SONo == tempitem1.SONO).FirstOrDefault();
                           dp dp1 = new dp();

                           dp1.Sr = ++counter;
                           dp1.Amount = 0;
                           dp1.dldate = sodt1.DeliveryDate;
                           dp1.PODate = sodt1.PODate;
                           dp1.PONO = sodt1.PONo;
                           dp1.SONO = sodt1.SONo;
                           dp1.CustomerName = tempitem1.CustomerName;
                           dp1.destination = sodt1.ConsignCity + ", " + sodt1.ConsignState;
                           dp1.SupplierName = "";
                           dp1.materialsource ="";
                           dp1.Incharge ="";
                           dp1.Remarks = "";
                           dp1.orderstatus = "PENDING";
                           dplist.Add(dp1);
                       }*/

                }
                else if (searchby == "SONO")
                {
                    var data = _db.DispatchedDetail.Where(a => a.SONO.Contains(searchvalue) && a.Companyid == comapnyid).ToList().OrderBy(a => a.CustomerName);
                    foreach (var tempitem in data)
                    {
                        var sodt = _db.SOdetails.Where(a => a.SONo == tempitem.SONO).FirstOrDefault();
                        dp dp1 = new dp();
                        dp1.Sr = ++counter;
                        dp1.DPDate = tempitem.DPDate;
                        dp1.DPNo = tempitem.DPNo;
                        dp1.DPNodigit = tempitem.DPNodigit;
                        dp1.Amount = tempitem.amount;
                        dp1.dldate = sodt.DeliveryDate;
                        dp1.PODate = sodt.PODate;
                        dp1.PONO = sodt.PONo;
                        dp1.SONO = sodt.SONo;
                        dp1.CustomerName = tempitem.CustomerName;
                        dp1.destination = sodt.ConsignCity + ", " + sodt.ConsignState;
                        dp1.SupplierName = tempitem.SupplierName;
                        dp1.materialsource = tempitem.DispachtedLocation;
                        dp1.Incharge = tempitem.Incharge;
                        dp1.Remarks = tempitem.Remarks;
                        dp1.orderstatus = tempitem.Status;
                        dplist.Add(dp1);
                    }
                }
                else
                {
                    var data = _db.DispatchedDetail.Where(a => a.PONO.Contains(searchvalue) && a.Companyid == comapnyid).ToList().OrderBy(a => a.CustomerName);
                    foreach (var tempitem in data)
                    {
                        var sodt = _db.SOdetails.Where(a => a.SONo == tempitem.SONO).FirstOrDefault();
                        dp dp1 = new dp();
                        dp1.Sr = ++counter;
                        dp1.DPDate = tempitem.DPDate;
                        dp1.DPNo = tempitem.DPNo;
                        dp1.DPNodigit = tempitem.DPNodigit;
                        dp1.Amount = tempitem.amount;
                        dp1.dldate = sodt.DeliveryDate;
                        dp1.PODate = sodt.PODate;
                        dp1.PONO = sodt.PONo;
                        dp1.SONO = sodt.SONo;
                        dp1.CustomerName = tempitem.CustomerName;
                        dp1.destination = sodt.ConsignCity + ", " + sodt.ConsignState;
                        dp1.SupplierName = tempitem.SupplierName;
                        dp1.materialsource = tempitem.DispachtedLocation;
                        dp1.Incharge = tempitem.Incharge;
                        dp1.Remarks = tempitem.Remarks;
                        dp1.orderstatus = tempitem.Status;

                        dplist.Add(dp1);
                    }

                }
                return Json(new { success = true, data = dplist });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }

        [Route("viewSO")]
        public IActionResult viewSO(string sono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SOdetails.Where(x => x.SONo == sono && x.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    var dpnodigit = _db.DispatchedDetail.Where(a => a.Companyid == comapnyid).Select(a => a.DPNodigit).DefaultIfEmpty().Max();
                    dpnodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "dispachtedPlanningVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    var quotno = prefix + dpnodigit;
                    return Json(new { success = true, data = data, dpno = quotno });
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
    }
}
