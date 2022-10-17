using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class lp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PricelistMake",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    pricelistid = table.Column<int>(type: "int", nullable: false),
                    makeid = table.Column<int>(type: "int", nullable: false),
                    make = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    companyid = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricelistMake", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "PriceListModel",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    pname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    pnameid = table.Column<int>(type: "int", nullable: false),
                    psize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    psizeid = table.Column<int>(type: "int", nullable: false),
                    pclass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    pclassid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    pmake = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    pmakeid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    amount = table.Column<double>(type: "float", nullable: false),
                    companyname = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PriceListModel", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PricelistMake");

            migrationBuilder.DropTable(
                name: "PriceListModel");
        }
    }
}
