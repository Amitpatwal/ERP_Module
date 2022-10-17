using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SALES_ERP.Models
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {

        }
        public DbSet<TempSalesqDetails> TempSalesqDetails { get; set; }
        public DbSet<TempQuotationItem> TempQuotationItem { get; set; }
        public DbSet<OpeningStockReport> OpeningStockReport { get; set; }
        public DbSet<SalesqDetails> SalesqDetails { get; set; }
        public DbSet<Temppidata> Temppidata { get; set; }
        public DbSet<TempPiQuotationItem> TempPiQuotationItem { get; set; }
        public DbSet<QuotationItem> QuotationItem { get; set; }
        public DbSet<PIQuotationItem> PIQuotationItem { get; set; }
        public DbSet<printcondition> printcondition { get; set; }
        public DbSet<ItemMaster> ItemMaster { get; set; }

        public DbSet<OpeningStock> OpeningStock { get; set; }
        public DbSet<TempOpeningStock> TempOpeningStock { get; set; }

        public DbSet<Admin> Admin { get; set; }
        public DbSet<PriceListModel> PriceListModel { get; set; }
        public DbSet<PricelistMake> PricelistMake { get; set; }
        public DbSet<PIdetails> PIdetails { get; set; }
        public DbSet<user> user { get; set; }
        public DbSet<RoleName> RoleName { get; set; }
        public DbSet<userrights> userrights { get; set; }
        public DbSet<CompanyProfile> CompanyProfile { get; set; }
        public DbSet<CustomerData> CustomerData { get; set; }
        public DbSet<OpeningBalance> OpeningBalance { get; set; }
        public DbSet<Productname> Productname { get; set; }
        public DbSet<Productsize> Productsize { get; set; }
        public DbSet<Productclass> Productclass { get; set; }
        public DbSet<Productmake> Productmake { get; set; }
        public DbSet<Productunit> Productunit { get; set; }
        public DbSet<Productcategory> Productcategory { get; set; }
        public DbSet<Godownname> Godownname { get; set; }
        public DbSet<Conditions> Conditions { get; set; }
        public DbSet<Quotationcondition> Quotationcondition { get; set; }


        //............PO DATABASE...........................
        public DbSet<PODetials> PODetials { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItem { get; set; }
        public DbSet<TempPODetials> TempPODetials { get; set; }
        public DbSet<TempPurchaseOrderItem> TempPurchaseOrderItem { get; set; }



        //............PR DATABASE...........................

        public DbSet<PRDetials> PRDetials { get; set; }
        public DbSet<TempPRDetials> TempPRDetials { get; set; }
        public DbSet<PurchaseRecievedItem> PurchaseRecievedItem { get; set; }
        public DbSet<TempPurchaseRecievedItem> TempPurchaseRecievedItem { get; set; }


        public DbSet<PrReason> PrReason { get; set; }


        //............SO DATABASE...........................

        public DbSet<SOdetails> SOdetails { get; set; }
        public DbSet<TempSOdetails> TempSOdetails { get; set; }
        public DbSet<SOItem> SOItem { get; set; }
        public DbSet<TempSOItem> TempSOItem { get; set; }


        //............PREFIX DATABASE...........................
        public DbSet<Prefix> Prefix { get; set; }


        //............BANK DATABASE...........................
        public DbSet<Bank> Bank { get; set; }




        //............Dispachted Planning DATABASE............

        public DbSet<DispatchedDetail> DispatchedDetail { get; set; }
        public DbSet<DispatchMaterial> DispatchMaterial { get; set; }
        public DbSet<HoldMaterial> HoldMaterial { get; set; }



        //............DISPACHTED ORDER DATABASE............

        public DbSet<DODetials> DODetials { get; set; }
        public DbSet<TempDODetials> TempDODetials { get; set; }
        public DbSet<DOItem> DOItem { get; set; }
        public DbSet<TempDOItem> TempDOItem { get; set; }
        public DbSet<DOReason> DOReason { get; set; }
        public DbSet<DODespatchItem> DODespatchItem { get; set; }
        public DbSet<TempDODespatchItem> TempDODespatchItem { get; set; }
        public DbSet<companypermission> companypermission { get; set; }


        //...........ATTACHMENTS............
        public DbSet<Attachment> Attachment { get; set; }
        public DbSet<Filepath> Filepath { get; set; }
        public DbSet<SendTask> SendTask { get; set; }

        //............DISPACHTED ORDER LOAD DATABASE............
        public DbSet<LODetials> LODetials { get; set; }
        public DbSet<LOItem> LOItem { get; set; }
        public DbSet<tempLODetials> tempLODetials { get; set; }
        public DbSet<tempLOItem> tempLOItem { get; set; }

        public DbSet<Chat> Chat { get; set; }
        public DbSet<Logs> Logs { get; set; }
        public DbSet<GeneralEntry> GeneralEntry { get; set; }

        public DbSet<tempLODesPatchItem> tempLODesPatchItem { get; set; }
        public DbSet<LODesPatchItem> LODesPatchItem { get; set; }


        //..............VOUCHER...........................
        public DbSet<Sale> Sale { get; set; }
        public DbSet<Purchase> Purchase { get; set; }
        public DbSet<DebitCreditNote> DebitCreditNote { get; set; }
        public DbSet<DebitCreditRefrence> DebitCreditRefrence { get; set; }
        public DbSet<PaymentReceiptReference> PaymentReceiptReference { get; set; }
        public DbSet<PaymentReceipt> PaymentReceipt { get; set; }

        //..............PhysicalStock...........................

        public DbSet<PhysicalStock> PhysicalStock { get; set; }


        //..............StockReservation...........................

        public DbSet<StockReservation> StockReservation { get; set; }
        public DbSet<DispatchReservation> DispatchReservation { get; set; }

        //..............INVOICE...........................

        public DbSet<InvoiceDetails> InvoiceDetails { get; set; }
        public DbSet<TempInvoiceDetails> TempInvoiceDetails { get; set; }
        public DbSet<InvoiceItem> InvoiceItem { get; set; }
        public DbSet<TempInvoiceItem> TempInvoiceItem { get; set; }


        //..............MATERIAL SHIFTING...........................

        public DbSet<MaterialShiftingDetails> MaterialShiftingDetails { get; set; }
        public DbSet<TempMaterialShiftingDetails> TempMaterialShiftingDetails { get; set; }
        public DbSet<TempItem> TempItem { get; set; }
        public DbSet<MaterialShiftinngItem> MaterialShiftinngItem { get; set; }
      


    }
}
