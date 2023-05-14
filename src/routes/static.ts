import { projects } from "./../projects/projects";
import { Router } from "express";

export const staticRoutes = Router();

staticRoutes.get("/", (req, res) => {
  res.render("home.njk");
});

staticRoutes.get("/projects", (req, res) => {
  res.render("projects.njk", { projects });
});

staticRoutes.get("/misc", (req, res) => {
  res.render("misc.njk");
});
