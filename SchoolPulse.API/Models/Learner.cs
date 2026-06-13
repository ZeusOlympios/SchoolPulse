namespace SchoolPulse.API.Models
{
    public class Learner
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Nationality { get; set; } = string.Empty;
        public string HomeLanguage { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public DateTime EnrollmentDate { get; set; }
        public bool IsActive { get; set; } = true;

        // Guardian info
        public string GuardianName { get; set; } = string.Empty;
        public string GuardianPhone { get; set; } = string.Empty;
        public string GuardianEmail { get; set; } = string.Empty;
        public string GuardianRelationship { get; set; } = string.Empty;

        // Address
        public string Address { get; set; } = string.Empty;
        public string Town { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
    }
}