import express from "express";
import { app } from "../app";

// static content
app.use("/static", express.static("dist/client"));

// For pages that need no templating or dynamic content
const staticRoutes: Record<string, string> = {
  "/": "home.html",
};

for (const [route, view] of Object.entries(staticRoutes)) {
  app.get(route, (req, res) => {
    res.render(view);
  });
}
