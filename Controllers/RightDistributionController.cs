using SALES_ERP.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Controllers
{
    [Route("api/RightDistribution")]
    public class RightDistributionController : Controller
    {
        private readonly ApplicationDBContext _db;
        public RightDistributionController(ApplicationDBContext db)
        {
            _db = db;
        }



        [Route("getRole")]
        public IActionResult getRole()
        {
            try
            {
                var data = _db.RoleName.ToList();
                return Json(new { success = true, data = data });
            }
            catch (Exception)
            {
                return Json(new { success = false, data = "" });

            }
        }

        [Route("permission")]
        public IActionResult permission(string type, userrights us)
        {
            try
            {
                if (type == "Update")
                {
                    var per = _db.userrights.Where(a => a.roleid == us.roleid).ToList();
                    if (per != null)
                    {
                        _db.userrights.RemoveRange(per);
                        _db.SaveChanges();
                    }
                }
                for (int k = 0; k < us.formsName1.Count; k++)
                {
                    var usr = new userrights();
                    usr.formsid = 0;
                    usr.roleid = us.roleid;
                    usr.formsName = us.formsName1[k];
                    usr.operations = us.operations1[k];
                    usr.permission = us.permission1[k];
                    _db.userrights.Add(usr);
                    _db.SaveChanges();
                }

                return Json(new { success = true, message = "Successfully Saved" });
            }
            catch (Exception)
            {
                return Json(new { success = false });

            }
        }

        [Route("fillpermission")]
        public IActionResult fillpermission(int roleid)
        {
            try
            {
                var data = _db.userrights.Where(a => a.roleid == roleid).ToList();

                return Json(new { success = true, data=data});
            }
            catch (Exception)
            {
                return Json(new { success = false });

            }
        }
        
    }
}
