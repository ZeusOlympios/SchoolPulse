namespace SchoolPulse.API.Models
{
    public class School
    {
        public int Id { get; set; }
        public string SchoolName { get; set; } = string.Empty;
        public string EmisNumber { get; set; } = string.Empty; // SA school identifier
        public string SchoolType { get; set; } = string.Empty; // Primary, Secondary, Combined
        public string Phase { get; set; } = string.Empty; // Foundation, Intermediate, Senior, FET
        public string Quintile { get; set; } = string.Empty; // 1-5 SA funding quintile
        public string Circuit { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;

        // Location
        public string PhysicalAddress { get; set; } = string.Empty;
        public string PostalAddress { get; set; } = string.Empty;
        public string Town { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;

        // Contact
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;

        // Leadership
        public string PrincipalName { get; set; } = string.Empty;
        public string PrincipalPhone { get; set; } = string.Empty;
        public string PrincipalEmail { get; set; } = string.Empty;
        public string DeputyPrincipalName { get; set; } = string.Empty;

        // Stats
        public int TotalLearnerCapacity { get; set; }
        public int NumberOfClassrooms { get; set; }
        public DateTime EstablishedDate { get; set; }
    }
}