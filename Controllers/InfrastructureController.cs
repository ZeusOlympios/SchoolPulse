using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolPulse.API.Data;
using SchoolPulse.API.Models;

namespace SchoolPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InfrastructureController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InfrastructureController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Infrastructure>>> GetAll()
        {
            return await _context.Infrastructures
                .OrderBy(i => i.FacilityType)
                .ThenBy(i => i.FacilityName)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Infrastructure>> GetById(int id)
        {
            var facility = await _context.Infrastructures.FindAsync(id);
            if (facility == null) return NotFound();
            return facility;
        }

        [HttpGet("type/{facilityType}")]
        public async Task<ActionResult<IEnumerable<Infrastructure>>> GetByType(string facilityType)
        {
            return await _context.Infrastructures
                .Where(i => i.FacilityType == facilityType)
                .OrderBy(i => i.FacilityName)
                .ToListAsync();
        }

        [HttpGet("maintenance")]
        public async Task<ActionResult<IEnumerable<Infrastructure>>> GetNeedsMaintenance()
        {
            return await _context.Infrastructures
                .Where(i => i.NeedsMaintenance)
                .OrderBy(i => i.Condition)
                .ToListAsync();
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var total = await _context.Infrastructures.CountAsync();
            var byCondition = await _context.Infrastructures
                .GroupBy(i => i.Condition)
                .Select(g => new { Condition = g.Key, Count = g.Count() })
                .ToListAsync();
            var byType = await _context.Infrastructures
                .GroupBy(i => i.FacilityType)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToListAsync();
            var needsMaintenance = await _context.Infrastructures
                .CountAsync(i => i.NeedsMaintenance);

            return Ok(new
            {
                Total = total,
                ByCondition = byCondition,
                ByType = byType,
                NeedsMaintenance = needsMaintenance
            });
        }

        [HttpPost]
        public async Task<ActionResult<Infrastructure>> Create(Infrastructure facility)
        {
            facility.DateRecorded = DateTime.UtcNow;
            _context.Infrastructures.Add(facility);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = facility.Id }, facility);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Infrastructure facility)
        {
            if (id != facility.Id) return BadRequest();
            _context.Entry(facility).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Infrastructures.AnyAsync(i => i.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var facility = await _context.Infrastructures.FindAsync(id);
            if (facility == null) return NotFound();
            _context.Infrastructures.Remove(facility);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}