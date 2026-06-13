namespace SchoolPulse.API.Models
{
    public class TextbookMaterial
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Textbook, Workbook, Stationery, Equipment
        public string Subject { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public string Publisher { get; set; } = string.Empty;
        public string ISBN { get; set; } = string.Empty;
        public int Year { get; set; }

        // Stock
        public int TotalStock { get; set; }
        public int IssuedCount { get; set; }
        public int AvailableCount { get; set; }
        public int DamagedCount { get; set; }
        public int LostCount { get; set; }

        // Procurement
        public string FundingSource { get; set; } = string.Empty; // LTSM, SGB, Donation
        public decimal UnitCost { get; set; }
        public DateTime DateReceived { get; set; }
        public string Condition { get; set; } = string.Empty; // New, Good, Fair, Poor

        public string RecordedBy { get; set; } = string.Empty;
        public DateTime RecordedAt { get; set; } = DateTime.UtcNow;
    }
}