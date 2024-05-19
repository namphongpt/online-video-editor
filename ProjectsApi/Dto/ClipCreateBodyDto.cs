namespace ProjectsApi.Dto;

/// <summary>
/// DTO for <see cref="ProjectsApi.Models.Clip"/>, which only concerns
/// relationless properties, i.e. the 'body' of the clip. May be used for
/// situations where the relation ID's are passed via other variables, in which
/// case it probably needs to be converted into a <see cref="ClipCreateDto"/>.
/// </summary>
public class ClipCreateBodyDto
{
    public Guid MediaAssetId { get; set; }
    public int OffsetStartMs { get; set; }
    public int OffsetEndMs { get; set; }
    public int StartTimeMs { get; set; }
}
