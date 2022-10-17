using SALES_ERP.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDBContext _db;
        public IndexModel(ApplicationDBContext db)
        {
            _db = db;
        }
        
        [BindProperty]
        public InputModel Input { get; set; }
        public IList<AuthenticationScheme> ExternalLogins { get; set; }
        public string ReturnUrl { get; set; }
        [TempData]
        public string ErrorMessage { get; set; }
        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            [DataType(DataType.Password)]
            public int otp { get; set; }

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }
        }


        public void OnGetAsync()
        {
            var emaildid = Request.Cookies["Emailid"];
            var ClientName = Request.Cookies["usid"];
            var companyid = Request.Cookies["companyid"];
            if (emaildid != null)
            {
                if (companyid!=null)
                {
                    Response.Redirect("../Dashboard");
                }
                else
                {
                    Response.Redirect("../SelectCompany");
                }
            }
        }
    
    }
}
