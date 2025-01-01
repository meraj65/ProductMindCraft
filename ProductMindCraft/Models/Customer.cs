using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductMindCraft.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string AadhaarNumber { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string Gender { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}