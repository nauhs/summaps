using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using SumMaps.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SumMaps.Model.Entities
{
    public class User : IdentityUser
    {
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }
        
    }
}
