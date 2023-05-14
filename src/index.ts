//start loading projects
import "./projects/projects";

//dotenv
import dotenv from "dotenv";
dotenv.config();

//setup express
import express from "express";

const app = express();

//setup template engine
import nunjucks from "nunjucks";
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

//add static assets
const oneWeek = 604800000;
app.use("/assets", express.static("assets", { maxAge: oneWeek }));
app.use("/host", express.static("host", { maxAge: oneWeek }));

//add routes

//static
import { staticRoutes } from "./routes/static";
app.use("/", staticRoutes);

//https
import https from "https";
import fs from "fs";
const path = process.env.KEY_PATH || "./cert";

const options = {
  key: fs.readFileSync(path + "/privkey.pem"),
  cert: fs.readFileSync(path + "/cert.pem"),
  ca: fs.readFileSync(path + "/chain.pem"),
};

https.createServer(options, app).listen(process.env.HTTPS_PORT || 443);

//http
import http from "http";

http.createServer(app).listen(process.env.HTTP_PORT || 80);
