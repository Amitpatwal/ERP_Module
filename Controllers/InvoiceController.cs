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
    [Route("api/INVOICE")]
    public class  InvoiceController : Controller
    {
        public readonly ApplicationDBContext _db;
        public InvoiceController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("IVNO")]
        public IActionResult IVNO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var IVNodigit = _db.InvoiceDetails.Where(a => a.Companyid == comapnyid).Select(p => p.InvoiceNodigit).DefaultIfEmpty().Max();
                IVNodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "invoiceVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var ivno = prefix + IVNodigit;
                return Json(new { success = true, data = ivno, });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



        [Route("ConvertToInvoice")]
        public IActionResult ConvertToInvoice(string dono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var IVNodigit = _db.TempInvoiceDetails.Where(a => a.Companyid == comapnyid).Select(p => p.InvoiceNodigit).DefaultIfEmpty().Max();
                IVNodigit++;
                var data = _db.DODetials.Where(a => a.DoNo == dono && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {

                    TempInvoiceDetails Tpi = new TempInvoiceDetails();
                    Tpi.InvoiceNodigit = IVNodigit;
                    Tpi.Dono = data.DoNo;
                    Tpi.Dodate = data.DoDate;
                    Tpi.SoNo = data.SoNo;
                    Tpi.SODate = data.SODate;
                    var sodetails = _db.SOdetails.Where(a => a.Companyid == comapnyid && a.SONo == data.SoNo).FirstOrDefault();
                    if(sodetails != null)
                    {
                        Tpi.Billingname = sodetails.BillCompanyname;
                        Tpi.BillingCCode = sodetails.BillCCode;
                        Tpi.BillingAddress = sodetails.BillAddress;
                        Tpi.BillingCity = sodetails.BillCity;
                        Tpi.BillingState = sodetails.BillState;
                        Tpi.BillingGST = sodetails.BillGST;
                        Tpi.BillingContactPerson = sodetails.BillContactperson;
                        Tpi.BillingMobile = sodetails.BillPhone;
                        Tpi.BillingEmail = sodetails.BillEmail;
                        Tpi.BillingPAN = _db.CustomerData.Where(a => a.Companyid == comapnyid && a.Companyname == Tpi.Billingname).Select(a => a.PAN).FirstOrDefault();

                        Tpi.Consginname = sodetails.ConsignCompanyname;
                        Tpi.ConsginCCode = sodetails.ConsignCCode;
                        Tpi.ConsginAddress = sodetails.ConsignAddress;
                        Tpi.ConsginCity = sodetails.ConsignCity;
                        Tpi.ConsginState = sodetails.ConsignState;
                        Tpi.ConsginGST = sodetails.ConsignGST;
                        Tpi.ConsignContactPerson = sodetails.ConsignContactperson;
                        Tpi.ConsignMobile = sodetails.ConsignPhone;
                        Tpi.ConsignEmail = sodetails.ConsignEmail;
                        Tpi.Label1 = sodetails.Label1;
                        Tpi.Label2 = sodetails.Label2;
                        Tpi.Label3 = sodetails.Label3;
                        Tpi.Label4 = sodetails.Label4;

                        Tpi.Input1 = sodetails.Input1;
                        Tpi.Input2 = sodetails.Input2;
                        Tpi.Input3 = sodetails.Input3;
                        Tpi.Input4 = sodetails.Input4;
                        Tpi.PoNo = sodetails.PONo;
                        Tpi.PoDate = sodetails.PODate;

                        Tpi.ConsginPAN = _db.CustomerData.Where(a => a.Companyid == comapnyid && a.Companyname == Tpi.Consginname).Select(a => a.PAN).FirstOrDefault();
                        
                    }
                    Tpi.TransportCCode = data.TransportCCode;
                    Tpi.TransportName = data.TransportName;
                    Tpi.VechileNo = data.VechileNo;
                    Tpi.FreightType = data.FreightType;
                    Tpi.FreightCharge = data.FreightCharge;
                    Tpi.ForwardingTransportAmount = data.ForwardingTransportAmount;
                    Tpi.GrNO = data.GrNO;
                    Tpi.Note = data.Note;
                    Tpi.Userid = Request.Cookies["username"];
                    Tpi.Companyid = comapnyid;
                    _db.TempInvoiceDetails.Add(Tpi);
                    _db.SaveChanges();

                }

                var item = _db.DODespatchItem.Where(a => a.DoNo == dono && a.Companyid == comapnyid).ToList();
                    foreach (var tempitem in item)
                    {
                        TempInvoiceItem Tpi = new TempInvoiceItem();
                        Tpi.IVNodigit = IVNodigit;
                        Tpi.Companyid = comapnyid;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Altpname = tempitem.Altpname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Altpsize = tempitem.Altpsize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Altpclass = tempitem.Altpclass;
                        Tpi.Pmake = tempitem.Pmake;
                        var unitType = _db.SOItem.Where(a => a.Companyid == comapnyid && a.Sono == data.SoNo && a.Itemid == tempitem.Itemid).Select(a => a.unitType).FirstOrDefault();
                        if(unitType == "P")
                        {
                        Tpi.Qty = tempitem.Qty;
                        Tpi.Qtyunit = tempitem.Qtyunit;
                        

                        }
                        else if(unitType == "S")
                        {
                        Tpi.Qty = tempitem.AltQty;
                        Tpi.Qtyunit = tempitem.AltQtyunit;

                       }
                    else
                    {
                        Tpi.Qty = tempitem.ItemWeight;
                        Tpi.Qtyunit = tempitem.ItemWeightUnit;
                    }
                        Tpi.price = _db.SOItem.Where(a => a.Companyid == comapnyid && a.Sono == data.SoNo && a.Itemid == tempitem.Itemid).Select(a => a.Rate).FirstOrDefault();
                        Tpi.discount = _db.SOItem.Where(a => a.Companyid == comapnyid && a.Sono == data.SoNo && a.Itemid == tempitem.Itemid).Select(a => a.Discount).FirstOrDefault();
                        Tpi.discountPrice = _db.SOItem.Where(a => a.Companyid == comapnyid && a.Sono == data.SoNo && a.Itemid == tempitem.Itemid).Select(a => a.Discountrate).FirstOrDefault();
                        Tpi.HSNCode = _db.SOItem.Where(a => a.Companyid == comapnyid && a.Sono == data.SoNo && a.Itemid == tempitem.Itemid).Select(a => a.Hsncode).FirstOrDefault();
                        Tpi.Amount = Tpi.Qty * Tpi.discountPrice;
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }

                
                var ff = _db.TempInvoiceDetails.Where(a => a.Companyid == comapnyid && a.InvoiceNodigit == IVNodigit).FirstOrDefault();

                if (ff != null)
                {
                    ff.Amount = _db.TempInvoiceItem.Where(a => a.Companyid == comapnyid && a.IVNodigit == IVNodigit).Sum(a => a.Amount);
                    _db.SaveChanges();
                }
                return Json(new { success = true, data = IVNodigit });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("ViewTempInvoice")]
        public IActionResult ViewTempInvoice(int ivnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempInvoiceDetails.Where(x => x.InvoiceNodigit == ivnodigit && x.Companyid == comapnyid).FirstOrDefault();
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
        public IActionResult viewTempitem(int ivnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempInvoiceItem.Where(x => x.IVNodigit == ivnodigit && x.Companyid == comapnyid).ToList().OrderBy(a => a.Itemid);
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
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

        [Route("viewInvoiceItem")]
        public IActionResult viewInvoiceItem(string ivno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.InvoiceItem.Where(x => x.IVNo == ivno && x.Companyid == comapnyid).ToList().OrderBy(a => a.Itemid);
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("InvoiceCheck")]
        public IActionResult InvoiceCheck(string dono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.InvoiceDetails.Where(a => a.Dono == dono && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {
                    return Json(new { status = true, data = data.IVNo, datafrom = "permanant" });
                }
                else
                {
                    var username = Request.Cookies["username"];
                    var check = _db.TempInvoiceDetails.Where(a => a.Userid == username && a.Companyid == comapnyid).FirstOrDefault();
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


        [Route("DeleteTempInvoice")]
        public IActionResult DeleteTempInvoice(int dono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var tempivdata = _db.TempInvoiceDetails.Where(u => u.InvoiceNodigit == dono && u.Companyid == comapnyid).ToList(); 
                if (tempivdata != null)
                {
                    _db.TempInvoiceDetails.RemoveRange(tempivdata);
                    _db.SaveChanges();
                }

                var tempInvoiceItem = _db.TempInvoiceItem.Where(u => u.IVNodigit == dono && u.Companyid == comapnyid).ToList();
                if (tempInvoiceItem != null)
                {
                    _db.TempInvoiceItem.RemoveRange(tempInvoiceItem);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Deleted successfully", data = dono });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("NewSO")]
        public IActionResult NewSO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                var tempSOdata = _db.TempSOdetails.Where(u => u.Companyid == comapnyid && u.Userid == userid).ToList(); ;
                foreach (var it in tempSOdata)
                {
                    var tempSOItem = _db.TempSOItem.Where(u => u.Sonodigit == it.SONodigit && u.Companyid == comapnyid).ToList();
                    if (tempSOItem != null)
                    {
                        _db.TempSOItem.RemoveRange(tempSOItem);
                        _db.SaveChanges();
                    }
                }
                if (tempSOdata != null)
                {
                    _db.TempSOdetails.RemoveRange(tempSOdata);
                    _db.SaveChanges();
                }


                return Json(new { success = true });
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
        [HttpPost]
        [Route("Addtempcompanydetails")]
        public IActionResult Addtempcompanydetails(string type, TempSOdetails data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type == "Update")
                {

                    var Tpi = _db.TempSOdetails.Where(x => x.SONodigit == data.SONodigit && x.Companyid == comapnyid).FirstOrDefault();

                    Tpi.PINo = data.PINo;
                    Tpi.Companyid = comapnyid;
                    Tpi.PIDate = data.PIDate;
                    Tpi.Quotno = data.Quotno;
                    Tpi.QtnDate = data.QtnDate;
                    Tpi.Amendno = data.Amendno;
                    Tpi.AmendDAte = data.AmendDAte;
                    Tpi.PONo = data.PONo;
                    Tpi.PODate = data.PODate;
                    Tpi.ordertype = data.ordertype;
                    Tpi.Tax = data.Tax;
                    Tpi.DeliveryDate = data.DeliveryDate;
                    Tpi.Label1 = data.Label1;
                    Tpi.Label2 = data.Label2;
                    Tpi.Label3 = data.Label3;
                    Tpi.Label4 = data.Label4;
                    Tpi.Tcs = data.Tcs;
                    Tpi.LD = data.LD;
                    Tpi.Input1 = data.Input1;
                    Tpi.Input2 = data.Input2;
                    Tpi.Input3 = data.Input3;
                    Tpi.Input4 = data.Input4;


                    Tpi.ConsignCompanyname = data.ConsignCompanyname;
                    Tpi.ConsignEmail = data.ConsignEmail;
                    Tpi.ConsignPhone = data.ConsignPhone;
                    Tpi.ConsignContactperson = data.ConsignContactperson;
                    Tpi.ConsignCCode = data.ConsignCCode;
                    Tpi.ConsignAddress = data.ConsignAddress;
                    Tpi.Consignstatecode = data.Consignstatecode;
                    Tpi.ConsignCity = data.ConsignCity;
                    Tpi.ConsignState = data.ConsignState;
                    Tpi.ConsignGST = data.ConsignGST;

                    Tpi.BillCompanyname = data.BillCompanyname;
                    Tpi.BillEmail = data.BillEmail;
                    Tpi.BillPhone = data.BillPhone;
                    Tpi.BillContactperson = data.BillContactperson;
                    Tpi.BillCCode = data.BillCCode;
                    Tpi.BillAddress = data.BillAddress;
                    Tpi.BillCity = data.BillCity;
                    Tpi.Billstatecode = data.Billstatecode;
                    Tpi.BillState = data.BillState;
                    Tpi.BillGST = data.BillGST;
                    Tpi.Note = data.Note;

                    Tpi.Userid = Request.Cookies["username"];
                    Tpi.Amount = data.Amount;

                    _db.SaveChanges();
                    return Json(new { success = true });
                }
                else
                {
                    var SONodigit = _db.TempSOdetails.Where(a => a.Companyid == comapnyid).Select(p => p.SONodigit).DefaultIfEmpty().Max();
                    SONodigit++;
                    data.SONodigit = SONodigit;
                    data.Companyid = comapnyid;
                    data.Userid = username;
                    _db.TempSOdetails.Add(data);
                    _db.SaveChanges();

                    return Json(new { success = true, data = SONodigit });
                }

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("Updatecompanydetails")]
        public IActionResult Updatecompanydetails(SOdetails data)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var Tpi = _db.SOdetails.Where(s => s.SONo == data.SONo && s.Companyid == comapnyid).FirstOrDefault();
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
                Tpi.PINo = data.PINo;
                Tpi.PIDate = data.PIDate;
                Tpi.Quotno = data.Quotno;
                Tpi.QtnDate = data.QtnDate;
                Tpi.SODate = data.SODate;
                Tpi.Note = data.Note;
                Tpi.Amount = data.Amount;
                _db.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }





        [Route("AddNewTempItem")]
        public JsonResult AddNewTempItem(TempSOItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.TempSOItem.Where(a => a.Sonodigit == itemmaster.Sonodigit && a.Companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                TempSOItem item = new TempSOItem();
                itemmaster.Itemid = itemid;
                itemmaster.Companyid = comapnyid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();

                _db.TempSOItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.TempSOItem.Where(u => u.Pino == itemmaster.Pino && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data = _db.TempSOdetails.Where(u => u.PINo == itemmaster.Pino && u.Companyid == comapnyid).FirstOrDefault();
                data.Amount = amount;
                _db.SaveChanges();
                return Json(new { success = true, data = amount });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("AddNewItem")]
        public JsonResult AddNewItem(SOItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.SOItem.Where(a => a.Sono == itemmaster.Sono && a.Companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                itemmaster.Itemid = itemid;
                itemmaster.Companyid = comapnyid;
                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                _db.SOItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.SOItem.Where(u => u.Sono == itemmaster.Sono && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data = _db.SOdetails.Where(u => u.SONo == itemmaster.Sono && u.Companyid == comapnyid).FirstOrDefault();
                data.Amount = amount;
                _db.SaveChanges();


                return Json(new { success = true, data = amount });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("checking")]
        public IActionResult Checking()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var data = _db.TempSOdetails.Where(x => x.Userid == username && x.Companyid == comapnyid).FirstOrDefault();
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
        [Route("InsertItem")]
        public JsonResult InsertItem(SOItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SOItem.Where(u => u.Sono == itemmaster.Sono && u.Companyid == comapnyid && u.Itemid >= itemmaster.Itemid).ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.SOItem.Where(k => k.Sr == itemm.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }

                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Companyid = comapnyid;
                _db.SOItem.Add(itemmaster);
                _db.SaveChanges();

                var amount = _db.SOItem.Where(u => u.Sono == itemmaster.Sono && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.SOdetails.Where(u => u.SONo == itemmaster.Sono && u.Companyid == comapnyid).FirstOrDefault();
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
        public JsonResult InsertTempItem(TempSOItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempSOItem.Where(u => u.Pino == itemmaster.Pino && u.Companyid == comapnyid && u.Itemid >= itemmaster.Itemid).ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.TempSOItem.Where(k => k.Sr == itemm.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }

                itemmaster.Hsncode = _db.ItemMaster.Where(x => x.pname == itemmaster.Pname && x.Companyid == comapnyid && x.size == itemmaster.Psize && x.Class == itemmaster.Pclass).Distinct().Select(u => u.hsncode).FirstOrDefault();
                itemmaster.Companyid = comapnyid;
                _db.TempSOItem.Add(itemmaster);
                _db.SaveChanges();


                var amount = _db.TempSOItem.Where(u => u.Pino == itemmaster.Pino && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.TempSOdetails.Where(u => u.PINo == itemmaster.Pino && u.Companyid == comapnyid).FirstOrDefault();
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
        public JsonResult UpDateItem(SOItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var item = _db.SOItem.Where(s => s.Sono == itemmaster.Sono && s.Companyid == comapnyid && s.Itemid == itemmaster.Itemid).FirstOrDefault();
                item.Sono = itemmaster.Sono;
                item.Companyid = comapnyid;
                item.Pname = itemmaster.Pname;
                item.Altpname = itemmaster.Altpname;
                item.Altpsize = itemmaster.Altpsize;
                item.Altpclass = itemmaster.Altpclass;
                item.Itemid = itemmaster.Itemid;
                item.Rate = itemmaster.Rate;
                item.Amount = itemmaster.Amount;
                item.Remarks = itemmaster.Remarks;
                item.Rateunit = itemmaster.Rateunit;
                item.Sonodigit = itemmaster.Sonodigit;
                item.Psize = itemmaster.Psize;
                item.Pclass = itemmaster.Pclass;
                item.Pmake = itemmaster.Pmake;
                item.Discount = itemmaster.Discount;
                item.Discountrate = itemmaster.Discountrate;
                item.Qty = itemmaster.Qty;
                item.Amount = itemmaster.Amount;
                item.Hsncode = itemmaster.Hsncode;
                item.Qtyunit = itemmaster.Qtyunit;
                item.Pino = itemmaster.Pino;
                _db.SaveChanges();




                DateTime now = DateTime.Now;
                var log = new Logs();
                log.companyid = comapnyid;
                log.date = now;
                log.Description = "UPDATE ITEM";
                log.UsreName = Request.Cookies["username"];
                log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                log.VoucherType = "SALE_ORDER";
                log.VoucherId = itemmaster.Sono;
                _db.Logs.Add(log);
                _db.SaveChanges();

                var amount = _db.SOItem.Where(u => u.Sono == itemmaster.Sono && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.SOdetails.Where(u => u.SONo == itemmaster.Sono && u.Companyid == comapnyid).FirstOrDefault();
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
        public JsonResult UpDateTempItem(TempSOItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var item = _db.TempSOItem.Where(s => s.Sonodigit == itemmaster.Sonodigit && s.Companyid == comapnyid && s.Itemid == itemmaster.Itemid).FirstOrDefault();
                item.Companyid = comapnyid;
                item.Sono = itemmaster.Sono;
                item.Pname = itemmaster.Pname;
                item.Altpname = itemmaster.Altpname;
                item.Altpsize = itemmaster.Altpsize;
                item.Altpclass = itemmaster.Altpclass;
                item.Itemid = itemmaster.Itemid;
                item.Rate = itemmaster.Rate;
                item.Amount = itemmaster.Amount;
                item.Remarks = itemmaster.Remarks;
                item.Rateunit = itemmaster.Rateunit;
                item.Sonodigit = itemmaster.Sonodigit;
                item.Psize = itemmaster.Psize;
                item.Pclass = itemmaster.Pclass;
                item.Pmake = itemmaster.Pmake;
                item.Discount = itemmaster.Discount;
                item.Discountrate = itemmaster.Discountrate;
                item.Qty = itemmaster.Qty;
                item.Amount = itemmaster.Amount;
                item.Hsncode = itemmaster.Hsncode;
                item.Qtyunit = itemmaster.Qtyunit;
                item.Pino = itemmaster.Pino;
                _db.SaveChanges();
                _db.SaveChanges();

                var amount = _db.TempSOItem.Where(u => u.Pino == itemmaster.Pino && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                var data1 = _db.TempSOdetails.Where(u => u.PINo == itemmaster.Pino && u.Companyid == comapnyid).FirstOrDefault();
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
        public IActionResult Getitembyid(int Itemid, string type, string sono, string pino)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                QuotationItem1 qt = new QuotationItem1();
                if (type == "temp")
                {

                    var dt = _db.TempSOItem.Where(x => x.Pino == pino && x.Companyid == comapnyid && x.Itemid == Itemid).FirstOrDefault();
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
                    qt.unitid = _db.Productunit.Where(x => x.productunit == dt.Rateunit).Select(s => s.id).FirstOrDefault();
                    qt.Rate = dt.Rate;
                    qt.Discount = dt.Discount;
                    qt.Discountrate = dt.Discountrate;
                    qt.Remarks = dt.Remarks;
                    qt.Amount = dt.Amount;
                    qt.Companyid = comapnyid;


                    return Json(new { success = true, data = qt });
                }
                else
                {
                    var dt = _db.SOItem.Where(x => x.Sono == sono && x.Companyid == comapnyid && x.Itemid == Itemid).FirstOrDefault();
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
                    return Json(new { success = true, data = qt });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("PermanantSave")]
        public IActionResult PermanantSave(string type, SOdetails data, string frm)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (type == "Save")
                {
                    var tempsonodigit = data.SONodigit;
                    var ctr = 0;
                    var dtitem = _db.TempSOItem.Where(a => a.Companyid == comapnyid && a.Sonodigit == tempsonodigit && a.Pmake == null).ToList();
                    foreach (var dtr in dtitem)
                    {
                        ctr = ctr + 1;
                    }
                    if (ctr == 0)
                    {
                        if (frm == "PI")
                        {
                            var dt = _db.SOdetails.Where(a => a.Companyid == comapnyid & a.PINo == data.PINo).FirstOrDefault();
                            if (dt != null)
                            {
                                ctr = ctr + 1;
                                data.SONo = dt.SONo;
                            }
                        }

                        if (ctr == 0)
                        {
                            var SONodigit = _db.SOdetails.Where(a => a.Companyid == comapnyid).Select(p => p.SONodigit).DefaultIfEmpty().Max();
                            SONodigit++;
                            var prefix = _db.Prefix.Where(a => a.Type == "saleOrder" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                            var sono = prefix + SONodigit;

                            data.Companyid = comapnyid;
                            data.SONo = sono;
                            data.SONodigit = SONodigit;
                            var totalamount = data.Input1 + data.Input2 + data.Amount;
                            if (data.Tax == "GST")
                            {
                                data.gstAmount = totalamount * 0.18;
                            }
                            else if (data.Tax == "LUT")
                            {
                                data.gstAmount = totalamount * 0.01;
                            }
                            data.Userid = Request.Cookies["username"];
                            _db.SOdetails.Add(data);
                            _db.SaveChanges();

                            var item = _db.TempSOItem.Where(a => a.Sonodigit == tempsonodigit && a.Companyid == comapnyid).ToList();
                            if (item != null)
                            {
                                foreach (var tempitem in item)
                                {
                                    SOItem Tpii = new SOItem();
                                    Tpii.Companyid = comapnyid;
                                    Tpii.Itemid = tempitem.Itemid;
                                    Tpii.Pino = tempitem.Pino;
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
                                    Tpii.Sono = data.SONo;
                                    Tpii.Sonodigit = data.SONodigit;
                                    _db.Add(Tpii);
                                    _db.SaveChanges();


                                    DateTime now = DateTime.Now;
                                    var log = new Logs();
                                    log.companyid = comapnyid;
                                    log.date = now;
                                    log.Description = "CREATE";
                                    log.UsreName = Request.Cookies["username"];
                                    log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                                    log.VoucherType = "SALE_ORDER";
                                    log.VoucherId = data.SONo;
                                    _db.Logs.Add(log);
                                    _db.SaveChanges();
                                }
                                /*DeleteTempSO(tempsonodigit);*/
                            }
                            return Json(new { success = true, message = "Successfully saved", data = data.SONo });
                        }
                        else
                        {
                           /* DeleteTempSO(tempsonodigit);*/
                            return Json(new { success = true, message = "Successfully saved", data = data.SONo });
                        }
                    }
                    else
                    {
                        return Json(new { success = false, message = "Make is Missing" });
                    }
                }
                else
                {
                    var data1 = _db.SOdetails.Where(a => a.SONo == data.SONo && a.Companyid == comapnyid).FirstOrDefault();
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
                    data1.Note = data.Note;

                    data1.AmendDAte = data.AmendDAte;
                    data1.Amendno = data.Amendno;
                    data1.ordertype = data.ordertype;
                    data1.PODate = data.PODate;
                    data1.PONo = data.PONo;
                    data1.LD = data.LD;
                    data1.DeliveryDate = data.DeliveryDate;
                    data1.Tcs = data.Tcs;
                    data1.Tax = data.Tax;
                    data1.PINo = data.PINo;
                    data1.PIDate = data.PIDate;

                    data1.SONo = data.SONo;
                    data1.SODate = data.SODate;

                    data1.Quotno = data.Quotno;
                    data1.QtnDate = data.QtnDate;
                    data1.Amount = data.Amount;


                    data1.InspectionClause = data.InspectionClause;
                    data1.EndProtectionRequired = data.EndProtectionRequired;
                    data1.EndCapBothSide = data.EndCapBothSide;
                    data1.CalibrationCertificate = data.CalibrationCertificate;
                    data1.EndFinshingRequired = data.EndFinshingRequired;
                    data1.MTC = data.MTC;
                    data1.QacRemarks = data.QacRemarks;
                    data1.Companyid = comapnyid;


                    var totalamount = data.Input1 + data.Input2 + data.Amount;
                    if (data.Tax == "GST")
                    {
                        data1.gstAmount = totalamount * 0.18;
                    }
                    else if (data.Tax == "LUT")
                    {
                        data1.gstAmount = totalamount * 0.01;
                    }


                    DateTime now = DateTime.Now;
                    var log = new Logs();
                    log.companyid = comapnyid;
                    log.date = now;
                    log.Description = "UPDATE";
                    log.UsreName = Request.Cookies["username"];
                    log.Usreid = Convert.ToInt32(Request.Cookies["id"]);
                    log.VoucherType = "SALE_ORDER";
                    log.VoucherId = data.SONo;
                    _db.Logs.Add(log);
                    _db.SaveChanges();

                    _db.SaveChanges();
                    return Json(new { success = true, message = "Successfully updated", data = data.SONo });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteItem")]
        public IActionResult DeleteItem(int itmno, string sono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var soitem = _db.SOItem.FirstOrDefault(u => u.Sono == sono && u.Itemid == itmno && u.Companyid == comapnyid);

                if (soitem != null)
                {
                    _db.SOItem.Remove(soitem);
                    _db.SaveChanges();
                    var i = 0;
                    var data = _db.SOItem.Where(u => u.Sono == sono && u.Itemid > itmno && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                    foreach (var item in data)
                    {
                        var temp = _db.SOItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                        temp.Itemid = itmno + i;
                        _db.SaveChanges();
                        i = i + 1;
                    }

                    var amount = _db.SOItem.Where(u => u.Sono == sono && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    var data1 = _db.SOdetails.Where(u => u.SONo == sono && u.Companyid == comapnyid).FirstOrDefault();
                    data1.Amount = amount;
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Deleted successfully", data = amount });
                }
                else
                {
                    return Json(new { success = false, message = "Error" });
                }


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteTempItem")]
        public IActionResult DeleteTempItem(string pino, int itmno, int sonodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var temppiitem = _db.TempSOItem.FirstOrDefault(u => u.Sonodigit == sonodigit && u.Companyid == comapnyid && u.Itemid == itmno);
                if (temppiitem != null)
                {
                    _db.TempSOItem.Remove(temppiitem);
                    _db.SaveChanges();

                    var data = _db.TempSOItem.Where(u => u.Sonodigit == sonodigit && u.Itemid > itmno && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                    foreach (var item in data)
                    {
                        var temp = _db.TempSOItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                        temp.Itemid = item.Itemid - 1;
                        _db.SaveChanges();
                    }
                    var amount = _db.TempSOItem.Where(u => u.Sonodigit == sonodigit && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    var data1 = _db.TempSOdetails.Where(u => u.SONodigit == sonodigit && u.Companyid == comapnyid).FirstOrDefault();
                    data1.Amount = amount;
                    _db.SaveChanges();
                    return Json(new { success = true, message = "Deleted successfully", data = amount });
                }
                else
                {

                    return Json(new { success = false, message = "Error" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("GetSOTable")]
        public IActionResult GetSOTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SOdetails.Where(a => a.Companyid == comapnyid).Select(a => new {
                    SODate = a.SODate,
                    SONo = a.SONo,
                    BillCompanyname = a.BillCompanyname,
                    Userid = a.Userid,
                    Amount = a.Amount,
                    counter = _db.Attachment.Where(b => b.voucherno == a.SONo && b.companyid == comapnyid && b.vouchername == "SALE_ORDER").Count(),
                    status = a.Status, PONo = a.PONo
                }).ToList().OrderByDescending(s => s.SODate.Date);
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


                var data = _db.SOdetails.Where(a => a.Companyid == comapnyid && a.SODate.Date >= fromdate.Date && a.SODate.Date <= todate.Date).ToList().OrderByDescending(s => s.SODate.Date);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }



        /*
         * 
         * 
         * 
                [Route("PrintSO")]
                public IActionResult PrintSO(string sono)
                {
                    try
                    {
                        var comapnyid = Request.Cookies["companyid"];
                        var data = _db.SOdetails.Where(x => x.SONo == sono && x.Companyid == comapnyid);
                        if (data != null) { return Json(new { success = true, data = data }); }
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



                [Route("PrintItemSo")]*/
        public IActionResult PrintItemSo(string pino)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SOItem.Where(x => x.Sono == pino && x.Companyid == comapnyid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }
        [Route("DeleteTempSOdigit")]
        public IActionResult DeleteTempSOdigit(int sonodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var tempSOdata = _db.TempSOdetails.Where(u => u.SONodigit == sonodigit && u.Companyid == comapnyid).ToList(); ;
                if (tempSOdata != null)
                {
                    _db.TempSOdetails.RemoveRange(tempSOdata);
                    _db.SaveChanges();
                }

                var tempSOItem = _db.TempSOItem.Where(u => u.Sonodigit == sonodigit && u.Companyid == comapnyid).ToList();
                if (tempSOItem != null)
                {
                    _db.TempSOItem.RemoveRange(tempSOItem);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }




        [Route("PrintSO")]
        public IActionResult PrintSO(string sono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SOdetails.Where(x => x.SONo == sono && x.Companyid == comapnyid);
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



        [Route("PrintItemSO")]
        public IActionResult PrintItemSO(string sono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.SOItem.Where(x => x.Sono == sono && x.Companyid == comapnyid).OrderBy(a => a.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("jumptoPrevious")]
        public IActionResult jumptoPrevious(int sonodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var sonod = _db.SOdetails.Where(a => a.SONodigit < sonodigit && a.Companyid == comapnyid).OrderByDescending(a => a.SONodigit).Select(a => a.SONo).FirstOrDefault();

                if (sonod != null)
                {
                    return Json(new { success = true, data = sonod });
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
        public IActionResult jumptoNext(int sonodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var sonod = _db.SOdetails.Where(a => a.SONodigit > sonodigit && a.Companyid == comapnyid).Select(a => a.SONo).FirstOrDefault();
                if (sonod != null)
                {
                    return Json(new { success = true, data = sonod });
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

        [Route("permissioncheck")]
        public IActionResult permissioncheck(string formName)
        {
            try
            {

                var usidd = Request.Cookies["id"];
                int usid = Convert.ToInt32(usidd);
                var roleidd = Request.Cookies["roleid"];
                int roleid = Convert.ToInt32(roleidd);


                var data = _db.userrights.Where(a => a.roleid == roleid && a.formsName == formName).ToList();
                return Json(new { success = true, data = data });

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



        [Route("FetchQapDetails")]
        public IActionResult FetchQapDetails(string SONO)
        {
            try
            {
                var companyid = Request.Cookies["companyid"];
                var data = _db.SOdetails.Where(a => a.SONo == SONO && a.Companyid == companyid).FirstOrDefault();
                if (data == null)
                {
                    return Json(new { success = false, data = "" });
                }
                else
                {
                    return Json(new { success = true, data = data });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }




    }
}
