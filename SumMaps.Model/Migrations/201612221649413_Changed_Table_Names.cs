namespace SumMaps.Model.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Changed_Table_Names : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            RenameTable(name: "dbo.AspNetRoles", newName: "Role");
            RenameTable(name: "dbo.AspNetUserRoles", newName: "UserRole");
            RenameTable(name: "dbo.AspNetUserClaims", newName: "Claim");
            RenameTable(name: "dbo.AspNetUserLogins", newName: "Login");
            DropIndex("dbo.UserRole", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.Claim", new[] { "UserId" });
            DropIndex("dbo.Login", new[] { "UserId" });
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            AddColumn("dbo.UserRole", "IdentityUser_Id", c => c.String(maxLength: 128));
            AddColumn("dbo.Claim", "IdentityUser_Id", c => c.String(maxLength: 128));
            AddColumn("dbo.Login", "IdentityUser_Id", c => c.String(maxLength: 128));
            AlterColumn("dbo.Claim", "UserId", c => c.String());
            CreateIndex("dbo.UserRole", "IdentityUser_Id");
            CreateIndex("dbo.Claim", "IdentityUser_Id");
            CreateIndex("dbo.Login", "IdentityUser_Id");
            CreateIndex("dbo.AspNetUsers", "Id");
            AddForeignKey("dbo.AspNetUsers", "Id", "dbo.User", "Id");
            AddForeignKey("dbo.Claim", "IdentityUser_Id", "dbo.User", "Id");
            AddForeignKey("dbo.Login", "IdentityUser_Id", "dbo.User", "Id");
            AddForeignKey("dbo.UserRole", "IdentityUser_Id", "dbo.User", "Id");
            DropColumn("dbo.AspNetUsers", "Email");
            DropColumn("dbo.AspNetUsers", "EmailConfirmed");
            DropColumn("dbo.AspNetUsers", "PasswordHash");
            DropColumn("dbo.AspNetUsers", "SecurityStamp");
            DropColumn("dbo.AspNetUsers", "PhoneNumber");
            DropColumn("dbo.AspNetUsers", "PhoneNumberConfirmed");
            DropColumn("dbo.AspNetUsers", "TwoFactorEnabled");
            DropColumn("dbo.AspNetUsers", "LockoutEndDateUtc");
            DropColumn("dbo.AspNetUsers", "LockoutEnabled");
            DropColumn("dbo.AspNetUsers", "AccessFailedCount");
            DropColumn("dbo.AspNetUsers", "UserName");
        }
        
        public override void Down()
        {
            AddColumn("dbo.AspNetUsers", "UserName", c => c.String(nullable: false, maxLength: 256));
            AddColumn("dbo.AspNetUsers", "AccessFailedCount", c => c.Int(nullable: false));
            AddColumn("dbo.AspNetUsers", "LockoutEnabled", c => c.Boolean(nullable: false));
            AddColumn("dbo.AspNetUsers", "LockoutEndDateUtc", c => c.DateTime());
            AddColumn("dbo.AspNetUsers", "TwoFactorEnabled", c => c.Boolean(nullable: false));
            AddColumn("dbo.AspNetUsers", "PhoneNumberConfirmed", c => c.Boolean(nullable: false));
            AddColumn("dbo.AspNetUsers", "PhoneNumber", c => c.String());
            AddColumn("dbo.AspNetUsers", "SecurityStamp", c => c.String());
            AddColumn("dbo.AspNetUsers", "PasswordHash", c => c.String());
            AddColumn("dbo.AspNetUsers", "EmailConfirmed", c => c.Boolean(nullable: false));
            AddColumn("dbo.AspNetUsers", "Email", c => c.String(maxLength: 256));
            DropForeignKey("dbo.UserRole", "IdentityUser_Id", "dbo.User");
            DropForeignKey("dbo.Login", "IdentityUser_Id", "dbo.User");
            DropForeignKey("dbo.Claim", "IdentityUser_Id", "dbo.User");
            DropForeignKey("dbo.AspNetUsers", "Id", "dbo.User");
            DropIndex("dbo.AspNetUsers", new[] { "Id" });
            DropIndex("dbo.Login", new[] { "IdentityUser_Id" });
            DropIndex("dbo.Claim", new[] { "IdentityUser_Id" });
            DropIndex("dbo.User", "UserNameIndex");
            DropIndex("dbo.UserRole", new[] { "IdentityUser_Id" });
            AlterColumn("dbo.Claim", "UserId", c => c.String(nullable: false, maxLength: 128));
            DropColumn("dbo.Login", "IdentityUser_Id");
            DropColumn("dbo.Claim", "IdentityUser_Id");
            DropColumn("dbo.UserRole", "IdentityUser_Id");
            DropTable("dbo.User");
            CreateIndex("dbo.Login", "UserId");
            CreateIndex("dbo.Claim", "UserId");
            CreateIndex("dbo.AspNetUsers", "UserName", unique: true, name: "UserNameIndex");
            CreateIndex("dbo.UserRole", "UserId");
            AddForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
            AddForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
            AddForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
            RenameTable(name: "dbo.Login", newName: "AspNetUserLogins");
            RenameTable(name: "dbo.Claim", newName: "AspNetUserClaims");
            RenameTable(name: "dbo.UserRole", newName: "AspNetUserRoles");
            RenameTable(name: "dbo.Role", newName: "AspNetRoles");
        }
    }
}
