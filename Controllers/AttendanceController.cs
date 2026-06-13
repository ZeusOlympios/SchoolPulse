using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolPulse.API.Data;
using SchoolPulse.API.Models;

namespace SchoolPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAll()
        {
            return await _context.Attendances
                .Include(a => a.Learner)
                .Include(a => a.Staff)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetById(int id)
        {
            var attendance = await _context.Attendances
                .Include(a => a.Learner)
                .Include(a => a.Staff)
                .FirstOrDefaultAsync(a => a.Id == id);
            if (attendance == null) return NotFound();
            return attendance;
        }

        [HttpGet("date/{date}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetByDate(DateTime date)
        {
            return await _context.Attendances
                .Include(a => a.Learner)
                .Include(a => a.Staff)
                .Where(a => a.Date.Date == date.Date)
                .ToListAsync();
        }

        [HttpGet("learner/{learnerId}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetByLearner(int learnerId)
        {
            return await _context.Attendances
                .Where(a => a.LearnerId == learnerId)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        [HttpGet("staff/{staffId}")]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetByStaff(int staffId)
        {
            return await _context.Attendances
                .Where(a => a.StaffId == staffId)
                .OrderByDescending(a => a.Date)
                .ToListAsync();
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var today = DateTime.UtcNow.Date;
            var presentToday = await _context.Attendances
                .CountAsync(a => a.Date.Date == today && a.Status == "Present");
            var absentToday = await _context.Attendances
                .CountAsync(a => a.Date.Date == today && a.Status == "Absent");
            var lateToday = await _context.Attendances
                .CountAsync(a => a.Date.Date == today && a.Status == "Late");

            return Ok(new
            {
                PresentToday = presentToday,
                AbsentToday = absentToday,
                LateToday = lateToday
            });
        }

        [HttpPost]
        public async Task<ActionResult<Attendance>> Create(Attendance attendance)
        {
            attendance.RecordedAt = DateTime.UtcNow;
            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = attendance.Id }, attendance);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Attendance attendance)
        {
            if (id != attendance.Id) return BadRequest();
            _context.Entry(attendance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Attendances.AnyAsync(a => a.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance == null) return NotFound();
            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}