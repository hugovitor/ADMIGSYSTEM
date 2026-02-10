using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChurchManagement.Data;
using ChurchManagement.Models;

namespace ChurchManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MensGroupController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public MensGroupController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MensGroupMember>>> GetMembers()
    {
        var members = await _context.MensGroupMembers
            .Where(m => m.IsActive)
            .OrderBy(m => m.Name)
            .ToListAsync();
            
        return Ok(members);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<MensGroupMember>> GetMember(int id)
    {
        var member = await _context.MensGroupMembers.FindAsync(id);
        
        if (member == null || !member.IsActive)
        {
            return NotFound();
        }
        
        return Ok(member);
    }
    
    [HttpPost]
    public async Task<ActionResult<MensGroupMember>> CreateMember([FromBody] MensGroupMember member)
    {
        // Check if email already exists
        if (await _context.MensGroupMembers.AnyAsync(m => m.Email == member.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        member.JoinDate = DateTime.UtcNow;
        member.IsActive = true;
        
        _context.MensGroupMembers.Add(member);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetMember), new { id = member.Id }, member);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMember(int id, [FromBody] MensGroupMember updatedMember)
    {
        var member = await _context.MensGroupMembers.FindAsync(id);
        
        if (member == null)
        {
            return NotFound();
        }
        
        // Check if email is being changed and already exists
        if (member.Email != updatedMember.Email && 
            await _context.MensGroupMembers.AnyAsync(m => m.Email == updatedMember.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        member.Name = updatedMember.Name;
        member.Email = updatedMember.Email;
        member.Phone = updatedMember.Phone;
        member.Role = updatedMember.Role;
        member.Notes = updatedMember.Notes;
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMember(int id)
    {
        var member = await _context.MensGroupMembers.FindAsync(id);
        
        if (member == null)
        {
            return NotFound();
        }
        
        // Soft delete
        member.IsActive = false;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}
