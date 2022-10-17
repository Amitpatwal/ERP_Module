using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SALES_ERP.Models
{
    public class LODetials
    {
        [Key]
        public int Sr { get; set; }
        public string Dpno { get; set; }
        public string OldDoNo { get; set; }
        public int LoNodigit { get; set; }
        public string Lono { get; set; }
        public DateTime LoDate { get; set; }
        public int CompanyCode { get; set; }
        public string Companyname { get; set; }
        public string Address { get; set; }
        public string Userid { get; set; }
        public int TransportCCode { get; set; }
        public string TransportName { get; set; }
        public string DriverName { get; set; }
        public string Mobileno { get; set; }
        public string VechileNo { get; set; }
        public string License { get; set; }
        public string UnloadingIncharge { get; set; }
        public string Companyid { get; set; }
        public string Note { get; set; }

    }

    public class LOItem
    {
        [Key]
        public int Sr { get; set; }
        public int LoNodigit { get; set; }
        public string LoNo { get; set; }
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
        public double MTRQTy { get; set; }
        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string MaterialSource { get; set; }
        public string Companyid { get; set; }
        [NotMapped]
        public int sourceid { get; set; }
    }

    public class tempLODetials
    {
        [Key]
        public int Sr { get; set; }
        public string Dpno { get; set; }
        public int LoNodigit { get; set; }
        public string Lono { get; set; }
        public string OldDoNo { get; set; }
        public DateTime LoDate { get; set; }
        public int CompanyCode { get; set; }
        public string Companyname { get; set; }
        public string Address { get; set; }
        public string Userid { get; set; }
        public int TransportCCode { get; set; }
        public string TransportName { get; set; }
        public string DriverName { get; set; }
        public string Mobileno { get; set; }
        public string VechileNo { get; set; }
        public string License { get; set; }
        public string UnloadingIncharge { get; set; }
        public string Companyid { get; set; }
        public string Note { get; set; }

    }

    public class tempLOItem
    {
        [Key]
        public int Sr { get; set; }
        public int LoNodigit { get; set; }
        public int Pnameid { get; set; }
        public int Psizeid { get; set; }
        public int Pclassid { get; set; }
        public int Pmakeid { get; set; }
        public string LoNo { get; set; }
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
        public double MTRQTy { get; set; }
        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string MaterialSource { get; set; }
        public string Companyid { get; set; }
        [NotMapped]
        public int sourceid { get; set; }
    }

    public class tempLODesPatchItem
    {
        [Key]
        public int Sr { get; set; }
        public int LoNodigit { get; set; }
        public int Pnameid { get; set; }
        public int Psizeid { get; set; }
        public int Pclassid { get; set; }
        public int Pmakeid { get; set; }
        public string LoNo { get; set; }
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
        public double MTRQTy { get; set; }
        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string MaterialSource { get; set; }
        public string Companyid { get; set; }
        [NotMapped]
        public int sourceid { get; set; }
    }

    public class LODesPatchItem
    {
        [Key]
        public int Sr { get; set; }
        public int LoNodigit { get; set; }
        public int Pnameid { get; set; }
        public int Psizeid { get; set; }
        public int Pclassid { get; set; }
        public int Pmakeid { get; set; }
        public string LoNo { get; set; }
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
        public double MTRQTy { get; set; }
        public double AltQty { get; set; }
        public string AltQtyunit { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string MaterialSource { get; set; }
        public string Companyid { get; set; }
        [NotMapped]
        public int sourceid { get; set; }
    }

}
