using BoDi;
using Ductus.FluentDocker.Builders;
using Ductus.FluentDocker.Services;
using TechTalk.SpecFlow;

namespace AcceptanceTests.Hooks;

// Currently, a new browser instance is spinned up for each scenario. Re-use is
// possible, but is glitchy as the session needs to be manually reset. See:
// https://docs.specflow.org/projects/specflow/en/latest/ui-automation/Selenium-with-Page-Object-Pattern.html#using-the-same-browser-for-all-scenarios

[Binding]
public class DockerControllerHooks
{
    private static ICompositeService? _compositeService;
//    private IObjectContainer _objectContainer;

//    public DockerControllerHooks(IObjectContainer objectContainer)
//    {
//        _objectContainer = objectContainer;
//    }

    [BeforeTestRun]
    public static void DockerComposeUp()
    {
        _compositeService = new Builder()
            .UseContainer()
            .UseCompose()
            .FromFile("../../docker-compose.yaml")
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
        if (_compositeService is null)
            return;

        _compositeService.Stop();
        _compositeService.Dispose();
    }
}
