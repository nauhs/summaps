using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using SumMaps.App_Start;

[assembly: OwinStartup(typeof(SumMaps.Startup))]

namespace SumMaps
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            IdentityConfig.Configure(app);
        }
    }
}
