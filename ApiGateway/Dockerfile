FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ./ApiGateway.csproj .
RUN dotnet restore ./ApiGateway.csproj

COPY . .
#RUN dotnet ef migrations bundle -o /app/efbundle
RUN dotnet build ./ApiGateway.csproj -c Release -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish ./ApiGateway.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
EXPOSE 8080
#COPY --from=build /app/efbundle .
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ApiGateway.dll"]
