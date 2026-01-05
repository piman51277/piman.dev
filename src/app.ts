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

const httpsOptions = {
  key: readFileSync(`${process.env.KEY_PATH}/key.pem`),
  cert: readFileSync(`${process.env.KEY_PATH}/cert.pem`),
  ca: readFileSync(`${process.env.KEY_PATH}/chain.pem`),
};

if (process.env.NODE_ENV === "development") {
  //http server for development
  app.listen(parseInt(process.env.PORT!), () => {
    console.log(`HTTP server running on port ${process.env.PORT}`);
  });
} else {
  //https server for production
  https
    .createServer(httpsOptions, app)
    .listen(parseInt(process.env.PORT!), () => {
      console.log(`HTTPS server running on port ${process.env.PORT}`);
    });
}