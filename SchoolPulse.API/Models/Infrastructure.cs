namespace SchoolPulse.API.Models
{
    public class Infrastructure
    {
        public int Id { get; set; }
        public string FacilityName { get; set; } = string.Empty;
        public string FacilityType { get; set; } = string.Empty; // Classroom, Library, Lab, Hall, Toilet, Office, Staffroom
        public string Block { get; set; } = string.Empty;
        public string RoomNumber { get; set; } = string.Empty;
        public int Capacity { get; set; }

        // Condition
        public string Condition { get; set; } = string.Empty; // Good, Fair, Poor, Condemned
        public string OwnershipStatus { get; set; } = string.Empty; // Owned, Rented, Mobile
        public string ConstructionType { get; set; } = string.Empty; // Brick, Prefab, Mud, Container

        // Utilities
        public bool HasElectricity { get; set; }
        public bool HasWater { get; set; }
        public bool HasInternet { get; set; }
        public bool IsAccessible { get; set; } // Wheelchair accessible

        // Maintenance
        public DateTime? LastMaintainedDate { get; set; }
        public string? MaintenanceNotes { get; set; }
        public bool NeedsMaintenance { get; set; }

        public DateTime DateRecorded { get; set; } = DateTime.UtcNow;
    }
}