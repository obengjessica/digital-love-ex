import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import multer from "multer";
import pg from "pg";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, then root as fallback
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();
app.use(cors());
app.set("trust proxy", true);

const uploadDir = path.join(__dirname, "uploads");
const pagesDir = path.join(__dirname, "pages");
const distDir = path.join(__dirname, "..", "dist");
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(pagesDir, { recursive: true });

app.use("/uploads", express.static(uploadDir));
app.use("/pages", express.static(pagesDir));

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const useSsl =
  !databaseUrl.includes("localhost") && !databaseUrl.includes("127.0.0.1");
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE,
      createdAt TEXT,
      senderName TEXT,
      partnerName TEXT,
      whatsapp TEXT,
      packageId TEXT,
      packageName TEXT,
      packagePrice TEXT,
      paymentReference TEXT,
      dataJson TEXT,
      imagesJson TEXT,
      videosJson TEXT,
      musicPath TEXT
    );
  `);
};

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderLovePage = ({
  senderName,
  partnerName,
  relationship,
  relationshipDuration,
  firstEncounter,
  loveMessage,
  surpriseTime,
  loveStoryNotes,
  pageColor,
  packageId,
  coverImage,
  images,
  videos,
  music,
}) => {
  const accent = pageColor || "#be185d";
  const safeSender = escapeHtml(senderName || "Someone");
  const safePartner = escapeHtml(partnerName || "My Love");
  const safeRelationship = escapeHtml(relationship || "Our Love");
  const safeDuration = escapeHtml(relationshipDuration || "Every day");
  const storySeed =
    loveStoryNotes ||
    `From our first encounter, every moment with you has felt like a blessing.`;
  const storyText =
    `${safeSender} writes: ${escapeHtml(storySeed)} ` +
    `This page is a reminder of how deep our love has grown.`;

  const plan = packageId || "basic";
  const showPhotos = plan !== "basic" && images.length > 0;
  const showVideos = plan === "ultimate" && videos.length > 0;
  const showMusic = plan === "ultimate" && Boolean(music);

  const galleryHtml = images
    .map(
      (src) =>
        `<div class="photo"><img src="${src}" alt="Love memory" /></div>`,
    )
    .join("");

  const videoHtml = videos
    .map((src) => `<video src="${src}" controls playsinline></video>`)
    .join("");

  const musicHtml = showMusic
    ? `<audio controls autoplay loop src="${music}"></audio>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safePartner}'s Love Page</title>
  <style>
    :root { color-scheme: light; --accent: ${accent}; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Georgia", serif; background: #fff5f7; color: #3f1a1f; }
    .hero { position: relative; min-height: 55vh; display: grid; place-items: center; text-align: center; padding: 40px 20px; overflow: hidden; }
    .hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.35; }
    .hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(124, 45, 64, 0.85), rgba(190, 24, 93, 0.6)); }
    .hero-content { position: relative; z-index: 2; max-width: 720px; color: #fff; animation: fadeUp 0.9s ease both; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 12px; }
    .hero p { font-size: 1.1rem; margin: 6px 0; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; background: rgba(255,255,255,0.2); margin-bottom: 12px; }
    .card { background: #fff; margin: -40px auto 32px; max-width: 840px; border-radius: 24px; padding: 28px; box-shadow: 0 25px 60px rgba(124, 45, 64, 0.2); animation: fadeUp 0.9s ease both; }
    .section-title { font-weight: 700; color: var(--accent); margin-bottom: 8px; }
    .grid { display: grid; gap: 16px; }
    .grid.two { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    .photo { overflow: hidden; border-radius: 18px; box-shadow: 0 12px 30px rgba(190, 24, 93, 0.2); }
    .photo img { width: 100%; height: 200px; object-fit: cover; display: block; }
    .note { font-style: italic; line-height: 1.6; }
    .floating { position: absolute; font-size: 20px; opacity: 0.7; animation: float 6s ease-in-out infinite; }
    .floating.one { left: 12%; top: 18%; animation-delay: 0.2s; }
    .floating.two { left: 80%; top: 12%; animation-delay: 0.6s; }
    .floating.three { left: 18%; top: 75%; animation-delay: 0.4s; }
    .floating.four { left: 85%; top: 70%; animation-delay: 0.9s; }
    .video-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
    .video-grid video { width: 100%; border-radius: 18px; box-shadow: 0 12px 30px rgba(190, 24, 93, 0.2); }
    audio { width: 100%; margin-top: 16px; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  </style>
</head>
<body>
  <section class="hero">
    ${coverImage ? `<img src="${coverImage}" alt="Love cover" />` : ""}
    <span class="floating one">💖</span>
    <span class="floating two">💗</span>
    <span class="floating three">💞</span>
    <span class="floating four">💘</span>
    <div class="hero-content">
      <span class="badge">For ${safePartner}</span>
      <h1>${safeSender}'s Love Story</h1>
      <p>${safeRelationship} · ${safeDuration}</p>
    </div>
  </section>
  <section class="card">
    <div class="grid two">
      <div>
        <div class="section-title">First encounter</div>
        <p>${escapeHtml(firstEncounter)}</p>
      </div>
      <div>
        <div class="section-title">Surprise moment</div>
        <p>${escapeHtml(surpriseTime)}</p>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <div class="section-title">Love note</div>
      <p class="note">${escapeHtml(loveMessage)}</p>
    </div>
    ${musicHtml}
  </section>
  ${
    loveStoryNotes || plan !== "basic"
      ? `<section class="card" style="margin-top: 0;">
    <div class="section-title">Our love story</div>
    <p class="note">${storyText}</p>
  </section>`
      : ""
  }
  ${
    showPhotos
      ? `<section class="card" style="margin-top: 0;">
    <div class="section-title">Memories</div>
    <div class="grid two">${galleryHtml}</div>
  </section>`
      : ""
  }
  ${
    showVideos
      ? `<section class="card" style="margin-top: 0;">
    <div class="section-title">Love clips</div>
    <div class="video-grid">${videoHtml}</div>
  </section>`
      : ""
  }
</body>
</html>`;
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/love/:slug", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM submissions WHERE slug = $1",
      [req.params.slug],
    );
    const row = result.rows[0];

    if (!row) {
      res.status(404).json({ message: "Love page not found." });
      return;
    }

    let data = {};
    let images = [];
    let videos = [];

    try {
      data = JSON.parse(row.datajson || "{}");
    } catch {
      data = {};
    }

    try {
      images = JSON.parse(row.imagesjson || "[]");
    } catch {
      images = [];
    }

    try {
      videos = JSON.parse(row.videosjson || "[]");
    } catch {
      videos = [];
    }

    res.json({
      slug: row.slug,
      senderName: row.sendername,
      partnerName: row.partnername,
      packageId: row.packageid,
      packageName: row.packagename,
      packagePrice: row.packageprice,
      music: row.musicpath || "",
      images,
      videos,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch love page:", error);
    res.status(500).json({ message: "Failed to load love page." });
  }
});

app.post(
  "/api/create-love-page",
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "videos", maxCount: 10 },
    { name: "music", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const slug = `${Date.now().toString(36)}${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const images = (req.files?.images || []).map(
        (file) => `/uploads/${file.filename}`,
      );
      const videos = (req.files?.videos || []).map(
        (file) => `/uploads/${file.filename}`,
      );
      const music = req.files?.music?.[0]
        ? `/uploads/${req.files.music[0].filename}`
        : "";

      const pageHtml = renderLovePage({
        senderName: req.body.senderName,
        partnerName: req.body.partnerName,
        relationship: req.body.relationship,
        relationshipDuration: req.body.relationshipDuration,
        firstEncounter: req.body.firstEncounter,
        loveMessage: req.body.loveMessage,
        surpriseTime: req.body.surpriseTime,
        loveStoryNotes: req.body.loveStoryNotes,
        pageColor: req.body.pageColor,
        packageId: req.body.packageId,
        coverImage: images[0],
        images,
        videos,
        music,
      });

      const pageDir = path.join(pagesDir, slug);
      fs.mkdirSync(pageDir, { recursive: true });
      fs.writeFileSync(path.join(pageDir, "index.html"), pageHtml, "utf8");

      await pool.query(
        `INSERT INTO submissions
        (slug, createdAt, senderName, partnerName, whatsapp, packageId, packageName, packagePrice, paymentReference, dataJson, imagesJson, videosJson, musicPath)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          slug,
          new Date().toISOString(),
          req.body.senderName,
          req.body.partnerName,
          req.body.whatsapp,
          req.body.packageId,
          req.body.packageName,
          req.body.packagePrice,
          req.body.paymentReference,
          JSON.stringify(req.body || {}),
          JSON.stringify(images),
          JSON.stringify(videos),
          music,
        ],
      );

      const baseUrl =
        process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

      res.json({
        message: "Love page created.",
        link: `${baseUrl}/love/${slug}`,
      });
    } catch (error) {
      console.error("Failed to create love page:", error);
      res.status(500).json({ message: "Failed to create love page." });
    }
  },
);

if (fs.existsSync(distDir)) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

const port = process.env.PORT || 3000;
initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
