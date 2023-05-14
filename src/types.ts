export type ProjectDescriptor = {
  name: string;
  year: string;
  previewimg: string;
  main: string;
  src: string[];
  assets: string[];
};

export type Project = {
  name: string;
  year: string;
  previewimg: string;
  main: string;
  src: string[];
  assets: string[];
  rewriteMap: Map<string, string>;
};
