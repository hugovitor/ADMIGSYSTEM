using System.ComponentModel.DataAnnotations;

namespace ChurchManagement.Models;

public class MensGroupMember
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
    
    public DateTime JoinDate { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
    
    [MaxLength(100)]
    public string? Role { get; set; } // Ex: Líder, Membro, etc.
    
    public string? Notes { get; set; }
}
