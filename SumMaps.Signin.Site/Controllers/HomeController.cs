﻿using SumMaps.Model;
using SumMaps.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace SumMaps.Signin.Site.Controllers
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

            var isAuthenticated = Thread.CurrentPrincipal.Identity.IsAuthenticated;

            if (!isAuthenticated)
                return RedirectToAction("SignIn", "Session");

            ViewBag.Greeting = $"hi {Thread.CurrentPrincipal.Identity.Name}!";
            return View();

            //var hasher = new Microsoft.AspNet.Identity.PasswordHasher();
            //var passwordHash = hasher.HashPassword("ZAQ!2wsx");

            //var u = new User()
            //{
            //    Email = "s@mailinator.com",
            //    Id = Guid.NewGuid().ToString(),
            //    DateCreated = DateTime.UtcNow,
            //    LastUpdated = DateTime.UtcNow,
            //    PasswordHash = passwordHash,
            //    UserName = "shuan",
            //    SecurityStamp = Guid.NewGuid().ToString()
            //};

            //_repo.Create(u);

        }

        public ActionResult Index2()
        {
            ViewBag.Greeting = $"hi {Thread.CurrentPrincipal.Identity.Name}!";
            return View();

        }
        public ActionResult RedirectToApi()
        {
            return Redirect("http://api.summaps.com");

        }
        public ActionResult RedirectToUi()
        {
            return Redirect("http://summaps.com");

        }

        [AllowAnonymous]
        public ActionResult Seed()
        {
            var hasher = new Microsoft.AspNet.Identity.PasswordHasher();
            var passwordHash = hasher.HashPassword("ZAQ!2wsx");

            var u = new User()
            {
                Email = "s@mailinator.com",
                Id = Guid.NewGuid().ToString(),
                DateCreated = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow,
                PasswordHash = passwordHash,
                EmailConfirmed = true,
                UserName = "shuan",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            _repo.Create(u);

            return RedirectToAction("SignIn", "Session");
        }
    }
}