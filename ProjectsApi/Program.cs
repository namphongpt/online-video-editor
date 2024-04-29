using System.Text;
using RabbitMQ.Client;
using ProjectsApi.Models;
using Microsoft.EntityFrameworkCore;
using ProjectsApi.Services;
using Microsoft.Data.SqlClient;
using Npgsql;
using Microsoft.OpenApi.Models;
using Azure.Messaging.ServiceBus;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => { c.AddServer(new OpenApiServer { Url = "/api"}); });
Console.WriteLine("Password: " + Environment.GetEnvironmentVariable("DB_PASSWORD"));

builder.Services.AddDbContext<ProjectsContext>(opt =>
    opt.UseNpgsql(
        new NpgsqlConnectionStringBuilder()
        {
            //DataSource = Environment.GetEnvironmentVariable("DB_HOST"),
            //InitialCatalog = Environment.GetEnvironmentVariable("DB_NAME"),
            Host = Environment.GetEnvironmentVariable("POSTGRES_HOST"),
            Database = Environment.GetEnvironmentVariable("POSTGRES_DB"),
            Username = Environment.GetEnvironmentVariable("POSTGRES_USER"),
            Password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")
        }.ConnectionString
    )
// TODO: MassTransit gebruiken zodat je voor local rabbitmq kan gebruiken
// TODO: migrations toevoegen aan CI/CD
// TODO: docker compose updaten adhv die van groep
// TODO: secrets doen via azure
);
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddSingleton<IMessageService>(sp =>
    new AzureServiceBusService(
        Environment.GetEnvironmentVariable("AZURE_SERVICE_BUS_CONN_STR")!
    )
);
builder.Services.AddControllers();

//var factory = new ConnectionFactory {
//    HostName = "rabbitmq",
//    UserName = Environment.GetEnvironmentVariable("RABBITMQ_USERNAME"),
//    Password = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD")
//};

//using var connection = factory.CreateConnection();
//using var channel = connection.CreateModel();

//channel.QueueDeclare(queue: "video_render_queue",
//                     durable: true,
//                     exclusive: false,
//                     autoDelete: false,
//                     arguments: null);
//
//const string message = "Hello World!";
//var body = Encoding.UTF8.GetBytes(message);
//

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}

app.Use(async (context, next) =>
{
    // Log the requested path
    Console.WriteLine($"Requested Path: {context.Request.Path}");
    
    await next.Invoke();
});

app.MapControllers();

//app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

//app.MapGet("/WeatherForecast", () =>
//{
//    var properties = channel.CreateBasicProperties();
//    properties.Persistent = true;
//    channel.BasicPublish(exchange: string.Empty,
//                         routingKey: "video_render_queue",
//                         basicProperties: properties,
//                         body: body);
//    Console.WriteLine($" [x] Sent {message}");
//
//    var forecast =  Enumerable.Range(1, 5).Select(index =>
//        new WeatherForecast
//        (
//            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//            Random.Shared.Next(-20, 55),
//            summaries[Random.Shared.Next(summaries.Length)]
//        ))
//        .ToArray();
//    return forecast;
//})
//.WithName("GetWeatherForecast")
//.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
