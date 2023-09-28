import { getProjects } from "./getProjects";
import { Project } from "../types";

export let projects: Project[] = [];
export let isProjectsLoaded = false;

getProjects().then((gotProjects) => {
  //sort by year, and then by name
  gotProjects.sort((a, b) => {
    if (a.year > b.year) {
      return -1;
    } else if (a.year < b.year) {
      return 1;
    } else {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    }
  });

  projects = gotProjects;
  isProjectsLoaded = true;
});
