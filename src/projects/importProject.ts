import fs from "fs";
import { Project, ProjectDescriptor } from "../types";
import { importFile } from "./importFile";
import { rewriteProjectMain } from "./rewriteProjectMain";
/**
 * Imports a project
 * @param name Name of project directory to import
 * @returns Project object
 */
export async function importProject(name: string): Promise<Project> {
  //first verify the directory is there under /projects/name
  if (!fs.existsSync("./projects/" + name)) {
    throw new Error("Project does not exist");
  }

  //then read the project.json file
  if (!fs.existsSync("./projects/" + name + "/project.json")) {
    throw new Error("Project does not have a project.json file");
  }

  const projectDescriptor: ProjectDescriptor = JSON.parse(
    fs.readFileSync("./projects/" + name + "/project.json", "utf-8")
  );

  const project = {} as Project;

  //set vars
  project.name = projectDescriptor.name;
  project.year = projectDescriptor.year;

  //init the rewrite map
  project.rewriteMap = new Map<string, string>();

  //start importing files
  project.previewimg = await importFile(
    "./projects/" + name + "/" + projectDescriptor.previewimg
  );
  project.rewriteMap.set(projectDescriptor.previewimg, project.previewimg);
  project.main = await importFile(
    "./projects/" + name + "/" + projectDescriptor.main
  );
  project.rewriteMap.set(projectDescriptor.main, project.main);
  project.src = [];
  for (const fileName of projectDescriptor.src) {
    const newFile = await importFile("./projects/" + name + "/" + fileName);
    project.src.push(newFile);
    project.rewriteMap.set(fileName, newFile);
  }
  project.assets = [];
  for (const fileName of projectDescriptor.assets) {
    const newFile = await importFile("./projects/" + name + "/" + fileName);
    project.assets.push(newFile);
    project.rewriteMap.set(fileName, newFile);
  }

  //fix the imports in the main file
  rewriteProjectMain(project.main, project.rewriteMap);

  return project;
}
