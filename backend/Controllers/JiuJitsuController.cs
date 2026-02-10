using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChurchManagement.Data;
using ChurchManagement.Models;

namespace ChurchManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JiuJitsuController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public JiuJitsuController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JiuJitsuStudent>>> GetStudents()
    {
        var students = await _context.JiuJitsuStudents
            .Where(s => s.IsActive)
            .OrderBy(s => s.Name)
            .ToListAsync();
            
        return Ok(students);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<JiuJitsuStudent>> GetStudent(int id)
    {
        var student = await _context.JiuJitsuStudents.FindAsync(id);
        
        if (student == null || !student.IsActive)
        {
            return NotFound();
        }
        
        return Ok(student);
    }
    
    [HttpPost]
    public async Task<ActionResult<JiuJitsuStudent>> CreateStudent([FromBody] JiuJitsuStudent student)
    {
        // Check if email already exists
        if (await _context.JiuJitsuStudents.AnyAsync(s => s.Email == student.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        student.EnrollmentDate = DateTime.UtcNow;
        student.IsActive = true;
        
        _context.JiuJitsuStudents.Add(student);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] JiuJitsuStudent updatedStudent)
    {
        var student = await _context.JiuJitsuStudents.FindAsync(id);
        
        if (student == null)
        {
            return NotFound();
        }
        
        // Check if email is being changed and already exists
        if (student.Email != updatedStudent.Email && 
            await _context.JiuJitsuStudents.AnyAsync(s => s.Email == updatedStudent.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        student.Name = updatedStudent.Name;
        student.Email = updatedStudent.Email;
        student.Phone = updatedStudent.Phone;
        student.Belt = updatedStudent.Belt;
        student.Notes = updatedStudent.Notes;
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _context.JiuJitsuStudents.FindAsync(id);
        
        if (student == null)
        {
            return NotFound();
        }
        
        // Soft delete
        student.IsActive = false;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}
