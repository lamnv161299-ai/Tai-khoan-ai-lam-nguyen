const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const categoryChips = document.getElementById("categoryChips");
const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

let PRODUCTS = [];
let currentCategory = "all";
let currentSearch = "";

function formatPrice(product) {
  if (product.gia_hien_thi) return product.gia_hien_thi;
  if (typeof product.gia_so === "number") {
    return product.gia_so.toLocaleString("vi-VN") + "đ";
  }
  return "Liên hệ";
}

function shortLabel(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "AI";
}

function createZaloLink(product) {
  return product.lien_he_zalo || "https://zalo.me/0795048965";
}

function resolveImageUrl(url = "") {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads/")) return `${API_BASE}${url}`;
  return url;
}

function createCard(product) {
  const imageHtml = product.logo_url
    ? `<img src="${resolveImageUrl(product.logo_url)}" alt="${product.ten_san_pham}" class="product-thumb-img" onerror="this.style.display='none'; this.parentElement.querySelector('.product-thumb-fallback').style.display='grid';">`
    : "";

  return `
    <article class="product-card">
      <div class="product-thumb">
        ${imageHtml}
        <div class="product-thumb-fallback" ${product.logo_url ? 'style="display:none;"' : ""}>
          ${shortLabel(product.danh_muc || product.ten_san_pham)}
        </div>
      </div>

      <div class="product-info">
        <div class="product-topline">
          <span class="badge">${product.danh_muc}</span>
          <span class="mini-status ${product.trang_thai === "Còn hàng" ? "in-stock" : "out-stock"}">
            ${product.trang_thai}
          </span>
        </div>

        <h3 class="product-title">${product.ten_san_pham}</h3>
        <p class="product-meta">${product.loai_tai_khoan || ""} • ${product.thoi_han || ""}</p>
        <p class="product-desc">${product.mo_ta_ngan || ""}</p>

        <div class="product-bottom">
          <div class="price-block">
            <div class="price">${formatPrice(product)}</div>
          </div>

          <div class="card-actions">
            <a class="btn btn-secondary btn-small" href="product.html?slug=${encodeURIComponent(product.slug)}">
              Chi tiết
            </a>
            <a class="btn btn-primary btn-small" href="${createZaloLink(product)}" target="_blank" rel="noopener noreferrer">
              Liên hệ
            </a>
          </div>
        </div>
      </div>
    </article>
  `;
}

function getCategories() {
  return [...new Set(PRODUCTS.map(item => item.danh_muc).filter(Boolean))];
}

function renderCategoryOptions() {
  categoryFilter.innerHTML = `<option value="all">Tất cả danh mục</option>`;
  const categories = getCategories();

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  categoryChips.innerHTML = `
    <button class="chip active" data-category="all">Tất cả</button>
    ${categories.map(cat => `<button class="chip" data-category="${cat}">${cat}</button>`).join("")}
  `;
}

function updateActiveChip() {
  const chips = categoryChips.querySelectorAll(".chip");
  chips.forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === currentCategory);
  });
}

function filterProducts() {
  return PRODUCTS.filter(product => {
    const matchCategory = currentCategory === "all" || product.danh_muc === currentCategory;

    const keyword = currentSearch.trim().toLowerCase();
    const haystack = [
      product.ten_san_pham,
      product.danh_muc,
      product.loai_tai_khoan,
      product.thoi_han,
      product.mo_ta_ngan,
      product.mo_ta_chi_tiet
    ].join(" ").toLowerCase();

    const matchSearch = !keyword || haystack.includes(keyword);
    return matchCategory && matchSearch;
  });
}

function renderProducts() {
  const filtered = filterProducts();
  resultCount.textContent = `${filtered.length} sản phẩm`;

  if (filtered.length === 0) {
    productGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  productGrid.innerHTML = filtered.map(createCard).join("");
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    PRODUCTS = await res.json();
    renderCategoryOptions();
    renderProducts();
  } catch (error) {
    productGrid.innerHTML = `<p>Không tải được sản phẩm. Hãy kiểm tra backend.</p>`;
  }
}

searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderProducts();
});

categoryFilter.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  updateActiveChip();
  renderProducts();
});

categoryChips.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  currentCategory = btn.dataset.category;
  categoryFilter.value = currentCategory;
  updateActiveChip();
  renderProducts();
});

loadProducts();