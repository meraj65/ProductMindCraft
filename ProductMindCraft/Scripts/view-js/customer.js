$(document).ready(function () {
    loadCustomerProject(1);
    $(".PagerUser").on('click', 'a.page', function (e) {
        loadCustomerProject(parseInt($(this).attr('page')));
    });

    $("#nameFilter").keyup(function () {
        loadCustomerProject(1);
    });

});
function loadCustomerProject(pageIndex) {
    var tableModel = {
        searchTerm: $("#nameFilter").val(),
        fromDate: $("#fromDate").val(),
        toDate: $("#toDate").val(),
        customerIdFilter: $("#customerIdFilter").val(),
        customerNameFilter: $("#customerNameFilter").val(),

        pageNo: pageIndex,
        pageSize: 5
    };

    $.ajax({
        type: "GET",
        url: "/Customer/GetCustomers",
        contentType: "application/json; charset=utf-8",
        data: tableModel,
        success: function (data) {
            $('#customerTbl tbody').empty();

            if (data.Customers.length === 0) {
                $('#customerTbl tbody').append("<tr><td colspan='12' style='text-align: center;font-weight: 700'>No Records found.</td></tr>");
            }

            $.each(data.Customers, function (i, item) {
                var rows = "<tr>";

                //rows += `<td>
                //<a href="javascript:void(0);" onclick="openEditModal(${item.CustomerId})">
                //${item.CustomerId}
                //</a>
                //</td>`;
                rows += `<td>
                <a href="javascript:void(0);" onclick="openEditModal(${item.CustomerId})" style="text-decoration: none;">
                ${item.CustomerId}
                </a>
                </td>`;


                rows += "<td>" + item.CustomerName + "</td>";
                rows += "<td>" + item.AadhaarNumber + "</td>";
                rows += "<td>" + item.Email + "</td>";
                rows += "<td>" + item.PhoneNumber + "</td>";
                var address = item.AddressLine1;
                if (item.AddressLine2) {
                    address += " " + item.AddressLine2;
                }
                rows += "<td>" + address + "</td>";
                rows += "<td>" + item.Gender + "</td>";
                rows += "<td>" + item.Country + "</td>";
                rows += "<td>" + item.State + "</td>";
                var formattedDate = formatDate(item.CreatedDate);
                rows += "<td>" + formattedDate + "</td>";
                rows += "</tr>";
                $('#customerTbl tbody').append(rows);
            });

            $(".PagerUser").custom_Pager({
                ActiveCssClass: "current",
                PagerCssClass: "pgReason",
                PageIndex: data.PageNo,
                PageSize: data.PageSize,
                RecordCount: data.TotalRows
            });
        },
        error: function () {
            alert("Error fetching data.");
        }
    });
}

