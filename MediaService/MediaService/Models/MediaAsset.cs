namespace MediaService.Models;

public class MediaAsset
{
    public Guid Id { get; set; }
    public string Filename { get; set; }
    public DateTime UploadedOn { get; set; }
    public DateTime LastAccessedOn { get; set; }
}

