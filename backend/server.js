const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "lamnguyen_admin_secret_2026_change_me";
const DATA_DIR = process.env.DATA_DIR || __dirname;

const db = new Database(path.join(DATA_DIR, "database.sqlite"));

const uploadsDir = path.join(DATA_DIR, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Chỉ cho phép ảnh jpg, jpeg, png, webp"));
    }
    cb(null, true);
  }
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    ten_san_pham TEXT NOT NULL,
    danh_muc TEXT NOT NULL,
    loai_tai_khoan TEXT,
    thoi_han TEXT,
    gia_so INTEGER DEFAULT 0,
    gia_hien_thi TEXT,
    trang_thai TEXT DEFAULT 'Còn hàng',
    logo_url TEXT,
    mo_ta_ngan TEXT,
    mo_ta_chi_tiet TEXT,
    lien_he_zalo TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

function slugify(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureDefaultAdmin() {
  const existing = db.prepare("SELECT id FROM admins WHERE username = ?").get("admin");
  if (!existing) {
    const passwordHash = bcrypt.hashSync("123456", 10);
    db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)")
      .run("admin", passwordHash);
    console.log("Đã tạo admin mặc định: admin / 123456");
  }
}

function seedProducts() {
  const count = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
  if (count > 0) return;

  const seed = [
    {
      slug: "chatgpt-plus-1-thang",
      ten_san_pham: "ChatGPT Plus 1 tháng",
      danh_muc: "ChatGPT",
      loai_tai_khoan: "Nâng cấp",
      thoi_han: "1 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/chatgpt.png",
      mo_ta_ngan: "Gói ChatGPT Plus sử dụng 1 tháng.",
      mo_ta_chi_tiet: "Phù hợp cho học tập, làm việc, viết nội dung, dịch thuật và hỗ trợ AI hằng ngày.",
      lien_he_zalo: "https://zalo.me/0795048965"
    },
    {
      slug: "chatgpt-plus-3-thang",
      ten_san_pham: "ChatGPT Plus 3 tháng",
      danh_muc: "ChatGPT",
      loai_tai_khoan: "Nâng cấp",
      thoi_han: "3 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/chatgpt.png",
      mo_ta_ngan: "Gói ChatGPT Plus sử dụng 3 tháng.",
      mo_ta_chi_tiet: "Gói thời hạn dài hơn, phù hợp dùng ổn định cho học tập và công việc.",
      lien_he_zalo: "https://zalo.me/0795048965"
    },
    {
      slug: "gemini-1-thang",
      ten_san_pham: "Gemini 1 tháng",
      danh_muc: "Gemini",
      loai_tai_khoan: "Nâng cấp",
      thoi_han: "1 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/gemini.png",
      mo_ta_ngan: "Gói Gemini sử dụng 1 tháng.",
      mo_ta_chi_tiet: "Phù hợp cho người cần AI của Google để hỗ trợ công việc hằng ngày.",
      lien_he_zalo: "https://zalo.me/0795048965"
    },
    {
      slug: "gemini-3-thang",
      ten_san_pham: "Gemini 3 tháng",
      danh_muc: "Gemini",
      loai_tai_khoan: "Nâng cấp",
      thoi_han: "3 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/gemini.png",
      mo_ta_ngan: "Gói Gemini sử dụng 3 tháng.",
      mo_ta_chi_tiet: "Gói phù hợp cho người dùng lâu dài, cần công cụ AI hỗ trợ đều đặn.",
      lien_he_zalo: "https://zalo.me/0795048965"
    },
    {
      slug: "yt-premium-1-thang",
      ten_san_pham: "YouTube Premium 1 tháng",
      danh_muc: "YouTube Premium",
      loai_tai_khoan: "Nâng cấp",
      thoi_han: "1 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/yt-premium.png",
      mo_ta_ngan: "Xem YouTube không quảng cáo trong 1 tháng.",
      mo_ta_chi_tiet: "Trải nghiệm YouTube Premium mượt mà hơn, ít gián đoạn hơn.",
      lien_he_zalo: "https://zalo.me/0795048965"
    },
    {
      slug: "spotify-3-thang",
      ten_san_pham: "Spotify Premium 3 tháng",
      danh_muc: "Spotify",
      loai_tai_khoan: "Nâng cấp",
      thoi_han: "3 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/spotify.png",
      mo_ta_ngan: "Nghe nhạc Spotify Premium 3 tháng.",
      mo_ta_chi_tiet: "Phù hợp cho người thích nghe nhạc chất lượng cao, ít gián đoạn.",
      lien_he_zalo: "https://zalo.me/0795048965"
    },
    {
      slug: "netflix-3-thang",
      ten_san_pham: "Netflix 3 tháng",
      danh_muc: "Netflix",
      loai_tai_khoan: "Tài khoản",
      thoi_han: "3 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/netflix.png",
      mo_ta_ngan: "Gói Netflix sử dụng 3 tháng.",
      mo_ta_chi_tiet: "Phù hợp cho nhu cầu giải trí xem phim, series và nội dung đa dạng.",
      lien_he_zalo: "https://zalo.me/0795048965"
    },
    {
      slug: "elsa-6-thang",
      ten_san_pham: "ELSA Premium 6 tháng",
      danh_muc: "ELSA",
      loai_tai_khoan: "Nâng cấp",
      thoi_han: "6 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/elsa.png",
      mo_ta_ngan: "Luyện phát âm với ELSA trong 6 tháng.",
      mo_ta_chi_tiet: "Gói phù hợp cho người cần luyện phát âm tiếng Anh lâu dài.",
      lien_he_zalo: "https://zalo.me/0795048965"
    },
    {
      slug: "duolingo-6-thang",
      ten_san_pham: "Duolingo 6 tháng",
      danh_muc: "Duolingo",
      loai_tai_khoan: "Nâng cấp",
      thoi_han: "6 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/duolingo.png",
      mo_ta_ngan: "Học ngoại ngữ với Duolingo trong 6 tháng.",
      mo_ta_chi_tiet: "Phù hợp cho người học tiếng Anh và ngoại ngữ khác theo lộ trình dài hạn.",
      lien_he_zalo: "https://zalo.me/0795048965"
    },
    {
      slug: "claude-pro-1-thang",
      ten_san_pham: "Claude Pro 1 tháng",
      danh_muc: "Claude",
      loai_tai_khoan: "Nâng cấp",
      thoi_han: "1 tháng",
      gia_so: 200000,
      gia_hien_thi: "200.000đ",
      trang_thai: "Còn hàng",
      logo_url: "images/products/claude.png",
      mo_ta_ngan: "Gói Claude Pro sử dụng 1 tháng.",
      mo_ta_chi_tiet: "Phù hợp cho người cần thêm lựa chọn AI hỗ trợ viết, tóm tắt và làm việc với văn bản.",
      lien_he_zalo: "https://zalo.me/0795048965"
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO products (
      slug, ten_san_pham, danh_muc, loai_tai_khoan, thoi_han,
      gia_so, gia_hien_thi, trang_thai, logo_url,
      mo_ta_ngan, mo_ta_chi_tiet, lien_he_zalo
    )
    VALUES (
      @slug, @ten_san_pham, @danh_muc, @loai_tai_khoan, @thoi_han,
      @gia_so, @gia_hien_thi, @trang_thai, @logo_url,
      @mo_ta_ngan, @mo_ta_chi_tiet, @lien_he_zalo
    )
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) stmt.run(item);
  });

  insertMany(seed);
  console.log("Đã seed 10 sản phẩm mẫu");
}

