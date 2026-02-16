using System.ComponentModel.DataAnnotations;

namespace ChurchManagement.DTOs;

public class ChildPresentationDto
{
    public int? Id { get; set; }
    
    // Dados da Criança
    [Required]
    [MaxLength(100)]
    public string ChildName { get; set; } = string.Empty;
    
    [Required]
    public DateTime BirthDate { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Gender { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? BirthPlace { get; set; }
    
    // Dados dos Pais/Responsáveis
    [Required]
    [MaxLength(100)]
    public string FatherName { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? FatherProfession { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string MotherName { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? MotherProfession { get; set; }
    
    // Dados da Apresentação
    [Required]
    public DateTime PresentationDate { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Pastor { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? BiblicalVerse { get; set; } = "\"Deixai vir a mim os pequeninos\" - Mateus 19:14";
    
    [MaxLength(500)]
    public string? SpecialMessage { get; set; }
    
    // Dados de Contato
    [MaxLength(200)]
    public string? Address { get; set; }
    
    [MaxLength(50)]
    public string? City { get; set; }
    
    [MaxLength(20)]
    public string? Phone { get; set; }
    
    [EmailAddress]
    [MaxLength(100)]
    public string? Email { get; set; }
    
    // Dados da Igreja
    [MaxLength(100)]
    public string ChurchName { get; set; } = "Igreja";
    
    [MaxLength(200)]
    public string? ChurchAddress { get; set; }
    
    public string? Notes { get; set; }
    
    // Status do certificado
    public bool CertificateGenerated { get; set; } = false;
    
    // Propriedades calculadas
    public int? AgeInMonths => BirthDate != DateTime.MinValue ? 
        (DateTime.Today.Year - BirthDate.Year) * 12 + DateTime.Today.Month - BirthDate.Month : null;
}

public class ChildPresentationDetailDto : ChildPresentationDto
{
    public bool CertificateGenerated { get; set; }
    public string? CertificatePath { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}

public class GenerateCertificateDto
{
    [Required]
    public int ChildPresentationId { get; set; }
    
    [MaxLength(100)]
    public string? CustomChurchName { get; set; }
    
    [MaxLength(200)]
    public string? CustomChurchAddress { get; set; }
    
    [MaxLength(200)]
    public string? CustomBiblicalVerse { get; set; }
    
    [MaxLength(500)]
    public string? CustomMessage { get; set; }
    
    [MaxLength(100)]
    public string? CustomPastor { get; set; }
}

public class ChildPresentationStatsDto
{
    public int TotalPresentations { get; set; }
    public int PresentationsThisYear { get; set; }
    public int PresentationsThisMonth { get; set; }
    public GenderStatsDto GenderStats { get; set; } = new();
    public AgeStatsDto AgeStats { get; set; } = new();
    public MonthlyStatsDto MonthlyStats { get; set; } = new();
    public int CertificatesGenerated { get; set; }
    public int PendingCertificates { get; set; }
}

public class GenderStatsDto
{
    public int Boys { get; set; }
    public int Girls { get; set; }
}

public class AgeStatsDto
{
    public int Under1Year { get; set; } // 0-11 meses
    public int Age1to2 { get; set; } // 1-2 anos
    public int Age3to5 { get; set; } // 3-5 anos
    public int Over5Years { get; set; } // 5+ anos
}

public class MonthlyStatsDto
{
    public int January { get; set; }
    public int February { get; set; }
    public int March { get; set; }
    public int April { get; set; }
    public int May { get; set; }
    public int June { get; set; }
    public int July { get; set; }
    public int August { get; set; }
    public int September { get; set; }
    public int October { get; set; }
    public int November { get; set; }
    public int December { get; set; }
}