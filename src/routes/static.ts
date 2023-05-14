import { Router } from "express";

export const staticRoutes = Router();

staticRoutes.get("/", (req, res) => {
  res.render("home.njk");
});
