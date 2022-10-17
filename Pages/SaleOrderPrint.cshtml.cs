using AspNetCore.Reporting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using SALES_ERP.Models;
using System.Collections.Generic;
using System.Linq;

namespace SALES_ERP.Pages
{
    public class SaleOrderPrint : PageModel
    {
        public readonly ApplicationDBContext _db;
        private readonly IWebHostEnvironment _webHostEnvironmant;
        public SaleOrderPrint(ApplicationDBContext db, IWebHostEnvironment webHostEnvironment)
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
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\SaleOrder.rdlc";
            }
            else
            {
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\SaleOrderSBS.rdlc";
            }
            Dictionary<string, string> parameter = new Dictionary<string, string>();
            var ITEMS = _db.SOItem.Where(a => a.Sono == idd && a.Companyid == comapnyid).ToList().OrderBy(a => a.Itemid);
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
                var ITEMS1 = _db.SOItem.Where(a => a.Sono == idd && a.Companyid == comapnyid && a.Itemid == dt.Itemid).OrderBy(a => a.Itemid).FirstOrDefault(); ;
                if (ITEMS1 != null)
                {
                    ITEMS1.Description = desp;
                    _db.SaveChanges();
                }
            }

            var ITEMS3 = _db.SOItem.Where(a => a.Sono == idd && a.Companyid == comapnyid).OrderBy(a => a.Itemid).ToList();
            var SODETAILS = _db.SOdetails.Where(a => a.SONo == idd && a.Companyid == comapnyid).ToList();
            var BANK = _db.Bank.Where(a => a.Companyid == comapnyid && a.Defaulter == true).ToList();

            LocalReport localReport = new LocalReport(path);
            localReport.AddDataSource("ITEMS", ITEMS3);
            localReport.AddDataSource("DataSet1", SODETAILS);
            localReport.AddDataSource("BANK", BANK);
            var result = localReport.Execute(RenderType.Pdf, extension, parameter, mimtype);
            return File(result.MainStream, "application/pdf");
        }


    }
}
