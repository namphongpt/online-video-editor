using ProjectsApi.Dto;
using ProjectsApi.Models;

namespace ProjectsApi.Services;

public interface IClipService
{
    public Task<Clip?> GetClipAsync(Guid id);
    public Task<Clip> CreateClipAsync(Guid projectId, ClipCreateBodyDto clipCreateBodyDto);
    public Task<IList<Clip>> GetProjectClipsAsync(Project project);
}
