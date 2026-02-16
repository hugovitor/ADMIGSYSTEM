using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChurchManagement.Models;

public class ChildPresentation
{
    public int Id { get; set; }
    
    // Dados da Criança
    [Required]
    [MaxLength(100)]
    public string ChildName { get; set; } = string.Empty;
    
    [Required]
    public DateTime BirthDate { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Gender { get; set; } = string.Empty; // Masculino, Feminino
    
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
    
    // Controle
    public bool CertificateGenerated { get; set; } = false;
    
    public string? CertificatePath { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public string? Notes { get; set; }
    
    public bool IsActive { get; set; } = true;
}