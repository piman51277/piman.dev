import dotenv from "dotenv";
dotenv.config();

import express from "express";
import nunjucks from "nunjucks";

export const app = express();

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
});

app.listen(process.env.PORT, () => {
  console.log(`Server is live on port ${process.env.PORT}`);
});
