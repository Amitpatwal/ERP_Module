using SALES_ERP.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace SALES_ERP.Controllers
{
    [Route("api/itemdatatable")]
    public class ItemMasterController : Controller
    {
        public readonly ApplicationDBContext _db;
        public ItemMasterController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        [Route("AddNewItem")]
        public JsonResult AddNewItem(ItemMaster item)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var temp = _db.ItemMaster.Where(s => s.pname == item.pname && s.Companyid == comapnyid && s.size == item.size && s.Class == item.Class).FirstOrDefault();
                if (temp == null)
                {
                    item.Companyid = comapnyid;
                    _db.ItemMaster.Add(item);
                    _db.SaveChanges();

                    var itemid = _db.ItemMaster.Where(a => a.pname == item.pname && a.Companyid == comapnyid).Select(a => a.ItemId).FirstOrDefault();
                    DateTime now = DateTime.Now;
                    Logs log = new Logs();
                    log.companyid = comapnyid;
                    log.date = now;
                    log.Description = "SAVE";
                    log.UsreName = Request.Cookies["username"];
                    log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                    log.VoucherType = "ITEM_MASTER";
                    log.VoucherId = Convert.ToString(itemid);
                    _db.Logs.Add(log);
                    _db.SaveChanges();



                    var data = _db.ItemMaster.Where(a => a.pname == item.pname && a.Companyid == comapnyid && a.size == item.size && a.Class == item.Class && a.category == item.category).Select(a => a.ItemId).FirstOrDefault();

                    return Json(new { success = true, message = "Item Created successfully", data = data }); ;
                }
                else
                {

                    return Json(new { success = false, message = "Item Already Exist" });

                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("UpdateItemMaster")]
        public JsonResult UpdateItemMaster(ItemMaster itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var temp = _db.ItemMaster.Where(s => s.pname == itemmaster.pname && s.Companyid == comapnyid && s.size == itemmaster.size && s.Class == itemmaster.Class && s.ItemId != itemmaster.ItemId).FirstOrDefault();
                if (temp == null)
                {
                    var ud = _db.ItemMaster.Where(s => s.ItemId == itemmaster.ItemId && s.Companyid == comapnyid).FirstOrDefault();
                    var pname = ud.pname;
                    var psize = ud.size;
                    var pclass = ud.Class;

                    ud.pname = itemmaster.pname;
                    ud.pnameid = itemmaster.pnameid;
                    ud.size = itemmaster.size;
                    ud.sizeid = itemmaster.sizeid;
                    ud.Class = itemmaster.Class;
                    ud.classid = itemmaster.classid;
                    ud.unit = itemmaster.unit;
                    ud.unitid = itemmaster.unitid;
                    ud.altunit = itemmaster.altunit;
                    ud.altunitid = itemmaster.altunitid;

                    ud.category = itemmaster.category;
                    ud.categoryid = itemmaster.categoryid;
                    ud.enableunit = itemmaster.enableunit;
                    ud.hsncode = itemmaster.hsncode;

                    ud.enableweight = itemmaster.enableweight;
                    ud.from = itemmaster.from;
                    ud.where = itemmaster.where;
                    ud.weightunit = itemmaster.weightunit;
                    ud.weightunitid = itemmaster.weightunitid;
                    ud.weight = itemmaster.weight;

                    ud.opening = itemmaster.opening;
                    ud.openingdate = itemmaster.openingdate;
                    ud.EnableLowStock = itemmaster.EnableLowStock;
                    ud.chooseWarningUnit = itemmaster.chooseWarningUnit;
                    ud.Lowstock = itemmaster.Lowstock;
                    ud.LowstockUnit = itemmaster.LowstockUnit;
                    ud.LowstockUnitID = itemmaster.LowstockUnitID;
                    ud.MaxStock = itemmaster.MaxStock;
                    ud.maximumStockUnit = itemmaster.maximumStockUnit;
                    ud.maximumStockUnitId = itemmaster.maximumStockUnitId;
                    ud.price = itemmaster.price;
                    ud.Companyid = comapnyid;
                    _db.SaveChanges();

                    List<QuotationItem> sales = _db.QuotationItem.Where(a => a.Pname == pname && a.Companyid == comapnyid && a.Psize == psize && a.Pclass == pclass).ToList();
                    sales.ForEach(a => a.Pname = itemmaster.pname);
                    sales.ForEach(a => a.Psize = itemmaster.size);
                    sales.ForEach(a => a.Pclass = itemmaster.Class);
                    _db.SaveChanges();



                    var itemid = _db.ItemMaster.Where(a => a.pname == itemmaster.pname && a.Companyid == comapnyid).Select(a => a.ItemId).FirstOrDefault();
                    DateTime now = DateTime.Now;
                    var log = new Logs();
                    log.companyid = comapnyid;
                    log.date = now;
                    log.Description = "UPDATE";
                    log.UsreName = Request.Cookies["username"];
                    log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                    log.VoucherType = "ITEM_MASTER";
                    log.VoucherId = Convert.ToString(itemid);
                    _db.Logs.Add(log);
                    _db.SaveChanges();



                    return Json(new { success = true, message = "Item is Updated Successfully", data = itemmaster.ItemId });
                }
                else
                {
                    return Json(new { success = false, message = "Item is already Exist" });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("GetTable")]
        public IActionResult GetTable(string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                List<namelist> namelist1 = new List<namelist>();
                if (type == "pname")
                {
                    var data = _db.Productname.Where(a => a.Companyid == comapnyid).ToList().OrderBy(a => a.productname);
                    foreach (var item1 in data)
                    {
                        namelist item = new namelist();
                        item.desc = item1.productname;
                        item.id = item1.id;
                        item.type = type;
                        namelist1.Add(item);
                    }
                }
                else if (type == "size")
                {
                    List<Productsize> data = _db.Productsize.Where(a => a.Companyid == comapnyid).ToList();
                    foreach (var item1 in data)
                    {
                        namelist item = new namelist();
                        item.desc = item1.productsize;
                        item.id = item1.id;
                        item.type = type;
                        namelist1.Add(item);
                    }
                }
                else if (type == "class")
                {
                    List<Productclass> data = _db.Productclass.Where(a => a.Companyid == comapnyid).ToList();
                    foreach (var item1 in data)
                    {
                        namelist item = new namelist();
                        item.desc = item1.productclass;
                        item.id = item1.id;
                        item.type = type;
                        namelist1.Add(item);
                    }
                }
                else if (type == "make")
                {
                    List<Productmake> data = _db.Productmake.Where(a => a.Companyid == comapnyid).ToList();
                    foreach (var item1 in data)
                    {
                        namelist item = new namelist();
                        item.desc = item1.productmake;
                        item.id = item1.id;
                        item.type = type;
                        namelist1.Add(item);
                    }
                }
                else if (type == "unit")
                {
                    var data = _db.Productunit.Where(a => a.Companyid == comapnyid).ToList();
                    foreach (var item1 in data)
                    {
                        namelist item = new namelist();
                        item.desc = item1.productunit;
                        item.id = item1.id;
                        item.type = type;
                        namelist1.Add(item);
                    }
                }
                else if (type == "category")
                {
                    var data = _db.Productcategory.Where(a => a.Companyid == comapnyid).ToList();
                    foreach (var item1 in data)
                    {
                        namelist item = new namelist();
                        item.desc = item1.productcategory;
                        item.id = item1.id;
                        item.type = type;
                        namelist1.Add(item);
                    }
                }
                else
                {
                    var data = _db.Godownname.Where(a => a.Companyid == comapnyid).ToList();
                    foreach (var item1 in data)
                    {
                        namelist item = new namelist();
                        item.desc = item1.godownName;
                        item.id = item1.id;
                        item.location = item1.location;
                        item.type = type;
                        namelist1.Add(item);
                    }

                }
                return Json(new { success = true, data = namelist1 });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("AddStock")]
        public IActionResult AddStock(OpeningStock st)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.OpeningStock.Where(a => a.ItemBrand == st.ItemBrand && a.Companyid == comapnyid && a.GodownLocation == st.GodownLocation && a.ItemId == st.ItemId).FirstOrDefault();
                if (data == null)
                {
                    st.Companyid = comapnyid;
                    _db.OpeningStock.Add(st);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Success" });
                }
                else
                {
                    return Json(new { success = false, message = "Already Exist" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex });
            }
        }

        [HttpPost]
        [Route("updateStock")]
        public IActionResult updateStock(OpeningStock st)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.OpeningStock.Where(a => a.ItemBrand == st.ItemBrand && a.Companyid == comapnyid && a.GodownLocation == st.GodownLocation && a.ItemId == st.ItemId && a.Id != st.Id).FirstOrDefault();
                if (data == null)
                {
                    var data1 = _db.OpeningStock.Where(a => a.Id == st.Id && a.Companyid == comapnyid).FirstOrDefault();
                    if (data1 != null)
                    {
                        data1.ItemBrand = st.ItemBrand;
                        data1.qty = st.qty;
                        data1.altQty = st.altQty;
                        data1.Companyid = comapnyid;
                        _db.SaveChanges();
                    }


                    return Json(new { success = true, message = "Success" });
                }
                else
                {
                    return Json(new { success = false, message = "Already Exist" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex });
            }
        }

        [Route("ShowStock")]
        public IActionResult ShowStock(int Itemid)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                List<OpeningStock> data = _db.OpeningStock.Where(a => a.ItemId == Itemid && a.Companyid == comapnyid).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("GetItemById")]
        public IActionResult GetItemById(int id, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                namelist item = new namelist();
                if (type == "pname")
                {
                    var data = _db.Productname.Where(a => a.id == id && a.Companyid == comapnyid).FirstOrDefault();
                    item.desc = data.productname;
                    item.id = data.id;
                    item.type = type;
                }
                else if (type == "size")
                {
                    var data = _db.Productsize.Where(a => a.id == id && a.Companyid == comapnyid).FirstOrDefault();
                    item.desc = data.productsize;
                    item.id = data.id;
                    item.type = type;
                }
                else if (type == "class")
                {
                    var data = _db.Productclass.Where(a => a.id == id && a.Companyid == comapnyid).FirstOrDefault();
                    item.desc = data.productclass;
                    item.id = data.id;
                    item.type = type;
                }
                else if (type == "make")
                {
                    var data = _db.Productmake.Where(a => a.id == id && a.Companyid == comapnyid).FirstOrDefault();
                    item.desc = data.productmake;
                    item.id = data.id;
                    item.type = type;

                }
                else if (type == "unit")
                {
                    var data = _db.Productunit.Where(a => a.id == id && a.Companyid == comapnyid).FirstOrDefault();
                    item.desc = data.productunit;
                    item.id = data.id;
                    item.type = type;
                }
                else if (type == "category")
                {
                    var data = _db.Productcategory.Where(a => a.id == id && a.Companyid == comapnyid).FirstOrDefault();
                    item.desc = data.productcategory;
                    item.id = data.id;
                    item.type = type;
                }
                else
                {
                    var data = _db.Godownname.Where(a => a.id == id && a.Companyid == comapnyid).FirstOrDefault();
                    item.desc = data.godownName;
                    item.id = data.id;
                    item.location = data.location;
                    item.type = type;
                }
                return Json(new { success = true, data = item });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("AddItem")]
        public IActionResult AddItem(string desc, string type, string location)
        {
            try
            {
                int count = 0;
                var comapnyid = Request.Cookies["companyid"];
                if (type == "pname")
                {
                    var temp = _db.Productname.Where(s => s.productname == desc && s.Companyid == comapnyid).FirstOrDefault();
                    if (temp == null)
                    {
                        count = 1;
                        Productname item = new Productname();
                        item.productname = desc;
                        item.Companyid = comapnyid;
                        _db.Productname.Add(item);
                    }
                }
                else if (type == "size")
                {
                    var temp = _db.Productsize.Where(s => s.productsize == desc && s.Companyid == comapnyid).FirstOrDefault();
                    if (temp == null)
                    {
                        count = 1;
                        Productsize item = new Productsize();
                        item.Companyid = comapnyid;
                        item.productsize = desc;
                        _db.Productsize.Add(item);
                    }

                }
                else if (type == "class")
                {
                    var temp = _db.Productclass.Where(s => s.productclass == desc && s.Companyid == comapnyid).FirstOrDefault();
                    if (temp == null)
                    {
                        count = 1;
                        Productclass item = new Productclass();
                        item.Companyid = comapnyid;
                        item.productclass = desc;
                        _db.Productclass.Add(item);
                    }
                }
                else if (type == "make")
                {
                    var temp = _db.Productmake.Where(s => s.productmake == desc && s.Companyid == comapnyid).FirstOrDefault();
                    if (temp == null)
                    {
                        count = 1;
                        Productmake item = new Productmake();
                        item.productmake = desc;
                        item.Companyid = comapnyid;
                        _db.Productmake.Add(item);
                    }
                }
                else if (type == "unit")
                {
                    var temp = _db.Productunit.Where(s => s.productunit == desc && s.Companyid == comapnyid).FirstOrDefault();
                    if (temp == null)
                    {
                        count = 1;
                        Productunit item = new Productunit();
                        item.productunit = desc;
                        item.Companyid = comapnyid;
                        _db.Productunit.Add(item);
                    }
                }
                else if (type == "category")
                {
                    var temp = _db.Productcategory.Where(s => s.productcategory == desc && s.Companyid == comapnyid).FirstOrDefault();
                    if (temp == null)
                    {
                        count = 1;
                        Productcategory item = new Productcategory();
                        item.productcategory = desc;
                        item.Companyid = comapnyid;
                        _db.Productcategory.Add(item);
                    }
                }
                else
                {
                    var temp = _db.Godownname.Where(s => s.godownName == desc && s.Companyid == comapnyid).FirstOrDefault();
                    if (temp == null)
                    {
                        count = 1;
                        Godownname item = new Godownname();
                        item.godownName = desc;
                        item.Companyid = comapnyid;
                        item.location = location;
                        _db.Godownname.Add(item);
                    }
                }
                if (count == 1)
                {
                    _db.SaveChanges();


                    return Json(new { success = true, message = "Added successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Data already exist with name " + desc });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("updateItem")]
        public IActionResult updateItem(namelist nm)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var status = false;
                if (nm.type == "pname")
                {
                    var data = _db.Productname.Where(a => a.productname == nm.desc && a.Companyid == comapnyid && a.id != nm.id).FirstOrDefault();
                    if (data == null)
                    {
                        var temp = _db.Productname.Where(a => a.id == nm.id && a.Companyid == comapnyid).FirstOrDefault();
                        var pname = temp.productname;
                        temp.productname = nm.desc;
                        _db.SaveChanges();
                        var temp1 = _db.ItemMaster.Where(x => x.pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp1 != null)
                        {
                            temp1.ForEach(a => a.pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp6 = _db.PurchaseOrderItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp6 != null)
                        {
                            temp6.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp7 = _db.TempPurchaseOrderItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp7 != null)
                        {
                            temp7.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp8 = _db.PurchaseRecievedItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp8 != null)
                        {
                            temp8.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp9 = _db.TempPurchaseRecievedItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp9 != null)
                        {
                            temp9.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp2 = _db.QuotationItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp2 != null)
                        {
                            temp2.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp3 = _db.TempQuotationItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp3 != null)
                        {
                            temp3.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp4 = _db.PIQuotationItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp4 != null)
                        {
                            temp4.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp5 = _db.TempPiQuotationItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp5 != null)
                        {
                            temp5.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }

                        var temp10 = _db.SOItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp10 != null)
                        {
                            temp10.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp11 = _db.TempSOItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp11 != null)
                        {
                            temp11.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp12 = _db.DispatchMaterial.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp12 != null)
                        {
                            temp12.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp13 = _db.HoldMaterial.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp13 != null)
                        {
                            temp13.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp14 = _db.DOItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp14 != null)
                        {
                            temp14.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp15 = _db.TempDOItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp15 != null)
                        {
                            temp15.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp16 = _db.DODespatchItem.Where(x => x.Pname == pname && x.Companyid == comapnyid).ToList();
                        if (temp16 != null)
                        {
                            temp16.ForEach(a => a.Pname = nm.desc);
                            _db.SaveChanges();
                        }
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }

                }
                else if (nm.type == "size")
                {
                    var data = _db.Productsize.Where(a => a.productsize == nm.desc && a.Companyid == comapnyid && a.id != nm.id).FirstOrDefault();
                    if (data == null)
                    {
                        var temp = _db.Productsize.Where(a => a.id == nm.id && a.Companyid == comapnyid).FirstOrDefault();
                        var psize = temp.productsize;
                        temp.productsize = nm.desc;
                        _db.SaveChanges();
                        var temp1 = _db.ItemMaster.Where(x => x.size == psize && x.Companyid == comapnyid).ToList();
                        if (temp1 != null)
                        {
                            temp1.ForEach(a => a.size = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp2 = _db.QuotationItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp2 != null)
                        {
                            temp2.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }


                        var temp3 = _db.TempQuotationItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp3 != null)
                        {
                            temp3.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp4 = _db.PIQuotationItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp4 != null)
                        {
                            temp4.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp5 = _db.TempPiQuotationItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp5 != null)
                        {
                            temp5.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp6 = _db.PurchaseOrderItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp6 != null)
                        {
                            temp6.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp7 = _db.TempPurchaseOrderItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp7 != null)
                        {
                            temp7.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp8 = _db.PurchaseRecievedItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp8 != null)
                        {
                            temp8.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp9 = _db.TempPurchaseRecievedItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp9 != null)
                        {
                            temp9.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp10 = _db.SOItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp10 != null)
                        {
                            temp10.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp11 = _db.TempSOItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp11 != null)
                        {
                            temp11.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp12 = _db.DispatchMaterial.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp12 != null)
                        {
                            temp12.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp13 = _db.HoldMaterial.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp13 != null)
                        {
                            temp13.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp14 = _db.DOItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp14 != null)
                        {
                            temp14.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp15 = _db.TempDOItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp15 != null)
                        {
                            temp15.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp16 = _db.DODespatchItem.Where(x => x.Psize == psize && x.Companyid == comapnyid).ToList();
                        if (temp16 != null)
                        {
                            temp16.ForEach(a => a.Psize = nm.desc);
                            _db.SaveChanges();
                        }

                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else if (nm.type == "class")
                {
                    var data = _db.Productclass.Where(a => a.productclass == nm.desc && a.Companyid == comapnyid && a.id != nm.id).FirstOrDefault();
                    if (data == null)
                    {
                        var temp = _db.Productclass.Where(a => a.id == nm.id && a.Companyid == comapnyid).FirstOrDefault();
                        var pclass = temp.productclass;
                        temp.productclass = nm.desc;
                        _db.SaveChanges();
                        var temp1 = _db.ItemMaster.Where(x => x.Class == pclass && x.Companyid == comapnyid).ToList();
                        if (temp1 != null)
                        {
                            temp1.ForEach(a => a.Class = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp2 = _db.QuotationItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp2 != null)
                        {
                            temp2.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp3 = _db.TempQuotationItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp3 != null)
                        {
                            temp3.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp4 = _db.PIQuotationItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp4 != null)
                        {
                            temp4.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp5 = _db.TempPiQuotationItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp5 != null)
                        {
                            temp5.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp6 = _db.PurchaseOrderItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp6 != null)
                        {
                            temp6.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp7 = _db.TempPurchaseOrderItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp7 != null)
                        {
                            temp7.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp8 = _db.PurchaseRecievedItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp8 != null)
                        {
                            temp8.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp9 = _db.TempPurchaseRecievedItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp9 != null)
                        {
                            temp9.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp10 = _db.SOItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp10 != null)
                        {
                            temp10.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp11 = _db.TempSOItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp11 != null)
                        {
                            temp11.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp12 = _db.DispatchMaterial.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp12 != null)
                        {
                            temp12.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp13 = _db.HoldMaterial.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp13 != null)
                        {
                            temp13.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp14 = _db.DOItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp14 != null)
                        {
                            temp14.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp15 = _db.TempDOItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp15 != null)
                        {
                            temp15.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp16 = _db.DODespatchItem.Where(x => x.Pclass == pclass && x.Companyid == comapnyid).ToList();
                        if (temp16 != null)
                        {
                            temp16.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }

                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else if (nm.type == "make")
                {
                    var data = _db.Productmake.Where(a => a.productmake == nm.desc && a.Companyid == comapnyid && a.id != nm.id).FirstOrDefault();
                    if (data == null)
                    {
                        var temp = _db.Productmake.Where(a => a.id == nm.id && a.Companyid == comapnyid).FirstOrDefault();
                        var make = temp.productmake;
                        temp.productmake = nm.desc;
                        _db.SaveChanges();

                        var temp2 = _db.QuotationItem.Where(x => x.Pmake == make && x.Companyid == comapnyid).ToList();
                        if (temp2 != null)
                        {
                            temp2.ForEach(a => a.Pmake = nm.desc);
                            _db.SaveChanges();
                        }
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else if (nm.type == "unit")
                {
                    var data = _db.Productunit.Where(a => a.productunit == nm.desc && a.Companyid == comapnyid && a.id != nm.id).FirstOrDefault();
                    if (data == null)
                    {
                        var temp = _db.Productunit.Where(a => a.id == nm.id && a.Companyid == comapnyid).FirstOrDefault();
                        var unit = temp.productunit;
                        temp.productunit = nm.desc;
                        _db.SaveChanges();
                        var temp1 = _db.ItemMaster.Where(x => x.unit == unit && x.Companyid == comapnyid).ToList();
                        if (temp1 != null)
                        {
                            temp1.ForEach(a => a.unit = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp2 = _db.QuotationItem.Where(x => x.Qtyunit == unit && x.Companyid == comapnyid).ToList();
                        if (temp2 != null)
                        {
                            temp2.ForEach(a => a.Qtyunit = nm.desc);
                            _db.SaveChanges();
                        }
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else if (nm.type == "category")
                {
                    var data = _db.Productcategory.Where(a => a.productcategory == nm.desc && a.Companyid == comapnyid && a.id != nm.id).FirstOrDefault();
                    if (data == null)
                    {
                        var temp = _db.Productcategory.Where(a => a.id == nm.id && a.Companyid == comapnyid && a.Companyid == comapnyid).FirstOrDefault();
                        var category = temp.productcategory;
                        temp.productcategory = nm.desc;
                        _db.SaveChanges();
                        var temp1 = _db.ItemMaster.Where(x => x.category == category && x.Companyid == comapnyid).ToList();
                        if (temp1 != null)
                        {
                            temp1.ForEach(a => a.category = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp2 = _db.QuotationItem.Where(x => x.Pcategory == category && x.Companyid == comapnyid).ToList();
                        if (temp2 != null)
                        {
                            temp2.ForEach(a => a.Pcategory = nm.desc);
                            _db.SaveChanges();
                        }
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else
                {
                    var data = _db.Godownname.Where(a => a.godownName == nm.desc && a.Companyid == comapnyid && a.id != nm.id).FirstOrDefault();
                    if (data == null)
                    {
                        var temp = _db.Godownname.Where(a => a.id == nm.id && a.Companyid == comapnyid).FirstOrDefault();
                        var godownname = temp.godownName;
                        temp.location = nm.location;
                        temp.godownName = nm.desc;
                        _db.SaveChanges();

                        var data1 = _db.OpeningStock.Where(a => a.GodownLocation == godownname && a.Companyid == comapnyid).ToList();
                        if (data1 != null)
                        {
                            data1.ForEach(a => a.GodownLocation = nm.desc);
                            _db.SaveChanges();
                        }

                        var temp8 = _db.PurchaseRecievedItem.Where(x => x.Wharehouse == godownname && x.Companyid == comapnyid).ToList();
                        if (temp8 != null)
                        {
                            temp8.ForEach(a => a.Wharehouse = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp9 = _db.TempPurchaseRecievedItem.Where(x => x.Wharehouse == godownname && x.Companyid == comapnyid).ToList();
                        if (temp9 != null)
                        {
                            temp9.ForEach(a => a.Pclass = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp16 = _db.DODespatchItem.Where(x => x.Wharehouse == godownname && x.Companyid == comapnyid).ToList();
                        if (temp16 != null)
                        {
                            temp16.ForEach(a => a.Wharehouse = nm.desc);
                            _db.SaveChanges();
                        }
                        var temp17 = _db.TempDODespatchItem.Where(x => x.Wharehouse == godownname && x.Companyid == comapnyid).ToList();
                        if (temp17 != null)
                        {
                            temp17.ForEach(a => a.Wharehouse = nm.desc);
                            _db.SaveChanges();
                        }
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                if (status == true)
                {




                    return Json(new { success = true, message = "updated successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Cannot be updated! Data already exist" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("Deleteitem")]
        public IActionResult Deleteitem(int Id, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var status = false;
                if (type == "pname")
                {
                    var dt = (from im in _db.ItemMaster join pn in _db.Productname on im.pname equals pn.productname where pn.id == Id && pn.Companyid == comapnyid && im.Companyid == comapnyid select new { Pname = pn.productname }).FirstOrDefault();
                    if (dt == null)
                    {
                        var ClientFromDB = _db.Productname.FirstOrDefault(u => u.id == Id);
                        _db.Productname.Remove(ClientFromDB);
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }

                }
                else if (type == "size")
                {
                    var dt = (from im in _db.ItemMaster join pn in _db.Productsize on im.size equals pn.productsize where pn.id == Id && pn.Companyid == comapnyid && im.Companyid == comapnyid select new { psize = pn.productsize }).FirstOrDefault();
                    if (dt == null)
                    {
                        var ClientFromDB = _db.Productsize.FirstOrDefault(u => u.id == Id);
                        _db.Productsize.Remove(ClientFromDB);
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else if (type == "class")
                {
                    var dt = (from im in _db.ItemMaster join pn in _db.Productclass on im.Class equals pn.productclass where pn.id == Id && pn.Companyid == comapnyid && im.Companyid == comapnyid select new { pid = pn.id }).FirstOrDefault();
                    if (dt == null)
                    {
                        var ClientFromDB = _db.Productclass.FirstOrDefault(u => u.id == Id);
                        _db.Productclass.Remove(ClientFromDB);
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else if (type == "make")
                {
                    var dt = (from im in _db.ItemMaster join pn in _db.Productmake on im.Class equals pn.productmake where pn.id == Id && pn.Companyid == comapnyid && im.Companyid == comapnyid select new { pid = pn.id }).FirstOrDefault();
                    if (dt == null)
                    {
                        var ClientFromDB = _db.Productmake.FirstOrDefault(u => u.id == Id);
                        _db.Productmake.Remove(ClientFromDB);
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else if (type == "unit")
                {
                    var dt = (from im in _db.ItemMaster join pn in _db.Productunit on im.unit equals pn.productunit where pn.id == Id && pn.Companyid == comapnyid && im.Companyid == comapnyid select new { pid = pn.id }).FirstOrDefault();
                    if (dt == null)
                    {
                        var ClientFromDB = _db.Productunit.FirstOrDefault(u => u.id == Id);
                        _db.Productunit.Remove(ClientFromDB);
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else if (type == "category")
                {
                    var dt = (from im in _db.ItemMaster join pn in _db.Productcategory on im.category equals pn.productcategory where pn.id == Id && pn.Companyid == comapnyid && im.Companyid == comapnyid select new { pid = pn.id }).FirstOrDefault();
                    if (dt == null)
                    {
                        var ClientFromDB = _db.Productcategory.FirstOrDefault(u => u.id == Id);
                        _db.Productcategory.Remove(ClientFromDB);
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                else
                {
                    var ClientFromDB = _db.Godownname.FirstOrDefault(u => u.id == Id);
                    _db.Godownname.Remove(ClientFromDB);
                    status = true;

                }

                if (status == true)
                {
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Deleted successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Item cannot be deleted Because data is in used!" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteStock")]
        public IActionResult DeleteStock(int stockid)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.OpeningStock.Where(u => u.Id == stockid && u.Companyid == comapnyid).FirstOrDefault();
                _db.OpeningStock.Remove(data);
                _db.SaveChanges();
                return Json(new { success = true, message = "Deleted successfully" });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("viewStockBYid")]
        public IActionResult viewStockBYid(int stockid)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.OpeningStock.Where(a => a.Id == stockid && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    data.locationid = _db.Godownname.Where(a => a.godownName == data.GodownLocation && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                    data.brandid = _db.Productmake.Where(a => a.productmake == data.ItemBrand && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
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

        [Route("GetItemTable")]
        public IActionResult GetItemTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.ItemMaster.Where(a => a.Companyid == comapnyid).ToList();

                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("GetGenralEntryTable")]
        public IActionResult GetGenralEntryTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.GeneralEntry.Where(a => a.Companyid == comapnyid).ToList();

                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



        [HttpDelete]
        [Route("Deleteproduct")]
        public IActionResult Deleteproduct(int Id)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var CBd = _db.ItemMaster.FirstOrDefault(u => u.ItemId == Id && u.Companyid == comapnyid);
                var item = _db.QuotationItem.FirstOrDefault(u => u.Pname == CBd.pname && u.Psize == CBd.size && u.Pclass == CBd.Class && u.Companyid == comapnyid);
                if (item == null)
                {
                    _db.ItemMaster.Remove(CBd);
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Deleted successfully" });
                }
                else
                {
                    return Json(new { success = false, message = "Item cannot be deleted! Because it is in used" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("GetTableByData")]
        public IActionResult GetTableByData(ItemMaster itemdata)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                List<itemname> tt = new List<itemname>();
                if (itemdata.type == "pname")
                {
                    /*  var data = _db.ItemMaster.Select(s=>s.pname).Distinct();*/
                    var dt = (from e in _db.ItemMaster join d in _db.Productname on e.pnameid equals d.id where e.Companyid == comapnyid && d.Companyid == comapnyid select new { id = d.id, desc = d.productname }).Distinct().OrderBy(a => a.desc);
                    foreach (var data in dt)
                    {
                        itemname it = new itemname();
                        it.id = data.id;
                        it.desc = data.desc;
                        tt.Add(it);
                    }
                    return Json(new { success = true, data = tt });
                }
                else if (itemdata.type == "size")
                {

                    var dt = (from e in _db.ItemMaster join d in _db.Productsize on e.size equals d.productsize where e.pname == itemdata.pname && e.Companyid == comapnyid && d.Companyid == comapnyid select new { id = d.id, desc = d.productsize }).Distinct().OrderBy(a => a.desc);
                    foreach (var data in dt)
                    {
                        itemname it = new itemname();
                        it.id = data.id;
                        it.desc = data.desc;
                        tt.Add(it);
                    }

                    return Json(new { success = true, data = tt });
                }
                else if (itemdata.type == "class")
                {
                    var sizee = itemdata.size;
                    if (sizee == null) { sizee = ""; }
                    var dt = (from e in _db.ItemMaster join d in _db.Productclass on e.Class equals d.productclass where e.pname == itemdata.pname && e.size == sizee && e.Companyid == comapnyid && d.Companyid == comapnyid select new { id = d.id, desc = d.productclass }).Distinct().OrderBy(a => a.desc);
                    foreach (var data in dt)
                    {
                        itemname it = new itemname();
                        it.id = data.id;
                        it.desc = data.desc;
                        tt.Add(it);
                    }
                    return Json(new { success = true, data = tt });
                }
                else if (itemdata.type == "unit")
                {//make
                    var category = _db.ItemMaster.Where(a => a.pname == itemdata.pname && a.size == itemdata.size && a.Class == itemdata.Class && a.Companyid == comapnyid).Select(a => a.category).FirstOrDefault();
                    if (category != null)
                    {
                        var unitlist = _db.Productcategory.Where(a => a.productcategory == category && a.Companyid == comapnyid).FirstOrDefault();
                        if (unitlist != null)
                        {
                            itemname it = new itemname();
                            it.id = _db.Productunit.Where(a => a.productunit == unitlist.unit && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                            it.desc = unitlist.unit;
                            it.unitType = "P";
                            tt.Add(it);
                            if (unitlist.altunit != null)
                            {
                                itemname itt = new itemname();
                                itt.id = _db.Productunit.Where(a => a.productunit == unitlist.altunit && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                                itt.desc = unitlist.altunit;
                                itt.unitType = "S";
                                tt.Add(itt);
                            }
                            if (unitlist.weightunit != null)
                            {
                                itemname itv = new itemname();
                                itv.id = _db.Productunit.Where(a => a.productunit == unitlist.weightunit && a.Companyid == comapnyid).Select(a => a.id).FirstOrDefault();
                                itv.desc = unitlist.weightunit;
                                itv.unitType = "T";
                                tt.Add(itv);
                            }
                        }

                    }

                    return Json(new { success = true,data=tt });

                }
                else
                {
                    return Json(new { success = false });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = ex });
            }
        }

        [Route("alternateUnit")]
        public IActionResult alternateUnit(ItemMaster item)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.ItemMaster.Where(a => a.pname == item.pname && a.size == item.size && a.Class == item.Class && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    var category = _db.Productcategory.Where(a => a.productcategory == data.category && a.Companyid == comapnyid).FirstOrDefault();
                    return Json(new { success = true, data = data, category = category });
                }
                else
                {
                    return Json(new { success = false });

                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = ex });
            }
        }

        [Route("viewitem")]
        public IActionResult viewitem(int itemno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.ItemMaster.Where(x => x.ItemId == itemno && x.Companyid == comapnyid).FirstOrDefault();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("OpeningStockReport")]
        public IActionResult OpeningStockReport()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                List<OpeningStockReport> tt = new List<OpeningStockReport>();
                var dt = (from itm in _db.ItemMaster join op in _db.OpeningStock on itm.ItemId equals op.ItemId where itm.Companyid == comapnyid && op.Companyid == comapnyid select new { id = op.Id, pname = itm.pname, psize = itm.size, pclass = itm.Class, pmake = op.ItemBrand, qty = op.qty, unit = itm.unit, altqty = op.altQty, altunit = itm.altunit, location = op.GodownLocation }).Distinct();
                foreach (var data in dt)
                {
                    OpeningStockReport it = new OpeningStockReport();
                    it.pname = data.pname;
                    it.psize = data.psize;
                    it.pclass = data.pclass;
                    it.pmake = data.pmake;
                    it.qty = data.qty;
                    it.unit = data.unit;
                    it.altqty = data.altqty;
                    it.altunit = data.altunit;
                    it.location = data.location;
                    it.id = data.id;
                    it.Companyid = comapnyid;
                    tt.Add(it);
                }
                return Json(new { success = true, data = tt });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



        [HttpPost]
        [Route("AddGenralEntry")]
        public JsonResult AddGenralEntry(GeneralEntry item)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];

                item.Companyid = comapnyid;
                _db.GeneralEntry.Add(item);
                _db.SaveChanges();
                return Json(new { success = true, message = "General Entry Created successfully" }); ;


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
        [HttpPost]
        [Route("AddCategory")]
        public IActionResult AddCategory(Productcategory pc, string type)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var temp = _db.Productcategory.Where(s => s.productcategory == pc.productcategory && s.Companyid == comapnyid).FirstOrDefault();
                    if (temp == null)
                    {
                        pc.Companyid = comapnyid;
                        _db.Productcategory.Add(pc);
                        _db.SaveChanges();
                    }
                    return Json(new { success = true, message = "Added successfully" });
                }
                else
                {
                    var data = _db.Productcategory.Where(a => a.id == pc.id && a.Companyid == comapnyid).FirstOrDefault();
                    data.productcategory = pc.productcategory;
                    data.unit = pc.unit;
                    data.unitid = pc.unitid;
                    data.altunit = pc.altunit;
                    data.altunitid = pc.altunitid;
                    data.weightunit = pc.weightunit;
                    data.physicalstock = pc.physicalstock;
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Successfully Updated" });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
        [Route("FillCategory")]
        public IActionResult FillCategory(int id)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Productcategory.Where(a => a.id==id && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    return Json(new { success = true, data = data });
                }
                else
                {
                    return Json(new { success = false, data = data });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [Route("FillCategoryy")]
        public IActionResult FillCategoryy(string category)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.Productcategory.Where(a => a.productcategory == category && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    return Json(new { success = true, data = data });
                }
                else
                {
                    return Json(new { success = false, data = data });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
    }
}
