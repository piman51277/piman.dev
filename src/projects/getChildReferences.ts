import { existsSync, readFileSync } from "fs";

/**
 * Whether a file can be parsed by this module
 * @param {string} path The path to the file
 * @returns {boolean} Whether the file can be parsed
 */
export function canParseFile(path: string): boolean {
  return path.endsWith(".html") || path.endsWith(".css") || path.endsWith(".js");
}

/**
 * Parses a file and returns a list of all the child references
 * @param {string} path The path to the file
 * @returns {string[]} A list of all the child references
 */
export function getChildReferences(path: string): string[] {
  if (!existsSync(path)) {
    throw new Error(`File does not exist: ${path}`);
  }

  const contents = readFileSync(path, "utf8");

  if (path.endsWith(".html")) {
    return getChildReferencesHTML(contents);
  } else if (path.endsWith(".css")) {
    return getChildReferencesCSS(contents);
  }

  //generally we can only handle html and css, so if it's neither, don't bother
  else {
    return [];
  }
}

import { parse } from "node-html-parser";

const HTMLSearchTags = [
  "a",
  "link",
  "script",
  "img",
  "image",
  "iframe",
  "object",
  "embed",
  "source",
  "video",
  "audio",
  "track",
];

const HTMLSearchAttributes = ["href", "src", "data", "poster", "srcset"];

/**
 * Parses an HTML file and returns a list of all the child references
 * @param {string} html raw html
 * @returns {string[]} A list of all the child references
 */
function getChildReferencesHTML(html: string): string[] {
  const root = parse(html);
  const children = [];

  for (const tag of HTMLSearchTags) {
    const elements = root.querySelectorAll(tag);
    for (const element of elements) {
      for (const attr of HTMLSearchAttributes) {
        const value = element.getAttribute(attr);
        if (value) {

          //toss if the name starts with a #, this is a fragment identifier
          if (value.startsWith("#")) {
            continue;
          }

          children.push(value);
        }
      }
    }
  }

  return children;
}

/**
 * Parses a CSS file and returns a list of all the child references
 * @param {string} css raw css
 * @returns {string[]} A list of all the child references
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getChildReferencesCSS(css: string): string[] {
  //TODO: implement using a proper css parser
  return [];
}
