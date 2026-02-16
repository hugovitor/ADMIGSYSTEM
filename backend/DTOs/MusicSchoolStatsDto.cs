using System.ComponentModel.DataAnnotations;

namespace ChurchManagement.DTOs;

public class MusicSchoolStatsDto
{
    public int TotalStudents { get; set; }
    public int ActiveStudents { get; set; }
    public int InactiveStudents { get; set; }
    public Dictionary<string, int> StudentsByInstrument { get; set; } = new();
    public Dictionary<string, int> StudentsByLevel { get; set; } = new();
    public Dictionary<string, int> StudentsByPaymentStatus { get; set; } = new();
    public decimal TotalMonthlyRevenue { get; set; }
    public int StudentsWithPendingPayment { get; set; }
}

public class MusicSchoolPreRegistrationRequestDto
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
    public string Name { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email deve ter um formato válido")]
    [MaxLength(100, ErrorMessage = "Email deve ter no máximo 100 caracteres")]
    public string Email { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Telefone é obrigatório")]
    [Phone(ErrorMessage = "Telefone deve ter um formato válido")]
    [MaxLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
    public string Phone { get; set; } = string.Empty;
    
    public DateTime? BirthDate { get; set; }
    
    [MaxLength(100, ErrorMessage = "Nome do responsável deve ter no máximo 100 caracteres")]
    public string? ParentName { get; set; }
    
    [EmailAddress(ErrorMessage = "Email do responsável deve ter um formato válido")]
    [MaxLength(100, ErrorMessage = "Email do responsável deve ter no máximo 100 caracteres")] 
    public string? ParentEmail { get; set; }
    
    [Phone(ErrorMessage = "Telefone do responsável deve ter um formato válido")]
    [MaxLength(20, ErrorMessage = "Telefone do responsável deve ter no máximo 20 caracteres")]
    public string? ParentPhone { get; set; }
    
    [MaxLength(200, ErrorMessage = "Endereço deve ter no máximo 200 caracteres")]
    public string? Address { get; set; }
    
    [MaxLength(100, ErrorMessage = "Bairro deve ter no máximo 100 caracteres")]
    public string? Neighborhood { get; set; }
    
    [MaxLength(100, ErrorMessage = "Cidade deve ter no máximo 100 caracteres")]
    public string? City { get; set; }
    
    [MaxLength(2, ErrorMessage = "Estado deve ter no máximo 2 caracteres")]
    public string? State { get; set; }
    
    [MaxLength(10, ErrorMessage = "CEP deve ter no máximo 10 caracteres")]
    public string? ZipCode { get; set; }
    
    [Required(ErrorMessage = "Instrumento é obrigatório")]
    [MaxLength(50, ErrorMessage = "Instrumento deve ter no máximo 50 caracteres")]
    public string Instrument { get; set; } = string.Empty;
    
    [MaxLength(20, ErrorMessage = "Nível deve ter no máximo 20 caracteres")]
    public string Level { get; set; } = "Iniciante";
    
    [MaxLength(20, ErrorMessage = "Tipo de aula deve ter no máximo 20 caracteres")]
    public string PreferredClassType { get; set; } = "Individual";
    
    [MaxLength(100, ErrorMessage = "Horário preferido deve ter no máximo 100 caracteres")]
    public string? PreferredSchedule { get; set; }
    
    public bool HasMusicalExperience { get; set; } = false;
    
    [MaxLength(500, ErrorMessage = "Experiência musical deve ter no máximo 500 caracteres")]
    public string? MusicalExperience { get; set; }
    
    [MaxLength(500, ErrorMessage = "Perguntas devem ter no máximo 500 caracteres")]
    public string? Questions { get; set; }
}

public class MusicSchoolPreRegistrationResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string? ParentName { get; set; }
    public string? ParentEmail { get; set; }
    public string? ParentPhone { get; set; }
    public string? Address { get; set; }
    public string? Neighborhood { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string Instrument { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string PreferredClassType { get; set; } = string.Empty;
    public string? PreferredSchedule { get; set; }
    public bool HasMusicalExperience { get; set; }
    public string? MusicalExperience { get; set; }
    public string? Questions { get; set; }
    public DateTime PreRegistrationDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? ContactDate { get; set; }
    public string? AdminNotes { get; set; }
    public bool IsProcessed { get; set; }
}
