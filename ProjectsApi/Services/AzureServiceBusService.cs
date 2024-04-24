using Azure.Messaging.ServiceBus;

namespace ProjectsApi.Services;

public class AzureServiceBusService : IMessageService
{
    private readonly ServiceBusClient _client;
    //private readonly ServiceBusSender _sender;

    public AzureServiceBusService(string connectionString)
    {
        ServiceBusClientOptions clientOptions = new ()
        {
            TransportType = ServiceBusTransportType.AmqpWebSockets
        };

        _client = new ServiceBusClient(connectionString, clientOptions);
//        _sender = _client.CreateSender("");
    }

    public async Task SendMessageAsync(string queue, string message)
    {
        await using var sender = _client.CreateSender(queue);
        await sender.SendMessageAsync(new ServiceBusMessage(message));
    }
}
/*
ServiceBusClient client;
ServiceBusSender sender;

var clientOptions = new ServiceBusClientOptions()
{
    TransportType = ServiceBusTransportType.AmqpWebSockets
};
client = new ServiceBusClient(Environment.GetEnvironmentVariable("AZURE_SERVICE_BUS_CONN_STR"), clientOptions);
//"Endpoint=sb://onlinevideoeditor.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=op99pmqrNVH+jfczCAhke4/y1XyFDlFI1+ASbEsnRpc=", clientOptions);
sender = client.CreateSender("video-task-queue");

try {
    await sender.SendMessageAsync(new ServiceBusMessage("Message1"));
} finally {
    await sender.DisposeAsync();
    await client.DisposeAsync();
}
*/
