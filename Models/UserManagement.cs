using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SALES_ERP.Models
{
    public class RoleName
    {
        [Key]
        public int roleid { get; set; }
        public string rolename { get; set; }
    }

    public class user
    {
        [Key]
        public int usid { get; set; }
        public string username { get; set; }
        public string userid { get; set; }
        public string password { get; set; }
        public string roletype { get; set; }
        public int roleId { get; set; }
        public bool isActive { get; set; }
        public bool isdeleted { get; set; }
        [NotMapped]
        public List<IFormFile> Name1 { get; set; }
        public string filename { get; set; }

    }

    public class userrights
    {
        [Key]
        public int id { get; set; }
        public int roleid { get; set; }
        public int formsid { get; set; }

        [NotMapped]
        public List<string> formsName1 { get; set; }
        [NotMapped]
        public List<string> operations1 { get; set; }
        [NotMapped]
        public List<bool> permission1 { get; set; }
        public string formsName { get; set; }
        public string operations { get; set; }
        public bool permission { get; set; }

    }

    public class companypermission
    {
        [Key]
        public int id { get; set; }
        public int usid { get; set; }
        public string companyid { get; set; }
        public bool permission { get; set; }
        public int roleid { get; set; }
        public string rolename { get; set; }
    }

    public class operations
    {
        [Key]
        public int id { get; set; }
        public string operation { get; set; }
    }

    public class formsType
    {
        [Key]
        public int id { get; set; }
        public string formsName { get; set; }
    }

    public class panno
    {
        public string SupplierPan { get; set; }
        public string RecieptPan { get; set; }
        public string ConsignPan { get; set; }
    }

    public class lrd
    {

        public DateTime frmdata { get; set; }
        public DateTime todate { get; set; }
        public string frm { get; set; }
        public string type { get; set; }
        public string searchBy { get; set; }
        public string contractorName { get; set; }
        public List<string> frieghttype { get; set; }

    }
    public class viewrd
    {
        public int sr { get; set; }
        public DateTime date { get; set; }
        public string voucherno { get; set; }
        public string invoiceno { get; set; }
        public string companyname { get; set; }
        public double weight { get; set; }
        public string type { get; set; }
        public string frtype { get; set; }
        public double amount { get; set; }
    }


    public class viewcomp
    {
        public DateTime frmdata { get; set; }
        public DateTime todate { get; set; }
        public List<string> wharehouse { get; set; }
        public string pmake1 { get; set; }
        public string pmake { get; set; }
        public string pname { get; set; }
        public bool negative { get; set; }
    }
}
