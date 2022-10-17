using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SALES_ERP.Models
{
    public class Admin
    {
        [Key]
        public int SrNo { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
    }

    public class counters4
    {
        public double totalQuotation { get; set; }
        public double pendingQuotation { get; set; }
        public double totalPI { get; set; }
        public double CancelQuotation { get; set; }
        public double OrderConverted { get; set; }
        public double InvoiceCreated { get; set; }
        public double totalsaleOrder { get; set; }
        public double dailyInvoice { get; set; }
        public double dailyquotation { get; set; }
       

    }

    public class StockBarCounter
    {
        public int Tata  { get; set; }
        public int Surya  { get; set; }
        public int Appolo  { get; set; }
        public int Jindal  { get; set; }
        public int Isi  { get; set; }
        public int Navbharat  { get; set; }
        public int Suncity  { get; set; }
        public int Jsl  { get; set; }
        public int Msl  { get; set; }
        public int Others  { get; set; }

    }

    public class ProfileCounter
    {
        public int totalQuotation { get; set; }
        public int totalPI { get; set; }
        public int totalsaleOrder { get; set; }
        public int totalPurchase { get; set; }
        public int totalPR { get; set; }
        public int totalDO { get; set; }
        
    }
}
