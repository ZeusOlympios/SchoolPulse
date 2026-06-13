namespace SchoolPulse.API.Models
{
    public class Staff
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string IdNumber { get; set; } = string.Empty;
        public string Nationality { get; set; } = string.Empty;
        public string HomeLanguage { get; set; } = string.Empty;

        // Employment
        public string StaffType { get; set; } = string.Empty; // Educator or Non-Educator
        public string JobTitle { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string EmploymentStatus { get; set; } = string.Empty; // Permanent, Contract, Substitute
        public DateTime AppointmentDate { get; set; }
        public string Persal { get; set; } = string.Empty; // SA government payroll number

        // Educator specific
        public string? QualificationLevel { get; set; }
        public string? SubjectsTaught { get; set; }
        public string? GradesTaught { get; set; }

        // Contact
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }
}