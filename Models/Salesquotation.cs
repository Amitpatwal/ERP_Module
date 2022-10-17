using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace SALES_ERP.Models
{
    public class SalesqDetails
    {
        [Key]
        public int Sr { get; set; }
        public int Quotnodigit { get; set; }
        public string Quotno { get; set; }
        public string Unique { get; set; }
        public int Ccode { get; set; }
        public string Companyname { get; set; }
        public string Contactperson { get; set; }
        public string DealingPerson { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime Date { get; set; }
        public DateTime Enqdate { get; set; }
        public string Enqno { get; set; }
        public string Remarks { get; set; }
        public double Amount { get; set; }
        public string Userid { get; set; }
        public string Companyid { get; set; }
        public string Category { get; set; }
        [NotMapped]
        public bool pistatus { get; set; }
        [NotMapped]
        public DateTime logdate { get; set; }
        [NotMapped]
        public string pino { get; set; }

    }
    public class QuotationItem
    {
        [Key]
        public int Sr { get; set; }
        public int Quotnodigit { get; set; }
        public string Quotno { get; set; }
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
    public class TempSalesqDetails
    {
        [Key]
        public int sr { get; set; }
        public int Quotnodigit { get; set; }
        public string Quotno { get; set; }
        public string Unique { get; set; }
        public int Ccode{get; set;}
        public string Remarks { get; set; }
        public string Companyname { get; set; }
        public string Contactperson { get; set; }
        public string DealingPerson { get; set; }
        
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime Date { get; set; }
        public DateTime Enqdate { get; set; }
        public string Enqno { get; set; }
        public double Amount { get; set; }
        public string Userid { get; set; }
        public string Companyid { get; set; }

    }
    public class TempQuotationItem
    {
        [Key]
        public int Sr { get; set; }
        public int Quotnodigit { get; set; }
        public string Quotno { get; set; }
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
        public string Userid { get; set; }
        public string unitType { get; set; }

    }

    public class Conditions
    {
        [Key]
        public int Sr { get; set; }
        public int Conditionno { get; set; }
        public int Id { get; set; }
        public string Condition { get; set; }
        public bool Defaultcondition { get; set; }
        public string Companyid { get; set; }

    }
    public class Quotationcondition
    {
        [Key]
        public int Sr { get; set; }
        public int Id { get; set; }
        public string Quotno { get; set; }
        public int Conditionno { get; set; }
        public int Quotnodigit { get; set; }
        public string Companyid { get; set; }

    }

    public class Conditionn
    {
        public string Quotno { get; set; }
        public List<int> Conditionno { get; set; }
        public int Quotnodigit { get; set; }
        public string Companyid { get; set; }

    }
    public class QuotationItem1
    {
        [Key]
        public int Sr { get; set; }
        public int Quotnodigit { get; set; }
        public string Quotno { get; set; }
        public int Itemid { get; set; }
        public string Hashpname { get; set; }
        public string Pname { get; set; }
        public int Pnameid { get; set; }
        public string Altpname { get; set; }
        public string Psize { get; set; }
        public int Psizeid { get; set; }
        public string Altpsize { get; set; }
        public string Pclass { get; set; }
        public int Pclassid { get; set; }
        public string Altpclass { get; set; }
        public int wharehouseid { get; set; }
        public String wharehouse { get; set; }
        public string Pmake { get; set; }
        public int Pmakeid { get; set; }
        public string Pcategory { get; set; }
        public string Rateunit { get; set; }
        public int unitid { get; set; }

        public double Rate { get; set; }
        public string RateSelected { get; set; }
        public double Discount { get; set; }
        public double Discountrate { get; set; }
        public double Qty { get; set; }
        public string Qtyunit { get; set; }
        public double Amount { get; set; }
        public string Hsncode { get; set; }
        public string Remarks { get; set; }
        public double AltQty { get; set; }
        public double ItemWeight { get; set; }
        public string ItemWeightUnit { get; set; }
        public string AltQtyunit { get; set; }
        public string Unloadedby { get; set; }
        public double orderqty { get; set; }
        public double despatchqty { get; set; }
        public double balanceqty { get; set; }
        public double prAmount { get; set; }
        public double scAmount { get; set; }
        public double weightAmount { get; set; }




        public string unitType { get; set; }
        public string Companyid { get; set; }


    }
    public class itemname
    {
        public int id { get; set; }
        public string desc { get; set; }
        public string Companyid { get; set; }
        public string unitType { get; set; }

    }

    
    public class printcondition
    {
        [Key]
        public int Sr { get; set; }
        public string qtno { get; set; }
        public string c1 { get; set; }
        public string c2 { get; set; }
        public string c3 { get; set; }
        public string c4 { get; set; }
        public string c5 { get; set; }
        public string c6 { get; set; }
        public string c7 { get; set; }
        public string companyid { get; set; }
        public string userid { get; set; }


    }

}
