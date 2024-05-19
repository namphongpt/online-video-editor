using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

using MediaService.Dto;
using MediaService.Models;
using MediaService.Services;
using MediaService.Utils;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MediaService.MediaAssetController;

[ApiController]
[Authorize]
public class MediaAssetController(IMediaAssetService mediaAssetService) : ControllerBase
{
    private readonly IMediaAssetService _mediaAssetService = mediaAssetService;

    [HttpGet("MediaAssets/{id}/Download")]
    public async Task<IActionResult> Download(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        MediaAsset? mediaAsset = await _mediaAssetService.GetMediaAssetAsync(id);
        if (mediaAsset is null)
        {
            return NotFound();
        }
        if (mediaAsset.UserId != userId)
        {
            return Forbid();
        }

        var download = await _mediaAssetService.DownloadMediaAsync(id);
        return new FileStreamResult(download.Stream, download.ContentType)
        {
            EnableRangeProcessing = true
        };
    }

    [HttpGet("MediaAssets")]
    public async Task<ActionResult<IEnumerable<MediaAsset>>> GetMediaAssets()
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        return Ok(await _mediaAssetService.GetAllAsync(userId));
    }

    [HttpPost("MediaAssets")]
    [RequestFormLimits(MultipartBodyLengthLimit = 250_000_000)]
    [RequestSizeLimit(250_000_000)]
    public async Task<IActionResult> Upload(IFormFile mediaFile)
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        await using Stream stream = mediaFile.OpenReadStream();

        return Ok(
            await _mediaAssetService.UploadMediaAsync(
                new MediaAssetCreateDto(stream, mediaFile.FileName, userId)
            )
        );
    }
}
