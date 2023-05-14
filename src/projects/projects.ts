import { getProjects } from "./getProjects";
import { Project } from "../types";

export let projects: Project[] = [];
export let isProjectsLoaded = false;

getProjects().then((gotProjects) => {
  projects = gotProjects;
  isProjectsLoaded = true;
});
