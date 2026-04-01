// Run after page loads
window.onload = function () {

    /* =========================
       1. CANVAS TIMER BANNER
    ========================= */

    const canvas = document.getElementById("offerCanvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth || 1000;

        const savedEnd = parseInt(localStorage.getItem("offerEndTime") || "0");
        window.offerEndTime = savedEnd > new Date().getTime() ? savedEnd : new Date().getTime() + (5 * 60 * 1000);
        if (!savedEnd || savedEnd <= new Date().getTime()) localStorage.setItem("offerEndTime", window.offerEndTime);
        let endTime = window.offerEndTime;

        function drawBanner() {
            let now = new Date().getTime();
            let timeLeft = endTime - now;

            let minutes = Math.floor(timeLeft / (1000 * 60));
            let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Warm amber gradient background
            let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, "#c67c3a");
            gradient.addColorStop(1, "#e8a96a");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#ffffff";
            ctx.font = "500 14px 'DM Sans', Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let text = timeLeft > 0
                ? " Limited Offer! Prices reduced by 10%  —  Ends in: " + minutes + "m " + seconds + "s"
                : "Offer Expired!";

            ctx.fillText(text, canvas.width / 2, canvas.height / 2);

            if (timeLeft <= 0) return;

            setTimeout(drawBanner, 1000);
        }

        drawBanner();
    }


    /* =========================
       2. REVIEW SYSTEM (LOCAL STORAGE)
    ========================= */

    const reviewForm = document.querySelector("#review_wnd form");

    function addReviewToPage(value) {
        let newDiv = document.createElement("div");
        newDiv.className = "step";

        newDiv.innerHTML = `
            <img src="images/pic1.png" alt="reviewer">
            <h3>You</h3>
            <p>"${value}"</p>
            <button class="delete-btn">Delete</button>
        `;

        document.querySelector(".reviews .steps").appendChild(newDiv);

        newDiv.querySelector(".delete-btn").addEventListener("click", function () {
            newDiv.remove();
            deleteFromStorage(value);
        });
    }

    function deleteFromStorage(value) {
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews = reviews.filter(function (item) { return item !== value; });
        localStorage.setItem("reviews", JSON.stringify(reviews));
    }

    let savedReviews = localStorage.getItem("reviews");
    if (savedReviews) {
        JSON.parse(savedReviews).forEach(function (text) { addReviewToPage(text); });
    }

    if (reviewForm) {
        reviewForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let input = reviewForm.querySelector("input[name='review']");
            let value = input.value.trim();
            if (value === "") return;

            addReviewToPage(value);

            let reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
            reviews.push(value);
            localStorage.setItem("reviews", JSON.stringify(reviews));

            reviewForm.reset();
            input.focus();
        });
    }


    /* =========================
       3. MOUSE EVENTS
    ========================= */

    const steps = document.querySelectorAll(".step");

    steps.forEach(function (box) {
        box.addEventListener("mouseover", function () {
            box.style.backgroundColor = "#fff8f3";
        });
        box.addEventListener("mouseout", function () {
            box.style.backgroundColor = "white";
        });
    });


    /* =========================
       4. BOOKING FORM EVENTS
    ========================= */

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {
        let inputs = bookingForm.querySelectorAll("input, select, textarea");

        inputs.forEach(function (field) {
            field.addEventListener("change", function () {
                if (field.type !== "radio" && field.type !== "checkbox") {
                    field.style.border = "2px solid #c67c3a";
                }
            });

            field.addEventListener("focus", function () {
                if (field.type !== "radio" && field.type !== "checkbox") {
                    field.style.backgroundColor = "#fff8f3";
                }
            });
        });

        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Collect form data
            const data = new FormData(bookingForm);
            const name     = data.get("name") || "—";
            const email    = data.get("email") || "—";
            const phone    = data.get("phone") || "—";
            const petName  = data.get("petName") || "—";
            const petType  = data.get("petType") || "—";
            const pkg      = data.get("package") || "—";
            const date     = data.get("date") || "—";
            const notes    = data.get("notes") || "None";
            const addons   = data.getAll("addons");

            const packagePrices = { Mini: 5500, Full: 8000, Premium: 14000 };
            const addonLabels   = { photos: "Extra Edited Photos", album: "Printed Album", outdoor: "Outdoor Shoot" };
            const addonPrices   = { photos: 500, album: 800, outdoor: 1000 };

            const basePrice   = packagePrices[pkg] || 0;
            const addonTotal  = addons.reduce((sum, a) => sum + (addonPrices[a] || 0), 0);
            const subtotal    = basePrice + addonTotal;
            const offerEndTime = window.offerEndTime || parseInt(localStorage.getItem("offerEndTime") || "0");
            const offerActive = window.offerEndTime && new Date().getTime() < offerEndTime;
            const discount    = offerActive ? Math.round(subtotal * 0.10) : 0;
            const totalPrice  = subtotal - discount;

            const bookingRef  = "PS-" + Date.now().toString().slice(-6);
            const formattedDate = date ? new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

            alert("Booking Submitted Successfully! We'll be in touch soon. 🐾");

            // Build receipt HTML
            const addonRows = addons.length > 0
                ? addons.map(a => `
                    <div class="receipt-row">
                        <span>${addonLabels[a] || a}</span>
                        <span>+ &#8377;${(addonPrices[a] || 0).toLocaleString("en-IN")}</span>
                    </div>`).join("")
                : `<div class="receipt-row muted"><span>No add-ons selected</span><span></span></div>`;

            const receiptHTML = `
            <div class="receipt-overlay" id="receiptOverlay">
                <div class="receipt-modal">
                    <div class="receipt-header">
                        <div class="receipt-paw">🐾</div>
                        <h2>Booking Confirmed</h2>
                        <p class="receipt-sub">Thank you, ${name.split(" ")[0]}! We'll be in touch soon.</p>
                        <div class="receipt-ref">Ref # ${bookingRef}</div>
                    </div>

                    <div class="receipt-section-label">Session Details</div>
                    <div class="receipt-grid">
                        <div class="receipt-row"><span>Date</span><span>${formattedDate}</span></div>
                        <div class="receipt-row"><span>Package</span><span>${pkg} Shoot</span></div>
                        <div class="receipt-row"><span>Pet</span><span>${petName} (${petType})</span></div>
                    </div>

                    <div class="receipt-section-label">Owner Details</div>
                    <div class="receipt-grid">
                        <div class="receipt-row"><span>Name</span><span>${name}</span></div>
                        <div class="receipt-row"><span>Email</span><span>${email}</span></div>
                        <div class="receipt-row"><span>Phone</span><span>${phone}</span></div>
                    </div>

                    ${notes !== "None" ? `<div class="receipt-section-label">Notes</div><div class="receipt-notes">${notes}</div>` : ""}

                    <div class="receipt-section-label">Pricing</div>
                    <div class="receipt-grid">
                        <div class="receipt-row"><span>${pkg} Shoot</span><span>&#8377;${basePrice.toLocaleString("en-IN")}</span></div>
                        ${addonRows}
                        ${offerActive ? `<div class="receipt-row receipt-discount"><span>10% Offer Discount</span><span>- &#8377;${discount.toLocaleString("en-IN")}</span></div>` : ""}
                        <div class="receipt-row receipt-total"><span>Total</span><span>&#8377;${totalPrice.toLocaleString("en-IN")}</span></div>
                    </div>

                    <p class="receipt-note">A confirmation will be sent to <strong>${email}</strong>. Payment is due on session day.</p>

                    <div class="receipt-actions">
                        <button class="receipt-print-btn" onclick="window.print()">Print Receipt</button>
                        <button class="receipt-close-btn" id="receiptCloseBtn">Done</button>
                    </div>
                </div>
            </div>`;

            document.body.insertAdjacentHTML("beforeend", receiptHTML);

            document.getElementById("receiptCloseBtn").addEventListener("click", function () {
                document.getElementById("receiptOverlay").remove();
            });
            document.getElementById("receiptOverlay").addEventListener("click", function (e) {
                if (e.target === this) this.remove();
            });

            bookingForm.reset();

            // Reset field styles
            bookingForm.querySelectorAll("input, select, textarea").forEach(function (f) {
                f.style.border = "";
                f.style.backgroundColor = "";
            });
        });
    }

};


/* =========================
   5. SHOP FUNCTION
========================= */

function addToCart(item) {
    alert(item + " added to cart! 🛒");
}
