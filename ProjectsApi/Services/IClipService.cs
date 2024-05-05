using ProjectsApi.Models;

namespace ProjectsApi.Services;

public interface IClipService
{
    public Task<Clip?> GetClipAsync(Guid id);
    public Task<Clip> CreateClipAsync(ClipCreateDto clipCreateDto);
    public Task<IList<Clip>> GetProjectClipsAsync(Project project);
}
