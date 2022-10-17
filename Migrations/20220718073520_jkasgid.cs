using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class jkasgid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StockReservation",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    sono = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    rsdate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    pnameid = table.Column<int>(type: "int", nullable: false),
                    Pname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Psizeid = table.Column<int>(type: "int", nullable: false),
                    Psize = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pclassid = table.Column<int>(type: "int", nullable: false),
                    Pclass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pmakeid = table.Column<int>(type: "int", nullable: false),
                    Pmake = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    qty = table.Column<double>(type: "float", nullable: false),
                    qtyunit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    reservationqty = table.Column<double>(type: "float", nullable: false),
                    reservationqtyunit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    companyid = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockReservation", x => x.id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockReservation");
        }
    }
}
