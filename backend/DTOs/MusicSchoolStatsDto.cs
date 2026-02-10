namespace ChurchManagement.DTOs;

public class MusicSchoolStatsDto
{
    public int TotalStudents { get; set; }
    public int ActiveStudents { get; set; }
    public int InactiveStudents { get; set; }
    public Dictionary<string, int> StudentsByInstrument { get; set; } = new();
    public Dictionary<string, int> StudentsByLevel { get; set; } = new();
    public Dictionary<string, int> StudentsByPaymentStatus { get; set; } = new();
    public decimal TotalMonthlyRevenue { get; set; }
    public int StudentsWithPendingPayment { get; set; }
}
