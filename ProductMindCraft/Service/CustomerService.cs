using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Mvc;
using ProductMindCraft.Data;
using ProductMindCraft.Models;

namespace ProductMindCraft.Service
{
    public class CustomerService
    {
        private readonly ApplicationDbContext _context;

        public CustomerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public CustomerListModel GetCustomers(string customerNameFilter, string customerIdFilter,string searchTerm, string fromDate, string toDate, int pageNo, int pageSize)
        {
            try
            {
                var query = _context.Customers.AsQueryable();

                if (!string.IsNullOrEmpty(searchTerm))
                {
                    query = query.Where(c =>
                        c.CustomerId.ToString().Contains(searchTerm) ||
                        
                        c.CustomerName.Contains(searchTerm) ||
                        c.AadhaarNumber.Contains(searchTerm) ||
                        c.Email.Contains(searchTerm) ||
                        c.PhoneNumber.Contains(searchTerm) ||
                        c.AddressLine1.Contains(searchTerm) ||
                        c.AddressLine2.Contains(searchTerm) ||
                        c.Gender.Contains(searchTerm) ||
                        c.Country.Contains(searchTerm) ||
                        c.State.Contains(searchTerm)
                    );
                }
                if (!string.IsNullOrEmpty(customerIdFilter) || !string.IsNullOrEmpty(customerNameFilter))
                {
                    query = query.Where(c =>
                        (!string.IsNullOrEmpty(customerIdFilter) && c.CustomerId.ToString().Contains(customerIdFilter)) ||
                        (!string.IsNullOrEmpty(customerNameFilter) && c.CustomerName.Contains(customerNameFilter))
                    );
                }

                if (DateTime.TryParse(fromDate, out var startDate) && DateTime.TryParse(toDate, out var endDate))
                {
                    endDate = endDate.Date.AddDays(1).AddTicks(-1);

                    query = query.Where(c => c.CreatedDate >= startDate && c.CreatedDate <= endDate);
                }


                query = query.OrderByDescending(c => c.CreatedDate);


                var totalRows = query.Count();
                var customers = query.Skip((pageNo - 1) * pageSize)
                                     .Take(pageSize)
                                     .ToList();

                return new CustomerListModel
                {
                    Customers = customers,
                    PageNo = pageNo,
                    PageSize = pageSize,
                    TotalRows = totalRows
                };
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while fetching the customers.", ex);
            }
        }

        public async Task AddCustomer(Customer customer)
        {
            var existingCustomer = await _context.Customers
                .FirstOrDefaultAsync(c => c.AadhaarNumber == customer.AadhaarNumber);

            if (existingCustomer != null)
            {
                throw new InvalidOperationException("A customer with this Aadhaar number already exists.");
            }

            try
            {
                customer.CreatedDate = DateTime.Now;
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while adding the customer.", ex);
            }
        }


        public void UpdateCustomer(Customer customer)
        {
            try
            {
                var existingCustomer = _context.Customers.Find(customer.CustomerId);

                if (existingCustomer != null)
                {
                    existingCustomer.CustomerName = customer.CustomerName;
                    existingCustomer.AadhaarNumber = customer.AadhaarNumber;
                    existingCustomer.Email = customer.Email;
                    existingCustomer.PhoneNumber = customer.PhoneNumber;
                    existingCustomer.AddressLine1 = customer.AddressLine1;
                    existingCustomer.AddressLine2 = customer.AddressLine2;
                    existingCustomer.Country = customer.Country;
                    existingCustomer.State = customer.State;
                    existingCustomer.Gender = customer.Gender;

                    _context.Entry(existingCustomer).State = EntityState.Modified;
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while updating the customer.", ex);
            }
        }
        public Customer GetCustomerById(int customerId)
        {
            return _context.Customers.FirstOrDefault(c => c.CustomerId == customerId);
        }
        public List<Customer> GetCustomersByFilter(string customerId, string customerName, DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrEmpty(customerId))
            {
                query = query.Where(c => c.CustomerId.ToString().Contains(customerId));
            }

            if (!string.IsNullOrEmpty(customerName))
            {
                query = query.Where(c => c.CustomerName.Contains(customerName));
            }

            if (fromDate.HasValue)
            {
                query = query.Where(c => c.CreatedDate >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(c => c.CreatedDate <= toDate.Value);
            }

            return query.ToList();
        }

    }
}
