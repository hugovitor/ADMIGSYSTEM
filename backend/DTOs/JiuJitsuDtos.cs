using System.ComponentModel.DataAnnotations;

namespace ChurchManagement.DTOs;

public class JiuJitsuStudentDto
{
    public int? Id { get; set; }
    
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
    
    [Required]
    [MaxLength(20)]
    public string Belt { get; set; } = "Branca";
    
    public int Stripes { get; set; } = 0;
    
    public DateTime? LastPromotionDate { get; set; }
    
    public decimal MonthlyFee { get; set; } = 0;
    
    public DateTime? LastPaymentDate { get; set; }
    
    [MaxLength(20)]
    public string PaymentStatus { get; set; } = "Em dia";
    
    [MaxLength(50)]
    public string? EmergencyContact { get; set; }
    
    [MaxLength(20)]
    public string? EmergencyPhone { get; set; }
    
    [MaxLength(100)]
    public string? HealthConditions { get; set; }
    
    public string? Notes { get; set; }
}

public class JiuJitsuStudentDetailDto : JiuJitsuStudentDto
{
    public DateTime EnrollmentDate { get; set; }
    public bool IsActive { get; set; }
    public List<JiuJitsuGraduationDto> Graduations { get; set; } = new();
    public List<JiuJitsuAttendanceDto> RecentAttendances { get; set; } = new();
    public List<JiuJitsuPaymentDto> RecentPayments { get; set; } = new();
    public int? Age => BirthDate.HasValue ? 
        DateTime.Today.Year - BirthDate.Value.Year - (DateTime.Today < BirthDate.Value.AddYears(DateTime.Today.Year - BirthDate.Value.Year) ? 1 : 0) 
        : null;
}

public class JiuJitsuStatsDto
{
    public int TotalStudents { get; set; }
    public int ActiveStudents { get; set; }
    public int InactiveStudents { get; set; }
    public BeltDistributionDto BeltDistribution { get; set; } = new();
    public PaymentStatusDto PaymentStats { get; set; } = new();
    public AgeGroupDto AgeGroups { get; set; } = new();
    public decimal TotalMonthlyRevenue { get; set; }
    public int TotalGraduationsThisYear { get; set; }
    public AttendanceRateDto AttendanceRate { get; set; } = new();
}

public class BeltDistributionDto
{
    public int Branca { get; set; }
    public int Azul { get; set; }
    public int Roxa { get; set; }
    public int Marrom { get; set; }
    public int Preta { get; set; }
}

public class PaymentStatusDto
{
    public int EmDia { get; set; }
    public int Atrasado { get; set; }
    public int Inadimplente { get; set; }
    public decimal TotalReceived { get; set; }
    public decimal TotalPending { get; set; }
}

public class AgeGroupDto
{
    public int Kids { get; set; } // 4-12 anos
    public int Teens { get; set; } // 13-17 anos
    public int Adults { get; set; } // 18-39 anos
    public int Seniors { get; set; } // 40+ anos
    public int Unknown { get; set; } // Sem data de nascimento
}

public class AttendanceRateDto
{
    public decimal OverallRate { get; set; }
    public decimal LastWeekRate { get; set; }
    public decimal LastMonthRate { get; set; }
}

public class JiuJitsuGraduationDto
{
    public int Id { get; set; }
    public string FromBelt { get; set; } = string.Empty;
    public string ToBelt { get; set; } = string.Empty;
    public int FromStripes { get; set; }
    public int ToStripes { get; set; }
    public DateTime GraduationDate { get; set; }
    public string? GraduatedBy { get; set; }
    public string? Notes { get; set; }
}

public class CreateGraduationDto
{
    [Required]
    public int StudentId { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string ToBelt { get; set; } = string.Empty;
    
    public int ToStripes { get; set; } = 0;
    
    public DateTime GraduationDate { get; set; } = DateTime.Now;
    
    [MaxLength(100)]
    public string? GraduatedBy { get; set; }
    
    public string? Notes { get; set; }
}

public class JiuJitsuAttendanceDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string ClassType { get; set; } = string.Empty;
    public bool IsPresent { get; set; }
    public string? Notes { get; set; }
}

public class CreateAttendanceDto
{
    [Required]
    public int StudentId { get; set; }
    
    public DateTime Date { get; set; } = DateTime.Today;
    
    [MaxLength(50)]
    public string ClassType { get; set; } = "Treino";
    
    public bool IsPresent { get; set; } = true;
    
    public string? Notes { get; set; }
}

public class BulkAttendanceDto
{
    public DateTime Date { get; set; } = DateTime.Today;
    
    [MaxLength(50)]
    public string ClassType { get; set; } = "Treino";
    
    [Required]
    public List<StudentAttendanceDto> Students { get; set; } = new();
}

public class StudentAttendanceDto
{
    public int StudentId { get; set; }
    public bool IsPresent { get; set; }
    public string? Notes { get; set; }
}

public class JiuJitsuPaymentDto
{
    public int Id { get; set; }
    public DateTime PaymentDate { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime ReferenceMonth { get; set; }
    public string? Notes { get; set; }
}

public class CreatePaymentDto
{
    [Required]
    public int StudentId { get; set; }
    
    public DateTime PaymentDate { get; set; } = DateTime.Now;
    
    [Required]
    public decimal Amount { get; set; }
    
    [MaxLength(20)]
    public string PaymentMethod { get; set; } = "Dinheiro";
    
    public DateTime ReferenceMonth { get; set; } = DateTime.Today;
    
    public string? Notes { get; set; }
}