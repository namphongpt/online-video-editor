using AcceptanceTests.Drivers;
using AcceptanceTests.PageObjects;
using OpenQA.Selenium;
using TechTalk.SpecFlow;

namespace AcceptanceTests.Steps;

[Binding]
public class ProjectOverviewStepDefinitions
{
    private readonly ProjectOverviewPageObject _projectOverviewPageObject;
    private readonly ProjectCreationModalPageObject _projectCreationModalPageObject;
    private readonly ProjectPageObject _projectPageObject;
    private readonly IWebDriver _webDriver;

    public ProjectOverviewStepDefinitions(BrowserDriver browserDriver)
    {
        _webDriver = browserDriver.Current;
        _projectOverviewPageObject = new ProjectOverviewPageObject(_webDriver);
        // We already instantiate these two Page Objects, even though the
        // current webdriver instance isn't yet in a state where these apply.
        _projectPageObject = new ProjectPageObject(_webDriver);
        _projectCreationModalPageObject = new ProjectCreationModalPageObject(_webDriver);
    }

    [Given("the user is on the project overview page")]
    public void GivenTheUserIsOnTheProjectOverviewPage()
    {
        _projectOverviewPageObject.EnsureIsOnPage();
    }

    [When("the user opens the 'Project aanmaken' modal")]
    public void WhenTheUserOpensTheProjectAanmakenModal()
    {
        _projectCreationModalPageObject.OpenModal();
    }

    [When("the user enters the project title '(.*)'")]
    public void WhenTheUserEntersTheProjectTitle(string projectTitle)
    {
        _projectCreationModalPageObject.EnterProjectTitle(projectTitle);
    }

    [When("the user submits the form")]
    public void WhenTheUserSubmitsTheForm()
    {
        _projectCreationModalPageObject.ClickCreateProjectButton();
    }

    [Then(@"the user is on the page of the project titled '(.*)'")]
    public void ThenTheUserIsOnThePageOfTheProjectTitled(string projectTitle)
    {
        _projectPageObject.WaitOnPageLoad();

        Assert.StartsWith("http://localhost/project/", _webDriver.Url);
        Assert.Equal($"Project ‘{projectTitle}’", _projectPageObject.Title);
    }

    [Then(@"the user sees the text '(.*)'")]
    public void ThenTheUserSeesTheText(string text)
    {
        // This throws a `NoSuchElementException` if the user doesn't see the
        // text.
        _webDriver.FindElement(By.XPath($"//*[contains(text(), '{text}')]"));
    }
}
