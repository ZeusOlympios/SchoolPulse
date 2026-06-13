using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolPulse.API.Data;
using SchoolPulse.API.Models;

namespace SchoolPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StaffController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Staff>>> GetAll()
        {
            return await _context.Staff
                .Where(s => s.IsActive)
                .OrderBy(s => s.LastName)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Staff>> GetById(int id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null) return NotFound();
            return staff;
        }

        [HttpGet("type/{staffType}")]
        public async Task<ActionResult<IEnumerable<Staff>>> GetByType(string staffType)
        {
            return await _context.Staff
                .Where(s => s.StaffType == staffType && s.IsActive)
                .OrderBy(s => s.LastName)
                .ToListAsync();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Staff>>> Search([FromQuery] string name)
        {
            return await _context.Staff
                .Where(s => (s.FirstName.Contains(name) || s.LastName.Contains(name)) && s.IsActive)
                .OrderBy(s => s.LastName)
                .ToListAsync();
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var total = await _context.Staff.CountAsync(s => s.IsActive);
            var educators = await _context.Staff.CountAsync(s => s.StaffType == "Educator" && s.IsActive);
            var nonEducators = await _context.Staff.CountAsync(s => s.StaffType == "Non-Educator" && s.IsActive);
            var byDepartment = await _context.Staff
                .Where(s => s.IsActive)
                .GroupBy(s => s.Department)
                .Select(g => new { Department = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(new { Total = total, Educators = educators, NonEducators = nonEducators, ByDepartment = byDepartment });
        }

        [HttpPost]
        public async Task<ActionResult<Staff>> Create(Staff staff)
        {
            _context.Staff.Add(staff);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = staff.Id }, staff);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Staff staff)
        {
            if (id != staff.Id) return BadRequest();
            _context.Entry(staff).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Staff.AnyAsync(s => s.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null) return NotFound();
            staff.IsActive = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
