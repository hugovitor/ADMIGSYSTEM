using ChurchManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace ChurchManagement.Data;

public static class DbInitializer
{
    public static async Task SeedData(AppDbContext context)
    {
        // Check if admin user already exists
        if (await context.Users.AnyAsync(u => u.Email == "admin@igreja.com"))
        {
            return;
        }
        
        // Create default admin user
        var adminUser = new User
        {
            Name = "Administrador",
            Email = "admin@igreja.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        
        context.Users.Add(adminUser);
        await context.SaveChangesAsync();
    }
}
