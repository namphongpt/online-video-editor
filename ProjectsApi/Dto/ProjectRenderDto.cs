namespace ProjectsApi.Dto;

public class ClipRenderDto
{
    public Guid MediaAssetId { get; set; }
    public int OffsetStartMs { get; set; }
    public int OffsetEndMs { get; set; }
    public int StartTimeMs { get; set; }
}

/// <summary>
/// DTO for all information belonging to a project which should be passed to
/// the video renderer.
/// </summary>
public class ProjectRenderDto
{
    public Guid ProjectId { get; set; }
    public required List<ClipRenderDto> Clips { get; set; }
}
