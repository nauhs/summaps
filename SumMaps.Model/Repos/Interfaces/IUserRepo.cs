using SumMaps.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SumMaps.Model
{
    public interface IUserRepo
    {
        IEnumerable<User> GetAll();

        User Create(User entity);
    }
}
