using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolPulse.API.Data;
using SchoolPulse.API.Models;

namespace SchoolPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResultController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ResultController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Result>>> GetAll()
        {
            return await _context.Results
                .Include(r => r.Learner)
                .OrderByDescending(r => r.Year)
                .ThenBy(r => r.Term)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Result>> GetById(int id)
        {
            var result = await _context.Results
                .Include(r => r.Learner)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (result == null) return NotFound();
            return result;
        }

        [HttpGet("learner/{learnerId}")]
        public async Task<ActionResult<IEnumerable<Result>>> GetByLearner(int learnerId)
        {
            return await _context.Results
                .Where(r => r.LearnerId == learnerId)
                .OrderByDescending(r => r.Year)
                .ThenBy(r => r.Term)
                .ToListAsync();
        }

        [HttpGet("grade/{grade}/term/{term}/year/{year}")]
        public async Task<ActionResult<IEnumerable<Result>>> GetByGradeTerm(string grade, string term, int year)
        {
            return await _context.Results
                .Include(r => r.Learner)
                .Where(r => r.Grade == grade && r.Term == term && r.Year == year)
                .OrderBy(r => r.Learner!.LastName)
                .ToListAsync();
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var currentYear = DateTime.UtcNow.Year;
            var passRate = await _context.Results
                .Where(r => r.Year == currentYear)
                .GroupBy(r => r.Passed)
                .Select(g => new { Passed = g.Key, Count = g.Count() })
                .ToListAsync();

            var avgBySubject = await _context.Results
                .Where(r => r.Year == currentYear)
                .GroupBy(r => r.Subject)
                .Select(g => new { Subject = g.Key, Average = g.Average(r => r.FinalMark) })
                .ToListAsync();

            return Ok(new { PassRate = passRate, AverageBySubject = avgBySubject });
        }

        [HttpPost]
        public async Task<ActionResult<Result>> Create(Result result)
        {
            result.RecordedAt = DateTime.UtcNow;
            _context.Results.Add(result);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Result result)
        {
            if (id != result.Id) return BadRequest();
            _context.Entry(result).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Results.AnyAsync(r => r.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _context.Results.FindAsync(id);
            if (result == null) return NotFound();
            _context.Results.Remove(result);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}