using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SALES_ERP.Models
{
    public class Prefix
    {
        [Key]
        public int SrNo { get; set; }       
        public string  Prefixname{ get; set; }
        public string Type { get; set;}
        public string Companyid { get; set; }


    }
    public class Bank
    {
        [Key]
        public int SrNo { get; set; }
        public string BankName { get; set; }
        public string AcoountNo { get; set; }
        public string ISFC { get; set; }
        public string Branch { get; set; }
        public string AccountHolderName { get; set; }
        public bool Defaulter { get; set; }
        public string Companyid { get; set; }


    }
}
