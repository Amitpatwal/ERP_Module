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
    public class UserManagmentModel : PageModel
    {
        public readonly ApplicationDBContext _db;
   
        public UserManagmentModel(ApplicationDBContext db)
        {
            _db = db;
            /*_logger = logger;*/
        }

        public void OnGet()
        {
            var emaildid = Request.Cookies["Emailid"];
            var ClientName = Request.Cookies["usid"];
            if (emaildid == null)
            {
                Response.Redirect("../Index");
            }
         /*   var usidd = Request.Cookies["id"];
            int usid = Convert.ToInt32(usidd);
            var roleidd = Request.Cookies["roleid"];
            int roleid = Convert.ToInt32(roleidd);*/


            /*var data = _db.userrights.Where(a => a.roleid == roleid && a.formsName == "USER_MANAGEMENT" && a.operations == "SETTING").FirstOrDefault();
            if (data != null)
            {
                if (data.permission == false)
                {
                    Response.Redirect("../Index");
                }
            }*/

        }
    }
}
