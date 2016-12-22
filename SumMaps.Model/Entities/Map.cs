using SumMaps.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SumMaps.Model.Entities
{
    public class Map
    {
        public String Title { get; set; }
        public String Path { get; set; }
        public Guid Id { get; set; }
        //public Guid UserId { get; set; }
        //public virtual User User { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
