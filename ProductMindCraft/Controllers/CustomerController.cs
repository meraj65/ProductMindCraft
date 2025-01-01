using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using ProductMindCraft.Models;
using ProductMindCraft.Service;

namespace ProductMindCraft.Controllers
{
    public class CustomerController : Controller
    {
        private readonly CustomerService _customerService;

        public CustomerController(CustomerService customerService)
        {
            _customerService = customerService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCustomers(string customerNameFilter,string customerIdFilter, string searchTerm, string fromDate, string toDate, int pageNo = 1, int pageSize = 5)
        {
            var customers = _customerService.GetCustomers(customerNameFilter, customerIdFilter,searchTerm, fromDate, toDate, pageNo, pageSize);
            return Json(customers, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public async Task<JsonResult> AddCustomer(Customer customer)
        {
            if (customer == null)
            {
                return Json(new { success = false, responseMessage = "Invalid customer data." });
            }
            try
            {
                await _customerService.AddCustomer(customer);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, responseMessage = ex.Message });
            }
        }

        public ActionResult AddNewCustomer()
        {
            try
            {
                return PartialView("~/Views/Customer/_AddNewCustomer.cshtml");
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        
        [HttpPost]
        public JsonResult UpdateCustomer(Customer customer)
        {
            

            try
            {
                _customerService.UpdateCustomer(customer);
                return Json(new { success = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, responseMessage = ex.Message });
            }
        }
        [HttpGet]
        public JsonResult GetCustomerById(int customerId)
        {
            try
            {
                var customer = _customerService.GetCustomerById(customerId);

                if (customer == null)
                {
                    return Json(new { success = false, message = "Customer not found." }, JsonRequestBehavior.AllowGet);
                }

                return Json(new
                {
                    success = true,
                    data = new
                    {
                        customer.CustomerId,
                        customer.CustomerName,
                        customer.AadhaarNumber,
                        customer.Email,
                        customer.PhoneNumber,
                        customer.AddressLine1,
                        customer.AddressLine2,
                        customer.Country,
                        customer.State,
                        customer.Gender
                    }
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error fetching customer details.", error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetFilteredCustomers(string customerId, string customerName, string fromDate, string toDate)
        {
            try
            {
                DateTime? from = string.IsNullOrEmpty(fromDate) ? (DateTime?)null : DateTime.Parse(fromDate);
                DateTime? to = string.IsNullOrEmpty(toDate) ? (DateTime?)null : DateTime.Parse(toDate);

                var customers = _customerService.GetCustomersByFilter(customerId, customerName, from, to);

                ViewBag.CustomerIdFilter = customerId;
                ViewBag.CustomerNameFilter = customerName;
                ViewBag.FromDateFilter = fromDate;
                ViewBag.ToDateFilter = toDate;

                return View(customers); 
            }
            catch (Exception ex)
            {
                return View("Error", new HandleErrorInfo(ex, "Customer", "GetFilteredCustomers"));
            }
        }



    }

}
