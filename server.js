const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

// 配置CORS
app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 根据文件类型选择不同的存储目录
    const dir = file.fieldname === "video" ? "temp/videos" : "temp/styles";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // 保持原始文件名，添加时间戳防止重名
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

app.use(express.json());

// 视频上传接口
app.post("/gs/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "没有上传文件",
    });
  }

  // 返回相对路径
  const relativePath = path.relative(process.cwd(), req.file.path);
  res.json({
    success: true,
    data: {
      videoPath: relativePath.replace(/\\/g, "/"), // 统一使用正斜杠
    },
  });
});

// 风格图片上传接口
app.post("/gs/upload-style", upload.single("style"), (req, res) => {
  const stylePath = req.file.path;
  res.json({
    success: true,
    data: {
      stylePath: stylePath,
    },
  });
});

// 视频帧提取接口
app.get("/gs/clip", (req, res) => {
  const videoPath = req.query.video_path;
  // 模拟处理延迟
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        imagesPath: `frames_${uuidv4()}`,
      },
    });
  }, 1000);
});

// 3D场景生成接口
app.get("/gs/generate", (req, res) => {
  const imagesPath = req.query.images_path;
  // 模拟处理延迟
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        scenePath: `scene_${uuidv4()}`,
      },
    });
  }, 2000);
});

// 风格迁移接口
app.get("/gs/stylized", (req, res) => {
  const scenePath = req.query.scene_path;
  const styleImagePath = req.query.style_image_path;
  // 模拟处理延迟
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        resultPath: `stylized_${uuidv4()}`,
      },
    });
  }, 1500);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
