using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using SALES_ERP.Models;
using System.IO;
using Grpc.Core;
using Microsoft.AspNetCore.Hosting;
using AspNetCore.Reporting;
using AspNetCore.Reporting.ReportExecutionService;
using iTextSharp.text.pdf;

namespace SALES_ERP.Controllers
{
    [Route("api/QuotationPrint")]
    public class QuotationPrintController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironmant;
        public readonly ApplicationDBContext _db;
        public QuotationPrintController(ApplicationDBContext db, IWebHostEnvironment webHostEnvironment)
        {
            _db = db;
            this._webHostEnvironmant = webHostEnvironment;
        }
        public IActionResult Index()
        {
            return View();
        }
        /*public ActionResult ExportCustomers()
        {
            *//*List<Customer> allCustomer = new List<Customer>();
            allCustomer = context.Customers.ToList();*//*
            
            ReportDocument rd = new ReportDocument();
            var path = Path.Combine("~/Reports", "QuotationReport.rpt");
            rd.Load(path);

          *//*  rd.SetDataSource(allCustomer);*/

        /* Response.Buffer = false;
         Response.ClearContent();
         Response.ClearHeaders();*/


        /* Stream stream = rd.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
         stream.Seek(0, SeekOrigin.Begin);*//*
         return File(stream, "application/pdf", "CustomerList.pdf");
     }*/
        [Route("Addtempcompanydetails")]
        public IActionResult Addtempcompanydetails(string idd)
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
            else
            {
                path = $"{this._webHostEnvironmant.WebRootPath}\\Reports\\SalesquotationSBS.rdlc";
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
            /*ReportViewer reportViewer = new ReportViewer();*/

            /*   reportViewer.ProcessingMode = ProcessingMode.Local;
               reportViewer.LocalReport.ReportPath = Server.MapPath(@"~\Report1.rdlc");*/

            //Byte  
            /*   Warning[] warnings;
               string[] streamids;
               string mimeType, encoding, filenameExtension;*/
            /*byte[] bytes = localReport..Render("Pdf", null, out mimeType, out encoding, out filenameExtension, out streamids, out warnings);*/
            /* var bytes= File(result.MainStream, "application/pdf");
             //File  
             string FileName = "Test_" + DateTime.Now.Ticks.ToString() + ".pdf";
             string FilePath = $"{this._webHostEnvironmant.WebRootPath}\\TempFiles\\"+ FileName;
             *//*string FilePath = HttpContext.Server.MapPath(@"~\TempFiles\") + FileName;*//*

             //create and set PdfReader  
             PdfReader reader = new PdfReader(bytes);
             FileStream output = new FileStream(FilePath, FileMode.Create);

             string Agent = HttpContext.Request.Headers["User-Agent"].ToString();

             //create and set PdfStamper  
             PdfStamper pdfStamper = new PdfStamper(reader, output, '0', true);

             if (Agent.Contains("Firefox"))
                 pdfStamper.JavaScript = "var res = app.loaded('var pp = this.getPrintParams();pp.interactive = pp.constants.interactionLevel.full;this.print(pp);');";
             else
                 pdfStamper.JavaScript = "var res = app.setTimeOut('var pp = this.getPrintParams();pp.interactive = pp.constants.interactionLevel.full;this.print(pp);', 200);";

             pdfStamper.FormFlattening = false;
             pdfStamper.Close();
             reader.Close();

             //return file path  
             string FilePathReturn = @"TempFiles/" + FileName;
             return Content(FilePathReturn);*/

        }
    }
}
