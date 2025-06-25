import formidable from "formidable";
import { IncomingMessage } from "http";

export function parseImageForm(req: IncomingMessage): Promise<{ fields: any; files: any }> {
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowEmptyFiles: false,
    multiples: false,
    filter: ({ mimetype }) => {
      return typeof mimetype === "string" && mimetype.startsWith("image/");
    },
  });
  console.log("into the form ")
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
