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
    public class LoadingLOPrintModel : PageModel
    {
        public readonly ApplicationDBContext _db;
        private readonly IWebHostEnvironment _webHostEnvironmant;
        public LoadingLOPrintModel(ApplicationDBContext db, IWebHostEnvironment webHostEnvironment)
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
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\LoadingSlip.rdlc";
            }
            else
            {
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\LoadingSlipSBS.rdlc";
            }


            Dictionary<string, string> parameter = new Dictionary<string, string>();
            var ITEMS = _db.LODesPatchItem.Where(a => a.LoNo == idd && a.Companyid == comapnyid).ToList().OrderBy(a => a.Itemid);
            var DODETAILS = _db.LODetials.Where(a => a.Lono == idd && a.Companyid == comapnyid).ToList();




            LocalReport localReport = new LocalReport(path);
            localReport.AddDataSource("ITEMS", ITEMS);
            localReport.AddDataSource("LODETAILS", DODETAILS);


            var result = localReport.Execute(RenderType.Pdf, extension, parameter, mimtype);
            return File(result.MainStream, "application/pdf");

        }

    }
}
