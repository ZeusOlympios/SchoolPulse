namespace SchoolPulse.API.Models
{
    public class Result
    {
        public int Id { get; set; }
        public int LearnerId { get; set; }
        public Learner? Learner { get; set; }

        public string Subject { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public string Term { get; set; } = string.Empty; // Term 1, 2, 3, 4
        public int Year { get; set; }

        // Marks
        public double ClassworkMark { get; set; }
        public double TestMark { get; set; }
        public double ExamMark { get; set; }
        public double FinalMark { get; set; }

        // SA grading scale
        public string PerformanceLevel { get; set; } = string.Empty; // 1-7
        public string Symbol { get; set; } = string.Empty; // A, B, C, D, E, F
        public bool Passed { get; set; }

        public string RecordedBy { get; set; } = string.Empty;
        public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    }
}