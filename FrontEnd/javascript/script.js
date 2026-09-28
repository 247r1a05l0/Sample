const API_URL = "http://localhost:8080/api/registrations";


// ======================================================
// REGISTRATION FORM
// ======================================================

const form = document.getElementById("registrationForm");

if (form) {

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        // Get values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const college = document.getElementById("college").value.trim();
        const selectedEvent = document.getElementById("event").value;

        // Error elements
        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const phoneError = document.getElementById("phoneError");
        const collegeError = document.getElementById("collegeError");
        const eventError = document.getElementById("eventError");

        // Clear previous errors
        nameError.textContent = "";
        emailError.textContent = "";
        phoneError.textContent = "";
        collegeError.textContent = "";
        eventError.textContent = "";

        let valid = true;


        // Name validation
        if (name === "") {
            nameError.textContent = "Name is required.";
            valid = false;
        }


        // Email validation
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {
            emailError.textContent = "Email is required.";
            valid = false;
        }
        else if (!emailPattern.test(email)) {
            emailError.textContent = "Enter a valid email.";
            valid = false;
        }


        // Phone validation
        const phonePattern = /^[0-9]{10}$/;

        if (phone === "") {
            phoneError.textContent = "Phone number is required.";
            valid = false;
        }
        else if (!phonePattern.test(phone)) {
            phoneError.textContent =
                "Phone number must contain 10 digits.";
            valid = false;
        }


        // College validation
        if (college === "") {
            collegeError.textContent =
                "College name is required.";
            valid = false;
        }


        // Event validation
        if (selectedEvent === "") {
            eventError.textContent =
                "Please select an event.";
            valid = false;
        }


        // Stop if validation fails
        if (!valid) {
            return;
        }


        // ==================================================
        // SEND DATA TO SPRING BOOT
        // ==================================================

        const registrationData = {
            name: name,
            email: email,
            phone: phone,
            college: college,
            eventName: selectedEvent
        };


        const successMessage =
            document.getElementById("successMessage");


        try {

            successMessage.innerHTML =
                "Registering... Please wait.";


            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(registrationData)

            });


            // Check server response
            if (!response.ok) {
                throw new Error("Registration failed");
            }


            // Get saved registration from backend
            const savedRegistration =
                await response.json();


            // ==================================================
            // CREATE DISPLAY DATA
            // ==================================================

            const registrationId =
                "SE-" +
                new Date().getFullYear() +
                "-" +
                String(savedRegistration.id).padStart(4, "0");


            const registration = {

                registrationId: registrationId,

                id: savedRegistration.id,

                name: savedRegistration.name,

                email: savedRegistration.email,

                phone: savedRegistration.phone,

                college: savedRegistration.college,

                event: savedRegistration.eventName,

                status: "CONFIRMED"

            };


            // Save only the latest registration
            // temporarily for My Registration page
            localStorage.setItem(
                "safeEventRegistration",
                JSON.stringify(registration)
            );


            // ==================================================
            // SUCCESS MESSAGE
            // ==================================================

            successMessage.innerHTML =

                "🎉 Registration Successful!<br><br>" +

                "Registration ID: " +
                registrationId +

                "<br>" +

                "Event: " +
                selectedEvent +

                "<br>" +

                "Status: CONFIRMED";


            // Clear form
            form.reset();


        }
        catch (error) {

            console.error(error);

            successMessage.innerHTML =

                "❌ Registration failed.<br>" +

                "Please make sure the SafeEvent backend is running.";

        }

    });

}



// ======================================================
// CHECK REGISTRATION
// ======================================================

async function checkRegistration() {

    const enteredId =
        document
            .getElementById("registrationId")
            .value
            .trim();

    const result =
        document.getElementById("registrationResult");


    // Check whether ID was entered
    if (enteredId === "") {

        result.innerHTML =
            `<div class="not-found">
                Please enter a Registration ID.
             </div>`;

        return;
    }


    // Extract database ID
    // Example: SE-2026-0003 → 3
    const parts = enteredId.split("-");

    const databaseId =
        parseInt(parts[parts.length - 1], 10);


    if (isNaN(databaseId)) {

        result.innerHTML =
            `<div class="not-found">
                ❌ Invalid Registration ID.
             </div>`;

        return;
    }


    try {

        // Get registration directly from MySQL
        const response =
            await fetch(
                `${API_URL}/${databaseId}`
            );


        // Registration not found
        if (response.status === 404) {

            result.innerHTML =
                `<div class="not-found">
                    ❌ Registration ID not found.
                 </div>`;

            return;
        }


        if (!response.ok) {
            throw new Error("Failed to fetch registration");
        }


        // Get registration from backend
        const registration =
            await response.json();


        // Create display ID
        const registrationId =
            "SE-" +
            new Date().getFullYear() +
            "-" +
            String(registration.id).padStart(4, "0");


        result.innerHTML = `

            <div class="registration-result">

                <h2>✅ Registration Found</h2>

                <p>
                    <strong>Registration ID:</strong>
                    ${registrationId}
                </p>

                <p>
                    <strong>Name:</strong>
                    ${registration.name}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${registration.email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${registration.phone}
                </p>

                <p>
                    <strong>College:</strong>
                    ${registration.college || "Not provided"}
                </p>

                <p>
                    <strong>Event:</strong>
                    ${registration.eventName}
                </p>

                <p>
                    <strong>Status:</strong>
                    CONFIRMED
                </p>

            </div>

        `;

    }
    catch (error) {

        console.error(error);

        result.innerHTML =
            `<div class="not-found">
                ❌ Unable to connect to the SafeEvent server.
             </div>`;

    }
}



// ======================================================
// ADMIN DASHBOARD
// ======================================================

async function loadAdminDashboard() {

    const adminContainer =
        document.getElementById("adminRegistrations");

    const totalRegistrations =
        document.getElementById("totalRegistrations");


    if (!adminContainer) {
        return;
    }


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {
            throw new Error("Failed to fetch registrations");
        }


        const registrations =
            await response.json();


        // Total registrations
        if (totalRegistrations) {

            totalRegistrations.textContent =
                registrations.length;

        }


        // No registrations
        if (registrations.length === 0) {

            adminContainer.innerHTML = `

                <p class="no-registration">
                    No registrations yet.
                </p>

            `;

            return;
        }


        // Display all registrations
        adminContainer.innerHTML =
            registrations.map(function(registration) {

                const registrationId =
                    "SE-" +
                    new Date().getFullYear() +
                    "-" +
                    String(registration.id).padStart(4, "0");


                return `

                    <div class="registration-admin-card">

                        <p>
                            <strong>Registration ID:</strong>
                            ${registrationId}
                        </p>

                        <p>
                            <strong>Name:</strong>
                            ${registration.name}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${registration.email}
                        </p>

                        <p>
                            <strong>Phone:</strong>
                            ${registration.phone}
                        </p>

                        <p>
                            <strong>College:</strong>
                            ${registration.college}
                        </p>

                        <p>
                            <strong>Event:</strong>
                            ${registration.eventName}
                        </p>

                        <p>
                            <strong>Status:</strong>

                            <span class="active">
                                CONFIRMED
                            </span>

                        </p>

                    </div>

                `;

            }).join("");


    }
    catch (error) {

        console.error(error);

        adminContainer.innerHTML = `

            <p class="no-registration">

                ❌ Unable to load registrations.

                <br>

                Make sure the SafeEvent backend is running.

            </p>

        `;

    }

}



// ======================================================
// LOAD ADMIN DASHBOARD
// ======================================================

loadAdminDashboard();