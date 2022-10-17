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

    [Route("api/LO")]
    public class LoadingOrderController : Controller
    {

        public readonly ApplicationDBContext _db;

        public LoadingOrderController(ApplicationDBContext db)
        {
            _db = db;
        }

        public IActionResult Index()
        {
            return View();
        }
        [Route("checkingLOD")]
        public IActionResult CheckingLOD(string dpno)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.tempLODetials.Where(x => x.Companyid == comapnyid && x.Dpno == dpno).FirstOrDefault();
                if (data != null)
                {
                    return Json(new { success = true, data = data, frm = "TEMP" });
                }
                else
                {
                    var data1 = _db.LODetials.Where(x => x.Companyid == comapnyid && x.Dpno == dpno).FirstOrDefault();
                    if (data1 != null)
                    {
                        return Json(new { success = true, data = data1, frm = "PERMANANT" });
                    }
                    else
                    {
                        return Json(new { success = false, error = false });
                    }

                }

            }
            catch (Exception Ex)
            {
                return Json(new { success = false, error = true, message = Ex });
            }
        }
        [Route("ConvertToLO")]
        public IActionResult ConvertToLO(string dpno)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                /*  var donodigit = _db.tempLODetials.Where(a => a.Userid == username && a.Companyid == comapnyid).Select(a => a.LoNodigit).FirstOrDefault();*/
                /* var tempDOdata = _db.tempLODetials.Where(u => u.Userid == username && u.Companyid == comapnyid).FirstOrDefault(); ;
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
                 var tempDODespatchItem = _db.tempLODesPatchItem.Where(u => u.LoNodigit == donodigit && u.Companyid == comapnyid).ToList();
                 if (tempDODespatchItem != null)
                 {
                     _db.tempLODesPatchItem.RemoveRange(tempDODespatchItem);
                     _db.SaveChanges();
                 }*/

                var data = _db.DispatchedDetail.Where(a => a.DPNo == dpno && a.Companyid == comapnyid).FirstOrDefault();
                var lonodigit = _db.tempLODetials.Where(a => a.Companyid == comapnyid).Select(p => p.LoNodigit).DefaultIfEmpty().Max();
                lonodigit++;
                if (data != null)
                {
                    var Tdo = new tempLODetials();
                    Tdo.LoNodigit = lonodigit;
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
                        Tpi.LoNodigit = lonodigit;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Pmake = tempitem.Pmake;
                        Tpi.orderqty = tempitem.Qty;
                        Tpi.orderunit = tempitem.Rateunit;
                        Tpi.MTRQTy = 0;
                        Tpi.AltQty = 0;
                        Tpi.ItemWeight = 0;
                        Tpi.MaterialSource = "";
                        Tpi.Companyid = comapnyid;
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }
                }
                var data1 = _db.tempLODetials.Where(a => a.LoNodigit == lonodigit).FirstOrDefault();
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
                var prefix = _db.Prefix.Where(a => a.Type == "loadingorder" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                DONodigit++;
                var dono = prefix + DONodigit;

                return Json(new { success = true, data = dono });
            }
            catch (Exception)
            {
                return Json(new { success = false });
            }
        }
        [Route("getitemByLONO")]
        public IActionResult getitemByLONO(string LONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.LOItem.Where(x => x.LoNo == LONO && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [Route("getitembyidLO")]
        public IActionResult getitembyidLO(int Itemid, string type, int tempDono, string LONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var qt = new tempLOItem();
                if (type == "temp")
                {

                    var dt = _db.tempLOItem.Where(x => x.LoNodigit == tempDono && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Pnameid = _db.Productname.Where(x => x.productname == dt.Pname && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Psize = dt.Psize;
                    qt.Psizeid = _db.Productsize.Where(x => x.productsize == dt.Psize && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pclass = dt.Pclass;
                    qt.Pclassid = _db.Productclass.Where(x => x.productclass == dt.Pclass && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pmake = dt.Pmake;
                    qt.Pmakeid = _db.Productmake.Where(x => x.productmake == dt.Pmake && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.orderqty = dt.orderqty;
                    qt.orderunit = dt.orderunit;
                    qt.MTRQTy = dt.MTRQTy;
                    qt.AltQty = dt.AltQty;
                    qt.AltQtyunit = dt.AltQtyunit;
                    qt.ItemWeight = dt.ItemWeight;
                    qt.ItemWeightUnit = dt.ItemWeightUnit;
                    qt.MaterialSource = dt.MaterialSource;
                    qt.sourceid = _db.Godownname.Where(a => a.godownName == dt.MaterialSource && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    var data2 = _db.tempLODesPatchItem.Where(a => a.LoNodigit == tempDono && a.Companyid == comapnyid && a.Itemid == Itemid).FirstOrDefault();
                    var status = false;
                    if (data2 != null)
                    {
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                    var data3 = _db.ItemMaster.Where(a => a.pname == dt.Pname && a.size == dt.Psize && a.Class == dt.Pclass).FirstOrDefault();
                    return Json(new { success = true, data = qt, status = status, data2 = data3 });
                }
                else
                {
                    var dt = _db.LOItem.Where(x => x.LoNo == LONO && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Pnameid = _db.Productname.Where(x => x.productname == dt.Pname && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Psize = dt.Psize;
                    qt.Psizeid = _db.Productsize.Where(x => x.productsize == dt.Psize && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pclass = dt.Pclass;
                    qt.Pclassid = _db.Productclass.Where(x => x.productclass == dt.Pclass && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pmake = dt.Pmake;
                    qt.Pmakeid = _db.Productmake.Where(x => x.productmake == dt.Pmake && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.orderqty = dt.orderqty;
                    qt.orderunit = dt.orderunit;
                    qt.MTRQTy = dt.MTRQTy;
                    qt.AltQty = dt.AltQty;
                    qt.AltQtyunit = dt.AltQtyunit;
                    qt.ItemWeight = dt.ItemWeight;
                    qt.ItemWeightUnit = dt.ItemWeightUnit;
                    qt.MaterialSource = dt.MaterialSource;
                    qt.sourceid = _db.Godownname.Where(a => a.godownName == dt.MaterialSource && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    var data2 = _db.LODesPatchItem.Where(a => a.LoNo == LONO && a.Companyid == comapnyid && a.Itemid == Itemid).FirstOrDefault();
                    var status = false;
                    if (data2 != null)
                    {
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                    var data3 = _db.ItemMaster.Where(a => a.pname == dt.Pname && a.size == dt.Psize && a.Class == dt.Pclass).FirstOrDefault();
                    return Json(new { success = true, data = qt, status = status, data2 = data3 });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("Updatetempcompanydetails")]
        public IActionResult Updatetempcompanydetails(tempLODetials dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];

                var data = _db.tempLODetials.Where(a => a.LoNodigit == dt.LoNodigit && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    data.Userid = username;
                    data.TransportCCode = dt.TransportCCode;
                    data.TransportName = dt.TransportName;
                    data.DriverName = dt.DriverName;
                    data.Mobileno = dt.Mobileno;
                    data.VechileNo = dt.VechileNo;
                    data.UnloadingIncharge = dt.UnloadingIncharge;
                    data.Companyid = comapnyid;
                    data.Note = dt.Note;
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
        [Route("Updatecompanydetails")]
        public IActionResult Updatecompanydetails(LODetials dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.LODetials.Where(s => s.Lono == dt.Lono && s.Companyid == comapnyid).FirstOrDefault();
                data.TransportCCode = dt.TransportCCode;
                data.TransportName = dt.TransportName;
                data.DriverName = dt.DriverName;
                data.Mobileno = dt.Mobileno;
                data.VechileNo = dt.VechileNo;
                data.UnloadingIncharge = dt.UnloadingIncharge;
                data.Companyid = comapnyid;
                data.Note = dt.Note;
                _db.SaveChanges();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("getitemLO")]
        public IActionResult getitemLO(int LoNodigit)
        {
            try
            {

                var comapnyid = Request.Cookies["companyid"];
                var data = _db.tempLOItem.Where(x => x.LoNodigit == LoNodigit && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getdespatchitem")]
        public IActionResult getdespatchitem(string LONO, string type, int lonodigit)
        {
            try
            {

                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var data = _db.tempLODesPatchItem.Where(x => x.LoNodigit == lonodigit && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                    return Json(new { success = true, data = data });
                }
                else
                {
                    var data = _db.LODesPatchItem.Where(x => x.LoNo == LONO && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                    return Json(new { success = true, data = data });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [HttpPost]
        [Route("AddNewTempItem")]
        public JsonResult AddNewTempItem(string type, tempLODesPatchItem dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    dt.Companyid = comapnyid;
                    _db.tempLODesPatchItem.Add(dt);
                    _db.SaveChanges();
                }
                else if (type == "Update")
                {
                    var data = _db.tempLODesPatchItem.Where(a => a.LoNodigit == dt.LoNodigit && a.Companyid == comapnyid && a.Itemid == dt.Itemid).FirstOrDefault();
                    data.Pclass = dt.Pclass;
                    data.Pmake = dt.Pmake;
                    data.orderqty = dt.orderqty;
                    data.orderunit = dt.orderunit;
                    data.MTRQTy = dt.MTRQTy;
                    data.AltQty = dt.AltQty;
                    data.ItemWeight = dt.ItemWeight;
                    data.MaterialSource = dt.MaterialSource;
                    data.Companyid = comapnyid;
                    _db.SaveChanges();
                }

                /*balance material*/
                var item = _db.tempLOItem.Where(s => s.LoNodigit == dt.LoNodigit && s.Companyid == comapnyid && s.Itemid == dt.Itemid).FirstOrDefault();
                item.Pclass = dt.Pclass;
                item.Pmake = dt.Pmake;
                item.orderqty = dt.orderqty;
                item.orderunit = dt.orderunit;
                item.MTRQTy = dt.MTRQTy;
                item.AltQty = dt.AltQty;
                item.ItemWeight = dt.ItemWeight;
                item.MaterialSource = dt.MaterialSource;
                item.Companyid = comapnyid;
                _db.SaveChanges();


                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("AddNewItem")]
        public JsonResult AddNewItem(string type, LODesPatchItem dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    dt.Companyid = comapnyid;
                    _db.LODesPatchItem.Add(dt);
                    _db.SaveChanges();
                }
                else if (type == "Update")
                {
                    var data = _db.LODesPatchItem.Where(a => a.LoNo == dt.LoNo && a.Companyid == comapnyid && a.Itemid == dt.Itemid).FirstOrDefault();
                    data.Pclass = dt.Pclass;
                    data.Pmake = dt.Pmake;
                    data.orderqty = dt.orderqty;
                    data.orderunit = dt.orderunit;
                    data.MTRQTy = dt.MTRQTy;
                    data.AltQty = dt.AltQty;
                    data.ItemWeight = dt.ItemWeight;
                    data.MaterialSource = dt.MaterialSource;
                    data.Companyid = comapnyid;
                    _db.SaveChanges();
                }

                /*balance material*/
                var item = _db.LOItem.Where(s => s.LoNo == dt.LoNo && s.Companyid == comapnyid && s.Itemid == dt.Itemid).FirstOrDefault();
                item.Pclass = dt.Pclass;
                item.Pmake = dt.Pmake;
                item.orderqty = dt.orderqty;
                item.orderunit = dt.orderunit;
                item.MTRQTy = dt.MTRQTy;
                item.AltQty = dt.AltQty;
                item.ItemWeight = dt.ItemWeight;
                item.MaterialSource = dt.MaterialSource;
                item.Companyid = comapnyid;
                _db.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [HttpDelete]
        [Route("DeleteLOItem")]
        public IActionResult DeleteLOItem(int lonodigit, int itmno, string lono, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var data2 = _db.tempLODesPatchItem.Where(u => u.LoNodigit == lonodigit && u.Itemid == itmno && u.Companyid == comapnyid).FirstOrDefault();
                    _db.tempLODesPatchItem.Remove(data2);
                    _db.SaveChanges();

                    var upitem = _db.tempLOItem.Where(a => a.LoNodigit == lonodigit && a.Companyid == comapnyid && a.Itemid == itmno).FirstOrDefault();
                    if (upitem != null)
                    {
                        upitem.MTRQTy = 0;
                        upitem.AltQty = 0;
                        upitem.ItemWeight = 0;
                        upitem.MaterialSource = "";
                        _db.SaveChanges();
                    }
                }
                else
                {
                    var data2 = _db.LODesPatchItem.Where(u => u.LoNo == lono && u.Itemid == itmno && u.Companyid == comapnyid).FirstOrDefault();
                    _db.LODesPatchItem.Remove(data2);
                    _db.SaveChanges();
                    var upitem = _db.LOItem.Where(a => a.LoNo == lono && a.Companyid == comapnyid && a.Itemid == itmno).FirstOrDefault();
                    if (upitem != null)
                    {
                        upitem.MTRQTy = 0;
                        upitem.AltQty = 0;
                        upitem.ItemWeight = 0;
                        upitem.MaterialSource = "";
                        _db.SaveChanges();
                    }
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
        [HttpPost]
        [Route("PermanantSave")]
        public IActionResult PermanantSave(int templonodigit, LODetials dt)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];

                var lonodigit = _db.LODetials.Where(a => a.Companyid == comapnyid && a.Companyid == comapnyid).Select(p => p.LoNodigit).DefaultIfEmpty().Max();
                lonodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "loadingorder" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                dt.Lono = prefix + lonodigit;

                dt.Userid = username;
                dt.LoNodigit = lonodigit;
                dt.Dpno = _db.tempLODetials.Where(a => a.LoNodigit == templonodigit && a.Companyid == comapnyid).Select(a => a.Dpno).FirstOrDefault();
                dt.Companyid = comapnyid;
                _db.LODetials.Add(dt);
                _db.SaveChanges();

                var data1 = _db.tempLOItem.ToList().Where(u => u.LoNodigit == templonodigit && u.Companyid == comapnyid);
                foreach (var tempitem in data1)
                {
                    var item = new LOItem();
                    item.LoNodigit = lonodigit;
                    item.LoNo = dt.Lono;
                    item.Itemid = tempitem.Itemid;
                    item.Pname = tempitem.Pname;
                    item.Altpname = tempitem.Altpname;
                    item.Psize = tempitem.Psize;
                    item.Altpsize = tempitem.Altpsize;
                    item.Pclass = tempitem.Pclass;
                    item.Altpclass = tempitem.Altpclass;
                    item.Pmake = tempitem.Pmake;
                    item.orderqty = tempitem.orderqty;
                    item.orderunit = tempitem.orderunit;
                    item.MTRQTy = tempitem.MTRQTy;
                    item.AltQty = tempitem.AltQty;
                    item.ItemWeight = tempitem.ItemWeight;
                    item.MaterialSource = tempitem.MaterialSource;
                    item.Companyid = comapnyid;
                    _db.LOItem.Add(item);
                    _db.SaveChanges();

                }

                var data2 = _db.tempLODesPatchItem.ToList().Where(u => u.LoNodigit == templonodigit && u.Companyid == comapnyid);
                foreach (var tempitem in data2)
                {
                    var item = new LODesPatchItem();
                    item.LoNodigit = lonodigit;
                    item.LoNo = dt.Lono;
                    item.Itemid = tempitem.Itemid;
                    item.Pname = tempitem.Pname;
                    item.Hashpname = tempitem.Hashpname;
                    item.Altpname = tempitem.Altpname;
                    item.Psize = tempitem.Psize;
                    item.Altpsize = tempitem.Altpsize;
                    item.Pclass = tempitem.Pclass;
                    item.Altpclass = tempitem.Altpclass;
                    item.Pmake = tempitem.Pmake;
                    item.orderqty = tempitem.orderqty;
                    item.orderunit = tempitem.orderunit;
                    item.AltQty = tempitem.AltQty;
                    item.MTRQTy = tempitem.MTRQTy;
                    item.ItemWeight = tempitem.ItemWeight;
                    item.MaterialSource = tempitem.MaterialSource;
                    item.Companyid = comapnyid;
                    _db.LODesPatchItem.Add(item);
                    _db.SaveChanges();

                }
                DeleteTempLO(templonodigit, dt.Dpno, dt.OldDoNo);
                return Json(new { success = true, data = dt.Lono });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("PermanantUpdate")]
        public IActionResult PermanantUpdate(LODetials dt)
        {
            try
            {
                var username = Request.Cookies["username"];
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.LODetials.Where(a => a.Lono == dt.Lono && a.Companyid == comapnyid).FirstOrDefault();
                data.Companyname = dt.Companyname;
                data.CompanyCode = dt.CompanyCode;
                data.Userid = username;
                data.DriverName = dt.DriverName;
                data.Mobileno = dt.Mobileno;
                data.TransportCCode = dt.TransportCCode;
                data.TransportName = dt.TransportName;
                data.UnloadingIncharge = dt.UnloadingIncharge;
                data.VechileNo = dt.VechileNo;
                data.Note = dt.Note;
                data.Companyid = comapnyid;
                _db.SaveChanges();

                return Json(new { success = true, data = dt.Lono });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteTempLO")]
        public IActionResult DeleteTempLO(int Lonodigit, string dpno, string OldDoNo)
        {
            try
            {

                var comapnyid = Request.Cookies["companyid"];
                if (OldDoNo == null)
                {
                    var tempLODetials = _db.tempLODetials.Where(u => u.LoNodigit == Lonodigit && u.Companyid == comapnyid).ToList();
                    foreach (var tt in tempLODetials)
                    {
                        var tempLOItem = _db.tempLOItem.Where(u => u.LoNodigit == tt.LoNodigit && u.Companyid == comapnyid).ToList();
                        if (tempLOItem != null)
                        {
                            _db.tempLOItem.RemoveRange(tempLOItem);
                            _db.SaveChanges();
                        }

                        var tempLO = _db.tempLODesPatchItem.Where(u => u.LoNodigit == tt.LoNodigit && u.Companyid == comapnyid).ToList();
                        if (tempLO != null)
                        {
                            _db.tempLODesPatchItem.RemoveRange(tempLO);
                            _db.SaveChanges();
                        }
                    }
                    if (tempLODetials != null)
                    {
                        _db.tempLODetials.RemoveRange(tempLODetials);
                        _db.SaveChanges();
                    }

                }
                else
                {
                    var tempLODetials = _db.tempLODetials.Where(u => u.OldDoNo == OldDoNo && u.Companyid == comapnyid).ToList();
                    foreach (var tt in tempLODetials)
                    {
                        var tempLOItem = _db.tempLOItem.Where(u => u.LoNodigit == tt.LoNodigit && u.Companyid == comapnyid).ToList();
                        if (tempLOItem != null)
                        {
                            _db.tempLOItem.RemoveRange(tempLOItem);
                            _db.SaveChanges();
                        }
                        var tempLO = _db.tempLODesPatchItem.Where(u => u.LoNodigit == tt.LoNodigit && u.Companyid == comapnyid).ToList();
                        if (tempLO != null)
                        {
                            _db.tempLODesPatchItem.RemoveRange(tempLO);
                            _db.SaveChanges();
                        }
                    }
                    if (tempLODetials != null)
                    {
                        _db.tempLODetials.RemoveRange(tempLODetials);
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
        [Route("getconvertor")]
        public IActionResult getconvertor(string pclass, string pname, string psize)
        {
            try
            {
                var data = _db.ItemMaster.Where(a => a.pname == pname && a.size == psize && a.Class == pclass).FirstOrDefault();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



    }
}
