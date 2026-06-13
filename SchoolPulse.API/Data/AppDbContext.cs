using Microsoft.EntityFrameworkCore;
using SchoolPulse.API.Models;

namespace SchoolPulse.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Learner> Learners { get; set; }
        public DbSet<Staff> Staff { get; set; }
        public DbSet<School> Schools { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Result> Results { get; set; }
        public DbSet<Infrastructure> Infrastructures { get; set; }
        public DbSet<TextbookMaterial> TextbookMaterials { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Learner
            modelBuilder.Entity<Learner>()
                .HasIndex(l => l.Grade);

            // Attendance relationships
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Learner)
                .WithMany()
                .HasForeignKey(a => a.LearnerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Staff)
                .WithMany()
                .HasForeignKey(a => a.StaffId)
                .OnDelete(DeleteBehavior.SetNull);

            // Result relationship
            modelBuilder.Entity<Result>()
                .HasOne(r => r.Learner)
                .WithMany()
                .HasForeignKey(r => r.LearnerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Decimal precision
            modelBuilder.Entity<TextbookMaterial>()
                .Property(t => t.UnitCost)
                .HasPrecision(18, 2);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    if (!optionsBuilder.IsConfigured)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=SchoolPulseDB;Username=postgres;Password=SchoolPulse@123");
    }
}
    }
}