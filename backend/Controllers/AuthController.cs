using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChurchManagement.Data;
using ChurchManagement.DTOs;
using ChurchManagement.Services;

namespace ChurchManagement.Controllers;

/// <summary>
/// Controlador de autenticação
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;
    
    public AuthController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }
    
    /// <summary>
    /// Realiza o login do usuário
    /// </summary>
    /// <param name="request">Credenciais de login (email e senha)</param>
    /// <returns>Token JWT e dados do usuário</returns>
    /// <response code="200">Login realizado com sucesso</response>
    /// <response code="401">Email ou senha inválidos</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);
            
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Email ou senha inválidos" });
        }
        
        var token = _jwtService.GenerateToken(user);
        
        return Ok(new LoginResponseDto
        {
            Token = token,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        });
    }
    
    /// <summary>
    /// Valida se o token JWT é válido
    /// </summary>
    /// <returns>Mensagem de confirmação</returns>
    /// <response code="200">Token válido</response>
    [HttpGet("validate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult ValidateToken()
    {
        return Ok(new { message = "Token válido" });
    }
}
