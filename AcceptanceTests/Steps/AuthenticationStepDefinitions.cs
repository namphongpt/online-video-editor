using AcceptanceTests.Drivers;
using AcceptanceTests.PageObjects;
using TechTalk.SpecFlow;

namespace AcceptanceTests.Steps;

[Binding]
public class AuthenticationStepDefinitions
{
    private readonly AuthenticationPageObject _authenticationPageObject;
    private readonly ProjectOverviewPageObject _projectOverviewPageObject;

    public AuthenticationStepDefinitions(BrowserDriver browserDriver)
    {
        _authenticationPageObject = new AuthenticationPageObject(browserDriver.Current);
        _projectOverviewPageObject = new ProjectOverviewPageObject(browserDriver.Current);
    }

    [Given("the user is authenticated")]
    public void GivenTheUserIsAuthenticated()
    {
        _authenticationPageObject.EnsurePageIsOpen();

        // If we are on the project overview page, we apparently are already
        // authenticated. 
        if (_projectOverviewPageObject.IsOnPage())
            return;

        _authenticationPageObject.EnterUsername("test@example.com");
        _authenticationPageObject.EnterPassword("VeiligWachtwoord1");
        _authenticationPageObject.ClickLogin();
        // TODO: a wait step?
    }
}
