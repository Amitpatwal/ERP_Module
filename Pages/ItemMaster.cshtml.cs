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
    public class ItemMasterModel : PageModel
    {
        private readonly ILogger<ItemMasterModel> _logger;

        public ItemMasterModel(ILogger<ItemMasterModel> logger)
        {
            _logger = logger;
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