function formatDate(date) {
    if (date.includes("/Date")) {
        var timestamp = date.match(/\/Date\((\d+)\)\//)[1];
        var dateObj = new Date(parseInt(timestamp));
        return formatDateAsString(dateObj);
    } else {
        var dateObj = new Date(date);
        return formatDateAsString(dateObj);
    }
}
function formatDateAsString(date) {
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + '-' + month + '-' + day;
}
function addCustomer() {
    $.ajax({
        type: "GET",
        url: '/Customer/AddNewCustomer',
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        success: function (data) {
            initializeCountryStateDropdown();
            $('#modal-AddEditCustomer').find(".modal-body").html(data);
            $("#modalLabel").text("Add Customer");
            const saveButton = $("#Add-submit-button");
            saveButton.text("Save");
            saveButton.off("click");
            saveButton.on("click", function () {
                AddCustomerModal();
            });
            $('#modal-AddEditCustomer').modal('show');
            attachCustomerNameValidation();
            attachEmailValidation();
            $('#modal-AddEditCustomer').on('shown.bs.modal', function () {
                $(this).find('#CustomerName').focus();
            });
        },
        error: function (data) {
            if (data.status == 403) {
                window.location = '/';
            }
        }
    });
}

function Validation() {
    let isValid = true;

    if ($("#CustomerName").val().trim() == "") {
        $("#CustomerNameVal").show();
        isValid = false;
    } else {
        $("#CustomerNameVal").hide();
    }

    if ($("#AadhaarNumber").val().trim() == "" || !/^\d{12}$/.test($("#AadhaarNumber").val().trim())) {
        $("#AadhaarNumberVal").show();
        isValid = false;
    } else {
        $("#AadhaarNumberVal").hide();
    }
    if (!isAadhaarValid) {
        isValid = false;
        $("#AadhaarNumberVal").html('<span style="color: red;"><i class="fas fa-times-circle"></i> Invalid Aadhaar</span>').show();
    }

    if ($("#Email").val().trim() == "" || !/^\S+@\S+\.\S+$/.test($("#Email").val().trim())) {
        $("#EmailVal").show();
        isValid = false;
    } else {
        $("#EmailVal").hide();
    }

    if ($("#PhoneNumber").val().trim() == "" || !/^\d{10}$/.test($("#PhoneNumber").val().trim())) {
        $("#PhoneNumberVal").show();
        isValid = false;
    } else {
        $("#PhoneNumberVal").hide();
    }

    if ($("#AddressLine1").val().trim() == "") {
        $("#AddressVal").show();
        isValid = false;
    } else {
        $("#AddressVal").hide();
    }

    if ($("#countryDropdown").val() == "") {
        $("#CountryVal").show();
        isValid = false;
    } else {
        $("#CountryVal").hide();
    }

    if ($("#stateDropdown").val() == "") {
        $("#StateVal").show();
        isValid = false;
    } else {
        $("#StateVal").hide();
    }

    if ($("#Gender").val().trim() == "") {
        $("#GenderVal").show();
        isValid = false;
    } else {
        $("#GenderVal").hide();
    }

    return isValid;
}

function AddCustomerModal() {
    if (Validation()) {
        $(".Validatetxt").hide();
        let sampleModel = {
            CustomerName: $("#CustomerName").val().trim(),
            AadhaarNumber: $("#AadhaarNumber").val().trim(),
            Email: $("#Email").val().trim(),
            PhoneNumber: $("#PhoneNumber").val().trim(),
            AddressLine1: $("#AddressLine1").val().trim(),
            AddressLine2: $("#AddressLine2").val().trim(),
            Gender: $("#Gender").val().trim(),
            Country: $("#countryDropdown").val().trim(),
            State: $("#stateDropdown").val().trim(),
        };

        $.ajax({
            type: "POST",
            url: "/Customer/AddCustomer",
            data: JSON.stringify(sampleModel),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    $("#modal-AddEditCustomer").modal("hide");
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Customer Added Successfully",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    loadCustomerProject(1);
                } else {
                    //alert("Error: " + response.responseMessage);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: response.responseMessage
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", error);
                alert("An error occurred while adding the customer.");
            }
        });
    }
}

function searchRefByFilterFromListing(event) {
    loadCustomerProject(1);
}

function prepareTableData(pageIndex) {

    var tableModel = {};
    tableModel.PageNo = parseInt(pageIndex);
    tableModel.sortColumnName = $.trim($("#hdnsortColumnNameForListing").val());
    tableModel.sortDirection = $.trim($("#hdnSortOrderForListing").val());

    tableModel.departmentName = $.trim($("#txtSearchCustomer").val());
    return tableModel;
}

let isAadhaarValid = false;

function validateAadhaar() {
    var aadhaarNumber = $("#AadhaarNumber").val();
    var resultDiv = $("#AadhaarNumberVal");
    resultDiv.html("");

    if (!aadhaarNumber) {
        resultDiv.html('<span style="color: red;">Aadhaar number is required.</span>');
        isAadhaarValid = false;
        return;
    }

    $.ajax({
        url: "/api/ValidateAadhaar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ AadhaarNumber: aadhaarNumber }),
        async: false,
        success: function (response) {
            if (response.IsValid) {
                resultDiv.html('<span style="color: green;"><i class="fas fa-check-circle"></i> Valid Aadhaar</span>').show();
                isAadhaarValid = true;
            } else {
                resultDiv.html('<span style="color: red;"><i class="fas fa-times-circle"></i> Invalid Aadhaar</span>').show();
                isAadhaarValid = false;
            }
        },
        error: function () {
            resultDiv.html('<span style="color: red;">Error validating Aadhaar. Please try again.</span>');
            isAadhaarValid = false;
        }
    });
}

