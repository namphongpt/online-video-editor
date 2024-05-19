using MediaService.Dto;
using MediaService.Models;

namespace MediaService.Services;

public interface IMediaAssetService
{
    public Task<IEnumerable<MediaAsset>> GetAllAsync(string userId);
    public Task<MediaAsset?> GetMediaAssetAsync(Guid id);
    public Task<ContentTypedStream> DownloadMediaAsync(Guid id);
    public Task<MediaAsset> UploadMediaAsync(MediaAssetCreateDto mediaAssetCreateDto);
}
