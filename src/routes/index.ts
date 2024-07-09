import express from "express";
import { app } from "../app";

// static content
app.use("/static", express.static("dist/client"));

// assets
app.use("/assets", express.static("app/assets"));

// project assets
app.use("/p", express.static("host"));

// For pages that need no templating or dynamic content
const staticRoutes: Record<string, string> = {
  "/": "home.njk",
  "/projects": "projects.njk",
};

for (const [route, view] of Object.entries(staticRoutes)) {
  app.get(route, (req, res) => {
    res.render(view);
  });
}
