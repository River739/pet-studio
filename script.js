// Run after page loads
window.onload = function () {

    /* =========================
       1. CANVAS TIMER BANNER
    ========================= */

    const canvas = document.getElementById("offerCanvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");

        let endTime = new Date().getTime() + (1 * 60 * 1000);

        function drawBanner() {

            let now = new Date().getTime();
            let timeLeft = endTime - now;

            let minutes = Math.floor(timeLeft / (1000 * 60));
            let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#ffcccb";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#000";
            ctx.font = "20px Arial";

            let text = "Limited Offer! Price reduced by 10% | Ends in: "
                        + minutes + "m " + seconds + "s";

            ctx.fillText(text, 50, 40);

            if (timeLeft <= 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillText("Offer Expired!", 50, 40);
                return;
            }

            setTimeout(drawBanner, 1000);
        }

        drawBanner();
    }


    /* =========================
       2. REVIEW SYSTEM (LOCAL STORAGE)
    ========================= */

    const reviewForm = document.querySelector("#review_wnd form");

    // Function to add review to page
    function addReviewToPage(value) {
        let newDiv = document.createElement("div");
        newDiv.className = "step";

        newDiv.innerHTML = `
            <img src="images/pic1.png">
            <h3>YOU</h3>
            <p>"${value}"</p>
            <button class="delete-btn">Delete</button>
        `;

        document.querySelector(".reviews .steps").appendChild(newDiv);

        // Delete button
        newDiv.querySelector(".delete-btn").addEventListener("click", function () {
            newDiv.remove();
            deleteFromStorage(value);
        });
    }

    // Delete from localStorage
    function deleteFromStorage(value) {
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

        reviews = reviews.filter(function (item) {
            return item !== value;
        });

        localStorage.setItem("reviews", JSON.stringify(reviews));
    }

    // Load saved reviews
    let savedReviews = localStorage.getItem("reviews");

    if (savedReviews) {
        let reviewsArray = JSON.parse(savedReviews);

        reviewsArray.forEach(function (text) {
            addReviewToPage(text);
        });
    }

    // Submit review
    if (reviewForm) {
        reviewForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let input = reviewForm.querySelector("input[name='review']");
            let value = input.value;

            if (value === "") return;

            addReviewToPage(value);

            // Save to storage
            let reviews = localStorage.getItem("reviews");
            let reviewsArray = reviews ? JSON.parse(reviews) : [];

            reviewsArray.push(value);
            localStorage.setItem("reviews", JSON.stringify(reviewsArray));

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
            box.style.backgroundColor = "#f0f0f0";
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
                field.style.border = "2px solid green";
            });

            field.addEventListener("focus", function () {
                field.style.backgroundColor = "#e6f7ff";
            });

        });

        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();

            alert("Booking Submitted Successfully!");

            bookingForm.reset();
        });
    }

};


/* =========================
   5. SHOP FUNCTION
========================= */

function addToCart(item) {
    alert(item + " added to cart!");
}