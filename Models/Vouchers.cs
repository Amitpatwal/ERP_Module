using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace SALES_ERP.Models
{
    public class Sale
    {
        [Key]
        public int Sr { get; set; }
        public int InvoiceNoDigit { get; set; }
        public string InvoiceNO { get; set; }
        public DateTime Date { get; set; }
        public int Ccode { get; set; }
        public string Companyname { get; set; }
        public DateTime POdate { get; set; }
        public string Pono { get; set; }
        public string TransportName { get; set; }
        public int Tcode { get; set; }
        public int Pterm { get; set; }
        public double Debit { get; set; }
        public string Userid { get; set; }
        public string Companyid { get; set; }
        public double Credit { get; set; }
        public string DrCr { get; set; }
        public bool paymentStatus { get; set; }

    }

    public class Purchase
    {
        [Key]
        public int Sr { get; set; }
        public int PRnodigit { get; set; }
        public string PrNO { get; set; }
        public DateTime Date { get; set; }
        public int Ccode { get; set; }
        public string Companyname { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string PurchaseNo { get; set; }
        public int Pterm { get; set; }
        public double Debit { get; set; }
        public string Userid { get; set; }
        public string Companyid { get; set; }
        public double Credit { get; set; }
        public string Drcr { get; set; }
        public bool paymentStatus { get; set; }
    }

    public class PaymentReceipt
    {
        [Key]
        public int Sr { get; set; }
        public int VoucherNoDigit { get; set; }
        public string VoucherNo { get; set; }
        public DateTime VoucherDate { get; set; }
        public string VoucherType { get; set; }
        public string BankName { get; set; }
        public int BankId { get; set; }
        public string CustomerName { get; set; }
        public int CustomerID { get; set; }
        public float Debit { get; set; }
        public string Userid { get; set; }
        public string Companyid { get; set; }
        public string Narration { get; set; }
        public string SalePurchaseType { get; set; }
        public float Credit { get; set; }
        public string DrCr { get; set; }
    }

    public class DebitCreditNote
    {
        [Key]
        public int Sr { get; set; }
        public int vouchernodigit { get; set; }
        public string voucherno { get; set; }
        public DateTime voucherdate { get; set; }
        public string vouchertype { get; set; }
        public int ccode { get; set; }
        public string companyname { get; set; }
        public string companyid { get; set; }
        public string reference { get; set; }
        public string Userid { get; set; }
        public string type { get; set; }
        public double Debit { get; set; }
        public double Credit { get; set; }

    }

    public class DebitCreditRefrence
    {
        [Key]
        public int Sr { get; set; }
        public int vouchernodigit { get; set; }
        public string voucherno { get; set; }
        public string reference { get; set; }
        public double Debit { get; set; }
        public double Credit { get; set; }
        public string companyid { get; set; }
    }

    public class PaymentReceiptReference
    {
        [Key]
        public int Sr { get; set; }
        public int SrNo { get; set; }
        public string voucherno { get; set; }
        public string voucherType { get; set; }

        public string type { get; set; }
        public string reference { get; set; }
        public double Debit { get; set; }
        public double Credit { get; set; }
        public string companyid { get; set; }

    }

}
