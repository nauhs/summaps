using Microsoft.AspNet.Identity.EntityFramework;
using SumMaps.Model.Entities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SumMaps.Model.DbContexts
{
    public class SumMapsContext : IdentityDbContext<User>
    {
        public SumMapsContext() : base(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString)
        {
            Database.Initialize(true);
        }

        //public virtual IDbSet<User> Users { get; set; }
        public virtual IDbSet<Map> Maps { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Map>().ToTable("Map");

            modelBuilder.Entity<IdentityUser>().ToTable("User");
            modelBuilder.Entity<IdentityUserRole>().ToTable("UserRole");
            modelBuilder.Entity<IdentityUserLogin>().ToTable("Login");
            modelBuilder.Entity<IdentityUserClaim>().ToTable("Claim");
            modelBuilder.Entity<IdentityRole>().ToTable("Role");

        }
    }
}

