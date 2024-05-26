using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;

namespace AcceptanceTests.Drivers;

public class BrowserDriver : IDisposable
{
    private readonly Lazy<IWebDriver> _currentWebDriverLazy;// = new Lazy<IWebDriver>(CreateWebDriver);
    private bool _isDisposed;

    public BrowserDriver()
    {
        _currentWebDriverLazy = new Lazy<IWebDriver>(CreateWebDriver);
    }

    public IWebDriver Current => _currentWebDriverLazy.Value;

    private IWebDriver CreateWebDriver()
    {
        Console.WriteLine("does it get stuck here?");
        var chromeDriverService = ChromeDriverService.CreateDefaultService();
        var chromeOptions = new ChromeOptions();
        chromeOptions.AddArgument("headless");
        var chromeDriver = new ChromeDriver(chromeDriverService, chromeOptions);
        Console.WriteLine("or on line 26?");
 //       var seleniumUrl = Environment.GetEnvironmentVariable("SELENIUM_URL")!;
 //       var chromeDriver = new RemoteWebDriver(new Uri(seleniumUrl), chromeOptions);

        return chromeDriver;
    }

    public void Dispose()
    {
        if (_isDisposed)
        {
            return;
        }

        if (_currentWebDriverLazy.IsValueCreated)
        {
            Current.Quit();
        }

        _isDisposed = true;
    }

}
