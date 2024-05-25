using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace AcceptanceTests;

public static class Utils
{
    /// <summary>
    /// Helper method to wait until the expected result is available on the UI
    /// </summary>
    /// <typeparam name="T">The type of result to retrieve</typeparam>
    /// <param name="getResult">The function to poll the result from the UI</param>
    /// <param name="isResultAccepted">The function to decide if the polled result is accepted</param>
    /// <param name="maxWaitInSeconds">The maximum time to wait until an element should appear. If this time is surpassed, the element is not expected to appear anymore</param>
    /// <note>Almost all taken from https://docs.specflow.org/projects/specflow/en/latest/ui-automation/Selenium-with-Page-Object-Pattern.html</note>
    /// <returns>An accepted result returned from the UI. If the UI does not return an accepted result within the timeout an exception is thrown.</returns>
    public static T? WaitUntil<T>(
        IWebDriver webDriver,
        Func<T> getResult,
        Func<T, bool> isResultAccepted,
        int maxWaitInSeconds = 5
    ) where T: class
    {
        var wait = new WebDriverWait(webDriver, TimeSpan.FromSeconds(maxWaitInSeconds));
        return wait.Until(driver =>
        {
            var result = getResult();
            if (!isResultAccepted(result))
                return default;

            return result;
        });
    }
}