namespace SumMaps.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Added_Owin : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "PasswordSalt", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "PasswordSalt");
        }
    }
}
