using OpenQA.Selenium;

namespace AcceptanceTests.PageObjects;

public class AuthenticationPageObject(IWebDriver webDriver)
{
    private readonly IWebDriver _webDriver = webDriver;
    public const int DefaultWaitInSeconds = 5;

    private IWebElement UsernameFieldElement => _webDriver.FindElement(By.Id("username"));
    private IWebElement PasswordFieldElement => _webDriver.FindElement(By.Id("password"));
    private IWebElement LoginButtonElement => _webDriver.FindElement(By.XPath("//button[@name='action']"));

    public void EnsurePageIsOpen()
    {
        if (_webDriver.Url != "http://localhost/")
        {
            _webDriver.Url = "http://localhost/";
        }

        // TODO: add a wait until
    }

    public void EnterUsername(string username) => UsernameFieldElement.SendKeys(username);

    public void EnterPassword(string password) => PasswordFieldElement.SendKeys(password);

    public void ClickLogin() => LoginButtonElement.Click();
}