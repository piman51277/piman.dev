import { IManifest, loadFileManifest } from "./manifest";

export const projects: IManifest[] = [];

import { existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import { join } from "path";
import { loadProject } from "./loader";

//empty out the host directory
const hostDir = join(__dirname, "../../host");
if (existsSync(hostDir)) {
  rmSync(hostDir, { recursive: true });
}
mkdirSync(hostDir, { recursive: true });

//create the projects directory, if it doesn't exist
const projectsDir = join(__dirname, "../../projects");
if (!existsSync(projectsDir)) {
  mkdirSync(projectsDir);
}

//start loading projects
const projectDirs = readdirSync(projectsDir, { withFileTypes: true });
for (const projectDir of projectDirs) {
  if (projectDir.isDirectory()) {
    const projectPath = join(projectsDir, projectDir.name);
    const manifestPath = join(projectsDir, projectDir.name, "manifest.json");
    if (existsSync(manifestPath)) {
      console.log(`Loading project at ${projectPath}`);
      try {
        const manifest = loadFileManifest(manifestPath);
        const project = loadProject(
          manifest,
          join(projectsDir, projectDir.name)
        );
        projects.push(project);
      } catch (e) {
        console.error(`Failed to load project at ${projectPath}: ${e}`);
      }
    }
  }
}
