      const rowsPerPage = 10;
      const table = document.querySelector("#messageTable tbody");
      const rows = table.querySelectorAll("tr");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const pageInfo = document.getElementById("pageInfo");
      let currentPage = 1;

      function showPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        rows.forEach((row, index) => {
          row.style.display = index >= start && index < end ? "" : "none";
        });

        pageInfo.textContent = `Sahifa ${page} / ${Math.ceil(rows.length / rowsPerPage)}`;
        prevBtn.disabled = page === 1;
        nextBtn.disabled = page === Math.ceil(rows.length / rowsPerPage);
      }

      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          showPage(currentPage);
        }
      });

      nextBtn.addEventListener("click", () => {
        if (currentPage < Math.ceil(rows.length / rowsPerPage)) {
          currentPage++;
          showPage(currentPage);
        }
      });

      // Boshlang‘ich sahifa
      showPage(currentPage);