const express = require("express");
require("dotenv").config();
const mysql = require("mysql");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { Storage } = require("@google-cloud/storage");
const projectId = process.env.PROJECT_ID;
const keyFilename = process.env.KEYFILENAME;
const bucketName = process.env.BUCKET_NAME;

const storage = new Storage({ projectId, keyFilename });
// Magic bytes (dosya türleri için baştaki baytlar)
const magicBytes = {
  "image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  "image/jpeg": [0xff, 0xd8, 0xff],
  "application/pdf": [0x25, 0x50, 0x44, 0x46], // PDF
  "application/msword": [0xd0, 0xcf, 0x11, 0xe0], // Word (DOC)
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    0x50, 0x4b, 0x03, 0x04,
  ], // Word (DOCX - ZIP format)
};

// Dosya türünü kontrol et
function detectFileType(fileBuffer) {
  for (let mimeType in magicBytes) {
    const magic = magicBytes[mimeType];
    let match = true;

    for (let i = 0; i < magic.length; i++) {
      if (fileBuffer[i] !== magic[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return mimeType;
    }
  }
  return "Unknown"; // Tanınmayan dosya türü
}

async function uploadFile(newFile, currentFile = "") {
  try {
    if (newFile === currentFile) {
      return currentFile;
    }

    // Base64'ten buffer'a dönüştür
    const base64Content = newFile.replace(/^data:.*;base64,/, ""); // Başlığı temizle
    const fileBuffer = Buffer.from(base64Content, 'base64');

    // Dosya türünü belirle
    const fileType = detectFileType(fileBuffer);

    // Eğer dosya türü geçerli değilse hata fırlat
    if (fileType === 'Unknown') {
      throw new Error("Desteklenmeyen dosya türü.");
    }

    const bucket = storage.bucket(bucketName);

    // Dosyanın uzantısını MIME türünden al
    const extension = getExtensionFromMimeType(fileType);
    if (!extension) {
      throw new Error("Desteklenmeyen dosya türü.");
    }

    const fileName = `${Date.now()}.${extension}`;

    // Dosyayı Google Cloud Storage'a kaydet
    const file = bucket.file(fileName);
    await file.save(fileBuffer);

    // Dosyanın MIME türünü ayarlamak için metadata ekleyelim
    await file.setMetadata({
      contentType: fileType,
    });

    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    throw error;
  }
}

// MIME türünden uzantıyı al
function getExtensionFromMimeType(mimeType) {
  const mimeToExtensionMap = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  };
  return mimeToExtensionMap[mimeType] || null;
}
async function deleteFile(fileUrl) {
  try {
    if (fileUrl.includes(bucketName)) {
      // Dosya adını URL'den çıkar
      const fileName = fileUrl.split(`${bucketName}/`)[1];

      // Dosyayı sil
      await storage.bucket(bucketName).file(fileName).delete();
    } else {
      console.log("Invalid file URL or bucket name not found in URL.");
    }
  } catch (error) {
    // Dosya bulunamazsa Google Cloud Storage '404' hatası döndürebilir
    if (error.code === 404) {
      console.warn(`File not found: ${fileUrl}`);
    } else {
      // Diğer hatalar için uygun bir yanıt veya log verebilirsin
      console.error("Error deleting file:", error);
    }
  }
}

async function convertBuffer(file) {
  try {
    if (file !== "") {
      // Base64 formatındaki dosyanın başındaki kısmı temizleyelim
      const base64Data = file.replace(/^data:(image|video)\/\w+;base64,/, "");

      // Base64 string'i Buffer'a dönüştürelim
      const fileBuffer = Buffer.from(base64Data, "base64");

      return fileBuffer;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error:", error);
    return { err: error };
  }
}

const options = {
  host: "localhost",
  user: "root",
  password: "",
  database: "db_name",
};

const connection = mysql.createConnection(options);

const app = express();

app.use(express.json({ limit: "64mb" }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "connect.sid",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      _expires: 600000 * 6 * 24,
    },
  })
);

app.use((req, res, next) => {
  console.log(req.method + " - " + req.url);
  next();
});

const PORT = process.env.PORT;

// Kullanıcı oturum kontrolü
const checkAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.clearCookie("connect.sid", { path: "/" });
    res.clearCookie("token", { path: "/" });
    return res.status(401).json({ error: "Token missing." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    next();
  } catch (err) {
    res.clearCookie("connect.sid", { path: "/" });
    res.clearCookie("token", { path: "/" });
    return res.status(401).json({ error: "Token is invalid or expired." });
  }
};

app.use("/api", checkAuth);

connection.connect((err) => {
  if (err) throw err;

  app.post("/login", (req, res) => {
    const { email, password } = req.body;

    connection.query(
      `SELECT * FROM users where email = ?`,
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error." });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found." });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          secret,
          { expiresIn: "1h" }
        );

        res.cookie("token", token, { maxAge: 3600000 }); // 1 saatlik token
        res.json({ user: user, token: token });
      }
    );
  });

  // Kullanıcı bilgilerini getirme
  app.get("/user", checkAuth, (req, res) => {
    try {
      const { id } = req.user;

      if (!id) {
        return res.status(400).json({ loggedIn: false, err: "Auth Error" });
      }

      const query = "SELECT id, email FROM users WHERE id = ?";

      connection.query(query, [id], (err, results) => {
        if (err) {
          console.error("Error fetching user data:", err);
          return res.status(500).json({ error: "Error fetching user data." });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ error: "No user found with the provided id." });
        }

        const user = results[0];
        res.json({ loggedIn: true, user });
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Server error." });
    }
  });

  app.get("/", (req, res) => {
    try {
      connection.query(`SELECT * FROM discover`, (err, results) => {
        if (err) {
          res.json({ err: err });
        } else {
          return res.json(results);
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Server error." });
    }
  });

  app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
  });
});
