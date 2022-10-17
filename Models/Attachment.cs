using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace SALES_ERP.Models
{
    public class Attachment
    {
        [Key]
        public int Sr { get; set; }
        public string companyid { get; set; }
        public string vouchername { get; set; }
        
        [NotMapped]
        public List<IFormFile> Name1 { get; set; }
        public string voucherno { get; set; }
        public string filename { get; set; }
        public DateTime Date { get; set; }
        public string URL { get; set; }


    }
    public class Filepath
    {
        [Key]
        public int Sr { get; set; }
        public string companyid { get; set; }
        public string vouchername { get; set; }
        public string filepathh { get; set; }

    }

   

}
