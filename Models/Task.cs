using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace SALES_ERP.Models
{
    public class SendTask
    {
        [Key]
        public int sr { get; set; }
        public string receivername { get; set; }
        public int receivercode { get; set; }
        public string sendername { get; set; }
        public int sendercode { get; set; }
        public DateTime startingdate { get; set; }
        public DateTime deadlinedate { get; set; }
        public DateTime currentDate { get; set; }
        public string message { get; set; }
        public string tasktitle { get; set; }

        [NotMapped]
        public List<IFormFile> Name1 { get; set; }
        public string URL { get; set; }
        public string filename { get; set; }
        public int TaskId { get; set; }
        public int TaskIdSr { get; set; }
        public bool Status { get; set; }
        public bool isReceived { get; set; }
    }
    public class tasklist
    {
        public string username { get; set; }
        public int completedTask { get; set; }
        public int PendingTask { get; set; }
        public int usreid { get; set; }


    }

    public class Chat
    {
        [Key]
        public int id { get; set; }
        public int Taskid { get; set; }
        public string message { get; set; }
        public DateTime date { get; set; }
        public string type { get; set; }
        public int Taskidsr { get; set; }
        public string sendername { get; set; }
        public int senderid { get; set; }

        [NotMapped]
        public List<IFormFile> Name1 { get; set; }
        public string filename { get; set; }
        public string orginalName { get; set; }
        [NotMapped]
        public string url { get; set; }

        public bool isReceived { get; set; }

        [NotMapped]
        public string imageurl { get; set; }

    }

    public class counters1
    {
        public int completed { get; set; }
        public int daily { get; set; }
        public int pending { get; set; }
        public int totalbyme { get; set; }
        public int completedbyme { get; set; }
        public int dailybyme { get; set; }
        public int pendingbyme { get; set; }
        public int total { get; set; }
        public int closeReqByMe { get; set; }
        public int closeReqByOther { get; set; }
        public int closeReqMY { get; set; }

    }

    public class Messages
    {
        [Key]
        public int id { get; set; }
        public int Chatid { get; set; }
        public string message { get; set; }
        public DateTime date { get; set; }
        public string type { get; set; }

        public string sendername { get; set; }

    }


}
