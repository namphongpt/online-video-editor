using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using ProjectsApi.Dto;
using ProjectsApi.Models;
using ProjectsApi.Services;
using ProjectsApi.Utils;

namespace ProjectsApi.Controllers;

[ApiController]
[Authorize]
public class ClipsController(IClipService clipService, IProjectService projectService) : ControllerBase
{
    private readonly IClipService _clipService = clipService;
    private readonly IProjectService _projectService = projectService;

    [HttpPost("Projects/{projectId}/Clips")]
    public async Task<ActionResult<Clip>> PostClip(Guid projectId, ClipCreateBodyDto clip)
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Forbid();
        }

        Project? project = await _projectService.GetProjectAsync(projectId);
        if (project is null)
        {
            return NotFound();
        }
        if (project.CreatedBy != userId)
        {
            return Forbid();
        }

        Clip createdClip = await _clipService.CreateClipAsync(projectId, clip);
        return CreatedAtAction(
            nameof(GetClip),
            new { id = createdClip.Id },
            createdClip
        );
    }

    [HttpGet("Clips/{id}")]
    public async Task<ActionResult<Clip>> GetClip(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        Clip? clip = await _clipService.GetClipAsync(id);
        if (clip is null)
        {
            return NotFound();
        }
        if (clip.Project.CreatedBy != userId)
        {
            return Forbid();
        }

        return Ok(clip);
    }

    [HttpGet("Projects/{projectId}/Clips")]
    public async Task<ActionResult<IList<Clip>>> GetClips(Guid projectId)
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        Project? project = await _projectService.GetProjectAsync(projectId);
        if (project is null)
        {
            return NotFound();
        }
        if (project.CreatedBy != userId)
        {
            return Forbid();
        }

        return Ok(await _clipService.GetProjectClipsAsync(project));
    }
}
