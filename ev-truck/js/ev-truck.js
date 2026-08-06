/* ==========================================================================
   EIM EV Truck Landing Page Script
   Interactive TCO Calculator & Form Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize TCO Savings Calculator
  initTcoCalculator();

  // Initialize Smooth Scrolling for local anchor links
  initSmoothScroll();

  // Initialize Hero Form Handler
  initHeroForm();
});

/**
 * Real-time Fleet TCO & Savings Calculator
 */
function initTcoCalculator() {
  const kmSlider = document.getElementById('calc-daily-km');
  const kmDisplay = document.getElementById('calc-km-val');
  const fleetSlider = document.getElementById('calc-fleet-size');
  const fleetDisplay = document.getElementById('calc-fleet-val');
  const dieselSlider = document.getElementById('calc-diesel-price');
  const dieselDisplay = document.getElementById('calc-diesel-val');

  const resultAmount = document.getElementById('calc-total-savings');
  const resultPerTruck = document.getElementById('calc-per-truck');
  const resultCo2 = document.getElementById('calc-co2-saved');

  if (!kmSlider || !fleetSlider || !dieselSlider) return;

  function calculateSavings() {
    const dailyKm = parseFloat(kmSlider.value) || 200;
    const fleetSize = parseInt(fleetSlider.value) || 5;
    const dieselPrice = parseFloat(dieselSlider.value) || 92;

    // Update UI displays
    if (kmDisplay) kmDisplay.textContent = dailyKm + ' km';
    if (fleetDisplay) fleetDisplay.textContent = fleetSize + (fleetSize > 1 ? ' Trucks' : ' Truck');
    if (dieselDisplay) dieselDisplay.textContent = '₹' + dieselPrice;

    // Heavy Diesel Truck Parameters
    const dieselMileage = 2.4; // km per Litre
    const dieselCostPerKm = dieselPrice / dieselMileage; // ~38.33 ₹/km

    // EIM Heavy EV Truck Parameters (Vehicle + Swapping Energy Fee)
    const evCostPerKm = 14.5; // ~14.5 ₹/km inclusive of energy & battery swap

    // Net Savings per km
    const savingsPerKm = Math.max(0, dieselCostPerKm - evCostPerKm);

    // Operating Days per year (Standard logistics benchmark: 310 days)
    const operatingDays = 310;
    const annualKmPerTruck = dailyKm * operatingDays;

    // Annual Savings Calculation
    const annualSavingsPerTruck = annualKmPerTruck * savingsPerKm;
    const totalAnnualSavings = annualSavingsPerTruck * fleetSize;

    // CO2 Reduction (in Tons per Year): ~0.98 kg CO2 saved per km over diesel heavy truck
    const co2SavedTons = Math.round((annualKmPerTruck * 0.98 * fleetSize) / 1000);

    // Format display outputs
    if (resultAmount) {
      const lakhs = (totalAnnualSavings / 100000).toFixed(2);
      resultAmount.textContent = '₹' + lakhs + ' Lakhs';
    }

    if (resultPerTruck) {
      const perTruckLakhs = (annualSavingsPerTruck / 100000).toFixed(2);
      resultPerTruck.textContent = '₹' + perTruckLakhs + ' L / Truck';
    }

    if (resultCo2) {
      resultCo2.textContent = co2SavedTons + ' Tons CO₂';
    }
  }

  // Add Event Listeners
  kmSlider.addEventListener('input', calculateSavings);
  fleetSlider.addEventListener('input', calculateSavings);
  dieselSlider.addEventListener('input', calculateSavings);

  // Initial Calculation
  calculateSavings();
}

/**
 * Smooth Scroll handling for navigation anchors
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Form Submit Interactive Alert & Validation
 */
function initHeroForm() {
  const evForm = document.getElementById('ev-truck-inquiry-form');
  if (!evForm) return;

  evForm.addEventListener('submit', function (e) {
    const btn = evForm.querySelector('.ev-btn-primary');
    if (btn) {
      btn.innerHTML = '<span>Submitting Inquiry...</span>';
      btn.style.opacity = '0.8';
    }
  });
}
