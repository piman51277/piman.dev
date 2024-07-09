export enum TechIcon {
  TS = "ts",
  WEBPACK = "webpack",
  ARDUINO = "arduino",
  FIGMA = "figma",
  INKSCAPE = "inkscape",
  JS = "js",
  POSTCSS = "postcss",
  CPP = "cpp",
  SASS = "sass",
  CUDA = "cuda",
  VEX = "vex",
  PY = "py",
  MONGO = "mongo",
  GO = "go",
  POSTMAN = "postman",
}

export interface IManifestLink {
  type: "github" | "external" | "file";
  url: string;
  alt: string;
}

export interface IManifestMeta {
  title: string;
  description: string;
  enabled: boolean;
  hidden: boolean;
  icon: string;
  tech: TechIcon[];
  links: IManifestLink[];
  hasDemo?: boolean;
}

export interface IAsset {
  src: string;
  preserveName?: boolean;
  replaces?: string;
}

export interface IManifestFile {
  meta: IManifestMeta;
  main: string;
  assets: IAsset[];
}

export interface IManifest {
  meta: IManifestMeta;
  main: string;
}

import { existsSync, readFileSync } from "fs";
import Joi from "joi";

const ManifestFileSchema = Joi.object({
  meta: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    enabled: Joi.boolean().required(),
    hidden: Joi.boolean().required(),
    icon: Joi.string().required(),
    tech: Joi.array().max(5).items(Joi.string()).required(),
    links: Joi.array()
      .max(4)
      .items(
        Joi.object({
          type: Joi.string().valid("github", "external", "file").required(),
          url: Joi.string().required(),
          alt: Joi.string().required(),
        })
      ),
    hasDemo: Joi.boolean().default(true),
  }),
  main: Joi.string().required(),
  assets: Joi.array().items(
    Joi.object({
      src: Joi.string().required(),
      preserveName: Joi.boolean(),
      replaces: Joi.string(),
    })
  ),
});

/**
 * Load a manifest file from a given path
 * @param {string} path The path to the manifest file
 * @returns {IManifestFile} The manifest file
 */
export function loadFileManifest(path: string): IManifestFile {
  //check if the file even exists
  if (!existsSync(path)) {
    throw new Error("Path does not exist");
  }

  //load the file
  let manifestStr: string;
  try {
    manifestStr = readFileSync(path, "utf-8");
  } catch (err) {
    throw new Error("Could not read file");
  }

  //attempt to parse the file
  let manifest: IManifestFile;
  try {
    manifest = JSON.parse(manifestStr);
  } catch (err) {
    throw new Error("Could not parse file");
  }

  //validate the file
  const { error } = ManifestFileSchema.validate(manifest);
  if (error) {
    throw new Error(
      `Invalid manifest file. Errors:\n${error.details
        .map((e) => e.message)
        .join("\n")}`
    );
  }

  return manifest;
}
