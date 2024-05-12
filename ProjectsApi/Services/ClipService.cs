using AutoMapper;

using Microsoft.EntityFrameworkCore;

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

    public async Task<Clip> CreateClipAsync(ClipCreateDto clipCreateDto)
    {
        var clip = _mapper.Map<Clip>(clipCreateDto);
        await _context.Clips.AddAsync(clip);
        await _context.SaveChangesAsync();
        return clip;
    }
}
