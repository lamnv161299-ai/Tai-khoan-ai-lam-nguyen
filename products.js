const DEFAULT_ZALO = "https://zalo.me/0795048965";

const PRODUCTS = [
  {
    id: 1,
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
    mo_ta_chi_tiet:
      "Phù hợp cho học tập, làm việc, viết nội dung, dịch thuật và hỗ trợ AI hằng ngày. Hỗ trợ nhanh sau khi liên hệ.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua ChatGPT Plus 1 tháng"
  },
  {
    id: 2,
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
    mo_ta_chi_tiet:
      "Gói thời hạn dài hơn, phù hợp dùng ổn định cho học tập, công việc và nghiên cứu. Liên hệ Zalo để được tư vấn.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua ChatGPT Plus 3 tháng"
  },
  {
    id: 3,
    slug: "gemini-1-thang",
    ten_san_pham: "Gemini 1 tháng",
    danh_muc: "Gemini",
    loai_tai_khoan: "Nâng cấp",
    thoi_han: "1 tháng",
    gia_so: 200000,
    gia_hien_thi: "200.000đ",
    trang_thai: "Còn hàng",
    logo_url: "images/products/gemini.jfif",
    mo_ta_ngan: "Gói Gemini sử dụng 1 tháng.",
    mo_ta_chi_tiet:
      "Phù hợp cho người cần AI của Google để hỗ trợ tổng hợp, viết và xử lý công việc hằng ngày.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua Gemini 1 tháng"
  },
  {
    id: 4,
    slug: "gemini-3-thang",
    ten_san_pham: "Gemini 3 tháng",
    danh_muc: "Gemini",
    loai_tai_khoan: "Nâng cấp",
    thoi_han: "3 tháng",
    gia_so: 200000,
    gia_hien_thi: "200.000đ",
    trang_thai: "Còn hàng",
    logo_url: "images/products/gemini.jfif",
    mo_ta_ngan: "Gói Gemini sử dụng 3 tháng.",
    mo_ta_chi_tiet:
      "Gói phù hợp cho người dùng lâu dài, cần công cụ AI hỗ trợ đều đặn trong học tập và công việc.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua Gemini 3 tháng"
  },
  {
    id: 5,
    slug: "yt-premium-1-thang",
    ten_san_pham: "YouTube Premium 1 tháng",
    danh_muc: "YouTube Premium",
    loai_tai_khoan: "Nâng cấp",
    thoi_han: "1 tháng",
    gia_so: 200000,
    gia_hien_thi: "200.000đ",
    trang_thai: "Còn hàng",
    logo_url: "images/products/yt-premium.jfif",
    mo_ta_ngan: "Xem YouTube không quảng cáo trong 1 tháng.",
    mo_ta_chi_tiet:
      "Trải nghiệm YouTube Premium mượt mà hơn, ít gián đoạn hơn, phù hợp nhu cầu giải trí và học tập.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua YouTube Premium 1 tháng"
  },
  {
    id: 6,
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
    mo_ta_chi_tiet:
      "Phù hợp cho người thích nghe nhạc chất lượng cao, ít gián đoạn và sử dụng lâu dài.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua Spotify Premium 3 tháng"
  },
  {
    id: 7,
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
    mo_ta_chi_tiet:
      "Phù hợp cho nhu cầu giải trí xem phim, series và nội dung đa dạng trên Netflix.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua Netflix 3 tháng"
  },
  {
    id: 8,
    slug: "elsa-6-thang",
    ten_san_pham: "ELSA Premium 6 tháng",
    danh_muc: "ELSA",
    loai_tai_khoan: "Nâng cấp",
    thoi_han: "6 tháng",
    gia_so: 200000,
    gia_hien_thi: "200.000đ",
    trang_thai: "Còn hàng",
    logo_url: "images/products/elsa.jpg",
    mo_ta_ngan: "Luyện phát âm với ELSA trong 6 tháng.",
    mo_ta_chi_tiet:
      "Gói phù hợp cho người cần luyện phát âm tiếng Anh lâu dài, bền bỉ và đều đặn.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua ELSA Premium 6 tháng"
  },
  {
    id: 9,
    slug: "duolingo-6-thang",
    ten_san_pham: "Duolingo 6 tháng",
    danh_muc: "Duolingo",
    loai_tai_khoan: "Nâng cấp",
    thoi_han: "6 tháng",
    gia_so: 200000,
    gia_hien_thi: "200.000đ",
    trang_thai: "Còn hàng",
    logo_url: "images/products/duolingo.jfif",
    mo_ta_ngan: "Học ngoại ngữ với Duolingo trong 6 tháng.",
    mo_ta_chi_tiet:
      "Phù hợp cho người học tiếng Anh và ngoại ngữ khác theo lộ trình dài hạn, dễ sử dụng.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua Duolingo 6 tháng"
  },
  {
    id: 10,
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
    mo_ta_chi_tiet:
      "Phù hợp cho người cần thêm lựa chọn AI hỗ trợ viết, tóm tắt và làm việc với văn bản.",
    lien_he_zalo: DEFAULT_ZALO,
    tin_nhan_mau: "Em muốn mua Claude Pro 1 tháng"
  }
];