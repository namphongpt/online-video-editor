namespace ProjectsApi.Models;

public class Project
{
    public Guid Id { get; set; }
    public string Title { get; set; }

    // TODO: this should have a Clip represnetation without Project
    //public virtual ICollection<Clip> Clips { get; set; }
}