ensureDefaultAdmin();
seedProducts();

function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}

function normalizeProduct(body = {}) {
  const ten_san_pham = (body.ten_san_pham || "").trim();
  const slug = (body.slug || "").trim() || slugify(ten_san_pham);
  const danh_muc = (body.danh_muc || "").trim();
  const loai_tai_khoan = (body.loai_tai_khoan || "").trim();
  const thoi_han = (body.thoi_han || "").trim();
  const gia_so = Number(body.gia_so || 0);
  const gia_hien_thi = (body.gia_hien_thi || "").trim() || `${gia_so.toLocaleString("vi-VN")}đ`;
  const trang_thai = (body.trang_thai || "Còn hàng").trim();
  const logo_url = (body.logo_url || "").trim();
  const mo_ta_ngan = (body.mo_ta_ngan || "").trim();
  const mo_ta_chi_tiet = (body.mo_ta_chi_tiet || "").trim();
  const lien_he_zalo = (body.lien_he_zalo || "https://zalo.me/0795048965").trim();

  return {
    slug,
    ten_san_pham,
    danh_muc,
    loai_tai_khoan,
    thoi_han,
    gia_so,
    gia_hien_thi,
    trang_thai,
    logo_url,
    mo_ta_ngan,
    mo_ta_chi_tiet,
    lien_he_zalo
  };
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Backend Tài khoản AI Lâm Nguyễn đang chạy"
  });
});

app.get("/api/products", (req, res) => {
  const rows = db.prepare("SELECT * FROM products ORDER BY id DESC").all();
  res.json(rows);
});

