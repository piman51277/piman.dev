const path = require("path");
const fs = require("fs");
require("dotenv").config();

//read contents of src/client/pages, each file is a page
const pages = fs.readdirSync(path.resolve(__dirname, "app", "js", "pages"));
const entryNames = pages.filter((page) => page.endsWith(".ts"));
const entries = {};
entryNames.forEach((entry) => {
  const name = entry.split(".")[0];
  entries[name] = path.resolve(__dirname, "app", "js", "pages", entry);
});

//set the environment
const env = process.env.NODE_ENV || "production";

module.exports = {
  entry: entries,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "tsclient.json"),
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist", "js"),
  },
  mode: env,
  devtool: env === "development" ? "source-map" : false,
};
