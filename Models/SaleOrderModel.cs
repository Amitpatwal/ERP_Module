using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace SALES_ERP.Models
{
    public class SOdetails
    {
        [Key]
        public int Sr { get; set; }
        public int SONodigit { get; set; }
        public string SONo { get; set; }
        public DateTime SODate { get; set; }
        public string PINo { get; set; }
        public DateTime PIDate { get; set; }
        public string Quotno { get; set; }
        public DateTime QtnDate { get; set; }
        public string Unique { get; set; }


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
        public String Input4 { get; set; }
        public String Note { get; set; }
        public double Amount { get; set; }
        public string Userid { get; set; }
        public bool Status { get; set; }
        public string Companyid { get; set; }
        public double gstAmount { get; set; }
        [NotMapped]
        public bool sostatus { get; set; }


        public string InspectionClause { get; set; }
        public string EndProtectionRequired { get; set; }
        public string EndCapBothSide { get; set; }
        public string CalibrationCertificate { get; set; }
        public string EndFinshingRequired { get; set; }
        public string MTC { get; set; }
        public string QacRemarks { get; set; }
        [NotMapped]
        public int counter { get; set; }

        public bool PlanningStatus { get; set; }






    }
    public class TempSOdetails
    {
        [Key]
        public int Sr { get; set; }
        public int SONodigit { get; set; }
        public string SONo { get; set; }
        public DateTime SODate { get; set; }
        public string PINo { get; set; }
        public DateTime PIDate { get; set; }
        public string Quotno { get; set; }
        public DateTime QtnDate { get; set; }
        public string Unique { get; set; }


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
        public String Input4 { get; set; }
        public String Note { get; set; }

        public double Amount { get; set; }
        public string Userid { get; set; }

        public bool Status { get; set; }
        public string Companyid { get; set; }
        public double gstAmount { get; set; }


        public string InspectionClause { get; set; }
        public string EndProtectionRequired { get; set; }
        public string EndCapBothSide { get; set; }
        public string CalibrationCertificate { get; set; }
        public string EndFinshingRequired { get; set; }
        public string MTC { get; set; }
        public string QacRemarks { get; set; }

    }
    public class SOItem
    {
        [Key]
        public int Sr { get; set; }
        public string Sono { get; set; }
        public int Sonodigit { get; set; }
        public string Pino { get; set; }
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
        public bool ReservationStatus { get; set; }
        public bool IndentStatus { get; set; }
        [NotMapped]
        public double IndentQty { get; set; }
        public string unitType { get; set; }


    }
    public class TempSOItem
    {
        [Key]
        public int Sr { get; set; }
        public string Sono { get; set; }
        public int Sonodigit { get; set; }
        public string Pino { get; set; }
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

    public class fetchSO
    {
        public string gst { get; set; }
        public string state { get; set; }
        public string city { get; set; }
        public string Companyid { get; set; }


    }

    public class StockReservation
    {
        [Key]
        public int id { get; set; }
        public string sono { get; set; }
        public DateTime rsdate { get; set; }
        public int Itemid { get; set; }
        public int pnameid { get; set; }
        public string Pname { get; set; }
        public int Psizeid { get; set; }
        public string Psize { get; set; }
        public int Pclassid { get; set; }
        public string Pclass { get; set; }
        public int Pmakeid { get; set; }
        public string Pmake { get; set; }
        public double qty { get; set; }
        public string qtyunit { get; set; }
        public double reservationqty { get; set; }
        public string reservationqtyunit { get; set; }
        public string companyid { get; set; }
        public string userid { get; set; }
        public double IndentQty { get; set; }
        public double stkQtyAftres { get; set; }
        public double balanceQty { get; set; }

        [NotMapped]
        public double despacthedQty { get; set; }




    }

}


