using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
    
    [MaxLength(14)]
    public string? Cpf { get; set; }
    
    public DateTime? BirthDate { get; set; }
    
    [MaxLength(200)]
    public string? Address { get; set; }
    
    [MaxLength(20)]
    public string Belt { get; set; } = "Branca"; // Branca, Azul, Roxa, Marrom, Preta
    
    public int Stripes { get; set; } = 0; // Fitas na faixa atual
    
    public DateTime? LastPromotionDate { get; set; }
    
    public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
    
    [Column(TypeName = "decimal(8,2)")]
    public decimal MonthlyFee { get; set; } = 0;
    
    public DateTime? LastPaymentDate { get; set; }
    
    [MaxLength(20)]
    public string PaymentStatus { get; set; } = "Em dia"; // Em dia, Atrasado, Inadimplente
    
    [MaxLength(50)]
    public string? EmergencyContact { get; set; }
    
    [MaxLength(20)]
    public string? EmergencyPhone { get; set; }
    
    [MaxLength(100)]
    public string? HealthConditions { get; set; }
    
    public string? Notes { get; set; }
    
    public List<JiuJitsuGraduation> Graduations { get; set; } = new List<JiuJitsuGraduation>();
    public List<JiuJitsuAttendance> Attendances { get; set; } = new List<JiuJitsuAttendance>();
    public List<JiuJitsuPayment> Payments { get; set; } = new List<JiuJitsuPayment>();
}

public class JiuJitsuGraduation
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public JiuJitsuStudent Student { get; set; } = null!;
    
    [MaxLength(20)]
    public string FromBelt { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string ToBelt { get; set; } = string.Empty;
    
    public int FromStripes { get; set; }
    public int ToStripes { get; set; }
    
    public DateTime GraduationDate { get; set; }
    
    [MaxLength(100)]
    public string? GraduatedBy { get; set; } // Professor que graduou
    
    public string? Notes { get; set; }
}

public class JiuJitsuAttendance
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public JiuJitsuStudent Student { get; set; } = null!;
    
    public DateTime Date { get; set; }
    
    [MaxLength(50)]
    public string ClassType { get; set; } = "Treino"; // Treino, Competição, Seminário
    
    public bool IsPresent { get; set; }
    
    public string? Notes { get; set; }
}

public class JiuJitsuPayment
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public JiuJitsuStudent Student { get; set; } = null!;
    
    public DateTime PaymentDate { get; set; }
    
    [Column(TypeName = "decimal(8,2)")]
    public decimal Amount { get; set; }
    
    [MaxLength(20)]
    public string PaymentMethod { get; set; } = "Dinheiro"; // Dinheiro, Cartão, PIX, Transferência
    
    public DateTime ReferenceMonth { get; set; } // Mês de referência do pagamento
    
    public string? Notes { get; set; }
}
