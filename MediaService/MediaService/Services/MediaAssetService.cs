using System.Net.Mime;

using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;

using MediaService.Dto;
using MediaService.Models;

using Microsoft.EntityFrameworkCore;

namespace MediaService.Services;

public class MediaAssetService : IMediaAssetService
{
    private readonly BlobContainerClient _blobContainerClient;
    private readonly MediaContext _context;

    public MediaAssetService(BlobServiceClient blobServiceClient, MediaContext mediaContext)
    {
        _blobContainerClient = blobServiceClient.GetBlobContainerClient("media-assets");
        _context = mediaContext;
    }

    public async Task<IEnumerable<MediaAsset>> GetAllAsync(string userId)
    {
        return await _context.MediaAssets.Where(m => m.UserId == userId)
                                         .ToListAsync();
    }

    public Task<MediaAsset?> GetMediaAssetAsync(Guid id)
    {
        return _context.MediaAssets.FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<ContentTypedStream> DownloadMediaAsync(Guid id)//MediaAsset mediaAsset)
    {
        var blobClient = _blobContainerClient.GetBlockBlobClient(id.ToString());
        var contentType = (await blobClient.GetPropertiesAsync()).Value.ContentType;

        Stream blobStream = await blobClient.OpenReadAsync();

        return new ContentTypedStream(blobStream, contentType);
    }

    public async Task<MediaAsset> UploadMediaAsync(MediaAssetCreateDto mediaAssetCreateDto)
    {
        Guid mediaAssetId = Guid.NewGuid();
        BlobClient client = _blobContainerClient.GetBlobClient(mediaAssetId.ToString());

        await client.UploadAsync(mediaAssetCreateDto.Stream);

        MediaAsset mediaAsset = new ()
        {
            Id = mediaAssetId,
            Filename = mediaAssetCreateDto.Filename,
            UploadedOn = DateTime.UtcNow,
            UserId = mediaAssetCreateDto.UserId
        };

        await _context.MediaAssets.AddAsync(mediaAsset);
        await _context.SaveChangesAsync();

        return mediaAsset;
    }
}
