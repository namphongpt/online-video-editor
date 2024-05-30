using OpenQA.Selenium;

namespace AcceptanceTests.PageObjects;

/// <summary>
/// Page Object abstraction around the modal on the projects overview page
/// containing the form for creating a new project. Also includes the button
/// for opening the button, which technically lies outside the modal. This
/// Page Object should be called when the web driver is on the project overview
/// page.
/// </summary>
/// <seealso href="https://docs.specflow.org/projects/specflow/en/latest/Guides/PageObjectModel.html"/>
/// <param name="webDriver">The Selenium web driver instance</param>
public class ProjectCreationModalPageObject(IWebDriver webDriver) : PageObject
{
    private readonly IWebDriver _webDriver = webDriver;

    private IWebElement OpenModalButtonElement =>
        _webDriver.FindElement(By.XPath("//button[span[text()='Maak project aan']]"));
    private IWebElement ProjectTitleInputElement => _webDriver.FindElement(By.Id("title"));
    private IWebElement CreateProjectButton => _webDriver.FindElement(By.XPath("//button[text()='Maak aan']"));

    public void OpenModal()
    {
        Assert.Equal(baseUrl + '/', _webDriver.Url);
        OpenModalButtonElement.Click();
    }

    public void EnterProjectTitle(string projectTitle)
    {
        ProjectTitleInputElement.SendKeys(projectTitle);
    }

    public void ClickCreateProjectButton()
    {
        CreateProjectButton.Click();
    }
}