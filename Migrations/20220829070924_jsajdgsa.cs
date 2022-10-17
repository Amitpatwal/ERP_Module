using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class jsajdgsa : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MaterialShiftinngItem",
                columns: table => new
                {
                    Sr = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    msnodigit = table.Column<int>(type: "int", nullable: false),
                    msno = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Itemid = table.Column<int>(type: "int", nullable: false),
                    Pname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Psize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pclass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pmake = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    fromGodown = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    toGodown = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    qty = table.Column<double>(type: "float", nullable: false),
                    qtyUnit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    altqty = table.Column<double>(type: "float", nullable: false),
                    altqtyUnit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    userid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    companyid = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialShiftinngItem", x => x.Sr);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaterialShiftinngItem");
        }
    }
}
