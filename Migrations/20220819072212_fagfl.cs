using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class fagfl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Amount",
                table: "TempInvoiceItem",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "HSNCode",
                table: "TempInvoiceItem",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "discount",
                table: "TempInvoiceItem",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "discountPrice",
                table: "TempInvoiceItem",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "price",
                table: "TempInvoiceItem",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "BillingContactPerson",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingEmail",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingMobile",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsignContactPerson",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsignEmail",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsignMobile",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Amount",
                table: "InvoiceItem",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "HSNCode",
                table: "InvoiceItem",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "discount",
                table: "InvoiceItem",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "discountPrice",
                table: "InvoiceItem",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "price",
                table: "InvoiceItem",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "BillingContactPerson",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingEmail",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingMobile",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsignContactPerson",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsignEmail",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsignMobile",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "TempInvoiceItem");

            migrationBuilder.DropColumn(
                name: "HSNCode",
                table: "TempInvoiceItem");

            migrationBuilder.DropColumn(
                name: "discount",
                table: "TempInvoiceItem");

            migrationBuilder.DropColumn(
                name: "discountPrice",
                table: "TempInvoiceItem");

            migrationBuilder.DropColumn(
                name: "price",
                table: "TempInvoiceItem");

            migrationBuilder.DropColumn(
                name: "BillingContactPerson",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "BillingEmail",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "BillingMobile",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "ConsignContactPerson",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "ConsignEmail",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "ConsignMobile",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "InvoiceItem");

            migrationBuilder.DropColumn(
                name: "HSNCode",
                table: "InvoiceItem");

            migrationBuilder.DropColumn(
                name: "discount",
                table: "InvoiceItem");

            migrationBuilder.DropColumn(
                name: "discountPrice",
                table: "InvoiceItem");

            migrationBuilder.DropColumn(
                name: "price",
                table: "InvoiceItem");

            migrationBuilder.DropColumn(
                name: "BillingContactPerson",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "BillingEmail",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "BillingMobile",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "ConsignContactPerson",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "ConsignEmail",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "ConsignMobile",
                table: "InvoiceDetails");
        }
    }
}
