using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Models
{
    public class DispatchedDetail
    {
        [Key]
        public int Sr { get; set; }
        public int DPNodigit { get; set; }
        public string DPNo { get; set; }
        public DateTime DPDate { get; set; }
        public string PONO { get; set; }
        public string SONO { get; set; }
        public string CustomerName { get; set; }
        public int Customerid { get; set; }
        public string SupplierName { get; set; }
        public int SupplierId { get; set; }
        public string DispachtedLocation { get; set; }
        public string Incharge { get; set; }
        public string Status { get; set; }
        public string HoldReason { get; set; }
        public string Remarks { get; set; }
        public double amount { get; set; }
        public string dono { get; set; }
        public string Fromm { get; set; }
        public bool dpstatus { get; set; }
        public string Companyid { get; set; }
        [NotMapped]
        public string deliveryaddress { get; set; }
        [NotMapped]
        public bool lostatus { get; set; }


    }

    public class dp
    {
        public int Sr { get; set; }
        public int DPNodigit { get; set; }
        public string DPNo { get; set; }
        public DateTime DPDate { get; set; }
        public DateTime SODate { get; set; }
        public DateTime PODate { get; set; }
        public string PONO { get; set; }
        public string SONO { get; set; }
        public string CustomerName { get; set; }
        public int Customerid { get; set; }
        public string SupplierName { get; set; }
        public int SupplierId { get; set; }
        public string DispachtedLocation { get; set; }
        public string Incharge { get; set; }
        public bool Status { get; set; }
        public string HoldReason { get; set; }
        public string Remarks { get; set; }
        public double Amount { get; set; }
        public string Companyid { get; set; }
        
        public DateTime dldate { get; set; }
        public string destination { get; set; }
        public string materialsource { get; set; }
        public string orderstatus { get; set; }
    }

    public class DispatchMaterial
    {
        [Key]
        public int Sr { get; set; }
        public string Sono { get; set; }
        public string DPNO { get; set; }
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
        public bool status { get; set; }
        public string Companyid { get; set; }
    }

    public class HoldMaterial
    {
        [Key]
        public int Sr { get; set; }
        public string Sono { get; set; }
        public string DPNO { get; set; }
        public int Itemid { get; set; }
        public DateTime date { get; set; }
        public string DONO { get; set; }
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
        public bool status { get; set; }
        public string Companyid { get; set; }
        [NotMapped]
        public string companyname { get; set; } 
        [NotMapped]
        public string pono { get; set; }
    }

    public class counters
    {
        public int saleorder { get; set; }
        public int dailyplanning { get; set; }
        public int waiting { get; set; }
        public int holdorder { get; set; }
        public int cancelled { get; set; }
        public int pendingMaterial { get; set; }
        public string Companyid { get; set; }
    }

    public class DispatchReservation
    {
        [Key]
        public int Sr { get; set; }
        public string Sono { get; set; }
        public int Itemid { get; set; }
        public string Pname { get; set; }
        public string Psize { get; set; }
        public string Pclass { get; set; }
        public string Pmake { get; set; }
        public string Pcategory { get; set; }
        public string Rateunit { get; set; }
        public double Rate { get; set; }
        public double Discount { get; set; }
        public double Discountrate { get; set; }
        public double Qty { get; set; }
        public string Qtyunit { get; set; }
        public double despacthedQty { get; set; }
        public string despacthedQtyUnit { get; set; }
        public double IndentQty { get; set;}
        public string IndentQtyUnit { get; set;}
        public double Amount { get; set;}
        public string Companyid { get; set; }
    }
}
