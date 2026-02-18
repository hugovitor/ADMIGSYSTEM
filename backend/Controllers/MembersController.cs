using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChurchManagement.Data;
using ChurchManagement.Models;
using ChurchManagement.DTOs;

namespace ChurchManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MembersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;
    
    public MembersController(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }
    
    // CRUD básico para membros
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers([FromQuery] bool includeInactive = false)
    {
        try
        {
            Console.WriteLine("=== MEMBERS GET REQUEST ===");
            Console.WriteLine($"User authenticated: {User?.Identity?.IsAuthenticated}");
            Console.WriteLine($"Include inactive: {includeInactive}");
            Console.WriteLine("===========================");
            
            var query = _context.Members.AsQueryable();
            
            if (!includeInactive)
            {
                query = query.Where(m => m.IsActive);
            }
            
            var members = await query
                .OrderBy(m => m.FullName)
                .Select(m => new MemberDto
                {
                    Id = m.Id,
                    FullName = m.FullName,
                Cpf = m.Cpf,
                Rg = m.Rg,
                BirthDate = m.BirthDate,
                Gender = m.Gender,
                MaritalStatus = m.MaritalStatus,
                Profession = m.Profession,
                Education = m.Education,
                PhotoPath = m.PhotoPath,
                Email = m.Email,
                Phone = m.Phone,
                AlternativePhone = m.AlternativePhone,
                Address = m.Address,
                Neighborhood = m.Neighborhood,
                City = m.City,
                State = m.State,
                ZipCode = m.ZipCode,
                MembershipDate = m.MembershipDate,
                MembershipType = m.MembershipType,
                BaptismStatus = m.BaptismStatus,
                BaptismDate = m.BaptismDate,
                BaptismLocation = m.BaptismLocation,
                PreviousChurch = m.PreviousChurch,
                Ministry = m.Ministry,
                CellGroup = m.CellGroup,
                LeadershipPosition = m.LeadershipPosition,
                Notes = m.Notes,
                EmergencyContactName = m.EmergencyContactName,
                EmergencyContactPhone = m.EmergencyContactPhone,
                EmergencyContactRelationship = m.EmergencyContactRelationship
            })
            .ToListAsync();
            
        Console.WriteLine($"Found {members.Count} members");
        return Ok(members);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR in Members GetMembers: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { message = "Internal server error", details = ex.Message });
        }
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<MemberDetailDto>> GetMember(int id)
    {
        var member = await _context.Members
            .Include(m => m.FamilyMembers)
            .FirstOrDefaultAsync(m => m.Id == id);
        
        if (member == null)
        {
            return NotFound();
        }
        
        var memberDto = new MemberDetailDto
        {
            Id = member.Id,
            FullName = member.FullName,
            Cpf = member.Cpf,
            Rg = member.Rg,
            BirthDate = member.BirthDate,
            Gender = member.Gender,
            MaritalStatus = member.MaritalStatus,
            Profession = member.Profession,
            Education = member.Education,
            PhotoPath = member.PhotoPath,
            Email = member.Email,
            Phone = member.Phone,
            AlternativePhone = member.AlternativePhone,
            Address = member.Address,
            Neighborhood = member.Neighborhood,
            City = member.City,
            State = member.State,
            ZipCode = member.ZipCode,
            MembershipDate = member.MembershipDate,
            MembershipType = member.MembershipType,
            BaptismStatus = member.BaptismStatus,
            BaptismDate = member.BaptismDate,
            BaptismLocation = member.BaptismLocation,
            PreviousChurch = member.PreviousChurch,
            Ministry = member.Ministry,
            CellGroup = member.CellGroup,
            LeadershipPosition = member.LeadershipPosition,
            Notes = member.Notes,
            EmergencyContactName = member.EmergencyContactName,
            EmergencyContactPhone = member.EmergencyContactPhone,
            EmergencyContactRelationship = member.EmergencyContactRelationship,
            IsActive = member.IsActive,
            FamilyMembers = member.FamilyMembers.Select(f => new FamilyMemberDto
            {
                Id = f.Id,
                MemberId = f.MemberId,
                Name = f.Name,
                Relationship = f.Relationship,
                BirthDate = f.BirthDate,
                Phone = f.Phone,
                Email = f.Email,
                IsChurchMember = f.IsChurchMember,
                ChurchMemberId = f.ChurchMemberId,
                Notes = f.Notes
            }).ToList()
        };
        
        return Ok(memberDto);
    }
    
    [HttpPost]
    public async Task<ActionResult<MemberDto>> CreateMember([FromBody] MemberDto memberDto)
    {
        // Check if email already exists
        if (await _context.Members.AnyAsync(m => m.Email == memberDto.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        var member = new Member
        {
            FullName = memberDto.FullName,
            Cpf = memberDto.Cpf,
            Rg = memberDto.Rg,
            BirthDate = memberDto.BirthDate,
            Gender = memberDto.Gender,
            MaritalStatus = memberDto.MaritalStatus,
            Profession = memberDto.Profession,
            Education = memberDto.Education,
            PhotoPath = memberDto.PhotoPath,
            Email = memberDto.Email,
            Phone = memberDto.Phone,
            AlternativePhone = memberDto.AlternativePhone,
            Address = memberDto.Address,
            Neighborhood = memberDto.Neighborhood,
            City = memberDto.City,
            State = memberDto.State,
            ZipCode = memberDto.ZipCode,
            MembershipDate = memberDto.MembershipDate,
            MembershipType = memberDto.MembershipType,
            BaptismStatus = memberDto.BaptismStatus,
            BaptismDate = memberDto.BaptismDate,
            BaptismLocation = memberDto.BaptismLocation,
            PreviousChurch = memberDto.PreviousChurch,
            Ministry = memberDto.Ministry,
            CellGroup = memberDto.CellGroup,
            LeadershipPosition = memberDto.LeadershipPosition,
            Notes = memberDto.Notes,
            EmergencyContactName = memberDto.EmergencyContactName,
            EmergencyContactPhone = memberDto.EmergencyContactPhone,
            EmergencyContactRelationship = memberDto.EmergencyContactRelationship,
            IsActive = true
        };
        
        _context.Members.Add(member);
        await _context.SaveChangesAsync();
        
        memberDto.Id = member.Id;
        return CreatedAtAction(nameof(GetMember), new { id = member.Id }, memberDto);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMember(int id, [FromBody] MemberDto memberDto)
    {
        var member = await _context.Members.FindAsync(id);
        
        if (member == null)
        {
            return NotFound();
        }
        
        // Check if email is being changed and already exists
        if (member.Email != memberDto.Email && 
            await _context.Members.AnyAsync(m => m.Email == memberDto.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        // Update all fields
        member.FullName = memberDto.FullName;
        member.Cpf = memberDto.Cpf;
        member.Rg = memberDto.Rg;
        member.BirthDate = memberDto.BirthDate;
        member.Gender = memberDto.Gender;
        member.MaritalStatus = memberDto.MaritalStatus;
        member.Profession = memberDto.Profession;
        member.Education = memberDto.Education;
        member.PhotoPath = memberDto.PhotoPath;
        member.Email = memberDto.Email;
        member.Phone = memberDto.Phone;
        member.AlternativePhone = memberDto.AlternativePhone;
        member.Address = memberDto.Address;
        member.Neighborhood = memberDto.Neighborhood;
        member.City = memberDto.City;
        member.State = memberDto.State;
        member.ZipCode = memberDto.ZipCode;
        member.MembershipDate = memberDto.MembershipDate;
        member.MembershipType = memberDto.MembershipType;
        member.BaptismStatus = memberDto.BaptismStatus;
        member.BaptismDate = memberDto.BaptismDate;
        member.BaptismLocation = memberDto.BaptismLocation;
        member.PreviousChurch = memberDto.PreviousChurch;
        member.Ministry = memberDto.Ministry;
        member.CellGroup = memberDto.CellGroup;
        member.LeadershipPosition = memberDto.LeadershipPosition;
        member.Notes = memberDto.Notes;
        member.EmergencyContactName = memberDto.EmergencyContactName;
        member.EmergencyContactPhone = memberDto.EmergencyContactPhone;
        member.EmergencyContactRelationship = memberDto.EmergencyContactRelationship;
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMember(int id)
    {
        var member = await _context.Members.FindAsync(id);
        
        if (member == null)
        {
            return NotFound();
        }
        
        // Soft delete
        member.IsActive = false;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    // Upload de foto
    [HttpPost("{id}/photo")]
    public async Task<ActionResult> UploadPhoto(int id, IFormFile photo)
    {
        var member = await _context.Members.FindAsync(id);
        if (member == null)
        {
            return NotFound();
        }
        
        if (photo == null || photo.Length == 0)
        {
            return BadRequest("Arquivo de foto não fornecido");
        }
        
        // Validar tipo de arquivo
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(photo.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest("Tipo de arquivo não suportado. Use JPG, PNG ou GIF");
        }
        
        // Criar diretório se não existir
        var uploadsDir = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", "members");
        if (!Directory.Exists(uploadsDir))
        {
            Directory.CreateDirectory(uploadsDir);
        }
        
        // Gerar nome único para o arquivo
        var fileName = $"{member.Id}_{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);
        
        // Salvar arquivo
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await photo.CopyToAsync(stream);
        }
        
        // Atualizar caminho no banco
        member.PhotoPath = $"/uploads/members/{fileName}";
        await _context.SaveChangesAsync();
        
        return Ok(new { photoPath = member.PhotoPath });
    }
    
    // Estatísticas
    [HttpGet("stats")]
    public async Task<ActionResult<MemberStatsDto>> GetStats()
    {
        var members = await _context.Members.ToListAsync();
        var activeMembers = members.Where(m => m.IsActive).ToList();
        
        var stats = new MemberStatsDto
        {
            TotalMembers = members.Count,
            ActiveMembers = activeMembers.Count,
            InactiveMembers = members.Count - activeMembers.Count,
            MembershipTypes = new MembershipTypeDistributionDto
            {
                Visitante = activeMembers.Count(m => m.MembershipType == "Visitante"),
                Congregado = activeMembers.Count(m => m.MembershipType == "Congregado"),
                Membro = activeMembers.Count(m => m.MembershipType == "Membro"),
                Diacono = activeMembers.Count(m => m.MembershipType == "Diácono"),
                Presbitero = activeMembers.Count(m => m.MembershipType == "Presbítero"),
                Pastor = activeMembers.Count(m => m.MembershipType == "Pastor")
            },
            GenderDistribution = new GenderDistributionDto
            {
                Masculino = activeMembers.Count(m => m.Gender == "Masculino"),
                Feminino = activeMembers.Count(m => m.Gender == "Feminino"),
                NaoInformado = activeMembers.Count(m => m.Gender == "Não informado")
            },
            AgeGroups = new AgeGroupDistributionDto
            {
                Children = activeMembers.Count(m => m.BirthDate.HasValue && DateTime.Today.Year - m.BirthDate.Value.Year >= 0 && DateTime.Today.Year - m.BirthDate.Value.Year <= 12),
                Teens = activeMembers.Count(m => m.BirthDate.HasValue && DateTime.Today.Year - m.BirthDate.Value.Year >= 13 && DateTime.Today.Year - m.BirthDate.Value.Year <= 17),
                YoungAdults = activeMembers.Count(m => m.BirthDate.HasValue && DateTime.Today.Year - m.BirthDate.Value.Year >= 18 && DateTime.Today.Year - m.BirthDate.Value.Year <= 29),
                Adults = activeMembers.Count(m => m.BirthDate.HasValue && DateTime.Today.Year - m.BirthDate.Value.Year >= 30 && DateTime.Today.Year - m.BirthDate.Value.Year <= 59),
                Seniors = activeMembers.Count(m => m.BirthDate.HasValue && DateTime.Today.Year - m.BirthDate.Value.Year >= 60),
                Unknown = activeMembers.Count(m => !m.BirthDate.HasValue)
            },
            MaritalStatus = new MaritalStatusDistributionDto
            {
                Solteiro = activeMembers.Count(m => m.MaritalStatus == "Solteiro(a)"),
                Casado = activeMembers.Count(m => m.MaritalStatus == "Casado(a)"),
                Divorciado = activeMembers.Count(m => m.MaritalStatus == "Divorciado(a)"),
                Viuvo = activeMembers.Count(m => m.MaritalStatus == "Viúvo(a)")
            },
            BaptismStats = new BaptismStatsDto
            {
                NaoBatizado = activeMembers.Count(m => m.BaptismStatus == "Não batizado"),
                BatizadoAguas = activeMembers.Count(m => m.BaptismStatus == "Batizado nas águas"),
                BatizadoEspirito = activeMembers.Count(m => m.BaptismStatus == "Batizado no Espírito Santo"),
                Ambos = activeMembers.Count(m => m.BaptismStatus == "Ambos")
            },
            MembersWithFamily = await _context.Members.CountAsync(m => m.IsActive && m.FamilyMembers.Any()),
            TotalFamilyMembers = await _context.FamilyMembers.CountAsync(f => f.Member.IsActive)
        };
        
        return Ok(stats);
    }
    
    // Gestão de familiares
    [HttpPost("{memberId}/family")]
    public async Task<ActionResult<FamilyMemberDto>> AddFamilyMember(int memberId, [FromBody] FamilyMemberDto familyDto)
    {
        var member = await _context.Members.FindAsync(memberId);
        if (member == null)
        {
            return NotFound("Membro não encontrado");
        }
        
        var familyMember = new FamilyMember
        {
            MemberId = memberId,
            Name = familyDto.Name,
            Relationship = familyDto.Relationship,
            BirthDate = familyDto.BirthDate,
            Phone = familyDto.Phone,
            Email = familyDto.Email,
            IsChurchMember = familyDto.IsChurchMember,
            ChurchMemberId = familyDto.ChurchMemberId,
            Notes = familyDto.Notes
        };
        
        _context.FamilyMembers.Add(familyMember);
        await _context.SaveChangesAsync();
        
        familyDto.Id = familyMember.Id;
        return CreatedAtAction(nameof(GetMember), new { id = memberId }, familyDto);
    }
    
    [HttpPut("{memberId}/family/{familyId}")]
    public async Task<IActionResult> UpdateFamilyMember(int memberId, int familyId, [FromBody] FamilyMemberDto familyDto)
    {
        var familyMember = await _context.FamilyMembers
            .FirstOrDefaultAsync(f => f.Id == familyId && f.MemberId == memberId);
        
        if (familyMember == null)
        {
            return NotFound();
        }
        
        familyMember.Name = familyDto.Name;
        familyMember.Relationship = familyDto.Relationship;
        familyMember.BirthDate = familyDto.BirthDate;
        familyMember.Phone = familyDto.Phone;
        familyMember.Email = familyDto.Email;
        familyMember.IsChurchMember = familyDto.IsChurchMember;
        familyMember.ChurchMemberId = familyDto.ChurchMemberId;
        familyMember.Notes = familyDto.Notes;
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{memberId}/family/{familyId}")]
    public async Task<IActionResult> RemoveFamilyMember(int memberId, int familyId)
    {
        var familyMember = await _context.FamilyMembers
            .FirstOrDefaultAsync(f => f.Id == familyId && f.MemberId == memberId);
        
        if (familyMember == null)
        {
            return NotFound();
        }
        
        _context.FamilyMembers.Remove(familyMember);
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}