import { existsSync, readFileSync, writeFileSync } from "fs";
import { basename, join } from "path";
import { IManifest, IManifestFile } from "./manifest";
import { canParseFile, getChildReferences } from "./getChildReferences";
import { createHash } from "crypto";

interface IAssetUpdate {
  newName?: string; //new name of the asset
  preserveName: boolean; //whether to preserve the original name of the asset
  replaceIn: string[]; //files that reference this asset
  replaceStr: string[]; //strings to replace with new references
}

const hostDir = join(__dirname, "../../host");

/**
 * Loads a project from a manifest file
 * @param {IManifestFile} manifest The manifest file to load from
 * @param {string} root The root path of the project
 * @returns {IManifest} Hydrated manifest
 */
export function loadProject(manifest: IManifestFile, root: string): IManifest {
  //skip loading if the project is disabled
  if (!manifest.meta.enabled) {
    console.log(`Skipping disabled project: ${manifest.meta.title}`);
    return {
      meta: manifest.meta,
      main: "",
    };
  }

  /** Discovery: Find all assets */

  //parsing queue
  const toParse = [];
  //stores metadata about assets that need to be updated & cached
  const assets: Record<string, IAssetUpdate> = {};
  //order in which to load assets
  const assetOrder: string[] = [];

  //add main html file
  toParse.push(manifest.main);
  assets[manifest.main] = {
    preserveName: false,
    replaceStr: [manifest.main],
    replaceIn: [],
  };
  assetOrder.push(manifest.main);

  //parse all files
  while (toParse.length > 0) {
    const file: string = join(root, toParse.pop()!);
    console.log(`Parsing ${file}`);
    let refs = getChildReferences(file);

    //remove any external web references
    refs = refs.filter((ref) => !ref.startsWith("http"));

    //remove any internal web references
    refs = refs.filter((ref) => !/^\/.+\.[a-zA-Z]+$/g.test(ref));

    const uniqueRefs = [...new Set(refs)];

    //update asset metadata
    for (const ref of uniqueRefs) {
      if (assets[ref]) {
        assets[ref].replaceIn.push(file);
      } else {
        assets[ref] = {
          preserveName: false,
          replaceStr: [ref],
          replaceIn: [file],
        };
        assetOrder.push(ref);
        if (canParseFile(ref)) {
          toParse.push(join(root, ref));
        }
      }
    }
  }

  //add all declared assets
  for (const asset of manifest.assets) {
    toParse.push(asset.src);
    assets[asset.src] = {
      preserveName: asset.preserveName || false,
      replaceStr: asset.replaces ? [asset.replaces, asset.src] : [asset.src],
      replaceIn: [],
    };
    assetOrder.push(asset.src);
  }

  //add icon
  toParse.push(manifest.meta.icon);
  assets[manifest.meta.icon] = {
    preserveName: false,
    replaceStr: [manifest.meta.icon],
    replaceIn: [],
  };
  assetOrder.push(manifest.meta.icon);

  /** Load Assets */

  //flip the order of assetOrder, so that we load the dependencies first
  assetOrder.reverse();

  for (const asset of assetOrder) {
    const newName = loadAsset(
      join(root, asset),
      assets,
      assets[asset].preserveName
    );
    assets[asset].newName = newName;
  }

  /** Update Manifest */
  const manifestCopy = structuredClone(manifest);

  //look for file type links
  for (const link of manifestCopy.meta.links) {
    if (link.type === "file") {
      if (assets[link.url].newName == undefined) {
        throw new Error("Unresolved asset reference!");
      }
      link.url = assets[link.url].newName as string;
    }
  }

  //get the file name of the main file
  const mainName = (assets[manifest.main].newName as string).replace("/p/", "");
  const mainPath = join(hostDir, mainName);

  return {
    meta: manifestCopy.meta,
    main: mainPath,
  };
}

/**
 * Loads asset into /host/ folder
 * @param {string} path The path to the asset
 * @param {Record<string, IAssetUpdate>} transforms Asset metadata
 * @param {boolean} preserveName Whether to preserve the original name of the asset
 * @returns {string} The new web-relative path to the asset
 */
function loadAsset(
  path: string,
  transforms: Record<string, IAssetUpdate>,
  preserveName = false
): string {
  //check if the file even exists
  if (!existsSync(path)) {
    throw new Error(`Asset not found: ${path}`);
  }

  const fileName = basename(path);
  const ext = fileName.split(".").pop();

  //load the file
  let data: Buffer | string;

  //if we could parse it, it needs to be transformed
  if (canParseFile(path)) {
    data = readFileSync(path, "utf-8");

    //apply transforms
    for (const transform of Object.values(transforms)) {
      if (transform.replaceIn.includes(path)) {
        for (const replaceStr of transform.replaceStr) {
          if (transform.newName) {
            data = data.replace(replaceStr, transform.newName);
          } else {
            throw new Error("Circular reference detected!");
          }
        }
      }
    }
  } else {
    data = readFileSync(path);
  }

  //hash the file
  let hash = createHash("md5").update(data).digest("hex").slice(0, 12);
  let newName = preserveName ? fileName : `${hash}.${ext}`;

  //make sure the name is unique
  while (existsSync(join(hostDir, newName))) {
    console.log(`Detected hash collision`);

    //hash collision, try again
    hash = createHash("md5").update(hash).digest("hex").slice(0, 12);
    if (preserveName) {
      newName = `${hash}-${fileName}`;
    } else {
      newName = `${hash}.${ext}`;
    }
  }

  //copy file to host folder
  const newPath = `/p/${newName}`;
  writeFileSync(join(hostDir, newName), data);

  console.log(`Loading asset ${path} at ${newPath}`);

  return newPath;
}
