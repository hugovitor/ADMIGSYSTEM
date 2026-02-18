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
public class JiuJitsuController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public JiuJitsuController(AppDbContext context)
    {
        _context = context;
    }
    
    // CRUD básico para estudantes
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JiuJitsuStudentDto>>> GetStudents([FromQuery] bool includeInactive = false)
    {
        var query = _context.JiuJitsuStudents.AsQueryable();
        
        if (!includeInactive)
        {
            query = query.Where(s => s.IsActive);
        }
        
        var students = await query
            .OrderBy(s => s.Name)
            .Select(s => new JiuJitsuStudentDto
            {
                Id = s.Id,
                Name = s.Name,
                Email = s.Email,
                Phone = s.Phone,
                Cpf = s.Cpf,
                BirthDate = s.BirthDate,
                Address = s.Address,
                Belt = s.Belt,
                Stripes = s.Stripes,
                LastPromotionDate = s.LastPromotionDate,
                MonthlyFee = s.MonthlyFee,
                LastPaymentDate = s.LastPaymentDate,
                PaymentStatus = s.PaymentStatus,
                EmergencyContact = s.EmergencyContact,
                EmergencyPhone = s.EmergencyPhone,
                HealthConditions = s.HealthConditions,
                Notes = s.Notes
            })
            .ToListAsync();
            
        return Ok(students);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<JiuJitsuStudentDetailDto>> GetStudent(int id)
    {
        var student = await _context.JiuJitsuStudents
            .Include(s => s.Graduations)
            .Include(s => s.Attendances.OrderByDescending(a => a.Date).Take(10))
            .Include(s => s.Payments.OrderByDescending(p => p.PaymentDate).Take(5))
            .FirstOrDefaultAsync(s => s.Id == id);
        
        if (student == null)
        {
            return NotFound();
        }
        
        var studentDto = new JiuJitsuStudentDetailDto
        {
            Id = student.Id,
            Name = student.Name,
            Email = student.Email,
            Phone = student.Phone,
            Cpf = student.Cpf,
            BirthDate = student.BirthDate,
            Address = student.Address,
            Belt = student.Belt,
            Stripes = student.Stripes,
            LastPromotionDate = student.LastPromotionDate,
            MonthlyFee = student.MonthlyFee,
            LastPaymentDate = student.LastPaymentDate,
            PaymentStatus = student.PaymentStatus,
            EmergencyContact = student.EmergencyContact,
            EmergencyPhone = student.EmergencyPhone,
            HealthConditions = student.HealthConditions,
            Notes = student.Notes,
            EnrollmentDate = student.EnrollmentDate,
            IsActive = student.IsActive,
            Graduations = student.Graduations.Select(g => new JiuJitsuGraduationDto
            {
                Id = g.Id,
                FromBelt = g.FromBelt,
                ToBelt = g.ToBelt,
                FromStripes = g.FromStripes,
                ToStripes = g.ToStripes,
                GraduationDate = g.GraduationDate,
                GraduatedBy = g.GraduatedBy,
                Notes = g.Notes
            }).ToList(),
            RecentAttendances = student.Attendances.Select(a => new JiuJitsuAttendanceDto
            {
                Id = a.Id,
                Date = a.Date,
                ClassType = a.ClassType,
                IsPresent = a.IsPresent,
                Notes = a.Notes
            }).ToList(),
            RecentPayments = student.Payments.Select(p => new JiuJitsuPaymentDto
            {
                Id = p.Id,
                PaymentDate = p.PaymentDate,
                Amount = p.Amount,
                PaymentMethod = p.PaymentMethod,
                ReferenceMonth = p.ReferenceMonth,
                Notes = p.Notes
            }).ToList()
        };
        
        return Ok(studentDto);
    }
    
    [HttpPost]
    public async Task<ActionResult<JiuJitsuStudentDto>> CreateStudent([FromBody] JiuJitsuStudentDto studentDto)
    {
        // Check if email already exists
        if (await _context.JiuJitsuStudents.AnyAsync(s => s.Email == studentDto.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        var student = new JiuJitsuStudent
        {
            Name = studentDto.Name,
            Email = studentDto.Email,
            Phone = studentDto.Phone,
            Cpf = studentDto.Cpf,
            BirthDate = studentDto.BirthDate,
            Address = studentDto.Address,
            Belt = studentDto.Belt,
            Stripes = studentDto.Stripes,
            MonthlyFee = studentDto.MonthlyFee,
            PaymentStatus = studentDto.PaymentStatus,
            EmergencyContact = studentDto.EmergencyContact,
            EmergencyPhone = studentDto.EmergencyPhone,
            HealthConditions = studentDto.HealthConditions,
            Notes = studentDto.Notes,
            EnrollmentDate = DateTime.UtcNow,
            IsActive = true
        };
        
        _context.JiuJitsuStudents.Add(student);
        await _context.SaveChangesAsync();
        
        studentDto.Id = student.Id;
        return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, studentDto);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] JiuJitsuStudentDto studentDto)
    {
        var student = await _context.JiuJitsuStudents.FindAsync(id);
        
        if (student == null)
        {
            return NotFound();
        }
        
        // Check if email is being changed and already exists
        if (student.Email != studentDto.Email && 
            await _context.JiuJitsuStudents.AnyAsync(s => s.Email == studentDto.Email))
        {
            return BadRequest(new { message = "Email já cadastrado" });
        }
        
        student.Name = studentDto.Name;
        student.Email = studentDto.Email;
        student.Phone = studentDto.Phone;
        student.Cpf = studentDto.Cpf;
        student.BirthDate = studentDto.BirthDate;
        student.Address = studentDto.Address;
        student.Belt = studentDto.Belt;
        student.Stripes = studentDto.Stripes;
        student.MonthlyFee = studentDto.MonthlyFee;
        student.PaymentStatus = studentDto.PaymentStatus;
        student.EmergencyContact = studentDto.EmergencyContact;
        student.EmergencyPhone = studentDto.EmergencyPhone;
        student.HealthConditions = studentDto.HealthConditions;
        student.Notes = studentDto.Notes;
        
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
    
    // Estatísticas
    [HttpGet("stats")]
    public async Task<ActionResult<JiuJitsuStatsDto>> GetStats()
    {
        var students = await _context.JiuJitsuStudents.ToListAsync();
        var activeStudents = students.Where(s => s.IsActive).ToList();
        
        var stats = new JiuJitsuStatsDto
        {
            TotalStudents = students.Count,
            ActiveStudents = activeStudents.Count,
            InactiveStudents = students.Count - activeStudents.Count,
            BeltDistribution = new BeltDistributionDto
            {
                Branca = activeStudents.Count(s => s.Belt == "Branca"),
                Azul = activeStudents.Count(s => s.Belt == "Azul"),
                Roxa = activeStudents.Count(s => s.Belt == "Roxa"),
                Marrom = activeStudents.Count(s => s.Belt == "Marrom"),
                Preta = activeStudents.Count(s => s.Belt == "Preta")
            },
            PaymentStats = new PaymentStatusDto
            {
                EmDia = activeStudents.Count(s => s.PaymentStatus == "Em dia"),
                Atrasado = activeStudents.Count(s => s.PaymentStatus == "Atrasado"),
                Inadimplente = activeStudents.Count(s => s.PaymentStatus == "Inadimplente"),
                TotalReceived = activeStudents.Where(s => s.PaymentStatus == "Em dia").Sum(s => s.MonthlyFee),
                TotalPending = activeStudents.Where(s => s.PaymentStatus != "Em dia").Sum(s => s.MonthlyFee)
            },
            AgeGroups = new AgeGroupDto
            {
                Kids = activeStudents.Count(s => s.BirthDate.HasValue && DateTime.Today.Year - s.BirthDate.Value.Year >= 4 && DateTime.Today.Year - s.BirthDate.Value.Year <= 12),
                Teens = activeStudents.Count(s => s.BirthDate.HasValue && DateTime.Today.Year - s.BirthDate.Value.Year >= 13 && DateTime.Today.Year - s.BirthDate.Value.Year <= 17),
                Adults = activeStudents.Count(s => s.BirthDate.HasValue && DateTime.Today.Year - s.BirthDate.Value.Year >= 18 && DateTime.Today.Year - s.BirthDate.Value.Year <= 39),
                Seniors = activeStudents.Count(s => s.BirthDate.HasValue && DateTime.Today.Year - s.BirthDate.Value.Year >= 40),
                Unknown = activeStudents.Count(s => !s.BirthDate.HasValue)
            },
            TotalMonthlyRevenue = activeStudents.Sum(s => s.MonthlyFee),
            TotalGraduationsThisYear = await _context.JiuJitsuGraduations.CountAsync(g => g.GraduationDate.Year == DateTime.Today.Year)
        };
        
        // Calcular taxa de presença
        var oneWeekAgo = DateTime.Today.AddDays(-7);
        var oneMonthAgo = DateTime.Today.AddDays(-30);
        
        var attendances = await _context.JiuJitsuAttendances
            .Where(a => a.Date >= oneMonthAgo)
            .ToListAsync();
        
        var totalClasses = attendances.GroupBy(a => a.Date).Count();
        var totalPossibleAttendances = totalClasses * activeStudents.Count;
        var totalActualAttendances = attendances.Count(a => a.IsPresent);
        
        var weekAttendances = attendances.Where(a => a.Date >= oneWeekAgo);
        var weekClasses = weekAttendances.GroupBy(a => a.Date).Count();
        var weekPossibleAttendances = weekClasses * activeStudents.Count;
        var weekActualAttendances = weekAttendances.Count(a => a.IsPresent);
        
        stats.AttendanceRate = new AttendanceRateDto
        {
            OverallRate = totalPossibleAttendances > 0 ? (decimal)totalActualAttendances / totalPossibleAttendances * 100 : 0,
            LastWeekRate = weekPossibleAttendances > 0 ? (decimal)weekActualAttendances / weekPossibleAttendances * 100 : 0,
            LastMonthRate = totalPossibleAttendances > 0 ? (decimal)totalActualAttendances / totalPossibleAttendances * 100 : 0
        };
        
        return Ok(stats);
    }
    
    // Graduações
    [HttpPost("{studentId}/graduations")]
    public async Task<ActionResult<JiuJitsuGraduationDto>> CreateGraduation(int studentId, [FromBody] CreateGraduationDto graduationDto)
    {
        var student = await _context.JiuJitsuStudents.FindAsync(studentId);
        if (student == null)
        {
            return NotFound("Aluno não encontrado");
        }
        
        var graduation = new JiuJitsuGraduation
        {
            StudentId = studentId,
            FromBelt = student.Belt,
            ToBelt = graduationDto.ToBelt,
            FromStripes = student.Stripes,
            ToStripes = graduationDto.ToStripes,
            GraduationDate = graduationDto.GraduationDate,
            GraduatedBy = graduationDto.GraduatedBy,
            Notes = graduationDto.Notes
        };
        
        // Atualizar faixa do aluno
        student.Belt = graduationDto.ToBelt;
        student.Stripes = graduationDto.ToStripes;
        student.LastPromotionDate = graduationDto.GraduationDate;
        
        _context.JiuJitsuGraduations.Add(graduation);
        await _context.SaveChangesAsync();
        
        var graduationResultDto = new JiuJitsuGraduationDto
        {
            Id = graduation.Id,
            FromBelt = graduation.FromBelt,
            ToBelt = graduation.ToBelt,
            FromStripes = graduation.FromStripes,
            ToStripes = graduation.ToStripes,
            GraduationDate = graduation.GraduationDate,
            GraduatedBy = graduation.GraduatedBy,
            Notes = graduation.Notes
        };
        
        return CreatedAtAction(nameof(GetStudent), new { id = studentId }, graduationResultDto);
    }
    
    [HttpGet("{studentId}/graduations")]
    public async Task<ActionResult<IEnumerable<JiuJitsuGraduationDto>>> GetStudentGraduations(int studentId)
    {
        var graduations = await _context.JiuJitsuGraduations
            .Where(g => g.StudentId == studentId)
            .OrderByDescending(g => g.GraduationDate)
            .Select(g => new JiuJitsuGraduationDto
            {
                Id = g.Id,
                FromBelt = g.FromBelt,
                ToBelt = g.ToBelt,
                FromStripes = g.FromStripes,
                ToStripes = g.ToStripes,
                GraduationDate = g.GraduationDate,
                GraduatedBy = g.GraduatedBy,
                Notes = g.Notes
            })
            .ToListAsync();
        
        return Ok(graduations);
    }
    
    // Presença
    [HttpPost("attendance")]
    public async Task<ActionResult> CreateAttendance([FromBody] CreateAttendanceDto attendanceDto)
    {
        var attendance = new JiuJitsuAttendance
        {
            StudentId = attendanceDto.StudentId,
            Date = attendanceDto.Date.Date,
            ClassType = attendanceDto.ClassType,
            IsPresent = attendanceDto.IsPresent,
            Notes = attendanceDto.Notes
        };
        
        _context.JiuJitsuAttendances.Add(attendance);
        await _context.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpPost("attendance/bulk")]
    public async Task<ActionResult> CreateBulkAttendance([FromBody] BulkAttendanceDto bulkAttendanceDto)
    {
        var attendances = bulkAttendanceDto.Students.Select(s => new JiuJitsuAttendance
        {
            StudentId = s.StudentId,
            Date = bulkAttendanceDto.Date.Date,
            ClassType = bulkAttendanceDto.ClassType,
            IsPresent = s.IsPresent,
            Notes = s.Notes
        }).ToList();
        
        _context.JiuJitsuAttendances.AddRange(attendances);
        await _context.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpGet("{studentId}/attendance")]
    public async Task<ActionResult<IEnumerable<JiuJitsuAttendanceDto>>> GetStudentAttendance(int studentId, [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
    {
        var query = _context.JiuJitsuAttendances
            .Where(a => a.StudentId == studentId);
        
        if (startDate.HasValue)
            query = query.Where(a => a.Date >= startDate.Value.Date);
            
        if (endDate.HasValue)
            query = query.Where(a => a.Date <= endDate.Value.Date);
        
        var attendances = await query
            .OrderByDescending(a => a.Date)
            .Select(a => new JiuJitsuAttendanceDto
            {
                Id = a.Id,
                Date = a.Date,
                ClassType = a.ClassType,
                IsPresent = a.IsPresent,
                Notes = a.Notes
            })
            .ToListAsync();
        
        return Ok(attendances);
    }
    
    // Pagamentos
    [HttpPost("{studentId}/payments")]
    public async Task<ActionResult<JiuJitsuPaymentDto>> CreatePayment(int studentId, [FromBody] CreatePaymentDto paymentDto)
    {
        var student = await _context.JiuJitsuStudents.FindAsync(studentId);
        if (student == null)
        {
            return NotFound("Aluno não encontrado");
        }
        
        var payment = new JiuJitsuPayment
        {
            StudentId = studentId,
            PaymentDate = paymentDto.PaymentDate,
            Amount = paymentDto.Amount,
            PaymentMethod = paymentDto.PaymentMethod,
            ReferenceMonth = new DateTime(paymentDto.ReferenceMonth.Year, paymentDto.ReferenceMonth.Month, 1),
            Notes = paymentDto.Notes
        };
        
        // Atualizar status de pagamento do aluno
        student.LastPaymentDate = payment.PaymentDate;
        student.PaymentStatus = "Em dia";
        
        _context.JiuJitsuPayments.Add(payment);
        await _context.SaveChangesAsync();
        
        var paymentResultDto = new JiuJitsuPaymentDto
        {
            Id = payment.Id,
            PaymentDate = payment.PaymentDate,
            Amount = payment.Amount,
            PaymentMethod = payment.PaymentMethod,
            ReferenceMonth = payment.ReferenceMonth,
            Notes = payment.Notes
        };
        
        return CreatedAtAction(nameof(GetStudent), new { id = studentId }, paymentResultDto);
    }
    
    [HttpGet("{studentId}/payments")]
    public async Task<ActionResult<IEnumerable<JiuJitsuPaymentDto>>> GetStudentPayments(int studentId)
    {
        var payments = await _context.JiuJitsuPayments
            .Where(p => p.StudentId == studentId)
            .OrderByDescending(p => p.PaymentDate)
            .Select(p => new JiuJitsuPaymentDto
            {
                Id = p.Id,
                PaymentDate = p.PaymentDate,
                Amount = p.Amount,
                PaymentMethod = p.PaymentMethod,
                ReferenceMonth = p.ReferenceMonth,
                Notes = p.Notes
            })
            .ToListAsync();
        
        return Ok(payments);
    }
}
