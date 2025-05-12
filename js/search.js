class SearchModule {
  constructor(options) {
    this.searchInput = document.getElementById(options.inputId);
    this.searchResults = document.getElementById("searchResults");
    this.dataUrl = options.dataUrl;
    this.pages = [];
    this.categories = {};
    this.init();
  }

  async init() {
    try {
      const response = await fetch(this.dataUrl);
      const data = await response.json();
      this.pages = data[data.stocks ? "stocks" : "cryptos"];
      this.categories = data.categories;
    } catch (error) {
      console.error(`Error loading data from ${this.dataUrl}:`, error);
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // 搜尋輸入處理
    this.searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      if (searchTerm.length >= 1) {
        this.performSearch(searchTerm);
        this.searchResults.classList.add("active");
      } else {
        this.searchResults.classList.remove("active");
        this.searchResults.innerHTML = "";
      }
    });

    // 點擊外部關閉搜尋結果
    document.addEventListener("click", (e) => {
      if (
        !this.searchResults.contains(e.target) &&
        !this.searchInput.contains(e.target)
      ) {
        this.searchResults.classList.remove("active");
      }
    });

    // 點擊搜尋結果項目後關閉
    this.searchResults.addEventListener("click", (e) => {
      if (e.target.closest(".search-item")) {
        this.searchResults.classList.remove("active");
      }
    });

    // 輸入框獲得焦點時的處理
    this.searchInput.addEventListener("focus", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      if (searchTerm.length >= 1) {
        this.performSearch(searchTerm);
        this.searchResults.classList.add("active");
      }
    });
  }

  performSearch(searchTerm) {
    const filteredResults = this.pages.filter((page) => {
      const titleLower = page.title.toLowerCase();
      const keywordMatch =
        page.keywords &&
        page.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm)
        );
      return titleLower.includes(searchTerm) || keywordMatch;
    });

    this.displayResults(filteredResults);
  }

  displayResults(results) {
    this.searchResults.innerHTML = "";

    // 重設滾動位置到頂部
    this.searchResults.scrollTop = 0;

    // 限制結果最多顯示50個
    const limitedResults = results.slice(0, 50);

    if (limitedResults.length === 0) {
      this.searchResults.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>找不到相關結果</p>
      </div>`;
      return;
    }

    const ul = document.createElement("ul");
    ul.className = "search-list";

    // 如果結果超過50個，顯示提示訊息
    if (results.length > 50) {
      const notice = document.createElement("div");
      notice.className = "search-notice";
      notice.innerHTML = `
        <p>
          找到 <span style="color: var(--primary-color); font-weight: 600;">${results.length}</span> 個符合的結果
          <span style="opacity: 0.8; margin-left: 4px;">
            · 僅顯示前 50 筆
          </span>
        </p>
      `;
      this.searchResults.appendChild(notice);
    }

    limitedResults.forEach((result, index) => {
      const li = document.createElement("li");
      li.className = "search-item";
      li.style.animationDelay = `${index * 0.05}s`;

      const categoryName =
        this.categories[result.category] || result.category || "其他";

      li.innerHTML = `
      <a href="${result.path}">
        <i class="fas fa-coins"></i>
        <span>${result.title}</span>
        <span class="category-tag">${categoryName}</span>
      </a>`;
      ul.appendChild(li);
    });

    this.searchResults.appendChild(ul);
    this.searchResults.classList.add("active");
  }
}
