import fs from "fs";
import crypto from "crypto";

/**
 * Imports a project file to host directory. Returns the new filename of the imported file.
 * @param path path to file to import. Must be direct.
 * @returns new filename of imported file
 */
export async function importFile(path: string): Promise<string> {
  //first check if the file exists
  if (!fs.existsSync(path)) {
    throw new Error("File does not exist");
  }

  //get the file extension
  const fileExtension = path.split(".").pop();

  //create a file name based on file contents
  const fileName: string = await new Promise((resolve) => {
    const filestream = fs.createReadStream(path);
    const hash = crypto.createHash("sha256");
    hash.setEncoding("hex");

    filestream.on("end", () => {
      hash.end();
      resolve(hash.read().slice(0, 30) + "." + fileExtension);
    });

    filestream.pipe(hash);
  });

  //copy the file to the host directory
  fs.copyFileSync(path, "./host/" + fileName);

  //return the new file name
  return fileName;
}
