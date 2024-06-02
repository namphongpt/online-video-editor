using AutoMapper;

using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
            cfg.CreateMap<Clip, ClipRenderDto>().ReverseMap();
            cfg.CreateMap<Project, ProjectRenderDto>()
               .ForMember(dest => dest.ProjectId, opt => opt.MapFrom(src => src.Id))
               .ForMember(
                    dest => dest.Clips,
                    opt => opt.MapFrom((_, _, _, context) => context.Items["Clips"])
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
        var clips = await _context.Clips.Where(c => c.Project == project)
                                        .ToListAsync();
        var projectRenderBody = _mapper.Map<ProjectRenderDto>(
            project,
            opt => opt.Items["Clips"] = clips
        );

        await _messageService.SendMessageAsync(
            "video-render-queue",
            JsonSerializer.Serialize(projectRenderBody)
        );
    }
}
