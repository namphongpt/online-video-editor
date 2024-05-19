using AutoMapper;

using Microsoft.EntityFrameworkCore;

using ProjectsApi.Dto;
using ProjectsApi.Models;

namespace ProjectsApi.Services;

public class ProjectService : IProjectService
{
    private readonly ProjectsContext _context;
    private readonly IMessageService _messageService;
    private readonly IMapper _mapper;

    public ProjectService(ProjectsContext projectsContext, IMessageService messageService)
    {
        _context = projectsContext;
        _messageService = messageService;

        _mapper = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ProjectCreateDto, Project>()
                .ForMember(
                    dest => dest.CreatedBy,
                    opt => opt.MapFrom((_, _, _, context) => context.Items["UserId"])
                );
        }).CreateMapper();
    }

    public async Task<Project?> GetProjectAsync(Guid id)
    {
        return await _context.Projects
                             //.Include(p => p.Clips)
                             .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Project>> GetProjectsAsync(string userId)
    {
        return await _context.Projects.Where(p => p.CreatedBy == userId)
                                      .ToListAsync();
    }

    public async Task<Project> CreateProjectAsync(ProjectCreateDto projectCreateDto, string userId)
    {
        var project = _mapper.Map<Project>(
            projectCreateDto,
            opt => opt.Items["UserId"] = userId
        );

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
