using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChurchManagement.Data;
using ChurchManagement.Models;
using ChurchManagement.DTOs;

namespace ChurchManagement.Controllers;

/// <summary>
/// Gerenciamento da Escola de Música
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MusicSchoolController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public MusicSchoolController(AppDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Lista todos os alunos ativos da Escola de Música
    /// </summary>
    /// <returns>Lista de alunos</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<MusicSchoolStudent>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MusicSchoolStudent>>> GetStudents()
    {
        var students = await _context.MusicSchoolStudents
            .Where(s => s.IsActive)
            .OrderBy(s => s.Name)
            .ToListAsync();
            
        return Ok(students);
    }
    
    /// <summary>
    /// Obtém um aluno específico por ID
    /// </summary>
    /// <param name="id">ID do aluno</param>
    /// <returns>Dados do aluno</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(MusicSchoolStudent), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MusicSchoolStudent>> GetStudent(int id)
    {
        var student = await _context.MusicSchoolStudents.FindAsync(id);
        
        if (student == null || !student.IsActive)
        {
            return NotFound();
        }
        
        return Ok(student);
    }
    
    /// <summary>
    /// Cadastra um novo aluno na Escola de Música
    /// </summary>
    /// <param name="student">Dados do aluno</param>
    /// <returns>Aluno criado</returns>
    [HttpPost]
    [ProducesResponseType(typeof(MusicSchoolStudent), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MusicSchoolStudent>> CreateStudent([FromBody] MusicSchoolStudent student)
    {
        // Check if email already exists
        if (await _context.MusicSchoolStudents.AnyAsync(s => s.Email == student.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        student.EnrollmentDate = DateTime.UtcNow;
        student.IsActive = true;
        
        _context.MusicSchoolStudents.Add(student);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
    }
    
    /// <summary>
    /// Atualiza os dados de um aluno
    /// </summary>
    /// <param name="id">ID do aluno</param>
    /// <param name="updatedStudent">Dados atualizados</param>
    /// <returns>Sem conteúdo</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] MusicSchoolStudent updatedStudent)
    {
        var student = await _context.MusicSchoolStudents.FindAsync(id);
        
        if (student == null)
        {
            return NotFound();
        }
        
        // Check if email is being changed and already exists
        if (student.Email != updatedStudent.Email && 
            await _context.MusicSchoolStudents.AnyAsync(s => s.Email == updatedStudent.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        student.Name = updatedStudent.Name;
        student.Email = updatedStudent.Email;
        student.Phone = updatedStudent.Phone;
        student.BirthDate = updatedStudent.BirthDate;
        student.ParentName = updatedStudent.ParentName;
        student.ParentPhone = updatedStudent.ParentPhone;
        student.Instrument = updatedStudent.Instrument;
        student.Level = updatedStudent.Level;
        student.Teacher = updatedStudent.Teacher;
        student.ClassType = updatedStudent.ClassType;
        student.ClassSchedule = updatedStudent.ClassSchedule;
        student.MonthlyFee = updatedStudent.MonthlyFee;
        student.PaymentStatus = updatedStudent.PaymentStatus;
        student.LastPaymentDate = updatedStudent.LastPaymentDate;
        student.Status = updatedStudent.Status;
        student.Notes = updatedStudent.Notes;
        student.Progress = updatedStudent.Progress;
        student.TotalClasses = updatedStudent.TotalClasses;
        student.AttendedClasses = updatedStudent.AttendedClasses;
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    /// <summary>
    /// Remove um aluno (soft delete)
    /// </summary>
    /// <param name="id">ID do aluno</param>
    /// <returns>Sem conteúdo</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _context.MusicSchoolStudents.FindAsync(id);
        
        if (student == null)
        {
            return NotFound();
        }
        
        // Soft delete
        student.IsActive = false;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    /// <summary>
    /// Obtém estatísticas gerais da Escola de Música
    /// </summary>
    /// <returns>Estatísticas</returns>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(MusicSchoolStatsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MusicSchoolStatsDto>> GetStats()
    {
        var allStudents = await _context.MusicSchoolStudents.ToListAsync();
        var activeStudents = allStudents.Where(s => s.IsActive).ToList();
        
        var stats = new MusicSchoolStatsDto
        {
            TotalStudents = allStudents.Count,
            ActiveStudents = activeStudents.Count,
            InactiveStudents = allStudents.Count(s => !s.IsActive),
            StudentsByInstrument = activeStudents
                .GroupBy(s => s.Instrument)
                .ToDictionary(g => g.Key, g => g.Count()),
            StudentsByLevel = activeStudents
                .GroupBy(s => s.Level)
                .ToDictionary(g => g.Key, g => g.Count()),
            StudentsByPaymentStatus = activeStudents
                .GroupBy(s => s.PaymentStatus)
                .ToDictionary(g => g.Key, g => g.Count()),
            TotalMonthlyRevenue = activeStudents.Sum(s => s.MonthlyFee),
            StudentsWithPendingPayment = activeStudents.Count(s => s.PaymentStatus != "Em dia")
        };
        
        return Ok(stats);
    }
    
    /// <summary>
    /// Registra pagamento de um aluno
    /// </summary>
    /// <param name="id">ID do aluno</param>
    /// <returns>Sem conteúdo</returns>
    [HttpPost("{id}/payment")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegisterPayment(int id)
    {
        var student = await _context.MusicSchoolStudents.FindAsync(id);
        
        if (student == null)
        {
            return NotFound();
        }
        
        student.LastPaymentDate = DateTime.UtcNow;
        student.PaymentStatus = "Em dia";
        
        _context.Entry(student).Property(s => s.LastPaymentDate).IsModified = true;
        _context.Entry(student).Property(s => s.PaymentStatus).IsModified = true;
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    /// <summary>
    /// Registra presença em uma aula
    /// </summary>
    /// <param name="id">ID do aluno</param>
    /// <returns>Sem conteúdo</returns>
    [HttpPost("{id}/attendance")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegisterAttendance(int id)
    {
        var student = await _context.MusicSchoolStudents.FindAsync(id);
        
        if (student == null)
        {
            return NotFound();
        }
        
        student.TotalClasses++;
        student.AttendedClasses++;
        
        _context.Entry(student).Property(s => s.TotalClasses).IsModified = true;
        _context.Entry(student).Property(s => s.AttendedClasses).IsModified = true;
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }

    // Endpoints para gerenciar pré-matrículas

    /// <summary>
    /// Lista todas as pré-matrículas
    /// </summary>
    /// <returns>Lista de pré-matrículas</returns>
    [HttpGet("pre-registrations")]
    [ProducesResponseType(typeof(IEnumerable<MusicSchoolPreRegistrationResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MusicSchoolPreRegistrationResponseDto>>> GetPreRegistrations()
    {
        var preRegistrations = await _context.MusicSchoolPreRegistrations
            .OrderByDescending(p => p.PreRegistrationDate)
            .ToListAsync();

        var response = preRegistrations.Select(p => new MusicSchoolPreRegistrationResponseDto
        {
            Id = p.Id,
            Name = p.Name,
            Email = p.Email,
            Phone = p.Phone,
            BirthDate = p.BirthDate,
            ParentName = p.ParentName,
            ParentEmail = p.ParentEmail,
            ParentPhone = p.ParentPhone,
            Address = p.Address,
            Neighborhood = p.Neighborhood,
            City = p.City,
            State = p.State,
            ZipCode = p.ZipCode,
            Instrument = p.Instrument,
            Level = p.Level,
            PreferredClassType = p.PreferredClassType,
            PreferredSchedule = p.PreferredSchedule,
            HasMusicalExperience = p.HasMusicalExperience,
            MusicalExperience = p.MusicalExperience,
            Questions = p.Questions,
            PreRegistrationDate = p.PreRegistrationDate,
            Status = p.Status,
            ContactDate = p.ContactDate,
            AdminNotes = p.AdminNotes,
            IsProcessed = p.IsProcessed
        });

        return Ok(response);
    }

    /// <summary>
    /// Atualiza o status e observações de uma pré-matrícula
    /// </summary>
    /// <param name="id">ID da pré-matrícula</param>
    /// <param name="request">Dados de atualização</param>
    /// <returns>Sem conteúdo</returns>
    [HttpPut("pre-registrations/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdatePreRegistration(int id, [FromBody] UpdatePreRegistrationRequest request)
    {
        var preRegistration = await _context.MusicSchoolPreRegistrations.FindAsync(id);
        
        if (preRegistration == null)
        {
            return NotFound();
        }

        preRegistration.Status = request.Status;
        preRegistration.AdminNotes = request.AdminNotes;
        preRegistration.IsProcessed = request.IsProcessed;
        
        if (request.Status == "Contatado" && preRegistration.ContactDate == null)
        {
            preRegistration.ContactDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        
        return NoContent();
    }

    /// <summary>
    /// Converte uma pré-matrícula em matrícula oficial
    /// </summary>
    /// <param name="id">ID da pré-matrícula</param>
    /// <param name="request">Dados da matrícula</param>
    /// <returns>Dados do novo aluno</returns>
    [HttpPost("pre-registrations/{id}/convert")]
    [ProducesResponseType(typeof(MusicSchoolStudent), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MusicSchoolStudent>> ConvertPreRegistration(int id, [FromBody] ConvertPreRegistrationRequest request)
    {
        var preRegistration = await _context.MusicSchoolPreRegistrations.FindAsync(id);
        
        if (preRegistration == null)
        {
            return NotFound();
        }

        // Verificar se já existe um aluno com o mesmo email
        var existingStudent = await _context.MusicSchoolStudents
            .FirstOrDefaultAsync(s => s.Email.ToLower() == preRegistration.Email.ToLower());
            
        if (existingStudent != null)
        {
            return BadRequest(new { message = "Já existe um aluno cadastrado com este email." });
        }

        // Criar novo aluno
        var student = new MusicSchoolStudent
        {
            Name = preRegistration.Name,
            Email = preRegistration.Email,
            Phone = preRegistration.Phone,
            BirthDate = preRegistration.BirthDate,
            ParentName = preRegistration.ParentName,
            ParentPhone = preRegistration.ParentPhone,
            Instrument = preRegistration.Instrument,
            Level = preRegistration.Level,
            Teacher = request.Teacher,
            ClassType = preRegistration.PreferredClassType,
            ClassSchedule = request.ClassSchedule ?? preRegistration.PreferredSchedule,
            MonthlyFee = request.MonthlyFee,
            PaymentStatus = "Em dia",
            EnrollmentDate = DateTime.UtcNow,
            IsActive = true,
            Status = "Ativo",
            Notes = preRegistration.Questions
        };

        _context.MusicSchoolStudents.Add(student);
        
        // Atualizar pré-matrícula
        preRegistration.Status = "Matriculado";
        preRegistration.IsProcessed = true;
        
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
    }
}

public class UpdatePreRegistrationRequest
{
    public string Status { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
    public bool IsProcessed { get; set; }
}

public class ConvertPreRegistrationRequest
{
    public string? Teacher { get; set; }
    public string? ClassSchedule { get; set; }
    public decimal MonthlyFee { get; set; }
}
