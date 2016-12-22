using SumMaps.Model.DbContexts;
using SumMaps.Model.Entities;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SumMaps.Model
{
    public class UserRepo : IUserRepo 
    {
        private readonly SumMapsContext context;
        public UserRepo(SumMapsContext context)
        {
            this.context = context;
        }
        public virtual IEnumerable<User> GetAll()
        {
            return context.Users;
        }

        public virtual User Create(User entity)
        {
            try
            {
                var result = context.Users.Add(entity);
                context.SaveChanges();
                return result;
            }
            catch(Exception ex)
            {

            }

            return null;
        }
    }
}
