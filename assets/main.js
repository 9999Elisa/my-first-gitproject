/*
 * Student Name:  
 * Student ID:  
 * Course: CST8117 - Cross-Platform Web Design
 * Semester: Winter 2026
 * Assignment: 4
 * Date Submitted:  April 13, 2026
 * main.js
 */
/**============================================================
 * EMAIL VALIDATION - Assignment 3 Function
 * Validates an email address using regular expression.
 * Sources:  Tiwari (2026c), MDN RegExp, W3Schools IndexOf() 
 **============================================================*/
function isValidEmail(email) {

    // Must be a string
    if (typeof email !== "string") {
        return false;
    }

    // REQUIREMENT:  Check the length of the email before the @ symbol 
    // '@' must be at least the 3rd character (at index position >= 2)
    // AND must be followed by at least 5 characters. (Cite W3Schools, IndexOf)

    const atIndex = email.indexOf("@");
    if (atIndex < 2 || email.length - atIndex - 1 < 5) {
        return false;
    }

    // Regex checks:
    // - starts with a letter
    // - allows letters, numbers, dots, underscores, hyphens
    // - contains @
    // - domain contains at least one dot
    // - top-level domain is at least 2 characters

    const emailPattern = /^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailPattern.test(email);
}

console.log(isValidEmail("myEmail1@email.com")); // true
console.log(isValidEmail("my.Email1@e-mail.com")); // true
console.log(isValidEmail("myEmail1@email.c")); // false
console.log(isValidEmail("m@email1.com")); // false
console.log(isValidEmail(1)); // false
console.log(isValidEmail(true)); // false
console.log(isValidEmail("myEmail1@com")); // false
console.log(isValidEmail("my_Email1@e.com")); // true
console.log(isValidEmail("1m@email.com")); // false
console.log(isValidEmail("my!Email@email.com")); // false

/**============================================================
 * VALIDATION AGE OF MAJORITY - Assignment 3 Function
 * Determines if a person is 18 years of age or older.
 * Logic adapted from Tiwari, A. (2026b and 2026c).
 **============================================================*/
function isAgeOfMajority(birthYear, birthMonth, birthDay) {

    // Validate parameters (IF: Birth year is not equal to number, or birth year is less than 1920, or birth year is greater than 2010 - RETURN False)
    if (typeof birthYear !== "number" || birthYear < 1920 || birthYear > 2010) {
        return false;
    }
    // Validate parameters (IF: Birth month is not equal to number, or birth month is less than 1, or birth month is greater than 12 - RETURN False)
    if (typeof birthMonth !== "number" || birthMonth < 1 || birthMonth > 12) {
        return false;
    }
    // Validate parameters (IF: Birth day is not equal to number, or birth day is less than 1, or birth day is greater than 31 - RETURN False)
    if (typeof birthDay !== "number" || birthDay < 1 || birthDay > 31) {
        return false;
    }

    /**
     * REQUIRED ASSIGNMENT EXPLANATION:
     *
     * Q1: What are the possible return values from the Date constructor?
     * A1: It returns a Date object representing the specific date and time, 
     *     OR it returns "Invalid Date" if the provided stringor numbers cannot be parsed.
     *
     * Q2: Why concatenate into a string instead of passing numbers?
     * A2: Passing numbers uses zero‑based months (Starts at 0 for January), which is confusing.
     *     Concatenating "M/D/YYYY" avoids zero‑based month errors and allows the use of 1-based 
     *     the month number, which is easier to understand and avoids indexing errors.
     */

    // Create TODAY date at processing
    const TODAY = new Date();

    // Requirement: Use 'var' for birthdate and concatenate as "M/D/YYYY" 
    var birthdate = new Date(birthMonth + "/" + birthDay + "/" + birthYear);

    // Reject invalid leap year type input dates (e.g., 1997-02-29 → 1997-03-01)
    if (
        birthdate.getFullYear() !== birthYear ||
        birthdate.getMonth() + 1 !== birthMonth ||
        birthdate.getDate() !== birthDay
    ) {
        return false;
    }

    // If birthdate is invalid, return false
    if (isNaN(birthdate.getTime())) {
        return false;
    }

    // Calculate age difference in milliseconds
    const diffMs = TODAY - birthdate;

    // Convert ms → days
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    // 18 years ≈ 6570 days
    return diffDays >= 6570;
}

console.log(isAgeOfMajority(2005, 2, 25)); // true – just old enough
console.log(isAgeOfMajority(1997, 2, 29)); // false – not a leap year
console.log(isAgeOfMajority(2008, 5, 1)); // false
console.log(isAgeOfMajority(2000, 1, 1)); // true
console.log(isAgeOfMajority(1980, 12, 31)); // true
console.log(isAgeOfMajority("1980", "12", 31)); // false – wrong data type


