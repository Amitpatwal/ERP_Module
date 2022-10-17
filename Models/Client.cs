using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Models
{
  
    public class CustomerData
    {
        [Key]
        public int Customerid { get; set; }
        public string Companyname { get; set; }
        public string ContactPerson { get; set; }
        public string DealingPerson { get; set; }
        public string Email { get; set; }
        public string GSt { get; set; }
        public string PAN { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int Statecode { get; set; }
        public string Type { get; set; }
        public string Companyid { get; set; }
        public double openingAmount { get; set; }
        public double onAccount { get; set; }
        public string CrDr { get; set; }
        public string onAccountCrDr { get; set; }
        public DateTime openingDate { get; set; }
        [NotMapped]
        public DateTime date { get; set; }

    }


    public class OpeningBalance
    {
        [Key]
        public int opid { get; set; }
        public string CompanyId { get; set; }
        public string invoiceno { get; set; }
        public DateTime invoiceDate { get; set; }
        public DateTime podate { get; set; }
        public string pono { get; set; }
        public DateTime DueDate { get; set; }
        public string transportname { get; set; }
        public int transportid { get; set; }
        public string grno { get; set; }
        public int pterm { get; set; }
        public double debit { get; set; }
        public double credit { get; set; }
        public string CrDr { get; set; }
        public int customerid { get; set; }
        public bool paymentStatus { get; set; }
    }


    public class CompanyProfile
    {
        [Key]
        public int Companyid { get; set; }
        public string Companyname { get; set; }
        public string FinancialYear { get; set; }
        public string MailingName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string GST { get; set; }
        public string PAN { get; set; }
        public string Address { get; set; }
        public DateTime begningdate { get; set; }
        public DateTime financialdate { get; set; }
        public string uniquecode { get; set; }

    }
    public class Logs
    {

        [Key]
        public int SrNo { get; set; }
        public string Description { get; set; }
        public string VoucherId { get; set; }
        public string VoucherType { get; set; }
        public string UsreName { get; set; }
        public string companyid { get; set; }
        public int Usreid { get; set; }
        public DateTime date { get; set; }


    }


}
