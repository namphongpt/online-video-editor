using MediaService.Models;

namespace MediaService.Services;

public interface IMediaAssetService
{
    public Task<IEnumerable<MediaAsset>> GetAllAsync();
    public Task<ContentTypedStream> DownloadMediaAsync(Guid id);
    public Task<MediaAsset> UploadMediaAsync(MediaAssetCreateDto mediaAssetCreateDto);
}
