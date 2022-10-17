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
    public class DemoPrint : PageModel
    {
        private readonly ILogger<DemoPrint> _logger;

        public DemoPrint(ILogger<DemoPrint> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
         

        }
    }
}
