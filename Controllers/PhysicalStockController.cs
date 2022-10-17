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
    [Route("api/physicalstock")]
    public class PhysicalStockController : Controller
    {
        public readonly ApplicationDBContext _db;
        public PhysicalStockController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

       


        [HttpPost]
        [Route("addVoucher")]
        public JsonResult addVoucher(string type, PhysicalStock phyStock)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type == "Save")
                {

                    var dt = _db.PhysicalStock.Where(a => a.Companyid == comapnyid & a.VoucherDate.Date == phyStock.VoucherDate & a.Pname==phyStock.Pname
                    & a.Psize==phyStock.Psize & a.Pclass==phyStock.Pclass & a.Pmake== phyStock.Pmake & a.Wharehouse==phyStock.Wharehouse).FirstOrDefault();
                    if (dt == null)
                    {
                        phyStock.Companyid = comapnyid;
                        phyStock.userid = username;
                        _db.PhysicalStock.Add(phyStock);

                        _db.SaveChanges();
                        return Json(new { success = true, message = "Successfully Saved" });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Already Exist" });
                    }
                }
                else
                {
                    var dt = _db.PhysicalStock.Where(a => a.Companyid == comapnyid & a.VoucherDate.Date == phyStock.VoucherDate & a.Pname == phyStock.Pname
                   & a.Psize == phyStock.Psize & a.Pclass == phyStock.Pclass & a.Pmake == phyStock.Pmake & a.Wharehouse == phyStock.Wharehouse & a.Sr!=phyStock.Sr).FirstOrDefault();
                    if (dt == null)
                    {
                        var data = _db.PhysicalStock.Where(a => a.Companyid == comapnyid & a.Sr == phyStock.Sr).FirstOrDefault();
                        data.Pname = phyStock.Pname;
                        data.Pnameid = phyStock.Pnameid;
                        data.Psize = phyStock.Psize;
                        data.Psizeid = phyStock.Psizeid;
                        data.Pclass = phyStock.Pclass;
                        data.Pclassid = phyStock.Pclassid;
                        data.Pmake = phyStock.Pmake;
                        data.Pmakeid = phyStock.Pmakeid;
                        data.Wharehouse = phyStock.Wharehouse;
                        data.Wharehouseid = phyStock.Wharehouseid;
                        data.Qty = phyStock.Qty;
                        data.Qtyunit = phyStock.Qtyunit;
                        data.AltQty = phyStock.AltQty;
                        data.AltQtyunit = phyStock.AltQtyunit;

                        _db.SaveChanges();
                        return Json(new { success = true, data = data });
                    }
                    else
                    {
                        return Json(new { success = false, message = "Already Exist" });

                    }
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }



        [Route("viewvVoucher")]
        public IActionResult viewvVoucher(int voucherno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = new phy();
                var physicalStock = _db.PhysicalStock.Where(x => x.Sr == voucherno && x.Companyid == comapnyid ).FirstOrDefault();
              
                data.voucherDate = physicalStock.VoucherDate;
                data.pname = physicalStock.Pname;
                data.pnameid = physicalStock.Pnameid;
                data.size = physicalStock.Psize;
                data.sizeid = physicalStock.Psizeid;
                data.Class = physicalStock.Pclass;
                data.classid = physicalStock.Pclassid;
                data.make = physicalStock.Pmake;
                data.makeid = physicalStock.Pmakeid;
                data.frmWhareHouse = physicalStock.Wharehouse;
                data.frmWhareHouseid = physicalStock.Wharehouseid;
                data.Qty = physicalStock.Qty;
                data.QtyUnit = physicalStock.Qtyunit;
                data.AltQty = physicalStock.AltQty;
                data.AltQtyUnit = physicalStock.AltQtyunit;
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("VoucherList")]
        public IActionResult VoucherList(DateTime currentdate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];

                var data = _db.PhysicalStock.Where(a => a.Companyid == comapnyid && a.VoucherDate.Date == currentdate.Date).ToList().OrderByDescending(s => s.VoucherDate);
              
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [HttpDelete]
        [Route("DeleteVoucher")]
        public IActionResult DeleteVoucher(int voucherno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var physicalStock = _db.PhysicalStock.Where(u => u.Sr == voucherno && u.Companyid == comapnyid).FirstOrDefault();
                _db.PhysicalStock.RemoveRange(physicalStock);
                _db.SaveChanges();


                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
    }
}