function isNumberKey(event) {
    const charCode = event.which || event.keyCode;
    if (charCode >= 48 && charCode <= 57) return true;
    return false;
}
function openEditModal(customerId) {
    $.ajax({
        url: '/Customer/AddNewCustomer',
        type: "GET",
        success: function (htmlContent) {
            $('.modal-body').html(htmlContent);

            fetchCustomerData(customerId);
        },
        error: function () {
            alert("Error loading modal content.");
        }
    });
}

function fetchCustomerData(customerId) {
    $.ajax({
        url: `Customer/GetCustomerById?customerId=${customerId}`,
        type: "GET",
        success: function (response) {
            if (response.success) {
                const data = response.data;
                initializeCountryStateDropdown();
                // Populate modal fields
                $("#CustomerName").val(data.CustomerName || "");
                $("#AadhaarNumber").val(data.AadhaarNumber || "");
                $("#Email").val(data.Email || "");
                $("#PhoneNumber").val(data.PhoneNumber || "");
                $("#AddressLine1").val(data.AddressLine1 || "");
                $("#AddressLine2").val(data.AddressLine2 || "");
                $("#countryDropdown").val(data.Country || "").trigger("change");
                $("#stateDropdown").val(data.State || "");
                $("#Gender").val(data.Gender || "");

                $("#modalLabel").text("Edit Customer");

                const saveButton = $("#Add-submit-button");
                saveButton.text("Update Customer");
                saveButton.off("click");
                saveButton.on("click", function () {
                    updateCustomer(customerId);
                });

                $("#modal-AddEditCustomer").modal("show");
            } else {
                alert(response.message);
            }
        },
        error: function () {
            alert("Error fetching customer details.");
        }
    });
}
function initializeCountryStateDropdown() {
    const countryStates = {
        "India": ["Maharashtra", "Karnataka", "Delhi", "Gujarat"],
        "USA": ["California", "New York", "Texas", "Florida"]
    };

    $('#countryDropdown').on('change', function () {
        const country = $(this).val();
        const stateDropdown = $('#stateDropdown');

        stateDropdown.html('<option value="">Select State</option>');

        if (countryStates[country]) {
            countryStates[country].forEach(state => {
                stateDropdown.append(`<option value="${state}">${state}</option>`);
            });
        }
    });
}

initializeCountryStateDropdown();
function updateCustomer(customerId) {
    const customerData = {
        CustomerId: customerId,
        CustomerName: $("#CustomerName").val(),
        AadhaarNumber: $("#AadhaarNumber").val(),
        Email: $("#Email").val(),
        PhoneNumber: $("#PhoneNumber").val(),
        AddressLine1: $("#AddressLine1").val(),
        AddressLine2: $("#AddressLine2").val(),
        Country: $("#countryDropdown").val(),
        State: $("#stateDropdown").val(),
        Gender: $("#Gender").val(),
    };

    $.ajax({
        url: "Customer/UpdateCustomer",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(customerData),
        success: function (response) {
            if (response.success) {
                alert("Customer updated successfully.");
                $("#modal-AddEditCustomer").modal("hide");
                loadCustomerProject();
            } else {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Customer Updated Successfully",
                    showConfirmButton: false,
                    timer: 2000
                });
                loadCustomerProject(1);
            }
        },
        error: function () {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.responseMessage
            });
        }
    });
}

function applyFilters() {
    loadCustomerProject(1);
}

function attachCustomerNameValidation() {
    const customerNameInput = document.getElementById('CustomerName');
    const errorMessage = document.getElementById('CustomerNameVal');

    if (customerNameInput) {
        customerNameInput.addEventListener('input', function () {
            const validNamePattern = /^[a-zA-Z\s]*$/;

            if (!validNamePattern.test(this.value)) {
                this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
                errorMessage.textContent = "Customer Name cannot contain numbers.";
                errorMessage.style.display = "block";
            } else {
                errorMessage.style.display = "none";
            }
        });
    }
}
function attachEmailValidation() {
    const emailInput = document.getElementById('Email');
    const errorMessage = document.getElementById('EmailVal');

    if (emailInput) {
        emailInput.addEventListener('input', function () {
            // Regex pattern for basic email validation
            const validEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!validEmailPattern.test(this.value)) {
                errorMessage.textContent = "Please enter a valid email address.";
                errorMessage.style.display = "block";
            } else {
                errorMessage.style.display = "none";
            }
        });
    }
}

