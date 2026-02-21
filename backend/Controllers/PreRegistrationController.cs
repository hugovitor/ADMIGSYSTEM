using ChurchManagement.Data;
using ChurchManagement.DTOs;
using ChurchManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace ChurchManagement.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PreRegistrationController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<PreRegistrationController> _logger;

    public PreRegistrationController(AppDbContext context, ILogger<PreRegistrationController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // Endpoint público para pré-matrícula
    [HttpPost("music-school")]
    public async Task<IActionResult> CreateMusicSchoolPreRegistration([FromBody] MusicSchoolPreRegistrationRequestDto request)
    {
        try
        {
            // Ensure all DateTimes are UTC to avoid PostgreSQL errors
            var birthDate = request.BirthDate.HasValue 
                ? DateTime.SpecifyKind(request.BirthDate.Value, DateTimeKind.Utc)
                : (DateTime?)null;

            var preRegistration = new MusicSchoolPreRegistration
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                BirthDate = birthDate,
                ParentName = request.ParentName,
                ParentEmail = request.ParentEmail,
                ParentPhone = request.ParentPhone,
                Address = request.Address,
                Neighborhood = request.Neighborhood,
                City = request.City,
                State = request.State,
                ZipCode = request.ZipCode,
                Instrument = request.Instrument,
                Level = request.Level,
                PreferredClassType = request.PreferredClassType,
                PreferredSchedule = request.PreferredSchedule,
                HasMusicalExperience = request.HasMusicalExperience,
                MusicalExperience = request.MusicalExperience,
                Questions = request.Questions,
                PreRegistrationDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc),
                Status = "Pendente",
                IsProcessed = false
            };

            _context.MusicSchoolPreRegistrations.Add(preRegistration);
            await _context.SaveChangesAsync();

            var response = new MusicSchoolPreRegistrationResponseDto
            {
                Id = preRegistration.Id,
                Name = preRegistration.Name,
                Email = preRegistration.Email,
                Phone = preRegistration.Phone,
                BirthDate = preRegistration.BirthDate,
                ParentName = preRegistration.ParentName,
                ParentEmail = preRegistration.ParentEmail,
                ParentPhone = preRegistration.ParentPhone,
                Address = preRegistration.Address,
                Neighborhood = preRegistration.Neighborhood,
                City = preRegistration.City,
                State = preRegistration.State,
                ZipCode = preRegistration.ZipCode,
                Instrument = preRegistration.Instrument,
                Level = preRegistration.Level,
                PreferredClassType = preRegistration.PreferredClassType,
                PreferredSchedule = preRegistration.PreferredSchedule,
                HasMusicalExperience = preRegistration.HasMusicalExperience,
                MusicalExperience = preRegistration.MusicalExperience,
                Questions = preRegistration.Questions,
                PreRegistrationDate = preRegistration.PreRegistrationDate,
                Status = preRegistration.Status,
                ContactDate = preRegistration.ContactDate,
                AdminNotes = preRegistration.AdminNotes,
                IsProcessed = preRegistration.IsProcessed
            };

            _logger.LogInformation($"Nova pré-matrícula criada: {preRegistration.Name} - {preRegistration.Email}");

            return CreatedAtAction(null, new { id = response.Id }, new { 
                message = "Pré-matrícula realizada com sucesso! Entraremos em contato em breve.", 
                data = response 
            });
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pg && pg.SqlState == "23505")
        {
            _logger.LogWarning(ex, "Pré-matrícula duplicada para o email {Email}", request.Email);
            return Conflict(new {
                message = "Este email ja possui uma pre-matricula registrada.",
                error = "duplicate_email",
                details = "Unique constraint violation"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar pré-matrícula");
            
            // Retornar erro específico na resposta
            var errorMessage = ex.InnerException?.Message ?? ex.Message;
            return StatusCode(500, new { 
                message = "Erro ao processar pré-matrícula.", 
                error = errorMessage,
                details = ex.GetType().Name
            });
        }
    }

    // Endpoint público para checar disponibilidade de instrumentos
    [HttpGet("music-school/instruments")]
    public async Task<IActionResult> GetAvailableInstruments()
    {
        try
        {
            var instruments = new[]
            {
                "Violino",
                "Flauta",
                "Saxofone",
                "Trompete",
                "Clarinete",
                "Trompa",
                "Trombone",
                "Violoncelo",
                "Musicalização Infantil (Bebês)"
            };

            return Ok(new { instruments });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar instrumentos");
            var errorMessage = ex.InnerException?.Message ?? ex.Message;
            return StatusCode(500, new { message = "Erro ao buscar instrumentos.", error = errorMessage, details = ex.GetType().Name });
        }
    }

    // Endpoint público para checar níveis disponíveis
    [HttpGet("music-school/levels")]
    public async Task<IActionResult> GetAvailableLevels()
    {
        try
        {
            var levels = new[]
            {
                "Iniciante",
                "Intermediário", 
                "Avançado"
            };

            return Ok(new { levels });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar níveis");
            var errorMessage = ex.InnerException?.Message ?? ex.Message;
            return StatusCode(500, new { message = "Erro ao buscar níveis.", error = errorMessage, details = ex.GetType().Name });
        }
    }

    // Endpoint público para checar tipos de aula
    [HttpGet("music-school/class-types")]
    public async Task<IActionResult> GetAvailableClassTypes()
    {
        try
        {
            var classTypes = new[]
            {
                "Individual",
                "Grupo"
            };

            return Ok(new { classTypes });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar tipos de aula");
            var errorMessage = ex.InnerException?.Message ?? ex.Message;
            return StatusCode(500, new { message = "Erro ao buscar tipos de aula.", error = errorMessage, details = ex.GetType().Name });
        }
    }
}