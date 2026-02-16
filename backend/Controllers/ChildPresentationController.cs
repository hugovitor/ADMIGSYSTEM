using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChurchManagement.Data;
using ChurchManagement.Models;
using ChurchManagement.DTOs;
using ChurchManagement.Services;

namespace ChurchManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChildPresentationController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly PdfService _pdfService;
    
    public ChildPresentationController(AppDbContext context, IWebHostEnvironment environment, PdfService pdfService)
    {
        _context = context;
        _environment = environment;
        _pdfService = pdfService;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ChildPresentationDto>>> GetPresentations([FromQuery] bool includeInactive = false)
    {
        var query = _context.ChildPresentations.AsQueryable();
        
        if (!includeInactive)
        {
            query = query.Where(cp => cp.IsActive);
        }
        
        var presentations = await query
            .OrderByDescending(cp => cp.PresentationDate)
            .Select(cp => new ChildPresentationDto
            {
                Id = cp.Id,
                ChildName = cp.ChildName,
                BirthDate = cp.BirthDate,
                Gender = cp.Gender,
                BirthPlace = cp.BirthPlace,
                FatherName = cp.FatherName,
                FatherProfession = cp.FatherProfession,
                MotherName = cp.MotherName,
                MotherProfession = cp.MotherProfession,
                PresentationDate = cp.PresentationDate,
                Pastor = cp.Pastor,
                BiblicalVerse = cp.BiblicalVerse,
                SpecialMessage = cp.SpecialMessage,
                Address = cp.Address,
                City = cp.City,
                Phone = cp.Phone,
                Email = cp.Email,
                ChurchName = cp.ChurchName,
                ChurchAddress = cp.ChurchAddress,
                Notes = cp.Notes,
                CertificateGenerated = cp.CertificateGenerated
            })
            .ToListAsync();
            
        return Ok(presentations);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ChildPresentationDetailDto>> GetPresentation(int id)
    {
        var presentation = await _context.ChildPresentations.FindAsync(id);
        
        if (presentation == null)
        {
            return NotFound();
        }
        
        var presentationDto = new ChildPresentationDetailDto
        {
            Id = presentation.Id,
            ChildName = presentation.ChildName,
            BirthDate = presentation.BirthDate,
            Gender = presentation.Gender,
            BirthPlace = presentation.BirthPlace,
            FatherName = presentation.FatherName,
            FatherProfession = presentation.FatherProfession,
            MotherName = presentation.MotherName,
            MotherProfession = presentation.MotherProfession,
            PresentationDate = presentation.PresentationDate,
            Pastor = presentation.Pastor,
            BiblicalVerse = presentation.BiblicalVerse,
            SpecialMessage = presentation.SpecialMessage,
            Address = presentation.Address,
            City = presentation.City,
            Phone = presentation.Phone,
            Email = presentation.Email,
            ChurchName = presentation.ChurchName,
            ChurchAddress = presentation.ChurchAddress,
            Notes = presentation.Notes,
            CertificateGenerated = presentation.CertificateGenerated,
            CertificatePath = presentation.CertificatePath,
            CreatedAt = presentation.CreatedAt,
            IsActive = presentation.IsActive
        };
        
        return Ok(presentationDto);
    }
    
    [HttpPost]
    public async Task<ActionResult<ChildPresentationDto>> CreatePresentation([FromBody] ChildPresentationDto presentationDto)
    {
        var presentation = new ChildPresentation
        {
            ChildName = presentationDto.ChildName,
            BirthDate = presentationDto.BirthDate,
            Gender = presentationDto.Gender,
            BirthPlace = presentationDto.BirthPlace,
            FatherName = presentationDto.FatherName,
            FatherProfession = presentationDto.FatherProfession,
            MotherName = presentationDto.MotherName,
            MotherProfession = presentationDto.MotherProfession,
            PresentationDate = presentationDto.PresentationDate,
            Pastor = presentationDto.Pastor,
            BiblicalVerse = presentationDto.BiblicalVerse,
            SpecialMessage = presentationDto.SpecialMessage,
            Address = presentationDto.Address,
            City = presentationDto.City,
            Phone = presentationDto.Phone,
            Email = presentationDto.Email,
            ChurchName = presentationDto.ChurchName,
            ChurchAddress = presentationDto.ChurchAddress,
            Notes = presentationDto.Notes,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };
        
        _context.ChildPresentations.Add(presentation);
        await _context.SaveChangesAsync();
        
        presentationDto.Id = presentation.Id;
        return CreatedAtAction(nameof(GetPresentation), new { id = presentation.Id }, presentationDto);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePresentation(int id, [FromBody] ChildPresentationDto presentationDto)
    {
        var presentation = await _context.ChildPresentations.FindAsync(id);
        
        if (presentation == null)
        {
            return NotFound();
        }
        
        presentation.ChildName = presentationDto.ChildName;
        presentation.BirthDate = presentationDto.BirthDate;
        presentation.Gender = presentationDto.Gender;
        presentation.BirthPlace = presentationDto.BirthPlace;
        presentation.FatherName = presentationDto.FatherName;
        presentation.FatherProfession = presentationDto.FatherProfession;
        presentation.MotherName = presentationDto.MotherName;
        presentation.MotherProfession = presentationDto.MotherProfession;
        presentation.PresentationDate = presentationDto.PresentationDate;
        presentation.Pastor = presentationDto.Pastor;
        presentation.BiblicalVerse = presentationDto.BiblicalVerse;
        presentation.SpecialMessage = presentationDto.SpecialMessage;
        presentation.Address = presentationDto.Address;
        presentation.City = presentationDto.City;
        presentation.Phone = presentationDto.Phone;
        presentation.Email = presentationDto.Email;
        presentation.ChurchName = presentationDto.ChurchName;
        presentation.ChurchAddress = presentationDto.ChurchAddress;
        presentation.Notes = presentationDto.Notes;
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePresentation(int id)
    {
        var presentation = await _context.ChildPresentations.FindAsync(id);
        
        if (presentation == null)
        {
            return NotFound();
        }
        
        // Soft delete
        presentation.IsActive = false;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpGet("stats")]
    public async Task<ActionResult<ChildPresentationStatsDto>> GetStats()
    {
        var presentations = await _context.ChildPresentations
            .Where(cp => cp.IsActive)
            .ToListAsync();
        
        var currentYear = DateTime.Today.Year;
        var currentMonth = DateTime.Today.Month;
        
        var stats = new ChildPresentationStatsDto
        {
            TotalPresentations = presentations.Count,
            PresentationsThisYear = presentations.Count(p => p.PresentationDate.Year == currentYear),
            PresentationsThisMonth = presentations.Count(p => p.PresentationDate.Year == currentYear && p.PresentationDate.Month == currentMonth),
            GenderStats = new GenderStatsDto
            {
                Boys = presentations.Count(p => p.Gender == "Masculino"),
                Girls = presentations.Count(p => p.Gender == "Feminino")
            },
            AgeStats = new AgeStatsDto
            {
                Under1Year = presentations.Count(p => (DateTime.Today - p.BirthDate).TotalDays < 365),
                Age1to2 = presentations.Count(p => (DateTime.Today - p.BirthDate).TotalDays >= 365 && (DateTime.Today - p.BirthDate).TotalDays < 1095),
                Age3to5 = presentations.Count(p => (DateTime.Today - p.BirthDate).TotalDays >= 1095 && (DateTime.Today - p.BirthDate).TotalDays < 2190),
                Over5Years = presentations.Count(p => (DateTime.Today - p.BirthDate).TotalDays >= 2190)
            },
            MonthlyStats = new MonthlyStatsDto
            {
                January = presentations.Count(p => p.PresentationDate.Month == 1),
                February = presentations.Count(p => p.PresentationDate.Month == 2),
                March = presentations.Count(p => p.PresentationDate.Month == 3),
                April = presentations.Count(p => p.PresentationDate.Month == 4),
                May = presentations.Count(p => p.PresentationDate.Month == 5),
                June = presentations.Count(p => p.PresentationDate.Month == 6),
                July = presentations.Count(p => p.PresentationDate.Month == 7),
                August = presentations.Count(p => p.PresentationDate.Month == 8),
                September = presentations.Count(p => p.PresentationDate.Month == 9),
                October = presentations.Count(p => p.PresentationDate.Month == 10),
                November = presentations.Count(p => p.PresentationDate.Month == 11),
                December = presentations.Count(p => p.PresentationDate.Month == 12)
            },
            CertificatesGenerated = presentations.Count(p => p.CertificateGenerated),
            PendingCertificates = presentations.Count(p => !p.CertificateGenerated)
        };
        
        return Ok(stats);
    }
    
    [HttpPost("{id}/certificate")]
    public async Task<ActionResult> GenerateCertificate(int id, [FromBody] GenerateCertificateDto? customData = null)
    {
        var presentation = await _context.ChildPresentations.FindAsync(id);
        if (presentation == null)
        {
            return NotFound();
        }
        
        try
        {
            Console.WriteLine($"Gerando certificado para apresentação ID: {id}");
            Console.WriteLine($"Dados da apresentação: {presentation.ChildName}, {presentation.Gender}");
            
            var certificatePath = await GenerateCertificatePdf(presentation, customData);
            
            Console.WriteLine($"Certificado gerado com sucesso: {certificatePath}");
            
            presentation.CertificateGenerated = true;
            presentation.CertificatePath = certificatePath;
            await _context.SaveChangesAsync();
            
            return Ok(new { certificatePath });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERRO ao gerar certificado: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, new { message = "Erro ao gerar certificado", error = ex.Message, stackTrace = ex.StackTrace });
        }
    }
    
    [HttpGet("{id}/certificate/download")]
    public async Task<ActionResult> DownloadCertificate(int id)
    {
        try
        {
            var presentation = await _context.ChildPresentations.FindAsync(id);
            if (presentation == null)
            {
                return NotFound("Apresentação não encontrada");
            }
            
            if (!presentation.CertificateGenerated || string.IsNullOrEmpty(presentation.CertificatePath))
            {
                return BadRequest("Certificado não foi gerado ainda");
            }
            
            // Construir o path completo do arquivo
            var webRootPath = _environment.WebRootPath ?? _environment.ContentRootPath;
            var relativePath = presentation.CertificatePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var fullPath = Path.Combine(webRootPath, relativePath);
            
            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound($"Arquivo do certificado não encontrado: {fullPath}");
            }
            
            var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            var fileName = $"Certificado_{presentation.ChildName.Replace(" ", "_")}.pdf";
            
            return File(fileBytes, "application/pdf", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro ao baixar certificado", error = ex.Message });
        }
    }
    
    private async Task<string> GenerateCertificatePdf(ChildPresentation presentation, GenerateCertificateDto? customData)
    {
        try
        {
            Console.WriteLine("Iniciando geração de PDF...");
            
            // Aplicar dados customizados se fornecidos
            if (customData != null)
            {
                if (!string.IsNullOrEmpty(customData.CustomChurchName))
                    presentation.ChurchName = customData.CustomChurchName;
                if (!string.IsNullOrEmpty(customData.CustomPastor))
                    presentation.Pastor = customData.CustomPastor;
                if (!string.IsNullOrEmpty(customData.CustomBiblicalVerse))
                    presentation.BiblicalVerse = customData.CustomBiblicalVerse;
                if (!string.IsNullOrEmpty(customData.CustomMessage))
                    presentation.SpecialMessage = customData.CustomMessage;
            }
            
            Console.WriteLine("Chamando PdfService.GenerateChildPresentationCertificate...");
            // Gerar PDF usando o serviço
            var pdfData = _pdfService.GenerateChildPresentationCertificate(presentation);
            
            Console.WriteLine($"PDF gerado com {pdfData.Length} bytes");
            
            // Gerar nome único para o arquivo
            var fileName = $"Certificado_{presentation.Id}_{DateTime.Now:yyyyMMddHHmmss}.pdf";
            
            Console.WriteLine($"Salvando arquivo: {fileName}");
            // Salvar o arquivo
            var relativePath = await _pdfService.SaveCertificateAsync(pdfData, fileName);
            
            Console.WriteLine($"Arquivo salvo em: {relativePath}");
            return relativePath;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERRO em GenerateCertificatePdf: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
        }
    }
}