using Azure.Messaging.ServiceBus;

namespace VideoRenderWorker.Services;

public class AzureServiceBusService : IMessageService
{
    private readonly ServiceBusClient _client;

    public AzureServiceBusService(string connectionString)
    {
        ServiceBusClientOptions clientOptions = new ()
        {
            TransportType = ServiceBusTransportType.AmqpWebSockets
        };

        _client = new ServiceBusClient(connectionString, clientOptions);
    }

    public async Task SendMessageAsync(string queue, string message)
    {
        await using var sender = _client.CreateSender(queue);
        await sender.SendMessageAsync(new ServiceBusMessage(message));
    }
}
