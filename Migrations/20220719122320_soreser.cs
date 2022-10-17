using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class soreser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ReservationStatus",
                table: "SOItem",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReservationStatus",
                table: "SOItem");
        }
    }
}
