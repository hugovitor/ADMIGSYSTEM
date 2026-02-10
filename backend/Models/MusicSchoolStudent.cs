using System.ComponentModel.DataAnnotations;

namespace ChurchManagement.Models;

public class MusicSchoolStudent
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
    
    public DateTime? BirthDate { get; set; }
    
    [MaxLength(100)]
    public string? ParentName { get; set; }
    
    [MaxLength(20)]
    public string? ParentPhone { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Instrument { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string Level { get; set; } = "Iniciante"; // Iniciante, Intermediário, Avançado
    
    [MaxLength(100)]
    public string? Teacher { get; set; }
    
    [MaxLength(20)]
    public string ClassType { get; set; } = "Individual"; // Individual, Grupo
    
    [MaxLength(100)]
    public string? ClassSchedule { get; set; }
    
    public decimal MonthlyFee { get; set; } = 0;
    
    [MaxLength(20)]
    public string PaymentStatus { get; set; } = "Em dia"; // Em dia, Pendente, Atrasado
    
    public DateTime? LastPaymentDate { get; set; }
    
    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
    
    [MaxLength(20)]
    public string Status { get; set; } = "Ativo"; // Ativo, Trancado, Concluído
    
    public string? Notes { get; set; }
    
    public string? Progress { get; set; }
    
    public int TotalClasses { get; set; } = 0;
    
    public int AttendedClasses { get; set; } = 0;
}
