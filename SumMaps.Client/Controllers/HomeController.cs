using SumMaps.Model;
using SumMaps.Model.Entities;
using SumMaps.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SumMaps.Controllers
{
    public class HomeController : Controller
    {
        private readonly IUserRepo _repo;
        public HomeController(IUserRepo repo)
        {
            _repo = repo;
        }
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            var salt = HashUtility.CreateRandomSalt();
            var passwordHash = HashUtility.CreateHash("ZAQ!2wsx", salt);

            var u = new User()
            {
                Email = "s@mailinator.com",
                Id = Guid.NewGuid().ToString(),
                DateCreated = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
                PasswordHash = passwordHash,
                PasswordSalt = salt,
                UserName = "shuan"
            };

            _repo.Create(u);


            return View();
        }
    }
}
