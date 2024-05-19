FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Install dotnet-ef so we can generate a migration bundle.
ENV PATH $PATH:/root/.dotnet/tools
RUN dotnet tool install --global dotnet-ef

COPY ./ProjectsApi.csproj .
RUN dotnet restore ./ProjectsApi.csproj

COPY . .
COPY ./Migrations/ ./Migrations/
RUN dotnet ef migrations bundle -o /app/efbundle

COPY . .
RUN dotnet build ./ProjectsApi.csproj -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish ./ProjectsApi.csproj -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/efbundle .
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProjectsApi.dll"]
