using AspNetCore.Reporting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using SALES_ERP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Pages
{
    public class PIPrintModel : PageModel
    {
        public readonly ApplicationDBContext _db;
        private readonly IWebHostEnvironment _webHostEnvironmant;
        public PIPrintModel(ApplicationDBContext db, IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            this._webHostEnvironmant = webHostEnvironment;
        }

        public IActionResult OnGet(string idd)
        {
            var emaildid = Request.Cookies["Emailid"];
            var ClientName = Request.Cookies["usid"];
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
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\PerformaInvoice.rdlc";
            }
            else if(comapnyid == "xuZdaeSGHgB")
            {
                 path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\PerformaInvoiceSBS.rdlc";
            }
            else
            {
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\PerformaInvoiceDigitalInfotech.rdlc";
            }
            Dictionary<string, string> parameter = new Dictionary<string, string>();
            var ITEMS = _db.PIQuotationItem.Where(a => a.Pino == idd && a.Companyid == comapnyid).OrderBy(a => a.Itemid).ToList();
            foreach(var dt in ITEMS) {
                var desp = dt.Pname + "\n" + dt.Psize + " " + dt.Pclass;
                if (dt.Pmake != null)
                {
                    desp = desp+"\n" + dt.Pmake;
                }
                if (dt.Remarks != null)
                {
                    desp = desp + "\n" + dt.Remarks;
                }
                var ITEMS1 = _db.PIQuotationItem.Where(a => a.Pino == idd && a.Companyid == comapnyid && a.Itemid==dt.Itemid).OrderBy(a => a.Itemid).FirstOrDefault(); ;
                if (ITEMS1 != null)
                {
                    ITEMS1.Description = desp;
                    _db.SaveChanges();
                }
            }
            var ITEMS3 = _db.PIQuotationItem.Where(a => a.Pino == idd && a.Companyid == comapnyid).OrderBy(a => a.Itemid).ToList();

            var PIDETAILS = _db.PIdetails.Where(a => a.PINo == idd && a.Companyid == comapnyid).ToList();
            var BANK = _db.Bank.Where(a => a.Companyid == comapnyid && a.Defaulter == true).ToList();
            var pino = _db.PIdetails.Where(a => a.PINo == idd && a.Companyid == comapnyid).FirstOrDefault();
            var filename = pino.BillCompanyname + "_" + pino.PINo + ".pdf";

            LocalReport localReport = new LocalReport(path);
            localReport.AddDataSource("ITEMS", ITEMS3);
            localReport.AddDataSource("PIDETAILS", PIDETAILS);
            localReport.AddDataSource("BANK", BANK);
            var result = localReport.Execute(RenderType.Pdf, extension, parameter, mimtype);
            return File(result.MainStream, "application/pdf");

        }

    }
}
