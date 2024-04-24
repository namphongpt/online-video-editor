namespace ProjectsApi.Services;

public interface IMessageService
{
    public Task SendMessageAsync(string queue, string message);
}
