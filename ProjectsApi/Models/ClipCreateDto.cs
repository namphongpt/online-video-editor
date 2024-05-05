namespace ProjectsApi.Models;

public class ClipCreateDto
{
    public Guid ProjectId { get; set; }
    public Guid MediaAssetId { get; set; }
    public int OffsetStartMs { get; set; }
    public int OffsetEndMs { get; set; }
    public int StartTimeMs { get; set; }
}
