using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace SALES_ERP.Migrations
{
    public partial class data : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<double>(
              name: "PrAmount",
              table: "TempPurchaseRecievedItem",
              type: "float",
              nullable: false,
              defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
              name: "ScAmount",
              table: "TempPurchaseRecievedItem",
              type: "float",
              nullable: false,
              defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
              name: "WeightAmount",
              table: "TempPurchaseRecievedItem",
              type: "float",
              nullable: false,
              defaultValue: 0.0);


            migrationBuilder.AddColumn<double>(
            name: "PrAmount",
            table: "PurchaseRecievedItem",
            type: "float",
            nullable: false,
            defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
              name: "ScAmount",
              table: "PurchaseRecievedItem",
              type: "float",
              nullable: false,
              defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
              name: "WeightAmount",
              table: "PurchaseRecievedItem",
              type: "float",
              nullable: false,
              defaultValue: 0.0);




        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                    name: "PrAmount",
                    table: "TempPurchaseRecievedItem");
            migrationBuilder.DropColumn(
                name: "ScAmount",
                table: "TempPurchaseRecievedItem");
            migrationBuilder.DropColumn(
                name: "WeightAmount",
                table: "TempPurchaseRecievedItem");


            migrationBuilder.DropColumn(
                   name: "PrAmount",
                   table: "PurchaseRecievedItem");
            migrationBuilder.DropColumn(
                name: "ScAmount",
                table: "PurchaseRecievedItem");
            migrationBuilder.DropColumn(
                name: "WeightAmount",
                table: "PurchaseRecievedItem");


        }
    }
}
