using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace SALES_ERP.Models
{
    public class PIdetails
    {
        [Key]
        public int Sr { get; set; }
        public int PINodigit { get; set; }
        public string PINo { get; set; }
        public string Quotno { get; set; }
        public string Unique { get; set; }
        public DateTime Date { get; set; }
        public DateTime QtnDate { get; set; }

        public string BillCompanyname { get; set; }
        public int BillCCode { get; set; }
        public string BillContactperson { get; set; }
        public string BillEmail { get; set; }
        public string BillPhone { get; set; }
        public string BillState { get; set; }
        public int Billstatecode { get; set; }
        public string BillCity { get; set; }
        public string BillAddress { get; set; }
        public string BillGST { get; set; }
        
        public string ConsignCompanyname { get; set; }
        public int ConsignCCode { get; set; }
        public string ConsignContactperson { get; set; }
        public string ConsignEmail { get; set; }
        public string ConsignPhone { get; set; }
        public string ConsignState { get; set; }
        public int Consignstatecode { get; set; }
        public string ConsignCity { get; set; }
        public string ConsignAddress { get; set; }
        public string ConsignGST { get; set; }
        
        public string Amendno { get; set; }
        public DateTime AmendDAte { get; set; }
        public string PONo { get; set; }
        public DateTime PODate { get; set; }
        public string ordertype { get; set; }
        public bool Tcs { get; set; }
        public string Tax { get; set; }

        public bool LD { get; set; }

        public DateTime DeliveryDate { get; set; }

        public string Label1 { get; set; }
        public double Input1 { get; set; }
        public string Label2 { get; set; }
        public double Input2 { get; set; }

        public string Label3 { get; set; }
        public double Input3 { get; set; }

        public string Label4 { get; set; }
        public string Input4 { get; set; }

        public double Amount { get; set; }
        public string Userid { get; set; }
        
        public string Note { get; set; }
        public string Companyid { get; set; }
        public double gstAmount { get; set; }


        public double total1 { get; set; }
        public double total2 { get; set; }
        public double grandTotal { get; set; }
        [NotMapped]
        public bool sostatus { get; set; }
        [NotMapped]
        public string sostatuss { get; set; }

    }

    public class PIQuotationItem
    {
        [Key]
        public int Sr { get; set; }
        public string Pino { get; set; }
        public int Pinodigit { get; set; }
        public string Quotno { get; set; }
        public int Itemid { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public string Description { get; set; }
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
        public double gstAmount { get; set; }
        public string unitType { get; set; }
    }

    public class Temppidata
    {
        [Key]
        public int Sr { get; set; }
        public int Pinodigit { get; set; }
        public string Quotno { get; set; }
        public string Unique { get; set; }  
        public DateTime QtnDate { get; set; }
        public string BillCompanyname { get; set; }
        public int BillCCode { get; set; }
        public string BillContactperson { get; set; }
        public string BillEmail { get; set; }
        public string BillPhone { get; set; }
        public string BillState { get; set; }
        public int Billstatecode { get; set; }
        public string BillCity { get; set; }
        public string BillAddress { get; set; }
        public string BillGST { get; set; }
      


        public string ConsignCompanyname { get; set; }
        public int ConsignCCode { get; set; }
        public string ConsignContactperson { get; set; }
        public string ConsignEmail { get; set; }
        public string ConsignPhone { get; set; }
        public string ConsignState { get; set; }
        public string ConsignCity { get; set; }
        public string ConsignAddress { get; set; }
        public int Consignstatecode { get; set; }
        public string ConsignGST { get; set; }
     
        public string Amendno { get; set; }
        public DateTime AmendDAte { get; set; }
        public string PONo { get; set; }
        public DateTime PODate { get; set; }
        public string ordertype { get; set; }
        public bool Tcs { get; set; }
        public string Tax { get; set; }

        public bool LD { get; set; }

        public DateTime DeliveryDate { get; set; }

        public string Label1 { get; set; }
        public double Input1 { get; set; }
        public string Label2 { get; set; }
        public double Input2 { get; set; }

        public string Label3 { get; set; }
        public double Input3 { get; set; }

        public string Label4 { get; set; }
        public string Input4 { get; set; }



        public double Amount { get; set; }
        public string Userid { get; set; }

        public string Companyid { get; set; }

        public double gstAmount { get; set; }

        public double total1 { get; set; }
        public double total2 { get; set; }
        public double grandTotal { get; set; }


    }

    public class TempPiQuotationItem
    {
        [Key]
        public int Sr { get; set; }
        public string Quotno { get; set; }
        public string Pino { get; set; }
        public int Pinodigit { get; set; }
        public int Itemid { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public string Altpname { get; set; }
        public string Psize { get; set; }
        public string Altpsize { get; set; }
        public string Pclass { get; set; }
        public string Altpclass { get; set; }
        public string Pmake { get; set; }
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

    public class fetchpi
    {
        public string gst { get; set; }
        public string state { get; set; }
        public string city { get; set; }
        public string Companyid { get; set; }

    }
}


