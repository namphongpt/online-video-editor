using System.Collections.Frozen;

using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;

using VideoRenderWorker.Dto;

namespace VideoRenderWorker.Services;

public class VideoRenderService
{
    private readonly IMessageService _messageService;
    private readonly BlobContainerClient _mediaAssetContainerClient;
    private readonly BlobContainerClient _renderedVideoContainerClient;

    public VideoRenderService(BlobServiceClient blobServiceClient, IMessageService messageService)
    {
        _mediaAssetContainerClient = blobServiceClient.GetBlobContainerClient("media-assets");
        _renderedVideoContainerClient = blobServiceClient.GetBlobContainerClient("rendered-videos");
        _messageService = messageService;
    }

    private static string PathForMediaAsset(Guid mediaAssetId)
    {
        return Path.Combine(Path.GetTempPath(), mediaAssetId.ToString());
    }

    private async Task DownloadMediaAssetAsync(Guid mediaAssetId)
    {
        var blobClient = _mediaAssetContainerClient.GetBlockBlobClient(mediaAssetId.ToString());

        var x = await blobClient.DownloadToAsync(PathForMediaAsset(mediaAssetId));

    }

    public async Task RenderVideo(ProjectRenderDto project)
    {
        var uniqueMediaAssets = project.Clips.Select(c => c.MediaAssetId).ToFrozenSet();
        foreach (Guid mediaAssetId in uniqueMediaAssets)
        {
            await DownloadMediaAssetAsync(mediaAssetId);
        }

        // For now, we'll just use the first video for prototyping purposes.
        var id = Guid.NewGuid();
        var blobClient = _renderedVideoContainerClient.GetBlobClient(id.ToString());
        await blobClient.UploadAsync(PathForMediaAsset(uniqueMediaAssets.First()));

        _messageService.PublishMessage("video-rendered", id.ToString());

        foreach (Guid mediaAssetId in uniqueMediaAssets)
        {
            File.Delete(PathForMediaAsset(mediaAssetId));
        }
        // TODO: download media assets
        // TODO: combine them using ffmpeg (for now just one)
        // TODO: upload this video
        // TODO: publish message that it was rendered
    }
}
