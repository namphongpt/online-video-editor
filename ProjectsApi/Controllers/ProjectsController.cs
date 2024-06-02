using System.Security.Claims;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

using ProjectsApi.Dto;
using ProjectsApi.Models;
using ProjectsApi.Services;
using ProjectsApi.Utils;

namespace ProjectsApi.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectsService)
    {
        _projectService = projectsService;
    }

    // TODO: dan clips ook beveiligen
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        return Ok(await _projectService.GetProjectsAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetProject(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        Project? project = await _projectService.GetProjectAsync(id);
        if (project is null)
        {
            return NotFound();
        }

        if (project.CreatedBy != userId)
        {
            return Forbid();
        }

        return Ok(project);
    }

    // TODO: hier ook een DTO gebruiken want Clips is niet included
    [HttpPost]
    public async Task<ActionResult<Project>> PostProject(ProjectCreateDto project)
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var createdProject = await _projectService.CreateProjectAsync(
            project,
            userId
        );
        return CreatedAtAction(
            nameof(GetProject),
            new { id = createdProject.Id },
            createdProject
        );
    }

    [HttpPost("{id}/render")]
    public async Task<ActionResult> RenderProject(Guid id)
    {
        string? userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        Project? project = await _projectService.GetProjectAsync(id);
        if (project is null)
        {
            return NotFound();
        }
        if (project.CreatedBy != userId)
        {
            return Forbid();
        }

        await _projectService.RequestRender(project);

        return Ok();
    }
}
