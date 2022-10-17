using SALES_ERP.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Globalization;

namespace SALES_ERP.Controllers
{
    [Route("api/stockreport")]
    public class StockReportController : Controller
    {
        public readonly ApplicationDBContext _db;
        public StockReportController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("GodownWise")]
        public IActionResult GodownWise(DateTime ddate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = ((from itm in _db.ItemMaster
                             join op in _db.OpeningStock on itm.ItemId equals op.ItemId
                             where itm.Companyid == comapnyid && op.Companyid == comapnyid
                             group new { op, itm } by
new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, op.qty, op.altQty }
                              into gr
                             select
                     new
                     {
                         pname = gr.Key.pname,
                         psize = gr.Key.size,
                         pclass = gr.Key.Class,
                         pmake = gr.Key.ItemBrand,
                         location = gr.Key.GodownLocation,
                         qty = gr.Key.qty,
                         altqty = gr.Key.altQty,
                         outqty = 0.0,
                         outaltqty = 0.0
                     }).ToList().
                          Union((from itm in _db.PurchaseRecievedItem
                                 join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo
                                 where dtl.PrDate.Date <= ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid
                                 group new { dtl, itm } by
new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse }
                                  into gr
                                 select
                         new
                         {
                             pname = gr.Key.Pname,
                             psize = gr.Key.Psize,
                             pclass = gr.Key.Pclass,
                             pmake = gr.Key.Pmake,
                             location = gr.Key.Wharehouse,
                             qty = gr.Sum(a => a.itm.Qty),
                             altqty = gr.Sum(a => a.itm.AltQty),
                             outqty = 0.0, outaltqty = 0.0
                         }).ToList()).
                           Union((from itm in _db.DODespatchItem
                                  join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo
                                  where dtl.DoDate.Date <= ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid
                                  group new { dtl, itm } by
new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse }
                                  into gr
                                  select
                          new
                          {
                              pname = gr.Key.Pname,
                              psize = gr.Key.Psize,
                              pclass = gr.Key.Pclass,
                              pmake = gr.Key.Pmake,
                              location = gr.Key.Wharehouse,
                              qty = 0.0,
                              altqty = 0.0,
                              outqty = gr.Sum(a => a.itm.Qty),
                              outaltqty = gr.Sum(a => a.itm.AltQty)
                          }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).
                                  Select(b => new {
                                      pname = b.Key.pname,
                                      psize = b.Key.psize,
                                      pclass = b.Key.pclass,
                                      pmake = b.Key.pmake,
                                      location = b.Key.location,
                                      qty = b.Sum(a => a.qty),
                                      altqty = b.Sum(a => a.altqty),
                                      outqty = b.Sum(a => a.outqty),
                                      outaltqty = b.Sum(a => a.outaltqty),
                                      balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty),
                                      balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty)
                                  }).ToList()).Where(a => a.balqty > 0 || a.balaltqty > 0).
                                  Select(a => new {
                                      location = a.location,
                                      id = _db.Godownname.Where(b => b.Companyid == comapnyid && b.godownName == a.location).Select(a => a.id).FirstOrDefault(),
                                      name = _db.Godownname.Where(b => b.Companyid == comapnyid && b.godownName == a.location).Select(a => a.location).FirstOrDefault(),
                                  }).Distinct().ToList();
                /* var data = (from op in opqty
                             join gd in _db.Godownname on op.location equals gd.godownName
                             where gd.Companyid == comapnyid
                             select new { location = op.location, id = gd.id,name=gd.location}).ToList();*/

                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("GodownWisePnameList")]
        public IActionResult GodownWisePnameList(DateTime ddate, string gd)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == gd && itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, op.qty, op.altQty } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Key.qty, altqty = gr.Key.altQty, outqty = 0.0, outaltqty = 0.0 }).ToList().Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate && dtl.status == true && itm.Wharehouse == gd && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate && dtl.status == true && itm.Wharehouse == gd && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Where(a => a.balqty > 0 || a.balaltqty > 0).Select(a => new { pname = a.pname }).Distinct().OrderBy(a => a.pname);


                return Json(new { success = true, data = opqty });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("GodownWisePnameDetailsList")]
        public IActionResult GodownWisePnameDetailsList(DateTime ddate, string gd, string pname, bool zerostk)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (zerostk == true)
                {
                    var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == gd && itm.pname == pname && itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, itm.category } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0, weight = gr.Sum(a => a.itm.weight) }).ToList().
                        Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate.Date && dtl.status == true && itm.Wharehouse == gd && itm.Pname == pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0, weight = 0.0, }).ToList()).
                        Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate.Date && dtl.status == true && itm.Wharehouse == gd && itm.Pname == pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty), weight = 0.0, }).ToList()).
                        GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b =>
                        new { 
                            pname = b.Key.pname, 
                            psize = b.Key.psize, 
                            pclass = b.Key.pclass, 
                            pmake = b.Key.pmake, 
                            location = b.Key.location, 
                            qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), 
                            altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty),
                            weight = (b.Sum(a => a.qty) - b.Sum(a => a.outqty)) * _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid==comapnyid).Select(a => a.weight).FirstOrDefault(),
                            unit= _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a=>a.unit).FirstOrDefault(),
                            altunit= _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.altunit).FirstOrDefault(),
                        }).Distinct().ToList()).OrderBy(a => a.pname).ThenBy(a => a.psize).ThenBy(a => a.pclass); ;

                    return Json(new { success = true, data = opqty });
                }
                else
                {
                    var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == gd && itm.pname == pname && itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, itm.category } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0, weight = gr.Sum(a => a.itm.weight) }).ToList().
                       Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate.Date && dtl.status == true && itm.Wharehouse == gd && itm.Pname == pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0, weight = 0.0, }).ToList()).
                       Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate.Date && dtl.status == true && itm.Wharehouse == gd && itm.Pname == pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty), weight = 0.0, }).ToList()).
                       GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new 
                       { 
                           pname = b.Key.pname, 
                           psize = b.Key.psize, 
                           pclass = b.Key.pclass, 
                           pmake = b.Key.pmake, 
                           location = b.Key.location, 
                           qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), 
                           altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty),
                           weight = (b.Sum(a => a.qty) - b.Sum(a => a.outqty)) * _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.weight).FirstOrDefault(),
                           unit = _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.unit).FirstOrDefault(),
                           altunit = _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.altunit).FirstOrDefault(),
                       }).Where(a => a.qty != 0 || a.altqty != 0).Distinct().ToList()).OrderBy(a=>a.pname).ThenBy(a=>a.psize).ThenBy(a=>a.pclass);

                    return Json(new { success = true, data = opqty });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("GodownName")]
        public IActionResult GodownName(int gdid)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var gdname = _db.Godownname.Where(a => a.id == gdid && a.Companyid == comapnyid).Select(a => a.godownName).FirstOrDefault();
                return Json(new { success = true, gdname = gdname });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("ProductName")]
        public IActionResult ProductName(int pnameid)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Productname.Where(a => a.id == pnameid && a.Companyid == comapnyid).Select(a => a.productname).FirstOrDefault();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("Productdescription")]
        public IActionResult Productdescription(int sizeid, int classid, int makeid)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var psize = _db.Productsize.Where(a => a.id == sizeid && a.Companyid == comapnyid).Select(a => a.productsize).FirstOrDefault();
                var pclass = _db.Productclass.Where(a => a.id == classid && a.Companyid == comapnyid).Select(a => a.productclass).FirstOrDefault();
                var pmake = _db.Productmake.Where(a => a.id == makeid && a.Companyid == comapnyid).Select(a => a.productmake).FirstOrDefault();
                return Json(new { success = true, psize = psize, pclass = pclass, pmake = pmake });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("GodownWiseYerlyReport")]
        public IActionResult GodownWiseYerlyReport(OpeningStockReport opsp)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var counttr = 1;
                var opqty1 = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == opsp.location && itm.pname == opsp.pname && itm.size == opsp.psize && op.ItemBrand == opsp.pmake && itm.Class == opsp.pclass && itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                    Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date < opsp.sdate && dtl.status == true && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date < opsp.sdate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = a.balqty, altqty = a.balaltqty }).Distinct();
                List<MonthWiseStockReport> lst = new List<MonthWiseStockReport>();
                List<MonthWiseStockReport> monthList = new List<MonthWiseStockReport>();
                foreach (var data in opqty1)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = "Opening Balance";
                    lest.inqty = 0.0;
                    lest.outqty = 0.0;
                    lest.balqty = data.qty;
                    lest.inaltqty = 0.0;
                    lest.outaltqty = 0.0;
                    lest.balaltqty = data.altqty;
                    lest.unit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.unit).FirstOrDefault();
                    lest.altunit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.altunit).FirstOrDefault();
                    monthList.Add(lest);
                    counttr = counttr + 1;
                }
                if (counttr == 1)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = "Opening Balance";
                    lest.inqty = 0.0;
                    lest.outqty = 0.0;
                    lest.balqty = 0.0;
                    lest.inaltqty = 0.0;
                    lest.outaltqty = 0.0;
                    lest.balaltqty = 0.0;
                    lest.unit = _db.ItemMaster.Where(a => a.pname == opsp.pname && a.size == opsp.psize && a.Companyid == comapnyid && a.Class == opsp.pclass).Select(a => a.unit).FirstOrDefault();
                    lest.altunit = _db.ItemMaster.Where(a => a.pname == opsp.pname && a.size == opsp.psize && a.Companyid == comapnyid && a.Class == opsp.pclass).Select(a => a.altunit).FirstOrDefault();
                    monthList.Add(lest);
                }


                var opqty = ((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date >= opsp.sdate.Date && dtl.PrDate.Date <= opsp.ddate.Date && dtl.status == true && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse, dtl.PrDate.Month, dtl.PrDate.Year } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0, month = gr.Key.Month, year = gr.Key.Year }).ToList().
                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date >= opsp.sdate && dtl.DoDate.Date <= opsp.ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse, dtl.DoDate.Month, dtl.DoDate.Year } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty), month = gr.Key.Month, year = gr.Key.Year }).ToList())).
                    ToList().GroupBy(a => new { a.month, a.pname, a.psize, a.pclass, a.pmake, a.year }).Select(a => new { a.Key.pmake, a.Key.pname, a.Key.psize, a.Key.pclass, qty = a.Sum(a => a.qty), altqty = a.Sum(a => a.altqty), outqty = a.Sum(a => a.outqty), outaltqty = a.Sum(a => a.outaltqty), month = a.Key.month, year = a.Key.year }).OrderBy(a => a.month).ThenBy(a => a.year);

                foreach (var data in opqty)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(data.month) + " " + data.year;
                    lest.month = data.month;
                    lest.year = data.year;
                    lest.inqty = data.qty;
                    lest.outqty = data.outqty;
                    lest.balqty = 0.0;
                    lest.inaltqty = data.altqty;
                    lest.outaltqty = data.outaltqty;
                    lest.balaltqty = 0.0;
                    lest.unit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.unit).FirstOrDefault();
                    lest.altunit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.altunit).FirstOrDefault();
                    lst.Add(lest);
                }
                var startMonth = opsp.sdate.Month;
                var startYear = opsp.sdate.Year;
                var endMonth = opsp.ddate.Month;
                var endYear = opsp.ddate.Year;
                Month month1 = new Month(startYear, startMonth);
                Month month = new Month(startYear, startMonth);
                Month monthEnd1 = new Month(endYear, endMonth);

                int count = 0;
                while (month1 <= monthEnd1)
                {
                    count = count + 1;
                    month1 = Month.NextMonth(month1);
                }

                if (count < 12)
                {
                    count = 12 - count;
                    endMonth = endMonth + count;
                    if (endMonth > 12)
                    {
                        endMonth = endMonth - 12;
                        endYear = endYear + 1;
                    }

                }

                Month monthEnd = new Month(endYear, endMonth);
                int k = 0;
                int l = 0;
                int countt = lst.Count();
                while (month <= monthEnd)
                {
                    if (k < countt)
                    {
                        Month currentmonth = new Month(lst[k].year, lst[k].month);
                        if (currentmonth.EndDate == month.EndDate && currentmonth.StartDate == month.StartDate)
                        {
                            MonthWiseStockReport lest = new MonthWiseStockReport();
                            lest.id = counttr;
                            lest.description = lst[k].description;
                            lest.inqty = lst[k].inqty;
                            lest.outqty = lst[k].outqty;
                            lest.inaltqty = lst[k].inaltqty;
                            lest.outaltqty = lst[k].outaltqty;
                            lest.balqty = (monthList[l].balqty + lst[k].inqty) - lst[k].outqty;
                            lest.balaltqty = (monthList[l].balaltqty + lst[k].inaltqty) - lst[k].outaltqty;
                            lest.unit = lst[k].unit;
                            lest.altunit = lst[k].altunit;
                            lest.month = lst[k].month;
                            lest.year = lst[k].year;
                            lest.monthname = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(lst[k].month);
                            monthList.Add(lest);
                            k = k + 1;
                        }
                        else
                        {
                            MonthWiseStockReport lest = new MonthWiseStockReport();
                            lest.id = counttr;
                            lest.description = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month.EndDate.Month) + " " + month.EndDate.Year;
                            lest.inqty = 0.0;
                            lest.outqty = 0.0;
                            lest.inaltqty = 0.0;
                            lest.outaltqty = 0.0;

                            lest.balqty = monthList[l].balqty;
                            lest.balaltqty = monthList[l].balaltqty;

                            lest.unit = lst[k].unit;
                            lest.altunit = lst[k].altunit;
                            lest.monthname = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month.EndDate.Month);
                            lest.year = month.EndDate.Year;
                            monthList.Add(lest);
                        }
                    }
                    else
                    {
                        MonthWiseStockReport lest = new MonthWiseStockReport();
                        lest.id = counttr;
                        lest.description = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month.EndDate.Month) + " " + month.EndDate.Year;
                        lest.inqty = 0.0;
                        lest.outqty = 0.0;
                        lest.inaltqty = 0.0;
                        lest.outaltqty = 0.0;

                        lest.balqty = monthList[l].balqty;
                        lest.balaltqty = monthList[l].balaltqty;

                        lest.unit = monthList[k].unit;
                        lest.altunit = monthList[k].altunit;
                        lest.monthname = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month.EndDate.Month);
                        lest.year = month.EndDate.Year;
                        monthList.Add(lest);

                    }
                    l = l + 1;
                    month = Month.NextMonth(month);
                }


                return Json(new { success = true, data = monthList });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        public class Month
        {
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }

            public Month(int year, int month)
            {
                StartDate = new DateTime(year, month, 1);
                EndDate = new DateTime(year, month, DateTime.DaysInMonth(year, month));
            }

            public static Month NextMonth(Month month)
            {
                DateTime next = month.StartDate.AddMonths(1);
                return new Month(next.Year, next.Month);
            }

            public static bool operator <=(Month month1, Month month2)
            {
                return month1.StartDate <= month2.StartDate;
            }

            public static bool operator >=(Month month1, Month month2)
            {
                return month1.StartDate >= month2.StartDate;
            }
        }

        [Route("totalfooter")]
        public IActionResult totalfooter(OpeningStockReport opsp)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                MonthWiseStockReport lest = new MonthWiseStockReport();
                var qty = (from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date >= opsp.sdate.Date && dtl.PrDate.Date <= opsp.ddate.Date && dtl.status == true && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty) }).FirstOrDefault();
                if (qty != null)
                {
                    lest.inqty = qty.qty;
                    lest.inaltqty = qty.altqty;
                }
                else
                {
                    lest.inqty = 0.0;
                    lest.inaltqty = 0.0;
                }
                var qty1 = (from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date >= opsp.sdate && dtl.DoDate.Date <= opsp.ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).FirstOrDefault();
                if (qty1 != null)
                {
                    lest.outqty = qty1.outqty;
                    lest.outaltqty = qty1.outaltqty;
                }
                else
                {
                    lest.outqty = 0.0;
                    lest.outaltqty = 0.0;
                }

                var qty2 = (from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == opsp.location && itm.pname == opsp.pname && itm.size == opsp.psize && op.ItemBrand == opsp.pmake && itm.Class == opsp.pclass && itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class } into gr select new { qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty) }).FirstOrDefault();
                if (qty2 != null)
                {
                    lest.balqty = (lest.inqty + qty2.qty) - lest.outqty;
                    lest.balaltqty = (lest.inaltqty + qty2.altqty) - lest.outaltqty;
                }
                else
                {
                    lest.balaltqty = 0.0;
                    lest.balqty = 0.0;
                }
                lest.unit = _db.ItemMaster.Where(a => a.pname == opsp.pname && a.size == opsp.psize && a.Companyid == comapnyid && a.Class == opsp.pclass).Select(a => a.unit).FirstOrDefault();
                lest.altunit = _db.ItemMaster.Where(a => a.pname == opsp.pname && a.size == opsp.psize && a.Companyid == comapnyid && a.Class == opsp.pclass).Select(a => a.altunit).FirstOrDefault();
                return Json(new { success = true, data = lest });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("getinitialdate")]
        public IActionResult getinitialdate()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.CompanyProfile.Where(a => a.uniquecode == comapnyid).Select(a => a.financialdate).FirstOrDefault();
                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("GodownWiseMonthWiseReport")]
        public IActionResult GodownWiseMonthWiseReport(int monthh, int yearr, OpeningStockReport opsp)
        {
            try
            {
                DateTime startdate;
                DateTime enddate;
                var comapnyid = Request.Cookies["companyid"];
                var counttr = 1;
                if (opsp.sdate.Month == monthh && opsp.sdate.Year == yearr)
                {
                    startdate = opsp.sdate;
                }
                else
                {
                    startdate = new DateTime(yearr, monthh, 1);
                }

                if (opsp.ddate.Month == monthh && opsp.ddate.Year == yearr)
                {
                    enddate = opsp.ddate;
                }
                else
                {
                    enddate = new DateTime(yearr, monthh, DateTime.DaysInMonth(yearr, monthh));
                }
                /* var opqty1 = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == opsp.location && itm.pname == opsp.pname && itm.size == opsp.psize && op.ItemBrand == opsp.pmake && itm.Class == opsp.pclass && itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                     Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date < startdate.Date && dtl.status == true && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                     Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date < startdate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = a.balqty, altqty = a.balaltqty }).Distinct();
              */
                var opqty1 = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == opsp.location && itm.pname == opsp.pname && itm.size == opsp.psize && op.ItemBrand == opsp.pmake && itm.Class == opsp.pclass && itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                 Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date < startdate.Date && dtl.status == true && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                 Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date < startdate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).
                 GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList());
                List<MonthWiseStockReport> monthList = new List<MonthWiseStockReport>();
                var balqty = 0.0;
                var balaltqty = 0.0;
                var unit = "";
                var altunit = "";
                foreach (var data in opqty1)
                {
                    var dt = _db.ItemMaster.Where(a => a.pname == opsp.pname && a.size == opsp.psize && a.Class == opsp.pclass).FirstOrDefault();
                    balqty = data.qty;
                    balaltqty = data.altqty;
                    if (dt != null)
                    {
                        unit = dt.unit;
                        altunit = dt.altunit;
                    }

                }

                MonthWiseStockReport lest1 = new MonthWiseStockReport();
                lest1.id = counttr;
                lest1.date = startdate;
                lest1.description = "Opening Balance";
                lest1.inqty = 0.0;
                lest1.inaltqty = 0.0;
                lest1.outqty = 0.0;
                lest1.inaltqty = 0.0;
                lest1.outaltqty = 0.0;
                lest1.balqty = balqty;
                lest1.balaltqty = balaltqty;
                lest1.unit = unit;
                lest1.altunit = altunit;
                monthList.Add(lest1);

                var opqty = ((from itm in _db.PurchaseRecievedItem
                              join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo
                              where dtl.PrDate.Date >= startdate.Date && dtl.PrDate.Date <= enddate.Date && dtl.status == true && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == comapnyid && dtl.Companyid == comapnyid
                              group new { dtl, itm }
                              by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse, dtl.PrNo, dtl.PrDate, dtl.SupplierCompanyname } into gr
                              select new { date = gr.Key.PrDate, companyname = gr.Key.SupplierCompanyname, vchtype = "PURCHASE", vchno = gr.Key.PrNo, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                                   Union((from itm in _db.DODespatchItem
                                          join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo
                                          where dtl.DoDate.Date >= startdate.Date && dtl.DoDate.Date <= enddate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pclass == opsp.pclass && itm.Pmake == opsp.pmake && itm.Wharehouse == opsp.location
                                          group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse, dtl.DoNo, dtl.SupplierCompanyname, dtl.DoDate } into gr
                                          select new { date = gr.Key.DoDate, companyname = gr.Key.SupplierCompanyname, vchtype = "SELL", vchno = gr.Key.DoNo, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList())).
                                          ToList().OrderBy(a => a.date);
                int l = 0;
                foreach (var data in opqty)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = data.companyname;
                    lest.date = data.date;
                    lest.vchno = data.vchno;
                    lest.vchtype = data.vchtype;
                    lest.inqty = data.qty;
                    lest.inaltqty = data.altqty;
                    lest.outqty = data.outqty;
                    lest.outaltqty = data.outaltqty;
                    lest.balqty = (monthList[l].balqty + data.qty) - data.outqty;
                    lest.balaltqty = (monthList[l].balaltqty + data.altqty) - data.outaltqty;
                    lest.unit = unit;
                    lest.altunit = altunit;
                    monthList.Add(lest);
                    l = l + 1;
                    counttr = counttr + 1;
                }


                return Json(new { success = true, data = monthList.OrderBy(a => a.date.Date) });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("GodownWiseMonthWiseReport1")]
        public IActionResult GodownWiseMonthWiseReport1(OpeningStockReport opsp)
        {
            try
            {
                DateTime startdate = opsp.sdate;
                DateTime enddate = opsp.ddate;
                var comapnyid = Request.Cookies["companyid"];
                var counttr = 1;

                var opqty1 = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == opsp.location && itm.pname == opsp.pname && itm.size == opsp.psize && op.ItemBrand == opsp.pmake && itm.Class == opsp.pclass && itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                    Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date < startdate.Date && dtl.status == true && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date < startdate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).
                    GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList());
                List<MonthWiseStockReport> monthList = new List<MonthWiseStockReport>();
                var balqty = 0.0;
                var balaltqty = 0.0;
                var unit = "";
                var altunit = "";
                foreach (var data in opqty1)
                {
                    var dt = _db.ItemMaster.Where(a => a.pname == opsp.pname & a.size == opsp.psize & a.Class == opsp.pclass).FirstOrDefault();
                    balqty = data.qty;
                    balaltqty = data.altqty;
                    if (dt != null)
                    {
                        unit = dt.unit;
                        altunit = dt.altunit;
                    }

                }

                MonthWiseStockReport lest1 = new MonthWiseStockReport();
                lest1.id = counttr;
                lest1.date = startdate;
                lest1.description = "Opening Balance";
                lest1.inqty = 0.0;
                lest1.inaltqty = 0.0;
                lest1.outqty = 0.0;
                lest1.inaltqty = 0.0;
                lest1.outaltqty = 0.0;
                lest1.balqty = balqty;
                lest1.balaltqty = balaltqty;
                lest1.unit = unit;
                lest1.altunit = altunit;
                monthList.Add(lest1);


                var opqty = ((from itm in _db.PurchaseRecievedItem
                              join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo
                              where dtl.PrDate.Date >= startdate.Date && dtl.PrDate.Date <= enddate.Date && dtl.status == true && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == comapnyid && dtl.Companyid == comapnyid
                              group new { dtl, itm }
                              by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse, dtl.PrNo, dtl.PrDate, dtl.SupplierCompanyname } into gr
                              select new { date = gr.Key.PrDate, companyname = gr.Key.SupplierCompanyname, vchtype = "PURCHASE", vchno = gr.Key.PrNo, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                    Union((from itm in _db.DODespatchItem
                           join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo
                           where dtl.DoDate.Date >= startdate.Date && dtl.DoDate.Date <= enddate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pclass == opsp.pclass && itm.Pmake == opsp.pmake && itm.Wharehouse == opsp.location
                           group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse, dtl.DoNo, dtl.SupplierCompanyname, dtl.DoDate } into gr
                           select new { date = gr.Key.DoDate, companyname = gr.Key.SupplierCompanyname, vchtype = "SELL", vchno = gr.Key.DoNo, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList())).
                           ToList().OrderBy(a => a.date);
                int l = 0;
                foreach (var data in opqty)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = data.companyname;
                    lest.date = data.date;
                    lest.vchno = data.vchno;
                    lest.vchtype = data.vchtype;
                    lest.inqty = data.qty;
                    lest.inaltqty = data.altqty;
                    lest.outqty = data.outqty;
                    lest.outaltqty = data.outaltqty;
                    lest.balqty = (monthList[l].balqty + data.qty) - data.outqty;
                    lest.balaltqty = (monthList[l].balaltqty + data.altqty) - data.outaltqty;
                    lest.unit = unit;
                    lest.altunit = altunit;
                    monthList.Add(lest);
                    l = l + 1;
                    counttr = counttr + 1;
                }

                return Json(new { success = true, data = monthList.OrderBy(a => a.date.Date) });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
        [Route("ItemWiseMonthWiseReport1")]
        public IActionResult ItemWiseMonthWiseReport1(OpeningStockReport opsp)
        {
            try
            {
                DateTime startdate = opsp.sdate;
                DateTime enddate = opsp.ddate;
                var comapnyid = Request.Cookies["companyid"];
                var counttr = 1;

                var opqty1 = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.pname == opsp.pname && itm.size == opsp.psize && op.ItemBrand == opsp.pmake && itm.Class == opsp.pclass && itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                    Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date < startdate.Date && dtl.status == true && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date < startdate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).
                    GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake }).Select(b => new {
                        pname = b.Key.pname,
                        psize = b.Key.psize,
                        pclass = b.Key.pclass,
                        pmake = b.Key.pmake,
                        qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty),
                        altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty)
                    }).ToList());
                List<MonthWiseStockReport> monthList = new List<MonthWiseStockReport>();
                var balqty = 0.0;
                var balaltqty = 0.0;
                var unit = "";
                var altunit = "";
                foreach (var data in opqty1)
                {
                    var dt = _db.ItemMaster.Where(a => a.pname == opsp.pname & a.size == opsp.psize & a.Class == opsp.pclass).FirstOrDefault();
                    balqty = data.qty;
                    balaltqty = data.altqty;
                    if (dt != null)
                    {
                        unit = dt.unit;
                        altunit = dt.altunit;
                    }

                }

                MonthWiseStockReport lest1 = new MonthWiseStockReport();
                lest1.id = counttr;
                lest1.date = startdate;
                lest1.description = "Opening Balance";
                lest1.inqty = 0.0;
                lest1.inaltqty = 0.0;
                lest1.outqty = 0.0;
                lest1.inaltqty = 0.0;
                lest1.outaltqty = 0.0;
                lest1.balqty = balqty;
                lest1.balaltqty = balaltqty;
                lest1.unit = unit;
                lest1.altunit = altunit;
                monthList.Add(lest1);


                var opqty = ((from itm in _db.PurchaseRecievedItem
                              join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo
                              where dtl.PrDate.Date >= startdate.Date && dtl.PrDate.Date <= enddate.Date && dtl.status == true && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == comapnyid && dtl.Companyid == comapnyid
                              group new { dtl, itm }
                              by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, dtl.PrNo, dtl.PrDate, dtl.SupplierCompanyname } into gr
                              select new { date = gr.Key.PrDate, companyname = gr.Key.SupplierCompanyname, vchtype = "PURCHASE", vchno = gr.Key.PrNo, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                    Union((from itm in _db.DODespatchItem
                           join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo
                           where dtl.DoDate.Date >= startdate.Date && dtl.DoDate.Date <= enddate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pclass == opsp.pclass && itm.Pmake == opsp.pmake
                           group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, dtl.DoNo, dtl.SupplierCompanyname, dtl.DoDate } into gr
                           select new { date = gr.Key.DoDate, companyname = gr.Key.SupplierCompanyname, vchtype = "SELL", vchno = gr.Key.DoNo, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList())).
                           ToList().OrderBy(a => a.date);
                int l = 0;
                foreach (var data in opqty)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = data.companyname;
                    lest.date = data.date;
                    lest.vchno = data.vchno;
                    lest.vchtype = data.vchtype;
                    lest.inqty = data.qty;
                    lest.inaltqty = data.altqty;
                    lest.outqty = data.outqty;
                    lest.outaltqty = data.outaltqty;
                    lest.balqty = (monthList[l].balqty + data.qty) - data.outqty;
                    lest.balaltqty = (monthList[l].balaltqty + data.altqty) - data.outaltqty;
                    lest.unit = unit;
                    lest.altunit = altunit;
                    monthList.Add(lest);
                    l = l + 1;
                    counttr = counttr + 1;
                }

                return Json(new { success = true, data = monthList.OrderBy(a => a.date.Date) });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("ComparisonReport")]
        public IActionResult ComparisonReport(viewcomp vc)
        {
            try
            {
                DateTime ddate = vc.todate;
                /*DateTime enddate = vc.todate;*/
                var comapnyid = Request.Cookies["companyid"];
                int counterr = vc.wharehouse.Count();
                var userid = Request.Cookies["id"];
                var tempstock = _db.OpeningStockReport.Where(a => a.userid == userid && a.Companyid == comapnyid).ToList();
                _db.OpeningStockReport.RemoveRange(tempstock);
                _db.SaveChanges();
                List<OpeningStockReport> opss = new List<OpeningStockReport>();
                for (int i = 0; i < counterr; i++)
                {
                    var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == vc.wharehouse[i] && itm.pname == vc.pname && itm.Companyid == comapnyid && op.Companyid == comapnyid && op.ItemBrand == vc.pmake group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, itm.category } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                                    Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate.Date && dtl.status == true && itm.Wharehouse == vc.wharehouse[i] && itm.Pname == vc.pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid && itm.Pmake == vc.pmake group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate.Date && dtl.status == true && itm.Wharehouse == vc.wharehouse[i] && itm.Pname == vc.pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid && itm.Pmake == vc.pmake group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).
                                    GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Where(a => a.qty != 0 || a.altqty != 0).Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = a.qty, altqty = a.altqty,  qty1 = 0.0, altqty1 = 0.0, location = vc.wharehouse[i] }).Distinct().
                                    
                                    Union(((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == vc.wharehouse[i] && itm.pname == vc.pname && itm.Companyid == comapnyid && op.Companyid == comapnyid && op.ItemBrand == vc.pmake1 group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, itm.category } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                                    Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate.Date && dtl.status == true && itm.Wharehouse == vc.wharehouse[i] && itm.Pname == vc.pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid && itm.Pmake == vc.pmake1 group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse} into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0}).ToList()).
                                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate.Date && dtl.status == true && itm.Wharehouse == vc.wharehouse[i] && itm.Pname == vc.pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid && itm.Pmake == vc.pmake1 group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty)}).ToList()).
                                    GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty)}).ToList()).Where(a => a.qty != 0 || a.altqty != 0).Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = 0.0, altqty = 0.0,  qty1 = a.qty, altqty1 = a.altqty, location = vc.wharehouse[i] }).Distinct());


                    foreach (var data in opqty)
                    {
                        OpeningStockReport ops = new OpeningStockReport();
                        var unitt = _db.ItemMaster.Where(a => a.pname == data.pname & a.size == data.psize & a.Class == data.pclass & a.Companyid == comapnyid).FirstOrDefault();
                        ops.pname = data.pname;
                        ops.psize = data.psize;
                        ops.pclass = data.pclass;
                        ops.pmake = vc.pmake;
                        ops.pmake1 = vc.pmake1;
                        ops.sdate = vc.frmdata;
                        ops.ddate = vc.todate;

                        ops.qty = data.qty;
                        ops.altqty = data.altqty;
                        ops.qty1 = data.qty1;
                        ops.altqty1 = data.altqty1;
                        ops.unit1 = unitt.unit;

                        ops.location = vc.wharehouse[i];
                        ops.unit1 = unitt.unit;
                        ops.unit = ops.unit1;
                        ops.altunit = unitt.altunit;
                        ops.altunit1 = ops.altunit;
                        ops.Companyid = comapnyid;
                        ops.userid = userid;
                        _db.OpeningStockReport.Add(ops);
                        _db.SaveChanges();
                    }
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("GetComparisonReport")]
        public IActionResult GetComparisonReport()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["id"];
                var data = _db.OpeningStockReport.Where(a => a.userid == userid && a.Companyid == comapnyid).GroupBy(b => new { b.pname, b.psize, b.pclass, b.location, b.unit, b.altunit, b.unit1, b.altunit1 }).Select(a => new { pname = a.Key.pname, psize = a.Key.psize, pclass = a.Key.pclass, location = a.Key.location, qty = a.Sum(a => a.qty), altqty = a.Sum(a => a.altqty), qty1 = a.Sum(a => a.qty1), altqty1 = a.Sum(a => a.altqty1), unit = a.Key.unit, unit1 = a.Key.unit1, altunit = a.Key.altunit, altunit1 = a.Key.altunit1 }).ToList().OrderBy(a => a.psize).ThenBy(a => a.pclass);
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
        [Route("StockWisePnameList")]
        public IActionResult StockWisePnameList(DateTime ddate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, op.qty, op.altQty } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Key.qty, altqty = gr.Key.altQty, outqty = 0.0, outaltqty = 0.0 }).ToList().Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Where(a => a.balqty > 0 || a.balaltqty > 0).Select(a => new { pname = a.pname }).Distinct().OrderBy(a => a.pname);
                List<OpeningStockReport> opp = new List<OpeningStockReport>();
                foreach (var data in opqty)
                {
                    OpeningStockReport ops = new OpeningStockReport();
                    ops.pname = data.pname;
                    ops.id = _db.Productname.Where(a => a.productname == data.pname && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    opp.Add(ops);
                }
                return Json(new { success = true, data = opp });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
        [Route("StockWisePnameDetailsList")]
        public IActionResult StockWisePnameDetailsList(DateTime ddate, string pname, bool zerostk)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (zerostk == true)
                {
                    var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.pname == pname && itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, itm.category } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                        Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate.Date && dtl.status == true && itm.Pname == pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                        Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate.Date && dtl.status == true && itm.Pname == pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).
                        GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new {
                            pname = b.Key.pname,
                            psize = b.Key.psize,
                            pclass = b.Key.pclass,
                            pmake = b.Key.pmake,
                            weight = (b.Sum(a => a.qty) - b.Sum(a => a.outqty)) * _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.weight).FirstOrDefault(),
                            qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty),
                            altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty),
                            unit = _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.unit).FirstOrDefault(),
                            altunit = _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.altunit).FirstOrDefault(),
                        }).Distinct().ToList());
                    return Json(new { success = true, data = opqty });
                }
                else
                {
                    var opqty = ((from itm in _db.ItemMaster
                                  join op in _db.OpeningStock on itm.ItemId equals op.ItemId
                                  where itm.pname == pname && itm.Companyid == comapnyid && op.Companyid == comapnyid
                                  group new { op, itm } by new
                                  { op.ItemBrand, itm.pname, itm.size, itm.Class, itm.category } into gr
                                  select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                       Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate.Date && dtl.status == true && itm.Pname == pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                       Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate.Date && dtl.status == true && itm.Pname == pname && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).
                       GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake }).Select(b => new {
                           pname = b.Key.pname,
                           psize = b.Key.psize,
                           pclass = b.Key.pclass,
                           pmake = b.Key.pmake,
                           weight = (b.Sum(a => a.qty) - b.Sum(a => a.outqty)) * _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.weight).FirstOrDefault(),
                           qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty),
                           altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty),
                           unit = _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.unit).FirstOrDefault(),
                           altunit = _db.ItemMaster.Where(a => a.pname == b.Key.pname && a.size == b.Key.psize && a.Class == b.Key.pclass && a.Companyid == comapnyid).Select(a => a.altunit).FirstOrDefault(),
                       }).Where(a => a.qty != 0 || a.altqty != 0).Distinct().ToList());
                    return Json(new { success = true, data = opqty });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("StockWiseMonthReport")]
        public IActionResult StockWiseMonthReport(OpeningStockReport opsp)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var counttr = 1;
                var opqty1 = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.pname == opsp.pname && itm.size == opsp.psize && op.ItemBrand == opsp.pmake && itm.Class == opsp.pclass && itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                    Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date < opsp.sdate && dtl.status == true && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date < opsp.sdate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = a.balqty, altqty = a.balaltqty }).Distinct();
                List<MonthWiseStockReport> lst = new List<MonthWiseStockReport>();
                List<MonthWiseStockReport> monthList = new List<MonthWiseStockReport>();
                foreach (var data in opqty1)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = "Opening Balance";
                    lest.inqty = 0.0;
                    lest.outqty = 0.0;
                    lest.balqty = data.qty;
                    lest.inaltqty = 0.0;
                    lest.outaltqty = 0.0;
                    lest.balaltqty = data.altqty;
                    lest.unit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.unit).FirstOrDefault();
                    lest.altunit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.altunit).FirstOrDefault();
                    monthList.Add(lest);
                    counttr = counttr + 1;
                }
                if (counttr == 1)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = "Opening Balance";
                    lest.inqty = 0.0;
                    lest.outqty = 0.0;
                    lest.balqty = 0.0;
                    lest.inaltqty = 0.0;
                    lest.outaltqty = 0.0;
                    lest.balaltqty = 0.0;
                    lest.unit = _db.ItemMaster.Where(a => a.pname == opsp.pname && a.size == opsp.psize && a.Companyid == comapnyid && a.Class == opsp.pclass).Select(a => a.unit).FirstOrDefault();
                    lest.altunit = _db.ItemMaster.Where(a => a.pname == opsp.pname && a.size == opsp.psize && a.Companyid == comapnyid && a.Class == opsp.pclass).Select(a => a.altunit).FirstOrDefault();
                    monthList.Add(lest);
                }


                var opqty = ((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date >= opsp.sdate.Date && dtl.PrDate.Date <= opsp.ddate.Date && dtl.status == true && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, dtl.PrDate.Month, dtl.PrDate.Year } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0, month = gr.Key.Month, year = gr.Key.Year }).ToList().
                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date >= opsp.sdate && dtl.DoDate.Date <= opsp.ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, dtl.DoDate.Month, dtl.DoDate.Year } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty), month = gr.Key.Month, year = gr.Key.Year }).ToList())).
                    ToList().GroupBy(a => new { a.month, a.pname, a.psize, a.pclass, a.pmake, a.year }).Select(a => new { a.Key.pmake, a.Key.pname, a.Key.psize, a.Key.pclass, qty = a.Sum(a => a.qty), altqty = a.Sum(a => a.altqty), outqty = a.Sum(a => a.outqty), outaltqty = a.Sum(a => a.outaltqty), month = a.Key.month, year = a.Key.year }).OrderBy(a => a.month).ThenBy(a => a.year);

                foreach (var data in opqty)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(data.month) + " " + data.year;
                    lest.month = data.month;
                    lest.year = data.year;
                    lest.inqty = data.qty;
                    lest.outqty = data.outqty;
                    lest.balqty = 0.0;
                    lest.inaltqty = data.altqty;
                    lest.outaltqty = data.outaltqty;
                    lest.balaltqty = 0.0;
                    lest.unit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.unit).FirstOrDefault();
                    lest.altunit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.altunit).FirstOrDefault();
                    lst.Add(lest);
                }
                var startMonth = opsp.sdate.Month;
                var startYear = opsp.sdate.Year;
                var endMonth = opsp.ddate.Month;
                var endYear = opsp.ddate.Year;
                Month month1 = new Month(startYear, startMonth);
                Month month = new Month(startYear, startMonth);
                Month monthEnd1 = new Month(endYear, endMonth);

                int count = 0;
                while (month1 <= monthEnd1)
                {
                    count = count + 1;
                    month1 = Month.NextMonth(month1);
                }

                if (count < 12)
                {
                    count = 12 - count;
                    endMonth = endMonth + count;
                    if (endMonth > 12)
                    {
                        endMonth = endMonth - 12;
                        endYear = endYear + 1;
                    }

                }

                Month monthEnd = new Month(endYear, endMonth);
                int k = 0;
                int l = 0;
                int countt = lst.Count();
                while (month <= monthEnd)
                {
                    if (k < countt)
                    {
                        Month currentmonth = new Month(lst[k].year, lst[k].month);
                        if (currentmonth.EndDate == month.EndDate && currentmonth.StartDate == month.StartDate)
                        {
                            MonthWiseStockReport lest = new MonthWiseStockReport();
                            lest.id = counttr;
                            lest.description = lst[k].description;
                            lest.inqty = lst[k].inqty;
                            lest.outqty = lst[k].outqty;
                            lest.inaltqty = lst[k].inaltqty;
                            lest.outaltqty = lst[k].outaltqty;
                            lest.balqty = (monthList[l].balqty + lst[k].inqty) - lst[k].outqty;
                            lest.balaltqty = (monthList[l].balaltqty + lst[k].inaltqty) - lst[k].outaltqty;
                            lest.unit = lst[k].unit;
                            lest.altunit = lst[k].altunit;
                            lest.month = lst[k].month;
                            lest.year = lst[k].year;
                            lest.monthname = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(lst[k].month);
                            monthList.Add(lest);
                            k = k + 1;
                        }
                        else
                        {
                            MonthWiseStockReport lest = new MonthWiseStockReport();
                            lest.id = counttr;
                            lest.description = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month.EndDate.Month) + " " + month.EndDate.Year;
                            lest.inqty = 0.0;
                            lest.outqty = 0.0;
                            lest.inaltqty = 0.0;
                            lest.outaltqty = 0.0;

                            lest.balqty = monthList[l].balqty;
                            lest.balaltqty = monthList[l].balaltqty;

                            lest.unit = lst[k].unit;
                            lest.altunit = lst[k].altunit;
                            lest.monthname = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month.EndDate.Month);
                            lest.year = month.EndDate.Year;
                            monthList.Add(lest);
                        }
                    }
                    else
                    {
                        MonthWiseStockReport lest = new MonthWiseStockReport();
                        lest.id = counttr;
                        lest.description = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month.EndDate.Month) + " " + month.EndDate.Year;
                        lest.inqty = 0.0;
                        lest.outqty = 0.0;
                        lest.inaltqty = 0.0;
                        lest.outaltqty = 0.0;

                        lest.balqty = monthList[l].balqty;
                        lest.balaltqty = monthList[l].balaltqty;

                        lest.unit = monthList[k].unit;
                        lest.altunit = monthList[k].altunit;
                        lest.monthname = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month.EndDate.Month);
                        lest.year = month.EndDate.Year;
                        monthList.Add(lest);

                    }
                    l = l + 1;
                    month = Month.NextMonth(month);
                }


                return Json(new { success = true, data = monthList });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
        [Route("StockWiseMonthWiseReport")]
        public IActionResult StockWiseMonthWiseReport(int monthh, int yearr, OpeningStockReport opsp)
        {
            try
            {
                DateTime startdate;
                DateTime enddate;
                var comapnyid = Request.Cookies["companyid"];
                var counttr = 1;
                if (opsp.sdate.Month == monthh && opsp.sdate.Year == yearr)
                {
                    startdate = opsp.sdate;
                }
                else
                {
                    startdate = new DateTime(yearr, monthh, 1);
                }

                if (opsp.ddate.Month == monthh && opsp.ddate.Year == yearr)
                {
                    enddate = opsp.ddate;
                }
                else
                {
                    enddate = new DateTime(yearr, monthh, DateTime.DaysInMonth(yearr, monthh));
                }

                var opqty1 = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.pname == opsp.pname && itm.size == opsp.psize && op.ItemBrand == opsp.pmake && itm.Class == opsp.pclass && itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                    Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date < startdate.Date && dtl.status == true && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date < startdate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).
                    GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake }).
                    Select(b => new
                    {
                        pname = b.Key.pname,
                        psize = b.Key.psize,
                        pclass = b.Key.pclass,
                        pmake = b.Key.pmake,
                        qty = (b.Sum(a => a.qty) - b.Sum(a => a.outqty)),
                        altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty)
                    }).ToList());

                List<MonthWiseStockReport> monthList = new List<MonthWiseStockReport>();
                foreach (var data in opqty1)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.date = startdate;
                    lest.description = "Opening Balance";
                    lest.inqty = 0.0;
                    lest.outqty = 0.0;
                    lest.inaltqty = 0.0;
                    lest.outaltqty = 0.0;
                    lest.balqty = data.qty;
                    lest.balaltqty = data.altqty;
                    lest.unit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.unit).FirstOrDefault();
                    lest.altunit = _db.ItemMaster.Where(a => a.pname == data.pname && a.size == data.psize && a.Companyid == comapnyid && a.Class == data.pclass).Select(a => a.altunit).FirstOrDefault();
                    monthList.Add(lest);
                    counttr = counttr + 1;
                }
                if (counttr == 1)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.date = startdate;
                    lest.description = "Opening Balance";
                    lest.inqty = 0.0;
                    lest.outqty = 0.0;
                    lest.balqty = 0.0;
                    lest.inaltqty = 0.0;
                    lest.outaltqty = 0.0;
                    lest.balaltqty = 0.0;
                    lest.unit = "";
                    lest.altunit = "";
                    monthList.Add(lest);
                }

                var opqty = ((from itm in _db.PurchaseRecievedItem
                              join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo
                              where dtl.PrDate.Date >= startdate.Date && dtl.PrDate.Date <= enddate.Date && dtl.status == true && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == comapnyid && dtl.Companyid == comapnyid
                              group new { dtl, itm } by new
                              { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, dtl.PrNo, dtl.PrDate, dtl.SupplierCompanyname } into gr
                              select new
                              {
                                  date = gr.Key.PrDate,
                                  companyname = gr.Key.SupplierCompanyname,
                                  vchtype = "PURCHASE",
                                  vchno = gr.Key.PrNo,
                                  qty = gr.Sum(a => a.itm.Qty),
                                  altqty = gr.Sum(a => a.itm.AltQty),
                                  outqty = 0.0,
                                  outaltqty = 0.0
                              }).ToList().
                    Union((from itm in _db.DODespatchItem
                           join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo
                           where dtl.DoDate.Date >= startdate.Date && dtl.DoDate.Date <= enddate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pclass == opsp.pclass && itm.Pmake == opsp.pmake
                           group new { dtl, itm } by new
                           { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, dtl.DoNo, dtl.SupplierCompanyname, dtl.DoDate } into gr
                           select new
                           {
                               date = gr.Key.DoDate,
                               companyname = gr.Key.SupplierCompanyname,
                               vchtype = "SELL",
                               vchno = gr.Key.DoNo,
                               qty = 0.0,
                               altqty = 0.0,
                               outqty = gr.Sum(a => a.itm.Qty),
                               outaltqty = gr.Sum(a => a.itm.AltQty)
                           }).ToList())
                        ).ToList().OrderBy(a => a.date);
                int l = 0;
                foreach (var data in opqty)
                {
                    MonthWiseStockReport lest = new MonthWiseStockReport();
                    lest.id = counttr;
                    lest.description = data.companyname;
                    lest.date = data.date;
                    lest.vchno = data.vchno;
                    lest.vchtype = data.vchtype;
                    lest.inqty = data.qty;
                    lest.inaltqty = data.altqty;
                    lest.outqty = data.outqty;
                    lest.outaltqty = data.outaltqty;
                    lest.balqty = (monthList[l].balqty + data.qty) - data.outqty;
                    lest.balaltqty = (monthList[l].balaltqty + data.altqty) - data.outaltqty;
                    lest.unit = _db.ItemMaster.Where(a => a.pname == opsp.pname && a.size == opsp.psize && a.Companyid == comapnyid && a.Class == opsp.pclass).Select(a => a.unit).FirstOrDefault();
                    lest.altunit = _db.ItemMaster.Where(a => a.pname == opsp.pname && a.size == opsp.psize && a.Companyid == comapnyid && a.Class == opsp.pclass).Select(a => a.altunit).FirstOrDefault();
                    monthList.Add(lest);
                    l = l + 1;
                    counttr = counttr + 1;
                }

                return Json(new { success = true, data = monthList });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
        [Route("GodownWisePnameDetailsListStkSmry")]
        public IActionResult GodownWisePnameDetailsListStkSmry(DateTime ddate, string gd)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var ctor = 1;
                var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == gd && itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, op.qty, op.altQty } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Key.qty, altqty = gr.Key.altQty, outqty = 0.0, outaltqty = 0.0 }).ToList().Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate && dtl.status == true && itm.Wharehouse == gd && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate && dtl.status == true && itm.Wharehouse == gd && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Where(a => a.balqty != 0 || a.balaltqty != 0).Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = a.balqty, altqty = a.balaltqty }).Distinct().OrderBy(a => a.pname).ThenBy(a => a.psize).ThenBy(a => a.pclass);
                List<OpeningStockReport> opp = new List<OpeningStockReport>();
                foreach (var data in opqty)
                {
                    OpeningStockReport ops = new OpeningStockReport();
                    ops.sr = ctor++;
                    ops.pname = data.pname;
                    ops.psize = data.psize;
                    ops.pclass = data.pclass;
                    ops.pmake = data.pmake;
                    ops.classid = _db.Productclass.Where(a => a.productclass == ops.pclass).Select(a => a.id).FirstOrDefault();
                    ops.makeid = _db.Productmake.Where(a => a.productmake == ops.pmake).Select(a => a.id).FirstOrDefault();
                    ops.sizeid = _db.Productsize.Where(a => a.productsize == ops.psize).Select(a => a.id).FirstOrDefault();
                    ops.qty = data.qty;
                    ops.altqty = data.altqty;
                    ops.id = _db.Productname.Where(a => a.productname == data.pname && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    ops.unit = _db.ItemMaster.Where(a => a.pname == ops.pname && a.Companyid == comapnyid && a.size == ops.psize && a.Class == ops.pclass).Select(a => a.unit).FirstOrDefault();
                    ops.altunit = _db.ItemMaster.Where(a => a.pname == ops.pname && a.Companyid == comapnyid && a.size == ops.psize && a.Class == ops.pclass).Select(a => a.altunit).FirstOrDefault();
                    ops.category = _db.ItemMaster.Where(a => a.pname == ops.pname && a.Companyid == comapnyid && a.size == ops.psize && a.Class == ops.pclass).Select(a => a.category).FirstOrDefault();
                    var permter = _db.ItemMaster.Where(a => a.pname == ops.pname && a.size == data.psize && a.Class == data.pclass && a.category == ops.category).Select(a => a.weight).FirstOrDefault();
                    ops.weight = data.qty * permter;
                    opp.Add(ops);
                }
                return Json(new { success = true, data = opp.OrderBy(a => a.pname).ThenBy(a => a.psize).ThenBy(a => a.pclass) });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

        [Route("StockWisePnameDetailsListStkSmry")]
        public IActionResult StockWisePnameDetailsListStkSmry(DateTime ddate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var ctor = 1;
                var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Where(a => a.balqty != 0 || a.balaltqty != 0).Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = a.balqty, altqty = a.balaltqty }).Distinct().OrderBy(a => a.pname).ThenBy(a => a.psize).ThenBy(a => a.pclass);
                List<OpeningStockReport> opp = new List<OpeningStockReport>();
                foreach (var data in opqty)
                {
                    OpeningStockReport ops = new OpeningStockReport();
                    ops.sr = ctor++;
                    ops.pname = data.pname;
                    ops.psize = data.psize;
                    ops.pclass = data.pclass;
                    ops.pmake = data.pmake;
                    ops.classid = _db.Productclass.Where(a => a.productclass == ops.pclass).Select(a => a.id).FirstOrDefault();
                    ops.makeid = _db.Productmake.Where(a => a.productmake == ops.pmake).Select(a => a.id).FirstOrDefault();
                    ops.sizeid = _db.Productsize.Where(a => a.productsize == ops.psize).Select(a => a.id).FirstOrDefault();
                    ops.qty = data.qty;
                    ops.altqty = data.altqty;
                    ops.id = _db.Productname.Where(a => a.productname == data.pname && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    ops.unit = _db.ItemMaster.Where(a => a.pname == ops.pname && a.Companyid == comapnyid && a.size == ops.psize && a.Class == ops.pclass).Select(a => a.unit).FirstOrDefault();
                    ops.altunit = _db.ItemMaster.Where(a => a.pname == ops.pname && a.Companyid == comapnyid && a.size == ops.psize && a.Class == ops.pclass).Select(a => a.altunit).FirstOrDefault();
                    ops.category = _db.ItemMaster.Where(a => a.pname == ops.pname && a.Companyid == comapnyid && a.size == ops.psize && a.Class == ops.pclass).Select(a => a.category).FirstOrDefault();
                    var permter = _db.ItemMaster.Where(a => a.pname == ops.pname && a.size == data.psize && a.Class == data.pclass && a.category == ops.category).Select(a => a.weight).FirstOrDefault();
                    ops.weight = data.qty * permter;
                    opp.Add(ops);
                }
                return Json(new { success = true, data = opp.OrderBy(a => a.pname).ThenBy(a => a.psize).ThenBy(a => a.pclass) });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
        [Route("fillcategory")]
        public IActionResult fillcategory()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Productcategory.Where(a => a.Companyid == comapnyid).ToList();

                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
        [Route("categorywisePnamelist")]
        public IActionResult categorywisePnamelist(string category, DateTime ddate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Productcategory.Where(a => a.Companyid == comapnyid).ToList();

                return Json(new { success = true, data = data });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
        [Route("GodownDetailsStock")]
        public IActionResult GodownDetailsStock(DateTime ddate, OpeningStockReport opsp)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                /* var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class, op.qty, op.altQty } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Key.qty, altqty = gr.Key.altQty, outqty = 0.0, outaltqty = 0.0 }).ToList().Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Where(a => a.balqty > 0 || a.balaltqty > 0).Select(a => new { location = a.location }).Distinct().ToList();*/
                /*  var data = (from op in opqty
                              join gd in _db.Godownname on op.location equals gd.godownName
                              where gd.Companyid == comapnyid
                              select new { location = op.location, id = gd.id, name = gd.location }).ToList();
  */
                var data = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where op.GodownLocation == opsp.location && itm.pname == opsp.pname && itm.size == opsp.psize && op.ItemBrand == opsp.pmake && itm.Class == opsp.pclass && itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
               Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= opsp.sdate && dtl.status == true && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
               Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= opsp.sdate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid && itm.Wharehouse == opsp.location && itm.Pname == opsp.pname && itm.Psize == opsp.psize && itm.Pmake == opsp.pmake && itm.Pclass == opsp.pclass group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location }).
               Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location = b.Key.location, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).
               Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = a.balqty, altqty = a.balaltqty, location = a.location }).Distinct();

                var dt = (from op in data
                          join it in _db.ItemMaster on op.pname equals it.pname
                          where op.psize == it.size & op.pclass == it.Class & it.Companyid == comapnyid
                          select
                          new
                          {
                              location = op.location,
                              qty = op.qty,
                              altqty = op.altqty,
                              unit = it.unit,
                              altunit = it.unit,
                              weight = op.qty * it.weight,
                              wtunit = it.weightunit
                          }).ToList();
                return Json(new { success = true, data = dt });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }
    }

}
