namespace SchoolPulse.API.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string AttendanceType { get; set; } = string.Empty; // Learner or Staff

        // Learner attendance
        public int? LearnerId { get; set; }
        public Learner? Learner { get; set; }

        // Staff attendance
        public int? StaffId { get; set; }
        public Staff? Staff { get; set; }

        public string Status { get; set; } = string.Empty; // Present, Absent, Late, Excused
        public string? Reason { get; set; }
        public string RecordedBy { get; set; } = string.Empty;
        public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    }
}