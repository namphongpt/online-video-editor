using System.Diagnostics;

using Microsoft.EntityFrameworkCore;

namespace ProjectsApi.Models;

public class ProjectsContext : DbContext
{

    public ProjectsContext(DbContextOptions<ProjectsContext> options) : base(options) {}
    public ProjectsContext() {}

    public DbSet<Project> Projects { get; set; } = null!;
    public DbSet<Clip> Clips { get; set; } = null!;
}
