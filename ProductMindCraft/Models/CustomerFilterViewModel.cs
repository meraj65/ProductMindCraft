using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductMindCraft.Models
{
      public class CustomerFilterViewModel
        {
            public string CustomerId { get; set; }
            public string CustomerName { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public List<Customer> Customers { get; set; }
        }
}