import fs from "fs";
import path from "path";
import { Project } from "../types";
import { importProject } from "./importProject";

/**
 * Gets all projects
 */
export async function getProjects(): Promise<Project[]> {
  //read the projects folder
  const projectsFolder = await fs.promises.opendir(
    path.join(__dirname, "..", "..", "projects")
  );

  //create an array of promises
  const promises: Promise<Project>[] = [];

  //loop through the projects folder
  for await (const project of projectsFolder) {
    promises.push(importProject(project.name));
  }

  //return the array of promises
  return Promise.all(promises);
}
