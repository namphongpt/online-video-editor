using ProjectsApi.Models;

namespace ProjectsApi.Services;

public interface IProjectService
{
    public Task<Project?> GetProjectAsync(Guid id);
    public Task<IEnumerable<Project>> GetProjectsAsync();
    public Task<Project> CreateProjectAsync(Project project);
}
