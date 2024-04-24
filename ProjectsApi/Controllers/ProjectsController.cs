using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ProjectsApi.Models;
using ProjectsApi.Services;

namespace ProjectsApi.Controllers;

[Route("[controller]")]
[ApiController]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectsService)
    {
        _projectService = projectsService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
    {
        return Ok(await _projectService.GetProjectsAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetProject(Guid id)
    {
        Project? project = await _projectService.GetProjectAsync(id);
        if (project is null)
        {
            return NotFound();
        }
        else
        {
            return Ok(project);
        }
    }

    [HttpPost]
    public async Task<ActionResult<Project>> PostProject(Project project)
    {
        await _projectService.CreateProjectAsync(project);
        return CreatedAtAction(
            nameof(GetProject),
            new { id = project.Id },
            project
        );
    }

    [HttpPost("{id}/render")]
    public async Task<ActionResult> RenderProject(Guid id)
    {
        Project? project = await _projectService.GetProjectAsync(id);
        if (project is null)
        {
            return NotFound();
        }

        await _projectService.RequestRender(project);

        return Ok();
    }
}
