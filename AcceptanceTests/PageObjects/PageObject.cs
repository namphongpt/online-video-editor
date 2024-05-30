namespace AcceptanceTests.PageObjects;

public class PageObject
{
    protected readonly string baseUrl;

    public PageObject()
    {
        baseUrl = Environment.GetEnvironmentVariable("STAGING_BASE_URL")?.TrimEnd('/')
            ?? throw new ArgumentNullException("STAGING_BASE_URL is required");
    }
}
