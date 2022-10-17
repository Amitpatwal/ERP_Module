using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SALES_ERP.Models
{
    

    public class PhysicalStock
    {
        [Key]
        public int Sr { get; set; }
        public DateTime VoucherDate { get; set; }
        public string Pname { get; set; }
        public int Pnameid { get; set; }
        public string Psize { get; set; }
        public int Psizeid { get; set; }
        public string Pclass { get; set; }
        public int Pclassid { get; set; }
        public string Pmake { get; set; }
        public int Pmakeid { get; set; }
        public double Qty { get; set; }
        public string Qtyunit { get; set; }
        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public string Wharehouse { get; set; }
        public int Wharehouseid { get; set; }
        public string Companyid { get; set; }
        public string userid { get; set; }
       
       
    }
    public class phy
    {
        

        public DateTime voucherDate { get; set; }
        public string pname { get; set; }
        public int pnameid { get; set; }
        public string size { get; set; }
        public int sizeid { get; set; }
        public string Class { get; set; }
        public int classid { get; set; }
        public string make { get; set; }
        public int makeid { get; set; }
        public string frmWhareHouse { get; set; }
        public int frmWhareHouseid { get; set; }
        public double Qty { get; set; }
        public string QtyUnit { get; set; }
        public double AltQty { get; set; }
        public string AltQtyUnit { get; set; }
        public string Username { get; set; }


    }





}
