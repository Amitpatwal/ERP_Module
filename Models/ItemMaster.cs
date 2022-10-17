using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace SALES_ERP.Models
{
    public class Productname
    {
        [Key]
        public int id { get; set; }
        public string productname { get; set; }
        public string Companyid { get; set; }

    }
    public class Productsize
    {
        [Key]
        public int id { get; set; }
        public string productsize { get; set; }
        public string Companyid { get; set; }

    }
    public class Productclass
    {
        [Key]
        public int id { get; set; }
        public string productclass { get; set; }
        public string Companyid { get; set; }

    }
    public class Productmake
    {
        [Key]
        public int id { get; set; }
        public string productmake { get; set; }
        public string Companyid { get; set; }

    }
    public class Productunit
    {
        [Key]
        public int id { get; set; }
        public string productunit { get; set; }
        public string Companyid { get; set; }

    }
    public class Productcategory
    {
        [Key]
        public int id { get; set; }
        public string productcategory { get; set; }
        public string Companyid { get; set; }
        public string unit { get; set; }
        public int unitid { get; set; }
        public string altunit { get; set; }
        public int altunitid { get; set; }
        public string weightunit { get; set; }
        public string physicalstock { get; set; }
    }
    public class Godownname
    {
        [Key]
        public int id { get; set; }
        public string godownName { get; set; }
        public string Companyid { get; set; }
        public string location { get; set; }
    }
    public class namelist
    {
        public int id { get; set; }
        public string desc { get; set; }
        public string type { get; set; }
        public string Companyid { get; set; }
        public string location { get; set; }
    }
    public class ItemMaster
    {
        [Key]
        public int ItemId { get; set; }
        public DateTime creationdate { get; set; }
        public string pname { get; set; }
        public int pnameid { get; set; }
        public string size { get; set; }
        public int sizeid { get; set; }
        public string Class { get; set; }
        public int classid { get; set; }
        public string unit { get; set; }
        public int unitid { get; set; }
        public string altunit { get; set; }
        public int altunitid { get; set; }
        public string category { get; set; }
        public int categoryid { get; set; }
        public string hsncode { get; set; }
        public double weight { get; set; }
        public string weightunit { get; set; }
        public int weightunitid { get; set; }
        public double opening { get; set; }
        public DateTime openingdate { get; set; }
        public double where { get; set; }
        public double from { get; set; }
        public bool enableweight { get; set; }
        public bool enableunit { get; set; }
        public double price { get; set; }
        public bool EnableLowStock { get; set; }
        public bool chooseWarningUnit { get; set; }
        public double Lowstock { get; set; }
        public string LowstockUnit { get; set; }
        public int LowstockUnitID { get; set; }
        public double MaxStock { get; set; }
        public string maximumStockUnit { get; set; }
        public int maximumStockUnitId { get; set; }
        public string Companyid { get; set; }

        [NotMapped]
        public string type { get; set; }

    }

    public class OpeningStock
    {
        [Key]
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemBrand { get; set; }
        public string GodownLocation { get; set; }
        public double qty { get; set; }
        public double altQty { get; set; }
        public string Companyid { get; set; }
        [NotMapped]
        public int brandid { get; set; }
        [NotMapped]
        public int locationid { get; set; }

    }

    public class TempOpeningStock
    {
        [Key]
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemBrand { get; set; }
        public string GodownLocation { get; set; }
        public double qty { get; set; }
        public double altQty { get; set; }
        public string user { get; set; }
        public string Companyid { get; set; }

    }

    public class OpeningStockReport
    {
        public int id { get; set; }

        public string pname { get; set; }
        public string psize { get; set; }
        public string pclass { get; set; }
        public string pmake { get; set; }
        public string pmake1 { get; set; }
        public string unit { get; set; }
        public string altunit { get; set; }
        public double qty { get; set; }
        public double altqty { get; set; }
        public string unit1 { get; set; }
        public string altunit1 { get; set; }
        public double qty1 { get; set; }
        public double altqty1 { get; set; }
        public string location { get; set; }
        public string userid { get; set; }
        public string Companyid { get; set; }
        public DateTime sdate { get; set; }
        public DateTime ddate { get; set; }
        [NotMapped]
        public int sizeid { get; set; }
        [NotMapped]
        public int sr { get; set; }
        [NotMapped]
        public int classid { get; set; }
        [NotMapped]
        public int makeid { get; set; }
        [NotMapped]
        public double weight { get; set; }
        [NotMapped]
        public string category { get; set; } 
        [NotMapped]
        public double status { get; set; }



    }
    public class MonthWiseStockReport
    {
        public int id { get; set; }
        public DateTime date { get; set; }
        public string description { get; set; }
        public string vchtype { get; set; }
        public string vchno { get; set; }
        public double inqty { get; set; }
        public double outqty { get; set; }
        public double balqty { get; set; }
        public double inaltqty { get; set; }
        public double outaltqty { get; set; }
        public double balaltqty { get; set; }
        public string unit { get; set; }
        public string altunit { get; set; }
        public int year { get; set; }
        public int month { get; set; }
        public string monthname { get; set; }
    }
    public class GeneralEntry
    {
        [Key]
        public int sr { get; set; }
        public string voucherno { get; set; }
        public int vouchernodigit { get; set; }
        public string vouchertype { get; set; }
        public string Companyid { get; set; }
       

    }

    public class MaterialShift
    {
        [Key]
     
        public DateTime voucherDate { get; set; }
        public string voucherno { get; set; }
        public string pname { get; set; }
        public int pnameid { get; set; }
        public string size { get; set; }
        public int sizeid { get; set; }
        public string Class { get; set; }
        public int classid { get; set; }
        public string make { get; set; }
        public int makeid { get; set; }
        public string frmWhareHouse { get; set; }
        public int frmWhareHouseid { get; set; }
        public string toWhareHouse { get; set; }
        public int toWhareHouseid { get; set; }
        public double Qty { get; set; }
        public string QtyUnit { get; set; }
        public double AltQty { get; set; }
        public string AltQtyUnit { get; set; }
        public string Username { get; set; }


    }
    public class stkk
    {
        public string pname { get; set; }
        public string psize { get; set; }
        public string pclass { get; set; }
        public string pmake { get; set; }
        public string unit { get; set; }
        public string altunit { get; set; }
        public double qty1 { get; set; }
        public double AltQty1 { get; set; }
        public double weight1 { get; set; }
        public double qty2 { get; set; }
        public double AltQty2 { get; set; }
        public double weight2 { get; set; }
        public double qty3 { get; set; }
        public double AltQty3 { get; set; }
        public double weight3 { get; set; }
        public double qty4 { get; set; }
        public double AltQty4 { get; set; }
        public double weight4 { get; set; }
        public double qty5 { get; set; }
        public double AltQty5 { get; set; }
        public double weight5 { get; set; }
        public double qty6 { get; set; }
        public double AltQty6 { get; set; }
        public double weight6 { get; set; }
        public double qty7 { get; set; }
        public double AltQty7 { get; set; }
        public double weight7 { get; set; }
        public double qty8 { get; set; }
        public double AltQty8 { get; set; }
        public double weight8 { get; set; }
        public double qty9 { get; set; }
        public double AltQty9 { get; set; }
        public double weight9 { get; set; }
        public double qty10 { get; set; }
        public double AltQty10 { get; set; }
        public double weight10 { get; set; }
        public double Totalqty { get; set; }
        public double TotalAltQty { get; set; }
        public double Totalweight { get; set; }
    }
}
