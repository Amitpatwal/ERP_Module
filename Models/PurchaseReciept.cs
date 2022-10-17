using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SALES_ERP.Models

{
    public class PRDetials
    {
        [Key]
        public int Sr { get; set; }
        public int PrNodigit { get; set; }
        public string PrNo { get; set; }
        public DateTime PrDate { get; set; }
        public string PoNo { get; set; }
        public DateTime PoDate { get; set; }
        public string PINo { get; set; }
        public DateTime PIDate { get; set; }   
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
        public double CraneLoadingWeightkg { get; set; }
        public double CraneLoadingWeightmt { get; set; }
        public double CraneCharge { get; set; }
        public double CraneTotalCharge { get; set; }



        public double ManualLoadingWeightkg { get; set; }
        public double ManualLoadingWeightmt{ get; set; }     
        public double ManualCharge { get; set; }
        public double ManualTotalCharge { get; set; }


        /*----------------------------Freight Database---------------------------------------*/


        public string FreightType { get; set; }
        public double FreightCharge { get; set; }
        public string Note { get; set; }
        public double ForwardingTransportAmount { get; set; }
        public string GrNO { get; set; }
        

        public bool status { get; set; }
        public string reason { get; set; }
        public string Companyid { get; set; }
        public string voucherType { get; set; }
        public double Amount { get; set; }


    }

    public class TempPRDetials
    {
        [Key]
        public int Sr { get; set; }
        public int PrNodigit { get; set; }
        public string PrNo { get; set; }
        public DateTime PrDate { get; set; }
        public string PoNo { get; set; }
        public DateTime PoDate { get; set; }
        public string PINo { get; set; }
        public DateTime PIDate { get; set; }
        public int SupplierCCode { get; set; }
        public string SupplierCompanyname { get; set; }
        public string SupplierAddress { get; set; }
        public string Userid { get; set; }


        /*------------------------Transport Database-------------------------------------------*/

        public int TransportCCode { get; set; }
        public string TransportName { get; set; }
        public string DriverName { get; set; }
        public string VechileNo { get; set; }
        public string Mobileno { get; set; }
        public string License { get; set; }
        public string UnloadingIncharge { get; set; }

        /*--------------------------Unloading Database-----------------------------------------*/

        public double CraneLoadingWeightkg { get; set; }
        public double CraneLoadingWeightmt { get; set; }
        public double CraneCharge { get; set; }
        public double CraneTotalCharge { get; set; }

        public string Contractor { get; set; }
        public int Contratorid { get; set; }


        public double ManualLoadingWeightkg { get; set; }
        public double ManualLoadingWeightmt { get; set; }
        public double ManualCharge { get; set; }
        public double ManualTotalCharge { get; set; }


        /*----------------------------Freight Database---------------------------------------*/

        public double ForwardingTransportAmount { get; set; }
        public string GrNO { get; set; }
        public string FreightType { get; set; }
        public double FreightCharge { get; set; }

        public string Note { get; set; }
        public double Amount { get; set; }
        public string Companyid { get; set; }

    }

    public class PurchaseRecievedItem
    {
        [Key]
        public int Sr { get; set; }
        public int PrNodigit { get; set; }
        public string PrNo { get; set; }
        public int Itemid { get; set; }
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
        public string Qtyunit { get; set; }
      
        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string UnloadedBy { get; set; }
        public string Companyid { get; set; }
        public string HeatNo { get; set; }

        public string VoucherType { get; set; }
        public int Pnameid { get; set; }
        public int Psizeid { get; set; }
        public int Pclassid { get; set; }
        public int Pmakeid { get; set; }
        public int Wharehouseid { get; set; }


        public double Price { get; set; }
        public string PriceUnit { get; set; }
        public string RateSelected { get; set; }





        public double TotalAmount { get; set; }
        public double PrAmount { get; set; }
        public double ScAmount { get; set; }
        public double WeightAmount { get; set; }

       

    }

    public class TempPurchaseRecievedItem
    {
        [Key]
        public int Sr { get; set; }
        public int PrNodigit { get; set; }
        public string PrNo { get; set; }
        public int Itemid { get; set; }
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
        public string Qtyunit { get; set; }

        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string UnloadedBy { get; set; }
        public string Companyid { get; set; }
        public string HeatNo { get; set; }
        public double TotalAmount { get; set; }


        public double Price { get; set; }
        public string PriceUnit { get; set; }
        public string RateSelected { get; set; }



        public double PrAmount { get; set; }
        public double ScAmount { get; set; }
        public double WeightAmount { get; set; }

    }

    public class PrReason
    {
        [Key]
        public int Sr { get; set; }
        public string Prno { get; set; }
        public DateTime Date { get; set; }
        public string Reason { get; set; }
        public string userid { get; set; }
        public string Remarks { get; set; }
        public string Companyid { get; set; }


    }

    public class Viewreport
    {
        public int Prnodigit { get; set; }
        public string prNo { get; set; }
        public DateTime prDate { get; set; }
        public string supplierCompanyname { get; set; }
        public string poNo { get; set; }
        public string piNo { get; set; }
        public string reason { get; set; }
        public string created { get; set; }
        public string rejected { get; set; }
        public string Companyid { get; set; }

    }




}
