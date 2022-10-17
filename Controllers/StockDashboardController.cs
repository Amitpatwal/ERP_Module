using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SALES_ERP.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Controllers
{
    [Route("api/StockDashboard")]
    public class StockDashboard : Controller
    {
        private IWebHostEnvironment Environment;
        private readonly ApplicationDBContext _db;
        public StockDashboard(ApplicationDBContext db, IWebHostEnvironment _environment)
        {
            _db = db;
            Environment = _environment;
        }



        [Route("BarChart")]
        public IActionResult BarChart(OpeningStockReport opsp)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var opqty1 = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.Companyid == op.Companyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, } into gr select new { pmake = gr.Key.ItemBrand, qty = gr.Sum(a => a.op.qty ), altqty = gr.Sum(a => a.op.altQty), outqty = 0.0 , outaltqty = 0.0 }).ToList().
                    Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= opsp.sdate && dtl.status == true && itm.Companyid == dtl.Companyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pmake } into gr select new { pmake = gr.Key.Pmake, qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= opsp.sdate && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pmake } into gr select new { pmake = gr.Key.Pmake, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pmake }).Select(b => new { pmake = b.Key.pmake, qty = b.Sum(a => a.qty) - b.Sum(a => a.outqty) , altqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Select(a => new { pmake = a.pmake, qty = a.qty , altqty =a.altqty }).Distinct();
                return Json(new { success = true, data = opqty1 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }


        }

        [Route("StockTable")]
        public IActionResult StockTable(DateTime ddate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var ctor = 1;
                var opqty = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand,  itm.pname, itm.size, itm.Class, op.qty, op.altQty } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand,  qty = gr.Key.qty, altqty = gr.Key.altQty, outqty = 0.0, outaltqty = 0.0 }).ToList().Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate && dtl.status == true  && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake,qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate && dtl.status == true  && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Qty, itm.AltQty, } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake,}).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake,  qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty) }).ToList()).Where(a => a.balqty != 0 || a.balaltqty != 0).Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = a.balqty, altqty = a.balaltqty }).Distinct().OrderBy(a => a.pname).ThenBy(a => a.psize).ThenBy(a => a.pclass);
                
                
                
                List<OpeningStockReport> opp = new List<OpeningStockReport>();
                foreach (var data in opqty)
                {
                    OpeningStockReport ops = new OpeningStockReport();
                    ops.sr = ctor++;
                    ops.pname = data.pname;
                    ops.psize = data.psize;
                    ops.pclass = data.pclass;
                    ops.pmake = data.pmake;
                    ops.classid = _db.Productclass.Where(a => a.productclass == ops.pclass && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    ops.makeid = _db.Productmake.Where(a => a.productmake == ops.pmake && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    ops.sizeid = _db.Productsize.Where(a => a.productsize == ops.psize && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    ops.qty = data.qty;
                    ops.altqty = data.altqty;
                    ops.status = _db.ItemMaster.Where(a => a.pname == ops.pname && a.size == ops.psize && a.Class == ops.pclass && a.Companyid == comapnyid).Select(a => a.Lowstock).FirstOrDefault();
                    ops.id = _db.Productname.Where(a => a.productname == data.pname && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    ops.unit = _db.ItemMaster.Where(a => a.pname == ops.pname && a.Companyid == comapnyid && a.size == ops.psize && a.Class == ops.pclass).Select(a => a.unit).FirstOrDefault();
                    ops.altunit = _db.ItemMaster.Where(a => a.pname == ops.pname && a.Companyid == comapnyid && a.size == ops.psize && a.Class == ops.pclass).Select(a => a.altunit).FirstOrDefault();
                    opp.Add(ops);
                }
                return Json(new { success = true, data = opp.OrderBy(a => a.pname).ThenBy(a => a.psize).ThenBy(a => a.pclass) });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }


        [Route("TotalStockInNos")]
        public IActionResult TotalStockInNos(string Type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (Type == "OPENING")
                {
                    var data = (from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.Companyid == op.Companyid && itm.Companyid == comapnyid group new { op, itm } by new { itm.unit, itm.altunit, itm.category } into gr select new { category = gr.Key.category, qty = gr.Sum(a => a.op.qty), altqty = gr.Sum(a => a.op.altQty), unit = gr.Key.unit, altunit = gr.Key.altunit }).ToList().OrderBy(a=>a.category);
                    return Json(new { success = true, data = data });
                }
                else if (Type == "PURCHASE")
                {
                    var data =(from itm in _db.ItemMaster join pritm in _db.PurchaseRecievedItem on itm.Companyid equals pritm.Companyid where itm.Companyid==comapnyid && itm.pname==pritm.Pname && itm.size ==pritm.Psize && itm.Class ==pritm.Pclass group new { itm,pritm} by new { itm.unit, itm.altunit, itm.category } into gr select new { category = gr.Key.category, qty = gr.Sum(a => a.pritm.Qty), altqty = gr.Sum(a => a.pritm.AltQty), unit = gr.Key.unit, altunit = gr.Key.altunit }).ToList().OrderBy(a => a.category); 
                    return Json(new { success = true, data = data });
                }

                else if (Type == "SALE")
                {
                    var data = (from itm in _db.ItemMaster join pritm in _db.DODespatchItem on itm.Companyid equals pritm.Companyid where itm.Companyid == comapnyid && itm.pname == pritm.Pname && itm.size == pritm.Psize && itm.Class == pritm.Pclass group new { itm, pritm } by new { itm.unit, itm.altunit, itm.category } into gr select new { category = gr.Key.category, qty = gr.Sum(a => a.pritm.Qty), altqty = gr.Sum(a => a.pritm.AltQty), unit = gr.Key.unit, altunit = gr.Key.altunit }).ToList().OrderBy(a => a.category); 
                    return Json(new { success = true, data = data });
                }
                else
                {
                    return Json(new { success = true});
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }

/*
        [Route("NOStockMovement")]
        public IActionResult NOStockMovement(DateTime ddate,DateTime lastdate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var table1 = ((from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.Companyid == comapnyid && op.Companyid == comapnyid group new { op, itm } by new { op.ItemBrand, op.GodownLocation, itm.pname, itm.size, itm.Class } into gr select new { pname = gr.Key.pname, psize = gr.Key.size, pclass = gr.Key.Class, pmake = gr.Key.ItemBrand, location = gr.Key.GodownLocation, qty = gr.Sum(a=>a.op.qty), altqty = gr.Sum(a=>a.op.altQty), outqty = 0.0, outaltqty = 0.0 }).ToList().
                    Union((from itm in _db.PurchaseRecievedItem join dtl in _db.PRDetials on itm.PrNo equals dtl.PrNo where dtl.PrDate.Date <= ddate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake, itm.Wharehouse} into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse,qty = gr.Sum(a => a.itm.Qty), altqty = gr.Sum(a => a.itm.AltQty), outqty = 0.0, outaltqty = 0.0 }).ToList()).
                    Union((from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date <= ddate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake,  itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList()).GroupBy(a => new { a.pname, a.psize, a.pclass, a.pmake, a.location}).Select(b => new { pname = b.Key.pname, psize = b.Key.psize, pclass = b.Key.pclass, pmake = b.Key.pmake, location =b.Key.location, qty = b.Sum(a => a.qty), altqty = b.Sum(a => a.altqty), outqty = b.Sum(a => a.outqty), outaltqty = b.Sum(a => a.outaltqty), balqty = b.Sum(a => a.qty) - b.Sum(a => a.outqty), balaltqty = b.Sum(a => a.altqty) - b.Sum(a => a.outaltqty )}).ToList()).Where(a => a.balqty != 0 || a.balaltqty != 0).Select(a => new { pname = a.pname, psize = a.psize, pclass = a.pclass, pmake = a.pmake, qty = a.balqty, altqty = a.balaltqty,location=a.location }).Distinct().OrderBy(a => a.pname).ThenBy(a => a.psize).ThenBy(a => a.pclass).ToList();

                var table2 = (from itm in _db.DODespatchItem join dtl in _db.DODetials on itm.DoNo equals dtl.DoNo where dtl.DoDate.Date >= lastdate.Date && dtl.status == true && itm.Companyid == comapnyid && dtl.Companyid == comapnyid group new { dtl, itm } by new { itm.Pname, itm.Psize, itm.Pclass, itm.Pmake,  itm.Wharehouse } into gr select new { pname = gr.Key.Pname, psize = gr.Key.Psize, pclass = gr.Key.Pclass, pmake = gr.Key.Pmake, location = gr.Key.Wharehouse, qty = 0.0, altqty = 0.0, outqty = gr.Sum(a => a.itm.Qty), outaltqty = gr.Sum(a => a.itm.AltQty) }).ToList();
                var table3 = from t1 in table1
                             join t2 in table2
                             on t1.pname equals t2.pname
                             where t1.psize == t2.psize && t1.pclass == t2.pclass && t1.pmake == t2.pmake && t1.location == t2.location 
                             into gj
                             from t4 in gj.DefaultIfEmpty()
                             select new { pname = t4.pname, psize = t4.psize, pclass = t4.pclass, location = t4.location };
             
                return Json(new { success = true,data=table3 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, msg = ex });
            }
        }*/



        /*       [Route("upd")]
               public IActionResult upd()
               {
                   try
                   {
                       var comapnyid = Request.Cookies["companyid"];
                       var data = _db.ItemMaster.Where(a => a.Companyid == comapnyid && a.altunit!=null).ToList();
                       foreach(var dt in data)
                       {
                           var dtt = _db.DODespatchItem.Where(a => a.Companyid == comapnyid && a.Pname == dt.pname && a.Psize == dt.size && a.Pclass == dt.Class).ToList();
                           dtt.ForEach(a => a.AltQtyunit=dt.altunit);
                           _db.SaveChanges();


                       }
                       return Json(new { success = true, data = data });

                   }
                   catch (Exception ex)
                   {
                       return Json(new { success = false, msg = ex });
                   }
               }*/

    }
}


            

