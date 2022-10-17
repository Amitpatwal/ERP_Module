using SALES_ERP.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace SALES_ERP.Controllers
{
    [Route("api/PriceList")]
    public class PriceListController : Controller
    {
        public readonly ApplicationDBContext _db;
        public PriceListController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        [Route("savePriceList")]    
        public JsonResult savePriceList(string type, PriceListModel priceList , int Itemid)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type == "Save")
                {
                    priceList.companyname = companyid;
                    _db.PriceListModel.Add(priceList);
                    _db.SaveChanges();
                    var idd = _db.PriceListModel.Where(a => a.companyname == companyid && a.pname == priceList.pname && a.psize == priceList.psize && a.pclass==priceList.pclass && a.date.Date==priceList.date).Select(a=>a.id).FirstOrDefault();
                    for (int i = 0; i < priceList.make.Count; i++)
                    {
                        var pmake = new PricelistMake();
                        pmake.make = priceList.make[i];
                        pmake.pricelistid = idd;
                        pmake.companyid = companyid;
                        _db.PricelistMake.Add(pmake);
                        _db.SaveChanges();

                    }
                    return Json(new { success = true, message = "Price Added SuccesFully" });
                }

                else if (type == "Update")
                {

                    var data = _db.PriceListModel.Where(a => a.companyname == companyid && a.id == Itemid).FirstOrDefault();
                    if (data != null)
                    {
                        data.pclass = priceList.pclass;
                        data.pclassid = priceList.pclassid;
                        data.pmake = priceList.pmake;
                        data.pmakeid = priceList.pmakeid;
                        data.psize = priceList.psize;
                        data.psizeid = priceList.psizeid;
                        data.unit = priceList.unit;
                        data.unitid = priceList.unitid;
                        data.amount = priceList.amount;
                        _db.SaveChanges();

                        var dt = _db.PricelistMake.Where(a => a.companyid == companyid && a.pricelistid == Itemid).ToList();
                        if (dt != null)
                        {
                            _db.PricelistMake.RemoveRange(dt);
                            _db.SaveChanges();
                        }

                        for (int i = 0; i < priceList.make.Count; i++)
                        {
                            var pmake = new PricelistMake();
                            pmake.make = priceList.make[i];
                            pmake.pricelistid = Itemid;
                            pmake.companyid = companyid;
                            _db.PricelistMake.Add(pmake);
                            _db.SaveChanges();

                        }

                        return Json(new { success = true, message = "Price Updated SuccesFully" });
                    }
                   
                }
                else if (type == "Update Price List")
                {
                    priceList.companyname = companyid;
                    _db.PriceListModel.Add(priceList);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Price List Updated SuccesFully" });
                }
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

       
        [Route("loadPriceTable")]
        public JsonResult loadPriceTable(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PriceListModel.Where(a=> a.companyname == comapnyid  && a.date.Date >= fromdate.Date && a.date.Date <= todate.Date).Select(a => new
                {
                    id=a.id,
                    date =a.date,
                    Pname = a.pname,
                    Psize = a.psize,
                    Pclass = a.pclass,
                    Pmake = a.pmake,
                    unit = a.unit,
                    amount =a.amount,
                }).ToList();
              
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("loadPricedateTable")]
        public JsonResult loadPricedateTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PriceListModel.Where(a => a.companyname == comapnyid ).Select(a => new
                {
                    date = a.date,
                }).Distinct().OrderByDescending(a=>a.date).ToList();

                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("loadPricedateItemTable")]
        public JsonResult loadPricedateItemTable(DateTime Date)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PriceListModel.Where(a => a.companyname == comapnyid && a.date == Date).Select(a => new
                {
                    id = a.id,
                    date = a.date,
                    Pname = a.pname,
                    Psize = a.psize,
                    Pclass = a.pclass,
                    Pmake = a.pmake,
                    unit = a.unit,
                    amount = a.amount,
                }).Distinct().ToList();

                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("ViewPurchase")]
        public IActionResult ViewPurchase(int ID)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
               
                var pricelist = _db.PriceListModel.Where(x => x.id == ID && x.companyname == comapnyid).FirstOrDefault();
                if(pricelist != null)
                {
                    var makelist = _db.PricelistMake.Where(a => a.companyid == comapnyid && a.pricelistid == ID).Select(a=>a.make).ToList();
                    return Json(new { success = true, data = pricelist ,makelist=makelist });
                }
                else
                {
                    return Json(new { success = false});
                }
                

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("DeletePriceList")]
        public IActionResult DeletePriceList(int itemid)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];

                var pricelist = _db.PriceListModel.Where(x => x.id == itemid && x.companyname == comapnyid).FirstOrDefault();
                if (pricelist != null)
                {
                    _db.PriceListModel.Remove(pricelist);
                    _db.SaveChanges();
                    return Json(new { success = true  });
                }
                return Json(new { success = false, });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


    }
}
