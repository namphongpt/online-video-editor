using System.Text.Json;

using Azure.Messaging.ServiceBus;

using VideoRenderWorker.Dto;

await using ServiceBusClient serviceBusClient = new(
    Environment.GetEnvironmentVariable("AZURE_SERVICE_BUS_CONN_STR")
);
await using ServiceBusProcessor processor = serviceBusClient.CreateProcessor(
    "video-render-queue",
    new ServiceBusProcessorOptions
    {
        AutoCompleteMessages = false,
        MaxConcurrentCalls = 1
    }
);

processor.ProcessMessageAsync += async args =>
{
    string body = args.Message.Body.ToString();

    var y = JsonSerializer.Deserialize<ProjectRenderDto>(body);

    Console.WriteLine(y.ProjectId);

    await Task.Delay(1000);
    await args.CompleteMessageAsync(args.Message);
};

processor.ProcessErrorAsync += args =>
{
    Console.WriteLine("Error: " + args.Exception);
    return Task.CompletedTask;
};

await processor.StartProcessingAsync();

await Task.Delay(Timeout.Infinite);
