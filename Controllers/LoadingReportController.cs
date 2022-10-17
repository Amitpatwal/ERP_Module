using SALES_ERP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Controllers
{
    [Route("api/LoadingReport")]
    public class LoadingReportController : Controller
    {
        private readonly ApplicationDBContext _db;
        public LoadingReportController(ApplicationDBContext db)
        {
            _db = db;
        }


        [Route("ViewReport")]
        public IActionResult ViewReport(lrd dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var vrl = new List<viewrd>();
                if (dt.frm == "PURCHASE")
                {
                    if (dt.type != "BOTH")
                    {
                        var data = _db.PRDetials.Where(a => a.PrDate.Date >= dt.frmdata && a.PrDate <= dt.todate && a.Companyid == comapnyid && a.Contractor == dt.contractorName && a.status == true).ToList();
                        var i = 1;
                        foreach (var dl in data)
                        {
                            var vr = new viewrd();
                            vr.sr = i;
                            vr.date = dl.PrDate;
                            vr.invoiceno = dl.PINo;
                            vr.companyname = dl.SupplierCompanyname;
                            vr.voucherno = dl.PrNo;
                            if (dt.type == "CRANE")
                            {
                                vr.weight = dl.CraneLoadingWeightkg;
                                vr.amount = dl.CraneTotalCharge;

                            }
                            else
                            {
                                vr.weight = dl.ManualLoadingWeightkg;
                                vr.amount = dl.ManualTotalCharge;
                            }
                            vr.type = "PURCHASE";
                            if (vr.amount > 0)
                            {
                                vrl.Add(vr);
                                i = i + 1;
                            }

                        }
                    }
                    else
                    {
                        var data = _db.PRDetials.Where(a => a.PrDate.Date >= dt.frmdata && a.PrDate <= dt.todate && a.Contractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).ToList();
                        var i = 1;
                        foreach (var dl in data)
                        {
                            if (dl.CraneTotalCharge > 0)
                            {
                                var vr1 = new viewrd();
                                vr1.sr = i;
                                vr1.date = dl.PrDate;
                                vr1.invoiceno = dl.PINo;
                                vr1.voucherno = dl.PrNo;
                                vr1.companyname = dl.SupplierCompanyname;
                                vr1.weight = dl.CraneLoadingWeightkg;
                                vr1.type = "PURCHASE";
                                vr1.amount = dl.CraneTotalCharge;
                                vrl.Add(vr1);
                                i = i + 1;
                            }
                            if (dl.ManualTotalCharge > 0)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.PrDate;
                                vr.invoiceno = dl.PINo;
                                vr.companyname = dl.SupplierCompanyname;
                                vr.voucherno = dl.PrNo;
                                vr.weight = dl.ManualLoadingWeightkg;
                                vr.type = "PURCHASE";
                                vr.amount = dl.ManualTotalCharge;
                                vrl.Add(vr);
                                i = i + 1;
                            }

                        }
                    }
                }
                else if (dt.frm == "SELL")
                {
                    if (dt.type != "BOTH")
                    {
                        var data = _db.DODetials.Where(a => a.DoDate.Date >= dt.frmdata && a.DoDate <= dt.todate && a.Contractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).Select(a => new { DoDate = a.DoDate, DoNo = a.DoNo, SupplierCompanyname = a.SupplierCompanyname, CraneLoadingWeightkg = a.CraneLoadingWeightkg, CraneTotalCharge = a.CraneTotalCharge, ManualLoadingWeightkg = 0.0, ManualTotalCharge = 0.0 }).ToList().
                           Union(_db.DODetials.Where(a => a.DoDate.Date >= dt.frmdata && a.DoDate <= dt.todate && a.ManualContractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).Select(a => new { DoDate = a.DoDate, DoNo = a.DoNo, SupplierCompanyname = a.SupplierCompanyname, CraneLoadingWeightkg = 0.0, CraneTotalCharge = 0.0, ManualLoadingWeightkg = a.ManualLoadingWeightkg, ManualTotalCharge = a.ManualTotalCharge }).ToList());
                        var i = 1;
                        foreach (var dl in data)
                        {
                            var vr = new viewrd();
                            vr.sr = i;
                            vr.date = dl.DoDate;
                            vr.invoiceno = "";
                            vr.companyname = dl.SupplierCompanyname;
                            if (dt.type == "CRANE")
                            {
                                vr.weight = dl.CraneLoadingWeightkg;
                                vr.type = "Crane";
                                vr.amount = dl.CraneTotalCharge;
                            }
                            else
                            {
                                vr.weight = dl.ManualLoadingWeightkg;
                                vr.type = "Manual";
                                vr.amount = dl.ManualTotalCharge;
                            }
                            if (vr.amount > 0)
                            {
                                vrl.Add(vr);
                                i = i + 1;
                            }
                        }
                    }
                    else
                    {
                        var data = _db.DODetials.Where(a => a.DoDate.Date >= dt.frmdata && a.DoDate <= dt.todate && a.Contractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).Select(a => new { DoDate = a.DoDate, DoNo = a.DoNo, SupplierCompanyname = a.SupplierCompanyname, CraneLoadingWeightkg = a.CraneLoadingWeightkg, CraneTotalCharge = a.CraneTotalCharge, ManualLoadingWeightkg = 0.0, ManualTotalCharge = 0.0 }).ToList().
                            Union(_db.DODetials.Where(a => a.DoDate.Date >= dt.frmdata && a.DoDate <= dt.todate && a.ManualContractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).Select(a => new { DoDate = a.DoDate, DoNo = a.DoNo, SupplierCompanyname = a.SupplierCompanyname, CraneLoadingWeightkg = 0.0, CraneTotalCharge = 0.0, ManualLoadingWeightkg = a.ManualLoadingWeightkg, ManualTotalCharge = a.ManualTotalCharge }).ToList());
                        var i = 1;
                        foreach (var dl in data)
                        {
                            if (dl.CraneTotalCharge > 0)
                            {
                                var vr1 = new viewrd();
                                vr1.sr = i;
                                vr1.date = dl.DoDate;
                                vr1.invoiceno = "";
                                vr1.voucherno = dl.DoNo;
                                vr1.companyname = dl.SupplierCompanyname;
                                vr1.weight = dl.CraneLoadingWeightkg;
                                vr1.type = "SELL";
                                vr1.amount = dl.CraneTotalCharge;
                                vrl.Add(vr1);
                                i = i + 1;
                            }
                            if (dl.ManualTotalCharge > 0)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.DoDate;
                                vr.invoiceno = "";
                                vr.voucherno = dl.DoNo;
                                vr.companyname = dl.SupplierCompanyname;
                                vr.weight = dl.ManualLoadingWeightkg;
                                vr.type = "SELL";
                                vr.amount = dl.ManualTotalCharge;
                                vrl.Add(vr);
                                i = i + 1;
                            }

                        }
                    }
                }
                else if (dt.frm == "SELL/PURCHASE")
                {
                    if (dt.type != "BOTH")
                    {
                        var data = _db.PRDetials.Where(a => a.PrDate.Date >= dt.frmdata && a.Contractor == dt.contractorName && a.PrDate <= dt.todate && a.Companyid == comapnyid && a.status == true).ToList();
                        var i = 1;
                        foreach (var dl in data)
                        {
                            var vr = new viewrd();
                            vr.sr = i;
                            vr.date = dl.PrDate;
                            vr.invoiceno = dl.PINo;
                            vr.companyname = dl.SupplierCompanyname;
                            vr.voucherno = dl.PrNo;
                            if (dt.type == "CRANE")
                            {
                                vr.weight = dl.CraneLoadingWeightkg;
                                vr.amount = dl.CraneTotalCharge;

                            }
                            else
                            {
                                vr.weight = dl.ManualLoadingWeightkg;
                                vr.amount = dl.ManualTotalCharge;
                            }
                            vr.type = "PURCHASE";
                            if (vr.amount > 0)
                            {
                                vrl.Add(vr);
                                i = i + 1;
                            }

                        }
                        var data1 = _db.DODetials.Where(a => a.DoDate.Date >= dt.frmdata && a.DoDate <= dt.todate && a.Contractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).Select(a => new { DoDate = a.DoDate, DoNo = a.DoNo, SupplierCompanyname = a.SupplierCompanyname, CraneLoadingWeightkg = a.CraneLoadingWeightkg, CraneTotalCharge = a.CraneTotalCharge, ManualLoadingWeightkg = 0.0, ManualTotalCharge = 0.0 }).ToList().
                            Union(_db.DODetials.Where(a => a.DoDate.Date >= dt.frmdata && a.DoDate <= dt.todate && a.ManualContractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).Select(a => new { DoDate = a.DoDate, DoNo = a.DoNo, SupplierCompanyname = a.SupplierCompanyname, CraneLoadingWeightkg = 0.0, CraneTotalCharge = 0.0, ManualLoadingWeightkg = a.ManualLoadingWeightkg, ManualTotalCharge = a.ManualTotalCharge }).ToList());
                        foreach (var dl in data1)
                        {
                            var vr = new viewrd();
                            vr.sr = i;
                            vr.date = dl.DoDate;
                            vr.invoiceno = "";
                            vr.companyname = dl.SupplierCompanyname;
                            vr.voucherno = dl.DoNo;
                            if (dt.type == "CRANE")
                            {
                                vr.weight = dl.CraneLoadingWeightkg;
                                vr.type = "Crane";
                                vr.amount = dl.CraneTotalCharge;
                            }
                            else
                            {
                                vr.weight = dl.ManualLoadingWeightkg;
                                vr.type = "Manual";
                                vr.amount = dl.ManualTotalCharge;
                            }
                            if (vr.amount > 0)
                            {
                                vrl.Add(vr);
                                i = i + 1;
                            }
                        }
                    }
                    else
                    {
                        var data = _db.PRDetials.Where(a => a.PrDate.Date >= dt.frmdata && a.PrDate <= dt.todate && a.Contractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).ToList();
                        var i = 1;
                        foreach (var dl in data)
                        {
                            if (dl.CraneTotalCharge > 0)
                            {
                                var vr1 = new viewrd();
                                vr1.sr = i;
                                vr1.date = dl.PrDate;
                                vr1.invoiceno = dl.PINo;
                                vr1.voucherno = dl.PrNo;
                                vr1.companyname = dl.SupplierCompanyname;
                                vr1.weight = dl.CraneLoadingWeightkg;
                                vr1.type = "PURCHASE";
                                vr1.amount = dl.CraneTotalCharge;
                                vrl.Add(vr1);
                                i = i + 1;
                            }
                            if (dl.ManualTotalCharge > 0)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.PrDate;
                                vr.invoiceno = dl.PINo;
                                vr.companyname = dl.SupplierCompanyname;
                                vr.voucherno = dl.PrNo;
                                vr.weight = dl.ManualLoadingWeightkg;
                                vr.type = "PURCHASE";
                                vr.amount = dl.ManualTotalCharge;
                                vrl.Add(vr);
                                i = i + 1;
                            }
                        }

                        var data1 = _db.DODetials.Where(a => a.DoDate.Date >= dt.frmdata && a.DoDate <= dt.todate && a.Contractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).Select(a => new { DoDate = a.DoDate, DoNo = a.DoNo, SupplierCompanyname = a.SupplierCompanyname, CraneLoadingWeightkg = a.CraneLoadingWeightkg, CraneTotalCharge = a.CraneTotalCharge, ManualLoadingWeightkg = 0.0, ManualTotalCharge = 0.0 }).ToList().
                            Union(_db.DODetials.Where(a => a.DoDate.Date >= dt.frmdata && a.DoDate <= dt.todate && a.ManualContractor == dt.contractorName && a.Companyid == comapnyid && a.status == true).Select(a => new { DoDate = a.DoDate, DoNo = a.DoNo, SupplierCompanyname = a.SupplierCompanyname, CraneLoadingWeightkg = 0.0, CraneTotalCharge = 0.0, ManualLoadingWeightkg = a.ManualLoadingWeightkg, ManualTotalCharge = a.ManualTotalCharge }).ToList());
                        foreach (var dll in data1)
                        {
                            if (dll.CraneTotalCharge > 0)
                            {
                                var vr1 = new viewrd();
                                vr1.sr = i;
                                vr1.date = dll.DoDate;
                                vr1.invoiceno = "";
                                vr1.voucherno = dll.DoNo;
                                vr1.companyname = dll.SupplierCompanyname;
                                vr1.weight = dll.CraneLoadingWeightkg;
                                vr1.type = "SELL";
                                vr1.amount = dll.CraneTotalCharge;
                                vrl.Add(vr1);
                                i = i + 1;
                            }
                            if (dll.ManualTotalCharge > 0)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dll.DoDate;
                                vr.invoiceno = "";
                                vr.voucherno = dll.DoNo;
                                vr.companyname = dll.SupplierCompanyname;
                                vr.weight = dll.ManualLoadingWeightkg;
                                vr.type = "SELL";
                                vr.amount = dll.ManualTotalCharge;
                                vrl.Add(vr);
                                i = i + 1;
                            }

                        }
                    }
                }
                return Json(new { success = true, data = vrl });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }

        [Route("ViewTransportLedger")]
        public IActionResult ViewTransportLedger(lrd dt)
        {
            try
            {
                var comapnyid = Request.Cookies["companyid"];
                var vrl = new List<viewrd>();
                for (int j = 0; j < dt.frieghttype.Count; j++)
                {
                    if (dt.searchBy == "transporter")
                    {
                        if (dt.frm == "PURCHASE")
                        {
                            var data = _db.PRDetials.Where(a => a.PrDate.Date > dt.frmdata && a.PrDate < dt.todate && a.Companyid == comapnyid && a.FreightType == dt.frieghttype[j] && a.TransportName == dt.contractorName && a.FreightCharge != 0).ToList();
                            var i = 1;
                            foreach (var dl in data)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.PrDate;
                                vr.invoiceno = dl.PINo;
                                vr.companyname = dl.SupplierCompanyname;
                                vr.voucherno = dl.PrNo;
                                vr.amount = dl.FreightCharge;
                                vr.frtype = dl.FreightType;
                                vr.type = "PURCHASE";
                                vrl.Add(vr);

                                i = i + 1;

                            }

                        }
                        else if (dt.frm == "SELL")
                        {
                            var data = _db.DODetials.Where(a => a.DoDate.Date > dt.frmdata && a.DoDate < dt.todate && a.Companyid == comapnyid && a.FreightType == dt.frieghttype[j] && a.TransportName == dt.contractorName && a.FreightCharge != 0).ToList();
                            var i = 1;

                            foreach (var dl in data)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.DoDate;
                                vr.invoiceno = "";
                                vr.companyname = dl.SupplierCompanyname;
                                vr.type = "SELL";
                                vr.voucherno = dl.DoNo;
                                vr.amount = dl.FreightCharge;
                                vr.frtype = dl.FreightType;
                                vrl.Add(vr);
                                i = i + 1;
                            }

                        }
                        else if (dt.frm == "SELL/PURCHASE")
                        {

                            var data = _db.PRDetials.Where(a => a.PrDate.Date > dt.frmdata && a.PrDate < dt.todate && a.Companyid == comapnyid && a.FreightType == dt.frieghttype[j] && a.TransportName == dt.contractorName && a.FreightCharge != 0).ToList();
                            var i = 1;
                            foreach (var dl in data)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.PrDate;
                                vr.invoiceno = dl.PINo;
                                vr.companyname = dl.SupplierCompanyname;
                                vr.voucherno = dl.PrNo;
                                vr.amount = dl.FreightCharge;
                                vr.frtype = dl.FreightType;
                                vr.type = "PURCHASE";
                                vrl.Add(vr);
                                i = i + 1;
                            }
                            var data1 = _db.DODetials.Where(a => a.DoDate.Date > dt.frmdata && a.DoDate < dt.todate && a.Companyid == comapnyid && a.FreightType == dt.frieghttype[j] && a.TransportName == dt.contractorName && a.FreightCharge != 0).ToList();
                            foreach (var dl in data1)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.DoDate;
                                vr.invoiceno = "";
                                vr.companyname = dl.SupplierCompanyname;
                                vr.voucherno = dl.DoNo;
                                vr.frtype = dl.FreightType;
                                vr.type = "SELL";
                                vr.amount = dl.FreightCharge;
                                vrl.Add(vr);
                                i = i + 1;
                            }
                        }
                    }
                    else
                    {
                        if (dt.frm == "PURCHASE")
                        {
                            var data = _db.PRDetials.Where(a => a.PrDate.Date > dt.frmdata && a.PrDate < dt.todate && a.Companyid == comapnyid && a.FreightType == dt.frieghttype[j] && a.SupplierCompanyname == dt.contractorName && a.FreightCharge != 0).ToList();
                            var i = 1;
                            foreach (var dl in data)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.PrDate;
                                vr.invoiceno = dl.PINo;
                                vr.companyname = dl.TransportName;
                                vr.voucherno = dl.PrNo;
                                vr.amount = dl.FreightCharge;
                                vr.frtype = dl.FreightType;
                                vr.type = "PURCHASE";
                                vrl.Add(vr);

                                i = i + 1;

                            }

                        }
                        else if (dt.frm == "SELL")
                        {
                            var data = _db.DODetials.Where(a => a.DoDate.Date > dt.frmdata && a.DoDate < dt.todate && a.Companyid == comapnyid && a.FreightType == dt.frieghttype[j] && a.SupplierCompanyname == dt.contractorName && a.FreightCharge != 0).ToList();
                            var i = 1;

                            foreach (var dl in data)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.DoDate;
                                vr.invoiceno = "";
                                vr.companyname = dl.TransportName;
                                vr.type = "SELL";
                                vr.voucherno = dl.DoNo;
                                vr.amount = dl.FreightCharge;
                                vr.frtype = dl.FreightType;
                                vrl.Add(vr);
                                i = i + 1;
                            }

                        }
                        else if (dt.frm == "SELL/PURCHASE")
                        {

                            var data = _db.PRDetials.Where(a => a.PrDate.Date > dt.frmdata && a.PrDate < dt.todate && a.Companyid == comapnyid && a.FreightType == dt.frieghttype[j] && a.SupplierCompanyname == dt.contractorName && a.FreightCharge != 0).ToList();
                            var i = 1;
                            foreach (var dl in data)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.PrDate;
                                vr.invoiceno = dl.PINo;
                                vr.companyname = dl.TransportName;
                                vr.voucherno = dl.PrNo;
                                vr.amount = dl.FreightCharge;
                                vr.frtype = dl.FreightType;
                                vr.type = "PURCHASE";
                                vrl.Add(vr);
                                i = i + 1;
                            }
                            var data1 = _db.DODetials.Where(a => a.DoDate.Date > dt.frmdata && a.DoDate < dt.todate && a.Companyid == comapnyid && a.FreightType == dt.frieghttype[j] && a.SupplierCompanyname == dt.contractorName && a.FreightCharge != 0).ToList();
                            foreach (var dl in data1)
                            {
                                var vr = new viewrd();
                                vr.sr = i;
                                vr.date = dl.DoDate;
                                vr.invoiceno = "";
                                vr.companyname = dl.TransportName;
                                vr.voucherno = dl.DoNo;
                                vr.frtype = dl.FreightType;
                                vr.type = "SELL";
                                vr.amount = dl.FreightCharge;
                                vrl.Add(vr);
                                i = i + 1;
                            }
                        }

                    }
                }


                return Json(new { success = true, data = vrl });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Some error occured" + ex });
            }
        }
    }
}
