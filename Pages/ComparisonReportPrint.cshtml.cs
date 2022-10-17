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
    public class ComparisonReportPrint : PageModel
    {
        public readonly ApplicationDBContext _db;
        private readonly IWebHostEnvironment _webHostEnvironmant;
        public ComparisonReportPrint(ApplicationDBContext db, IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            this._webHostEnvironmant = webHostEnvironment;
        }
        public IActionResult OnGet(string idd)
        {
            var emaildid = Request.Cookies["Emailid"];
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
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\ComparisonReport.rdlc";
            }
            else
            {
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\ComparisonReportSBS.rdlc";
            }
            Dictionary<string, string> parameter = new Dictionary<string, string>();
            var userid = Request.Cookies["id"];
            var data = _db.OpeningStockReport.Where(a => a.userid == userid && a.Companyid == comapnyid).GroupBy(b => new { b.pname, b.psize, b.pclass, b.location, b.unit, b.altunit, b.unit1, b.altunit1, b.pmake, b.pmake1, b.sdate, b.ddate }).Select(a => new { pname = a.Key.pname, psize = a.Key.psize, pclass = a.Key.pclass, location = a.Key.location, qty = a.Sum(a => a.qty), altqty = a.Sum(a => a.altqty), qty1 = a.Sum(a => a.qty1), altqty1 = a.Sum(a => a.altqty1), unit = a.Key.unit, unit1 = a.Key.unit1, altunit = a.Key.altunit, altunit1 = a.Key.altunit1, pmake = a.Key.pmake, pmake1 = a.Key.pmake1, ddate = a.Key.ddate, sdate = a.Key.sdate }).ToList().OrderBy(a => a.psize).ThenBy(a => a.pclass);

            LocalReport localReport = new LocalReport(path);
            localReport.AddDataSource("DataSet1", data);
            
            var result = localReport.Execute(RenderType.Pdf, extension, parameter, mimtype);
            return File(result.MainStream, "application/pdf");

        }
    }
}
