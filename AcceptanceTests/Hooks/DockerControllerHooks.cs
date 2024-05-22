using BoDi;
using Ductus.FluentDocker.Builders;
using Ductus.FluentDocker.Services;
using TechTalk.SpecFlow;

namespace AcceptanceTests.Hooks;

[Binding]
public class DockerControllerHooks
{
    private static ICompositeService _compositeService;
    private IObjectContainer _objectContainer;

    public DockerControllerHooks(IObjectContainer objectContainer)
    {
        _objectContainer = objectContainer;
    }

    [BeforeTestRun]
    public static void DockerComposeUp()
    {
        _compositeService = new Builder()
            .UseContainer()
            .UseCompose()
            .FromFile("../docker-compose.yaml")
            .RemoveOrphans()
            .WaitForHttp(
                "gateway",
                "http://localhost/",
                continuation: (response, _) =>
                    response.Code != System.Net.HttpStatusCode.OK ? 2000 : 0
            )
            .Build()
            .Start();
    }

    [AfterTestRun]
    public static void DockerComposeDown()
    {
        _compositeService.Stop();
        _compositeService.Dispose();
    }

    //private static string GetDockerComposeLocation(string dockerComposeFileName)
    //{
    //    
    //}
}
