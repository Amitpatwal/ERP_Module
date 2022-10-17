using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace SALES_ERP.Models
{
    public class MaterialShiftingDetails
    {
        [Key]
        public int Sr { get; set; }
        public int msnodigit { get; set; }
        public string msno { get; set; }
        public string Unique { get; set; }
        public DateTime Date { get; set; }
        public string loadingInchrage { get; set; }
        public string transportName { get; set; }
        public string driverName { get; set; }
        public string vechileno { get; set; }
        public string remarks { get; set; }
        public string userid { get; set; }
        public string companyid { get; set; }
        public string status { get; set; }

    }
    public class TempMaterialShiftingDetails
    {
        [Key]
        public int Sr { get; set; }
        public int msnodigit { get; set; }
        public string msno { get; set; }
        public string Unique { get; set; }
        public DateTime Date { get; set; }
        public string loadingInchrage { get; set; }
        public string transportName { get; set; }
        public string driverName { get; set; }
        public string vechileno { get; set; }
        public string remarks { get; set; }
        public string userid { get; set; }
        public string companyid { get; set; }
        public string status { get; set; }

    }
    public class TempItem
    {
        [Key]
        public int Sr { get; set; }
        public int msnodigit { get; set; }
        public string msno { get; set; }
        public int Itemid { get; set; }
        public string Pname { get; set; }
        public string Psize { get; set; }
        public string Pclass { get; set; }
        public string Pmake { get; set; }
        public string fromGodown { get; set; }
        public string toGodown { get; set; }
        public double qty { get; set; }
        public string qtyUnit { get; set; }
        public double altqty { get; set; }
        public string altqtyUnit { get; set; }
        public string userid { get; set; }
        public string companyid { get; set; }
    

    }

    public class MaterialShiftinngItem
    {
        [Key]
        public int Sr { get; set; }
        public int msnodigit { get; set; }
        public string msno { get; set; }
        public int Itemid { get; set; }
        public string Pname { get; set; }
        public string Psize { get; set; }
        public string Pclass { get; set; }
        public string Pmake { get; set; }
        public string fromGodown { get; set; }
        public string toGodown { get; set; }
        public double qty { get; set; }
        public string qtyUnit { get; set; }
        public double altqty { get; set; }
        public string altqtyUnit { get; set; }
        public string userid { get; set; }
        public string companyid { get; set; }


    }
}
