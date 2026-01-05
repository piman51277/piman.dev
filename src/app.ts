import dotenv from "dotenv";
dotenv.config();

import express from "express";
import https from "https";
import nunjucks from "nunjucks";

import { readFileSync } from "fs";

export const app = express();

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
  noCache: process.env.NODE_ENV === "development",
});



if (process.env.NODE_ENV === "production" && process.env.KEY_PATH) {
  //https server for production
  const httpsOptions = {
    key: readFileSync(`${process.env.KEY_PATH}/privkey.pem`),
    cert: readFileSync(`${process.env.KEY_PATH}/cert.pem`),
    ca: readFileSync(`${process.env.KEY_PATH}/chain.pem`),
  };
  https
    .createServer(httpsOptions, app)
    .listen(parseInt(process.env.PORT!), () => {
      console.log(`HTTPS server running on port ${process.env.PORT}`);
    });
} else {
  //default to http server
  app.listen(parseInt(process.env.PORT!), () => {
    console.log(`HTTP server running on port ${process.env.PORT}`);
  });
}