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
    public class PurchaseOrderPrintPNS  : PageModel
    {
        public readonly ApplicationDBContext _db;
        private readonly IWebHostEnvironment _webHostEnvironmant;
        public PurchaseOrderPrintPNS(ApplicationDBContext db, IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            this._webHostEnvironmant = webHostEnvironment;
        }
        public IActionResult OnGet(string idd, string printtype)
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
             if(printtype == "printformat")
            {
                if (comapnyid == "1jTUJPLyMq3")
                {
                    path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\PurchaseOrder.rdlc";
                }
                else
                {
                    path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\PurchaseOrderSBS.rdlc";
                }
            }
            else
            {
                if (comapnyid == "1jTUJPLyMq3")
                {
                    path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\PurchaseOrderWithoutPrint.rdlc";
                }
                else
                {
                    path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\PurchaseOrderSBS.rdlc";
                }

            }

           
            Dictionary<string, string> parameter = new Dictionary<string, string>();
            var ITEMS = _db.PurchaseOrderItem.Where(a => a.PoNo == idd && a.Companyid == comapnyid).ToList().OrderBy(a => a.Itemid);
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
                var ITEMS1 = _db.PurchaseOrderItem.Where(a => a.PoNo == idd && a.Companyid == comapnyid && a.Itemid == dt.Itemid).OrderBy(a => a.Itemid).FirstOrDefault(); ;
                if (ITEMS1 != null)
                {
                    ITEMS1.Description = desp;
                    _db.SaveChanges();
                }
            }
            var ITEMS3 = _db.PurchaseOrderItem.Where(a => a.PoNo == idd && a.Companyid == comapnyid).OrderBy(a => a.Itemid).ToList();

            var PODETAILS = _db.PODetials.Where(a => a.PoNo == idd && a.Companyid == comapnyid).ToList();

            var pono = _db.PODetials.Where(a => a.PoNo == idd && a.Companyid == comapnyid).FirstOrDefault();
            var filename = pono.SupplierCompanyname + "_" + pono.PoNo + ".pdf";

            LocalReport localReport = new LocalReport(path);
            localReport.AddDataSource("ITEMS", ITEMS);
            localReport.AddDataSource("PODETAILS", PODETAILS);
            var result = localReport.Execute(RenderType.Pdf, extension, parameter, mimtype);
            return File(result.MainStream, "application/pdf");

        }
    }
}