app.get("/api/products/:slug", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(req.params.slug);
  if (!row) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  res.json(row);
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const admin = db.prepare("SELECT * FROM admins WHERE username = ?").get(username);

  if (!admin) {
    return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });
  }

  const ok = bcrypt.compareSync(password || "", admin.password_hash);
  if (!ok) {
    return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu" });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, username: admin.username });
});

app.get("/api/admin/me", auth, (req, res) => {
  res.json({
    id: req.admin.id,
    username: req.admin.username
  });
});

app.patch("/api/admin/change-password", auth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Thiếu mật khẩu hiện tại hoặc mật khẩu mới" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Mật khẩu mới phải từ 6 ký tự" });
  }

  const admin = db.prepare("SELECT * FROM admins WHERE id = ?").get(req.admin.id);
  if (!admin) {
    return res.status(404).json({ message: "Không tìm thấy admin" });
  }

  const ok = bcrypt.compareSync(currentPassword, admin.password_hash);
  if (!ok) {
    return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE admins SET password_hash = ? WHERE id = ?")
    .run(newHash, req.admin.id);

  res.json({ message: "Đổi mật khẩu thành công" });
});

app.post("/api/admin/upload", auth, (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload ảnh thất bại" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Bạn chưa chọn ảnh" });
    }

    res.json({
      message: "Upload ảnh thành công",
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    });
  });
});

app.get("/api/admin/backup", auth, (req, res) => {
  const filePath = path.join(DATA_DIR, "database.sqlite");
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0")
  ].join("");

  res.download(filePath, `backup-${stamp}.sqlite`);
});

app.get("/api/admin/products", auth, (req, res) => {
  const rows = db.prepare("SELECT * FROM products ORDER BY id DESC").all();
  res.json(rows);
});

app.post("/api/admin/products", auth, (req, res) => {
  try {
    const product = normalizeProduct(req.body);

    if (!product.ten_san_pham || !product.danh_muc) {
      return res.status(400).json({ message: "Thiếu tên sản phẩm hoặc danh mục" });
    }

    const stmt = db.prepare(`
      INSERT INTO products (
        slug, ten_san_pham, danh_muc, loai_tai_khoan, thoi_han,
        gia_so, gia_hien_thi, trang_thai, logo_url,
        mo_ta_ngan, mo_ta_chi_tiet, lien_he_zalo, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    const result = stmt.run(
      product.slug,
      product.ten_san_pham,
      product.danh_muc,
      product.loai_tai_khoan,
      product.thoi_han,
      product.gia_so,
      product.gia_hien_thi,
      product.trang_thai,
      product.logo_url,
      product.mo_ta_ngan,
      product.mo_ta_chi_tiet,
      product.lien_he_zalo
    );

    res.json({ id: result.lastInsertRowid, message: "Đã thêm sản phẩm" });
  } catch {
    res.status(400).json({ message: "Không thể thêm sản phẩm, có thể bị trùng slug" });
  }
});

app.put("/api/admin/products/:id", auth, (req, res) => {
  try {
    const product = normalizeProduct(req.body);

    if (!product.ten_san_pham || !product.danh_muc) {
      return res.status(400).json({ message: "Thiếu tên sản phẩm hoặc danh mục" });
    }

    const stmt = db.prepare(`
      UPDATE products
      SET slug = ?, ten_san_pham = ?, danh_muc = ?, loai_tai_khoan = ?,
          thoi_han = ?, gia_so = ?, gia_hien_thi = ?, trang_thai = ?,
          logo_url = ?, mo_ta_ngan = ?, mo_ta_chi_tiet = ?, lien_he_zalo = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      product.slug,
      product.ten_san_pham,
      product.danh_muc,
      product.loai_tai_khoan,
      product.thoi_han,
      product.gia_so,
      product.gia_hien_thi,
      product.trang_thai,
      product.logo_url,
      product.mo_ta_ngan,
      product.mo_ta_chi_tiet,
      product.lien_he_zalo,
      req.params.id
    );

    res.json({ message: "Đã cập nhật sản phẩm" });
  } catch {
    res.status(400).json({ message: "Không thể cập nhật, có thể bị trùng slug" });
  }
});

app.delete("/api/admin/products/:id", auth, (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ message: "Đã xóa sản phẩm" });
});

app.patch("/api/admin/products/:id/status", auth, (req, res) => {
  const trang_thai = (req.body.trang_thai || "").trim();

  if (!["Còn hàng", "Hết hàng"].includes(trang_thai)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  db.prepare(`
    UPDATE products
    SET trang_thai = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(trang_thai, req.params.id);

  res.json({ message: "Đã đổi trạng thái" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend đang chạy tại http://0.0.0.0:${PORT}`);
});