/**============================================================
 * 
 * MOBILE NAVIGATION — SLIDE-IN MENU + SUBMENU TOGGLE
 * Inspired by Minto Design, MDN Selector, Event, W3Schools - How to Slide Navigation
 * 
 * ============================================================*/

// Select hambruger and nav
const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".main-nav");

// Toggle slide‑in menu
hamburger.addEventListener("click", function () {
    mobileNav.classList.toggle("active");
});

// Handle submenu toggle (Our Company)
const submenuParent = document.querySelector(".has-submenu");

// Only toggle submenu when clicking the parent <a>, not the submenu links
submenuParent.querySelector("a").addEventListener("click", function (event) {

    // MOBILE ONLY — prevent navigation + toggle submenu
    if (window.innerWidth <= 768) {
        event.preventDefault();
        submenuParent.classList.toggle("open");
    }

    // DESKTOP — submenu should open on hover, not on click
});

/* ============================================================
   CONTACT FORM VALIDATION — ASSIGNMENT 4
   jQuery Validation + custom rules + AS3 functions
   ============================================================ */

$(document).ready(function () {

    /* -------------------------
       Custom Validation Methods
       ------------------------- */

    // Email must pass AS3 function
    $.validator.addMethod("customEmail", function (value) {
        return isValidEmail(value);
    }, "Please enter a valid email address.");

    // Confirm email must match
    $.validator.addMethod("matchEmail", function (value) {
        return value === $("#email").val();
    }, "Email addresses must match.");

    // Age of majority (18+)
    $.validator.addMethod("adultCheck", function (value) {
        if (!value) return false;

        const parts = value.split("-");
        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        return isAgeOfMajority(year, month, day);
    }, "You must be at least 18 years old.");

    // Phone number must be 10 digits
    $.validator.addMethod("tenDigits", function (value) {
        return /^\d{10}$/.test(value);
    }, "Phone number must be 10 digits (e.g., 6131231234).");


    /* ============================================================
       Initialize Form Validation
       ============================================================ */

    $("#contactForm").validate({
        rules: {
            name: { required: true },
            phone: { required: true, tenDigits: true },
            email: { required: true, customEmail: true },
            confirmEmail: { required: true, matchEmail: true },
            dob: { required: true, adultCheck: true },
            comments: { required: true, minlength: 3 },
            consent: { required: true }
        },

        messages: {
            name: "Name is required.",
            comments: {
                required: "Comments are required.",
                minlength: "Comments must be at least 3 characters."
            },
            consent: "You must agree before submitting."
        },

        errorClass: "form-error",
        validClass: "form-valid",


        /* ============================================================
           SUBMIT HANDLER — includes Confirmation Dialogue Message for testing
           ============================================================ */
        submitHandler: function (form) {

            // Gather FORM data
            const formData = {
                name: $("#name").val(),
                phone: $("#phone").val(),
                email: $("#email").val(),
                confirmEmail: $("#confirmEmail").val(),
                dob: $("#dob").val(),
                comments: $("#comments").val(),
                consent: $("#consent").is(":checked")
            };

            // Gather validation results
            const validationResults = {
                name: $("#name").valid(),
                phone: $("#phone").valid(),
                email: $("#email").valid(),
                confirmEmail: $("#confirmEmail").valid(),
                dob: $("#dob").valid(),
                comments: $("#comments").valid(),
                consent: $("#consent").valid()
            };

            // Show confirmation dialogue
            showConfirmationDialog(formData, validationResults);

            // Show success message + reset form
            $("#formSuccess").fadeIn();
            form.reset();

            return false;
        }
    });
});


/* ============================================================
   DIALOGUE CONFIRMATIONS SCREEN
   Displays a summary of user inputs + pass/fail status
   ============================================================ */

function showConfirmationDialog(formData, validationResults) {

    let message = "Form Validation Summary:\n\n";

    message += `Name: ${formData.name} — ${validationResults.name ? "PASS" : "FAIL"}\n`;
    message += `Phone: ${formData.phone} — ${validationResults.phone ? "PASS" : "FAIL"}\n`;
    message += `Email: ${formData.email} — ${validationResults.email ? "PASS" : "FAIL"}\n`;
    message += `Confirm Email: ${formData.confirmEmail} — ${validationResults.confirmEmail ? "PASS" : "FAIL"}\n`;
    message += `Date of Birth: ${formData.dob} — ${validationResults.dob ? "PASS" : "FAIL"}\n`;
    message += `Comments: ${formData.comments} — ${validationResults.comments ? "PASS" : "FAIL"}\n`;
    message += `Consent Checkbox: ${formData.consent ? "Checked" : "Not Checked"} — ${validationResults.consent ? "PASS" : "FAIL"}\n`;

    alert(message);
}
