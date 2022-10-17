using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using SALES_ERP.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Pages
{
    public class MaterialShiftingFormModel : PageModel
    {
        /*public IWebHostEnvironment Environment;*/
        
        public readonly ApplicationDBContext _db;
        
        public MaterialShiftingFormModel(ApplicationDBContext db)
        {
            _db = db;
        }
      

        public void OnGet()
        {
            var emaildid = Request.Cookies["Emailid"];
            var ClientName = Request.Cookies["usid"];
            if (emaildid == null)
            {
                Response.Redirect("../Index");
            }

        }

       
    }
}
