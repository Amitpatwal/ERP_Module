using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class invoice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InvoiceDetails",
                columns: table => new
                {
                    Sr = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceNodigit = table.Column<int>(type: "int", nullable: false),
                    IVNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IVDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Dono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Dodate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ourGST = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ourPAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PoNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PoDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SODate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BillingCCode = table.Column<int>(type: "int", nullable: false),
                    Billingname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingCity = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingState = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingPincode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingGST = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingPAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginCCode = table.Column<int>(type: "int", nullable: false),
                    Consginname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginCity = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginState = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginPincode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginGST = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginPAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransportCCode = table.Column<int>(type: "int", nullable: false),
                    TransportName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VechileNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FreightType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FreightCharge = table.Column<double>(type: "float", nullable: false),
                    ForwardingTransportAmount = table.Column<double>(type: "float", nullable: false),
                    GrNO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Companyid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Userid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    gstType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CGST = table.Column<double>(type: "float", nullable: false),
                    IGST = table.Column<double>(type: "float", nullable: false),
                    SGST = table.Column<double>(type: "float", nullable: false),
                    bankName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    accNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ifsccode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    branch = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    iec = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceDetails", x => x.Sr);
                });

            migrationBuilder.CreateTable(
                name: "InvoiceItem",
                columns: table => new
                {
                    Sr = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IVNodigit = table.Column<int>(type: "int", nullable: false),
                    IVNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Itemid = table.Column<int>(type: "int", nullable: false),
                    Hashpname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Altpname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Psize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Altpsize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pclass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Altpclass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pmake = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Qty = table.Column<double>(type: "float", nullable: false),
                    Qtyunit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ItemWeight = table.Column<double>(type: "float", nullable: false),
                    ItemWeightUnit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Companyid = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceItem", x => x.Sr);
                });

            migrationBuilder.CreateTable(
                name: "TempInvoiceDetails",
                columns: table => new
                {
                    Sr = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceNodigit = table.Column<int>(type: "int", nullable: false),
                    IVNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IVDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Dono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Dodate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ourGST = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ourPAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PoNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PoDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SODate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BillingCCode = table.Column<int>(type: "int", nullable: false),
                    Billingname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingCity = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingState = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingPincode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingGST = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BillingPAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginCCode = table.Column<int>(type: "int", nullable: false),
                    Consginname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginCity = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginState = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginPincode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginGST = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsginPAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransportCCode = table.Column<int>(type: "int", nullable: false),
                    TransportName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VechileNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FreightType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FreightCharge = table.Column<double>(type: "float", nullable: false),
                    ForwardingTransportAmount = table.Column<double>(type: "float", nullable: false),
                    GrNO = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Companyid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Userid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    gstType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CGST = table.Column<double>(type: "float", nullable: false),
                    IGST = table.Column<double>(type: "float", nullable: false),
                    SGST = table.Column<double>(type: "float", nullable: false),
                    bankName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    accNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ifsccode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    branch = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    iec = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TempInvoiceDetails", x => x.Sr);
                });

            migrationBuilder.CreateTable(
                name: "TempInvoiceItem",
                columns: table => new
                {
                    Sr = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IVNodigit = table.Column<int>(type: "int", nullable: false),
                    IVNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Itemid = table.Column<int>(type: "int", nullable: false),
                    Hashpname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Altpname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Psize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Altpsize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pclass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Altpclass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pmake = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Qty = table.Column<double>(type: "float", nullable: false),
                    Qtyunit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ItemWeight = table.Column<double>(type: "float", nullable: false),
                    ItemWeightUnit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Companyid = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TempInvoiceItem", x => x.Sr);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvoiceDetails");

            migrationBuilder.DropTable(
                name: "InvoiceItem");

            migrationBuilder.DropTable(
                name: "TempInvoiceDetails");

            migrationBuilder.DropTable(
                name: "TempInvoiceItem");
        }
    }
}
