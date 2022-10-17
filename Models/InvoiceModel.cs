using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SALES_ERP.Models
{
    public class InvoiceDetails
    {
        [Key]
        public int Sr { get; set; }
        public int InvoiceNodigit { get; set; }
        public string IVNo { get; set; }
        public DateTime IVDate { get; set; }
        public string Dono { get; set; }
        public DateTime Dodate { get; set; }
        public string ourGST { get; set; }
        public string ourPAN { get; set; }
        public string PoNo { get; set; }
        public DateTime PoDate { get; set; }
        public string SoNo { get; set; }
        public DateTime SODate { get; set; }
        public int BillingCCode { get; set; }
        public string Billingname { get; set; }
        public string BillingAddress { get; set; }
        public string BillingCity { get; set; }
        public string BillingState { get; set; }
        public string BillingPincode { get; set; }
        public string BillingGST { get; set; }
        public string BillingPAN { get; set; }
        public string BillingContactPerson { get; set; }
        public string BillingMobile { get; set; }
        public string BillingEmail { get; set; }
        public int ConsginCCode { get; set; }
        public string Consginname { get; set; }
        public string ConsginAddress { get; set; }
        public string ConsginCity { get; set; }
        public string ConsginState { get; set; }
        public string ConsginPincode { get; set; }
        public string ConsginGST { get; set; }
        public string ConsginPAN { get; set; }
        public string ConsignContactPerson { get; set; }
        public string ConsignMobile { get; set; }
        public string ConsignEmail { get; set; }
        public int TransportCCode { get; set; }
        public string TransportName { get; set; }
        public string VechileNo { get; set; }
        public string FreightType { get; set; }
        public double FreightCharge { get; set; }
        public double ForwardingTransportAmount { get; set; }
        public string GrNO { get; set; }
        public string Note { get; set; }
        public string Companyid { get; set; }
        public string Userid { get; set; }
        public string gstType { get; set; }
        public double CGST { get; set; }
        public double IGST { get; set; }
        public double SGST { get; set; }

  /* -------------------BANK DETAILS--------------------------------------*/

        public string bankName { get; set; }
        public string accNo { get; set; }
        public string ifsccode { get; set; }
        public string branch { get; set; }
        public string iec { get; set; }

        public string Label1 { get; set; }
        public double Input1 { get; set; }
        public string Label2 { get; set; }
        public double Input2 { get; set; }

        public string Label3 { get; set; }
        public double Input3 { get; set; }

        public string Label4 { get; set; }
        public String Input4 { get; set; }
        public double Amount { get; set; }


    }
    public class TempInvoiceDetails
    {
        [Key]
        public int Sr { get; set; }
        public int InvoiceNodigit { get; set; }
        public string IVNo { get; set; }
        public DateTime IVDate { get; set; }
        public string Dono { get; set; }
        public DateTime Dodate { get; set; }
        public string ourGST { get; set; }
        public string ourPAN { get; set; }
        public string PoNo { get; set; }
        public DateTime PoDate { get; set; }
        public string SoNo { get; set; }
        public DateTime SODate { get; set; }
        public int BillingCCode { get; set; }
        public string Billingname { get; set; }
        public string BillingAddress { get; set; }
        public string BillingCity { get; set; }
        public string BillingState { get; set; }
        public string BillingPincode { get; set; }
        public string BillingGST { get; set; }
        public string BillingPAN { get; set; }
        public string BillingContactPerson { get; set; }
        public string BillingMobile { get; set; }
        public string BillingEmail { get; set; }
        public int ConsginCCode { get; set; }
        public string Consginname { get; set; }
        public string ConsginAddress { get; set; }
        public string ConsginCity { get; set; }
        public string ConsginState { get; set; }
        public string ConsginPincode { get; set; }
        public string ConsginGST { get; set; }
        public string ConsginPAN { get; set; }

        public string ConsignContactPerson { get; set; }
        public string ConsignMobile { get; set; }
        public string ConsignEmail { get; set; }

        public int TransportCCode { get; set; }
        public string TransportName { get; set; }
        public string VechileNo { get; set; }
        public string FreightType { get; set; }
        public double FreightCharge { get; set; }
        public double ForwardingTransportAmount { get; set; }
        public string GrNO { get; set; }
        public string Note { get; set; }
        public string Companyid { get; set; }
        public string Userid { get; set; }
        public string gstType { get; set; }
        public double CGST { get; set; }
        public double IGST { get; set; }
        public double SGST { get; set; }

        /* -------------------BANK DETAILS--------------------------------------*/

        public string bankName { get; set; }
        public string accNo { get; set; }
        public string ifsccode { get; set; }
        public string branch { get; set; }
        public string iec { get; set; }

        public string Label1 { get; set; }
        public double Input1 { get; set; }
        public string Label2 { get; set; }
        public double Input2 { get; set; }

        public string Label3 { get; set; }
        public double Input3 { get; set; }

        public string Label4 { get; set; }
        public String Input4 { get; set; }

        public double Amount { get; set; }


    }
    public class InvoiceItem
    {
        [Key]
        public int Sr { get; set; }
        public int IVNodigit { get; set; }
        public string IVNo { get; set; }
        public int Itemid { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public string Altpname { get; set; }
        public string Psize { get; set; }
        public string Altpsize { get; set; }
        public string Pclass { get; set; }
        public string Altpclass { get; set; }
        public string Pmake { get; set; }
        public string HSNCode { get; set; }
        public double Qty { get; set; }
        public string Qtyunit { get; set; }

        public double price { get; set; }
        public double discount { get; set; }
        public double discountPrice { get; set; }
        public double Amount { get; set; }


        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string Companyid { get; set; }

    }
    public class TempInvoiceItem
    {
        [Key]
        public int Sr { get; set; }
        public int IVNodigit { get; set; }
        public string IVNo { get; set; }
        public int Itemid { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public string Altpname { get; set; }
        public string Psize { get; set; }
        public string Altpsize { get; set; }
        public string Pclass { get; set; }
        public string Altpclass { get; set; }
        public string Pmake { get; set; }
        public string HSNCode { get; set; }
        public double Qty { get; set; }
        public string Qtyunit { get; set; }
        public double price { get; set; }
        public double discount { get; set; }
        public double discountPrice { get; set; }
        public double Amount { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string Companyid { get; set; }

    }
}
