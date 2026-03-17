const TOKEN_KEY = "taiKhoanAI_admin_token";
const AUTH_USER_KEY = "taiKhoanAI_admin_user";

const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const backupBtn = document.getElementById("backupBtn");
const loginMessage = document.getElementById("loginMessage");
const adminUsernameChip = document.getElementById("adminUsernameChip");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const totalProductsEl = document.getElementById("totalProducts");
const inStockCountEl = document.getElementById("inStockCount");
const outStockCountEl = document.getElementById("outStockCount");

const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productTableBody");
const resetBtn = document.getElementById("resetBtn");
const formTitle = document.getElementById("formTitle");
const tableSearchInput = document.getElementById("tableSearchInput");

const changePasswordForm = document.getElementById("changePasswordForm");
const changePasswordMessage = document.getElementById("changePasswordMessage");
const currentPasswordInput = document.getElementById("currentPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

const imageFileInput = document.getElementById("imageFileInput");
const uploadImageBtn = document.getElementById("uploadImageBtn");
const uploadImageMessage = document.getElementById("uploadImageMessage");
const imagePreviewBox = document.getElementById("imagePreviewBox");

const fields = {
  productId: document.getElementById("productId"),
  ten_san_pham: document.getElementById("ten_san_pham"),
  slug: document.getElementById("slug"),
  danh_muc: document.getElementById("danh_muc"),
  loai_tai_khoan: document.getElementById("loai_tai_khoan"),
  thoi_han: document.getElementById("thoi_han"),
  gia_so: document.getElementById("gia_so"),
  gia_hien_thi: document.getElementById("gia_hien_thi"),
  trang_thai: document.getElementById("trang_thai"),
  logo_url: document.getElementById("logo_url"),
  lien_he_zalo: document.getElementById("lien_he_zalo"),
  mo_ta_ngan: document.getElementById("mo_ta_ngan"),
  mo_ta_chi_tiet: document.getElementById("mo_ta_chi_tiet")
};

let currentProducts = [];
let currentSearch = "";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getStoredUser() {
  return localStorage.getItem(AUTH_USER_KEY) || "admin";
}

function setStoredUser(username) {
  localStorage.setItem(AUTH_USER_KEY, username);
}

function clearStoredUser() {
  localStorage.removeItem(AUTH_USER_KEY);
}

function slugify(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2600);
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Có lỗi xảy ra");
  }

  return data;
}

function resolveImageUrl(url = "") {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads/")) return `${API_BASE}${url}`;
  return url;
}

function setImagePreview(url = "") {
  const finalUrl = resolveImageUrl(url);

  if (!finalUrl) {
    imagePreviewBox.innerHTML = `<div class="image-preview-empty">Chưa có ảnh</div>`;
    return;
  }

  imagePreviewBox.innerHTML = `<img src="${finalUrl}" alt="Preview ảnh sản phẩm" onerror="this.remove(); document.getElementById('imagePreviewBox').innerHTML='<div class=&quot;image-preview-empty&quot;>Không xem trước được ảnh</div>';">`;
}

function showLogin() {
  loginBox.classList.remove("hidden");
  dashboard.classList.add("hidden");
}

function showDashboard() {
  loginBox.classList.add("hidden");
  dashboard.classList.remove("hidden");
  adminUsernameChip.textContent = getStoredUser();
}

function resetForm() {
  formTitle.textContent = "Thêm sản phẩm mới";
  productForm.reset();
  fields.productId.value = "";
  fields.trang_thai.value = "Còn hàng";
  fields.lien_he_zalo.value = "https://zalo.me/0795048965";
  uploadImageMessage.textContent = "";
  setImagePreview("");
}

