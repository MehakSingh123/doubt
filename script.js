document.addEventListener("DOMContentLoaded", () => {
  // Form validation setup
  const forms = document.querySelectorAll('.needs-validation');

  forms.forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');
    });
  });

  // Toggle tax info visibility
  let taxSwitch = document.getElementById("flexSwitchCheckDefault");
  if (taxSwitch) {
    taxSwitch.addEventListener("click", () => {
      let taxInfoElements = document.getElementsByClassName("tax-info");
      Array.from(taxInfoElements).forEach(info => {
        if (info.style.display !== "inline") {
          info.style.display = "inline";
        } else {
          info.style.display = "none";
        }
      });
    });
  }

  // Filter listings based on selected filter
  const filterElements = document.querySelectorAll(".filter");
  const listingCards = document.querySelectorAll(".listing-card");

  filterElements.forEach(filter => {
    filter.addEventListener("click", () => {
      // Get the property to filter by from the data-filter attribute
      const filterProperty = filter.getAttribute("data-filter");

      // Hide all listing cards
      listingCards.forEach(card => {
        card.style.display = "none";
      });

      if (filterProperty === "all") {
        // Show all listing cards
        listingCards.forEach(card => {
          card.style.display = "block";
        });
      } else {
        // Show only the listing cards that match the selected property
        const matchingCards = document.querySelectorAll(`[data-category="${filterProperty}"]`);
        matchingCards.forEach(card => {
          card.style.display = "block";
        });
      }
    });
  });
});
