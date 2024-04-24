using Microsoft.EntityFrameworkCore;
using ProjectsApi.Models;

namespace ProjectsApi.Services;

public class ProjectService(ProjectsContext projectsContext, IMessageService messageService) : IProjectService
{
    private readonly ProjectsContext _context = projectsContext;
    private readonly IMessageService _messageService = messageService;

    public async Task<Project?> GetProjectAsync(Guid id)
    {
        return await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Project>> GetProjectsAsync()
    {
        return await _context.Projects.ToListAsync();
    }

    public async Task<Project> CreateProjectAsync(Project project)
    {
        await _context.Projects.AddAsync(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task RequestRender(Project project)
    {
        await _messageService.SendMessageAsync(
            "video-render-queue",
            project.Id.ToString()
        );
    }
}
