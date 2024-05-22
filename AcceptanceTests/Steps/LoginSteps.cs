using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using TechTalk.SpecFlow;

[Binding]
public class LoginSteps
{
    private readonly IWebDriver _driver;

    public LoginSteps()
    {
        _driver = new ChromeDriver();
    }

    [Given(@"the login page is open")]
    public void GivenTheLoginPageIsOpen()
    {
        _driver.Navigate().GoToUrl("http://localhost/");
    }

    [When(@"the user enters valid credentials")]
    public void WhenTheUserEntersValidCredentials()
    {
        _driver.FindElement(By.Id("username")).SendKeys("validUser");
        _driver.FindElement(By.Id("password")).SendKeys("validPassword");
        _driver.FindElement(By.XPath("//button[@name='action']")).Click();
    }

    [Then(@"the user is redirected to the dashboard")]
    public void ThenTheUserIsRedirectedToTheDashboard()
    {
        var dashboardUrl = _driver.Url;
//        Assert.AreEqual("http://localhost:8081/dashboard", dashboardUrl);
        _driver.Quit();
    }
}
