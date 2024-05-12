using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

using MediaService.Models;
using MediaService.Services;

using Microsoft.AspNetCore.Mvc;

namespace MediaService.MediaAssetController;

[ApiController]
public class MediaAssetController : ControllerBase
{
    // TODO: naar interface
    private readonly IMediaAssetService _mediaAssetService;

    public MediaAssetController(IMediaAssetService mediaAssetService)
    {
        _mediaAssetService = mediaAssetService;
    }

    [HttpGet("MediaAssets/{id}/Download")]
    public async Task<IActionResult> Download(Guid id)
    {
        var x = await _mediaAssetService.DownloadMediaAsync(id);
        return new FileStreamResult(x.Stream, x.ContentType)
        {
            EnableRangeProcessing = true
        };
    }

    [HttpGet("MediaAssets")]
    public async Task<ActionResult<IEnumerable<MediaAsset>>> GetMediaAssets()
    {
        return Ok(await _mediaAssetService.GetAllAsync());
    }

    [HttpPost("MediaAssets")]
    [RequestFormLimits(MultipartBodyLengthLimit = 500_000_000)]
    [RequestSizeLimit(500_000_000)]
    public async Task<IActionResult> Upload(IFormFile mediaFile)
    {
        await using Stream stream = mediaFile.OpenReadStream();

        return Ok(
            await _mediaAssetService.UploadMediaAsync(
                new MediaAssetCreateDto(stream, mediaFile.FileName)
            )
        );
        
    }
}
