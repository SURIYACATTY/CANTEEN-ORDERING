var bookingType = localStorage.getItem("bookingType") || "";
var tableNumber = localStorage.getItem("tableNumber") || "";
var tableCharge = Number(localStorage.getItem("tableCharge")) || 0;
var foodItems = JSON.parse(localStorage.getItem("foodItems") || "[]");

function saveData() {
    localStorage.setItem("bookingType", bookingType);
    localStorage.setItem("tableNumber", tableNumber);
    localStorage.setItem("tableCharge", tableCharge);
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
}

function selectBookingType(type, price) {
    bookingType = type;
    tableNumber = "";
    tableCharge = 0;

    localStorage.setItem("bookingType", type);
    localStorage.removeItem("tableNumber");
    localStorage.setItem("tableCharge", "0");

    var normalCard = document.getElementById("normalCard");
    var premiumCard = document.getElementById("premiumCard");

    if (normalCard) {
        normalCard.classList.remove("active");
    }

    if (premiumCard) {
        premiumCard.classList.remove("active");
    }

    if (type === "Normal" && normalCard) {
        normalCard.classList.add("active");
    }

    if (type === "Premium" && premiumCard) {
        premiumCard.classList.add("active");
    }

    showTables(type);
}

function showTables(type) {
    var normalTables = document.querySelectorAll(".normal-table");
    var premiumTables = document.querySelectorAll(".premium-table");

    normalTables.forEach(function(table) {
        table.style.display = "none";
    });

    premiumTables.forEach(function(table) {
        table.style.display = "none";
    });

    if (type === "Normal") {
        normalTables.forEach(function(table) {
            table.style.display = "flex";
        });
    }

    if (type === "Premium") {
        premiumTables.forEach(function(table) {
            table.style.display = "flex";
        });
    }
}

function selectTable(number, charge, element) {
    tableNumber = number;
    tableCharge = Number(charge);

    document.querySelectorAll(".table-card").forEach(function(card) {
        card.classList.remove("selected");
        card.classList.remove("active");
    });

    if (element) {
        element.classList.add("selected");
    }

    localStorage.setItem("tableNumber", tableNumber);
    localStorage.setItem("tableCharge", tableCharge);
}

function saveDate() {
    var date = document.getElementById("bookingDate");

    if (date && date.value) {
        localStorage.setItem("bookingDate", date.value);
    }
}

function saveTime() {
    var time = document.getElementById("bookingTime");

    if (time && time.value) {
        localStorage.setItem("bookingTime", time.value);
    }
}

function saveGuests() {
    var guests = document.getElementById("guests");

    if (guests && guests.value) {
        localStorage.setItem("guests", guests.value);
    }
}

function confirmBooking() {
    var date = document.getElementById("bookingDate");
    var time = document.getElementById("bookingTime");
    var guests = document.getElementById("guests");

    if (!bookingType) {
        alert("Please select Normal or Premium booking.");
        return;
    }

    if (!tableNumber) {
        alert("Please select a table.");
        return;
    }

    if (!date || !date.value) {
        alert("Please select a date.");
        return;
    }

    if (!time || !time.value) {
        alert("Please select a time.");
        return;
    }

    if (!guests || !guests.value) {
        alert("Please select the number of guests.");
        return;
    }

    localStorage.setItem("bookingType", bookingType);
    localStorage.setItem("tableNumber", tableNumber);
    localStorage.setItem("tableCharge", tableCharge);
    localStorage.setItem("bookingDate", date.value);
    localStorage.setItem("bookingTime", time.value);
    localStorage.setItem("guests", guests.value);
    localStorage.setItem("foodItems", JSON.stringify(foodItems));

    window.location.href = "menu.html";
}

