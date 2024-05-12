using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;

using ProjectsApi.Models;
using ProjectsApi.Services;

namespace ProjectsApi.Controllers;

[ApiController]
public class ClipsController(IClipService clipService, IProjectService projectService) : ControllerBase
{
    private readonly IClipService _clipService = clipService;
    private readonly IProjectService _projectService = projectService;

    // TODO: should this route be changed to Projects/{projectId}/Clips ?
    [HttpPost("Projects/{projectId}/Clips")]
    public async Task<ActionResult<Clip>> PostClip(ClipCreateDto clip)
    {
        Clip createdClip = await _clipService.CreateClipAsync(clip);
        return CreatedAtAction(
            nameof(GetClip),
            new { id = createdClip.Id },
            createdClip
        );
    }

    [HttpGet("Clips/{id}")]
    public async Task<ActionResult<Clip>> GetClip(Guid id)
    {
        Clip? clip = await _clipService.GetClipAsync(id);
        if (clip is null)
        {
            return NotFound();
        }
        else
        {
            return Ok(clip);
        }
    }

    [HttpGet("Projects/{projectId}/Clips")]
    public async Task<ActionResult<IList<Clip>>> GetClips(Guid projectId)
    {
        Project? project = await _projectService.GetProjectAsync(projectId);
        if (project == null)
        {
            return NotFound();
        }

        return Ok(await _clipService.GetProjectClipsAsync(project));
    }
}
