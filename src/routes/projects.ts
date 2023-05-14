import fs from "fs";
import { projects, isProjectsLoaded } from "./../projects/projects";
import { Router } from "express";
import path from "path";

export const projectRoutes = Router();

//wait for projects to load
const interval = setInterval(() => {
  if (isProjectsLoaded) {
    clearInterval(interval);
    for (const project of projects) {
      const content = fs.readFileSync(
        "./host/" + encodeURI(project.main),
        "utf-8"
      );
      projectRoutes.get(`/${project.name}`, (req, res) => {
        res.render("project.njk", {
          project,
          content,
        });
      });
    }
  }
}, 500);
