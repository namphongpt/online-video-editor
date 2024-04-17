// See https://aka.ms/new-console-template for more information
using System.Text;
using System.Threading;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

var factory = new ConnectionFactory {
    HostName = "rabbitmq",
    UserName = Environment.GetEnvironmentVariable("RABBITMQ_USERNAME"),
    Password = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD")
};

using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare(queue: "video_render_queue",
                     durable: true,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);

channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

Console.WriteLine("> Waiting for video render tasks...");

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (ModuleHandle, ea) =>
{
    byte[] body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    Console.WriteLine($" [x] Received {message}");

    int dots = message.Split('.').Length - 1;
    Thread.Sleep(dots * 1000);

    Console.WriteLine(" [x] Done");

    // here channel could also be accessed as ((EventingBasicConsumer)sender).Model
    channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
};
channel.BasicConsume(queue: "video_render_queue",
                     autoAck: false,
                     consumer: consumer);

// Wait indefinitely
var waitHandle = new ManualResetEvent(false);
waitHandle.WaitOne();
