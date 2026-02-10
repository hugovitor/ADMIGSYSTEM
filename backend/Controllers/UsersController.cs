using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChurchManagement.Data;
using ChurchManagement.DTOs;
using ChurchManagement.Models;

namespace ChurchManagement.Controllers;

/// <summary>
/// Gerenciamento de Usuários (apenas Admin)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public UsersController(AppDbContext context)
    {
        _context = context;
    }
    
    /// <summary>
    /// Lista todos os usuários do sistema (apenas Admin)
    /// </summary>
    /// <returns>Lista de usuários</returns>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                IsActive = u.IsActive
            })
            .ToListAsync();
            
        return Ok(users);
    }
    
    /// <summary>
    /// Obtém um usuário específico por ID (apenas Admin)
    /// </summary>
    /// <param name="id">ID do usuário</param>
    /// <returns>Dados do usuário</returns>
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        
        if (user == null)
        {
            return NotFound();
        }
        
        return Ok(new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            IsActive = user.IsActive
        });
    }
    
    /// <summary>
    /// Cria um novo usuário no sistema (apenas Admin)
    /// </summary>
    /// <param name="request">Dados do usuário (nome, email, senha, role)</param>
    /// <returns>Usuário criado</returns>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto request)
    {
        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt,
            IsActive = user.IsActive
        });
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] CreateUserDto request)
    {
        var user = await _context.Users.FindAsync(id);
        
        if (user == null)
        {
            return NotFound();
        }
        
        // Check if email is being changed and already exists
        if (user.Email != request.Email && await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        user.Name = request.Name;
        user.Email = request.Email;
        
        if (!string.IsNullOrEmpty(request.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }
        
        user.Role = request.Role;
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        
        if (user == null)
        {
            return NotFound();
        }
        
        // Soft delete
        user.IsActive = false;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}
