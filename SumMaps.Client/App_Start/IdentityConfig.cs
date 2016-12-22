using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using SumMaps.Model.DbContexts;
using SumMaps.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SumMaps.App_Start
{
    public class IdentityConfig
    {
        //public void Configuration(IAppBuilder app)
        //{
        //    app.CreatePerOwinContext(() => new SumMapsContext());
        //    app.CreatePerOwinContext<AppUserManager>(AppUserManager.Create);
        //    app.CreatePerOwinContext<RoleManager<Role>>((options, context) =>
        //        new RoleManager<Role>(
        //            new RoleStore<Role>(context.Get<SumMapsContext>())));

        //    app.UseCookieAuthentication(new CookieAuthenticationOptions
        //    {
        //        AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
        //        LoginPath = new PathString("/Home/Login"),
        //    });
        //}
    }
}