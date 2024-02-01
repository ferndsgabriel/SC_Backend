import crypto from "crypto";
import multer from "multer";

export default {
  upload() {
    return {
      storage: multer.memoryStorage(), // Use MemoryStorage
      fileFilter: (request, file, callback) => {
        // Define your file filter logic here if needed
        // For example, you can check the file type or size
        callback(null, true); // Accept all files for this example
      },
      limits: {
        // Define any limits for file size or field count if needed
      },
      filename: (request, file, callback) => {
        const fileHash = crypto.randomBytes(16).toString("hex");
        const filename = `${fileHash}-${file.originalname}`;
        callback(null, filename);
      },
    };
  },
};
