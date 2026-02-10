using System.ComponentModel.DataAnnotations;

namespace ChurchManagement.Models;

public class JiuJitsuStudent
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [Phone]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string Belt { get; set; } = "Branca"; // Branca, Azul, Roxa, Marrom, Preta
    
    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
    
    public string? Notes { get; set; }
}
