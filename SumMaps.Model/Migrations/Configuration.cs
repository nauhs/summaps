namespace SumMaps.Model.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SumMaps.Model.DbContexts.SumMapsContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            ContextKey = "SumMaps.Model.DbContexts.SumMapsContext";
        }

        protected override void Seed(SumMaps.Model.DbContexts.SumMapsContext context)
        {
            var hasher = new Microsoft.AspNet.Identity.PasswordHasher();
            context.Users.AddOrUpdate(
                u => u.UserName,    
                new Entities.User()
                {

                    Email = "s@mailinator.com",
                    Id = Guid.NewGuid().ToString(),
                    DateCreated = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow,
                    PasswordHash = hasher.HashPassword("ZAQ!2wsx"),
                    UserName = "shuan",
                    SecurityStamp = Guid.NewGuid().ToString()
                });
        }
    }
}
