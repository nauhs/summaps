using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http;

namespace SumMaps.Services.Security
{
    public class AuthenticatedBaseApiController : ApiController
    {
        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);

            // check for authentication
            if (!IsAuthenticated())
            {
                throw new System.Web.Http.HttpResponseException(System.Net.HttpStatusCode.Unauthorized);
            }
        }

        private bool IsAuthenticated()
        {
            var claimsPrincipal = Thread.CurrentPrincipal as System.Security.Claims.ClaimsPrincipal;
            if (claimsPrincipal != null)
            {
                if (claimsPrincipal.Identity != null)
                {
                    return claimsPrincipal.Identity.IsAuthenticated;
                }
            }

            return false;
        }
    }
}