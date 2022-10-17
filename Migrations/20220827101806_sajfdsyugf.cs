using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class sajfdsyugf : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MaterialShiftingDetails",
                columns: table => new
                {
                    Sr = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    msnodigit = table.Column<int>(type: "int", nullable: false),
                    msno = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Unique = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    loadingInchrage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    transportName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    driverName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    vechileno = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    userid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    companyid = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialShiftingDetails", x => x.Sr);
                });

            migrationBuilder.CreateTable(
                name: "TempItem",
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
                    table.PrimaryKey("PK_TempItem", x => x.Sr);
                });

            migrationBuilder.CreateTable(
                name: "TempMaterialShiftingDetails",
                columns: table => new
                {
                    Sr = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    msnodigit = table.Column<int>(type: "int", nullable: false),
                    msno = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Unique = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    loadingInchrage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    transportName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    driverName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    vechileno = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    remarks = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    userid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    companyid = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TempMaterialShiftingDetails", x => x.Sr);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaterialShiftingDetails");

            migrationBuilder.DropTable(
                name: "TempItem");

            migrationBuilder.DropTable(
                name: "TempMaterialShiftingDetails");
        }
    }
}
