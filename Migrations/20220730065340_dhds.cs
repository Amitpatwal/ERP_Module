using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class dhds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "balanceQty",
                table: "StockReservation",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "balanceQty",
                table: "StockReservation");
        }
    }
}
