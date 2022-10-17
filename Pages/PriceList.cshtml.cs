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
    public class PriceListModel : PageModel
    {
        private readonly ILogger<ItemListModel> _logger;

        public PriceListModel(ILogger<ItemListModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
            var emailid = Request.Cookies["Emailid"];
          
        }
    }
}
