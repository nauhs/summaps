using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using SumMaps.App_Start;
using SumMaps.Model;
using SumMaps.Model.Entities;
using SumMaps.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SumMaps.Controllers
{
    public class SessionController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        private ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        public SessionController()
        {
        }

        [HttpGet]
        public ActionResult SignIn()
        {
            return View();
        }
        
        [HttpPost]
        public async Task<ActionResult> Signin(string email, string password)
        {
            ViewBag.Title = "Home Page";

            var result = await SignInManager.PasswordSignInAsync(email, password, true, shouldLockout: false);
            switch (result)
            {
                case SignInStatus.Success:
                    return RedirectToAction("Index", "Home");
                default:
                    return new HttpUnauthorizedResult();
                //case SignInStatus.LockedOut:
                //    return View("Lockout");
                //case SignInStatus.RequiresVerification:
                //    return View("hey");
                //case SignInStatus.Failure:
                //default:
                //    ModelState.AddModelError("", "Invalid login attempt.");
                //    return View();
            }
            
        }
        
        [HttpGet]
        public ActionResult SignOut()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("SignIn");
        }
    }
}
