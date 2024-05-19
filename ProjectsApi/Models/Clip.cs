using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectsApi.Models;

[Table("Clips")]
public class Clip
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public required Project Project { get; set; }

    public Guid MediaAssetId { get; set; }
    public int OffsetStartMs { get; set; }
    public int OffsetEndMs { get; set; }
    public int StartTimeMs { get; set; }
}
