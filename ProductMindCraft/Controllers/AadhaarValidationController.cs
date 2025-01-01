using System.Linq;
using System.Web.Http;
using ProductMindCraft.Data;
using ProductMindCraft.Models;

public class AadhaarValidationController : ApiController
{
    private readonly ApplicationDbContext _context;

    public AadhaarValidationController()
    {
        _context = new ApplicationDbContext();
    }

    [HttpPost]
    [Route("api/ValidateAadhaar")]
    public IHttpActionResult ValidateAadhaar(AdharValidation request)
    {
        if (request == null || string.IsNullOrEmpty(request.AadhaarNumber))
        {
            return BadRequest("Invalid request data.");
        }

        var isValid = _context.AdharValidation.Any(c => c.AadhaarNumber == request.AadhaarNumber);

        return Ok(new { IsValid = isValid });
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            _context.Dispose();
        }
        base.Dispose(disposing);
    }
}
