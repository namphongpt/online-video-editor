FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Install dotnet-ef so we can generate a migration bundle.
ENV PATH $PATH:/root/.dotnet/tools
RUN dotnet tool install --global dotnet-ef

COPY ./MediaService/MediaService.csproj .
RUN dotnet restore ./MediaService/MediaService.csproj

COPY . .
RUN dotnet ef migrations bundle -o /app/efbundle
RUN dotnet build ./MediaService/MediaService.csproj -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish ./MediaService/MediaService.csproj -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/efbundle .
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MediaService.dll"]
