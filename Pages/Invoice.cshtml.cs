using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Pages
{
    public class InvoiceModel : PageModel
    {
        private readonly ILogger<InvoiceModel> _logger;

        public InvoiceModel(ILogger<InvoiceModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            var emaildid = Request.Cookies["Emailid"];
            var ClientName = Request.Cookies["usid"];
            var roletype = Request.Cookies["roletype"];
            if (emaildid == null)
            {
                Response.Redirect("../Index");
            }
            
        }
       
    }
}
