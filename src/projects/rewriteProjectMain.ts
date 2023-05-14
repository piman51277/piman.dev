import fs from "fs";
/**
 * Rewrites the main file of a project. Used to rewrite imports to point to the host directory.
 * @param page filename of main file in host directory
 * @param replacements map of old filenames to new filenames
 */
export function rewriteProjectMain(
  page: string,
  replacements: Map<string, string>
): void {
  //read the file
  let file = fs.readFileSync("./host/" + page, "utf-8");

  //replace the imports
  for (const [oldFile, newFile] of replacements) {
    file = file.replace(oldFile, newFile);
  }

  //write the file
  fs.writeFileSync("./host/" + page, file);
}
