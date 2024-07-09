# Project Setup

## Prerequisites
1. Refactor the project so the following are true:
    - All JS is bundled into one file (use Webpack)
    - All CSS is bundled into one file (use Postcss, Webpack)
    - All images are optimized and in WEBP or PNG format
    - There is one main HTML file that imports the CSS and JS files from root


    At the end of this process, you should be able to create a directory like this (filenames can vary):
    ```
    root
    ┣ main.html
    ┣ bundle.css
    ┣ bundle.js
    ┗ other assets (subfolders allowed)
    ```
2. Create an icon for the project. This must be exactly 200x200px in WEBP or PNG format.


## manifest.json
This file describes your project and configures project loading. Create this file and put it in your project root.

> NOTE: All paths are relative to the project root

```json
{
  "meta": {
    "title": "Project Title",
    "description": "Project Description",
    "enabled": true,
    "hidden": false,
    "icon": "icon.png",
    "tech": [],
    "links": [],
    "hasDemo": true
  },
  "main": "main.html",
  "assets": [],
}
```

- `meta`:
    - `title`: The title of the project
    - `description`: A short description of the project
    - `enabled`: Whether to load the project
    - `hidden`: Whether the project is displayed in the project list
    - `icon`: path to the project icon
    - `tech`: Array of TechIcon names. Max 5 (truncate if more)
    - `links`: Array of IManifestLink. Max 4 (truncate if more)
    - `hasDemo`: Optional (default true). Whether the project has a demo. If true, the loader will insert a link to the main file.
- `main`: The path to the main HTML file
- `assets`: Array of IAsset (see below)

### TechIcon
String. Name of technology used in project. One of:
- ts
- webpack
- arduino
- figma
- inkscape
- js
- postcss
- cpp
- sass
- cuda
- vex
- py
- mongo
- go
- postman

See [manifest.ts](/src/projects/manifest.ts) for latest list.

> NOTE: The project loader will ignore any unknown tech rather than error, in order to support future icon additions.

### IManifestLink
```ts
{
  type: "github" | "external" | "file";
  url: string;
  alt: string;
}
```

- `type`: The type of link
    - `github`: Link to a GitHub repository
    - `external`: Link to another page
    - `file`: Link to a project asset (e.g. a PDF)
- `url`: The URL of the link (path if type `file`)
- `alt`: The alt text for the link

### IAsset

> Note: The project loader will automatically include most assets referenced by any HTML or CSS files. This is only nessesary if the project loader fails or if the asset is not referenced in the project files.

```ts
{
  src: string;
  preserveName?: boolean;
  replaces?: string;
}
```

- `src`: The path to the asset
- `preserveName`: Whether to keep the original filename (default: false)
- `replaces`: A string to replace with the final asset path. Useful when the project loader cannot find the original asset path through AST analysis.

## Importing the Project
1. Create a subdirectory under `projects/`. The directory name should be the project title in kebab-case. 
2. Place all project files in this directory.
3. Test if the project loads by attempting to start the server.
4. Test project functionality and appearance.