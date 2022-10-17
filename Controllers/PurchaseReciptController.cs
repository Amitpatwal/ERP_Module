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
    [Route("api/PR")]
    public class PurchaseRecieptController : Controller
    {

        public readonly ApplicationDBContext _db;
        public PurchaseRecieptController(ApplicationDBContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }


        [Route("ConvertToPO")]
        public IActionResult ConvertToPO(string pono)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var prnodigit = _db.TempPRDetials.Where(a => a.Companyid == comapnyid).Select(p => p.PrNodigit).DefaultIfEmpty().Max();
                prnodigit++;
                var data = _db.PODetials.Where(a => a.PoNo == pono && a.Companyid == comapnyid).FirstOrDefault();
                if (data != null)
                {

                    TempPRDetials Tpi = new TempPRDetials();
                    Tpi.PrNodigit = prnodigit;
                    Tpi.PoNo = data.PoNo;
                    Tpi.PoDate = data.Date;
                    Tpi.SupplierCompanyname = data.SupplierCompanyname;
                    Tpi.SupplierCCode = data.SupplierCCode;
                    Tpi.Userid = Request.Cookies["username"];
                    Tpi.Companyid = comapnyid;
                    _db.TempPRDetials.Add(Tpi);
                    _db.SaveChanges();
                }

                var item = _db.PurchaseOrderItem.Where(a => a.PoNo == pono && a.Companyid == comapnyid).ToList();
                if (item != null)
                {
                    foreach (var tempitem in item)
                    {

                        TempPurchaseRecievedItem Tpi = new TempPurchaseRecievedItem();
                        Tpi.PrNodigit = prnodigit;
                        Tpi.Companyid = comapnyid;
                        Tpi.Itemid = tempitem.Itemid;
                        Tpi.PrNo = tempitem.PoNo;
                        Tpi.Pname = tempitem.Pname;
                        Tpi.Altpname = tempitem.Altpname;
                        Tpi.Psize = tempitem.Psize;
                        Tpi.Altpsize = tempitem.Altpsize;
                        Tpi.Pclass = tempitem.Pclass;
                        Tpi.Altpclass = tempitem.Altpclass;
                        Tpi.Pmake = tempitem.Pmake;
                        Tpi.Qtyunit = _db.ItemMaster.Where(a => a.pname == tempitem.Pname && a.size == tempitem.Psize && a.Class == tempitem.Pclass).Select(a => a.unit).FirstOrDefault();
                        Tpi.AltQtyunit = _db.ItemMaster.Where(a => a.pname == tempitem.Pname && a.size == tempitem.Psize && a.Class == tempitem.Pclass).Select(a => a.altunit
                        ).FirstOrDefault();
                        _db.Add(Tpi);
                        _db.SaveChanges();
                    }
                }
                return Json(new { success = true, data = prnodigit });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("ViewTempPR")]
        public IActionResult ViewTempPR(int prnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempPRDetials.Where(x => x.PrNodigit == prnodigit && x.Companyid == comapnyid).FirstOrDefault();
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
        public IActionResult Addtempcompanydetails(string type,TempPRDetials dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                if (type == "Save")
                {
                    var PrNodigit = _db.TempPRDetials.Where(a => a.Companyid == comapnyid).Select(p => p.PrNodigit).DefaultIfEmpty().Max();
                    PrNodigit++;

                    dt.PrNodigit = PrNodigit;
                    dt.Userid = username;
                    dt.Companyid = comapnyid;
                    _db.TempPRDetials.Add(dt);
                    _db.SaveChanges();
                    return Json(new { success = true, data = PrNodigit });
                }
                else
                {
                    var data = _db.TempPRDetials.Where(a => a.PrNodigit == dt.PrNodigit && a.Companyid == comapnyid).FirstOrDefault();
                        data.PoDate = dt.PoDate;
                        data.PoNo = dt.PoNo;
                        data.PIDate = dt.PIDate;
                        data.PINo = dt.PINo;
                        data.SupplierCCode = dt.SupplierCCode;
                        data.SupplierCompanyname = dt.SupplierCompanyname;
                        data.SupplierAddress = dt.SupplierAddress;
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
                        data.Companyid = comapnyid;

                    data.GrNO = dt.GrNO;
                    data.ForwardingTransportAmount = dt.ForwardingTransportAmount;
                        _db.SaveChanges();
                        return Json(new { success = true });
                    
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("Updatecompanydetails")]
        public IActionResult Updatecompanydetails(PRDetials dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PRDetials.Where(s => s.PrNo == dt.PrNo && s.Companyid == comapnyid && s.voucherType == "PR").FirstOrDefault();
                data.PoDate = dt.PoDate;
                data.Companyid = comapnyid;
                data.PoNo = dt.PoNo;
                data.PIDate = dt.PIDate;
                data.PINo = dt.PINo;
                data.SupplierCCode = dt.SupplierCCode;
                data.SupplierCompanyname = dt.SupplierCompanyname;
                data.SupplierAddress = _db.CustomerData.Where(a => a.Customerid == dt.SupplierCCode).Select(a => a.Address).FirstOrDefault();
                
                data.TransportCCode = dt.TransportCCode;
                data.TransportName = dt.TransportName;
                data.DriverName = dt.DriverName;
                data.Mobileno = dt.Mobileno;
                data.VechileNo = dt.VechileNo;
                data.License = dt.License;
                data.UnloadingIncharge = dt.UnloadingIncharge;

                data.Contractor = dt.Contractor;
                data.Contratorid = dt.Contratorid;

                data.CraneLoadingWeightkg = dt.CraneLoadingWeightkg;
                data.CraneLoadingWeightmt = dt.CraneLoadingWeightmt;
                data.CraneTotalCharge = dt.CraneTotalCharge;
                data.CraneCharge = dt.CraneCharge;

                data.ManualCharge = dt.ManualCharge;
                data.ManualLoadingWeightkg = dt.ManualLoadingWeightkg;
                data.ManualLoadingWeightmt = dt.ManualLoadingWeightmt;
                data.ManualTotalCharge = dt.ManualTotalCharge;
                data.GrNO = dt.GrNO;
                data.ForwardingTransportAmount = dt.ForwardingTransportAmount;

                data.FreightCharge = dt.FreightCharge;
                data.FreightType = dt.FreightType;
                data.Note = dt.Note;
                _db.SaveChanges();

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("GetPRTable")]
        public IActionResult GetPRTable()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PRDetials.Where(a=>a.Companyid==comapnyid && a.voucherType == "PR").ToList().OrderByDescending(s => s.PrDate);
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
                var data = _db.PRDetials.Where(a => a.status == true && a.Companyid == comapnyid && a.voucherType == "PR" && a.PrDate.Date >= fromdate.Date && a.PrDate.Date <= todate.Date).Select(a => new
                {
                    prNo = a.PrNo,
                    piNo = a.PINo,
                    poNo = a.PoNo,
                    prDate = a.PrDate,
                    Prnodigit = a.PrNodigit,
                    supplierCompanyname = a.SupplierCompanyname,
                    created = a.Userid,
                    rejected = _db.PrReason.Where(b => b.Prno == a.PrNo && b.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault()
                }).ToList().OrderByDescending(s => s.prDate);
                
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

                var data = _db.PRDetials.Where(a => a.status == true && a.Companyid == comapnyid && a.voucherType == "PR").Select(a=> new 
                {
                    prNo = a.PrNo,
                    piNo = a.PINo,
                    prDate = a.PrDate,
                    Prnodigit = a.PrNodigit,
                    poNo=a.PoNo,
                    supplierCompanyname = a.SupplierCompanyname,
                    created = a.Userid,
                    rejected = _db.PrReason.Where(b => b.Prno == a.PrNo && b.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault()
                }).ToList().OrderByDescending(s => s.prDate);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("GetPRTableApprovalPending")]
        public IActionResult GetPRTableApprovalPending()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PRDetials.ToList().OrderByDescending(s => s.PrDate).Where(a => a.status == false && a.Companyid == comapnyid && a.reason == "submitted" && a.voucherType == "PR");
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
                List<Viewreport> dt = new List<Viewreport>();

                var data = _db.PRDetials.ToList().OrderByDescending(s => s.PrDate).Where(a => a.status == false && a.Companyid == comapnyid && a.reason == "rejected" && a.voucherType == "PR");
                foreach (var temp in data)
                {
                    Viewreport vl = new Viewreport();

                    vl.prNo = temp.PrNo;
                    vl.piNo = temp.PINo;
                    vl.poNo = temp.PoNo;
                    vl.prDate = temp.PrDate;
                    vl.Prnodigit = temp.PrNodigit;
                    vl.supplierCompanyname = temp.SupplierCompanyname;
                    vl.created = temp.Userid;
                    var dataa = _db.PrReason.Where(a => a.Prno == temp.PrNo && a.Companyid == comapnyid).OrderByDescending(a => a.Sr).FirstOrDefault();
                    vl.rejected = dataa.userid;
                    vl.reason = dataa.Remarks;
                    vl.Companyid = comapnyid;
                    dt.Add(vl);


                }
                return Json(new { success = true, data = dt });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }


        [Route("GetPRTableIncomplete")]
        public IActionResult GetPRTableIncomplete()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PRDetials.ToList().OrderByDescending(s => s.PrDate).Where(a => a.status == false && a.Companyid == comapnyid && a.reason == "incomplete" && a.voucherType == "PR");
                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, data = "", msg = ex });
            }
        }
       
        [Route("PRNO")]
        public IActionResult PRNO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var PRNodigit = _db.PRDetials.Where(a => a.Companyid == comapnyid && a.voucherType=="PR").Select(p => p.PrNodigit).DefaultIfEmpty().Max();
                PRNodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "purchaseRecieptVoucher" && a.Companyid == comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var quotno = prefix + PRNodigit;

                var tempPRNodigit = _db.TempPRDetials.Where(a=>a.Companyid==comapnyid).Select(p => p.PrNodigit).DefaultIfEmpty().Max();
                tempPRNodigit++;

                return Json(new { success = true, data = quotno, data1 = tempPRNodigit });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("counter")]
        public IActionResult counter()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var approved = _db.PRDetials.Where(a => a.reason == "approved" && a.Companyid == comapnyid && a.voucherType == "PR").Count();
                var submitted = _db.PRDetials.Where(a => a.reason == "submitted" && a.Companyid == comapnyid && a.voucherType == "PR").Count();
                var rejected = _db.PRDetials.Where(a => a.reason == "rejected" && a.Companyid == comapnyid && a.voucherType == "PR").Count();
                var incomplete = _db.PRDetials.Where(a => a.reason == "incomplete" && a.Companyid == comapnyid && a.voucherType == "PR").Count();

                return Json(new { success = true, approved = approved, submitted = submitted, rejected = rejected, incomplete = incomplete });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("TempPRNO")]
        public IActionResult TempPRNO()
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var PrNodigit1 = _db.TempPRDetials.Where(a=>a.Companyid==comapnyid).Select(p => p.PrNodigit).DefaultIfEmpty().Max();
                PrNodigit1++;
                var PrNodigit = _db.TempPRDetials.Where(a=>a.Companyid==comapnyid).Select(p => p.PrNodigit).DefaultIfEmpty().Max();
                PrNodigit++;
                return Json(new { success = true, data = PrNodigit1, data1 = PrNodigit });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("AddNewItem")]
        public JsonResult AddNewItem(PurchaseRecievedItem item)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.PurchaseRecievedItem.Where(a => a.PrNo == item.PrNo && a.Companyid == comapnyid && a.VoucherType == "PR").Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                item.Itemid = itemid;
                item.Companyid = comapnyid;
                item.VoucherType = "PR";
                _db.PurchaseRecievedItem.Add(item);
                _db.SaveChanges();


                var data1 = _db.PRDetials.Where(a => a.PrNo == item.PrNo && a.Companyid == comapnyid && a.voucherType == "PR").FirstOrDefault();
                var clkg = _db.PurchaseRecievedItem.Where(a => a.PrNo == item.PrNo && a.Companyid == comapnyid && a.UnloadedBy == "Crane" && a.VoucherType == "PR").Select(a => a.ItemWeight).Sum();
                var mlkg = _db.PurchaseRecievedItem.Where(a => a.PrNo == item.PrNo && a.Companyid == comapnyid && a.UnloadedBy == "Manual" && a.VoucherType == "PR").Select(a => a.ItemWeight).Sum();
                var Blkg = _db.PurchaseRecievedItem.Where(a => a.PrNo == item.PrNo && a.Companyid == comapnyid && a.UnloadedBy == "Crane & Manual" && a.VoucherType == "PR").Select(a => a.ItemWeight).Sum();
                data1.CraneLoadingWeightkg = clkg + Blkg;
                data1.ManualLoadingWeightkg = mlkg + Blkg;
                data1.CraneLoadingWeightmt = data1.CraneLoadingWeightkg / 1000;
                data1.ManualLoadingWeightmt = data1.ManualLoadingWeightkg / 1000;
                _db.SaveChanges();

                return Json(new { success = true, data = data1 });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("AddNewTempItem")]
        public JsonResult AddNewTempItem(TempPurchaseRecievedItem item)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var itemid = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid).Select(a => a.Itemid).DefaultIfEmpty().Max();
                itemid++;
                item.Itemid = itemid;
                item.Companyid = comapnyid;
                _db.TempPurchaseRecievedItem.Add(item);
                _db.SaveChanges();

                var data = _db.TempPRDetials.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid).FirstOrDefault();
                var clkg = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid && a.UnloadedBy == "Crane").Select(a => a.ItemWeight).Sum();
                var mlkg = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid && a.UnloadedBy == "Manual").Select(a => a.ItemWeight).Sum();
                var Blkg = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid && a.UnloadedBy == "Crane & Manual").Select(a => a.ItemWeight).Sum();
                data.CraneLoadingWeightkg = clkg + Blkg;
                data.ManualLoadingWeightkg = mlkg + Blkg; data.CraneLoadingWeightmt = data.CraneLoadingWeightkg / 1000;
                data.ManualLoadingWeightmt = data.ManualLoadingWeightkg / 1000;
                _db.SaveChanges();

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("InsertItem")]
        public JsonResult InsertItem(PurchaseRecievedItem item)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PurchaseRecievedItem.Where(u => u.PrNo == item.PrNo && u.Companyid == comapnyid && u.Itemid >= item.Itemid && u.VoucherType == "PR").ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.PurchaseRecievedItem.Where(k => k.Sr == itemm.Sr && k.Companyid == comapnyid && k.VoucherType == "PR").FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }
                item.Companyid = comapnyid;
                item.VoucherType = "PR";
                _db.PurchaseRecievedItem.Add(item);
                _db.SaveChanges();


                var data1 = _db.PRDetials.Where(a => a.PrNo == item.PrNo && a.Companyid == comapnyid && a.voucherType  == "PR").FirstOrDefault();
                var clkg = _db.PurchaseRecievedItem.Where(a => a.PrNo == item.PrNo && a.Companyid == comapnyid && a.UnloadedBy == "Crane" && a.VoucherType == "PR").Select(a => a.ItemWeight).Sum();
                var mlkg = _db.PurchaseRecievedItem.Where(a => a.PrNo == item.PrNo && a.Companyid == comapnyid && a.UnloadedBy == "Manual" && a.VoucherType == "PR").Select(a => a.ItemWeight).Sum();
                var Blkg = _db.PurchaseRecievedItem.Where(a => a.PrNo == item.PrNo && a.Companyid == comapnyid && a.UnloadedBy == "Crane & Manual" && a.VoucherType == "PR").Select(a => a.ItemWeight).Sum();
                data1.CraneLoadingWeightkg = clkg + Blkg;
                data1.ManualLoadingWeightkg = mlkg + Blkg;
                data1.CraneLoadingWeightmt = data1.CraneLoadingWeightkg / 1000;
                data1.ManualLoadingWeightmt = data1.ManualLoadingWeightkg / 1000;
                _db.SaveChanges();

                return Json(new { success = true, data = data1 });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("InsertTempItem")]
        public JsonResult InsertTempItem(TempPurchaseRecievedItem item)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempPurchaseRecievedItem.Where(u => u.PrNodigit == item.PrNodigit && u.Companyid == comapnyid && u.Itemid >= item.Itemid).ToList().OrderBy(k => k.Itemid);
                foreach (var itemm in data)
                {
                    var temp = _db.TempPurchaseRecievedItem.Where(k => k.Sr == itemm.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = itemm.Itemid + 1;
                    _db.SaveChanges();
                }
                item.Companyid = comapnyid;
                _db.TempPurchaseRecievedItem.Add(item);
                _db.SaveChanges();

                var data1 = _db.TempPRDetials.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid).FirstOrDefault();
                var clkg = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid && a.UnloadedBy == "Crane").Select(a => a.ItemWeight).Sum();
                var mlkg = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid && a.UnloadedBy == "Manual").Select(a => a.ItemWeight).Sum();
                var Blkg = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid && a.UnloadedBy == "Crane & Manual").Select(a => a.ItemWeight).Sum();
                data1.CraneLoadingWeightkg = clkg + Blkg;
                data1.ManualLoadingWeightkg = mlkg + Blkg;
                data1.CraneLoadingWeightmt = data1.CraneLoadingWeightkg / 1000;
                data1.ManualLoadingWeightmt = data1.ManualLoadingWeightkg / 1000;
                _db.SaveChanges();

                return Json(new { success = true, data = data1 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("UpDateItem")]
        public JsonResult UpDateItem(PurchaseRecievedItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var checker = _db.PurchaseRecievedItem.Where(s => s.PrNo == itemmaster.PrNo && s.Companyid == comapnyid && s.Itemid == itemmaster.Itemid && s.VoucherType == "PR").FirstOrDefault();
                checker.Pname = itemmaster.Pname;
                checker.Altpname = itemmaster.Altpname;
                checker.Altpsize = itemmaster.Altpsize;
                checker.Altpclass = itemmaster.Altpclass;
                checker.Itemid = itemmaster.Itemid;
                checker.Qty = itemmaster.Qty;
                checker.Qtyunit = itemmaster.Qtyunit;
                checker.AltQty = itemmaster.AltQty;
                checker.AltQtyunit = itemmaster.AltQtyunit;
                checker.ItemWeight = itemmaster.ItemWeight;
                checker.ItemWeightUnit = itemmaster.ItemWeightUnit;
                checker.UnloadedBy = itemmaster.UnloadedBy;
                checker.Psize = itemmaster.Psize;
                checker.Pclass = itemmaster.Pclass;
                checker.Pmake = itemmaster.Pmake;
                checker.HeatNo = itemmaster.HeatNo;
                checker.PrAmount = itemmaster.PrAmount;
                checker.ScAmount = itemmaster.ScAmount;
                checker.WeightAmount = itemmaster.WeightAmount;
              
                checker.TotalAmount = itemmaster.TotalAmount;
                checker.Wharehouse = itemmaster.Wharehouse;
                checker.Companyid = comapnyid;
                _db.SaveChanges();

                var data1 = _db.PRDetials.Where(a => a.PrNo == itemmaster.PrNo && a.Companyid == comapnyid).FirstOrDefault();
                var clkg = _db.PurchaseRecievedItem.Where(a => a.PrNo == itemmaster.PrNo && a.Companyid == comapnyid && a.UnloadedBy == "Crane").Select(a => a.ItemWeight).Sum();
                var mlkg = _db.PurchaseRecievedItem.Where(a => a.PrNo == itemmaster.PrNo && a.Companyid == comapnyid && a.UnloadedBy == "Manual").Select(a => a.ItemWeight).Sum();
                var Blkg = _db.PurchaseRecievedItem.Where(a => a.PrNo == itemmaster.PrNo && a.Companyid == comapnyid && a.UnloadedBy == "Crane & Manual").Select(a => a.ItemWeight).Sum();
                data1.CraneLoadingWeightkg = clkg + Blkg;
                data1.ManualLoadingWeightkg = mlkg + Blkg;
                data1.CraneLoadingWeightmt = data1.CraneLoadingWeightkg / 1000;
                data1.ManualLoadingWeightmt = data1.ManualLoadingWeightkg / 1000;
                _db.SaveChanges();

                return Json(new { success = true, data = data1 });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("UpDateTempItem")]
        public JsonResult UpDateTempItem(TempPurchaseRecievedItem itemmaster)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var item = _db.TempPurchaseRecievedItem.Where(s => s.PrNodigit == itemmaster.PrNodigit && s.Companyid == comapnyid && s.Itemid == itemmaster.Itemid).FirstOrDefault();
                item.Pname = itemmaster.Pname;
                item.Altpname = itemmaster.Altpname;
                item.Altpsize = itemmaster.Altpsize;
                item.Altpclass = itemmaster.Altpclass;
                item.Itemid = itemmaster.Itemid;
                item.Qty = itemmaster.Qty;
                item.Qtyunit = itemmaster.Qtyunit;
                item.AltQty = itemmaster.AltQty;
                item.AltQtyunit = itemmaster.AltQtyunit;
                item.ItemWeight = itemmaster.ItemWeight;
                item.ItemWeightUnit = itemmaster.ItemWeightUnit;
                item.UnloadedBy = itemmaster.UnloadedBy;
                item.Psize = itemmaster.Psize;
                item.Pclass = itemmaster.Pclass;
                item.Pmake = itemmaster.Pmake;
                item.HeatNo = itemmaster.HeatNo;
                item.PrAmount = itemmaster.PrAmount;
                item.ScAmount = itemmaster.ScAmount;
                item.WeightAmount = itemmaster.WeightAmount;
                item.TotalAmount = itemmaster.TotalAmount;
                item.Wharehouse = itemmaster.Wharehouse;
                item.Companyid = comapnyid;
                _db.SaveChanges();

                var data1 = _db.TempPRDetials.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid).FirstOrDefault();
                var clkg = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid && a.UnloadedBy == "Crane").Select(a => a.ItemWeight).Sum();
                var mlkg = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid && a.UnloadedBy == "Manual").Select(a => a.ItemWeight).Sum();
                var Blkg = _db.TempPurchaseRecievedItem.Where(a => a.PrNodigit == item.PrNodigit && a.Companyid == comapnyid && a.UnloadedBy == "Crane & Manual").Select(a => a.ItemWeight).Sum();
                data1.CraneLoadingWeightkg = clkg + Blkg;
                data1.ManualLoadingWeightkg = mlkg + Blkg;
                data1.CraneLoadingWeightmt = data1.CraneLoadingWeightkg / 1000;
                data1.ManualLoadingWeightmt = data1.ManualLoadingWeightkg / 1000;
                _db.SaveChanges();

                return Json(new { success = true, data = data1 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("getitembyid")]
        public IActionResult Getitembyid(int Itemid, string type, int tempPrno, string PRNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                QuotationItem1 qt = new QuotationItem1();
                if (type == "temp")
                {

                    var dt = _db.TempPurchaseRecievedItem.Where(x => x.PrNodigit == tempPrno && x.Itemid == Itemid && x.Companyid == comapnyid).FirstOrDefault();
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

                    qt.prAmount = dt.PrAmount;
                    qt.scAmount = dt.ScAmount;
                    qt.weightAmount = dt.WeightAmount;

                    qt.Amount = dt.TotalAmount;
                    qt.Hsncode = dt.HeatNo;
                    qt.Companyid = comapnyid;
                    qt.wharehouse = dt.Wharehouse;
                    qt.wharehouseid = _db.Godownname.Where(x => x.godownName == dt.Wharehouse && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Unloadedby = dt.UnloadedBy;




                    return Json(new { success = true, data = qt });
                }
                else
                {
                    var dt = _db.PurchaseRecievedItem.Where(x => x.PrNo == PRNO && x.Itemid == Itemid && x.Companyid == comapnyid && x.VoucherType == "PR").FirstOrDefault();
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
                  
                    qt.wharehouse = dt.Wharehouse;
                    qt.wharehouseid = _db.Godownname.Where(x => x.godownName == dt.Wharehouse && x.Companyid == comapnyid).Select(s => s.id).FirstOrDefault();
                    qt.Unloadedby = dt.UnloadedBy;
                    qt.Pmake = dt.Pmake;
                    qt.Qty = dt.Qty;
                    qt.prAmount = dt.PrAmount;
                    qt.scAmount = dt.ScAmount;
                    qt.weightAmount = dt.WeightAmount;
                    qt.Amount = dt.TotalAmount;
                    qt.Hsncode = dt.HeatNo;
                    qt.Companyid = comapnyid;

                    return Json(new { success = true, data = qt });
                }
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("viewPurchaseReciept")]
        public IActionResult viewPurchaseReciept(string PRNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var userid = Request.Cookies["username"];
                
                var data = _db.PRDetials.Where(x => x.PrNo == PRNO && x.Companyid == comapnyid && x.voucherType == "PR").FirstOrDefault();
                if (data != null)
                {
                    return Json(new { success = true, data = data ,username = userid });
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
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var data = _db.TempPRDetials.Where(x => x.Userid == username && x.Companyid == comapnyid).FirstOrDefault();
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

        [Route("getitem")]
        public IActionResult Getitem(int PrNodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.TempPurchaseRecievedItem.Where(x => x.PrNodigit == PrNodigit && x.Companyid == comapnyid).OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [Route("getitemByPRNO")]
        public IActionResult getitemByPRNO(string PRNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PurchaseRecievedItem.Where(x => x.PrNo == PRNO && x.Companyid == comapnyid && x.VoucherType == "PR").OrderBy(k => k.Itemid);
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

        [HttpPost]
        [Route("PermanantUpdate")]
        public IActionResult PermanantUpdate(PRDetials dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var data = _db.PRDetials.Where(x => x.PrNo == dt.PrNo && x.Companyid == comapnyid && x.voucherType == "PR").FirstOrDefault();
                if (data != null)
                {

                    data.PrDate = dt.PrDate;
                    data.PoDate = dt.PoDate;
                    data.PoNo = dt.PoNo;
                    data.PIDate = dt.PIDate;
                    data.PINo = dt.PINo;
                    data.SupplierCCode = dt.SupplierCCode;
                    data.SupplierCompanyname = dt.SupplierCompanyname;
                    data.SupplierAddress = _db.CustomerData.Where(a => a.Customerid == dt.SupplierCCode).Select(a => a.Address).FirstOrDefault();

                    data.TransportCCode = dt.TransportCCode;
                    data.TransportName = dt.TransportName;
                    data.DriverName = dt.DriverName;
                    data.Mobileno = dt.Mobileno;
                    data.VechileNo = dt.VechileNo;
                    data.License = dt.License;
                    data.UnloadingIncharge = dt.UnloadingIncharge;

                    data.Contractor = dt.Contractor;
                    data.Contratorid = dt.Contratorid;

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
                    data.Userid = username;
                    data.ForwardingTransportAmount = dt.ForwardingTransportAmount;
                    data.GrNO = dt.GrNO;

                    data.status = false;
                    data.reason = "incomplete";
                    data.Companyid = comapnyid;

                    _db.SaveChanges();
                }
                return Json(new { success = true, data = dt.PrNo });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpPost]
        [Route("finalsubmit")]
        public IActionResult finalsubmit(string prno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var data = _db.PRDetials.Where(a => a.PrNo == prno && a.Companyid == comapnyid && a.voucherType == "PR").FirstOrDefault();
                data.status = false;
                data.reason = "submitted";
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
        [Route("approved")]
        public IActionResult approved(PrReason pr1)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var data = _db.PRDetials.Where(a => a.PrNo == pr1.Prno && a.voucherType == "PR" && a.Companyid== comapnyid).FirstOrDefault();
                data.status = true;
                data.reason = "approved";
                data.Companyid = comapnyid;
                _db.SaveChanges();

                PrReason pr = new PrReason();
                pr.Date = pr1.Date;
                pr.Prno = pr1.Prno;
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



        [HttpPost]
        [Route("rejected")]
        public IActionResult rejected(PrReason pr1)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var data = _db.PRDetials.Where(a => a.PrNo == pr1.Prno && a.Companyid == comapnyid && a.voucherType == "PR").FirstOrDefault();
                data.status = false;
                data.reason = "rejected";
                data.Companyid = comapnyid;
                _db.SaveChanges();

                PrReason pr = new PrReason();
                pr.Date = pr1.Date;
                pr.Prno = pr1.Prno;
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

        [HttpPost]
        [Route("PermanantSave")]
        public IActionResult PermanantSave(int tempprno, PRDetials dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var username = Request.Cookies["username"];
                var prnodigit = _db.PRDetials.Where(a=>a.Companyid==comapnyid && a.voucherType=="PR").Select(p => p.PrNodigit).DefaultIfEmpty().Max();
                prnodigit++;
                var prefix = _db.Prefix.Where(a => a.Type == "purchaseRecieptVoucher" && a.Companyid==comapnyid).Select(a => a.Prefixname).FirstOrDefault();
                var quotno = prefix + prnodigit;
                dt.PrNo = quotno;
                dt.SupplierAddress = _db.CustomerData.Where(a => a.Customerid == dt.SupplierCCode && a.Companyid == comapnyid).Select(a => a.Address).FirstOrDefault();
                dt.Userid = username;
                dt.PrNodigit = prnodigit;
                dt.Companyid = comapnyid;
                dt.voucherType = "PR";
                dt.status = false;
                dt.reason = "incomplete";
                _db.PRDetials.Add(dt);
                _db.SaveChanges();

                var data1 = _db.TempPurchaseRecievedItem.ToList().Where(u => u.PrNodigit == tempprno && u.Companyid == comapnyid);
                foreach (var tempitem in data1)
                {
                    PurchaseRecievedItem item = new PurchaseRecievedItem();
                    item.PrNodigit = prnodigit;
                    item.PrNo = quotno;
                    item.Companyid = comapnyid;
                    item.Itemid = tempitem.Itemid;
                    item.Pname = tempitem.Pname;
                    item.Altpname = tempitem.Altpname;
                    item.Psize = tempitem.Psize;
                    item.Altpsize = tempitem.Altpsize;
                    item.Pclass = tempitem.Pclass;
                    item.Altpclass = tempitem.Altpclass;
                    item.Pmake = tempitem.Pmake;
                    item.Wharehouse = tempitem.Wharehouse;
                    item.Qty = tempitem.Qty;
                    item.Qtyunit = tempitem.Qtyunit;
                    item.AltQty = tempitem.AltQty;
                    item.AltQtyunit = tempitem.AltQtyunit;
                    item.ItemWeight = tempitem.ItemWeight;
                    item.HeatNo = tempitem.HeatNo;
                    item.ItemWeightUnit = tempitem.ItemWeightUnit;

                    item.PrAmount = tempitem.PrAmount;
                    item.ScAmount = tempitem.ScAmount;
                    item.WeightAmount = tempitem.WeightAmount;
                    item.TotalAmount = tempitem.TotalAmount;


                    item.UnloadedBy = tempitem.UnloadedBy;
                    item.VoucherType = "PR";
                    _db.PurchaseRecievedItem.Add(item);
                    _db.SaveChanges();
                        
                }
                DeleteTempPR(tempprno);

                return Json(new { success = true, data = dt.PrNo });

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteTempPR")]
        public IActionResult DeleteTempPR(int prnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var temppritem = _db.TempPurchaseRecievedItem.Where(u => u.PrNodigit == prnodigit && u.Companyid == comapnyid).ToList();
                if (temppritem != null)
                {
                    _db.TempPurchaseRecievedItem.RemoveRange(temppritem);
                    _db.SaveChanges();
                }

                var ClientFromDB = _db.TempPRDetials.FirstOrDefault(u => u.PrNodigit == prnodigit && u.Companyid == comapnyid);
                if (ClientFromDB != null)
                {
                    _db.TempPRDetials.RemoveRange(ClientFromDB);
                    _db.SaveChanges();
                }
                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteTempPOIT")]
        public IActionResult DeleteTempPOIT(int TEMPPONO, int itmno, string PONO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var quotationitem = _db.PurchaseOrderItem.FirstOrDefault(u => u.PoNo == PONO && u.Itemid == itmno && u.Companyid == comapnyid);
                if (quotationitem != null)
                {
                    _db.PurchaseOrderItem.Remove(quotationitem);
                    _db.SaveChanges();

                    var data = _db.PurchaseOrderItem.Where(u => u.PoNo == PONO && u.Itemid > itmno && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                    foreach (var item in data)
                    {
                        var temp = _db.QuotationItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                        temp.Itemid = item.Itemid - 1;
                        _db.SaveChanges();
                    }
                    var amount = _db.PurchaseOrderItem.Where(u => u.PoNo == PONO && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    var data1 = _db.PODetials.Where(u => u.PoNo == PONO && u.Companyid == comapnyid).FirstOrDefault();
                    data1.Amount = amount;
                    _db.SaveChanges();
                    return Json(new { success = true, data = amount });


                }
                var tempquotationitem = _db.TempPurchaseOrderItem.FirstOrDefault(u => u.PoNodigit == TEMPPONO && u.Companyid == comapnyid  && u.Itemid == itmno);
                if (tempquotationitem != null)
                {
                    _db.TempPurchaseOrderItem.Remove(tempquotationitem);
                    _db.SaveChanges();

                    var data = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == TEMPPONO && u.Companyid == comapnyid && u.Itemid > itmno).ToList().OrderBy(k => k.Itemid);
                    foreach (var item in data)
                    {
                        var temp = _db.TempPurchaseOrderItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                        temp.Itemid = item.Itemid - 1;
                        _db.SaveChanges();
                    }
                    var amount = _db.TempPurchaseOrderItem.Where(u => u.PoNodigit == TEMPPONO && u.Companyid == comapnyid).Select(u => u.Amount).Sum();
                    var data1 = _db.TempPODetials.Where(u => u.PoNodigit == TEMPPONO && u.Companyid == comapnyid).FirstOrDefault();
                    data1.Amount = amount;
                    _db.SaveChanges();
                    return Json(new { success = true, data = amount });
                }

                return Json(new { success = true, message = "Deleted successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeleteTempPRIT")]
        public IActionResult DeleteTempPRIT(int TEMPPRNO, int itmno, string PRNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var tempquotationitem = _db.TempPurchaseRecievedItem.FirstOrDefault(u => u.PrNodigit == TEMPPRNO && u.Itemid == itmno && u.Companyid == comapnyid);
                _db.TempPurchaseRecievedItem.Remove(tempquotationitem);
                _db.SaveChanges();

                var data = _db.TempPurchaseRecievedItem.Where(u => u.PrNodigit == TEMPPRNO && u.Itemid > itmno && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                foreach (var item in data)
                {
                    var temp = _db.TempPurchaseRecievedItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = item.Itemid - 1;
                    _db.SaveChanges();
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [HttpDelete]
        [Route("DeletePRIT")]
        public IActionResult DeletePRIT(int TEMPPRNO, int itmno, string PRNO)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var quotationitem = _db.PurchaseRecievedItem.Where(u => u.PrNo == PRNO && u.Companyid == comapnyid  && u.Itemid == itmno).FirstOrDefault();
                _db.PurchaseRecievedItem.Remove(quotationitem);
                _db.SaveChanges();

                var data = _db.PurchaseRecievedItem.Where(u => u.PrNo == PRNO && u.Itemid > itmno && u.Companyid == comapnyid).ToList().OrderBy(k => k.Itemid);
                foreach (var item in data)
                {
                    var temp = _db.PurchaseRecievedItem.Where(k => k.Sr == item.Sr && k.Companyid == comapnyid).FirstOrDefault();
                    temp.Itemid = item.Itemid - 1;
                    _db.SaveChanges();
                }

                return Json(new { success = true });


            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }


        [Route("PrintPR")]
        public IActionResult PrintPR(string prno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var data = _db.PRDetials.Where(x => x.PrNo == prno && x.Companyid == comapnyid && x.voucherType == "PR").FirstOrDefault();
                    return Json(new { success = true, data = data, });
                }

            
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }



        [Route("PrintItemPR")]
        public IActionResult PrintItemPR(string prno)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];

                var data = _db.PurchaseRecievedItem.Where(x => x.PrNo == prno && x.Companyid == comapnyid && x.VoucherType == "PR").OrderBy(a => a.Itemid);

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


        [Route("jumptoPrevious")]
        public IActionResult jumptoPrevious(int prnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var prnod = _db.PRDetials.Where(a => a.PrNodigit < prnodigit && a.Companyid == comapnyid && a.voucherType == "PR").OrderByDescending(a => a.PrNodigit).Select(a => a.PrNo).FirstOrDefault();

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
        public IActionResult jumptoNext(int prnodigit)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var prnod = _db.PRDetials.Where(a => a.PrNodigit > prnodigit && a.Companyid == comapnyid && a.voucherType=="PR").Select(a => a.PrNo).FirstOrDefault();
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
        [Route("SearchPurchase")]
        public IActionResult SearchPurchase(string searchtype, string searchValue, DateTime frmdate, DateTime todate)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                if (searchtype == "PARTY")
                {
                    var data = _db.PRDetials.Where(x => x.SupplierCompanyname.Contains(searchValue) && x.voucherType=="PR" && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.PrDate.Date) });
                }
                else if (searchtype == "PONO")
                {
                    var data = _db.PRDetials.Where(x => x.PoNo.Contains(searchValue) && x.voucherType == "PR"  && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.PrDate.Date) });
                } else if (searchtype == "INVOICE")
                {
                    var data = _db.PRDetials.Where(x => x.PINo.Contains(searchValue) && x.voucherType == "PR" &&  x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.PrDate.Date) });
                }else if (searchtype == "HEAT")
                {
                    var data = (from doitem in _db.PurchaseRecievedItem join dtt in _db.PRDetials on doitem.PrNo equals dtt.PrNo where doitem.Companyid == comapnyid && dtt.Companyid == comapnyid && dtt.voucherType == "PR" && doitem.HeatNo.Contains(searchValue) select new { PrNo = doitem.PrNo, SupplierCompanyname = dtt.SupplierCompanyname, PrDate = dtt.PrDate }).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.PrDate.Date) });
                }
                else if(searchtype == "VECHILE")
                {
                    var data = _db.PRDetials.Where(x => x.VechileNo.Contains(searchValue) && x.voucherType == "PR" && x.Companyid == comapnyid).ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.PrDate.Date) });

                }
                else
                {
                    var data = _db.PRDetials.Where(x => x.PrDate.Date >= frmdate.Date && x.PrDate.Date <= todate.Date && x.Companyid == comapnyid && x.voucherType == "PR").ToList();
                    return Json(new { success = true, data = data.OrderBy(a => a.PrDate.Date) });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }


        [Route("SearchPurchase1")]
        public IActionResult SearchPurchase1(string searchtype, string searchValue, DateTime frmdate, DateTime todate)
        {
           

           
            try
            {
                List<Viewreport> dt = new List<Viewreport>();
                var comapnyid = Request.Cookies["companyid"];
                if (searchtype == "PARTY")
                {
                    var data = _db.PRDetials.Where(x => x.SupplierCompanyname.Contains(searchValue) && x.voucherType == "PR" && x.Companyid == comapnyid).ToList();
                    foreach (var temp in data)
                    {
                        Viewreport vl = new Viewreport();

                        vl.prNo = temp.PrNo;
                        vl.piNo = temp.PINo;
                        vl.poNo = temp.PoNo;
                        vl.prDate = temp.PrDate;
                        vl.Prnodigit = temp.PrNodigit;
                        vl.supplierCompanyname = temp.SupplierCompanyname;
                        vl.created = temp.Userid;
                        vl.rejected = _db.PrReason.Where(a => a.Prno == temp.PrNo && a.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault();
                        dt.Add(vl);


                    }
                    return Json(new { success = true, data = dt.OrderBy(a => a.prDate.Date) });
                }
                else if (searchtype == "PONO")
                {
                    var data = _db.PRDetials.Where(x => x.PoNo.Contains(searchValue) && x.voucherType == "PR" && x.Companyid == comapnyid).ToList();
                    foreach (var temp in data)
                    {
                        Viewreport vl = new Viewreport();

                        vl.prNo = temp.PrNo;
                        vl.piNo = temp.PINo;
                        vl.poNo = temp.PoNo;
                        vl.prDate = temp.PrDate;
                        vl.Prnodigit = temp.PrNodigit;
                        vl.supplierCompanyname = temp.SupplierCompanyname;
                        vl.created = temp.Userid;
                        vl.rejected = _db.PrReason.Where(a => a.Prno == temp.PrNo && a.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault();
                        dt.Add(vl);


                    }
                    return Json(new { success = true, data = dt.OrderBy(a => a.prDate.Date) });
                }
                else if (searchtype == "INVOICE")
                {
                    var data = _db.PRDetials.Where(x => x.PINo.Contains(searchValue) && x.voucherType == "PR" && x.Companyid == comapnyid).ToList();
                    foreach (var temp in data)
                    {
                        Viewreport vl = new Viewreport();

                        vl.prNo = temp.PrNo;
                        vl.piNo = temp.PINo;
                        vl.poNo = temp.PoNo;
                        vl.prDate = temp.PrDate;
                        vl.Prnodigit = temp.PrNodigit;
                        vl.supplierCompanyname = temp.SupplierCompanyname;
                        vl.created = temp.Userid;
                        vl.rejected = _db.PrReason.Where(a => a.Prno == temp.PrNo && a.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault();
                        dt.Add(vl);


                    }
                    return Json(new { success = true, data = dt.OrderBy(a => a.prDate.Date) });
                }
                else if (searchtype == "HEAT")
                {
                    var data = (from doitem in _db.PurchaseRecievedItem join dtt in _db.PRDetials on doitem.PrNo equals dtt.PrNo where doitem.Companyid == comapnyid && dtt.Companyid == comapnyid && dtt.voucherType == "PR" && doitem.HeatNo.Contains(searchValue) select new { PrNo = doitem.PrNo, SupplierCompanyname = dtt.SupplierCompanyname, PrDate = dtt.PrDate , PINo =dtt.PINo, PoNo =dtt.PoNo, Userid =dtt.Userid}).ToList();
                    foreach (var temp in data)
                    {
                        Viewreport vl = new Viewreport();

                        vl.prNo = temp.PrNo;
                        vl.piNo = temp.PINo;
                        vl.poNo = temp.PoNo;
                        vl.prDate = temp.PrDate;
                        vl.supplierCompanyname = temp.SupplierCompanyname;
                        vl.created = temp.Userid;
                        vl.rejected = _db.PrReason.Where(a => a.Prno == temp.PrNo && a.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault();
                        dt.Add(vl);


                    }
                    return Json(new { success = true, data = dt.OrderBy(a => a.prDate.Date) });
                }
                else
                {
                    var data = _db.PRDetials.Where(x => x.PrDate.Date >= frmdate.Date && x.PrDate.Date <= todate.Date && x.Companyid == comapnyid && x.voucherType == "PR").ToList();
                    foreach (var temp in data)
                    {
                        Viewreport vl = new Viewreport();

                        vl.prNo = temp.PrNo;
                        vl.piNo = temp.PINo;
                        vl.poNo = temp.PoNo;
                        vl.prDate = temp.PrDate;
                        vl.Prnodigit = temp.PrNodigit;
                        vl.supplierCompanyname = temp.SupplierCompanyname;
                        vl.created = temp.Userid;
                        vl.rejected = _db.PrReason.Where(a => a.Prno == temp.PrNo && a.Companyid == comapnyid).Select(a => a.userid).FirstOrDefault();
                        dt.Add(vl);


                    }
                    return Json(new { success = true, data = dt.OrderBy(a => a.prDate.Date) });
                }

            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });
            }
        }

    }
}
