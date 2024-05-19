using System.Text;

using Azure.Messaging.ServiceBus;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

using Npgsql;

using ProjectsApi.Models;
using ProjectsApi.Services;

using RabbitMQ.Client;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
// TODO: migrations toevoegen aan CI/CD
// TODO: secrets doen via azure
);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = "https://dev-y4xffymaoj0vh0eb.eu.auth0.com/";
                    options.Audience = "api-gateway";
                });

builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IClipService, ClipService>();
builder.Services.AddSingleton<IMessageService>(sp =>
    new AzureServiceBusService(
        Environment.GetEnvironmentVariable("AZURE_SERVICE_BUS_CONN_STR")!
    )
);
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//app.UseHttpsRedirection();

app.Run();
