using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

using MediaService.Models;
using MediaService.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
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

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = Environment.GetEnvironmentVariable("AUTH0_DOMAIN");//"https://dev-y4xffymaoj0vh0eb.eu.auth0.com/";
                    options.Audience = "api-gateway";
                });

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
