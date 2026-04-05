/*
 * Student Name:  
 * Student ID:  
 * Course: CST8117 - Cross-Platform Web Design
 * Semester: Winter 2026
 * Assignment: 3
 * Date Submitted:  March 23, 2026
 * • products.js
 */

document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------------------------------------
    // PRODUCT CARDS + GRID
    // ------------------------------------------------------------
    const cards = Array.from(document.querySelectorAll(".product-card"));
    const grid = document.querySelector(".products-grid");

    // ------------------------------------------------------------
    // FILTER INPUTS
    // ------------------------------------------------------------
    const categoryChecks = document.querySelectorAll(".categoryCheck");
    const clientChecks = document.querySelectorAll(".clientCheck");
    const priceSelect = document.getElementById("priceSelect");

    const sortAsc = document.getElementById("sortAsc");
    const sortDesc = document.getElementById("sortDesc");
    const sortChecks = document.querySelectorAll(".sortCheck");

    const applyBtn = document.getElementById("applyFilters");
    const clearBtn = document.getElementById("clearFilters");

    const filterSummary = document.getElementById("filterSummary");
    const itemCount = document.getElementById("itemCount");

    // ------------------------------------------------------------
    // LONG-HAND PRICE RANGES
    // ------------------------------------------------------------
    const PRICE_RANGES = [
        { label: "$0.00 to $4.99",     min: 0.00,   max: 4.99 },
        { label: "$5.00 to $9.99",     min: 5.00,   max: 9.99 },
        { label: "$10.00 to $19.99",   min: 10.00,  max: 19.99 },
        { label: "$20.00 to $50.00",   min: 20.00,  max: 50.00 },
        { label: "$50.00 to $750.00",  min: 50.00,  max: 750.00 }
    ];

    // ------------------------------------------------------------
    // SORT CHECKBOX BEHAVIOR (ONLY ONE CAN BE SELECTED)
    // ------------------------------------------------------------
    sortChecks.forEach(chk => {
        chk.addEventListener("change", () => {
            if (chk.checked) {
                sortChecks.forEach(other => {
                    if (other !== chk) other.checked = false;
                });
            }
        });
    });

    // ------------------------------------------------------------
    // APPLY FILTERS
    // ------------------------------------------------------------
    function applyFiltersNow() {

        let filtered = cards;

        // CATEGORY FILTER
        const selectedCategories = [...categoryChecks]
            .filter(chk => chk.checked)
            .map(chk => chk.value);

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(card =>
                selectedCategories.includes(card.dataset.category)
            );
        }

        // CLIENT FILTER
        const selectedClients = [...clientChecks]
            .filter(chk => chk.checked)
            .map(chk => chk.value);

        if (selectedClients.length > 0) {
            filtered = filtered.filter(card =>
                selectedClients.includes(card.dataset.client)
            );
        }

        // PRICE FILTER
        const selectedRangeIndex = priceSelect.value;

        if (selectedRangeIndex !== "") {
            const range = PRICE_RANGES[selectedRangeIndex];
            filtered = filtered.filter(card => {
                const price = parseFloat(card.dataset.price);
                return price >= range.min && price <= range.max;
            });
        }

        // SORTING
        let sortDirection = "";
        if (sortAsc.checked) sortDirection = "asc";
        if (sortDesc.checked) sortDirection = "desc";

        if (sortDirection === "asc") {
            filtered.sort((a, b) => {
                const nameA = a.querySelector("h3").textContent.toLowerCase();
                const nameB = b.querySelector("h3").textContent.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        }

        if (sortDirection === "desc") {
            filtered.sort((a, b) => {
                const nameA = a.querySelector("h3").textContent.toLowerCase();
                const nameB = b.querySelector("h3").textContent.toLowerCase();
                return nameB.localeCompare(nameA);
            });
        }

        // REBUILD GRID
        grid.innerHTML = "";
        filtered.forEach(card => grid.appendChild(card));

        // ITEM COUNT
        itemCount.textContent = `${filtered.length} items available`;

        // SUMMARY TEXT
        const summaryParts = [];

        summaryParts.push(...selectedCategories);
        summaryParts.push(...selectedClients);

        if (selectedRangeIndex !== "") {
            summaryParts.push(PRICE_RANGES[selectedRangeIndex].label);
        }

        if (sortDirection === "asc") summaryParts.push("Name A → Z");
        if (sortDirection === "desc") summaryParts.push("Name Z → A");

        filterSummary.textContent =
            summaryParts.length > 0
                ? `Filter Results for: ${summaryParts.join(", ")}`
                : "";

        // SHOW CLEAR BUTTON WHEN ANY FILTER IS ACTIVE
        const hasFilters =
            selectedCategories.length > 0 ||
            selectedClients.length > 0 ||
            selectedRangeIndex !== "" ||
            sortDirection !== "";

        clearBtn.style.display = hasFilters ? "inline-block" : "none";
    }
// READ CATEGORY FROM URL
const params = new URLSearchParams(window.location.search);
const preselectCategory = params.get("category");

if (preselectCategory) {
    categoryChecks.forEach(chk => {
        if (chk.value === preselectCategory) {
            chk.checked = true;
        }
    });

    applyFiltersNow();
}
    // ------------------------------------------------------------
    // CLEAR ALL FILTERS
    // ------------------------------------------------------------
    clearBtn.addEventListener("click", () => {

        // Uncheck all checkboxes
        [...categoryChecks, ...clientChecks, ...sortChecks].forEach(chk => chk.checked = false);

        // Reset dropdown
        priceSelect.value = "";

        // Clear summary
        filterSummary.textContent = "";
        clearBtn.style.display = "none";

        // Reset grid
        grid.innerHTML = "";
        cards.forEach(card => grid.appendChild(card));

        // Reset count
        itemCount.textContent = `${cards.length} items available`;
    });

    // ------------------------------------------------------------
    // APPLY BUTTON
    // ------------------------------------------------------------
    applyBtn.addEventListener("click", applyFiltersNow);

    // INITIAL LOAD
    itemCount.textContent = `${cards.length} items available`;
});
