using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace SALES_ERP.Models
{
    public class PriceListModel
    {
        [Key]
        public int id { get; set; }
        public DateTime date { get; set; }
        public string pname { get; set; }
        public int pnameid { get; set; }
        public string psize { get; set; }
        public int psizeid { get; set; }
        public string pclass { get; set; }
        public string pclassid { get; set; }
        public string pmake { get; set; }
        [NotMapped]
        public List<string> pmake1 { get; set; }
        public string pmakeid { get; set; }
        public string unit { get; set; }
        public int unitid { get; set; }
        public double amount { get; set; }
        public string companyname { get; set; }
        [NotMapped]
        public List<string> make { get; set; }
    }
   public class PricelistMake
    {
        [Key]
        public int id { get; set; }
        public int pricelistid { get; set; }
        public int makeid { get; set; }
        public string make { get; set; }
        public string companyid { get; set; }

    }
    public class plList
    {
        public DateTime date { get; set; }
        public double price { get; set; }
        public string make { get; set; }
    }
}
