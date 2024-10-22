using AutoMapper;

using Microsoft.EntityFrameworkCore;

using ProjectsApi.Dto;
using ProjectsApi.Models;

namespace ProjectsApi.Services;

public class ClipService : IClipService
{
    private readonly ProjectsContext _context;
    private readonly IMapper _mapper;

    public ClipService(ProjectsContext projectsContext)
    {
        _context = projectsContext;
        var configuration = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<ClipCreateDto, Clip>();
            cfg.CreateMap<ClipCreateBodyDto, ClipCreateDto>()
               .ForMember(
                    dest => dest.ProjectId,
                    opt => opt.MapFrom((_, _, _, context) => context.Items["ProjectId"])
                );
        });
        _mapper = configuration.CreateMapper();
    }

    public async Task<Clip?> GetClipAsync(Guid id)
    {
        return await _context.Clips.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IList<Clip>> GetProjectClipsAsync(Project project)
    {
        return await _context.Clips.Where(c => c.Project == project)
                                   .ToListAsync();
    }

    public async Task<Clip> CreateClipAsync(Guid projectId, ClipCreateBodyDto clipCreateBodyDto)
    {
        var clipCreateDto = _mapper.Map<ClipCreateDto>(
            clipCreateBodyDto,
            opt => opt.Items["ProjectId"] = projectId
        );
        var clip = _mapper.Map<Clip>(clipCreateDto);

        await _context.Clips.AddAsync(clip);
        await _context.SaveChangesAsync();

        return clip;
    }
}
