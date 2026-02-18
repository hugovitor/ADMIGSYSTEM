using ChurchManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace ChurchManagement.Data;

public static class DbInitializer
{
    public static async Task SeedData(AppDbContext context)
    {
        try
        {
            // Wait for migrations to complete (don't use EnsureCreated with migrations)
            // The Program.cs already handles database creation via migrations
            
            // Check if admin user already exists
            if (await context.Users.AnyAsync(u => u.Email == "admin@igreja.com"))
            {
                // Fix PaymentStatus for existing JiuJitsu students with empty PaymentStatus
                await FixJiuJitsuStudentData(context);
                return;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error checking existing users: {ex.Message}");
            // Continue with seeding even if check fails
        }
        
        try
        {
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
        
            // Fix PaymentStatus for existing JiuJitsu students
            await FixJiuJitsuStudentData(context);
            
            Console.WriteLine("Admin user created successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating admin user: {ex.Message}");
            // Continue execution - app should still work even if seeding fails
        }
    }

    private static async Task FixJiuJitsuStudentData(AppDbContext context)
    {
        var studentsWithEmptyPaymentStatus = await context.JiuJitsuStudents
            .Where(s => s.PaymentStatus == string.Empty || s.PaymentStatus == null)
            .ToListAsync();
        
        foreach (var student in studentsWithEmptyPaymentStatus)
        {
            student.PaymentStatus = "Em dia";
        }
        
        if (studentsWithEmptyPaymentStatus.Count > 0)
        {
            await context.SaveChangesAsync();
        }
    }
}
