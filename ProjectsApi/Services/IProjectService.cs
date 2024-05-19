using ProjectsApi.Dto;
using ProjectsApi.Models;

namespace ProjectsApi.Services;

public interface IProjectService
{
    public Task<Project?> GetProjectAsync(Guid id);
    public Task<IEnumerable<Project>> GetProjectsAsync(string userId);
    public Task<Project> CreateProjectAsync(ProjectCreateDto projectCreateDto, string userId);
    public Task RequestRender(Project project);
}
