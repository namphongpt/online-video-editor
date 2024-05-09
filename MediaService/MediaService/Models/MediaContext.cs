using Microsoft.EntityFrameworkCore;

namespace MediaService.Models;

public class MediaContext : DbContext
{
    public MediaContext(DbContextOptions<MediaContext> options)
        : base(options) {}

    public MediaContext() {}

    public DbSet<MediaAsset> MediaAssets { get; set; }
}
