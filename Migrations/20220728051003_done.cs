using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class done : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DispatchReservation",
                columns: table => new
                {
                    Sr = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Sono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Itemid = table.Column<int>(type: "int", nullable: false),
                    Pname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Psize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pclass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pmake = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pcategory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rateunit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rate = table.Column<double>(type: "float", nullable: false),
                    Discount = table.Column<double>(type: "float", nullable: false),
                    Discountrate = table.Column<double>(type: "float", nullable: false),
                    Qty = table.Column<double>(type: "float", nullable: false),
                    Qtyunit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    despacthedQty = table.Column<double>(type: "float", nullable: false),
                    despacthedQtyUnit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IndentQty = table.Column<double>(type: "float", nullable: false),
                    IndentQtyUnit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Amount = table.Column<double>(type: "float", nullable: false),
                    Companyid = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DispatchReservation", x => x.Sr);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DispatchReservation");
        }
    }
}
