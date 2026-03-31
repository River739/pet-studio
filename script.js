// Run after page loads
window.onload = function () {

    /* =========================
       1. CANVAS TIMER BANNER
    ========================= */

    const canvas = document.getElementById("offerCanvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth || 1000;

        let endTime = new Date().getTime() + (1 * 60 * 1000);

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
            alert("Booking Submitted Successfully! We'll be in touch soon. 🐾");
            bookingForm.reset();
        });
    }

};


/* =========================
   5. SHOP FUNCTION
========================= */

function addToCart(item) {
    alert(item + " added to cart! 🛒");
}
