﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Pages
{
    public class ItemReservedModel : PageModel
    {
        private readonly ILogger<ItemReservedModel> _logger;

        public ItemReservedModel(ILogger<ItemReservedModel> logger)
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