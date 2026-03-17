function shortLabel(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "AI";
}

function formatPrice(product) {
  if (product.gia_hien_thi) return product.gia_hien_thi;
  if (typeof product.gia_so === "number") {
    return product.gia_so.toLocaleString("vi-VN") + "đ";
  }
  return "Liên hệ";
}

function resolveImageUrl(url = "") {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads/")) return `${API_BASE}${url}`;
  return url;
}

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

async function renderProductDetail() {
  const container = document.getElementById("productDetail");
  const slug = getSlug();

  if (!slug) {
    container.innerHTML = `<div class="detail-card"><h1>Thiếu slug sản phẩm</h1></div>`;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error("Not found");
    const product = await res.json();

    const imageHtml = product.logo_url
      ? `<img src="${resolveImageUrl(product.logo_url)}" alt="${product.ten_san_pham}" class="detail-image" onerror="this.remove()">`
      : `<div class="detail-fallback">${shortLabel(product.danh_muc || product.ten_san_pham)}</div>`;

    container.innerHTML = `
      <div class="detail-card">
        <div class="detail-top">
          <div class="detail-image-wrap">
            ${imageHtml}
          </div>

          <div class="detail-info">
            <span class="badge">${product.danh_muc}</span>
            <h1>${product.ten_san_pham}</h1>
            <p class="muted">${product.loai_tai_khoan || ""} • ${product.thoi_han || ""}</p>

            <div class="detail-price">${formatPrice(product)}</div>

            <div class="detail-meta">
              <div><strong>Trạng thái:</strong> ${product.trang_thai}</div>
              <div><strong>Loại tài khoản:</strong> ${product.loai_tai_khoan || ""}</div>
              <div><strong>Thời hạn:</strong> ${product.thoi_han || ""}</div>
            </div>

            <div class="detail-actions">
              <a class="btn btn-primary" href="${product.lien_he_zalo || "https://zalo.me/0795048965"}" target="_blank" rel="noopener noreferrer">
                Liên hệ Zalo
              </a>
              <a class="btn btn-secondary" href="index.html">Xem thêm sản phẩm</a>
            </div>
          </div>
        </div>

        <div class="detail-content">
          <h2>Thông tin sản phẩm</h2>
          <p>${product.mo_ta_chi_tiet || product.mo_ta_ngan || "Đang cập nhật mô tả sản phẩm."}</p>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="detail-card">
        <h1>Không tìm thấy sản phẩm</h1>
        <p>Sản phẩm không tồn tại hoặc backend chưa chạy.</p>
        <a class="btn btn-primary" href="index.html">Quay lại trang chủ</a>
      </div>
    `;
  }
}

renderProductDetail();