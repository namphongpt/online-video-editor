namespace ProjectsApi.Models;

public class Project
{
    public Guid Id { get; set; }
    public required string Title { get; set; }

    public required string CreatedBy { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    // TODO: this should have a Clip represnetation without Project
    //public virtual ICollection<Clip> Clips { get; set; }
}
