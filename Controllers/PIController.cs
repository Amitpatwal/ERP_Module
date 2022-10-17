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
    [Route("api/PI")]
    public class PIController : Controller
    {
        public readonly ApplicationDBContext _db;
        public PIController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("PINO")]
        public IActionResult PINO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var PINodigit = _db.PIdetails.Where(a => a.Companyid == comapnyid).Select(p => p.PINodigit).DefaultIfEmpty().Max();
                PINodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "performaVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var quotno = prefix + PINodigit;

                var PINodigit1 = _db.Temppidata.Where(a => a.Companyid == comapnyid).Select(p => p.Pinodigit).DefaultIfEmpty().Max();
                PINodigit1++;
                return Json(new { success = true, data = quotno, data1 = PINodigit1 });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("pidetails")]
        public IActionResult Printquotation(string qtono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SalesqDetails.Where(x => x.Quotno == qtono && x.Companyid == comapnyid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [Route("ConvertToPi")]
        public IActionResult ConvertToPi(string quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SalesqDetails.Where(a => a.Quotno == quotno && a.Companyid == comapnyid).FirstOrDefault();
                var PINodigit = _db.Temppidata.Where(a => a.Companyid == comapnyid).Select(p => p.Pinodigit).DefaultIfEmpty().Max();
                PINodigit++;
                if (data != null)
                {
                    var cdata = _db.CustomerData.Where(a => a.Customerid == data.Ccode && a.Companyid == comapnyid).FirstOrDefault();

                    Temppidata Tpi = new Temppidata();
                    Tpi.Quotno = data.Quotno;
                    Tpi.QtnDate = data.Date;
                    Tpi.Pinodigit = PINodigit;
                    Tpi.ConsignCompanyname = data.Companyname;
                    Tpi.ConsignEmail = data.Email;
                    Tpi.ConsignPhone = data.Phone;
                    Tpi.ConsignContactperson = data.Contactperson;
                    Tpi.ConsignCCode = data.Ccode;
                    Tpi.ConsignAddress = data.Address;
                    Tpi.Consignstatecode = cdata.Statecode;
                    Tpi.ConsignCity = cdata.City;
                    Tpi.ConsignState = cdata.State;
                    Tpi.ConsignGST = cdata.GSt;

                    Tpi.BillCompanyname = data.Companyname;
                    Tpi.BillEmail = data.Email;
                    Tpi.BillPhone = data.Phone;
                    Tpi.BillContactperson = data.Contactperson;
                    Tpi.BillCCode = data.Ccode;
                    Tpi.BillAddress = data.Address;
                    Tpi.BillCity = cdata.City;
                    Tpi.Billstatecode = cdata.Statecode;
                    Tpi.BillState = cdata.State;
                    Tpi.BillGST = cdata.GSt;

                    Tpi.Userid = Request.Cookies["username"];
                    Tpi.Amount = data.Amount;
                    Tpi.Companyid = comapnyid;
                    _db.Temppidata.Add(Tpi);
                    _db.SaveChanges();
                }

                var item = _db.QuotationItem.Where(a => a.Quotno == quotno && a.Companyid == comapnyid).ToList();
                if (item != null)
                {
                    foreach (var tempitem in item)
                    {
                        TempPiQuotationItem Tpi = new TempPiQuotationItem();
                        Tpi.Pinodigit = PINodigit;
                        Tpi.Companyid = comapnyid;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.Quotno = tempitem.Quotno;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Altpname = tempitem.Altpname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Altpsize = tempitem.Altpsize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Altpclass = tempitem.Altpclass;
                        Tpi.Pmake = tempitem.Pmake;
                        Tpi.Qty = tempitem.Qty;
                        Tpi.Qtyunit = tempitem.Qtyunit;
                        Tpi.Rate = tempitem.Rate;
                        Tpi.Rateunit = tempitem.Rateunit;
                        Tpi.Remarks = tempitem.Remarks;
                        Tpi.Discount = tempitem.Discount;
                        Tpi.Discountrate = tempitem.Discountrate;
                        Tpi.Hsncode = tempitem.Hsncode;
                        Tpi.Amount = tempitem.Amount;
                        Tpi.unitType = tempitem.unitType;
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }
                }
                return Json(new { success = true, data = PINodigit });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
        [HttpPost]
        [Route("Addtempcompanydetails")]
        public IActionResult Addtempcompanydetails(string type, Temppidata data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type == "Save")
                {
                    var pinodigit = _db.Temppidata.Where(a => a.Companyid == comapnyid).Select(p => p.Pinodigit).DefaultIfEmpty().Max();
                    pinodigit++;
                    data.Pinodigit = pinodigit;
                    data.Userid = username;
                    data.Companyid = comapnyid;
                    _db.Temppidata.Add(data);
                    _db.SaveChanges();
                    return Json(new { success = true, data = pinodigit });

                }
                else
                {
                    var Tpi = _db.Temppidata.Where(a => a.Pinodigit == data.Pinodigit && a.Companyid == comapnyid).FirstOrDefault();
                    Tpi.ConsignCompanyname = data.ConsignCompanyname;
                    Tpi.Companyid = comapnyid;
                    Tpi.ConsignEmail = data.ConsignEmail;
                    Tpi.ConsignPhone = data.ConsignPhone;
                    Tpi.ConsignContactperson = data.ConsignContactperson;
                    Tpi.ConsignCCode = data.ConsignCCode;
                    Tpi.ConsignAddress = data.ConsignAddress;
                    Tpi.ConsignCity = data.ConsignCity;
                    Tpi.ConsignState = data.ConsignState;
                    Tpi.ConsignGST = data.ConsignGST;
                    Tpi.ConsignState = data.ConsignState;

                    Tpi.BillCompanyname = data.BillCompanyname;
                    Tpi.BillEmail = data.BillEmail;
                    Tpi.BillPhone = data.BillPhone;
                    Tpi.BillContactperson = data.BillContactperson;
                    Tpi.BillCCode = data.BillCCode;
                    Tpi.BillAddress = data.BillAddress;
                    Tpi.BillCity = data.BillCity;
                    Tpi.BillState = data.BillState;
                    Tpi.BillGST = data.BillGST;
                    Tpi.Billstatecode = data.Billstatecode;

                    Tpi.Userid = Request.Cookies["username"];
                    Tpi.Label1 = data.Label1;
                    Tpi.Input1 = data.Input1;
                    Tpi.Label2 = data.Label2;
                    Tpi.Input2 = data.Input2;
                    Tpi.Label3 = data.Label3;
                    Tpi.Input3 = data.Input3;
                    Tpi.Label4 = data.Label4;
                    Tpi.Input4 = data.Input4;

                    Tpi.AmendDAte = data.AmendDAte;
                    Tpi.Amendno = data.Amendno;
                    Tpi.PODate = data.PODate;
                    Tpi.ordertype = data.ordertype;
                    Tpi.PONo = data.PONo;
                    Tpi.LD = data.LD;
                    Tpi.DeliveryDate = data.DeliveryDate;
                    Tpi.Tcs = data.Tcs;
                    Tpi.Tax = data.Tax;
                    Tpi.Quotno = data.Quotno;
                    Tpi.QtnDate = data.QtnDate;
                    Tpi.Amount = data.Amount;
                    _db.SaveChanges();
                    return Json(new { success = true, data = data.Pinodigit });

                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("Updatecompanydetails")]
        public IActionResult Updatecompanydetails(PIdetails data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var Tpi = _db.PIdetails.Where(s => s.PINo == data.PINo && s.Companyid == comapnyid).FirstOrDefault();
                Tpi.Companyid = comapnyid;
                Tpi.ConsignCompanyname = data.ConsignCompanyname;
                Tpi.ConsignEmail = data.ConsignEmail;
                Tpi.ConsignPhone = data.ConsignPhone;
                Tpi.ConsignContactperson = data.ConsignContactperson;
                Tpi.ConsignCCode = data.ConsignCCode;
                Tpi.ConsignAddress = data.ConsignAddress;
                Tpi.ConsignCity = data.ConsignCity;
                Tpi.ConsignState = data.ConsignState;
                Tpi.ConsignGST = data.ConsignGST;
                Tpi.ConsignState = data.ConsignState;

                Tpi.BillCompanyname = data.BillCompanyname;
                Tpi.BillEmail = data.BillEmail;
                Tpi.BillPhone = data.BillPhone;
                Tpi.BillContactperson = data.BillContactperson;
                Tpi.BillCCode = data.BillCCode;
                Tpi.BillAddress = data.BillAddress;
                Tpi.BillCity = data.BillCity;
                Tpi.BillState = data.BillState;
                Tpi.BillGST = data.BillGST;
                Tpi.Billstatecode = data.Billstatecode;

                Tpi.Userid = Request.Cookies["username"];
                Tpi.Label1 = data.Label1;
                Tpi.Input1 = data.Input1;
                Tpi.Label2 = data.Label2;
                Tpi.Input2 = data.Input2;
                Tpi.Label3 = data.Label3;
                Tpi.Input3 = data.Input3;
                Tpi.Label4 = data.Label4;
                Tpi.Input4 = data.Input4;

                Tpi.AmendDAte = data.AmendDAte;
                Tpi.Amendno = data.Amendno;
                Tpi.PODate = data.PODate;
                Tpi.ordertype = data.ordertype;
                Tpi.PONo = data.PONo;
                Tpi.LD = data.LD;
                Tpi.DeliveryDate = data.DeliveryDate;
                Tpi.Tcs = data.Tcs;
                Tpi.Tax = data.Tax;
                Tpi.Quotno = data.Quotno;
                Tpi.QtnDate = data.QtnDate;
                Tpi.Amount = data.Amount;
                _db.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("ViewTempPi")]
        public IActionResult ViewTempPi(int pinodigit)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.Temppidata.Where(x => x.Pinodigit == pinodigit && x.Companyid == companyid).FirstOrDefault();
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

        [Route("viewTempitem")]
        public IActionResult viewTempitem(int pinodigit)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.TempPiQuotationItem.Where(x => x.Pinodigit == pinodigit && x.Companyid == companyid).ToList().OrderBy(a => a.Itemid);
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("viewPI")]
        public IActionResult ViewPi(string pino)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PIdetails.Where(x => x.PINo == pino && x.Companyid == comapnyid).FirstOrDefault();
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

        [Route("viewPiItem")]
        public IActionResult viewPiItem(string pino)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PIQuotationItem.Where(x => x.Pino == pino && x.Companyid == comapnyid).ToList().OrderBy(a => a.Itemid);
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("Check")]
        public IActionResult Check(string quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PIdetails.Where(a => a.Quotno == quotno && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    return Json(new { status = true, data = data.PINo, datafrom = "permanant" });
                }
                else
                {
                    var username = Request.Cookies["username"];
                    var check = _db.Temppidata.Where(a => a.Userid == username && a.Companyid == comapnyid).FirstOrDefault();
                    if (check != null)
                    {
                        return Json(new { status = true, data = check, datafrom = "temp" });
                    }
                    else
                    {
                        return Json(new { status = false });
                    }
                }
            }
            catch (Exception ex)
            {
                return (Json(new { status = false, message = ex }));
            }
        }

        [Route("Checkbyuser")]
        public IActionResult Checkbyuser()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var check = _db.Temppidata.Where(a => a.Userid == username && a.Companyid == comapnyid).FirstOrDefault();
                if (check != null)
                {
                    return Json(new { status = true, data = check, datafrom = "temp" });
                }
                else
                {
                    return Json(new { status = false });
                }

            }
            catch (Exception ex)
            {
                return (Json(new { status = false, message = ex }));
            }
        }
        [Route("DeleteTempPI")]
        public IActionResult DeleteTempPI(int quotno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var tempPIdata = _db.Temppidata.Where(u => u.Pinodigit == quotno && u.Companyid == comapnyid).ToList(); ;
                if (tempPIdata != null)
                {
                    _db.Temppidata.RemoveRange(tempPIdata);
                    _db.SaveChanges();
                }

                var tempPIItem = _db.TempPiQuotationItem.Where(u => u.Pinodigit == quotno && u.Companyid == comapnyid).ToList();
                if (tempPIItem != null)
                {
                    _db.TempPiQuotationItem.RemoveRange(tempPIItem);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Deleted successfully", data = quotno });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("fillcompanydata")]
        public IActionResult fillcompanydata(int ccode)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.CustomerData.Where(x => x.Customerid == ccode && x.Companyid == comapnyid).FirstOrDefault();
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

        [Route("AddNewItem")]
        public JsonResult AddNewItem(PIQuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.PIQuotationItem.Where(a => a.Pino == itemmaster.Pino && a.Companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                itemmaster.Itemid = itemid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass && x.Companyid == comapnyid).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Companyid = comapnyid;
                _db.PIQuotationItem.Add(itemmaster);
                _db.SaveChanges();


                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "SAVE ITEM";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "PERFORMA";
                log.VoucherId = itemmaster.Pino;
                _db.Logs.Add(log);
                _db.SaveChanges();



                var amount = _db.PIQuotationItem.Where(u => u.Pino == itemmaster.Pino && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data = _db.PIdetails.Where(u => u.PINo == itemmaster.Pino && u.Companyid == comapnyid).FirstOrDefault();
                data.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("AddNewTempItem")]
        public JsonResult AddNewTempItem(string type, TempPiQuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.TempPiQuotationItem.Where(a => a.Pinodigit == itemmaster.Pinodigit && a.Companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;

                itemmaster.Itemid = itemid;
                itemmaster.Companyid = comapnyid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                _db.TempPiQuotationItem.Add(itemmaster);
                _db.SaveChanges();


                var amount = _db.TempPiQuotationItem.Where(u => u.Pinodigit == itemmaster.Pinodigit && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data = _db.Temppidata.Where(u => u.Pinodigit == itemmaster.Pinodigit && u.Companyid == comapnyid).FirstOrDefault();
                data.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("InsertItem")]
        public JsonResult InsertItem(PIQuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PIQuotationItem.Where(u => u.Pino == itemmaster.Pino && u.Itemid >= itemmaster.Itemid && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.PIQuotationItem.Where(k => k.Sr == itemm.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }

                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass && x.Companyid == comapnyid).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Companyid = comapnyid;
                _db.PIQuotationItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.PIQuotationItem.Where(u => u.Pino == itemmaster.Pino && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.PIdetails.Where(u => u.PINo == itemmaster.Pino && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("InsertTempItem")]
        public JsonResult InsertTempItem(TempPiQuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempPiQuotationItem.Where(u => u.Pinodigit == itemmaster.Pinodigit && u.Companyid == comapnyid && u.Itemid >= itemmaster.Itemid).ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.TempPiQuotationItem.Where(k => k.Sr == itemm.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Companyid = comapnyid;
                _db.TempPiQuotationItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.TempPiQuotationItem.Where(u => u.Pinodigit == itemmaster.Pinodigit && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.Temppidata.Where(u => u.Quotno == itemmaster.Quotno && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();

                return Json(new { success = true, data = amount });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("UpDateTempItem")]
        public JsonResult UpDateTempItem(TempPiQuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var item = _db.TempPiQuotationItem.Where(s => s.Pinodigit == itemmaster.Pinodigit && s.Itemid == itemmaster.Itemid && s.Companyid == comapnyid).FirstOrDefault();
                item.Pino = itemmaster.Pino;
                item.Pinodigit = itemmaster.Pinodigit;
                item.Quotno = itemmaster.Quotno;
                item.Itemid = itemmaster.Itemid;
                item.Pname = itemmaster.Pname;
                item.Altpname = itemmaster.Altpname;
                item.Psize = itemmaster.Psize;
                item.Altpsize = itemmaster.Altpsize;
                item.Pclass = itemmaster.Pclass;
                item.Altpclass = itemmaster.Altpclass;
                item.Pmake = itemmaster.Pmake;
                item.Rate = itemmaster.Rate;
                item.Discount = itemmaster.Discount;
                item.Discountrate = itemmaster.Discountrate;
                item.Qty = itemmaster.Qty;
                item.Amount = itemmaster.Amount;
                item.Remarks = itemmaster.Remarks;
                item.Rateunit = itemmaster.Rateunit;
                item.Companyid = comapnyid;
                item.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                item.Qtyunit = itemmaster.Qtyunit;
                item.unitType = itemmaster.unitType;
                _db.SaveChanges();

                var amount = _db.TempPiQuotationItem.Where(u => u.Pinodigit == itemmaster.Pinodigit && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.Temppidata.Where(u => u.Pinodigit == itemmaster.Pinodigit && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
        [HttpPost]

        [Route("UpDateItem")]
        public JsonResult UpDateItem(PIQuotationItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var item = _db.PIQuotationItem.Where(s => s.Pino == itemmaster.Pino && s.Companyid == comapnyid && s.Itemid == itemmaster.Itemid).FirstOrDefault();
                item.Pino = itemmaster.Pino;
                item.Pinodigit = itemmaster.Pinodigit;
                item.Quotno = itemmaster.Quotno;
                item.Itemid = itemmaster.Itemid;
                item.Pname = itemmaster.Pname;
                item.Altpname = itemmaster.Altpname;
                item.Psize = itemmaster.Psize;
                item.Altpsize = itemmaster.Altpsize;
                item.Pclass = itemmaster.Pclass;
                item.Altpclass = itemmaster.Altpclass;
                item.Pmake = itemmaster.Pmake;
                item.Rate = itemmaster.Rate;
                item.Discount = itemmaster.Discount;
                item.Discountrate = itemmaster.Discountrate;
                item.Qty = itemmaster.Qty;
                item.Amount = itemmaster.Amount;
                item.Remarks = itemmaster.Remarks;
                item.Rateunit = itemmaster.Rateunit;
                item.Companyid = comapnyid;
                item.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                item.Qtyunit = itemmaster.Qtyunit;
                item.Companyid = comapnyid;
                item.unitType = itemmaster.unitType;
                _db.SaveChanges();

                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "UPDATE ITEM";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "PERFORMA";
                log.VoucherId = itemmaster.Pino;
                _db.Logs.Add(log);
                _db.SaveChanges();

                var amount = _db.PIQuotationItem.Where(u => u.Pino == itemmaster.Pino && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.PIdetails.Where(u => u.PINo == itemmaster.Pino && u.Companyid == comapnyid).FirstOrDefault();
                data1.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("getitembyid")]
        public IActionResult Getitembyid(int Itemid, string type, string Quotno, string pino)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                QuotationItem1 qt = new QuotationItem1();
                if (type == "temp")
                {

                    var dt = _db.TempPiQuotationItem.Where(x => x.Quotno == Quotno && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Pnameid = _db.Productname.Where(x => x.productname == dt.Pname && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Psize = dt.Psize;
                    qt.Psizeid = _db.Productsize.Where(x => x.productsize == dt.Psize && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pclass = dt.Pclass;
                    qt.Pclassid = _db.Productclass.Where(x => x.productclass == dt.Pclass && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pmake = dt.Pmake;
                    qt.Qty = dt.Qty;
                    qt.Qtyunit = dt.Rateunit;
                    qt.unitid = _db.Productunit.Where(x => x.productunit == dt.Rateunit && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Rate = dt.Rate;
                    qt.Discount = dt.Discount;
                    qt.Discountrate = dt.Discountrate;
                    qt.Remarks = dt.Remarks;
                    qt.Amount = dt.Amount;
                    qt.Companyid = comapnyid;
                    qt.unitType = dt.unitType;


                    return Json(new { success = true, data = qt });
                }
                else
                {
                    var dt = _db.PIQuotationItem.Where(x => x.Pino == pino && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
                    qt.Itemid = dt.Itemid;
                    qt.Pname = dt.Pname;
                    qt.Pnameid = _db.Productname.Where(x => x.productname == dt.Pname && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Psize = dt.Psize;
                    qt.Psizeid = _db.Productsize.Where(x => x.productsize == dt.Psize && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pclass = dt.Pclass;
                    qt.Pclassid = _db.Productclass.Where(x => x.productclass == dt.Pclass && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Pmake = dt.Pmake;
                    qt.Qty = dt.Qty;
                    qt.Qtyunit = dt.Rateunit;
                    qt.unitid = _db.Productunit.Where(x => x.productunit == dt.Rateunit && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Rate = dt.Rate;
                    qt.Discount = dt.Discount;
                    qt.Discountrate = dt.Discountrate;
                    qt.Remarks = dt.Remarks;
                    qt.Amount = dt.Amount;
                    qt.Companyid = comapnyid;
                    qt.unitType = dt.unitType;
                    return Json(new { success = true, data = qt });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("PermanantSave")]
        public IActionResult PermanantSave(int temppino, PIdetails data, string frm)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var ctr = 0;
                if (frm == "SQ")
                {
                    var dt = _db.PIdetails.Where(a => a.Quotno == data.Quotno & a.Companyid == comapnyid).FirstOrDefault();
                    if (dt != null)
                    {
                        ctr = ctr + 1;
                        data.PINo = dt.PINo;
                    }
                }
                if (ctr == 0)
                {
                    var PINodigit = _db.PIdetails.Where(a => a.Companyid == comapnyid).Select(p => p.PINodigit).DefaultIfEmpty().Max();
                    PINodigit++;
                    var prefix = _db.Prefix.Where(a => a.Type == "performaVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                    var pino = prefix + PINodigit;
                    data.Userid = Request.Cookies["username"];
                    data.PINo = pino;
                    data.PINodigit = PINodigit;
                    var totalamount = data.Input1 + data.Input2 + data.Amount;
                    data.total1 = totalamount;
                    if (data.Tax == "GST")
                    {
                        data.gstAmount = totalamount * 0.18;
                    }
                    else if (data.Tax == "LUT")
                    {
                        data.gstAmount = totalamount * 0.001;
                    }
                    var totalamount2 = totalamount + data.gstAmount;
                    data.total2 = totalamount2;
                    data.grandTotal = totalamount2 + data.Input3;
                    data.Companyid = comapnyid;
                    _db.PIdetails.Add(data);
                    _db.SaveChanges();

                    var item = _db.TempPiQuotationItem.Where(a => a.Pinodigit == temppino && a.Companyid == comapnyid).ToList();
                    if (item != null)
                    {
                        foreach (var tempitem in item)
                        {
                            PIQuotationItem Tpii = new PIQuotationItem();
                            Tpii.Companyid = comapnyid;
                            Tpii.Pino = pino;
                            Tpii.Pinodigit = PINodigit;
                            Tpii.Itemid = tempitem.Itemid;
                            Tpii.Quotno = tempitem.Quotno;
                            Tpii.Pname = tempitem.Pname;
                            Tpii.Altpname = tempitem.Altpname;
                            Tpii.Psize = tempitem.Psize;
                            Tpii.Altpsize = tempitem.Altpsize;
                            Tpii.Pclass = tempitem.Pclass;
                            Tpii.Altpclass = tempitem.Altpclass;
                            Tpii.Pmake = tempitem.Pmake;
                            Tpii.Qty = tempitem.Qty;
                            Tpii.Qtyunit = tempitem.Qtyunit;
                            Tpii.Rate = tempitem.Rate;
                            Tpii.Rateunit = tempitem.Rateunit;
                            Tpii.Remarks = tempitem.Remarks;
                            Tpii.Discount = tempitem.Discount;
                            Tpii.Discountrate = tempitem.Discountrate;
                            Tpii.Hsncode = tempitem.Hsncode;
                            Tpii.Amount = tempitem.Amount;
                            Tpii.unitType = tempitem.unitType;

                            _db.PIQuotationItem.Add(Tpii);
                            _db.SaveChanges();
                        }

                        DateTime now = DateTime.Now;
                        var log = new Logs();
                        log.companyid = comapnyid;
                        log.date = now;
                        log.Description = "CREATE";
                        log.UsreName = Request.Cookies["username"];
                        log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                        log.VoucherType = "PERFORMA";
                        log.VoucherId = data.PINo;
                        _db.Logs.Add(log);
                        _db.SaveChanges();
                    }
                }

                DeleteTempPI(temppino);
                return Json(new { success = true, message = "Successfully saved", data = data.PINo });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("PermanantUpdate")]
        public IActionResult PermanantUpdate(PIdetails data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data1 = _db.PIdetails.Where(a => a.PINo == data.PINo && a.Companyid == comapnyid).FirstOrDefault();
                data1.Companyid = comapnyid;
                data1.ConsignCompanyname = data.ConsignCompanyname;
                data1.ConsignEmail = data.ConsignEmail;
                data1.ConsignPhone = data.ConsignPhone;
                data1.ConsignContactperson = data.ConsignContactperson;
                data1.ConsignCCode = data.ConsignCCode;
                data1.ConsignAddress = data.ConsignAddress;
                data1.ConsignCity = data.ConsignCity;
                data1.ConsignState = data.ConsignState;
                data1.ConsignGST = data.ConsignGST;
                data1.Consignstatecode = data.Consignstatecode;

                data1.BillCompanyname = data.BillCompanyname;
                data1.BillEmail = data.BillEmail;
                data1.BillPhone = data.BillPhone;
                data1.BillContactperson = data.BillContactperson;
                data1.BillCCode = data.BillCCode;
                data1.BillAddress = data.BillAddress;
                data1.BillCity = data.BillCity;
                data1.BillState = data.BillState;
                data1.BillGST = data.BillGST;
                data1.Billstatecode = data.Billstatecode;

                data1.Userid = Request.Cookies["username"];
                data1.Label1 = data.Label1;
                data1.Input1 = data.Input1;
                data1.Label2 = data.Label2;
                data1.Input2 = data.Input2;
                data1.Label3 = data.Label3;
                data1.Input3 = data.Input3;
                data1.Label4 = data.Label4;
                data1.Input4 = data.Input4;

                data1.AmendDAte = data.AmendDAte;
                data1.Amendno = data.Amendno;
                data1.ordertype = data.ordertype;
                data1.PODate = data.PODate;
                data1.PONo = data.PONo;
                data1.LD = data.LD;
                data1.DeliveryDate = data.DeliveryDate;
                data1.Tcs = data.Tcs;
                data1.Tax = data.Tax;
                data1.Date = data.Date;
                data1.Quotno = data.Quotno;
                data1.QtnDate = data.QtnDate;

                var totalamount = data.Input1 + data.Input2 + data.Amount;
                data1.total1 = totalamount;
                var taxAmount = 0.0;
                if (data.Tax == "GST")
                {
                    taxAmount = totalamount * 0.18;
                    data1.gstAmount = taxAmount;
                }
                else if (data.Tax == "LUT")
                {
                    taxAmount = totalamount * 0.001;
                    data1.gstAmount = taxAmount;
                }
                var totalamount2 = totalamount + taxAmount;
                data1.total2 = totalamount2;
                data1.grandTotal = totalamount2 + data.Input3;
                data1.Note = data.Note;
                _db.SaveChanges();

                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "UPDATE";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "PERFORMA";
                log.VoucherId = data1.PINo;
                _db.Logs.Add(log);
                _db.SaveChanges();

                return Json(new { success = true, message = "Successfully updated", data = data.PINo });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteItem")]
        public IActionResult DeleteItem(string type, string pino, int itmno, string Quotno, int pinodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Update")
                {
                    var piitem = _db.PIQuotationItem.FirstOrDefault(u => u.Pino == pino && u.Itemid == itmno && u.Companyid == comapnyid);
                    _db.PIQuotationItem.Remove(piitem);
                    _db.SaveChanges();

                    var data = _db.PIQuotationItem.Where(u => u.Quotno == Quotno && u.Itemid > itmno && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                    foreach (var item in data)
                    {
                        var temp = _db.PIQuotationItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                        temp.Itemid = item.Itemid - 1;
                        _db.SaveChanges();
                    }

                    var amount = _db.PIQuotationItem.Where(u => u.Pino == pino && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    var data1 = _db.PIdetails.Where(u => u.PINo == pino && u.Companyid == comapnyid).FirstOrDefault();
                    data1.Amount = amount;
                    _db.SaveChanges();

                    return Json(new { success = true, message = "Deleted successfully", data = amount });
                }
                else
                {
                    var temppiitem = _db.TempPiQuotationItem.Where(u => u.Pinodigit == pinodigit && u.Companyid == comapnyid && u.Itemid == itmno).FirstOrDefault();
                    _db.TempPiQuotationItem.Remove(temppiitem);
                    _db.SaveChanges();

                    var data = _db.TempPiQuotationItem.Where(u => u.Pinodigit == pinodigit && u.Itemid > itmno && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                    foreach (var item in data)
                    {
                        var temp = _db.TempPiQuotationItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                        temp.Itemid = item.Itemid - 1;
                        _db.SaveChanges();
                    }
                    var amount = _db.TempPiQuotationItem.Where(u => u.Quotno == Quotno && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    var data1 = _db.Temppidata.Where(u => u.Quotno == Quotno && u.Companyid == comapnyid).FirstOrDefault();
                    data1.Amount = amount;
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Deleted successfully", data = amount });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("GetPITable")]
        public IActionResult GetPITable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PIdetails.Where(a => a.Companyid == comapnyid).Select(a => new {
                    PINo = a.PINo,
                    qtNo =a.Quotno,
                    Date = a.Date,
                    BillCompanyname = a.BillCompanyname,
                    Userid = a.Userid,
                    Amount = a.Amount,
                    sostatuss = _db.SOdetails.Where(b => b.PINo == a.PINo && b.Companyid == comapnyid).Select(a => a.SONo).FirstOrDefault()
                }).ToList().OrderByDescending(s => s.Date);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("DateWiseFilter")]
        public IActionResult DateWiseFilter(DateTime fromdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var pid = new List<PIdetails>();
                /* var data = _db.PIdetails.Where(a => a.Companyid == comapnyid && a.Date.Date >= fromdate.Date && a.Date.Date <= todate.Date).ToList().OrderByDescending(s => s.PINodigit);*/

                var data = _db.PIdetails.Where(a => a.Companyid == comapnyid && a.Date.Date >= fromdate.Date && a.Date.Date <= todate.Date).Select(a => new {
                    PINo = a.PINo,
                    qtNo = a.Quotno,
                    Date = a.Date,
                    BillCompanyname = a.BillCompanyname,
                    Userid = a.Userid,
                    Amount = a.Amount,
                    sostatuss = _db.SOdetails.Where(b => b.PINo == a.PINo && b.Companyid == comapnyid).Select(a => a.SONo).FirstOrDefault()
                }).ToList().OrderByDescending(s => s.Date);
                foreach (var dt in data)
                {
                    var pidd = new PIdetails();
                    pidd.PINo = dt.PINo;
                    pidd.Date = dt.Date;
                    pidd.BillCompanyname = dt.BillCompanyname;
                    pidd.Userid = dt.Userid;
                    pidd.Amount = dt.Amount;
                    var sost = _db.SOdetails.Where(a => a.PINo == dt.PINo && a.Companyid == comapnyid).FirstOrDefault();
                    if (sost != null)
                    {
                        pidd.sostatus = true;
                    }
                    else
                    {
                        pidd.sostatus = false;

                    }
                    pid.Add(pidd);

                }
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("PrintPI")]
        public IActionResult PrintPI(string pino)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PIdetails.Where(x => x.PINo == pino && x.Companyid == comapnyid);
                var bank = _db.Bank.Where(a => a.Companyid == comapnyid && a.Defaulter == true).FirstOrDefault();
                if (data != null && bank != null)
                {
                    return Json(new { success = true, bk = true, data = data, bank = bank });
                }
                else if (data != null)
                {
                    return Json(new { success = true, bk = false, data = data, });
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



        [Route("PrintItemPi")]
        public IActionResult PrintItemPi(string pino)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PIQuotationItem.Where(x => x.Pino == pino && x.Companyid == comapnyid).OrderBy(a => a.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



        [Route("jumptoPrevious")]
        public IActionResult jumptoPrevious(int pinodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var quotnod = _db.PIdetails.Where(a => a.PINodigit < pinodigit && a.Companyid == comapnyid).OrderByDescending(a => a.PINodigit).Select(a => a.PINo).FirstOrDefault();

                if (quotnod != null)
                {
                    return Json(new { success = true, data = quotnod });
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
        public IActionResult jumptoNext(int pinodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var quotnod = _db.PIdetails.Where(a => a.PINodigit > pinodigit && a.Companyid == comapnyid).Select(a => a.PINo).FirstOrDefault();
                if (quotnod != null)
                {
                    return Json(new { success = true, data = quotnod });
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


        [Route("SearchPI")]
        public IActionResult SearchPI(string searchtype, string searchValue, DateTime frmdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (searchtype == "CONSIGNPARTY")
                {
                    var data = _db.PIdetails.Where(x => x.ConsignCompanyname.Contains(searchValue) && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }
                else if (searchtype == "RECEINTPARTY")
                {
                    var data = _db.PIdetails.Where(x => x.BillCompanyname.Contains(searchValue) && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }
                else if (searchtype == "QUOTNO")
                {
                    var data = _db.PIdetails.Where(x => x.Quotno.Contains(searchValue) && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }
                else if (searchtype == "PINO")
                {
                    var data = _db.PIdetails.Where(x => x.PINo.Contains(searchValue) && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }
                else
                {
                    var data = _db.PIdetails.Where(x => x.Date.Date >= frmdate.Date && x.Date.Date <= todate.Date && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.Date.Date) });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpDelete]
        [Route("DeletePI")]
        public IActionResult DeletePI(string PINO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var pi = _db.PIdetails.Where(u => u.PINo == PINO && u.Companyid == comapnyid).ToList();
                if (pi != null)
                {
                    _db.PIdetails.RemoveRange(pi);
                    _db.SaveChanges();
                }

                var piItem = _db.PIQuotationItem.Where(u => u.Pino == PINO && u.Companyid == comapnyid).ToList();
                if (piItem != null)
                {
                    _db.PIQuotationItem.RemoveRange(piItem);
                    _db.SaveChanges();
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
