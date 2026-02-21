using System.ComponentModel.DataAnnotations;

namespace ChurchManagement.Models;

public class MusicSchoolPreRegistration
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
    
    public DateTime? BirthDate { get; set; }
    
    [MaxLength(100)]
    public string? ParentName { get; set; }
    
    [EmailAddress]
    [MaxLength(100)] 
    public string? ParentEmail { get; set; }
    
    [MaxLength(20)]
    public string? ParentPhone { get; set; }
    
    [MaxLength(200)]
    public string? Address { get; set; }
    
    [MaxLength(100)] 
    public string? Neighborhood { get; set; }
    
    [MaxLength(100)]
    public string? City { get; set; }
    
    [MaxLength(2)]
    public string? State { get; set; }
    
    [MaxLength(10)]
    public string? ZipCode { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Instrument { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string Level { get; set; } = "Iniciante"; // Iniciante, Intermediário, Avançado
    
    [MaxLength(20)]
    public string PreferredClassType { get; set; } = "Individual"; // Individual, Grupo
    
    [MaxLength(100)]
    public string? PreferredSchedule { get; set; }
    
    public bool HasMusicalExperience { get; set; } = false;
    
    [MaxLength(500)]
    public string? MusicalExperience { get; set; }
    
    [MaxLength(500)]
    public string? Questions { get; set; } // Qualquer pergunta ou observação
    
    public DateTime PreRegistrationDate { get; set; } = DateTime.UtcNow;
    
    [MaxLength(20)]
    public string Status { get; set; } = "Pendente"; // Pendente, Contatado, Matriculado, Rejeitado
    
    public DateTime? ContactDate { get; set; }
    
    public string? AdminNotes { get; set; }
    
    public bool IsProcessed { get; set; } = false;
}