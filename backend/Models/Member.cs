using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChurchManagement.Models;

public class Member
{
    public int Id { get; set; }
    
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
    public string Gender { get; set; } = "Não informado"; // Masculino, Feminino, Não informado
    
    [MaxLength(20)]
    public string MaritalStatus { get; set; } = "Solteiro(a)"; // Solteiro(a), Casado(a), Divorciado(a), Viúvo(a)
    
    [MaxLength(50)]
    public string? Profession { get; set; }
    
    [MaxLength(50)]
    public string? Education { get; set; }
    
    public string? PhotoPath { get; set; } // Caminho para a foto
    
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
    public string MembershipType { get; set; } = "Membro"; // Visitante, Congregado, Membro, Diácono, Presbítero, Pastor
    
    [MaxLength(50)]
    public string? BaptismStatus { get; set; } = "Não batizado"; // Não batizado, Batizado nas águas, Batizado no Espírito Santo, Ambos
    
    public DateTime? BaptismDate { get; set; }
    
    [MaxLength(100)]
    public string? BaptismLocation { get; set; }
    
    [MaxLength(100)]
    public string? PreviousChurch { get; set; }
    
    [MaxLength(50)]
    public string? Ministry { get; set; } // Ministério que participa
    
    [MaxLength(50)]
    public string? CellGroup { get; set; } // Célula que participa
    
    [MaxLength(50)]
    public string? LeadershipPosition { get; set; } // Cargo de liderança
    
    public bool IsActive { get; set; } = true;
    
    public string? Notes { get; set; }
    
    // Dados de Emergência
    [MaxLength(100)]
    public string? EmergencyContactName { get; set; }
    
    [MaxLength(20)]
    public string? EmergencyContactPhone { get; set; }
    
    [MaxLength(50)]
    public string? EmergencyContactRelationship { get; set; }
    
    // Relacionamentos
    public List<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();
}

public class FamilyMember
{
    public int Id { get; set; }
    
    public int MemberId { get; set; }
    public Member Member { get; set; } = null!;
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Relationship { get; set; } = string.Empty; // Cônjuge, Filho(a), Pai/Mãe, Irmão(ã), etc.
    
    public DateTime? BirthDate { get; set; }
    
    [MaxLength(20)]
    public string? Phone { get; set; }
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    public bool IsChurchMember { get; set; } = false;
    
    public int? ChurchMemberId { get; set; } // Referência para outro membro se for membro da igreja
    
    public string? Notes { get; set; }
}