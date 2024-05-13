import fs from "fs";

import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getUploadFolder());
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const getUploadFolder = () => {
  // Create a unique folder name using a timestamp
  const timestamp = Date.now();
  const uploadFolder = path.join("public/uploads", String(timestamp));

  // Create the folder if it doesn't exist
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  return uploadFolder;
};

//file filter
const fileFilter = async (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  // Define acceptable file types
  const acceptableTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (acceptableTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"));
  }
};

export const upload = multer({ storage, fileFilter: fileFilter });
