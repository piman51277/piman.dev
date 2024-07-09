export enum TechIcon {
  JS = "js",
  TS = "ts",
  WEBPACK = "webpack",
  FIGMA = "figma",
  INKSCAPE = "inkscape",
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
