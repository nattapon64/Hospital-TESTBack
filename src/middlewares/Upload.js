const util = require("util");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const maxSize = 2 * 1024 * 1024;

// กำหนดเส้นทางของโฟลเดอร์
const uploadFolderPath = path.join(__dirname, "ExcelFile");

// ตรวจสอบและสร้างโฟลเดอร์ถ้ายังไม่มีอยู่
if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, { recursive: true });
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolderPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

// create the exported middleware object
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
