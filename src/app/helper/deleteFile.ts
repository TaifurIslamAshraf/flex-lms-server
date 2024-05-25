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

export const deleteMultipleFile = async (filePaths: string[]) => {
  if (filePaths.length > 0) {
    const unlinkPromises: Promise<void>[] = [];

    filePaths.map((file) => {
      const unlinkPromise = new Promise<void>((resolve) => {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          file.replace(/\\/g, "/")
        );
        fs.unlink(filePath, (err) => {
          if (err && err.code === "ENOENT") {
            logger.error(`File not found ${file}`);
          } else if (err) {
            logger.error(err);
          } else {
            resolve();
          }
        });
      });

      unlinkPromises.push(unlinkPromise);
    });

    await Promise.all(unlinkPromises);
  }
};
