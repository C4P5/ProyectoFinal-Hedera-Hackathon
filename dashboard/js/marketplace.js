// Eggologic Dashboard — Screen 1 (marketplace.html) Data Binding
// Mostly static — only the bottom stats are dynamic

async function loadMarketplace() {
  // These stats are derived from waste processing data
  // H2O saved ≈ waste_kg × 8.9 liters (composting water savings factor)
  // m² reforested is a placeholder / future metric

  // Static stats for hackathon
  UI.setText('stat-h2o', '3');
  UI.setText('stat-reforested', '724');
}

function onLogin() {
  loadMarketplace();
}

// Load stats on page load (uses public Hedera API, no auth needed)
document.addEventListener('DOMContentLoaded', () => {
  loadMarketplace();
});
