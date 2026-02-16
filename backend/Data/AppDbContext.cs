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
    public DbSet<MusicSchoolPreRegistration> MusicSchoolPreRegistrations { get; set; }
    public DbSet<JiuJitsuStudent> JiuJitsuStudents { get; set; }
    public DbSet<JiuJitsuGraduation> JiuJitsuGraduations { get; set; }
    public DbSet<JiuJitsuAttendance> JiuJitsuAttendances { get; set; }
    public DbSet<JiuJitsuPayment> JiuJitsuPayments { get; set; }
    public DbSet<MensGroupMember> MensGroupMembers { get; set; }
    public DbSet<Member> Members { get; set; }
    public DbSet<FamilyMember> FamilyMembers { get; set; }
    public DbSet<ChildPresentation> ChildPresentations { get; set; }
    
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
            
        modelBuilder.Entity<MusicSchoolPreRegistration>()
            .HasIndex(m => m.Email)
            .IsUnique();
            
        modelBuilder.Entity<JiuJitsuStudent>()
            .HasIndex(j => j.Email)
            .IsUnique();
            
        modelBuilder.Entity<MensGroupMember>()
            .HasIndex(m => m.Email)
            .IsUnique();

        modelBuilder.Entity<Member>()
            .HasIndex(m => m.Email)
            .IsUnique();

        // Configure JiuJitsu relationships
        modelBuilder.Entity<JiuJitsuGraduation>()
            .HasOne(g => g.Student)
            .WithMany(s => s.Graduations)
            .HasForeignKey(g => g.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JiuJitsuAttendance>()
            .HasOne(a => a.Student)
            .WithMany(s => s.Attendances)
            .HasForeignKey(a => a.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JiuJitsuPayment>()
            .HasOne(p => p.Student)
            .WithMany(s => s.Payments)
            .HasForeignKey(p => p.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Member relationships
        modelBuilder.Entity<FamilyMember>()
            .HasOne(f => f.Member)
            .WithMany(m => m.FamilyMembers)
            .HasForeignKey(f => f.MemberId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
