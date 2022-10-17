using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class gfhf : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Userid",
                table: "TempQuotationItem",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Userid",
                table: "TempQuotationItem");
        }
    }
}