function fillForm(product) {
  formTitle.textContent = `Sửa sản phẩm #${product.id}`;
  fields.productId.value = product.id;
  fields.ten_san_pham.value = product.ten_san_pham || "";
  fields.slug.value = product.slug || "";
  fields.danh_muc.value = product.danh_muc || "";
  fields.loai_tai_khoan.value = product.loai_tai_khoan || "";
  fields.thoi_han.value = product.thoi_han || "";
  fields.gia_so.value = product.gia_so || 0;
  fields.gia_hien_thi.value = product.gia_hien_thi || "";
  fields.trang_thai.value = product.trang_thai || "Còn hàng";
  fields.logo_url.value = product.logo_url || "";
  fields.lien_he_zalo.value = product.lien_he_zalo || "https://zalo.me/0795048965";
  fields.mo_ta_ngan.value = product.mo_ta_ngan || "";
  fields.mo_ta_chi_tiet.value = product.mo_ta_chi_tiet || "";
  uploadImageMessage.textContent = "";
  setImagePreview(product.logo_url || "");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateStats() {
  const total = currentProducts.length;
  const inStock = currentProducts.filter(item => item.trang_thai === "Còn hàng").length;
  const outStock = currentProducts.filter(item => item.trang_thai === "Hết hàng").length;

  totalProductsEl.textContent = total;
  inStockCountEl.textContent = inStock;
  outStockCountEl.textContent = outStock;
}

function filterProductsForTable() {
  const keyword = currentSearch.trim().toLowerCase();
  if (!keyword) return currentProducts;

  return currentProducts.filter(product => {
    const haystack = [
      product.ten_san_pham,
      product.danh_muc,
      product.slug,
      product.thoi_han,
      product.loai_tai_khoan
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(keyword);
  });
}

function renderTable() {
  const rows = filterProductsForTable();

  if (rows.length === 0) {
    productTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; color:#64748b;">Không có sản phẩm phù hợp</td>
      </tr>
    `;
    return;
  }

  productTableBody.innerHTML = rows.map(product => `
    <tr>
      <td>#${product.id}</td>
      <td>
        <div class="product-name">${product.ten_san_pham}</div>
        <div class="product-meta">${product.loai_tai_khoan || ""} • ${product.thoi_han || ""}</div>
      </td>
      <td>${product.danh_muc}</td>
      <td>${product.gia_hien_thi || ""}</td>
      <td>
        <span class="status-pill ${product.trang_thai === "Còn hàng" ? "status-green" : "status-red"}">
          ${product.trang_thai}
        </span>
      </td>
      <td>${product.slug}</td>
      <td>
        <div class="action-row">
          <button class="button button-secondary button-small" data-action="edit" data-id="${product.id}">Sửa</button>
          <button class="button button-secondary button-small" data-action="toggle" data-id="${product.id}">
            ${product.trang_thai === "Còn hàng" ? "Hết hàng" : "Còn hàng"}
          </button>
          <button class="button button-danger button-small" data-action="delete" data-id="${product.id}">Xóa</button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function loadProducts() {
  currentProducts = await api("/api/admin/products");
  updateStats();
  renderTable();
}

async function loadMe() {
  const me = await api("/api/admin/me");
  setStoredUser(me.username);
  adminUsernameChip.textContent = me.username;
}

function clearAuth() {
  clearToken();
  clearStoredUser();
}

async function uploadImageFile() {
  const file = imageFileInput.files[0];
  if (!file) {
    uploadImageMessage.textContent = "Bạn chưa chọn ảnh.";
    showToast("Bạn chưa chọn ảnh", "error");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  const token = getToken();
  uploadImageBtn.disabled = true;
  uploadImageBtn.textContent = "Đang upload...";
  uploadImageMessage.textContent = "Đang upload ảnh...";

  try {
    const res = await fetch(`${API_BASE}/api/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Upload ảnh thất bại");
    }

    fields.logo_url.value = data.url;
    setImagePreview(data.url);
    uploadImageMessage.textContent = "Upload ảnh thành công.";
    showToast("Upload ảnh thành công");
  } catch (error) {
    uploadImageMessage.textContent = error.message;
    showToast(error.message, "error");
  } finally {
    uploadImageBtn.disabled = false;
    uploadImageBtn.textContent = "Upload ảnh";
    imageFileInput.value = "";
  }
}

async function downloadBackup() {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/admin/backup`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      let msg = "Tải backup thất bại";
      try {
        const data = await res.json();
        msg = data.message || msg;
      } catch {}
      throw new Error(msg);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-database.sqlite`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    showToast("Đã tải backup database");
  } catch (error) {
    showToast(error.message, "error");
  }
}

loginBtn.addEventListener("click", async () => {
  try {
    loginBtn.disabled = true;
    loginBtn.textContent = "Đang đăng nhập...";
    loginMessage.textContent = "Đang kiểm tra tài khoản...";

    const data = await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value
      })
    });

    setToken(data.token);
    setStoredUser(data.username || "admin");

    showDashboard();
    await loadMe();
    await loadProducts();
    resetForm();

    loginMessage.textContent = "";
    showToast("Đăng nhập thành công");
  } catch (error) {
    loginMessage.textContent = error.message;
    showToast(error.message, "error");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Đăng nhập";
  }
});

logoutBtn.addEventListener("click", () => {
  clearAuth();
  showLogin();
  showToast("Đã đăng xuất");
});

backupBtn.addEventListener("click", downloadBackup);
uploadImageBtn.addEventListener("click", uploadImageFile);

fields.logo_url.addEventListener("input", () => {
  setImagePreview(fields.logo_url.value.trim());
});

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    ten_san_pham: fields.ten_san_pham.value.trim(),
    slug: fields.slug.value.trim() || slugify(fields.ten_san_pham.value.trim()),
    danh_muc: fields.danh_muc.value.trim(),
    loai_tai_khoan: fields.loai_tai_khoan.value.trim(),
    thoi_han: fields.thoi_han.value.trim(),
    gia_so: Number(fields.gia_so.value || 0),
    gia_hien_thi: fields.gia_hien_thi.value.trim(),
    trang_thai: fields.trang_thai.value,
    logo_url: fields.logo_url.value.trim(),
    lien_he_zalo: fields.lien_he_zalo.value.trim(),
    mo_ta_ngan: fields.mo_ta_ngan.value.trim(),
    mo_ta_chi_tiet: fields.mo_ta_chi_tiet.value.trim()
  };

  try {
    if (fields.productId.value) {
      await api(`/api/admin/products/${fields.productId.value}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      showToast("Đã cập nhật sản phẩm");
    } else {
      await api("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      showToast("Đã thêm sản phẩm");
    }

    resetForm();
    await loadProducts();
  } catch (error) {
    showToast(error.message, "error");
  }
});

resetBtn.addEventListener("click", resetForm);

tableSearchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderTable();
});

productTableBody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;
  const product = currentProducts.find(item => String(item.id) === String(id));
  if (!product) return;

  if (action === "edit") {
    fillForm(product);
    return;
  }

  if (action === "toggle") {
    const newStatus = product.trang_thai === "Còn hàng" ? "Hết hàng" : "Còn hàng";

    try {
      await api(`/api/admin/products/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ trang_thai: newStatus })
      });
      await loadProducts();
      showToast("Đã đổi trạng thái sản phẩm");
    } catch (error) {
      showToast(error.message, "error");
    }
    return;
  }

  if (action === "delete") {
    const ok = confirm(`Xóa sản phẩm "${product.ten_san_pham}"?`);
    if (!ok) return;

    try {
      await api(`/api/admin/products/${id}`, {
        method: "DELETE"
      });

      if (fields.productId.value === String(id)) {
        resetForm();
      }

      await loadProducts();
      showToast("Đã xóa sản phẩm");
    } catch (error) {
      showToast(error.message, "error");
    }
  }
});

changePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentPassword = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  changePasswordMessage.textContent = "";

  if (!currentPassword || !newPassword || !confirmPassword) {
    changePasswordMessage.textContent = "Bạn cần nhập đầy đủ thông tin.";
    showToast("Bạn cần nhập đầy đủ thông tin", "error");
    return;
  }

  if (newPassword.length < 6) {
    changePasswordMessage.textContent = "Mật khẩu mới phải từ 6 ký tự.";
    showToast("Mật khẩu mới phải từ 6 ký tự", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    changePasswordMessage.textContent = "Mật khẩu nhập lại không khớp.";
    showToast("Mật khẩu nhập lại không khớp", "error");
    return;
  }

  try {
    await api("/api/admin/change-password", {
      method: "PATCH",
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    changePasswordForm.reset();
    changePasswordMessage.textContent = "Đổi mật khẩu thành công.";
    showToast("Đổi mật khẩu thành công");
  } catch (error) {
    changePasswordMessage.textContent = error.message;
    showToast(error.message, "error");
  }
});

(async function init() {
  if (!getToken()) {
    showLogin();
    return;
  }

  try {
    showDashboard();
    await loadMe();
    await loadProducts();
    resetForm();
  } catch {
    clearAuth();
    showLogin();
  }
})();