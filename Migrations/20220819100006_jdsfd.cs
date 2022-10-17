using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class jdsfd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Input1",
                table: "TempInvoiceDetails",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Input2",
                table: "TempInvoiceDetails",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Input3",
                table: "TempInvoiceDetails",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Input4",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label1",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label2",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label3",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label4",
                table: "TempInvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Input1",
                table: "InvoiceDetails",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Input2",
                table: "InvoiceDetails",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Input3",
                table: "InvoiceDetails",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Input4",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label1",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label2",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label3",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Label4",
                table: "InvoiceDetails",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Input1",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Input2",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Input3",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Input4",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Label1",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Label2",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Label3",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Label4",
                table: "TempInvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Input1",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Input2",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Input3",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Input4",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Label1",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Label2",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Label3",
                table: "InvoiceDetails");

            migrationBuilder.DropColumn(
                name: "Label4",
                table: "InvoiceDetails");
        }
    }
}
