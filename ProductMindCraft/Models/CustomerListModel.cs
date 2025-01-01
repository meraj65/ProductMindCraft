using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductMindCraft.Models
{
    public class CustomerListModel
    {
        public List<Customer> Customers { get; set; }
        public int PageNo { get; set; }
        public int PageSize { get; set; }
        public int TotalRows { get; set; }
    }
}