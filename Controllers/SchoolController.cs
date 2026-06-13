using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolPulse.API.Data;
using SchoolPulse.API.Models;

namespace SchoolPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchoolController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SchoolController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<School>>> GetAll()
        {
            return await _context.Schools
                .OrderBy(s => s.SchoolName)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<School>> GetById(int id)
        {
            var school = await _context.Schools.FindAsync(id);
            if (school == null) return NotFound();
            return school;
        }

        [HttpGet("emis/{emisNumber}")]
        public async Task<ActionResult<School>> GetByEmis(string emisNumber)
        {
            var school = await _context.Schools
                .FirstOrDefaultAsync(s => s.EmisNumber == emisNumber);
            if (school == null) return NotFound();
            return school;
        }

        [HttpGet("province/{province}")]
        public async Task<ActionResult<IEnumerable<School>>> GetByProvince(string province)
        {
            return await _context.Schools
                .Where(s => s.Province == province)
                .OrderBy(s => s.SchoolName)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<School>> Create(School school)
        {
            _context.Schools.Add(school);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = school.Id }, school);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, School school)
        {
            if (id != school.Id) return BadRequest();
            _context.Entry(school).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Schools.AnyAsync(s => s.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var school = await _context.Schools.FindAsync(id);
            if (school == null) return NotFound();
            _context.Schools.Remove(school);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}