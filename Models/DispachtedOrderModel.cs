using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SALES_ERP.Models
{
    public class DODetials
    {
        [Key]
        public int Sr { get; set; }
        public string Dpno { get; set; }
        public string OldDoNo { get; set; }
        public int DoNodigit { get; set; }
        public string DoNo { get; set; }
        public DateTime DoDate { get; set; }
        public string PoNo { get; set; }
        public DateTime PoDate { get; set; }
        public string SoNo { get; set; }
        public DateTime SODate { get; set; }
        public int SupplierCCode { get; set; }
        public string SupplierCompanyname { get; set; }
        public string SupplierAddress { get; set; }
      


        /*------------------------Transport Database-------------------------------------------*/

        public int TransportCCode { get; set; }
        public string TransportName { get; set; }
        public string DriverName { get; set; }
        public string Mobileno { get; set; }
        public string VechileNo { get; set; }
        public string License { get; set; }
        public string UnloadingIncharge { get; set; }

        /*--------------------------Unloading Database-----------------------------------------*/


        public string Contractor { get; set; }
        public int Contratorid { get; set; }
        public string ManualContractor { get; set; }
        public int ManualContratorid { get; set; }
        public double CraneLoadingWeightkg { get; set; }
        public double CraneLoadingWeightmt { get; set; }
        public double CraneCharge { get; set; }
        public double CraneTotalCharge { get; set; }



        public double ManualLoadingWeightkg { get; set; }
        public double ManualLoadingWeightmt { get; set; }
        public double ManualCharge { get; set; }
        public double ManualTotalCharge { get; set; }


        /*----------------------------Freight Database---------------------------------------*/
        public string FreightType { get; set; }
        public double FreightCharge { get; set; }
        public double ForwardingTransportAmount { get; set; }
        public string GrNO { get; set; }
        public string Note { get; set; }

        public bool status { get; set; }
        public string reason { get; set; }
        public string Companyid { get; set; }

        public string Userid { get; set; }
        public DateTime ReservationTime { get; set; }
        public bool ReservedStatus { get; set; }
        public string VoucherType { get; set; }

    }

    public class TempDODetials
    {
        [Key]
        public int Sr { get; set; }
        public string Dpno { get; set; }
        public int DoNodigit { get; set; }
        public string DoNo { get; set; }
        public string OldDoNo { get; set; }
        public DateTime DoDate { get; set; }
        public string PoNo { get; set; }
        public DateTime PoDate { get; set; }
        public string SoNo { get; set; }
        public DateTime SODate { get; set; }
        public int SupplierCCode { get; set; }
        public string SupplierCompanyname { get; set; }
        public string SupplierAddress { get; set; }
        public string Userid { get; set; }

        /*------------------------Transport Database-------------------------------------------*/

        public int TransportCCode { get; set; }
        public string TransportName { get; set; }
        public string DriverName { get; set; }
        public string Mobileno { get; set; }
        public string VechileNo { get; set; }
        public string License { get; set; }
        public string UnloadingIncharge { get; set; }

        /*--------------------------Unloading Database-----------------------------------------*/

        public string Contractor { get; set; }
        public int Contratorid { get; set; }
        public string ManualContractor { get; set; }
        public int ManualContratorid { get; set; }
        public double CraneLoadingWeightkg { get; set; }
        public double CraneLoadingWeightmt { get; set; }
        public double CraneCharge { get; set; }
        public double CraneTotalCharge { get; set; }

        public double ManualLoadingWeightkg { get; set; }
        public double ManualLoadingWeightmt { get; set; }
        public double ManualCharge { get; set; }
        public double ManualTotalCharge { get; set; }


        /*----------------------------Freight Database---------------------------------------*/


        public string FreightType { get; set; }
        public double FreightCharge { get; set; }
        public double ForwardingTransportAmount { get; set; }
        public string GrNO { get; set; }
        public string Note { get; set; }

        public bool status { get; set; }
        public string reason { get; set; }
        public string Companyid { get; set; }
        public DateTime ReservationTime { get; set; }
        public bool ReservedStatus { get; set; }
    }

    public class DOItem
    {
        [Key]
        public int Sr { get; set; }
        public int DoNodigit { get; set; }
        public string DoNo { get; set; }
        public int Itemid { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public string Altpname { get; set; }
        public string Psize { get; set; }
        public string Altpsize { get; set; }
        public string Pclass { get; set; }
        public string Altpclass { get; set; }
        public string Pmake { get; set; }
        public double orderqty { get; set; }
        public string orderunit { get; set; }
        public double Qty { get; set; }
        public string Qtyunit { get; set; }
        public double Balanceqty { get; set; }
        public string Balanceunit { get; set; }
        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string Companyid { get; set; }
       
    }

    public class TempDOItem
    {
        [Key]
        public int Sr { get; set; }
        public int DoNodigit { get; set; }
        public string DoNo { get; set; }
        public int Itemid { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public string Altpname { get; set; }
        public string Psize { get; set; }
        public string Altpsize { get; set; }
        public string Pclass { get; set; }
        public string Altpclass { get; set; }
        public string Pmake { get; set; }
        public double orderqty { get; set; }
        public double Qty { get; set; }
        public string Qtyunit { get; set; }
        public double Balanceqty { get; set; }
        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string Companyid { get; set; }

    }

    public class DOReason
    {
        [Key]
        public int Sr { get; set; }
        public string Dono { get; set; }
        public DateTime Date { get; set; }
        public string Reason { get; set; }
        public string userid { get; set; }
        public string Remarks { get; set; }
        public string Companyid { get; set; }


    }

    public class DOViewreport
    {
        public int Donodigit { get; set; }
        public string doNo { get; set; }
        public DateTime doDate { get; set; }
        public string supplierCompanyname { get; set; }
        public string poNo { get; set; }
        public string piNo { get; set; }

        public string created { get; set; }
        public string rejected { get; set; }
        public string Companyid { get; set; }
        [NotMapped]
        public bool lostatus { get; set; }
        public string lostatuss { get; set; }

    }

    public class DODespatchItem
    {
            [Key]
            public int Sr { get; set; }
        public int SrNo { get; set; }
        public int DoNodigit { get; set; }
            public string DoNo { get; set; }
            public int Itemid { get; set; }
            public int itemsrno { get; set; }
            public string Hashpname { get; set; }
            public string Pname { get; set; }
            public string Altpname { get; set; }
            public string Psize { get; set; }
            public string Altpsize { get; set; }
            public string Pclass { get; set; }
            public string Altpclass { get; set; }
            public string Pmake { get; set; }
            public string Wharehouse { get; set; }
            public double Qty { get; set; }
            public double DespQty { get; set; }
            public string Qtyunit { get; set; }
            public double AltQty { get; set; }
            public string AltQtyunit { get; set; }
            public double ItemWeight { get; set; }
            public string ItemWeightUnit { get; set; }
            public string UnloadedBy { get; set; }
        public string HeatNumber { get; set; }
        public string Companyid { get; set; }
        public string VoucherType { get; set; }
        public int Pnameid { get; set; }
        public int Psizeid { get; set; }
        public int Pclassid { get; set; }
        public int Pmakeid { get; set; }
        public int Wharehouseid { get; set; }

    }

    public class TempDODespatchItem
    {
        [Key]
        public int Sr { get; set; }
        public int SrNo { get; set; }
        public int DoNodigit { get; set; }
        public string DoNo { get; set; }
        public int Itemid { get; set; }
        public int itemsrno { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public string Altpname { get; set; }
        public string Psize { get; set; }
        public string Altpsize { get; set; }
        public string Pclass { get; set; }
        public string Altpclass { get; set; }
        public string Pmake { get; set; }
        public string Wharehouse { get; set; }
        public double Qty { get; set; }
        public double DespQty { get; set; }
        public string Qtyunit { get; set; }
        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string HeatNumber { get; set; }
        public string UnloadedBy { get; set; }
        public string Companyid { get; set; }

    }

    public class currentstock
    {
        public string dono { get; set; }
        public int itemid { get; set; }
        public int itemsrno { get; set; }
        public int donodigit { get; set; }
        public string Pname { get; set; }
        public string Psize { get; set; }
        public string Pclass { get; set; }
        public string Pmake { get; set; }
        public string GodownLocation { get; set; }
        public DateTime ddate { get; set; }
        public string Companyid { get; set; }
    }


    public class rejectedTable
    {
        public string Dono { get; set; }
        public DateTime DoDate { get; set; }
        public int donodigit { get; set; }
        public string CustomerName { get; set; }
        public string PoNo { get; set; }
        public string CreatedBy { get; set; }
        public string RejectedBY { get; set; }
        public string RejectedReason { get; set; }
        
    }


}
