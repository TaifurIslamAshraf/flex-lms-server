import fs from "fs";
import path from "path";
import { logger } from "../utilities/logger";

export const deleteFile = async (filePath: string) => {
  if (filePath) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        filePath.replace(/\\/g, "/")
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            logger.error("File not found");
          } else {
            logger.error(`Error Deleting file: ${filePath}`, err);
          }
        }
      });
      resolve({});
    });
  }
};
