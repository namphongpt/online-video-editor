FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ./VideoRenderWorker/VideoRenderWorker.csproj .
RUN dotnet restore ./VideoRenderWorker.csproj

COPY ./VideoRenderWorker .
#RUN dotnet ef migrations bundle -o /app/efbundle
RUN dotnet build ./VideoRenderWorker.csproj -c Release -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish ./VideoRenderWorker.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
EXPOSE 8080
#COPY --from=build /app/efbundle .
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "VideoRenderWorker.dll"]
