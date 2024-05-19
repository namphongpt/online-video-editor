namespace MediaService.Models;

public class MediaAsset
{
    public Guid Id { get; set; }
    public required string Filename { get; set; }
    public DateTime UploadedOn { get; set; }
    public required string UserId { get; set; }
}
