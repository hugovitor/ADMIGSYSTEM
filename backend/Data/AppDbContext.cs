using Microsoft.EntityFrameworkCore;
using ChurchManagement.Models;

namespace ChurchManagement.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<MusicSchoolStudent> MusicSchoolStudents { get; set; }
    public DbSet<JiuJitsuStudent> JiuJitsuStudents { get; set; }
    public DbSet<MensGroupMember> MensGroupMembers { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure unique constraints
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            
        modelBuilder.Entity<MusicSchoolStudent>()
            .HasIndex(m => m.Email)
            .IsUnique();
            
        modelBuilder.Entity<JiuJitsuStudent>()
            .HasIndex(j => j.Email)
            .IsUnique();
            
        modelBuilder.Entity<MensGroupMember>()
            .HasIndex(m => m.Email)
            .IsUnique();
    }
}
