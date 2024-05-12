using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

using MediaService.Models;
using MediaService.Services;

using Microsoft.EntityFrameworkCore;

using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MediaContext>(opt =>
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
);

builder.Services.AddScoped(provider =>
    new BlobServiceClient(
        Environment.GetEnvironmentVariable("AZURE_STORAGE_CONN_STR")
    )
);
builder.Services.AddScoped<IMediaAssetService, MediaAssetService>();

builder.Services.AddControllers();

var app = builder.Build();

 app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
