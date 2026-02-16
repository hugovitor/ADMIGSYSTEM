using System.ComponentModel.DataAnnotations;

namespace ChurchManagement.DTOs;

public class MemberDto
{
    public int? Id { get; set; }
    
    // Dados Pessoais
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
    
    [MaxLength(14)]
    public string? Cpf { get; set; }
    
    [MaxLength(20)]
    public string? Rg { get; set; }
    
    public DateTime? BirthDate { get; set; }
    
    [MaxLength(20)]
    public string Gender { get; set; } = "Não informado";
    
    [MaxLength(20)]
    public string MaritalStatus { get; set; } = "Solteiro(a)";
    
    [MaxLength(50)]
    public string? Profession { get; set; }
    
    [MaxLength(50)]
    public string? Education { get; set; }
    
    public string? PhotoPath { get; set; }
    
    // Dados de Contato
    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? AlternativePhone { get; set; }
    
    // Endereço
    [MaxLength(200)]
    public string? Address { get; set; }
    
    [MaxLength(50)]
    public string? Neighborhood { get; set; }
    
    [MaxLength(50)]
    public string? City { get; set; } = "Não informado";
    
    [MaxLength(2)]
    public string? State { get; set; }
    
    [MaxLength(10)]
    public string? ZipCode { get; set; }
    
    // Dados Eclesiásticos
    public DateTime MembershipDate { get; set; } = DateTime.UtcNow;
    
    [MaxLength(50)]
    public string MembershipType { get; set; } = "Membro";
    
    [MaxLength(50)]
    public string? BaptismStatus { get; set; } = "Não batizado";
    
    public DateTime? BaptismDate { get; set; }
    
    [MaxLength(100)]
    public string? BaptismLocation { get; set; }
    
    [MaxLength(100)]
    public string? PreviousChurch { get; set; }
    
    [MaxLength(50)]
    public string? Ministry { get; set; }
    
    [MaxLength(50)]
    public string? CellGroup { get; set; }
    
    [MaxLength(50)]
    public string? LeadershipPosition { get; set; }
    
    public string? Notes { get; set; }
    
    // Dados de Emergência
    [MaxLength(100)]
    public string? EmergencyContactName { get; set; }
    
    [MaxLength(20)]
    public string? EmergencyContactPhone { get; set; }
    
    [MaxLength(50)]
    public string? EmergencyContactRelationship { get; set; }
}

public class MemberDetailDto : MemberDto
{
    public bool IsActive { get; set; }
    public List<FamilyMemberDto> FamilyMembers { get; set; } = new();
    public int? Age => BirthDate.HasValue ? 
        DateTime.Today.Year - BirthDate.Value.Year - (DateTime.Today < BirthDate.Value.AddYears(DateTime.Today.Year - BirthDate.Value.Year) ? 1 : 0) 
        : null;
}

public class FamilyMemberDto
{
    public int? Id { get; set; }
    
    public int MemberId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Relationship { get; set; } = string.Empty;
    
    public DateTime? BirthDate { get; set; }
    
    [MaxLength(20)]
    public string? Phone { get; set; }
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    public bool IsChurchMember { get; set; } = false;
    
    public int? ChurchMemberId { get; set; }
    
    public string? Notes { get; set; }
    
    public int? Age => BirthDate.HasValue ? 
        DateTime.Today.Year - BirthDate.Value.Year - (DateTime.Today < BirthDate.Value.AddYears(DateTime.Today.Year - BirthDate.Value.Year) ? 1 : 0) 
        : null;
}

public class MemberStatsDto
{
    public int TotalMembers { get; set; }
    public int ActiveMembers { get; set; }
    public int InactiveMembers { get; set; }
    public MembershipTypeDistributionDto MembershipTypes { get; set; } = new();
    public GenderDistributionDto GenderDistribution { get; set; } = new();
    public AgeGroupDistributionDto AgeGroups { get; set; } = new();
    public MaritalStatusDistributionDto MaritalStatus { get; set; } = new();
    public BaptismStatsDto BaptismStats { get; set; } = new();
    public int MembersWithFamily { get; set; }
    public int TotalFamilyMembers { get; set; }
}

public class MembershipTypeDistributionDto
{
    public int Visitante { get; set; }
    public int Congregado { get; set; }
    public int Membro { get; set; }
    public int Diacono { get; set; }
    public int Presbitero { get; set; }
    public int Pastor { get; set; }
}

public class GenderDistributionDto
{
    public int Masculino { get; set; }
    public int Feminino { get; set; }
    public int NaoInformado { get; set; }
}

public class AgeGroupDistributionDto
{
    public int Children { get; set; } // 0-12 anos
    public int Teens { get; set; } // 13-17 anos
    public int YoungAdults { get; set; } // 18-29 anos
    public int Adults { get; set; } // 30-59 anos
    public int Seniors { get; set; } // 60+ anos
    public int Unknown { get; set; } // Sem data de nascimento
}

public class MaritalStatusDistributionDto
{
    public int Solteiro { get; set; }
    public int Casado { get; set; }
    public int Divorciado { get; set; }
    public int Viuvo { get; set; }
}

public class BaptismStatsDto
{
    public int NaoBatizado { get; set; }
    public int BatizadoAguas { get; set; }
    public int BatizadoEspirito { get; set; }
    public int Ambos { get; set; }
}