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
            Host = Environment.GetEnvironmentVariable("DB_HOST"),
            Database = Environment.GetEnvironmentVariable("DB_NAME"),
            Username = Environment.GetEnvironmentVariable("DB_USER"),
            Password = Environment.GetEnvironmentVariable("DB_PASSWORD")
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
