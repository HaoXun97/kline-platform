document.addEventListener("DOMContentLoaded", async function () {
  const searchInput = document.getElementById("cryptoSearch");
  const searchResults = document.getElementById("searchResults");
  const searchBtn = document.getElementById("searchBtn");
  const loadingSpinner = document.querySelector(".loading-spinner");

  // 載入加密貨幣資料
  let pages = [];
  let categories = {};

  try {
    const response = await fetch("cryptoData.json");
    const data = await response.json();
    pages = data.cryptos;
    categories = data.categories;
  } catch (error) {
    console.error("Error loading cryptocurrency data:", error);
  }

  let searchTimeout;

  searchInput.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm.length >= 1) {
      performSearch(searchTerm);
      searchResults.classList.add("active");
    } else {
      searchResults.classList.remove("active");
      searchResults.innerHTML = "";
    }
  });

  // 改善搜尋演算法
  function performSearch(searchTerm) {
    const filteredResults = pages.filter((page) => {
      const titleLower = page.title.toLowerCase();
      // 檢查標題和關鍵字是否包含搜尋字詞
      const keywordMatch =
        page.keywords &&
        page.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm)
        );
      return titleLower.includes(searchTerm) || keywordMatch;
    });

    displayResults(filteredResults);
  }

  function displayResults(results) {
    searchResults.innerHTML = "";

    if (results.length === 0) {
      searchResults.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>找不到相關結果</p>
      </div>`;
      return;
    }

    const ul = document.createElement("ul");
    ul.className = "search-list";

    results.forEach((result, index) => {
      const li = document.createElement("li");
      li.className = "search-item";
      li.style.animationDelay = `${index * 0.05}s`;

      // 獲取類別名稱
      const categoryName =
        categories[result.category] || result.category || "其他";

      li.innerHTML = `
      <a href="${result.path}">
        <i class="fas fa-coins"></i>
        <span>${result.title}</span>
        <span class="category-tag">${categoryName}</span>
      </a>`;
      ul.appendChild(li);
    });

    searchResults.appendChild(ul);
    searchResults.classList.add("active"); // 確保添加 active 類別
  }

  // 點擊外部關閉搜尋結果
  document.addEventListener("click", function (e) {
    if (!searchResults.contains(e.target) && !searchInput.contains(e.target)) {
      searchResults.classList.remove("active");
    }
  });

  // 點擊搜尋結果項目後關閉
  searchResults.addEventListener("click", function (e) {
    if (e.target.closest(".search-item")) {
      searchResults.classList.remove("active");
    }
  });

  // 在 DOMContentLoaded 事件監聽器內添加新的事件處理
  searchInput.addEventListener("focus", function (e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm.length >= 1) {
      performSearch(searchTerm);
      searchResults.classList.add("active");
    }
  });
});
