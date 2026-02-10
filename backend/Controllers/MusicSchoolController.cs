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
}
