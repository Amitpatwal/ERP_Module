using AspNetCore.Reporting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SALES_ERP.Models;
using System.Collections.Generic;
using System.Linq;

namespace SALES_ERP.Pages
{
    public class SalesQuotationPrint : PageModel
    {
        public readonly ApplicationDBContext _db;
        private readonly IWebHostEnvironment _webHostEnvironmant;
        public SalesQuotationPrint(ApplicationDBContext db, IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            this._webHostEnvironmant = webHostEnvironment;
        }

        public IActionResult OnGet(string idd)
        {
            var emaildid = Request.Cookies["Emailid"];
            var userid = Request.Cookies["usid"];
            if (emaildid == null)
            {
                Response.Redirect("../Index");
            }

            string mimtype = "";
            int extension = 1;
            var comapnyid = Request.Cookies["companyid"];
            var path = "";
            if (comapnyid == "1jTUJPLyMq3")
            {
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\Salesquotation.rdlc";
            }
            else if (comapnyid == "xuZdaeSGHgB")
            {
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\SalesquotationSBS.rdlc";
            }

            else
            {
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\SalesquotationDigitalInfotech.rdlc";
            }
            Dictionary<string, string> parameter = new Dictionary<string, string>();
            var ITEMS = _db.QuotationItem.Where(a => a.Quotno == idd && a.Companyid == comapnyid).ToList().OrderBy(a => a.Itemid);
            foreach (var dt in ITEMS)
            {
                var desp = dt.Pname + "\n" + dt.Psize + " " + dt.Pclass;
                if (dt.Pmake != null)
                {
                    desp = desp + "\n" + dt.Pmake;
                }
                if (dt.Remarks != null)
                {
                    desp = desp + "\n" + dt.Remarks;
                }
                var ITEMS1 = _db.QuotationItem.Where(a => a.Quotno == idd && a.Companyid == comapnyid && a.Itemid == dt.Itemid).OrderBy(a => a.Itemid).FirstOrDefault(); ;
                if (ITEMS1 != null)
                {
                    ITEMS1.Description = desp;
                    _db.SaveChanges();
                }
            }
            var ITEMS3 = _db.QuotationItem.Where(a => a.Quotno == idd && a.Companyid == comapnyid).OrderBy(a => a.Itemid).ToList();
            var QTDETAILS = _db.SalesqDetails.Where(a => a.Quotno == idd && a.Companyid == comapnyid).ToList();
            var Condition = (from id in _db.Quotationcondition join cds in _db.Conditions on id.Companyid equals cds.Companyid where id.Conditionno == cds.Conditionno && id.Id == cds.Id && id.Quotno == idd select new { Conditionno = id.Conditionno, Condition = cds.Condition }).ToList();

            var tempcondition = _db.printcondition.Where(u => u.qtno == idd && u.companyid == comapnyid && u.userid == userid).ToList();
            if (tempcondition != null)
            {
                _db.printcondition.RemoveRange(tempcondition);
                _db.SaveChanges();
            }

            var cd = new printcondition();
            cd.qtno = idd;
            cd.userid = userid;
            cd.companyid = comapnyid;
            var i = 1;
            foreach (var dt in Condition)
            {
                if (i == 1)
                {
                    cd.c1 = dt.Condition;
                }
                else if (i == 2)
                {
                    cd.c2 = dt.Condition;
                }
                else
               if (i == 3)
                {
                    cd.c3 = dt.Condition;
                }
                else
               if (i == 4)
                {
                    cd.c4 = dt.Condition;
                }
                else
               if (i == 5)
                {
                    cd.c5 = dt.Condition;
                }
                else
               if (i == 6)
                {
                    cd.c6 = dt.Condition;
                }
                else
               if (i == 7)
                {
                    cd.c7 = dt.Condition;
                }
                i = i + 1;
            }
            _db.printcondition.Add(cd);
            _db.SaveChanges();

            var ptcondition = _db.printcondition.Where(a => a.qtno == idd && a.companyid == comapnyid && a.userid == userid).ToList();
            var qtd = _db.SalesqDetails.Where(a => a.Quotno == idd && a.Companyid == comapnyid).FirstOrDefault();

            LocalReport localReport = new LocalReport(path);
            localReport.AddDataSource("ITEMS", ITEMS3);
            localReport.AddDataSource("QUOTATIONDETAILS", QTDETAILS);
            localReport.AddDataSource("CONDITION", ptcondition);

            var result = localReport.Execute(RenderType.Pdf, extension, parameter, mimtype);
            return File(result.MainStream, "application/pdf");

        }

    }
}
