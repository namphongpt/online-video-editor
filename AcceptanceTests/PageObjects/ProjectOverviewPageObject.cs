using OpenQA.Selenium;

namespace AcceptanceTests.PageObjects;

public class ProjectOverviewPageObject(IWebDriver webDriver) : PageObject
{
    private readonly IWebDriver _webDriver = webDriver;

    private readonly By projectsHeaderXPath = By.XPath("//h3[text()='Projecten']");

    public void EnsureIsOnPage()
    {
        if (_webDriver.Url != baseUrl)
            _webDriver.Url = baseUrl;

        // Wait until the <h3>Projecten</h3> is present on the page.
        Utils.WaitUntil(
            _webDriver,
            () => _webDriver.FindElements(projectsHeaderXPath),
            result => result.Count == 1
        );
    }

    public bool IsOnPage()
    {
        return _webDriver.FindElements(projectsHeaderXPath).Count == 1;
    }
}
