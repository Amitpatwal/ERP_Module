using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SALES_ERP.Models
{
   

    public class PODetials
    {
        [Key]
        public int Sr { get; set; }
        public int PoNodigit { get; set; }
        public string PoNo { get; set; }
        public DateTime Date { get; set; }
        public string Userid { get; set; }
        public string Sono { get; set; }
        public string pino { get; set; }
        /*-------------------------------------------------------------------*/
        public int SupplierCCode { get; set; }
        public string SupplierCompanyname { get; set; }
        public string SupplierContactperson { get; set; }
        public string SupplierEmail { get; set; }
        public string SupplierPhone { get; set; }
        public string SupplierState { get; set; }
        public string SupplierStateCode { get; set; }
        public string SupplierCity { get; set; }
        public string SupplierAddress { get; set; }
        public string SupplierGST { get; set; }
        public string SupplierQuotationNo { get; set; }
        public DateTime SupplierQuotationDate { get; set; }
        /*-------------------------------------------------------------------*/
        public int RecipientCCode { get; set; }
        public string RecipientCompanyname { get; set; }
        public string RecipientGST { get; set; }
        public string RecipientState { get; set; }
        public int RecipientStateCode { get; set; }
        public string RecipientCity { get; set; }
        public string RecipientAddress { get; set; }
        public string RecipientContactPerson { get; set; }
        public string RecipientMobile { get; set; }
        public string RecipientEmail { get; set; }
        public string RecipientOrderNo { get; set; }
        public DateTime RecipientOrderDate { get; set; }
        /*-------------------------------------------------------------------*/
        public int ConsignCCode { get; set; }
        public string ConsignCompanyname { get; set; }
        public string ConsignGST { get; set; }
        public string ConsignState { get; set; }
        public int ConsignStateCode { get; set; }
        public string ConsignCity { get; set; }
        public string ConsignAddress { get; set; }
        public string ConsignContactPerson { get; set; }
        public string ConsignMobile { get; set; }
        public string ConsignEmail { get; set; }
        public string ConsignOrderNo { get; set; }
        public DateTime ConsignOrderDate { get; set; }
        /*-------------------------------------------------------------------*/
        public string Cash { get; set; }
        public string GST { get; set; }
        public string Delivery { get; set; }
        public string MTC { get; set; }
        /*-------------------------------------------------------------------*/
        public string NameofTransport { get; set; }
        public string PriceBasis { get; set; }
        public string PaymentTerms { get; set; }
        public string FreightCharge { get; set; }
        /*-------------------------------------------------------------------*/
        public string Remarks { get; set; }
        public double Amount { get; set; }
        public string Companyid { get; set; }

    }
    public class TempPODetials
    {
        [Key]
        public int Sr { get; set; }
        public int PoNodigit { get; set; }
        public string PoNo { get; set; }
        public DateTime Date { get; set; }
        public string Userid { get; set; }
        public string Sono { get; set; }
        public string pino { get; set; }
        /*-------------------------------------------------------------------*/
        public int SupplierCCode { get; set; }
        public string SupplierCompanyname { get; set; }
        public string SupplierContactperson { get; set; }
        public string SupplierEmail { get; set; }
        public string SupplierPhone { get; set; }
        public string SupplierState { get; set; }
        public int SupplierStateCode { get; set; }
        public string SupplierCity { get; set; }
        public string SupplierAddress { get; set; }
        public string SupplierGST { get; set; }
        public string SupplierQuotationNo { get; set; }
        public DateTime SupplierQuotationDate { get; set; }
        /*-------------------------------------------------------------------*/
        public int RecipientCCode { get; set; }
        public string RecipientCompanyname { get; set; }
        public string RecipientGST { get; set; }
        public string RecipientState { get; set; }
        public int RecipientStateCode { get; set; }
        public string RecipientCity { get; set; }
        public string RecipientAddress { get; set; }
        public string RecipientContactPerson { get; set; }
        public string RecipientMobile { get; set; }
        public string RecipientEmail { get; set; }
        public string RecipientOrderNo { get; set; }
        public DateTime RecipientOrderDate { get; set; }
        /*-------------------------------------------------------------------*/
        public int ConsignCCode { get; set; }
        public string ConsignCompanyname { get; set; }
        public string ConsignGST { get; set; }
        public string ConsignState { get; set; }
        public int ConsignStateCode { get; set; }
        public string ConsignCity { get; set; }
        public string ConsignAddress { get; set; }
        public string ConsignContactPerson { get; set; }
        public string ConsignMobile { get; set; }
        public string ConsignEmail { get; set; }
        public string ConsignOrderNo { get; set; }
        public DateTime ConsignOrderDate { get; set; }
        /*-------------------------------------------------------------------*/
        public string Cash { get; set; }
        public string GST { get; set; }
        public string Delivery { get; set; }
        public string MTC { get; set; }
        /*-------------------------------------------------------------------*/
        public string NameofTransport { get; set; }
        public string PriceBasis { get; set; }
        public string PaymentTerms { get; set; }
        public string FreightCharge { get; set; }
        /*-------------------------------------------------------------------*/
        public string Remarks { get; set; }
        public double Amount { get; set; }
        public string Companyid { get; set; }

    }

    public class PurchaseOrderItem
    {
        [Key]
        public int Sr { get; set; }
        public int PoNodigit { get; set; }
        public string PoNo { get; set; }
        public int Itemid { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public string Altpname { get; set; }
        public string Psize { get; set; }
        public string Altpsize { get; set; }
        public string Pclass { get; set; }
        public string Altpclass { get; set; }
        public string Pmake { get; set; }
        public string Pcategory { get; set; }
        public string Rateunit { get; set; }
        public double Rate { get; set; }
        public double Discount { get; set; }
        public double Discountrate { get; set; }
        public double Qty { get; set; }
        public string Qtyunit { get; set; }
        public double Amount { get; set; }
        public string Hsncode { get; set; }
        public string Remarks { get; set; }
        public string Companyid { get; set; }
        public string Description { get; set; }
        public string unitType { get; set; }

    }
    public class TempPurchaseOrderItem
    {
        [Key]
        public int Sr { get; set; }
        public int PoNodigit { get; set; }
        public string PoNo { get; set; }
        public int Itemid { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public string Altpname { get; set; }
        public string Psize { get; set; }
        public string Altpsize { get; set; }
        public string Pclass { get; set; }
        public string Altpclass { get; set; }
        public string Pmake { get; set; }
        public string Pcategory { get; set; }
        public string Rateunit { get; set; }
        public double Rate { get; set; }
        public double Discount { get; set; }
        public double Discountrate { get; set; }
        public double Qty { get; set; }
        public string Qtyunit { get; set; }
        public double Amount { get; set; }
        public string Hsncode { get; set; }
        public string Remarks { get; set; }
        public string Companyid { get; set; }

        public string unitType { get; set; }

    }

}
