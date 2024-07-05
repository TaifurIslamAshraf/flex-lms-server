/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs/promises";
import path from "path";
import { logger } from "../utilities/logger";

export const deleteFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
    logger.info(`Successfully deleted file: ${filePath}`);
  } catch (error) {
    logger.error(`Error deleting file ${filePath}:`, error);
  }
};

export const deleteMultipleFiles = async (
  filePaths: string[]
): Promise<void> => {
  if (filePaths.length === 0) {
    return;
  }

  const deletePromises = filePaths.map(async (file) => {
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      file.replace(/\\/g, "/")
    );

    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        logger.error(`File not found: ${file}`);
      } else {
        logger.error(`Error deleting file ${file}:`, error);
      }
    }
  });

  await Promise.all(deletePromises);
};
