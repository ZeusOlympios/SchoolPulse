using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolPulse.API.Data;
using SchoolPulse.API.Models;

namespace SchoolPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TextbookMaterialController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TextbookMaterialController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TextbookMaterial>>> GetAll()
        {
            return await _context.TextbookMaterials
                .OrderBy(t => t.Grade)
                .ThenBy(t => t.Subject)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TextbookMaterial>> GetById(int id)
        {
            var item = await _context.TextbookMaterials.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpGet("grade/{grade}")]
        public async Task<ActionResult<IEnumerable<TextbookMaterial>>> GetByGrade(string grade)
        {
            return await _context.TextbookMaterials
                .Where(t => t.Grade == grade)
                .OrderBy(t => t.Subject)
                .ToListAsync();
        }

        [HttpGet("subject/{subject}")]
        public async Task<ActionResult<IEnumerable<TextbookMaterial>>> GetBySubject(string subject)
        {
            return await _context.TextbookMaterials
                .Where(t => t.Subject == subject)
                .OrderBy(t => t.Grade)
                .ToListAsync();
        }

        [HttpGet("low-stock")]
        public async Task<ActionResult<IEnumerable<TextbookMaterial>>> GetLowStock()
        {
            return await _context.TextbookMaterials
                .Where(t => t.AvailableCount <= 5)
                .OrderBy(t => t.AvailableCount)
                .ToListAsync();
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var total = await _context.TextbookMaterials.CountAsync();
            var totalStock = await _context.TextbookMaterials.SumAsync(t => t.TotalStock);
            var totalIssued = await _context.TextbookMaterials.SumAsync(t => t.IssuedCount);
            var totalDamaged = await _context.TextbookMaterials.SumAsync(t => t.DamagedCount);
            var totalLost = await _context.TextbookMaterials.SumAsync(t => t.LostCount);
            var byCategory = await _context.TextbookMaterials
                .GroupBy(t => t.Category)
                .Select(g => new { Category = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(new
            {
                Total = total,
                TotalStock = totalStock,
                TotalIssued = totalIssued,
                TotalDamaged = totalDamaged,
                TotalLost = totalLost,
                ByCategory = byCategory
            });
        }

        [HttpPost]
        public async Task<ActionResult<TextbookMaterial>> Create(TextbookMaterial item)
        {
            item.AvailableCount = item.TotalStock - item.IssuedCount;
            item.RecordedAt = DateTime.UtcNow;
            _context.TextbookMaterials.Add(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TextbookMaterial item)
        {
            if (id != item.Id) return BadRequest();
            item.AvailableCount = item.TotalStock - item.IssuedCount;
            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.TextbookMaterials.AnyAsync(t => t.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.TextbookMaterials.FindAsync(id);
            if (item == null) return NotFound();
            _context.TextbookMaterials.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}