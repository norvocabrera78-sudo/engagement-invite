const pricePerGuest = 40;

const guestsInput = document.getElementById("guests");
const totalDisplay = document.getElementById("total");
const tracker = document.getElementById("tracker");
const message = document.getElementById("message");

const paymentSection = document.getElementById("paymentSection");
const paymentTotal = document.getElementById("paymentTotal");
const paypalBtn = document.getElementById("paypalBtn");
const cashappBtn = document.getElementById("cashappBtn");
const zelleBtn = document.getElementById("zelleBtn");

// PAYMENT DETAILS
const PAYPAL_LINK = "https://paypal.me/makaylaandcory";
const CASHAPP_LINK = "https://cash.app/$makaylaandcory";
const ZELLE_INFO = "973-573-9912";

function updateTotal() {
    let guests = parseInt(guestsInput.value) || 1;

    if (guests < 1) {
        guests = 1;
        guestsInput.value = 1;
    }

    totalDisplay.innerText = guests * pricePerGuest;
}

function getReservations() {
    return JSON.parse(localStorage.getItem("reservations")) || [];
}

function saveReservations(reservations) {
    localStorage.setItem("reservations", JSON.stringify(reservations));
}

function renderTracker() {
    const reservations = getReservations();

    if (reservations.length === 0) {
        tracker.innerHTML = "<p>No reservations yet.</p>";
        return;
    }

    let html = "";

    reservations.forEach((res, index) => {
        html += `
            <div class="reservation-card">
                <p><strong>Name:</strong> ${res.name}</p>
                <p><strong>Phone:</strong> ${res.phone}</p>
                <p><strong>Guests:</strong> ${res.guests}</p>
                <p><strong>Total:</strong> $${res.total}</p>
                <p><strong>Status:</strong> ${res.status}</p>
                <button onclick="markPaid(${index})">Mark Paid</button>
                <button onclick="deleteReservation(${index})">Delete</button>
            </div>
        `;
    });

    tracker.innerHTML = html;
}

function showPaymentOptions(name, guests, total) {
    paymentTotal.innerText = total;

    const noteText = encodeURIComponent(`Makayla-Cory / ${name} / ${guests} guests`);

    if (PAYPAL_LINK !== "YOUR_PAYPAL_LINK") {
        paypalBtn.href = `${PAYPAL_LINK}`;
        paypalBtn.style.display = "inline-block";
    } else {
        paypalBtn.href = "#";
        paypalBtn.style.display = "none";
    }

    if (CASHAPP_LINK !== "YOUR_CASHAPP_LINK") {
        cashappBtn.href = `${CASHAPP_LINK}`;
        cashappBtn.style.display = "inline-block";
    } else {
        cashappBtn.href = "#";
        cashappBtn.style.display = "none";
    }

    if (ZELLE_INFO !== "YOUR_ZELLE_INFO") {
        zelleBtn.href = "#";
        zelleBtn.style.display = "inline-block";
        zelleBtn.onclick = function(event) {
            event.preventDefault();
            alert(
                "Send Zelle payment to:\\n" +
                ZELLE_INFO +
                "\\n\\nAmount Due: $" + total +
                "\\n\\nPayment Note:\\nMakayla-Cory / " + name + " / " + guests + " guests"
            );
        };
    } else {
        zelleBtn.href = "#";
        zelleBtn.style.display = "none";
    }

    paymentSection.classList.remove("hidden");
}

function reserve() {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const guests = parseInt(guestsInput.value);

    if (!name) {
        message.innerHTML = "<p class='error'>Please enter your name.</p>";
        paymentSection.classList.add("hidden");
        return;
    }

    if (!phone) {
        message.innerHTML = "<p class='error'>Please enter your phone number.</p>";
        paymentSection.classList.add("hidden");
        return;
    }

    if (!guests || guests < 1) {
        message.innerHTML = "<p class='error'>Please enter at least 1 guest.</p>";
        paymentSection.classList.add("hidden");
        return;
    }

    const total = guests * pricePerGuest;

    const newReservation = {
        name: name,
        phone: phone,
        guests: guests,
        total: total,
        status: "Pending Payment"
    };

    const reservations = getReservations();
    reservations.push(newReservation);
    saveReservations(reservations);

    message.innerHTML = `
        <p class="success">
            Reservation saved for <strong>${name}</strong>.<br>
            Total due: <strong>$${total}</strong><br>
            Status: <strong>Pending Payment</strong>
        </p>
    `;

    showPaymentOptions(name, guests, total);

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    guestsInput.value = 1;

    updateTotal();
    renderTracker();
}

function markPaid(index) {
    const reservations = getReservations();
    reservations[index].status = "Paid";
    saveReservations(reservations);
    renderTracker();
}

function deleteReservation(index) {
    const reservations = getReservations();
    reservations.splice(index, 1);
    saveReservations(reservations);
    renderTracker();
}

guestsInput.addEventListener("input", updateTotal);

updateTotal();
renderTracker();