function addFood(name, price, button) {
    price = Number(price);

    var existing = foodItems.find(function(item) {
        return item.name === name;
    });

    if (existing) {
        existing.quantity += 1;
    } else {
        foodItems.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveData();

    var selectedItem = foodItems.find(function(item) {
        return item.name === name;
    });

    if (button && selectedItem) {
        button.textContent = "Add (" + selectedItem.quantity + ")";
    }
}

function updateCart() {
    var cartCount = document.getElementById("cartCount");
    var cartTotal = document.getElementById("cartTotal");
    var miniCart = document.getElementById("miniCart");

    var count = 0;
    var total = 0;

    foodItems.forEach(function(item) {
        count += Number(item.quantity);
        total += Number(item.price) * Number(item.quantity);
    });

    if (cartCount) {
        cartCount.textContent = count;
    }

    if (cartTotal) {
        cartTotal.textContent = "₹" + total;
    }

    if (miniCart) {
        miniCart.style.display = count > 0 ? "flex" : "none";
    }
}

function getFoodTotal() {
    var total = 0;

    foodItems.forEach(function(item) {
        total += Number(item.price) * Number(item.quantity);
    });

    return total;
}

function increaseFood(index) {
    if (!foodItems[index]) {
        return;
    }

    foodItems[index].quantity += 1;
    saveData();
    updateCart();
    updateSummary();
}

function decreaseFood(index) {
    if (!foodItems[index]) {
        return;
    }

    foodItems[index].quantity -= 1;

    if (foodItems[index].quantity <= 0) {
        foodItems.splice(index, 1);
    }

    saveData();
    updateCart();
    updateSummary();
}

function removeFood(index) {
    if (!foodItems[index]) {
        return;
    }

    foodItems.splice(index, 1);
    saveData();
    updateCart();
    updateSummary();
}

function openCart() {
    window.location.href = "summary.html";
}

function goToSummary() {
    window.location.href = "summary.html";
}

function updateFoodSummary() {
    var container = document.getElementById("selectedFood");

    if (!container) {
        container = document.getElementById("foodSummary");
    }

    if (!container) {
        return;
    }

    if (foodItems.length === 0) {
        container.innerHTML = "<p>No food items selected.</p>";
        return;
    }

    var html = "";

    foodItems.forEach(function(item, index) {
        var itemTotal = Number(item.price) * Number(item.quantity);

        html += "<div class='food-item'>";
        html += "<div>";
        html += "<strong>" + item.name + "</strong>";
        html += "<small>₹" + item.price + " × " + item.quantity + "</small>";
        html += "</div>";
        html += "<div>";
        html += "<button type='button' onclick='decreaseFood(" + index + ")'>−</button>";
        html += "<span>" + item.quantity + "</span>";
        html += "<button type='button' onclick='increaseFood(" + index + ")'>+</button>";
        html += "<strong> ₹" + itemTotal + "</strong>";
        html += "</div>";
        html += "</div>";
    });

    container.innerHTML = html;
}

function updateSummary() {
    var savedBookingType = localStorage.getItem("bookingType") || "";
    var savedTable = localStorage.getItem("tableNumber") || "";
    var savedTableCharge = Number(localStorage.getItem("tableCharge")) || 0;
    var savedDate = localStorage.getItem("bookingDate") || "";
    var savedTime = localStorage.getItem("bookingTime") || "";
    var savedGuests = localStorage.getItem("guests") || "";

    foodItems = JSON.parse(localStorage.getItem("foodItems") || "[]");

    var foodTotal = getFoodTotal();
    var grandTotal = savedTableCharge + foodTotal;

    var bookingTypeElement = document.getElementById("summaryBookingType");
    var tableElement = document.getElementById("summaryTable");
    var tableChargeElement = document.getElementById("summaryTableCharge");
    var dateElement = document.getElementById("summaryDate");
    var timeElement = document.getElementById("summaryTime");
    var guestsElement = document.getElementById("summaryGuests");
    var foodTotalElement = document.getElementById("summaryFoodTotal");
    var grandTotalElement = document.getElementById("summaryGrandTotal");

    if (bookingTypeElement) {
        bookingTypeElement.textContent = savedBookingType || "Not selected";
    }

    if (tableElement) {
        tableElement.textContent = savedTable || "Not selected";
    }

    if (tableChargeElement) {
        tableChargeElement.textContent = "₹" + savedTableCharge;
    }

    if (dateElement) {
        dateElement.textContent = savedDate || "Not selected";
    }

    if (timeElement) {
        timeElement.textContent = savedTime || "Not selected";
    }

    if (guestsElement) {
        guestsElement.textContent = savedGuests ? savedGuests + " Guest(s)" : "Not selected";
    }

    if (foodTotalElement) {
        foodTotalElement.textContent = "₹" + foodTotal;
    }

    if (grandTotalElement) {
        grandTotalElement.textContent = "₹" + grandTotal;
    }

    updateFoodSummary();
}

function searchFood() {
    var input = document.getElementById("foodSearch");

    if (!input) {
        return;
    }

    var search = input.value.toLowerCase().trim();
    var cards = document.querySelectorAll(".food-card");

    cards.forEach(function(card) {
        var text = card.textContent.toLowerCase();

        card.style.display = text.includes(search) ? "" : "none";
    });
}

function filterMenu(category) {
    var cards = document.querySelectorAll(".food-card");

    cards.forEach(function(card) {
        var cardCategory = card.getAttribute("data-category");

        if (category === "all" || cardCategory === category) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

function selectCategory(category) {
    filterMenu(category);
}

function getGrandTotal() {
    var savedTableCharge = Number(localStorage.getItem("tableCharge")) || 0;
    var savedFoodItems = JSON.parse(localStorage.getItem("foodItems") || "[]");

    var foodTotal = 0;

    savedFoodItems.forEach(function(item) {
        foodTotal += Number(item.price) * Number(item.quantity);
    });

    return savedTableCharge + foodTotal;
}

function makePayment() {
    var total = getGrandTotal();

    if (total <= 0) {
        alert("Please select a table or food item before payment.");
        return;
    }

    localStorage.setItem("paymentAmount", total);
    window.location.href = "payment.html";
}
function showLogin() {
    alert("Login feature will be available soon.");
}
function openPayment() {
    var total = getGrandTotal();

    if (total <= 0) {
        alert("Please select a table or food item before payment.");
        return;
    }

    localStorage.setItem("paymentAmount", total);
    window.location.href = "qr.html";
}

function clearBooking() {
    localStorage.removeItem("bookingType");
    localStorage.removeItem("tableNumber");
    localStorage.removeItem("tableCharge");
    localStorage.removeItem("bookingDate");
    localStorage.removeItem("bookingTime");
    localStorage.removeItem("guests");
    localStorage.removeItem("foodItems");

    bookingType = "";
    tableNumber = "";
    tableCharge = 0;
    foodItems = [];

    window.location.href = "reservation.html";
}

function resetReservationFields() {
    var date = document.getElementById("bookingDate");
    var time = document.getElementById("bookingTime");
    var guests = document.getElementById("guests");

    if (date) {
        date.value = "";
    }

    if (time) {
        time.value = "";
    }

    if (guests) {
        guests.selectedIndex = 0;
        guests.value = "";
    }

    localStorage.removeItem("bookingDate");
    localStorage.removeItem("bookingTime");
    localStorage.removeItem("guests");
}

function loadSavedBooking() {
    bookingType = localStorage.getItem("bookingType") || "";
    tableNumber = localStorage.getItem("tableNumber") || "";
    tableCharge = Number(localStorage.getItem("tableCharge")) || 0;
    foodItems = JSON.parse(localStorage.getItem("foodItems") || "[]");

    if (bookingType) {
        showTables(bookingType);

        var normalCard = document.getElementById("normalCard");
        var premiumCard = document.getElementById("premiumCard");

        if (normalCard) {
            normalCard.classList.remove("active");
        }

        if (premiumCard) {
            premiumCard.classList.remove("active");
        }

        if (bookingType === "Normal" && normalCard) {
            normalCard.classList.add("active");
        }

        if (bookingType === "Premium" && premiumCard) {
            premiumCard.classList.add("active");
        }
    } else {
        document.querySelectorAll(".normal-table").forEach(function(table) {
            table.style.display = "none";
        });

        document.querySelectorAll(".premium-table").forEach(function(table) {
            table.style.display = "none";
        });
    }

    document.querySelectorAll(".table-card").forEach(function(card) {
        card.classList.remove("selected");
    });

    if (tableNumber) {
        document.querySelectorAll(".table-card").forEach(function(card) {
            var strong = card.querySelector("strong");

            if (strong && strong.textContent.trim() === tableNumber) {
                card.classList.add("selected");
            }
        });
    }

    updateCart();
    updateSummary();
}

document.addEventListener("DOMContentLoaded", function() {

    var isMenuPage = document.getElementById("miniCart") ||
                     document.getElementById("foodSearch");

    if (isMenuPage) {
        foodItems = [];
        localStorage.setItem("foodItems", JSON.stringify([]));
    }

    loadSavedBooking();

    var isReservationPage = document.getElementById("bookingDate") ||
                            document.getElementById("bookingTime") ||
                            document.getElementById("guests");

    if (isReservationPage) {
        resetReservationFields();
    }

    var date = document.getElementById("bookingDate");
    var time = document.getElementById("bookingTime");
    var guests = document.getElementById("guests");

    if (date) {
        date.addEventListener("change", saveDate);
    }

    if (time) {
        time.addEventListener("change", saveTime);
    }

    if (guests) {
        guests.addEventListener("change", saveGuests);
    }

    updateCart();
});
