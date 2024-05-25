using OpenQA.Selenium;

namespace AcceptanceTests.PageObjects;

/// <summary>
/// A Page Object abstraction around a single project page, given by URLs
/// <c>/project/{projectUuid}</c>.
/// </summary>
/// <seealso href="https://docs.specflow.org/projects/specflow/en/latest/Guides/PageObjectModel.html"/>
/// <param name="webDriver">The Selenium web driver instance</param>
public class ProjectPageObject(IWebDriver webDriver)
{
    private readonly IWebDriver _webDriver = webDriver;

    public string Title => _webDriver.FindElement(By.TagName("h1")).Text;

    public void WaitOnPageLoad()
    {
        // Unique to the project page is that it contains a `<h1>` with the
        // project's title.
        Utils.WaitUntil(
            _webDriver,
            () => _webDriver.FindElements(By.XPath("//h1[contains(text(), 'Project ')]")),
            result => result.Count > 0
        );
    }
}
