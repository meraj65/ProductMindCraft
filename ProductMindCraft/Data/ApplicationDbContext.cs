using System.Data.Entity;
using ProductMindCraft.Models;

namespace ProductMindCraft.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() : base("name=MyConnectionString")
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<AdharValidation> AdharValidation { get; set; }
    }
}
