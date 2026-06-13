using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolPulse.API.Data;
using SchoolPulse.API.Models;

namespace SchoolPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LearnerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LearnerController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/learner
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Learner>>> GetAll()
        {
            return await _context.Learners
                .Where(l => l.IsActive)
                .OrderBy(l => l.LastName)
                .ToListAsync();
        }

        // GET: api/learner/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Learner>> GetById(int id)
        {
            var learner = await _context.Learners.FindAsync(id);
            if (learner == null) return NotFound();
            return learner;
        }

        // GET: api/learner/grade/Grade 4
        [HttpGet("grade/{grade}")]
        public async Task<ActionResult<IEnumerable<Learner>>> GetByGrade(string grade)
        {
            return await _context.Learners
                .Where(l => l.Grade == grade && l.IsActive)
                .OrderBy(l => l.LastName)
                .ToListAsync();
        }

        // GET: api/learner/search?name=john
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Learner>>> Search([FromQuery] string name)
        {
            return await _context.Learners
                .Where(l => (l.FirstName.Contains(name) || l.LastName.Contains(name)) && l.IsActive)
                .OrderBy(l => l.LastName)
                .ToListAsync();
        }

        // GET: api/learner/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var total = await _context.Learners.CountAsync(l => l.IsActive);
            var byGrade = await _context.Learners
                .Where(l => l.IsActive)
                .GroupBy(l => l.Grade)
                .Select(g => new { Grade = g.Key, Count = g.Count() })
                .ToListAsync();
            var byGender = await _context.Learners
                .Where(l => l.IsActive)
                .GroupBy(l => l.Gender)
                .Select(g => new { Gender = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(new { Total = total, ByGrade = byGrade, ByGender = byGender });
        }

        // POST: api/learner
        [HttpPost]
        public async Task<ActionResult<Learner>> Create(Learner learner)
        {
            learner.EnrollmentDate = DateTime.UtcNow;
            _context.Learners.Add(learner);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = learner.Id }, learner);
        }

        // PUT: api/learner/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Learner learner)
        {
            if (id != learner.Id) return BadRequest();
            _context.Entry(learner).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Learners.AnyAsync(l => l.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/learner/5 (soft delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var learner = await _context.Learners.FindAsync(id);
            if (learner == null) return NotFound();

            learner.IsActive = false;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}