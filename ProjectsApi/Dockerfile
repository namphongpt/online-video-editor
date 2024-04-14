FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION
WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

RUN dotnet tool install --global dotnet-ef
ENV PATH $PATH:/root/.dotnet/tools

COPY . .
RUN dotnet ef migrations bundle -o efbundle
RUN dotnet publish -c ${BUILD_CONFIGURATION} -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out /app/efbundle .

ENTRYPOINT ["dotnet", "ProjectsApi.dll"]
