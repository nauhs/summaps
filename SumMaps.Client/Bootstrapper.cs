using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Unity.Mvc5;
using SumMaps.Model;
using SumMaps.Model.Entities;
using SumMaps.Model.DbContexts;

namespace SumMaps.Client
{
    public static class Bootstrapper
    {
        public static IUnityContainer Initialize()
        {
            var container = BuildUnityContainer();

            DependencyResolver.SetResolver(new UnityDependencyResolver(container));

            return container;
        }

        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>(); 

            RegisterTypes(container);

            return container;
        }

        public static void RegisterTypes(IUnityContainer container)
        {
            container.RegisterTypes(
                AllClasses.FromLoadedAssemblies(),
                WithMappings.FromMatchingInterface,
                WithName.Default,
                WithLifetime.Transient,
                null,
                true);

            //container.RegisterType<IUserRepo, UserRepo>(new InjectionConstructor(new SumMapsContext()));
        }
    }
}